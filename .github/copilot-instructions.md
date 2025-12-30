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
└── copilot-instructions.md  # このファイル（リポジトリ全体の指示）
```

---

以下の指示は、コードレビューを実行する際に適用されます。

## README の更新

* [ ] 新しいファイルは `README.md` に追加する必要があります。

## プロンプトファイルガイド

**`.prompt.md` で終わるファイルにのみ適用**

* [ ] プロンプトに markdown front matter が含まれていること。
* [ ] プロンプトに `agent` または `ask` のいずれかが指定された `mode` フィールドがあること。
* [ ] プロンプトに `description` フィールドがあること。
* [ ] `description` フィールドが空でないこと。
* [ ] `description` フィールドの値がシングルクォートで囲まれていること。
* [ ] ファイル名が小文字で、単語がハイフンで区切られていること。
* [ ] `tools` の使用を推奨すること(必須ではない)。
* [ ] プロンプトが最適化されているモデルを指定するために `model` の使用を強く推奨すること。

## インストラクションファイルガイド

**`.instructions.md` で終わるファイルにのみ適用**

* [ ] インストラクションに markdown front matter が含まれていること。
* [ ] インストラクションに `description` フィールドがあること。
* [ ] `description` フィールドが空でないこと。
* [ ] `description` フィールドの値がシングルクォートで囲まれていること。
* [ ] ファイル名が小文字で、単語がハイフンで区切られていること。
* [ ] インストラクションが適用されるファイルを指定する `applyTo` フィールドがあること。複数のファイルパスを指定する場合は `'**.js, **.ts'` のような形式にすること。

## エージェントファイルガイド

**`.agent.md` で終わるファイルにのみ適用**

* [ ] エージェントに markdown front matter が含まれていること。
* [ ] エージェントに `description` フィールドがあること。
* [ ] `description` フィールドが空でないこと。
* [ ] `description` フィールドの値がシングルクォートで囲まれていること。
* [ ] ファイル名が小文字で、単語がハイフンで区切られていること。
* [ ] `tools` の使用を推奨すること(必須ではない)。
* [ ] エージェントが最適化されているモデルを指定するために `model` の使用を強く推奨すること。

## 参考資料
- [VS Code プロンプトファイル](https://code.visualstudio.com/docs/copilot/customization/prompt-files)
- [VS Code インストラクションファイル](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
- [VS Code カスタムエージェントファイル](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [VS Code Agent Skills ドキュメント](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- [Awesome Copilot リポジトリ](https://github.com/github/awesome-copilot) (コミュニティ貢献の例)
- [AGENTS.md 公式サイト](https://agents.md/)
