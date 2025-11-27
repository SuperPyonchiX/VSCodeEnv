<div align="center">

# GitHub Copilot カスタマイゼーションコレクション

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=flat-square&logo=github)](https://github.com)
![Node version](https://img.shields.io/badge/VS_Code-latest-0078d7?style=flat-square&logo=visualstudiocode)
![GitHub Copilot](https://img.shields.io/badge/GitHub_Copilot-Powered-purple?style=flat-square&logo=github)

⭐ このプロジェクトが気に入ったら、GitHubでスターを付けてください！
</div>

## 目次
１．[概要](#概要) 
２．[使い始める](#使い始める)
３．[カスタマイゼーション](#カスタマイゼーション) 
４．[使用方法](#使用方法) 
５．[参考資料](#参考資料)

このリポジトリは、GitHub Copilotの機能を最大限に活用するための高品質なカスタマイゼーションファイルのコレクションです。プロンプト、インストラクション、エージェント、ワークフローなど、VS Code環境でのAI支援開発を強化するツールを提供します。

## 概要

GitHub Copilotは強力なAIペアプログラマーですが、カスタマイゼーションによってさらに効果的になります。このコレクションは、プロジェクト固有のニーズに合わせてCopilotの動作を調整し、コーディング標準、ベストプラクティス、開発ワークフローを自動化するためのファイルを提供します。

### このコレクションに含まれるもの

**プロンプトファイル (`.prompt.md`)** - タスク実行のためのレシピ
- READMEドキュメント生成
- TypeScript/Python MCPサーバー生成
- カスタマイゼーションファイル作成
- ドキュメント作成とコードレビュー

**インストラクションファイル (`.instructions.md`)** - 自動適用されるルール
- Python、TypeScript開発標準
- MCPサーバー開発ガイドライン
- Markdown記述規約
- プロンプト/インストラクション作成ガイド

**エージェントファイル (`.agent.md`)** - 対話型の専門家
- TypeScript/Python MCPエキスパート
- プロンプトビルダー
- ソフトウェアエンジニアリングエージェント
- 高度な思考モード

## 使い始める

### 前提条件

- [Visual Studio Code](https://code.visualstudio.com/) (最新版)
- [GitHub Copilot](https://github.com/features/copilot) サブスクリプション
- VS Code GitHub Copilot拡張機能

### セットアップ

1. **リポジトリをクローン**
   ```bash
   git clone <your-repository-url>
   cd VSCodeEnv
   ```

2. **VS Codeで開く**
   ```bash
   code .
   ```

3. **GitHub Copilot拡張機能を確認**
   - VS Codeの拡張機能パネルで `GitHub Copilot` が有効になっていることを確認

4. **カスタマイゼーションの使用を開始**
   - プロンプトファイル: `@workspace #file:.github/prompts/` とチャットに入力
   - エージェント: `@<エージェント名>` とチャットで呼び出し
   - インストラクション: 該当するファイルタイプで自動適用

## カスタマイゼーション

### 📝 プロンプトファイル

プロンプトファイルは、特定のタスクを実行するための再利用可能なレシピです。

| プロンプト | 説明 | 使用方法 |
|--------|------|--------|
| [create-readme.prompt.md](.github/prompts/create-readme.prompt.md) | 包括的なREADME.mdファイルを生成 | `#file:.github/prompts/create-readme.prompt.md` |
| [typescript-mcp-server-generator.prompt.md](.github/prompts/typescript-mcp-server-generator.prompt.md) | TypeScript MCPサーバープロジェクトを作成 | `#file:.github/prompts/typescript-mcp-server-generator.prompt.md` |
| [python-mcp-server-generator.prompt.md](.github/prompts/python-mcp-server-generator.prompt.md) | Python MCPサーバープロジェクトを作成 | `#file:.github/prompts/python-mcp-server-generator.prompt.md` |
| [create-customization-md.prompt.md](.github/prompts/create-customization-md.prompt.md) | プロンプト/インストラクション/エージェントを統合的に生成 | `#file:.github/prompts/create-customization-md.prompt.md` |
| [prompt-builder.prompt.md](.github/prompts/prompt-builder.prompt.md) | 高品質なプロンプトファイルを作成 | `#file:.github/prompts/prompt-builder.prompt.md` |
| [documentation-writer.prompt.md](.github/prompts/documentation-writer.prompt.md) | 技術ドキュメントを作成 | `#file:.github/prompts/documentation-writer.prompt.md` |

### 📋 インストラクションファイル

インストラクションファイルは、特定のファイルタイプに自動的に適用されるルールを定義します。

| インストラクション | 適用対象 | 説明 |
|---------------|---------|------|
| [python.instructions.md](.github/instructions/python.instructions.md) | `**/*.py` | Python開発のコーディング規約とベストプラクティス |
| [typescript-mcp-server.instructions.md](.github/instructions/typescript-mcp-server.instructions.md) | `**/*.ts, **/*.js` | TypeScript MCPサーバー開発ガイドライン |
| [python-mcp-server.instructions.md](.github/instructions/python-mcp-server.instructions.md) | `**/*.py` | Python MCPサーバー開発ガイドライン |
| [markdown.instructions.md](.github/instructions/markdown.instructions.md) | `**/*.md` | Markdown記述とドキュメント作成標準 |
| [prompt.instructions.md](.github/instructions/prompt.instructions.md) | `**/*.prompt.md` | 高品質なプロンプトファイル作成ガイドライン |
| [instructions.instructions.md](.github/instructions/instructions.instructions.md) | `**/*.instructions.md` | インストラクションファイル作成ガイドライン |

### 🤖 エージェントファイル

エージェントファイルは、特定の専門知識を持つ対話型のAIアシスタントを定義します。

| エージェント | 説明 | 呼び出し方法 |
|---------|------|----------|
| [typescript-mcp-expert.agent.md](.github/agents/typescript-mcp-expert.agent.md) | TypeScript MCPサーバー開発の専門家 | `@typescript-mcp-expert` |
| [python-mcp-expert.agent.md](.github/agents/python-mcp-expert.agent.md) | Python MCPサーバー開発の専門家 | `@python-mcp-expert` |
| [prompt-builder.agent.md](.github/agents/prompt-builder.agent.md) | プロンプトエンジニアリングとプロンプト検証システム | `@prompt-builder` |
| [software-engineer-agent-v1.agent.md](.github/agents/software-engineer-agent-v1.agent.md) | 包括的なソフトウェアエンジニアリング支援 | `@software-engineer` |
| [Thinking-Beast-Mode.agent.md](.github/agents/Thinking-Beast-Mode.agent.md) | 深い思考プロセスを持つ高度なエージェント | `@thinking-beast` |

### ⚙️ その他のカスタマイゼーション

- [copilot-instructions.md](.github/copilot-instructions.md) - リポジトリ全体に適用されるコードレビュー標準

## 使用方法

### プロンプトファイルの使用

プロンプトファイルを使用するには、GitHub Copilotチャットで以下のように参照します:

```
@workspace Follow instructions in #file:.github/prompts/create-readme.prompt.md
```

または、特定のコンテキストで:

```
Create a new TypeScript MCP server following #file:.github/prompts/typescript-mcp-server-generator.prompt.md
```

### エージェントの使用

エージェントを呼び出すには、チャットで `@` に続けてエージェント名を入力します:

```
@typescript-mcp-expert Help me create a new MCP server with file system tools
```

```
@prompt-builder I need to create a new prompt for generating API documentation
```

### インストラクションの適用

インストラクションファイルは、指定されたファイルタイプで自動的に適用されます。明示的に呼び出す必要はありませんが、特定のインストラクションに従うことを強調したい場合:

```
Create a new Python file following #file:.github/instructions/python.instructions.md
```

### カスタマイゼーションファイルの作成

新しいカスタマイゼーションファイルを作成するには:

```
@workspace Follow instructions in #file:.github/prompts/create-customization-md.prompt.md
Goal: Create customization files for REST API development
```

## ベストプラクティス

### プロンプトファイル

- **明確な目的**: 各プロンプトは単一の明確な目的を持つべき
- **構造化**: セクションを論理的に整理
- **具体的**: あいまいさを避け、具体的な指示を提供
- **例を含める**: 期待される出力の例を提供

### インストラクションファイル

- **適用範囲を明確に**: `applyTo` フィールドで正確なファイルパターンを指定
- **シンプルに**: 原則とガイドラインに焦点を当て、実装の詳細は避ける
- **一貫性**: プロジェクト全体で一貫した用語を使用

### エージェントファイル

- **専門性を定義**: エージェントの専門分野と能力を明確に
- **適切なツール**: タスクに必要なツールのみを指定
- **ペルソナ**: 明確な役割と専門知識を定義

## 参考資料

### 公式ドキュメント

- [VS Code プロンプトファイル](https://code.visualstudio.com/docs/copilot/customization/prompt-files)
- [VS Code カスタムインストラクション](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
- [VS Code カスタムエージェント](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)

### コミュニティリソース

- [Awesome Copilot リポジトリ](https://github.com/github/awesome-copilot)
- [AGENTS.md 公式サイト](https://agents.md/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)

### 学習リソース

- [GitHub Copilot Documentation](https://docs.github.com/copilot)
- [VS Code AI Toolkit](https://marketplace.visualstudio.com/items?itemName=ms-windows-ai-studio.windows-ai-studio)

## プロジェクト構造

```
VSCodeEnv/
├── .github/
│   ├── agents/              # カスタムエージェント定義
│   ├── instructions/        # ファイルタイプ別のルール
│   ├── prompts/             # タスク実行レシピ
│   └── copilot-instructions.md  # リポジトリ全体の指示
└── README.md               # このファイル
```

## トラブルシューティング

### カスタマイゼーションが適用されない

1. GitHub Copilot拡張機能が最新版であることを確認
2. VS Codeを再起動
3. ファイルが正しいディレクトリ (`.github/`) にあることを確認
4. YAMLフロントマターが正しくフォーマットされていることを確認

### エージェントが表示されない

1. エージェントファイルに有効な `description` フィールドがあることを確認
2. ファイル名が `.agent.md` で終わることを確認
3. VS Codeのコマンドパレット (`Ctrl+Shift+P`) で `GitHub Copilot: Reload Extensions` を実行

### プロンプトが動作しない

1. フロントマターに `mode` と `description` が含まれていることを確認
2. ファイルパスが正しいことを確認
3. チャットで `#file:` プレフィックスを使用していることを確認

---

<div align="center">

**このプロジェクトが役に立ちましたか? GitHubでスターを付けてください! ⭐**

</div>
