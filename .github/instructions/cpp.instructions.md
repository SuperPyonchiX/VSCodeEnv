---
description: 'C/C++ coding conventions and Modern C++ guidelines'
applyTo: '**/*.cpp, **/*.hpp, **/*.c, **/*.h, **/*.cc, **/*.cxx'
---

# C/C++コーディング規約

## C++指示事項

- Modern C++ (C++11以降) の機能を積極的に活用
- RAIIパターンを使用してリソース管理を自動化
- スマートポインタ（`unique_ptr`, `shared_ptr`）を優先使用
- `constexpr`と`const`を積極的に使用して不変性を表現
- 明示的なキャスト（`static_cast`, `dynamic_cast`, `reinterpret_cast`）を使用
- `[[nodiscard]]`, `[[maybe_unused]]`などの属性を適切に使用

## メモリ管理

- 生の`new`/`delete`は避け、スマートポインタを使用
- コンテナ（`std::vector`, `std::array`, `std::string`）を優先使用
- 所有権を明確に表現:
  - `unique_ptr`: 唯一の所有者
  - `shared_ptr`: 共有所有
  - `weak_ptr`: 循環参照の防止
- ダングリングポインタを防ぐため、参照の有効範囲に注意
- `std::make_unique`と`std::make_shared`を使用

## 型安全性

- 暗黙の型変換を避け、明示的なキャストを使用
- `enum`より`enum class`を優先
- `auto`を適切に使用（型が明確な場合のみ）
- テンプレートで型制約を表現（C++20 conceptsまたはSFINAE）
- `std::optional`でnullableな値を表現
- `std::variant`で型安全な共用体を実装

## 例外処理

- 例外は値で`throw`、参照で`catch`
- `noexcept`指定子を適切に使用
- リソース管理にRAIIを使用し、例外安全を確保
- 強い例外保証、基本保証、nothrow保証を意識
- デストラクタでは例外を投げない

## コードスタイルとフォーマット

- clang-formatの設定に従う
- 命名規約:
  - クラス・構造体: PascalCase
  - 関数・変数: camelCaseまたはsnake_case（プロジェクト規約に従う）
  - 定数・マクロ: UPPER_SNAKE_CASE
  - プライベートメンバー: m_プレフィックスまたはアンダースコアサフィックス
- ヘッダファイルにはinclude guardまたは`#pragma once`を使用
- インクルードは論理的にグループ化（標準ライブラリ、外部ライブラリ、プロジェクト内）

## ベストプラクティス

- Rule of Zero/Five/Threeを遵守
- 範囲forループを使用
- ラムダ式を適切に活用
- 標準ライブラリアルゴリズムを活用（`<algorithm>`）
- 構造化束縛（structured bindings）を活用
- `std::string_view`で文字列の参照を効率化
- 初期化にはブレース初期化を優先

## 禁止・非推奨事項

- Cスタイルのキャスト `(int)value`
- `malloc`/`free`の使用（C++では）
- `goto`文の使用
- マクロの乱用（`constexpr`、`inline`関数、テンプレートで代替）
- 未初期化変数の使用
- `using namespace std;`のヘッダファイルでの使用
- 生の配列（`std::array`または`std::vector`を使用）

## サンプルコード

```cpp
// 良い例
class ResourceManager {
public:
    explicit ResourceManager(std::string_view path)
        : m_resource{std::make_unique<Resource>(path)} {}

    // Rule of Zero: スマートポインタ使用で特殊メンバー不要

    [[nodiscard]] const Resource& get() const noexcept {
        return *m_resource;
    }

    std::optional<Data> tryLoad(std::string_view name) const {
        if (auto it = m_cache.find(std::string{name}); it != m_cache.end()) {
            return it->second;
        }
        return std::nullopt;
    }

private:
    std::unique_ptr<Resource> m_resource;
    std::unordered_map<std::string, Data> m_cache;
};

// 範囲forとアルゴリズムの活用
auto processItems(const std::vector<Item>& items) -> std::vector<Result> {
    std::vector<Result> results;
    results.reserve(items.size());

    std::ranges::transform(items, std::back_inserter(results),
        [](const Item& item) { return item.process(); });

    return results;
}
```

```cpp
// 悪い例
class ResourceManager {
public:
    ResourceManager(const char* path) {
        resource = new Resource(path);  // 生のnew
    }
    ~ResourceManager() { delete resource; }  // 例外安全でない

    Resource* resource;  // 生ポインタ、publicメンバー
};
```

## 関連リソース

高度なコードレビューが必要な場合は、`cpp14-code-review`スキルを参照してください:
- AUTOSAR C++14準拠レビュー
- CERT C++セキュアコーディング
- 静的解析ツール設定（Clang-Tidy, Cppcheck）
