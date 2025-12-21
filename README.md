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
　├ [プロンプトファイル](#-プロンプトファイル)
　├ [インストラクションファイル](#-インストラクションファイル)
　├ [エージェントファイル](#-エージェントファイル)
　├ [Agent Skills](#-agent-skills)
　└ [その他のカスタマイゼーション](#-その他のカスタマイゼーション)
４．[使用方法](#使用方法) 
５．[ベストプラクティス](#ベストプラクティス)
６．[参考資料](#参考資料)
７．[トラブルシューティング](#トラブルシューティング)

このリポジトリは、GitHub Copilotの機能を最大限に活用するための高品質なカスタマイゼーションファイルのコレクションです。プロンプト、インストラクション、エージェント、Agent Skillsなど、VS Code環境でのAI支援開発を強化するツールを提供します。

## 概要

GitHub Copilotは強力なAIペアプログラマーですが、カスタマイゼーションによってさらに効果的になります。このコレクションは、プロジェクト固有のニーズに合わせてCopilotの動作を調整し、コーディング標準、ベストプラクティス、開発ワークフローを自動化するためのファイルを提供します。
C++14コードレビュー（Git差分対応）
- ドキュメント作成とバグ修正分析

**インストラクションファイル (`.instructions.md`)** - 自動適用されるルール
- Python、TypeScript開発標準
- MCPサーバー開発ガイドライン
- Markdown記述規約
- プロンプト/インストラクション作成ガイド

**エージェントファイル (`.agent.md`)** - 対話型の専門家
- TypeScript/Python MCPエキスパート
- C++14コードレビュー専門家
- 手順書作成専門家
- プロンプトビルダー
- 高度な思考モード

**Agent Skills (`SKILL.md`)** - リソースを含むワークフロー
- Python/TypeScript MCP開発（テンプレート、サンプル付き）
- C++14コードレビュー（静的解析設定、チェックリスト付き）
- Copilotカスタマイゼーション（全種類のテンプレート付き）記述規約
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
| [ai-prompt-engineering-safety-review.prompt.md](.github/prompts/ai-prompt-engineering-safety-review.prompt.md) | AIプロンプトのセキュリティとバイアス評価 | `#file:.github/prompts/ai-prompt-engineering-safety-review.prompt.md` |
| [analyze-cpp-bugfix-impact.prompt.md](.github/prompts/analyze-cpp-bugfix-impact.prompt.md) | C++バグ修正の影響範囲を分析し、横にらみチェックを実施 | `#file:.github/prompts/analyze-cpp-bugfix-impact.prompt.md` |
| [analyze-cpp-concurrency.prompt.md](.github/prompts/analyze-cpp-concurrency.prompt.md) | C++並行処理の排他制御を分析してデッドロックを検出 | `#file:.github/prompts/analyze-cpp-concurrency.prompt.md` |
| [generate-agentsmd.prompt.md](.github/prompts/generate-agentsmd.prompt.md) | 高品質なエージェントファイルを作成 | `#file:.github/prompts/generate-agentsmd.prompt.md` |
| [generate-customization-md.prompt.md](.github/prompts/generate-customization-md.prompt.md) | プロンプト+エージェントのペアを統合的に生成 | `#file:.github/prompts/generate-customization-md.prompt.md` |
| [generate-instructionsmd.prompt.md](.github/prompts/generate-instructionsmd.prompt.md) | 高品質なインストラクションファイルを作成 | `#file:.github/prompts/generate-instructionsmd.prompt.md` |
| [generate-procedure-document.prompt.md](.github/prompts/generate-procedure-document.prompt.md) | Mermaid図付きの開発・運用手順書を生成 | `#file:.github/prompts/generate-procedure-document.prompt.md` |
| [generate-promptsmd.prompt.md](.github/prompts/generate-promptsmd.prompt.md) | 高品質なプロンプトファイルを作成 | `#file:.github/prompts/generate-promptsmd.prompt.md` |
| [generate-python-mcp-server.prompt.md](.github/prompts/generate-python-mcp-server.prompt.md) | Python MCPサーバープロジェクトを作成 | `#file:.github/prompts/generate-python-mcp-server.prompt.md` |
| [generate-readme.prompt.md](.github/prompts/generate-readme.prompt.md) | 包括的なREADME.mdファイルを生成 | `#file:.github/prompts/generate-readme.prompt.md` |
| [generate-typescript-mcp-server.prompt.md](.github/prompts/generate-typescript-mcp-server.prompt.md) | TypeScript MCPサーバープロジェクトを作成 | `#file:.github/prompts/generate-typescript-mcp-server.prompt.md` |
| [github-copilot-starter.prompt.md](.github/prompts/github-copilot-starter.prompt.md) | GitHub Copilotの使用を開始するためのガイド | `#file:.github/prompts/github-copilot-starter.prompt.md` |
| [prompt-builder.prompt.md](.github/prompts/generate-promptsmd.prompt.md) | 高品質なプロンプトファイルを作成（レガシー） | `#file:.github/prompts/prompt-builder.prompt.md` || [review-cpp14-code.prompt.md](.github/prompts/review-cpp14-code.prompt.md) | AUTOSAR C++14/CERT C++準拠のコードレビュー実行(Git差分対応) | `#file:.github/prompts/review-cpp14-code.prompt.md` |
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

**注**: C++分析や手順書作成の詳細ガイドラインは、対応するエージェントファイルに統合されています。

### 🤖 エージェントファイル

エージェントファイルは、特定の専門知識を持つ対話型のAIアシスタントを定義します。

| エージェント | 説明 | 呼び出し方法 |
|---------|------|----------|
| [analyze-cpp-bugfix-impact.agent.md](.github/agents/analyze-cpp-bugfix-impact.agent.md) | C++バグ修正の横にらみ分析と影響範囲評価(詳細チェックリスト内蔵) | `@analyze-cpp-bugfix-impact` |
| [analyze-cpp-concurrency.agent.md](.github/agents/analyze-cpp-concurrency.agent.md) | C++並行処理のデッドロック分析と最適化(C++14標準内蔵) | `@analyze-cpp-concurrency` |
| [beast-mode.agent.md](.github/agents/beast-mode.agent.md) | 深い思考プロセスと最大創造性を持つ高度なエージェント | `@beast-mode` |
| [context7.agent.md](.github/agents/context7.agent.md) | コンテキスト認識型の高度なアシスタント | `@context7` |
| [generate-customization-md.agent.md](.github/agents/generate-customization-md.agent.md) | タスク自動化ファイル(プロンプト+エージェント)のペア設計と生成 | `@generate-customization-md` |
| [generate-procedure-document.agent.md](.github/agents/generate-procedure-document.agent.md) | 開発・運用手順書作成の専門家(詳細ガイドライン内蔵) | `@generate-procedure-document` |
| [generate-python-mcp-server.agent.md](.github/agents/generate-python-mcp-server.agent.md) | Python MCPサーバー開発の専門家 | `@generate-python-mcp-server` |
| [generate-typescript-mcp-server.agent.md](.github/agents/generate-typescript-mcp-server.agent.md) | TypeScript MCPサーバー開発の専門家 | `@generate-typescript-mcp-server` |
| [prompt-builder.agent.md](.github/agents/prompt-builder.agent.md) | プロンプトエンジニアリングとプロンプト検証システム | `@prompt-builder` |
| [review-cpp14-code.agent.md](.github/agents/review-cpp14-code.agent.md) | AUTOSAR C++14/CERT C++準拠のコードレビュー専門家(Git差分対応) | `@review-cpp14-code` |
| [software-engineer.agent.md](.github/agents/software-engineer.agent.md) | 包括的なソフトウェアエンジニアリング支援 | `@software-engineer` |

### 🎯 Agent Skills

Agent Skillsは、ツール、スクリプト、リソースを含む専門的なワークフローです。Copilotが関連性を判断し、必要に応じて自動的に読み込みます。

| スキル | 説明 | 含まれるリソース |
|--------|------|---------------|
| [python-mcp-development](.github/skills/python-mcp-development/) | Python SDKとFastMCPを使用したMCPサーバー構築ガイド | テンプレート、サンプルコード、テスト例 |
| [typescript-mcp-development](.github/skills/typescript-mcp-development/) | TypeScript SDKとzodを使用したMCPサーバー構築ガイド | プロジェクト設定、基本サーバー、テストパターン |
| [cpp14-code-review](.github/skills/cpp14-code-review/) | AUTOSAR C++14/CERT C++準拠のコードレビュー支援 | Clang-Tidy設定、CI/CD統合、レビューチェックリスト |
| [copilot-customization](.github/skills/copilot-customization/) | Copilotカスタマイゼーションファイルの作成ガイド | プロンプト/エージェント/インストラクション/スキルのテンプレート |

**Agent Skillsの3段階ローディング**:
1. **Level 1 (Discovery)**: Copilotは常にスキルの`name`と`description`を認識
2. **Level 2 (Instructions)**: リクエストに関連する場合、SKILL.mdの本文を読み込み
3. **Level 3 (Resources)**: 必要に応じて、テンプレートやスクリプトなどのリソースにアクセス

**使用方法**: Agent Skillsは自動的に提案されます。明示的に使用する場合は、Copilot Chatでスキル名を参照してください。

### ⚙️ その他のカスタマイゼーション

- [copilot-instructions.md](.github/copilot-instructions.md) - リポジトリ全体に適用されるコードレビュー標準

## 使用方法

### プロンプトファイルの使用

プロンプトファイルを使用するには、GitHub Copilotチャットで以下のように参照します:

```
@workspace Follow instructions in #file:.github/prompts/generate-readme.prompt.md
```

または、特定のコンテキストで:

```
Create a new TypeScript MCP server following #file:.github/prompts/generate-typescript-mcp-server.prompt.md
```

### エージェントの使用

エージェントを呼び出すには、チャットで `@` に続けてエージェント名を入力します:

```
@generate-typescript-mcp-server Help me create a new MCP server with file system tools
```

```
@prompt-builder I need to create a new prompt for generating API documentation
```

### インストラクションの適用

インストラクションファイルは、指定されたファイルタイプで自動的に適用されます。明示的に呼び出す必要はありませんが、特定のインストラクションに従うことを強調したい場合:

```
Create a new Python file following #file:.github/instructions/python.instructions.md
```

### Agent Skillsの使用

Agent Skillsは、関連するタスクに応じてCopilotが自動的に提案します。明示的に使用する場合:

```
I need to create a Python MCP server (自動的に python-mcp-development スキルが提案される)
```

または、スキル内のリソースを直接参照:

```
Use the template in #file:.github/skills/python-mcp-development/templates/basic-server.py
```

スキルに含まれるツールやスクリプトを使用:

```
Help me set up Clang-Tidy for my C++ project using #file:.github/skills/cpp14-code-review/configs/.clang-tidy
```

### カスタマイゼーションファイルの作成

新しいカスタマイゼーションファイルを作成するには:

```
@workspace Follow instructions in #file:.github/prompts/generate-customization-md.prompt.md
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
- **タスク固有のガイドラインは統合**: 特定タスク向けの詳細はエージェントに統合

### エージェントファイル

- **専門性を定義**: エージェントの専門分野と能力を明確に
- **適切なツール**: タスクに必要なツールのみを指定
- **ペルソナ**: 明確な役割と専門知識を定義
- **詳細ガイドライン統合**: 技術標準やチェックリストは📚セクションに統合可能

### Agent Skillsファイル

- **明確な説明**: `description`で能力とユースケースを具体的に記述（最大1024文字）
- **スキル名規約**: 小文字、ハイフン区切り、最大64文字（例: `python-mcp-development`）
- **リソース整理**: テンプレート、サンプル、スクリプトを適切なサブディレクトリに配置
- **段階的開示**: 詳細情報は本文に、リソースは必要時のみ参照される
- **相対パス参照**: スキル内のファイルは相対パス（`./templates/example.py`）で参照
- **自己完結性**: スキルは独立して使用可能な完全なワークフローを提供

### プロンプト+エージェントのペア

- **役割分担**: プロンプト(タスク実行)とエージェント(対話的支援)が相互補完
- **一貫性**: 同じベース名を使用し、プロンプトの`mode`とエージェント名を一致
- **ペア生成**: `@generate-customization-md`で統一的に生成可能みを指定
- **ペルソナ**: 明確な役割と専門知識を定義

## 参考資料

### 公式ドキュメント

- [VS Code プロンプトファイル](https://code.visualstudio.com/docs/copilot/customization/prompt-files)
- [VS Code カスタムインストラクション](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
- [VS Code カスタムエージェント](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [VS Code Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)

### コミュニティリソース

- [Awesome Copilot リポジトリ](https://github.com/github/awesome-copilot)
- [Agent Skills 仕様](https://agentskills.io/)
- [AGENTS.md 公式サイト](https://agents.md/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [MCP Community Skills](https://github.com/anthropics/skills)

### 学習リソース

- [GitHub Copilot Documentation](https://docs.github.com/copilot)
- [VS Code AI Toolkit](https://marketplace.visualstudio.com/items?itemName=ms-windows-ai-studio.windows-ai-studio)

## プロジェクト構造
├── skills/              # Agent Skills（リソース付きワークフロー）
│   │   ├── python-mcp-development/
│   │   │   ├── SKILL.md
│   │   │   ├── templates/
│   │   │   └── examples/
│   │   ├── typescript-mcp-development/
│   │   │   ├── SKILL.md
│   │   │   ├── templates/
│   │   │   └── examples/
│   │   ├── cpp14-code-review/
│   │   │   ├── SKILL.md
│   │   │   ├── configs/
│   │   │   └── checklists/
│   │   └── copilot-customization/
│   │       ├── SKILL.md
│   │       └── templates/
│   
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

### Agent Skillsが認識されない

1. **設定を有効化**: VS Code設定で `chat.useAgentSkills` を有効にする（Insiders版のみ）
2. **配置確認**: スキルが `.github/skills/<skill-name>/SKILL.md` に配置されていることを確認
3. **フロントマター検証**: `name` と `description` フィールドが正しく設定されていることを確認
4. **VS Code再起動**: 設定変更後、VS Codeを再起動
5. **Copilot再読み込み**: コマンドパレットで `GitHub Copilot: Reload Extensions` を実行

### Agent Skillsのリソースが読み込まれない

1. **相対パス確認**: SKILL.md内でリソースを相対パス（`./templates/file.py`）で参照
2. **ファイル存在確認**: 参照しているファイルが実際に存在することを確認
3. **段階的開示**: Copilotは必要に応じてリソースを読み込むため、明示的に参照することで読み込みを促す

---

<div align="center">

**このプロジェクトが役に立ちましたか? GitHubでスターを付けてください! ⭐**

</div>
