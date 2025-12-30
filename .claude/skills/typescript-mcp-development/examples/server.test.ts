/**
 * MCPサーバーの単体テスト例
 */
import { describe, it } from "node:test";
import assert from "node:assert";
import { z } from "zod";

// テスト用スキーマ
const WeatherSchema = z.object({
  temperature: z.number(),
  condition: z.string(),
  humidity: z.number().min(0).max(100),
});

type WeatherData = z.infer<typeof WeatherSchema>;

// テスト対象の関数
function getWeather(city: string): WeatherData {
  // モックデータを返す
  return {
    temperature: 20.0,
    condition: "sunny",
    humidity: 65,
  };
}

// --- テストケース ---

describe("Weather Tool", () => {
  it("should return valid weather data", () => {
    const result = getWeather("Tokyo");

    assert.strictEqual(result.temperature, 20.0);
    assert.strictEqual(result.condition, "sunny");
    assert.strictEqual(result.humidity, 65);
  });

  it("should validate with zod schema", () => {
    const result = getWeather("London");

    // zodバリデーション
    const validated = WeatherSchema.parse(result);
    assert.ok(validated);
    assert.strictEqual(typeof validated.temperature, "number");
    assert.strictEqual(typeof validated.condition, "string");
  });

  it("should reject invalid humidity", () => {
    const invalidData = {
      temperature: 20,
      condition: "rainy",
      humidity: 150, // 無効な値
    };

    assert.throws(() => {
      WeatherSchema.parse(invalidData);
    }, z.ZodError);
  });
});

describe("Calculation Tool", () => {
  it("should add two numbers", () => {
    const result = 5 + 3;
    assert.strictEqual(result, 8);
  });

  it("should throw error on division by zero", () => {
    assert.throws(() => {
      const b = 0;
      if (b === 0) throw new Error("Division by zero");
      return 10 / b;
    }, /Division by zero/);
  });
});
