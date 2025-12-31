# プロジェクト概要

## VSCodeEnvとは

GitHub CopilotとClaude Codeのカスタマイゼーションコレクション。AI支援開発を強化するための高品質なファイルセットを提供する。

## 提供コンポーネント

| 種類 | 数量 | 用途 |
|------|------|------|
| プロンプト（.prompt.md） | 7個 | タスク実行用の再利用可能レシピ |
| エージェント（.agent.md） | 8個 | 対話型の専門家アシスタント |
| インストラクション（.instructions.md） | 7個 | ファイルタイプ別の自動ルール適用 |
| スキル（SKILL.md） | 4個 | リソース付きの完全ワークフロー |

## ディレクトリ構造

```
VSCodeEnv/
├── .github/                        # Copilotカスタマイゼーション
│   ├── agents/                     # 対話型エージェント
│   ├── instructions/               # ファイルタイプ別ルール
│   ├── prompts/                    # タスク実行レシピ
│   ├── skills/                     # Agent Skills
│   └── copilot-instructions.md     # リポジトリ全体のルール
├── .claude/                        # Claude Code設定
│   └── skills/                     # ローカルスキル
├── .clinerules/                    # CLINEルール（このフォルダ）
├── README.md                       # 詳細ドキュメント
└── CLAUDE.md                       # Claude Code用ガイド
```

## 対応技術

- **Python**: PEP8準拠、FastMCP、型ヒント
- **TypeScript/JavaScript**: ESLint、Prettier、zod
- **C/C++**: AUTOSAR C++14、CERT C++、Clang-Tidy
- **Markdown**: 技術文書作成、Mermaid図解
