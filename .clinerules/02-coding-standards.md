# コーディング標準

## Python

### 基本ルール
- PEP8に準拠する
- 型ヒントを必ず使用する
- docstringはGoogle形式で記述する

### MCPサーバー開発
- FastMCPフレームワークを使用する
- Pydanticモデルで入出力を定義する
- 非同期処理（async/await）を活用する

### 推奨ツール
- フォーマッター: Black、isort
- リンター: Ruff、mypy

## TypeScript/JavaScript

### 基本ルール
- TypeScriptを優先する
- 厳格な型チェック（strict: true）を有効にする
- ESモジュール形式を使用する

### MCPサーバー開発
- MCP SDK（@modelcontextprotocol/sdk）を使用する
- zodでスキーマを定義する
- STDIO/HTTPトランスポートに対応する

### 推奨ツール
- フォーマッター: Prettier
- リンター: ESLint

## C/C++

### 基本ルール
- AUTOSAR C++14規約に準拠する
- CERT C++セキュリティガイドラインに従う
- RAII原則を遵守する

### 必須事項
- スマートポインタを使用する（生ポインタは避ける）
- 例外安全なコードを書く
- const正確性を維持する

### 推奨ツール
- 静的解析: Clang-Tidy、Cppcheck
- フォーマッター: clang-format

## Markdown

### 基本ルール
- 見出しは階層構造を守る（h1→h2→h3）
- リストは箇条書きと番号付きを適切に使い分ける
- コードブロックには言語を指定する

### 図解
- Mermaid記法を活用する
- フローチャート、シーケンス図、クラス図に対応

### 文書テンプレート
- 説明資料、手順書、提案書、報告書、FAQ、会議議事録
