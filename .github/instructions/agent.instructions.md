---
description: 'GitHub Copilot agent file creation guidelines'
applyTo: '**/*.agent.md'
---

# エージェントファイル作成規約

## ファイル構造

エージェントファイルは以下の構造に従う必要があります:

```markdown
---
description: 'エージェントの説明（シングルクォート）'
tools: ['vscode', 'read', 'edit', 'search']
model: 'claude-sonnet-4.5'
handoffs:
  - label: 'ボタンラベル'
    agent: 'target-agent'
    prompt: '送信するプロンプト'
    send: false
---

# エージェント名

エージェントの詳細説明
```

## Front Matter必須項目

### description（必須）

- シングルクォートで囲む
- エージェントの役割を簡潔に説明
- 何ができるかを具体的に記述

## Front Matterオプション項目

### tools

使用するツールを配列で指定:
- `vscode`: VS Code機能
- `read`: ファイル読み取り
- `edit`: ファイル編集
- `create`: ファイル作成
- `search`: コード検索
- `web-search`: Web検索
- `agent`: サブエージェント呼び出し
- `execute`: コマンド実行

### model

推奨モデルを指定:
- `'claude-sonnet-4.5'`（推奨）
- その他のサポートモデル

### handoffs

他のエージェントへの遷移を定義:

```yaml
handoffs:
  - label: 'UI表示ラベル'
    agent: 'target-agent-name'
    prompt: '送信するプロンプト内容'
    send: false  # true: 自動送信, false: 確認後送信
```

### infer

サブエージェントとして使用可能か:
- `true`: 他のエージェントから呼び出し可能
- `false`: 直接呼び出しのみ（デフォルト）

### target

対象プラットフォーム:
- `'vscode'`: VS Code専用
- `'github-copilot'`: GitHub Copilot全般

## エージェント本文の構成

### 推奨セクション

1. **ペルソナ定義**: エージェントの役割と専門性
2. **専門領域**: 得意分野のリスト
3. **能力**: 具体的な機能の説明
4. **ワークフロー**: 作業の流れ
5. **使用例**: 具体的なユースケース
6. **関連リソース**: 参照先リンク

### 完了責任プロトコル

複雑なタスクには完了責任を明記:

```markdown
## 完了責任

以下が完了するまでタスクを終了しない:
- [ ] 要件の完全な理解
- [ ] すべてのファイルの生成
- [ ] 検証チェックの実行
- [ ] 使用方法の説明
```

## ベストプラクティス

### ペルソナ設計

- 明確な専門性を定義
- 一人称で役割を説明
- 具体的な能力を列挙

### ワークフロー設計

- 段階的な処理フローを定義
- 各ステップの入出力を明確化
- エラーハンドリングを含める

### サブエージェント活用

- 複雑なタスクは分割
- 専門エージェントに委譲
- 結果の統合方法を明記

## 命名規約

- 小文字、ハイフン区切り
- 拡張子: `.agent.md`
- 配置場所: `.github/agents/`

**良い例**:
- `generate-tests.agent.md`
- `review-code.agent.md`
- `analyze-security.agent.md`

**悪い例**:
- `GenerateTests.agent.md`
- `generate_tests.agent.md`
- `tests-agent.md`

## 禁止事項

- ダブルクォートの使用（Front Matterではシングルクォート）
- 空のdescription
- 曖昧なペルソナ定義
- 過度に広範な専門領域

## サンプル

```markdown
---
description: 'TypeScript MCPサーバー開発の専門アシスタント'
tools: ['vscode', 'read', 'edit', 'create', 'search', 'web-search']
model: 'claude-sonnet-4.5'
handoffs:
  - label: 'Pythonで実装'
    agent: 'generate-python-mcp-server'
    prompt: 'Python版のMCPサーバーを生成'
    send: false
---

# TypeScript MCP エキスパート

あなたは、TypeScript SDKを使用してMCPサーバーを構築する専門家です。

## 専門領域

- TypeScript/Node.js開発
- MCP (Model Context Protocol) 仕様
- zodバリデーション
- Express統合

## 能力

### MCPサーバー設計
プロジェクト構造の設計とベストプラクティスの適用

### ツール実装
zodスキーマを使用した型安全なツール定義

### テスト作成
MCP Inspectorを使用したテスト手法

## ワークフロー

1. 要件のヒアリング
2. プロジェクト構造の設計
3. ツール・リソースの実装
4. テストと検証
5. ドキュメント生成

## 使用例

「ファイル操作用のMCPサーバーを作成してください」
→ ファイル読み書きツールを含む完全なMCPサーバーを生成

## 関連リソース

- [MCP公式ドキュメント](https://modelcontextprotocol.io/)
- [typescript-mcp-development スキル](.github/skills/typescript-mcp-development/)
```

## 検証チェックリスト

- [ ] Front matterが`---`で囲まれている
- [ ] `description`がシングルクォートで囲まれている
- [ ] ファイル名が命名規約に準拠
- [ ] ペルソナが明確に定義されている
- [ ] 専門領域と能力が具体的
- [ ] handoffsの設定が正しい（使用する場合）
