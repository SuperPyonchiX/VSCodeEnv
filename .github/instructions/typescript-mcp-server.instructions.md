---
description: 'TypeScript SDKを使用したModel Context Protocol (MCP) サーバー開発のための包括的なガイドライン'
applyTo: '**/*.ts, **/*.js, **/package.json'
---

# TypeScript MCP Server開発

## 概要

Model Context Protocol (MCP) は、LLMアプリケーションがツール、リソース、プロンプトを通じて外部システムと対話するための標準プロトコルです。このガイドは、TypeScript SDKを使用した本番環境対応のMCPサーバー開発のベストプラクティスを提供します。

## アーキテクチャ原則

- **単一責任の原則**: 各MCPサーバーは特定のドメイン（データアクセス、外部API、ファイル操作など）のみを担当
- **厳格なコントラクト**: Zodによる明示的なバージョン管理スキーマで入出力を厳密に検証
- **追加的な変更のみ**: ツール/リソースの非推奨ポリシーとバージョン管理（破壊的変更を避ける）
- **デフォルトでステートレス**: セッション状態は必要な場合のみ使用し、明示的なセッション管理を実装
- **セキュリティバイデザイン**: 認証、認可、監査ログを設計段階から組み込む
- **制御された自律性**: 副作用を持つツールには承認またはエスカレーションフローを必須とする

## 指示事項

### 基本セットアップ
- **@modelcontextprotocol/sdk** npmパッケージを使用: `npm install @modelcontextprotocol/sdk`
- 特定のパスからインポート: `@modelcontextprotocol/sdk/server/mcp.js`, `@modelcontextprotocol/sdk/server/stdio.js` など
- 自動プロトコル処理を伴う高レベルサーバー実装には `McpServer` クラスを使用
- 手動リクエストハンドラーによる低レベル制御には `Server` クラスを使用
- 入出力スキーマ検証には **Zod v3.25+** または **v4** を使用: `npm install zod@3`
- より良いUI表示のため、tools、resources、promptsには必ず `title` フィールドを提供

### ツール・リソース・プロンプト登録
- `registerTool()`、`registerResource()`、`registerPrompt()` メソッドを使用（古いAPIよりも推奨）
- Zodを使用してスキーマを定義: `{ inputSchema: { param: z.string() }, outputSchema: { result: z.string() } }`
- toolsからは `content`（表示用）と `structuredContent`（構造化データ用）の両方を返す
- URIパラメータを持つ動的リソースには `ResourceTemplate` を使用: `new ResourceTemplate('resource://{param}', { list: undefined })`
- `@modelcontextprotocol/sdk/server/completable.js` の `completable()` ラッパーを使用して、UX向上のための補完をサポート

### トランスポート設定
- HTTPサーバーの場合、Expressなどのフレームワークとともに `StreamableHTTPServerTransport` を使用
- ローカル統合の場合、stdio通信には `StdioServerTransport` を使用
- リクエストIDの衝突を防ぐため、リクエストごとに新しいトランスポートインスタンスを作成（ステートレスモード）
- ステートフルサーバーには `sessionIdGenerator` によるセッション管理を使用
- ローカルサーバーのDNSリバインディング保護を有効化: `enableDnsRebindingProtection: true`
- ブラウザベースのクライアント向けにCORSヘッダーを設定し、`Mcp-Session-Id` を公開

### 高度な機能
- クライアントからLLM補完を要求するには、`server.server.createMessage()` によるサンプリングを実装
- ツール実行中に追加のユーザー入力を要求するには、`server.server.elicitInput()` を使用
- 一括更新の通知デバウンスを有効化: `debouncedNotificationMethods: ['notifications/tools/list_changed']`
- 動的更新: 登録されたアイテムで `.enable()`、`.disable()`、`.update()`、`.remove()` を呼び出して `listChanged` 通知を発行
- UI表示名には `@modelcontextprotocol/sdk/shared/metadataUtils.js` の `getDisplayName()` を使用
- MCP Inspectorでサーバーをテスト: `npx @modelcontextprotocol/inspector`

## ベストプラクティス

### コード品質
- ツール実装は単一責任に集中させる
- LLMが理解しやすい明確で説明的なタイトルと説明を提供
- すべてのパラメータと戻り値に適切なTypeScript型を使用
- すべての非同期操作にasync/awaitを使用
- 処理前に入力パラメータを検証
- stdout/stderrを汚さないよう、デバッグには構造化ログを使用
- ツールの機能と制限を明確に文書化
- 互換性を確保するため、複数のクライアントでテスト

### エラー処理
- try-catchブロックによる包括的なエラー処理を実装
- エラー状態の場合、ツール結果で `isError: true` を返す
- 構造化されたエラー情報（エラーコード、メッセージ、詳細）を提供
- エラーログには十分なコンテキスト情報を含める

### リソース管理
- データベース接続を閉じ、リソースを適切にクリーンアップ
- トランスポートクローズイベント時の適切なリソースクリーンアップを実装
- 設定（ポート、APIキーなど）には環境変数を使用

### セキュリティ
- ファイルシステムやネットワークアクセスを公開する際のセキュリティ影響を考慮
- ゼロトラスト境界: すべてのリクエストを検証されるまで信頼しない
- 環境変数でシークレットを管理（ハードコーディング禁止）
- 高影響操作には人間の承認（human-in-the-loop）フローを検討
- 監査ログでユーザー、セッション、タイムスタンプを記録

## 一般的なパターン

### 基本的なサーバー設定（HTTP）
```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';

// サーバーインスタンスの作成
const server = new McpServer({
    name: 'my-server',
    version: '1.0.0'
}, {
    // 通知デバウンシングの設定（オプション）
    debouncedNotificationMethods: ['notifications/tools/list_changed']
});

const app = express();
app.use(express.json());

// CORSの設定（ブラウザクライアント向け）
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Mcp-Session-Id');
    res.header('Access-Control-Expose-Headers', 'Mcp-Session-Id');
    next();
});

app.post('/mcp', async (req, res) => {
    // リクエストごとに新しいトランスポートを作成（ステートレス）
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,  // ステートレスモード
        enableJsonResponse: true,
        enableDnsRebindingProtection: true  // ローカルサーバー用
    });
    
    // クリーンアップの設定
    res.on('close', () => transport.close());
    
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`MCPサーバーがポート${PORT}で起動しました`);
});
```

### 基本的なサーバー設定（stdio）
```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new McpServer({
    name: 'my-server',
    version: '1.0.0'
});

// ツール、リソース、プロンプトの登録
// ... register tools, resources, prompts ...

// stdioトランスポートで起動
const transport = new StdioServerTransport();
await server.connect(transport);

// 構造化ログ（stderrを使用してstdoutを汚さない）
console.error('MCPサーバーが起動しました');
```

### シンプルなツール
```typescript
import { z } from 'zod';

server.registerTool(
    'calculate',
    {
        title: 'Calculator',  // LLM向けの表示名
        description: '基本的な算術計算を実行します。加算、減算、乗算、除算をサポート。',
        inputSchema: { 
            a: z.number().describe('最初の数値'), 
            b: z.number().describe('二番目の数値'), 
            op: z.enum(['+', '-', '*', '/']).describe('演算子') 
        },
        outputSchema: { result: z.number().describe('計算結果') }
    },
    async ({ a, b, op }) => {
        // 入力検証（ゼロ除算チェック）
        if (op === '/' && b === 0) {
            return {
                content: [{ type: 'text', text: 'エラー: ゼロによる除算はできません' }],
                isError: true
            };
        }
        
        // 明確なswitch文で演算を実行
        let result: number;
        switch (op) {
            case '+':
                result = a + b;
                break;
            case '-':
                result = a - b;
                break;
            case '*':
                result = a * b;
                break;
            case '/':
                result = a / b;
                break;
        }
        const output = { result };
        
        // 表示用コンテンツと構造化データの両方を返す
        return {
            content: [{ type: 'text', text: JSON.stringify(output) }],
            structuredContent: output
        };
    }
);
```

### 動的リソース
```typescript
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';

server.registerResource(
    'user',
    new ResourceTemplate('users://{userId}', { list: undefined }),
    {
        title: 'User Profile',
        description: 'ユーザープロファイルデータを取得します。ユーザーIDを指定してください。'
    },
    async (uri, { userId }) => {
        // 入力検証
        if (!userId || typeof userId !== 'string') {
            throw new Error('有効なユーザーIDが必要です');
        }
        
        // 実際のデータ取得ロジック（実装に応じて置き換え）
        // 例: const userData = await database.getUser(userId);
        const userData = { id: userId, name: 'Example User' };
        
        return {
            contents: [{
                uri: uri.href,
                mimeType: 'application/json',
                text: JSON.stringify(userData)
            }]
        };
    }
);
```

### サンプリングを使用したツール
```typescript
server.registerTool(
    'summarize',
    {
        title: 'Text Summarizer',
        description: 'LLMを使用してテキストを要約します。長いテキストを簡潔な要約に変換。',
        inputSchema: { 
            text: z.string().describe('要約対象のテキスト'),
            maxLength: z.number().optional().describe('要約の最大文字数')
        },
        outputSchema: { summary: z.string().describe('生成された要約') }
    },
    async ({ text, maxLength = 500 }) => {
        try {
            // LLMサンプリングを使用
            const response = await server.server.createMessage({
                messages: [{
                    role: 'user',
                    content: { type: 'text', text: `以下のテキストを${maxLength}文字以内で要約してください:\n\n${text}` }
                }],
                maxTokens: Math.ceil(maxLength / 2)  // トークン数の目安
            });
            
            const summary = response.content.type === 'text' ? 
                response.content.text : '要約を生成できませんでした';
            const output = { summary };
            
            return {
                content: [{ type: 'text', text: JSON.stringify(output) }],
                structuredContent: output
            };
        } catch (error) {
            const err = error as Error;
            return {
                content: [{ type: 'text', text: `要約エラー: ${err.message}` }],
                isError: true
            };
        }
    }
);
```

### 補完機能を持つプロンプト
```typescript
import { completable } from '@modelcontextprotocol/sdk/server/completable.js';

server.registerPrompt(
    'review',
    {
        title: 'Code Review',
        description: '指定されたプログラミング言語でコードをレビューします。構文、パフォーマンス、セキュリティの観点から分析。',
        argsSchema: {
            language: completable(
                z.string().describe('プログラミング言語'), 
                value => 
                    ['typescript', 'python', 'javascript', 'java', 'go', 'rust', 'csharp']
                        .filter(l => l.startsWith(value.toLowerCase()))
            ),
            code: z.string().describe('レビュー対象のコード'),
            focus: z.enum(['security', 'performance', 'readability', 'all'])
                .optional()
                .describe('レビューの焦点')
        }
    },
    ({ language, code, focus = 'all' }) => ({
        messages: [{
            role: 'user',
            content: {
                type: 'text',
                text: `以下の${language}コードを${focus === 'all' ? '総合的に' : focus + 'の観点で'}レビューしてください:\n\n\`\`\`${language}\n${code}\n\`\`\``
            }
        }]
    })
);
```

### 包括的なエラー処理
```typescript
// カスタムエラー型の定義
interface ToolError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}

server.registerTool(
    'risky-operation',
    {
        title: 'Risky Operation',
        description: '外部サービスに接続する操作。失敗する可能性があります。',
        inputSchema: { 
            input: z.string().min(1).describe('処理対象の入力'),
            timeout: z.number().optional().describe('タイムアウト秒数')
        },
        outputSchema: { result: z.string().describe('処理結果') }
    },
    async ({ input, timeout = 30 }) => {
        try {
            // 入力検証
            if (!input.trim()) {
                const error: ToolError = {
                    code: 'INVALID_INPUT',
                    message: '入力が空です',
                    details: { providedInput: input }
                };
                return {
                    content: [{ type: 'text', text: JSON.stringify(error) }],
                    isError: true
                };
            }
            
            // 操作実行（タイムアウト付き）
            // TODO: performRiskyOperationを実際のビジネスロジックに置き換えてください
            // 例:
            // async function performRiskyOperation(input: string): Promise<string> {
            //     return await externalApi.process(input);
            // }
            
            // 実装例: 外部サービスへのAPI呼び出し
            async function performRiskyOperation(data: string): Promise<string> {
                // 実際の実装では、ここに外部APIやデータベースへの呼び出しを記述
                // 例: return await fetch('https://api.example.com/process', { method: 'POST', body: data });
                return `処理完了: ${data}`;
            }
            
            const result = await Promise.race([
                performRiskyOperation(input),
                new Promise<never>((_, reject) => 
                    setTimeout(() => reject(new Error('操作がタイムアウトしました')), timeout * 1000)
                )
            ]);
            
            const output = { result };
            return {
                content: [{ type: 'text', text: JSON.stringify(output) }],
                structuredContent: output
            };
        } catch (err: unknown) {
            const error = err as Error;
            
            // 構造化されたエラー情報
            const toolError: ToolError = {
                code: 'OPERATION_FAILED',
                message: error.message,
                details: {
                    name: error.name,
                    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
                }
            };
            
            // エラーログ（監査用）
            console.error('ツール実行エラー:', {
                tool: 'risky-operation',
                input,
                error: toolError,
                timestamp: new Date().toISOString()
            });
            
            return {
                content: [{ type: 'text', text: `エラー: ${error.message}` }],
                structuredContent: toolError,
                isError: true
            };
        }
    }
);
```

### 承認フロー付きの高影響操作
```typescript
server.registerTool(
    'delete-data',
    {
        title: 'Delete Data',
        description: 'データを削除します。この操作は元に戻せません。',
        inputSchema: { 
            id: z.string().describe('削除対象のID'),
            confirm: z.boolean().optional().describe('削除を確認')
        },
        outputSchema: { deleted: z.boolean(), id: z.string() }
    },
    async ({ id, confirm }) => {
        // 確認がない場合、ユーザー入力を要求
        if (!confirm) {
            const elicitResult = await server.server.elicitInput({
                message: `ID "${id}" のデータを本当に削除しますか？この操作は元に戻せません。`,
                schema: {
                    type: 'object',
                    properties: {
                        confirmed: {
                            type: 'boolean',
                            description: '削除を確認する'
                        }
                    },
                    required: ['confirmed']
                }
            });
            
            if (elicitResult.action !== 'accept' || !elicitResult.content?.confirmed) {
                return {
                    content: [{ type: 'text', text: '削除がキャンセルされました' }],
                    structuredContent: { deleted: false, id }
                };
            }
        }
        
        // 実際の削除処理（実装例）
        // 実際のプロジェクトでは、以下のようにデータベース操作を実装
        // await database.delete(id);
        
        // この例では削除成功を想定
        
        // 監査ログ
        console.error('データ削除:', {
            id,
            timestamp: new Date().toISOString(),
            action: 'DELETE'
        });
        
        return {
            content: [{ type: 'text', text: `ID "${id}" のデータを削除しました` }],
            structuredContent: { deleted: true, id }
        };
    }
);
```

### 動的ツール更新
```typescript
// ツールの登録
const toolRegistration = server.registerTool(
    'feature-tool',
    {
        title: 'Feature Tool',
        description: '機能フラグに基づいて動的に有効/無効になるツール',
        inputSchema: { input: z.string() },
        outputSchema: { result: z.string() }
    },
    async ({ input }) => {
        return {
            content: [{ type: 'text', text: `処理結果: ${input}` }],
            structuredContent: { result: input }
        };
    }
);

// 条件に基づいてツールを無効化
// 例: 環境変数や設定ファイルから機能フラグを読み取る
const featureEnabled = process.env.FEATURE_TOOL_ENABLED === 'true';
if (!featureEnabled) {
    toolRegistration.disable();
}

// 後で有効化する場合
function enableFeatureTool(): void {
    toolRegistration.enable();
}

// ツールの更新（説明やスキーマの変更）
function updateToolDescription(newDescription: string): void {
    toolRegistration.update({
        description: newDescription
    });
}

// ツールの削除
function removeFeatureTool(): void {
    toolRegistration.remove();
}
```

## セキュリティ

### 認証・認可
```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

// JWT認証ミドルウェア
const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: '認証が必要です' });
    }
    
    const token = authHeader.substring(7);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        (req as any).user = decoded;
        next();
    } catch {
        return res.status(403).json({ error: '無効なトークンです' });
    }
};

// 認証が必要なエンドポイント
app.post('/mcp', authMiddleware, async (req, res) => {
    const user = (req as any).user;
    
    // 監査ログ
    console.error('MCPリクエスト:', {
        user: user.sub,
        timestamp: new Date().toISOString(),
        method: req.body?.method
    });
    
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true
    });
    
    res.on('close', () => transport.close());
    
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
});
```

### 入力検証とサニタイズ
```typescript
import { z } from 'zod';
import { resolve } from 'path';
import { readFile } from 'fs/promises';

// 厳格な入力スキーマ
const FilePathSchema = z.string()
    .min(1)
    .max(255)
    .regex(/^[a-zA-Z0-9_\-\/\.]+$/, 'ファイルパスに無効な文字が含まれています')
    .refine(
        path => !path.includes('..'),
        'パストラバーサルは許可されていません'
    );

server.registerTool(
    'read-file',
    {
        title: 'Read File',
        description: '許可されたディレクトリ内のファイルを読み取ります',
        inputSchema: { 
            path: FilePathSchema.describe('ファイルパス（相対パス）')
        },
        outputSchema: { content: z.string() }
    },
    async ({ path }) => {
        // 許可されたベースディレクトリの確認
        const allowedBase = process.env.ALLOWED_FILE_PATH || '/tmp/mcp-files';
        const fullPath = resolve(allowedBase, path);
        
        // パストラバーサル対策
        if (!fullPath.startsWith(allowedBase)) {
            return {
                content: [{ type: 'text', text: 'エラー: アクセスが拒否されました' }],
                isError: true
            };
        }
        
        const content = await readFile(fullPath, 'utf-8');
        return {
            content: [{ type: 'text', text: content }],
            structuredContent: { content }
        };
    }
);
```

### 監査ログ
```typescript
// 監査ログユーティリティ
interface AuditLog {
    timestamp: string;
    action: string;
    tool?: string;
    user?: string;
    sessionId?: string;
    input?: Record<string, unknown>;
    result?: 'success' | 'error';
    errorMessage?: string;
}

function logAudit(log: AuditLog): void {
    // 構造化ログとして出力（stderrを使用）
    console.error(JSON.stringify({
        type: 'AUDIT',
        ...log
    }));
}

// ツール内での使用例
server.registerTool(
    'sensitive-operation',
    {
        title: 'Sensitive Operation',
        description: '監査が必要な機密操作',
        inputSchema: { data: z.string() },
        outputSchema: { result: z.string() }
    },
    async ({ data }) => {
        try {
            // 機密操作の実行（実装例）
            // 実際のプロジェクトでは、以下のように外部サービスを呼び出し
            // const result = await externalService.process(data);
            
            // この例ではダミーレスポンスを返す
            const result = `処理完了: ${data.substring(0, 50)}${data.length > 50 ? '...' : ''}`;
            
            logAudit({
                timestamp: new Date().toISOString(),
                action: 'SENSITIVE_OPERATION',
                tool: 'sensitive-operation',
                input: { dataLength: data.length },
                result: 'success'
            });
            
            return {
                content: [{ type: 'text', text: JSON.stringify({ result }) }],
                structuredContent: { result }
            };
        } catch (error) {
            const err = error as Error;
            
            logAudit({
                timestamp: new Date().toISOString(),
                action: 'SENSITIVE_OPERATION',
                tool: 'sensitive-operation',
                input: { dataLength: data.length },
                result: 'error',
                errorMessage: err.message
            });
            
            return {
                content: [{ type: 'text', text: `エラー: ${err.message}` }],
                isError: true
            };
        }
    }
);
```

## テスト戦略

### ユニットテスト
```typescript
// vitest または jest を使用
import { describe, it, expect, beforeEach } from 'vitest';

// ツール関数を分離してテスト可能に
export async function calculateTool(a: number, b: number, op: '+' | '-' | '*' | '/'): Promise<number> {
    if (op === '/' && b === 0) {
        throw new Error('ゼロによる除算はできません');
    }
    
    // 明確なswitch文で演算を実行
    switch (op) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            return a / b;
    }
    // 注意: TypeScriptのexhaustive checkにより、ここには到達しません
    // 将来の演算子追加時に型エラーを検出するための安全策
}

describe('calculateTool', () => {
    it('加算が正しく動作する', async () => {
        expect(await calculateTool(2, 3, '+')).toBe(5);
    });
    
    it('ゼロ除算でエラーをスローする', async () => {
        await expect(calculateTool(10, 0, '/')).rejects.toThrow('ゼロによる除算');
    });
});
```

### 統合テスト
```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';

describe('MCPサーバー統合テスト', () => {
    let server: McpServer;
    let transport: InMemoryTransport;
    
    beforeAll(async () => {
        server = new McpServer({ name: 'test-server', version: '1.0.0' });
        
        // テスト対象のツールを登録
        server.registerTool('test-tool', {
            title: 'Test Tool',
            description: 'テスト用ツール',
            inputSchema: { input: z.string() },
            outputSchema: { result: z.string() }
        }, async ({ input }) => ({
            content: [{ type: 'text', text: input }],
            structuredContent: { result: input }
        }));
        
        transport = new InMemoryTransport();
        await server.connect(transport);
    });
    
    afterAll(async () => {
        await transport.close();
    });
    
    it('ツール呼び出しが正しく動作する', async () => {
        const result = await transport.request({
            method: 'tools/call',
            params: {
                name: 'test-tool',
                arguments: { input: 'test-value' }
            }
        });
        
        expect(result.content[0].text).toBe('test-value');
    });
});
```

### E2Eテスト
```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn, ChildProcess } from 'child_process';

describe('MCPサーバーE2Eテスト', () => {
    let serverProcess: ChildProcess;
    
    beforeAll(async () => {
        // サーバーを起動
        serverProcess = spawn('npx', ['tsx', 'src/server.ts'], {
            env: { ...process.env, PORT: '3001' }
        });
        
        // サーバーの起動を待機
        await new Promise(resolve => setTimeout(resolve, 2000));
    });
    
    afterAll(() => {
        serverProcess.kill();
    });
    
    it('HTTPエンドポイントが応答する', async () => {
        const response = await fetch('http://localhost:3001/mcp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'initialize',
                params: {
                    protocolVersion: '2024-11-05',
                    capabilities: {},
                    clientInfo: { name: 'test-client', version: '1.0.0' }
                },
                id: 1
            })
        });
        
        expect(response.ok).toBe(true);
        const data = await response.json();
        expect(data.result.protocolVersion).toBeDefined();
    });
});
```

## デプロイメント

### 環境変数設定
```bash
# .env.example
PORT=3000
NODE_ENV=production
LOG_LEVEL=info
JWT_SECRET=your-secret-key
ALLOWED_FILE_PATH=/app/data
DATABASE_URL=postgres://...
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
```

### ローカル/ダイレクトデプロイ（stdio）
```json
// Claude Desktopの設定例 (claude_desktop_config.json)
{
    "mcpServers": {
        "my-server": {
            "command": "npx",
            "args": ["tsx", "/path/to/server.ts"],
            "env": {
                "NODE_ENV": "production"
            }
        }
    }
}
```

### Docker化
```dockerfile
# Dockerfile
FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

### レート制限とクォータ
```typescript
import rateLimit from 'express-rate-limit';

// レート制限の設定
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '60000'),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    message: { error: 'リクエスト数が上限を超えました。しばらくお待ちください。' }
});

app.use('/mcp', limiter);
```

## バージョン管理

### ツールのバージョン管理戦略
```typescript
// バージョン付きツール名の命名規則
server.registerTool(
    'analyze-text-v2',  // バージョンを名前に含める
    {
        title: 'Analyze Text (v2)',
        description: 'テキスト分析ツール v2。v1との違い: 感情分析機能を追加。',
        inputSchema: {
            text: z.string(),
            options: z.object({
                includeSentiment: z.boolean().default(true)
            }).optional()
        },
        outputSchema: {
            wordCount: z.number(),
            sentiment: z.enum(['positive', 'negative', 'neutral']).optional()
        }
    },
    async ({ text, options }) => {
        // 実装
    }
);

// 非推奨ツールの維持（後方互換性）
server.registerTool(
    'analyze-text-v1',
    {
        title: 'Analyze Text (v1) [非推奨]',
        description: '[非推奨] このツールはv2に置き換えられました。analyze-text-v2を使用してください。',
        inputSchema: { text: z.string() },
        outputSchema: { wordCount: z.number() }
    },
    async ({ text }) => {
        console.error('警告: analyze-text-v1は非推奨です。analyze-text-v2を使用してください。');
        // 実装
    }
);
```

## 参考リソース

- [MCP公式ドキュメント](https://modelcontextprotocol.io/)
- [TypeScript SDK GitHub](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector)
- [セキュリティベストプラクティス](https://modelcontextprotocol.io/specification/2025-06-18/basic/security_best_practices)
