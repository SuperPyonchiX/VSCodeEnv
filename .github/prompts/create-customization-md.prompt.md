---
description: 'ユーザー目的から2つのタスク自動化ファイル(プロンプト+エージェントのペア)を生成'
mode: 'create-customization-md'
---

# タスク自動化ペア生成

ユーザーの目的を受け取り、以下の2つのファイルをペアで生成します:

1. **プロンプトファイル** (.prompt.md): タスク実行レシピ
2. **エージェントファイル** (.agent.md): 対話的な専門家

## 📥 必須入力

- `${input:userGoal}`: 実現したい目的の詳細

## 📋 実行ステップ

### ステップ 1: 目的分析
1. ユーザー目的 `${input:userGoal}` を分析
2. 対象技術スタック(言語/フレームワーク)を特定
3. 各ファイルの役割を決定:
   - **プロンプト**: 具体的なタスク実行手順
   - **エージェント**: 対話的な専門知識の提供

### ステップ 2: ファイル生成
1. **プロンプト**: `.github/prompts/[ベース名].prompt.md` を作成
   - 命名: `create-*`, `analyze-*`, `refactor-*`, `optimize-*`
   - `mode`: 生成するエージェントファイル名(拡張子なし)を指定
   - `tools`: 必要最小限のツールのみ指定

2. **エージェント**: `.github/agents/[ベース名].agent.md` を作成
   - **プロンプトと同じベース名を使用**
   - ファイル名はプロンプトの `mode` と一致させる
   - ペルソナと専門性を明確に定義
   - `tools`: プロンプトをサポートするためのツールを指定

### ステップ 3: 統合と検証
1. プロンプトとエージェント間の連携を確認
2. 一貫した用語を使用
3. 必要に応じてInstructionsへの参照を含める

## 📂 ファイル配置

```
.github/
├── agents/
│   └── [descriptive-name].agent.md
└── prompts/
    └── [descriptive-name].prompt.md
```

**注意**: Instructionsファイルは汎用的なコーディング標準なので、タスク固有のペアとは別に慎重に設計してください。

## ✅ 成功基準

- [ ] 2ファイルすべて生成済み(プロンプト+エージェント)
- [ ] フロントマター完全(description, mode, tools)
- [ ] ケバブケース命名
- [ ] プロンプトの`mode`とエージェントファイル名が一致
- [ ] 役割が明確で重複なし
- [ ] Instructionsファイルは生成していない

## 📚 参考

公式ドキュメント:
- [Prompt Files](https://code.visualstudio.com/docs/copilot/customization/prompt-files)
- [Custom Instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
- [Custom Agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)

## 💡 使用例

**入力**: "REST APIの開発を効率化したい"

**生成ファイル**:
1. `create-api-endpoints.prompt.md` - APIエンドポイント生成タスク
2. `create-api-endpoints.agent.md` - API設計の専門家

**使い方**:
- タスク実行: `#create-api-endpoints`
- 相談: `@create-api-endpoints`

