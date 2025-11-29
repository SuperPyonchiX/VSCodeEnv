---
mode: 'agent'
description: 'ツール、リソース、適切な設定を持つ完全なTypeScriptのMCPサーバープロジェクトを生成'
---

# TypeScript MCPサーバーの生成

<!-- 
注意: modeは'agent'に設定されています。
- Copilotがエージェントモードで動作し、プロジェクトファイルの作成・編集を自動的に行います
- 新規ファイル作成: package.json, tsconfig.json, server.ts, .env.example など
- ディレクトリ構造の設定とプロジェクトの初期化
- ターミナルコマンドの実行（npm init, npm install など）
- 使用前にプロジェクトディレクトリへの書き込み権限が必要です
-->

以下の仕様で完全なModel Context Protocol (MCP)サーバーをTypeScriptで作成します：

## 要件

1. **プロジェクト構造**: 適切なディレクトリ構造で新しいTypeScript/Node.jsプロジェクトを作成
2. **NPMパッケージ**: @modelcontextprotocol/sdk、zod@3（またはv4）、およびexpress（HTTP用）またはstdioサポートを含める
3. **TypeScript設定**: ESモジュールサポート付きの適切なtsconfig.json
4. **サーバータイプ**: HTTP（Streamable HTTPトランスポート付き）またはstdioベースサーバーから選択
5. **ツール**: 適切なスキーマ検証付きの少なくとも1つの有用なツールを作成
6. **エラーハンドリング**: 包括的なエラーハンドリングと構造化されたエラーレスポンスを含める
7. **セキュリティ**: 入力検証、環境変数による設定、監査ログの基盤を含める

## アーキテクチャ原則

- **単一責任**: サーバーは特定のドメイン（データアクセス、外部API、ファイル操作など）のみを担当
- **厳格なコントラクト**: Zodによる明示的な入出力スキーマ検証
- **デフォルトでステートレス**: 必要な場合のみセッション状態を使用
- **セキュリティバイデザイン**: 認証・認可・監査ログを設計段階から考慮
- **制御された自律性**: 副作用を持つ操作には承認フローを検討

## 実装詳細

### プロジェクトセットアップ
- `npm init` で初期化してpackage.jsonを作成
- 依存関係をインストール: `@modelcontextprotocol/sdk`、`zod@3`（またはv4）、およびトランスポート固有のパッケージ
- ESモジュールでTypeScriptを設定: package.jsonに `"type": "module"`
- dev依存関係を追加: 開発用に `tsx` または `ts-node`、テスト用に `vitest` または `jest`
- 適切な.gitignoreファイルを作成
- 環境変数用の `.env.example` を作成

### サーバー設定
- 高レベル実装に `McpServer` クラスを使用
- サーバー名とバージョンを設定（バージョン管理戦略を考慮）
- 適切なトランスポートを選択（StreamableHTTPServerTransportまたはStdioServerTransport）
- HTTP用: 適切なミドルウェア、CORS設定、エラーハンドリングでExpressをセットアップ
- stdio用: StdioServerTransportを直接使用
- 通知デバウンシングの設定: `debouncedNotificationMethods`

### ツール実装
- 説明的な名前で `registerTool()` メソッドを使用
- 入力と出力の検証にZodを使用してスキーマを定義
- 明確な `title` と `description` フィールドを提供（LLMが理解しやすいように）
- 結果に `content` と `structuredContent` の両方を返す
- try-catchブロックで包括的なエラーハンドリングを実装
- エラー時は `isError: true` と構造化されたエラー情報を返す
- 適切な場所で非同期操作をサポート
- 高影響操作には承認フローを検討

### リソース/プロンプトセットアップ（オプション）
- 動的URIのためにResourceTemplateで `registerResource()` を使用してリソースを追加
- 引数スキーマで `registerPrompt()` を使用してプロンプトを追加
- より良いUXのために `completable()` による補完サポートの追加を検討
- リソースとプロンプトにもバージョン情報を含める

### コード品質
- 型安全性のためにTypeScriptを使用
- 一貫してasync/awaitパターンに従う
- トランスポートクローズイベントで適切なクリーンアップを実装
- 設定に環境変数を使用（ハードコーディング禁止）
- 複雑なロジックにインラインコメントを追加
- 明確な関心の分離でコードを構造化
- 監査ログの基盤を実装

### セキュリティ考慮事項
- 入力パラメータを処理前に必ず検証
- 環境変数でシークレットを管理
- ゼロトラスト境界を意識した設計
- 高影響操作には承認フローを検討
- 監査ログでユーザー、セッション、タイムスタンプを記録

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
  - ブラウザクライアント用のCORSセットアップ（`Mcp-Session-Id`ヘッダーを公開）
  - セッション管理（ステートレス vs ステートフル、`sessionIdGenerator`）
  - ローカルサーバー用のDNSリバインディング保護: `enableDnsRebindingProtection: true`
  - TLS/mTLS設定（本番環境向け）
  - レート制限とクォータ
  
- **stdioサーバーの場合**:
  - 適切なstdin/stdoutハンドリング
  - 環境ベースの設定
  - プロセスライフサイクル管理
  - 構造化ログ（stdout/stderrを汚さないよう注意）

## デプロイメントパターン

### ローカル/ダイレクト
- `StdioServerTransport`を使用
- Claude Desktop、VS Codeなどとの統合

### リモート/スケールアウト
- `StreamableHTTPServerTransport`を使用
- TLS/mTLSの有効化
- レート制限とクォータの実装
- ロードバランサー配下へのデプロイ

### エンタープライズゲートウェイ
- MCPゲートウェイによる一元管理
- 認証・認可の集中化
- 監査ログの一元化

## テストガイダンス
- サーバーの実行方法を説明（`npm start` または `npx tsx server.ts`）
- MCP Inspectorコマンドを提供: `npx @modelcontextprotocol/inspector`
- HTTPサーバーの場合、接続URLを含める: `http://localhost:PORT/mcp`
- ツール呼び出しの例を含める
- 一般的な問題のトラブルシューティングのヒントを追加

### テスト戦略
- **ユニットテスト**: 個々のツール関数のテスト（Vitest/Jest使用）
- **統合テスト**: MCPプロトコルを通じたツール呼び出しのテスト
- **E2Eテスト**: 実際のクライアントとの接続テスト
- **モック**: 外部依存関係のモック化

## 検討すべき追加機能
- LLMパワードツールのためのサンプリングサポート（`server.server.createMessage()`）
- インタラクティブワークフローのためのユーザー入力要求（`server.server.elicitInput()`）
- 有効化/無効化機能付きの動的ツール登録（`.enable()`, `.disable()`, `.update()`, `.remove()`）
- 一括更新のための通知デバウンシング（`debouncedNotificationMethods`）
- 効率的なデータ参照のためのリソースリンク
- OAuthプロキシ統合（外部認証プロバイダー）
- バージョン管理と非推奨ポリシー

型安全性、エラーハンドリング、包括的なドキュメント、セキュリティを備えた、完全で本番環境対応のMCPサーバーを生成します。
