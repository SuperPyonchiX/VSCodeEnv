"""
MCPサーバーの単体テスト例
"""
import pytest
from mcp.server.fastmcp import FastMCP
from pydantic import BaseModel, Field


class WeatherData(BaseModel):
    temperature: float
    condition: str


# テスト用サーバー
mcp = FastMCP("Test Server")


@mcp.tool()
def get_weather(city: str) -> WeatherData:
    """天気情報を取得（モック）"""
    return WeatherData(temperature=20.0, condition="sunny")


# --- テストケース ---

@pytest.mark.asyncio
async def test_weather_tool():
    """天気ツールのテスト"""
    result = get_weather("Tokyo")
    
    assert isinstance(result, WeatherData)
    assert result.temperature == 20.0
    assert result.condition == "sunny"


@pytest.mark.asyncio
async def test_weather_tool_validation():
    """Pydanticバリデーションのテスト"""
    result = get_weather("London")
    
    # Pydanticモデルのバリデーション
    assert hasattr(result, 'temperature')
    assert hasattr(result, 'condition')
    assert isinstance(result.temperature, float)
    assert isinstance(result.condition, str)


def test_tool_registration():
    """ツール登録の確認"""
    # FastMCPに登録されたツールを確認
    tools = mcp._tool_manager._tools
    assert "get_weather" in tools
