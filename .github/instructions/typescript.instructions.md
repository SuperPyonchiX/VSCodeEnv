---
description: 'TypeScript/JavaScript coding conventions and guidelines'
applyTo: '**/*.ts, **/*.tsx, **/*.js, **/*.jsx'
---

# TypeScript/JavaScriptコーディング規約

## TypeScript指示事項

- すべての関数・変数に厳密な型定義を使用
- 明示的な`any`型の使用を避け、型推論または具体的な型を使用
- interfaceとtypeを適切に使い分け（構造的なオブジェクト型にはinterface推奨）
- 関数には戻り値の型アノテーションを必須とする
- Genericsを活用して再利用可能な型安全コードを作成
- `unknown`型を使用して安全な型ガードを実装

## 一般的な指示事項

- 常に可読性と明確性を優先
- Pure関数を優先し、副作用を最小化
- 早期リターンパターンを使用してネストを減らす
- 非同期処理には`async/await`を使用（コールバックチェーンを避ける）
- エラーハンドリングは型安全な方法で実装（Result型パターン推奨）
- 保守性の良いコーディング実践でコードを記述し、設計決定の理由をコメントに含める

## コードスタイルとフォーマット

- ESLint + Prettierの設定に従う
- インポート文はグループ化して整理（外部ライブラリ、内部モジュール、型定義）
- 命名規約:
  - 変数・関数: camelCase
  - クラス・型・インターフェース: PascalCase
  - 定数: UPPER_SNAKE_CASE
  - プライベートメンバー: アンダースコアプレフィックス (_memberName) または # プレフィックス
- インデントには2スペースを使用
- 行は100文字を目安に制限

## ベストプラクティス

- nullableな値には`??`（Nullish Coalescing）と`?.`（Optional Chaining）を活用
- 配列操作には`map`, `filter`, `reduce`などの高階関数を使用
- イミュータブルなデータ構造を推奨（`readonly`修飾子、`as const`）
- テストしやすいよう依存性注入パターンを使用
- ユーティリティ型（`Partial`, `Pick`, `Omit`, `Record`など）を活用
- 条件分岐には`switch`文よりオブジェクトマップを優先

## 禁止事項

- `var`キーワードの使用（`const`または`let`を使用）
- 暗黙的な型変換（`==`ではなく`===`を使用）
- `@ts-ignore`コメントの無闘乱な使用（`@ts-expect-error`を代わりに検討）
- `require()`ではなく`import`構文を使用
- `Function`型や`Object`型などの曖昧な型の使用
- 非nullアサーション演算子`!`の乱用

## サンプルコード

```typescript
// 良い例
interface User {
  readonly id: string;
  name: string;
  email: string;
  createdAt: Date;
}

type UserCreateInput = Omit<User, 'id' | 'createdAt'>;

async function fetchUser(id: string): Promise<User | null> {
  try {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('API error:', error.message);
    }
    return null;
  }
}

// 型ガードの例
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  );
}
```

```typescript
// 悪い例
var fetchUser = function(id) {
  return api.get('/users/' + id).then(function(response) {
    return response.data;
  });
}

// any型の乱用
function processData(data: any): any {
  return data.value;
}
```
