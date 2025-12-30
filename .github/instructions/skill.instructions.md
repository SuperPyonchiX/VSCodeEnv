---
description: 'GitHub Copilot Agent Skills file creation guidelines'
applyTo: '**/SKILL.md'
---

# Agent Skillsファイル作成規約

## ファイル構造

Agent Skillsは以下のディレクトリ構造に従う必要があります:

```
.github/skills/
  └── skill-name/
      ├── SKILL.md          # メインスキルファイル（必須）
      ├── templates/        # テンプレートファイル
      ├── examples/         # サンプルコード
      ├── configs/          # 設定ファイル
      └── scripts/          # 実行スクリプト
```

## SKILL.mdの構造

```markdown
---
name: skill-name
description: スキルの詳細な説明（最大1024文字）
---

# スキルタイトル

スキルの詳細説明
```

## Front Matter必須項目

### name（必須）

- 小文字、ハイフン区切り
- 最大64文字
- ユニークな識別子

### description（必須）

- 最大1024文字
- 何ができるかを具体的に記述
- いつ使用すべきかを明記

## 3段階ローディング

Agent Skillsは以下の3段階でロードされます:

### Level 1: Discovery（常時）

- `name`と`description`のみ読み込み
- Copilotがスキルの存在を認識

### Level 2: Instructions（関連リクエスト時）

- SKILL.md本文を読み込み
- 詳細な手順とガイドラインを提供

### Level 3: Resources（必要時）

- templates/、examples/、configs/を参照
- 具体的なコードやスクリプトを使用

## SKILL.md本文の構成

### 推奨セクション

1. **いつこのスキルを使用するか**: ユースケースの明確化
2. **セットアップ手順**: 環境準備
3. **実装パターン**: コード例
4. **ベストプラクティス**: 推奨事項
5. **トラブルシューティング**: よくある問題と解決策
6. **参考リソース**: 外部リンク

### リソースの参照

相対パスでリソースを参照:

```markdown
テンプレート: [basic-template.ts](./templates/basic-template.ts)
設定例: [config.json](./configs/config.json)
サンプル: [example.py](./examples/example.py)
```

## ベストプラクティス

### Description設計

- 最初の100文字で主要機能を説明
- 具体的なユースケースを含める
- 「Use this when...」形式を推奨

**良い例**:
```yaml
description: Guide for building MCP servers using Python SDK. Use this when creating, debugging, or optimizing Python-based MCP servers with FastMCP framework.
```

**悪い例**:
```yaml
description: Python MCP stuff
```

### リソース構成

- templates/: 再利用可能なテンプレート
- examples/: 動作する完全なサンプル
- configs/: 設定ファイル（.json, .yaml, .toml）
- scripts/: 自動化スクリプト

### セクション設計

- 段階的な学習パスを提供
- 基本→応用の順序で構成
- コピー可能なコード例を含める

## 命名規約

### スキル名

- 小文字、ハイフン区切り
- 最大64文字
- 目的を明確に表現

**良い例**:
- `python-mcp-development`
- `cpp14-code-review`
- `typescript-testing`

**悪い例**:
- `PythonMCP`
- `python_mcp_development`
- `mcp`（曖昧すぎる）

### ディレクトリ名

- スキル名と同一
- 小文字、ハイフン区切り

## 禁止事項

- SKILL.md以外のファイル名をメインファイルとして使用
- 1024文字を超えるdescription
- 曖昧なスキル名
- リソースへの絶対パス
- 外部依存関係の暗黙的な要求

## サンプル

```markdown
---
name: typescript-api-testing
description: Comprehensive guide for testing TypeScript APIs with Jest and Supertest. Use this when writing unit tests, integration tests, or end-to-end tests for REST APIs. Includes mocking patterns, assertion utilities, and CI/CD integration.
---

# TypeScript API Testing

このスキルは、TypeScript APIのテスト戦略と実装パターンを提供します。

## いつこのスキルを使用するか

以下の場合に本スキルを活用してください:

- REST APIのユニットテストを作成する
- インテグレーションテストを設計する
- モック戦略を決定する
- CI/CDパイプラインにテストを統合する

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
```

### 2. Jest設定

```typescript
// jest.config.ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
};
```

## 実装パターン

### 基本的なAPIテスト

```typescript
import request from 'supertest';
import { app } from '../src/app';

describe('GET /users', () => {
  it('should return users list', async () => {
    const response = await request(app)
      .get('/users')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });
});
```

## ベストプラクティス

- テストは独立して実行可能にする
- モックは最小限に抑える
- エッジケースを網羅する
- 意味のあるアサーションを書く

## 参考リソース

- [Jest公式ドキュメント](https://jestjs.io/)
- [Supertest GitHub](https://github.com/visionmedia/supertest)
- [テンプレート](./templates/)
- [サンプル](./examples/)
```

## 検証チェックリスト

- [ ] Front matterに`name`と`description`がある
- [ ] `name`が64文字以内
- [ ] `description`が1024文字以内
- [ ] ディレクトリ構造が正しい
- [ ] リソースへの参照が相対パス
- [ ] ユースケースが明確に記述されている
- [ ] コード例がコピー可能
