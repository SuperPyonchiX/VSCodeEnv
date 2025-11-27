---
description: 'ユーザー目的から3つのカスタマイゼーションファイル(プロンプト・インストラクション・エージェント)を統合的に生成'
mode: 'create-customization-md'
---

# 統合カスタマイゼーションスイート生成

ユーザーの目的を受け取り、以下の3つのファイルを生成します:

1. **プロンプトファイル** (.prompt.md): タスク実行レシピ
2. **インストラクションファイル** (.instructions.md): ファイルタイプ別のルール
3. **エージェントファイル** (.agent.md): 対話的な専門家

## 📥 必須入力

- `${input:userGoal}`: 実現したい目的の詳細

## 📋 実行ステップ

### ステップ 1: 目的分析
1. ユーザー目的 `${input:userGoal}` を分析
2. 対象技術スタック(言語/フレームワーク)を特定
3. 各ファイルの役割を決定:
   - **プロンプト**: 具体的なタスク実行手順
   - **インストラクション**: 自動適用されるルール集
   - **エージェント**: 対話的な専門知識の提供

### ステップ 2: ファイル生成
1. **プロンプト**: `.github/prompts/[動詞-名詞].prompt.md` を作成
   - `mode`: `ask` / `edit` / `agent` から選択
   - `tools`: 最小限のツールのみ指定
   
2. **インストラクション**: `.github/instructions/[技術名-用途].instructions.md` を作成
   - `applyTo`: 適用対象のglobパターン指定
   
3. **エージェント**: `.github/agents/[領域-役割].agent.md` を作成
   - ペルソナと専門性を明確に定義

### ステップ 3: 統合と検証
1. ファイル間の相互参照を設定
2. 一貫した用語を使用
3. すべてのリンクの有効性を確認

## 📂 ファイル配置

```
.github/
├── agents/
│   └── [descriptive-name].agent.md
├── prompts/
│   └── [descriptive-name].prompt.md
└── instructions/
    └── [descriptive-name].instructions.md
```

## ✅ 成功基準

- [ ] 3ファイルすべて生成済み
- [ ] フロントマター完全(description, mode/applyTo, tools)
- [ ] ケバブケース命名
- [ ] 相互参照リンク有効
- [ ] 役割が明確で重複なし

## 📚 参考

詳細なガイドライン: [統合ガイドライン](../instructions/create-customization-md.instructions.md)

公式ドキュメント:
- [Prompt Files](https://code.visualstudio.com/docs/copilot/customization/prompt-files)
- [Custom Instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
- [Custom Agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)

## 💡 使用例

**入力**: "REST APIの開発を効率化したい"

**生成ファイル**:
1. `generate-api-endpoints.prompt.md` - APIエンドポイント生成
2. `rest-api-standards.instructions.md` - RESTful API設計ガイドライン
3. `api-architect.agent.md` - API設計の専門家

