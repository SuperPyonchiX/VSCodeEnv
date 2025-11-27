---
description: 'C++14/17並行処理のベストプラクティスとデッドロック回避のコーディング標準'
applyTo: '**/*.cpp, **/*.hpp, **/*.h, **/*.cc, **/*.cxx'
---

# C++ 並行処理コーディング標準

**C++14環境**におけるマルチスレッドプログラミングとmutex管理のベストプラクティスを定義します。デッドロックを回避し、スレッドセーフなコードを書くためのガイドラインです。

## 一般的な指示

### 基本原則

1. **RAII原則の厳守**: mutex管理には必ずRAIIラッパー（`lock_guard`, `unique_lock`）を使用
2. **明示的なロック順序**: 複数のmutexを取得する場合、常に同じ順序で取得
3. **最小特権の原則**: ロックの保持時間を最小限に抑える
4. **デッドロック回避アルゴリズム**: 複数mutexには`std::lock` + `adopt_lock`を使用（C++14標準）
5. **例外安全性**: すべてのロック操作は例外安全でなければならない
6. **イベントドリブン安全性**: コールバック/シグナルハンドラー内でのロック取得に細心の注意

### 適用スコープ

このガイドラインは、以下のC++並行処理機能を使用するすべてのコードに適用されます:

**C++14標準機能**:
- `std::thread`
- `std::mutex`, `std::recursive_mutex`, `std::timed_mutex`
- `std::lock_guard`, `std::unique_lock`
- `std::condition_variable`, `std::condition_variable_any`
- `std::atomic`, `std::atomic_flag`
- `std::lock` (複数mutex用デッドロック回避)

**イベントドリブンパターン**:
- コールバック関数（`std::function`, ラムダ）
- シグナル/スロット機構
- イベントハンドラー
- メッセージキュー

**注意**: C++17の`std::scoped_lock`や`std::shared_mutex`は使用不可

## Mutex 管理のベストプラクティス

### ✅ DO: 推奨されるパターン

#### 1. 単一mutexのロック: std::lock_guard

```cpp
// ✅ GOOD: シンプルなスコープ付きロック
class BankAccount {
    mutable std::mutex mutex_;
    double balance_;

public:
    void deposit(double amount) {
        std::lock_guard<std::mutex> lock(mutex_);
        balance_ += amount;
    } // mutexは自動的に解放される
};
```

**理由**: 
- 例外が発生しても必ずunlockされる
- コードがシンプルで読みやすい
- 最も軽量なRAIIラッパー

#### 2. 複数mutexのロック: std::lock + adopt_lock (C++14推奨)

```cpp
// ✅ GOOD: C++14でのデッドロック安全な方法
void transfer(BankAccount& from, BankAccount& to, double amount) {
    // 1. std::lockでデッドロック回避
    std::lock(from.mutex_, to.mutex_);
    
    // 2. adopt_lockでRAII管理に移行
    std::lock_guard<std::mutex> lock1(from.mutex_, std::adopt_lock);
    std::lock_guard<std::mutex> lock2(to.mutex_, std::adopt_lock);
    
    from.balance_ -= amount;
    to.balance_ += amount;
}
```

**理由**: 
- C++14環境でもデッドロック回避可能
- `std::lock`が複数mutexを安全に取得
- RAIIで自動解放を保証

#### 4. 条件変数との組み合わせ: std::unique_lock

```cpp
// ✅ GOOD: 条件変数には unique_lock を使用
class ThreadSafeQueue {
    std::mutex mutex_;
    std::condition_variable cv_;
    std::queue<int> queue_;

public:
    int pop() {
        std::unique_lock<std::mutex> lock(mutex_);
        
        // 条件を待つ間、mutexは自動的に解放される
        cv_.wait(lock, [this] { return !queue_.empty(); });
        
        int value = queue_.front();
        queue_.pop();
        return value;
    }
};
```

**理由**: 
- `condition_variable::wait`は`unique_lock`を要求
- lockとunlockを繰り返す操作に対応
- 柔軟な制御が可能

#### 5. 一貫したロック順序の強制

```cpp
// ✅ GOOD: アドレス順でロック順序を統一
void transfer(BankAccount& from, BankAccount& to, double amount) {
    // 常に小さいアドレスのmutexを先にロック
    BankAccount* first = &from;
    BankAccount* second = &to;
    if (first > second) std::swap(first, second);
    
    std::lock_guard<std::mutex> lock1(first->mutex_);
    std::lock_guard<std::mutex> lock2(second->mutex_);
    
    from.balance_ -= amount;
    to.balance_ += amount;
}
```

**理由**: 
- どのような引数の順序でもデッドロック回避
- `std::lock`が使えない状況での代替策
- 明示的なロック順序ポリシー

#### 7. イベントドリブンでの安全なロック管理

```cpp
// ✅ GOOD: コールバック登録前にロックを解放
class EventManager {
    std::mutex mutex_;
    std::map<std::string, std::function<void()>> handlers_;

public:
    void registerHandler(const std::string& event, std::function<void()> handler) {
        std::lock_guard<std::mutex> lock(mutex_);
        handlers_[event] = std::move(handler);
    }  // ロック自動解放

    void emit(const std::string& event) {
        std::function<void()> handler;
        {
            // 1. ロック下でハンドラーをコピー
            std::lock_guard<std::mutex> lock(mutex_);
            auto it = handlers_.find(event);
            if (it != handlers_.end()) {
                handler = it->second;
            }
        }  // 2. ロックを解放
        
        // 3. ロック外でハンドラーを実行
        if (handler) {
            handler();  // デッドロック安全
        }
    }
};
```

**理由**: 
- ハンドラー実行中はロックを保持しない
- ハンドラー内で同じmutexを取得してもデッドロックしない
- コールバックの再入を許可

### ❌ DON'T: 避けるべきパターン

#### 1. 手動 lock/unlock

```cpp
// ❌ BAD: 例外安全でない
void deposit(double amount) {
    mutex_.lock();
    balance_ += amount;  // ここで例外が発生するとunlockされない！
    mutex_.unlock();
}
```

**問題点**: 
- 例外発生時にmutexがロックされたまま
- 早期returnでunlockを忘れる可能性
- コードの複雑化

**修正方法**: 
```cpp
// ✅ GOOD
void deposit(double amount) {
    std::lock_guard<std::mutex> lock(mutex_);
    balance_ += amount;
}
```

#### 2. 逆順でのmutex取得

```cpp
// ❌ BAD: デッドロックの危険性
void funcA() {
    std::lock_guard<std::mutex> lock1(mutex1_);
    std::lock_guard<std::mutex> lock2(mutex2_);
    // 処理
}

void funcB() {
    std::lock_guard<std::mutex> lock2(mutex2_);  // 逆順！
    std::lock_guard<std::mutex> lock1(mutex1_);
    // 処理
}
```

**問題点**: 
- スレッドAがfuncA、スレッドBがfuncBを同時実行するとデッドロック
- 古典的なデッドロックシナリオ

**修正方法**: 
```cpp
// ✅ GOOD: std::lock で解決
void funcA() {
    std::lock(mutex1_, mutex2_);
    std::lock_guard<std::mutex> lock1(mutex1_, std::adopt_lock);
    std::lock_guard<std::mutex> lock2(mutex2_, std::adopt_lock);
    // 処理
}

void funcB() {
    std::lock(mutex1_, mutex2_);  // 同じ順序
    std::lock_guard<std::mutex> lock1(mutex1_, std::adopt_lock);
    std::lock_guard<std::mutex> lock2(mutex2_, std::adopt_lock);
    // 処理
}
```

#### 3. ロック中の外部関数呼び出し

```cpp
// ❌ BAD: 未知の依存関係
class DataProcessor {
    std::mutex mutex_;
    
    void process(const std::function<void()>& callback) {
        std::lock_guard<std::mutex> lock(mutex_);
        callback();  // callbackが何をするかわからない！
    }
};
```

**問題点**: 
- callbackが同じmutexを取得しようとするとデッドロック
- callbackが別のmutexを取得すると順序依存が発生
- デバッグが困難

**修正方法**: 
```cpp
// ✅ GOOD: ロックを解放してから外部関数を呼び出す
void process(const std::function<void()>& callback) {
    {
        std::lock_guard<std::mutex> lock(mutex_);
        // クリティカルセクション
    } // ここでロックが解放される
    
    callback();  // ロック外で呼び出し
}
```

#### 4. 長時間のロック保持

```cpp
// ❌ BAD: 不必要にロックを保持
void processData() {
    std::lock_guard<std::mutex> lock(mutex_);
    
    auto data = readData();           // I/O操作
    auto result = heavyComputation(data);  // 重い計算
    saveResult(result);               // I/O操作
}
```

**問題点**: 
- I/O待機中もロック保持
- 他のスレッドがブロックされる
- パフォーマンスの低下

**修正方法**: 
```cpp
// ✅ GOOD: 最小限のロック時間
void processData() {
    // 1. データ読み取り（ロック保持）
    std::vector<int> data;
    {
        std::lock_guard<std::mutex> lock(mutex_);
        data = readData();
    }
    
    // 2. 計算（ロック不要）
    auto result = heavyComputation(data);
    
    // 3. 結果保存（ロック保持）
    {
        std::lock_guard<std::mutex> lock(mutex_);
        saveResult(result);
    }
}
```

#### 5. try_lock の不適切な使用

```cpp
// ❌ BAD: ビジーウェイト
void acquire() {
    while (!mutex_.try_lock()) {
        // 何もせずにスピン！CPUを無駄に消費
    }
    // ...
    mutex_.unlock();
}
```

**問題点**: 
- CPUリソースの無駄遣い
- 他のスレッドの実行を妨げる
- バッテリー消費が増加

**修正方法**: 
```cpp
// ✅ GOOD: try_lockは本当にスキップ可能な処理にのみ使用
void tryAcquire() {
    if (mutex_.try_lock()) {
        std::lock_guard<std::mutex> lock(mutex_, std::adopt_lock);
        // 処理
    } else {
        // ロック取得失敗時の代替処理
        logSkipped();
    }
}
```

#### 6. recursive_mutex の乱用

```cpp
// ❌ BAD: 設計の問題を隠蔽
class DataManager {
    std::recursive_mutex mutex_;
    
    void funcA() {
        std::lock_guard<std::recursive_mutex> lock(mutex_);
        funcB();  // funcBも同じmutexをロック
    }
    
    void funcB() {
        std::lock_guard<std::recursive_mutex> lock(mutex_);
        // 処理
    }
};
```

**問題点**: 
- 関数間の依存関係が不明確
- パフォーマンスオーバーヘッド
- 設計上の問題を隠蔽

**修正方法**: 
```cpp
// ✅ GOOD: ロックしない内部関数を用意
class DataManager {
    std::mutex mutex_;
    
    void funcA() {
        std::lock_guard<std::mutex> lock(mutex_);
        funcB_unlocked();  // ロックしない内部実装
    }
    
    void funcB() {
        std::lock_guard<std::mutex> lock(mutex_);
        funcB_unlocked();
    }
    
private:
    void funcB_unlocked() {
        // 実際の処理（ロック不要）
    }
};
```

#### 7. イベントハンドラー内でのロック保持

```cpp
// ❌ BAD: コールバック実行中にロックを保持
class EventManager {
    std::mutex mutex_;
    std::map<std::string, std::function<void()>> handlers_;

public:
    void emit(const std::string& event) {
        std::lock_guard<std::mutex> lock(mutex_);
        auto it = handlers_.find(event);
        if (it != handlers_.end()) {
            it->second();  // ハンドラー実行中にmutex_を保持！
        }
    }
};

// 使用例
EventManager em;
em.registerHandler("event", [&em] {
    em.emit("another_event");  // デッドロック！
});
```

**問題点**: 
- ハンドラーが同じEventManagerを使うとデッドロック
- ハンドラーの実装を制約する
- 再入不可能

**修正方法**: 
```cpp
// ✅ GOOD: ハンドラー実行前にロックを解放
void emit(const std::string& event) {
    std::function<void()> handler;
    {
        std::lock_guard<std::mutex> lock(mutex_);
        auto it = handlers_.find(event);
        if (it != handlers_.end()) {
            handler = it->second;  // コピー
        }
    }  // ロック解放
    
    if (handler) {
        handler();  // ロック外で実行
    }
}
```

## コーディング規約

### 命名規則

#### Mutex変数の命名

```cpp
// ✅ GOOD: 保護対象を明示
class BankAccount {
    double balance_;
    mutable std::mutex balance_mutex_;  // balanceを保護
};

class ThreadPool {
    std::queue<Task> tasks_;
    std::mutex tasks_mutex_;  // tasksを保護
    
    std::vector<std::thread> workers_;
    std::mutex workers_mutex_;  // workersを保護
};
```

**規則**: 
- `保護対象_mutex_` または `保護対象_mtx_`
- グローバルmutexは `g_XXX_mutex`

#### Lock変数の命名

```cpp
// ✅ GOOD: 意図を明示
void transfer(BankAccount& from, BankAccount& to, double amount) {
    std::lock(from.mutex_, to.mutex_);
    std::lock_guard<std::mutex> lock1(from.mutex_, std::adopt_lock);
    std::lock_guard<std::mutex> lock2(to.mutex_, std::adopt_lock);
    // または単純な場合
    std::lock_guard<std::mutex> balance_lock(balance_mutex_);
}
```

**規則**: 
- `XXX_lock` または単に `lock`（スコープが狭い場合）

### コードフォーマット

#### Mutex宣言の位置

```cpp
// ✅ GOOD: 保護対象の近くに宣言
class DataStore {
    // データメンバー
    std::vector<int> data_;
    mutable std::mutex data_mutex_;  // dataのすぐ後
    
    std::string name_;
    mutable std::mutex name_mutex_;  // nameのすぐ後
};
```

#### Lock取得のインデント

```cpp
// ✅ GOOD: ロックのスコープを明確に
void process() {
    // ロック外の処理
    auto temp = prepareData();
    
    {
        std::lock_guard<std::mutex> lock(mutex_);
        // クリティカルセクション
        data_ = temp;
    } // ロックスコープの終わり
    
    // ロック外の処理
    notify();
}
```

### const-correctness

```cpp
// ✅ GOOD: 読み取り専用メソッドでmutable mutex
class Cache {
    mutable std::shared_mutex mutex_;  // mutable修飾子
    std::unordered_map<int, std::string> data_;

public:
    std::string get(int key) const {  // const メソッド
        std::shared_lock<std::shared_mutex> lock(mutex_);
        return data_.at(key);
    }
};
```

## 一般的なパターン

### パターン 1: スレッドセーフシングルトン (C++11 Meyers' Singleton)

```cpp
// ✅ GOOD: スレッドセーフな初期化
class Singleton {
public:
    static Singleton& getInstance() {
        static Singleton instance;  // C++11以降はスレッドセーフ
        return instance;
    }
    
    Singleton(const Singleton&) = delete;
    Singleton& operator=(const Singleton&) = delete;

private:
    Singleton() = default;
};
```

### パターン 2: スレッドセーフキュー

```cpp
// ✅ GOOD: 生産者・消費者パターン
template<typename T>
class ThreadSafeQueue {
    mutable std::mutex mutex_;
    std::queue<T> queue_;
    std::condition_variable cv_;

public:
    void push(T value) {
        {
            std::lock_guard<std::mutex> lock(mutex_);
            queue_.push(std::move(value));
        }
        cv_.notify_one();
    }

    T pop() {
        std::unique_lock<std::mutex> lock(mutex_);
        cv_.wait(lock, [this] { return !queue_.empty(); });
        
        T value = std::move(queue_.front());
        queue_.pop();
        return value;
    }
    
    bool try_pop(T& value) {
        std::lock_guard<std::mutex> lock(mutex_);
        if (queue_.empty()) return false;
        
        value = std::move(queue_.front());
        queue_.pop();
        return true;
    }
};
```

### パターン 3: ロック階層（Hierarchical Mutex）

```cpp
// ✅ GOOD: デッドロック回避の高度なパターン
class HierarchicalMutex {
    std::mutex internal_mutex_;
    unsigned long const hierarchy_value_;
    unsigned long previous_hierarchy_value_;
    
    static thread_local unsigned long this_thread_hierarchy_value_;
    
    void check_for_hierarchy_violation() {
        if (this_thread_hierarchy_value_ <= hierarchy_value_) {
            throw std::logic_error("Mutex hierarchy violated");
        }
    }
    
    void update_hierarchy_value() {
        previous_hierarchy_value_ = this_thread_hierarchy_value_;
        this_thread_hierarchy_value_ = hierarchy_value_;
    }

public:
    explicit HierarchicalMutex(unsigned long value)
        : hierarchy_value_(value),
          previous_hierarchy_value_(0) {}

    void lock() {
        check_for_hierarchy_violation();
        internal_mutex_.lock();
        update_hierarchy_value();
    }

    void unlock() {
        this_thread_hierarchy_value_ = previous_hierarchy_value_;
        internal_mutex_.unlock();
    }
};

// 使用例
HierarchicalMutex high_level_mutex(10000);
HierarchicalMutex mid_level_mutex(6000);
HierarchicalMutex low_level_mutex(5000);

void func() {
    std::lock_guard<HierarchicalMutex> lock1(high_level_mutex);
    std::lock_guard<HierarchicalMutex> lock2(mid_level_mutex);  // OK
    // std::lock_guard<HierarchicalMutex> lock3(high_level_mutex);  // エラー！
}
```

### パターン 4: ダブルチェックロッキング（慎重に使用）

```cpp
// ⚠️ CAUTION: C++11以降は std::call_once を推奨
class LazyInit {
    std::atomic<Widget*> widget_{nullptr};
    std::mutex mutex_;

public:
    Widget* getInstance() {
        Widget* tmp = widget_.load(std::memory_order_acquire);
        if (tmp == nullptr) {
            std::lock_guard<std::mutex> lock(mutex_);
            tmp = widget_.load(std::memory_order_relaxed);
            if (tmp == nullptr) {
                tmp = new Widget();
                widget_.store(tmp, std::memory_order_release);
            }
        }
        return tmp;
    }
};

// ✅ BETTER: std::call_once を使用
class LazyInit {
    std::once_flag init_flag_;
    std::unique_ptr<Widget> widget_;

public:
    Widget* getInstance() {
        std::call_once(init_flag_, [this] {
            widget_ = std::make_unique<Widget>();
        });
        return widget_.get();
    }
};
```

## デッドロック回避チェックリスト

コードレビュー時に以下を確認:

### 基本チェック
- [ ] すべてのmutexがRAIIで管理されている（lock_guard, unique_lock）
- [ ] 手動の`lock()`/`unlock()`呼び出しが存在しない
- [ ] 複数mutexの取得に`std::lock` + `adopt_lock`を使用
- [ ] ロックの順序が一貫している

### 高度なチェック
- [ ] ロック中に外部関数を呼び出していない
- [ ] ロック中のI/O操作を最小化している
- [ ] 条件変数には`unique_lock`を使用
- [ ] `recursive_mutex`の使用が正当化されている
- [ ] `try_lock`がビジーウェイトに使われていない

### パフォーマンスチェック
- [ ] ロックの保持時間が最小化されている
- [ ] 読み取り頻度が高い場合に`shared_mutex`を検討
- [ ] mutex粒度が適切（細かすぎず、粗すぎず）

## 検証とテスト

### ThreadSanitizer (TSan) の使用

```bash
# ✅ GOOD: コンパイル時にTSanを有効化
g++ -fsanitize=thread -g -O1 main.cpp -o main
./main

# または CMake
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fsanitize=thread")
```

### Helgrind (Valgrind) の使用

```bash
# ✅ GOOD: 実行時にデッドロック検出
valgrind --tool=helgrind ./main
```

### 単体テスト

```cpp
// ✅ GOOD: マルチスレッド環境でのテスト
TEST(ThreadSafeQueueTest, ConcurrentPushPop) {
    ThreadSafeQueue<int> queue;
    const int num_threads = 4;
    const int num_operations = 1000;
    
    std::vector<std::thread> producers;
    std::vector<std::thread> consumers;
    
    for (int i = 0; i < num_threads; ++i) {
        producers.emplace_back([&queue, i, num_operations] {
            for (int j = 0; j < num_operations; ++j) {
                queue.push(i * num_operations + j);
            }
        });
        
        consumers.emplace_back([&queue, num_operations] {
            for (int j = 0; j < num_operations; ++j) {
                queue.pop();
            }
        });
    }
    
    for (auto& t : producers) t.join();
    for (auto& t : consumers) t.join();
}
```

## 関連リソース

### 内部リソース
- [C++ デッドロック分析プロンプト](../prompts/analyze-cpp-concurrency.prompt.md)
- [C++ 並行処理アナライザー](../agents/analyze-cpp-concurrency.agent.md)

### 外部リソース
- [C++ Core Guidelines: Concurrency](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-concurrency)
- [C++ Reference: Thread support library](https://en.cppreference.com/w/cpp/thread)
- [Herb Sutter: Prefer Using Active Objects Instead of Naked Threads](https://herbsutter.com/2010/07/12/prefer-using-active-objects-instead-of-naked-threads/)
- [Anthony Williams: C++ Concurrency in Action](https://www.manning.com/books/c-plus-plus-concurrency-in-action-second-edition)

## バージョン履歴

- **v1.0** (2025-11-27): 初版作成
  - C++14/17標準準拠
  - デッドロック回避パターン
  - ThreadSanitizer統合
