# CLAUDE.md

このファイルは、Claude Codeがプロジェクトを理解するためのガイドである。

## プロジェクト概要

**VSCodeEnv**は、GitHub CopilotとClaude Codeのカスタマイゼーションコレクションである。AI支援開発を強化するための高品質なファイルセットを提供する。

### 提供コンポーネント

| 種類 | 数量 | 用途 |
|------|------|------|
| プロンプト | 7個 | タスク実行用の再利用可能レシピ |
| エージェント | 8個 | 対話型の専門家アシスタント |
| インストラクション | 7個 | ファイルタイプ別の自動ルール適用 |
| スキル | 4個 | リソース付きの完全ワークフロー |

### 対応技術

- Python（MCP開発、PEP8準拠）
- TypeScript/JavaScript（MCP開発、ESLint/Prettier）
- C/C++（AUTOSAR C++14、CERT C++）
- Markdown（技術文書作成）

## ディレクトリ構造

```
VSCodeEnv/
├── .github/                        # Copilotカスタマイゼーション
│   ├── agents/                     # 対話型エージェント
│   ├── instructions/               # ファイルタイプ別ルール
│   ├── prompts/                    # タスク実行レシピ
│   ├── skills/                     # Agent Skills
│   │   ├── python-mcp-development/
│   │   ├── typescript-mcp-development/
│   │   ├── cpp14-code-review/
│   │   ├── markdown-documentation/
│   │   └── copilot-customization/
│   └── copilot-instructions.md     # リポジトリ全体のルール
├── .claude/                        # Claude Code設定
│   ├── skills/                     # ローカルスキル（.githubと同期）
│   └── settings.local.json         # 権限設定
├── README.md                       # 詳細ドキュメント
└── CLAUDE.md                       # このファイル
```

## 主要スキル

### python-mcp-development
FastMCPフレームワークを使用したPython MCPサーバーの開発ガイド。テンプレート、設定ファイル、テスト例を提供。

### typescript-mcp-development
TypeScript SDKとzodバリデーションを使用したMCPサーバー開発ガイド。Express統合、STDIO/HTTPトランスポート対応。

### cpp14-code-review
AUTOSAR C++14およびCERT C++コーディング規約に準拠したコードレビュー支援。Clang-Tidy設定、GitHub Actions CI設定、チェックリストを提供。

### markdown-documentation
Markdown形式の技術文書作成ガイド。6種類のテンプレート（説明資料、手順書、提案書、報告書、会議議事録、FAQ）とMermaid図解リファレンスを含む。

## 開発ガイドライン

### 命名規則

| ファイル種別 | 命名パターン | 例 |
|-------------|-------------|-----|
| プロンプト | `<action>-<target>.prompt.md` | `generate-python-mcp-server.prompt.md` |
| エージェント | `<action>-<target>.agent.md` | `review-cpp14-code.agent.md` |
| インストラクション | `<language>.instructions.md` | `python.instructions.md` |
| スキル | `<skill-name>/SKILL.md` | `python-mcp-development/SKILL.md` |

### 新規コンポーネント作成手順

1. `.github/skills/copilot-customization/templates/`のテンプレートを参照
2. 適切なディレクトリにファイルを作成
3. Claude Code用スキルは`.claude/skills/`にも配置（必要に応じて）

### スキル構成

```
<skill-name>/
├── SKILL.md          # スキル定義（必須）
├── templates/        # テンプレートファイル
├── examples/         # 使用例
├── configs/          # 設定ファイル
└── checklists/       # チェックリスト
```

## よく使うコマンド

### Claude Codeでのスキル呼び出し

```
# スキル実行
/python-mcp-development
/typescript-mcp-development
/cpp14-code-review
/markdown-documentation
```

### GitHub Copilotでの使用

- **プロンプト**: Copilot Chatで`#<prompt-name>`で参照
- **エージェント**: `@workspace`でエージェントファイルを参照
- **インストラクション**: ファイルタイプに応じて自動適用

## 注意事項

- `.github/`と`.claude/skills/`のスキルは同じ内容を維持する
- 新しいカスタマイゼーション追加時はREADME.mdも更新する
- C++コードレビューはAUTOSAR C++14規約に厳密に従う
