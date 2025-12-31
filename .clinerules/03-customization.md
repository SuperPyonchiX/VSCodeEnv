# カスタマイゼーション作成ガイド

## 命名規則

| ファイル種別 | 命名パターン | 例 |
|-------------|-------------|-----|
| プロンプト | `<action>-<target>.prompt.md` | `generate-python-mcp-server.prompt.md` |
| エージェント | `<action>-<target>.agent.md` | `review-cpp14-code.agent.md` |
| インストラクション | `<language>.instructions.md` | `python.instructions.md` |
| スキル | `<skill-name>/SKILL.md` | `python-mcp-development/SKILL.md` |

## プロンプト作成

### 配置場所
`.github/prompts/`

### 構成要素
1. タイトルと概要
2. 入力パラメータ
3. 実行手順
4. 出力形式
5. 注意事項

## エージェント作成

### 配置場所
`.github/agents/`

### 構成要素
1. エージェント名と役割
2. 専門領域
3. 対話スタイル
4. 使用するツール
5. 制約事項

## インストラクション作成

### 配置場所
`.github/instructions/`

### 構成要素
1. 対象ファイルタイプ
2. コーディング規約
3. 推奨パターン
4. 禁止事項

## スキル作成

### 配置場所
- Copilot: `.github/skills/<skill-name>/`
- Claude Code: `.claude/skills/<skill-name>/`

### ディレクトリ構成
```
<skill-name>/
├── SKILL.md          # スキル定義（必須）
├── templates/        # テンプレートファイル
├── examples/         # 使用例
├── configs/          # 設定ファイル
└── checklists/       # チェックリスト
```

### SKILL.mdの構成
1. スキル名と説明
2. トリガー条件
3. 提供リソース
4. 実行フロー
