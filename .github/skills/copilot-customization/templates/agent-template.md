---
description: 'エージェントの説明（シングルクォート）'
name: 'agent-name'  # オプション: UI表示名（未指定時はファイル名）
tools: ['codebase', 'terminalCommand', 'editFiles', 'search']  # オプション
model: 'claude-sonnet-4.5'  # 推奨
infer: true  # オプション: サブエージェントとして使用（デフォルト: true）
target: 'vscode'  # オプション: vscode または github-copilot
handoffs:  # オプション: エージェント間の遷移定義
  - label: '関連プロンプトを実行'
    agent: 'agent-name'
    prompt: 'プロンプトの説明'
    send: false
---

# エージェント名

エージェントの詳細な説明と役割を記述します。

## 専門領域

- 専門分野1
- 専門分野2
- 専門分野3

## 能力

### 主要機能1
機能の詳細説明

### 主要機能2
機能の詳細説明

## ワークフロー

```
ユーザー入力 → 分析 → 実装 → 検証 → 報告
```

## 使用例

具体的な使用ケースを記述。

## 関連リソース

- リソース1へのリンク
- リソース2へのリンク
