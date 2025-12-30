#!/usr/bin/env node
/**
 * 基本的なMCPサーバーテンプレート
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// サーバーの初期化
const server = new McpServer({
  name: "basic-mcp-server",
  version: "1.0.0",
});

// --- ツールの定義 ---

server.registerTool({
  name: "echo",
  title: "Echo Message",
  description: "Echo back the provided message",
  inputSchema: {
    message: z.string().describe("Message to echo"),
  },
}, async ({ message }) => {
  return {
    content: [{ type: "text", text: message }],
  };
});

interface CalculationResult {
  operation: string;
  operand1: number;
  operand2: number;
  result: number;
}

server.registerTool({
  name: "calculate",
  title: "Calculate Numbers",
  description: "Perform basic arithmetic operations",
  inputSchema: {
    a: z.number().describe("First operand"),
    b: z.number().describe("Second operand"),
    operation: z.enum(["add", "subtract", "multiply", "divide"])
      .describe("Operation to perform"),
  },
}, async ({ a, b, operation }) => {
  let result: number;

  switch (operation) {
    case "add":
      result = a + b;
      break;
    case "subtract":
      result = a - b;
      break;
    case "multiply":
      result = a * b;
      break;
    case "divide":
      if (b === 0) {
        throw new Error("Division by zero");
      }
      result = a / b;
      break;
  }

  const structured: CalculationResult = {
    operation,
    operand1: a,
    operand2: b,
    result,
  };

  return {
    content: [{ type: "text", text: `Result: ${result}` }],
    structuredContent: structured,
  };
});

// --- リソースの定義 ---

server.registerResource({
  name: "server_info",
  uri: "info://server",
  title: "Server Information",
  description: "Get server information",
}, async () => {
  return {
    contents: [{
      uri: "info://server",
      mimeType: "application/json",
      text: JSON.stringify({
        name: "basic-mcp-server",
        version: "1.0.0",
        capabilities: ["tools", "resources"],
      }, null, 2),
    }],
  };
});

// --- サーバー起動 ---

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // 注意: console.log()は使用しない（stdoutを汚染する）
  console.error("Basic MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
