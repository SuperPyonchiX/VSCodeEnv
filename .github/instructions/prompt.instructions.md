---
description: 'GitHub Copilot prompt file creation guidelines'
applyTo: '**/*.prompt.md'
---

# プロンプトファイル作成規約

## ファイル構造

プロンプトファイルは以下の構造に従う必要があります:

```markdown
---
mode: 'ask'  # または 'agent'
description: '説明文（シングルクォート）'
tools: ['vscode', 'read', 'edit', 'search']
model: 'claude-sonnet-4.5'
---

# プロンプトタイトル

プロンプト本文
```

## Front Matter必須項目

### mode（必須）

- `'ask'`: 単発の質問・情報取得
- `'agent'`: 自律的なタスク実行

### description（必須）

- シングルクォートで囲む
- 簡潔で明確な説明（最大200文字程度）
- 何ができるかを具体的に記述

## Front Matterオプション項目

### tools

使用するツールを配列で指定:
- `vscode`: VS Code機能
- `read`: ファイル読み取り
- `edit`: ファイル編集
- `search`: コード検索
- `web-search`: Web検索
- `agent`: サブエージェント呼び出し

### model

推奨モデルを指定:
- `'claude-sonnet-4.5'`（推奨）
- その他のサポートモデル

### argument-hint

ユーザー入力のヒント文を指定

## プロンプト本文の構成

### 推奨セクション

1. **目的**: 何を達成するか
2. **手順**: 段階的な実行ステップ
3. **期待される出力**: 結果の形式
4. **例**: 具体的な使用例

### 変数の使用

ユーザー入力を受け取る場合:

```markdown
${input:変数名}
```

**例**:
```markdown
対象ファイル: ${input:targetFile}
フォーカス領域: ${input:focusArea}
```

## ベストプラクティス

- 明確で具体的な指示を記述
- 段階的な手順を提供
- 出力形式を明示
- エッジケースへの対処を含める
- 関連するエージェントやスキルへの参照を追加

## 命名規約

- 小文字、ハイフン区切り
- 拡張子: `.prompt.md`
- 配置場所: `.github/prompts/`

**良い例**:
- `generate-tests.prompt.md`
- `review-security.prompt.md`
- `analyze-performance.prompt.md`

**悪い例**:
- `GenerateTests.prompt.md`
- `generate_tests.prompt.md`
- `tests.md`

## 禁止事項

- ダブルクォートの使用（Front Matterではシングルクォート）
- 空のdescription
- 曖昧な指示
- `mode`フィールドの省略

## サンプル

```markdown
---
mode: 'agent'
description: 'コードのセキュリティ脆弱性を分析し、修正提案を生成'
tools: ['vscode', 'read', 'search']
model: 'claude-sonnet-4.5'
argument-hint: '分析対象のファイルまたはディレクトリ'
---

# セキュリティ脆弱性分析

## 目的

指定されたコードをセキュリティ観点から分析し、脆弱性を特定して修正案を提示します。

## 手順

1. 対象ファイルを読み込む
2. OWASP Top 10に基づく脆弱性をチェック
3. 発見された問題を重大度別に分類
4. 各問題の修正案を提示

## 期待される出力

- 脆弱性リスト（重大度付き）
- 各脆弱性の説明
- 修正コード例
- 予防策の提案

## 入力

分析対象: ${input:targetPath}
```

## 検証チェックリスト

- [ ] Front matterが`---`で囲まれている
- [ ] `mode`フィールドが存在
- [ ] `description`がシングルクォートで囲まれている
- [ ] ファイル名が命名規約に準拠
- [ ] 本文に明確な目的と手順がある
