---
description: 'Instructions for building Model Context Protocol (MCP) servers using the Python SDK'
applyTo: '**/*.py, **/pyproject.toml, **/requirements.txt'
---

# Python MCP Server開発

## 指示事項

- プロジェクト管理には **uv** を使用: `uv init mcp-server-demo` および `uv add "mcp[cli]"`
- `mcp.server.fastmcp` からFastMCPをインポート: `from mcp.server.fastmcp import FastMCP`
- 登録には `@mcp.tool()`、`@mcp.resource()`、`@mcp.prompt()` デコレータを使用
- 型ヒントは必須 - スキーマ生成と検証に使用されます
- 構造化出力にはPydanticモデル、TypedDict、またはdataclassを使用
- 戻り値の型が互換性がある場合、ツールは自動的に構造化出力を返します
- stdioトランスポートの場合、`mcp.run()` または `mcp.run(transport="stdio")` を使用
- HTTPサーバーの場合、`mcp.run(transport="streamable-http")` を使用するか、Starlette/FastAPIにマウント
- ツール/リソースでMCP機能にアクセスするには `Context` パラメータを使用: `ctx: Context`
- `await ctx.debug()`、`await ctx.info()`、`await ctx.warning()`、`await ctx.error()` でログを送信
- `await ctx.report_progress(progress, total, message)` で進捗を報告
- `await ctx.elicit(message, schema)` でユーザー入力を要求
- `await ctx.session.create_message(messages, max_tokens)` でLLMサンプリングを使用
- サーバー、ツール、リソース、プロンプト用に `Icon(src="path", mimeType="image/png")` でアイコンを設定
- 自動画像処理には `Image` クラスを使用: `return Image(data=bytes, format="png")`
- URIパターンでリソーステンプレートを定義: `@mcp.resource("greeting://{name}")`
- 部分的な値を受け入れて候補を返すことで補完サポートを実装
- 共有リソースを持つ起動/シャットダウンにはライフサイクルコンテキストマネージャーを使用
- `ctx.request_context.lifespan_context` 経由でツール内のライフサイクルコンテキストにアクセス
- ステートレスHTTPサーバーの場合、FastMCP初期化時に `stateless_http=True` を設定
- 最新のクライアント向けにJSON応答を有効化: `json_response=True`
- サーバーをテスト: `uv run mcp dev server.py`（Inspector）または `uv run mcp install server.py`（Claude Desktop）
- Starletteで異なるパスに複数のサーバーをマウント: `Mount("/path", mcp.streamable_http_app())`
- ブラウザクライアント向けにCORSを設定: `Mcp-Session-Id` ヘッダーを公開
- FastMCPが不十分な場合、最大限の制御には低レベルServerクラスを使用

## ベストプラクティス

- 型ヒントは必ず使用 - スキーマ生成と検証を促進します
- 構造化ツール出力にはPydanticモデルまたはTypedDictを返す
- ツール関数は単一責任に集中させる
- 明確なdocstringを提供 - これがツールの説明になります
- 型ヒント付きの説明的なパラメータ名を使用
- Pydantic Fieldの説明を使用して入力を検証
- try-exceptブロックで適切なエラー処理を実装
- I/O バウンド操作には非同期関数を使用
- ライフサイクルコンテキストマネージャーでリソースをクリーンアップ
- stdioトランスポート使用時は、stdioを妨げないようstderrにログ出力
- 設定には環境変数を使用
- LLM統合前にツールを独立してテスト
- ファイルシステムやネットワークアクセスを公開する際のセキュリティを考慮
- 機械可読データには構造化出力を使用
- 後方互換性のためコンテンツと構造化データの両方を提供

## 一般的なパターン

### 基本的なサーバー設定（stdio）
```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("My Server")

@mcp.tool()
def calculate(a: int, b: int, op: str) -> int:
    """計算を実行"""
    if op == "add":
        return a + b
    return a - b

if __name__ == "__main__":
    mcp.run()  # デフォルトでstdio
```

### HTTPサーバー
```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("My HTTP Server")

@mcp.tool()
def hello(name: str = "World") -> str:
    """誰かに挨拶する"""
    return f"Hello, {name}!"

if __name__ == "__main__":
    mcp.run(transport="streamable-http")
```

### 構造化出力を持つツール
```python
from pydantic import BaseModel, Field

class WeatherData(BaseModel):
    temperature: float = Field(description="摂氏温度")
    condition: str
    humidity: float

@mcp.tool()
def get_weather(city: str) -> WeatherData:
    """都市の天気を取得"""
    return WeatherData(
        temperature=22.5,
        condition="sunny",
        humidity=65.0
    )
```

### 動的リソース
```python
@mcp.resource("users://{user_id}")
def get_user(user_id: str) -> str:
    """ユーザープロファイルデータを取得"""
    return f"User {user_id} profile data"
```

### コンテキストを持つツール
```python
from mcp.server.fastmcp import Context
from mcp.server.session import ServerSession

@mcp.tool()
async def process_data(
    data: str, 
    ctx: Context[ServerSession, None]
) -> str:
    """ログ付きでデータを処理"""
    await ctx.info(f"処理中: {data}")
    await ctx.report_progress(0.5, 1.0, "半分完了")
    return f"処理済み: {data}"
```

### サンプリングを使用したツール
```python
from mcp.server.fastmcp import Context
from mcp.server.session import ServerSession
from mcp.types import SamplingMessage, TextContent

@mcp.tool()
async def summarize(
    text: str,
    ctx: Context[ServerSession, None]
) -> str:
    """LLMを使用してテキストを要約"""
    result = await ctx.session.create_message(
        messages=[SamplingMessage(
            role="user",
            content=TextContent(type="text", text=f"要約: {text}")
        )],
        max_tokens=100
    )
    return result.content.text if result.content.type == "text" else ""
```

### ライフサイクル管理
```python
from contextlib import asynccontextmanager
from dataclasses import dataclass
from mcp.server.fastmcp import FastMCP, Context

@dataclass
class AppContext:
    db: Database

@asynccontextmanager
async def app_lifespan(server: FastMCP):
    db = await Database.connect()
    try:
        yield AppContext(db=db)
    finally:
        await db.disconnect()

mcp = FastMCP("My App", lifespan=app_lifespan)

@mcp.tool()
def query(sql: str, ctx: Context) -> str:
    """データベースをクエリ"""
    db = ctx.request_context.lifespan_context.db
    return db.execute(sql)
```

### メッセージを持つプロンプト
```python
from mcp.server.fastmcp.prompts import base

@mcp.prompt(title="Code Review")
def review_code(code: str) -> list[base.Message]:
    """コードレビュープロンプトを作成"""
    return [
        base.UserMessage("このコードをレビューしてください:"),
        base.UserMessage(code),
        base.AssistantMessage("コードをレビューします。")
    ]
```

### エラー処理
```python
@mcp.tool()
async def risky_operation(input: str) -> str:
    """失敗する可能性のある操作"""
    try:
        result = await perform_operation(input)
        return f"成功: {result}"
    except Exception as e:
        return f"エラー: {str(e)}"
```
