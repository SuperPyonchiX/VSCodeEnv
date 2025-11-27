---
mode: 'agent'
description: 'ツール、リソース、適切な設定を持つ完全なTypeScriptのMCPサーバープロジェクトを生成'
---

# TypeScript MCPサーバーの生成

以下の仕様で完全なModel Context Protocol (MCP)サーバーをTypeScriptで作成します：

## 要件

1. **プロジェクト構造**: 適切なディレクトリ構造で新しいTypeScript/Node.jsプロジェクトを作成
2. **NPMパッケージ**: @modelcontextprotocol/sdk、zod@3、およびexpress（HTTP用）またはstdioサポートを含める
3. **TypeScript設定**: ESモジュールサポート付きの適切なtsconfig.json
4. **サーバータイプ**: HTTP（Streamable HTTPトランスポート付き）またはstdioベースサーバーから選択
5. **ツール**: 適切なスキーマ検証付きの少なくとも1つの有用なツールを作成
6. **エラーハンドリング**: 包括的なエラーハンドリングと検証を含める

## 実装詳細

### プロジェクトセットアップ
- `npm init` で初期化してpackage.jsonを作成
- 依存関係をインストール: `@modelcontextprotocol/sdk`、`zod@3`、およびトランスポート固有のパッケージ
- ESモジュールでTypeScriptを設定: package.jsonに `"type": "module"`
- dev依存関係を追加: 開発用に `tsx` または `ts-node`
- 適切な.gitignoreファイルを作成

### サーバー設定
- 高レベル実装に `McpServer` クラスを使用
- サーバー名とバージョンを設定
- 適切なトランスポートを選択（StreamableHTTPServerTransportまたはStdioServerTransport）
- HTTP用: 適切なミドルウェアとエラーハンドリングでExpressをセットアップ
- stdio用: StdioServerTransportを直接使用

### ツール実装
- 説明的な名前で `registerTool()` メソッドを使用
- 入力と出力の検証にzodを使用してスキーマを定義
- 明確な `title` と `description` フィールドを提供
- 結果に `content` と `structuredContent` の両方を返す
- try-catchブロックで適切なエラーハンドリングを実装
- 適切な場所で非同期操作をサポート

### リソース/プロンプトセットアップ（オプション）
- 動的URIのためにResourceTemplateで `registerResource()` を使用してリソースを追加
- 引数スキーマで `registerPrompt()` を使用してプロンプトを追加
- より良いUXのために補完サポートの追加を検討

### コード品質
- 型安全性のためにTypeScriptを使用
- 一貫してasync/awaitパターンに従う
- トランスポートクローズイベントで適切なクリーンアップを実装
- 設定に環境変数を使用
- 複雑なロジックにインラインコメントを追加
- 明確な関心の分離でコードを構造化

## 検討すべきツールタイプの例
- データ処理と変換
- 外部API統合
- ファイルシステム操作（読み取り、検索、分析）
- データベースクエリ
- テキスト分析または要約（サンプリング付き）
- システム情報取得

## 設定オプション
- **HTTPサーバーの場合**: 
  - 環境変数によるポート設定
  - ブラウザクライアント用のCORSセットアップ
  - セッション管理（ステートレス vs ステートフル）
  - ローカルサーバー用のDNSリバインディング保護
  
- **stdioサーバーの場合**:
  - 適切なstdin/stdoutハンドリング
  - 環境ベースの設定
  - プロセスライフサイクル管理

## テストガイダンス
- サーバーの実行方法を説明（`npm start` または `npx tsx server.ts`）
- MCP Inspectorコマンドを提供: `npx @modelcontextprotocol/inspector`
- HTTPサーバーの場合、接続URLを含める: `http://localhost:PORT/mcp`
- ツール呼び出しの例を含める
- 一般的な問題のトラブルシューティングのヒントを追加

## 検討すべき追加機能
- LLMパワードツールのためのサンプリングサポート
- インタラクティブワークフローのためのユーザー入力要求
- 有効化/無効化機能付きの動的ツール登録
- 一括更新のための通知デバウンシング
- 効率的なデータ参照のためのリソースリンク

型安全性、エラーハンドリング、包括的なドキュメントを備えた、完全で本番環境対応のMCPサーバーを生成します。
