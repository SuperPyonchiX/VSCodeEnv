#!/usr/bin/env python3
"""
基本的なMCPサーバーテンプレート
"""
from mcp.server.fastmcp import FastMCP
from pydantic import BaseModel, Field

# FastMCPサーバーの初期化
mcp = FastMCP("Basic MCP Server")


# --- ツールの定義 ---

@mcp.tool()
def echo(message: str) -> str:
    """メッセージをエコーバックします。
    
    Args:
        message: エコーするメッセージ
    
    Returns:
        入力されたメッセージ
    """
    return message


class CalculationResult(BaseModel):
    """計算結果の構造化データ"""
    operation: str = Field(description="実行された演算")
    operand1: float = Field(description="第一オペランド")
    operand2: float = Field(description="第二オペランド")
    result: float = Field(description="計算結果")


@mcp.tool()
def calculate(a: float, b: float, operation: str) -> CalculationResult:
    """2つの数値で四則演算を実行します。
    
    Args:
        a: 第一オペランド
        b: 第二オペランド
        operation: 演算子 (add, subtract, multiply, divide)
    
    Returns:
        計算結果を含む構造化データ
    """
    if operation == "add":
        result = a + b
    elif operation == "subtract":
        result = a - b
    elif operation == "multiply":
        result = a * b
    elif operation == "divide":
        if b == 0:
            raise ValueError("ゼロ除算エラー")
        result = a / b
    else:
        raise ValueError(f"未知の演算: {operation}")
    
    return CalculationResult(
        operation=operation,
        operand1=a,
        operand2=b,
        result=result
    )


# --- リソースの定義 ---

@mcp.resource("info://server")
def get_server_info() -> str:
    """サーバー情報を提供する静的リソース"""
    return """
    Server: Basic MCP Server
    Version: 0.1.0
    Capabilities: tools, resources
    """


# --- サーバー起動 ---

if __name__ == "__main__":
    # STDIOトランスポートでサーバーを起動
    mcp.run()
