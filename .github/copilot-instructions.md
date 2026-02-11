# GitHub Copilot カスタマイゼーションコレクション

## プロジェクト概要

このリポジトリは、GitHub Copilotの機能を最大限に活用するための高品質なカスタマイゼーションファイルのコレクションです。プロンプト、インストラクション、エージェント、Agent Skillsを提供し、VS Code環境でのAI支援開発を強化します。

## 技術スタック

- **対応言語**: Python, TypeScript/JavaScript, C/C++, Markdown
- **フレームワーク**: MCP (Model Context Protocol), FastMCP, zod
- **ツール**: ESLint, Prettier, Clang-Tidy, Cppcheck
- **規格**: AUTOSAR C++14, CERT C++, PEP8

## ディレクトリ構造

```
.github/
├── agents/           # カスタムエージェント（対話型専門家）
├── instructions/     # ファイルタイプ別自動適用ルール
├── prompts/          # タスク実行レシピ
├── skills/           # Agent Skills（リソース付きワークフロー）
│   ├── copilot-customization/
│   ├── cpp14-code-review/
│   ├── markdown-explanation-doc/
│   ├── markdown-procedure-doc/
│   ├── python-mcp-development/
│   └── typescript-mcp-development/
└── copilot-instructions.md  # このファイル（リポジトリ全体の指示）
```

---

以下の指示は、コードレビューを実行する際に適用されます。

## README の更新

* [ ] 新しいファイルは `README.md` に追加する必要があります。

## 参考資料
- [VS Code プロンプトファイル](https://code.visualstudio.com/docs/copilot/customization/prompt-files)
- [VS Code インストラクションファイル](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
- [VS Code カスタムエージェントファイル](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [VS Code Agent Skills ドキュメント](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- [Agent Skills 仕様](https://agentskills.io/)
- [Awesome Copilot リポジトリ](https://github.com/github/awesome-copilot) (コミュニティ貢献の例)
- [AGENTS.md 公式サイト](https://agents.md/)
