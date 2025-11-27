---
description: 'Instructions for building Model Context Protocol (MCP) servers using the TypeScript SDK'
applyTo: '**/*.ts, **/*.js, **/package.json'
---

# TypeScript MCP Server開発

## 指示事項

- **@modelcontextprotocol/sdk** npmパッケージを使用: `npm install @modelcontextprotocol/sdk`
- 特定のパスからインポート: `@modelcontextprotocol/sdk/server/mcp.js`, `@modelcontextprotocol/sdk/server/stdio.js` など
- 自動プロトコル処理を伴う高レベルサーバー実装には `McpServer` クラスを使用
- 手動リクエストハンドラーによる低レベル制御には `Server` クラスを使用
- 入出力スキーマ検証には **zod** を使用: `npm install zod@3`
- より良いUI表示のため、tools、resources、promptsには必ず `title` フィールドを提供
- `registerTool()`、`registerResource()`、`registerPrompt()` メソッドを使用（古いAPIよりも推奨）
- zodを使用してスキーマを定義: `{ inputSchema: { param: z.string() }, outputSchema: { result: z.string() } }`
- toolsからは `content`（表示用）と `structuredContent`（構造化データ用）の両方を返す
- HTTPサーバーの場合、Expressなどのフレームワークとともに `StreamableHTTPServerTransport` を使用
- ローカル統合の場合、stdio通信には `StdioServerTransport` を使用
- リクエストIDの衝突を防ぐため、リクエストごとに新しいトランスポートインスタンスを作成（ステートレスモード）
- ステートフルサーバーには `sessionIdGenerator` によるセッション管理を使用
- ローカルサーバーのDNSリバインディング保護を有効化: `enableDnsRebindingProtection: true`
- ブラウザベースのクライアント向けにCORSヘッダーを設定し、`Mcp-Session-Id` を公開
- URIパラメータを持つ動的リソースには `ResourceTemplate` を使用: `new ResourceTemplate('resource://{param}', { list: undefined })`
- `@modelcontextprotocol/sdk/server/completable.js` の `completable()` ラッパーを使用して、UX向上のための補完をサポート
- クライアントからLLM補完を要求するには、`server.server.createMessage()` によるサンプリングを実装
- ツール実行中に追加のユーザー入力を要求するには、`server.server.elicitInput()` を使用
- 一括更新の通知デバウンスを有効化: `debouncedNotificationMethods: ['notifications/tools/list_changed']`
- 動的更新: 登録されたアイテムで `.enable()`、`.disable()`、`.update()`、`.remove()` を呼び出して `listChanged` 通知を発行
- UI表示名には `@modelcontextprotocol/sdk/shared/metadataUtils.js` の `getDisplayName()` を使用
- MCP Inspectorでサーバーをテスト: `npx @modelcontextprotocol/inspector`

## ベストプラクティス

- ツール実装は単一責任に集中させる
- LLMが理解しやすい明確で説明的なタイトルと説明を提供
- すべてのパラメータと戻り値に適切なTypeScript型を使用
- try-catchブロックによる包括的なエラー処理を実装
- エラー状態の場合、ツール結果で `isError: true` を返す
- すべての非同期操作にasync/awaitを使用
- データベース接続を閉じ、リソースを適切にクリーンアップ
- 処理前に入力パラメータを検証
- stdout/stderrを汚さないよう、デバッグには構造化ログを使用
- ファイルシステムやネットワークアクセスを公開する際のセキュリティ影響を考慮
- トランスポートクローズイベント時の適切なリソースクリーンアップを実装
- 設定（ポート、APIキーなど）には環境変数を使用
- ツールの機能と制限を明確に文書化
- 互換性を確保するため、複数のクライアントでテスト

## 一般的なパターン

### 基本的なサーバー設定（HTTP）
```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';

const server = new McpServer({
    name: 'my-server',
    version: '1.0.0'
});

const app = express();
app.use(express.json());

app.post('/mcp', async (req, res) => {
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true
    });
    
    res.on('close', () => transport.close());
    
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
});

app.listen(3000);
```

### 基本的なサーバー設定（stdio）
```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new McpServer({
    name: 'my-server',
    version: '1.0.0'
});

// ... register tools, resources, prompts ...

const transport = new StdioServerTransport();
await server.connect(transport);
```

### シンプルなツール
```typescript
import { z } from 'zod';

server.registerTool(
    'calculate',
    {
        title: 'Calculator',
        description: '基本的な計算を実行',
        inputSchema: { a: z.number(), b: z.number(), op: z.enum(['+', '-', '*', '/']) },
        outputSchema: { result: z.number() }
    },
    async ({ a, b, op }) => {
        const result = op === '+' ? a + b : op === '-' ? a - b : 
                      op === '*' ? a * b : a / b;
        const output = { result };
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
        description: 'ユーザープロファイルデータを取得'
    },
    async (uri, { userId }) => ({
        contents: [{
            uri: uri.href,
            text: `User ${userId} data here`
        }]
    })
);
```

### サンプリングを使用したツール
```typescript
server.registerTool(
    'summarize',
    {
        title: 'Text Summarizer',
        description: 'LLMを使用してテキストを要約',
        inputSchema: { text: z.string() },
        outputSchema: { summary: z.string() }
    },
    async ({ text }) => {
        const response = await server.server.createMessage({
            messages: [{
                role: 'user',
                content: { type: 'text', text: `要約: ${text}` }
            }],
            maxTokens: 500
        });
        
        const summary = response.content.type === 'text' ? 
            response.content.text : '要約できません';
        const output = { summary };
        return {
            content: [{ type: 'text', text: JSON.stringify(output) }],
            structuredContent: output
        };
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
        description: '特定の焦点でコードをレビュー',
        argsSchema: {
            language: completable(z.string(), value => 
                ['typescript', 'python', 'javascript', 'java']
                    .filter(l => l.startsWith(value))
            ),
            code: z.string()
        }
    },
    ({ language, code }) => ({
        messages: [{
            role: 'user',
            content: {
                type: 'text',
                text: `この${language}コードをレビューしてください:\n\n${code}`
            }
        }]
    })
);
```

### エラー処理
```typescript
server.registerTool(
    'risky-operation',
    {
        title: 'Risky Operation',
        description: '失敗する可能性のある操作',
        inputSchema: { input: z.string() },
        outputSchema: { result: z.string() }
    },
    async ({ input }) => {
        try {
            const result = await performRiskyOperation(input);
            const output = { result };
            return {
                content: [{ type: 'text', text: JSON.stringify(output) }],
                structuredContent: output
            };
        } catch (err: unknown) {
            const error = err as Error;
            return {
                content: [{ type: 'text', text: `エラー: ${error.message}` }],
                isError: true
            };
        }
    }
);
```
