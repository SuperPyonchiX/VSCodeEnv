---
description: 'VS Code Copilotカスタマイズファイル(Instructions/Prompts/Agents/Skills)を目的に応じて生成'
agent: 'generate-customization-md'
tools: ['vscode', 'execute', 'read', 'edit', 'search', 'web', 'agent', 'todo']
argument-hint: '実現したい目的と生成したいファイルタイプを説明してください'
---

# VS Code Copilot カスタマイズファイル生成

ユーザーの目的に応じて、以下の5種類のカスタマイズファイルを生成します:

| ファイル種類 | 拡張子 | 配置場所 | 役割 | 適用方法 |
|-------------|--------|---------|------|---------|
| **Instructions** | `.instructions.md` | `.github/instructions/` | コーディング標準・ガイドライン | `applyTo`パターンで自動適用 |
| **Copilot Instructions** | `copilot-instructions.md` | `.github/` | プロジェクト全体のルール | 全チャットに自動適用 |
| **Prompts** | `.prompt.md` | `.github/prompts/` | オンデマンド実行タスク | `/`コマンドで呼び出し |
| **Agents** | `.agent.md` | `.github/agents/` | 専門家ペルソナ | `@`でエージェント切替 |
| **Skills** | `SKILL.md` | `.github/skills/*/` | 再利用可能な能力 | 自動検出・オンデマンド |

## 📥 必須入力

- `${input:userGoal:実現したい目的を詳しく説明してください}`: 実現したい目的の詳細
- `${input:fileType:生成するファイルタイプ(instructions/prompt/agent/skill/all)}`: 生成対象

### 利用可能な変数

| 変数 | 説明 |
|------|------|
| `${input:name:placeholder}` | ユーザー入力を要求 |
| `${selection}`, `${selectedText}` | 現在のエディタ選択範囲 |
| `${file}`, `${fileBasename}` | 現在のファイル情報 |
| `${workspaceFolder}` | ワークスペースのルートパス |
| `${fileDirname}` | 現在のファイルのディレクトリ |

## 📋 実行ステップ

### ステップ 1: 目的分析とファイルタイプ決定

#### 1.1 公式ドキュメント参照(必須)
以下の公式ドキュメントを参照して最新仕様を確認:
- [Prompt Files](https://code.visualstudio.com/docs/copilot/customization/prompt-files)
- [Custom Instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
- [Custom Agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)

#### 1.2 ファイルタイプ選択ガイド

| 目的 | 推奨ファイルタイプ |
|------|-------------------|
| プロジェクト全体のコーディング規約 | `copilot-instructions.md` |
| 特定ファイルタイプへの自動適用ルール | `.instructions.md` + `applyTo` |
| 繰り返し実行するタスクの自動化 | `.prompt.md` |
| 対話的な専門家として相談 | `.agent.md` |
| 複数ツール間で共有する能力 | `SKILL.md` |
| タスク+相談の両方が必要 | `.prompt.md` + `.agent.md`ペア |

#### 1.3 目的の分析
1. ユーザー目的 `${input:userGoal}` を分析
2. 対象技術スタック(言語/フレームワーク)を特定
3. 最適なファイルタイプの組み合わせを決定

### ステップ 2: ファイル生成

#### 2.1 Instructions ファイル生成 (`.instructions.md`)
**ファイル**: `.github/instructions/[topic].instructions.md`

**フロントマター要件**:
```yaml
---
description: 'このInstructionsの目的(シングルクォート必須)'
name: 'UI表示名(オプション)'
applyTo: '**/*.py'  # 自動適用するglobパターン(オプション)
---
```

**フロントマターフィールド**:
| フィールド | 必須 | 説明 |
|-----------|------|------|
| `description` | Yes | Instructionsの簡潔な説明 |
| `name` | No | UI表示名(未指定時はファイル名) |
| `applyTo` | No | 自動適用するglobパターン(`**`で全ファイル) |

**ベストプラクティス**:
- 短く自己完結した指示を記述
- 言語/フレームワーク固有のルールを定義
- `applyTo`で適切なスコープを設定

#### 2.2 Copilot Instructions ファイル生成
**ファイル**: `.github/copilot-instructions.md`

**特徴**:
- フロントマター不要
- プロジェクト全体に自動適用
- VS Code、Visual Studio、GitHub.comで共通利用可能

#### 2.3 プロンプトファイル生成 (`.prompt.md`)
**ファイル**: `.github/prompts/[ベース名].prompt.md`

**フロントマター要件**:
```yaml
---
description: '具体的なタスクの説明(シングルクォート必須)'
name: 'プロンプト名(オプション)'
argument-hint: 'ユーザーへの入力ヒント(オプション)'
agent: '[エージェント名]'  # 使用するエージェント(オプション)
model: 'claude-sonnet-4.5'  # 使用モデル(オプション)
tools: ['vscode', 'edit', 'read']  # 利用可能ツール(オプション)
---
```

**フロントマターフィールド**:
| フィールド | 必須 | 説明 |
|-----------|------|------|
| `description` | Yes | プロンプトの簡潔な説明 |
| `name` | No | `/`コマンド後の表示名 |
| `argument-hint` | No | 入力フィールドのプレースホルダー |
| `agent` | No | `ask`, `edit`, `agent`, またはカスタムエージェント名 |
| `model` | No | 使用するAIモデル |
| `tools` | No | 利用可能なツールのリスト |

**命名規則**: `generate-*`, `analyze-*`, `refactor-*`, `optimize-*`, `review-*`

#### 2.4 エージェントファイル生成 (`.agent.md`)
**ファイル**: `.github/agents/[ベース名].agent.md`

**フロントマター要件**:
```yaml
---
description: 'エージェントの役割と専門性(シングルクォート必須)'
name: 'エージェント名(オプション)'
argument-hint: '入力ヒント(オプション)'
tools: ['vscode', 'edit', 'execute', 'read', 'search', 'web']
model: 'claude-sonnet-4.5'  # 使用モデル(オプション)
target: 'vscode'  # 'vscode' | 'github-copilot'(オプション)
infer: true  # サブエージェントとして使用可能か(オプション)
mcp-servers:  # MCPサーバー設定(オプション)
  - name: 'server-name'
handoffs:  # エージェント連鎖(推奨)
  - label: '次のステップへ'
    agent: 'next-agent'
    prompt: '続きを実行してください'
    send: false
---
```

**フロントマターフィールド**:
| フィールド | 必須 | 説明 |
|-----------|------|------|
| `description` | Yes | エージェントの簡潔な説明 |
| `name` | No | ドロップダウンの表示名 |
| `argument-hint` | No | チャット入力のヒントテキスト |
| `tools` | No | 利用可能なツールのリスト |
| `model` | No | 使用するAIモデル |
| `target` | No | 実行環境(`vscode`または`github-copilot`) |
| `infer` | No | サブエージェントとして使用可能か(デフォルト`true`) |
| `mcp-servers` | No | MCPサーバー設定(target: github-copilot用) |
| `handoffs` | No | 他エージェントへの遷移定義 |

**handoffsフィールド詳細**:
| フィールド | 必須 | 説明 |
|-----------|------|------|
| `label` | Yes | ハンドオフボタンのテキスト |
| `agent` | Yes | 遷移先エージェント識別子 |
| `prompt` | Yes | 遷移先に送信するプロンプト |
| `send` | No | 自動送信するか(デフォルト`false`) |

#### 2.5 Skillファイル生成 (`SKILL.md`)
**ファイル**: `.github/skills/[skill-name]/SKILL.md`

**フロントマター要件**:
```yaml
---
name: skill-name  # 必須: 小文字、ハイフン区切り、64文字以内
description: 'スキルの説明と使用タイミング(最大1024文字)'  # 必須
---
```

**フロントマターフィールド**:
| フィールド | 必須 | 説明 |
|-----------|------|------|
| `name` | Yes | 小文字、ハイフン区切り、最大64文字 |
| `description` | Yes | 能力と使用ケースの説明、最大1024文字 |

**ディレクトリ構造**:
```
.github/skills/[skill-name]/
├── SKILL.md           # 必須: スキル定義
├── templates/         # オプション: テンプレートファイル
├── examples/          # オプション: 使用例
└── scripts/           # オプション: 実行スクリプト
```

**Skills vs Instructions**:
| 観点 | Skills | Instructions |
|------|--------|--------------|
| 目的 | 特化した能力とワークフロー | コーディング標準とガイドライン |
| ポータビリティ | VS Code, CLI, coding agent | VS Code, GitHub.comのみ |
| 内容 | 指示、スクリプト、例、リソース | 指示のみ |
| スコープ | タスク固有、オンデマンド | 常時適用またはglobパターン |
| 標準 | オープン標準(agentskills.io) | VS Code固有 |

### ステップ 3: 統合と検証
1. ファイル間の参照を確認(Markdownリンクで相互参照)
2. 一貫した用語を使用
3. ツール参照は `#tool:<tool-name>` 構文を使用
4. 必要に応じてInstructionsへの参照を含める

## 🛠️ ツール戦略

### ツール優先順位(重要)
1. **プロンプトの`tools`** → タスク実行時に最優先
2. **参照エージェントの`tools`** → プロンプトの`agent`で指定
3. **デフォルトツール** → 上記が未指定の場合

### フェーズ別推奨ツールセット

| フェーズ | 推奨ツール | 用途 |
|---------|----------|------|
| リサーチ | `read`, `search`, `web`, `fetch/*` | 情報収集(編集権限なし) |
| 設計 | `vscode`, `read`, `search`, `todo` | ファイル構造把握、計画立案 |
| 実装 | `vscode`, `edit`, `read`, `search` | ファイル作成・編集 |
| 検証 | `read`, `search`, `execute` | 品質チェック、テスト実行 |

### MCPサーバーツール指定
MCPサーバーの全ツールを含める場合: `<server-name>/*`

## 📂 ファイル配置

```
.github/
├── copilot-instructions.md          # プロジェクト全体ルール
├── instructions/
│   └── [topic].instructions.md      # 条件付き自動適用ルール
├── prompts/
│   └── [task-name].prompt.md        # オンデマンドタスク
├── agents/
│   └── [agent-name].agent.md        # 専門家ペルソナ
└── skills/
    └── [skill-name]/
        ├── SKILL.md                  # スキル定義
        ├── templates/                # テンプレート
        └── examples/                 # 使用例
```

## ✅ 成功基準

### ファイルタイプ別チェックリスト

#### Instructions (`.instructions.md`)
- [ ] `description` がシングルクォートで囲まれている
- [ ] `applyTo` パターンが適切(自動適用する場合)
- [ ] 短く自己完結した指示
- [ ] 特定のファイルタイプ/タスクに限定

#### Copilot Instructions (`copilot-instructions.md`)
- [ ] `.github/` ディレクトリ直下に配置
- [ ] プロジェクト全体に適用される汎用ルール
- [ ] フロントマターなし(Markdown本文のみ)

#### Prompt (`.prompt.md`)
- [ ] `description` がシングルクォートで囲まれている
- [ ] ファイル名がケバブケースで動詞で始まる
- [ ] ワークフローが明確でステップバイステップ
- [ ] `agent`指定時はエージェントファイル名と一致

#### Agent (`.agent.md`)
- [ ] `description` がシングルクォートで囲まれている
- [ ] ペルソナが明確に定義されている
- [ ] ツールセットが最小権限の原則に従う
- [ ] `handoffs`で次のステップを定義(推奨)

#### Skill (`SKILL.md`)
- [ ] `name` が小文字・ハイフン区切り・64文字以内
- [ ] `description` が能力と使用ケースを明確に記述
- [ ] 独自ディレクトリに配置
- [ ] 関連リソース(スクリプト、例)を含む(推奨)

### 全体チェック
- [ ] 生成したファイルタイプが目的に適切
- [ ] ファイル間の参照が有効
- [ ] 一貫した用語を使用

## 📚 参考

### 公式ドキュメント
- [Prompt Files](https://code.visualstudio.com/docs/copilot/customization/prompt-files)
- [Custom Instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
- [Custom Agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- [Agent Skills標準仕様](https://agentskills.io/)
- [Subagents (実験的)](https://code.visualstudio.com/docs/copilot/chat/chat-sessions#_subagents)

### コミュニティリソース
- [Awesome Copilot](https://github.com/github/awesome-copilot)
- [Anthropic Skills](https://github.com/anthropics/skills)

### 内部ガイドライン
必要に応じて以下のInstructionsファイルを作成:
- `.github/instructions/prompt.instructions.md` - プロンプトファイルガイドライン
- `.github/instructions/instructions.instructions.md` - Instructionsファイルガイドライン
- `.github/instructions/markdown.instructions.md` - Markdownガイドライン

## 💡 使用例

### 例1: Instructions - Python コーディング標準

**ファイル**: `.github/instructions/python-standards.instructions.md`

```yaml
---
description: 'Pythonファイルのコーディング標準'
applyTo: '**/*.py'
---
# Pythonコーディング標準

- PEP 8スタイルガイドに従う
- 関数には型ヒントを含める
- docstringはGoogle形式を使用
- インデントは4スペース
```

### 例2: Prompt + Agent ペア - API開発

**プロンプト**: `.github/prompts/generate-api-endpoints.prompt.md`

```yaml
---
description: 'RESTful APIエンドポイントを自動生成'
agent: 'generate-api-endpoints'
tools: ['vscode', 'edit', 'read', 'search']
---
# APIエンドポイント生成

## 入力
- `${input:resourceName:リソース名を入力}`: 作成するリソース名

## 実行ステップ
1. リソースのCRUD操作を分析
2. エンドポイント設計を生成
3. コードを実装
```

**エージェント**: `.github/agents/generate-api-endpoints.agent.md`

```yaml
---
description: 'RESTful API設計の専門家'
tools: ['vscode', 'edit', 'read', 'search', 'web']
handoffs:
  - label: 'APIテストを生成'
    agent: 'generate-api-tests'
    prompt: '上記のAPIエンドポイントのテストを生成してください'
    send: false
---
# API設計エキスパート

あなたはRESTful API設計の専門家です。
OpenAPI仕様、セキュリティベストプラクティス、
パフォーマンス最適化に精通しています。
```

### 例3: Skill - Webアプリテスト

**ファイル**: `.github/skills/webapp-testing/SKILL.md`

```yaml
---
name: webapp-testing
description: 'Webアプリケーションのテスト生成と実行。ユニットテスト、統合テスト、E2Eテストのパターンを提供。テスト戦略の相談や既存テストの改善時に使用。'
---
# Webアプリテストスキル

## 能力
- Jest/Vitestでのユニットテスト生成
- Playwright/CypressでのE2Eテスト生成
- テストカバレッジ分析

## 使用方法
テスト対象のコードを指定すると、適切なテストを生成します。

## リソース
- `./templates/` - テストテンプレート
- `./examples/` - 使用例
```

### 例4: 使い分けガイド

| 目的 | 使用コマンド | ファイルタイプ |
|------|-------------|---------------|
| Pythonファイル編集時に自動でPEP8準拠 | 自動適用 | `.instructions.md` |
| APIエンドポイントを今すぐ生成 | `/generate-api-endpoints` | `.prompt.md` |
| API設計について相談 | `@generate-api-endpoints` | `.agent.md` |
| テスト戦略を複数ツールで共有 | 自動検出 | `SKILL.md` |

## 💡 Tips

- **Instructions**: 特定ファイルタイプに自動適用したいルールに使用
- **Prompts**: 繰り返し実行する具体的なタスクに使用
- **Agents**: 対話的な相談や複雑な判断が必要な場合に使用
- **Skills**: 複数のAIツール間で共有したい能力に使用
- **ペア設計**: タスク実行(Prompt) + 相談(Agent)の組み合わせが効果的

