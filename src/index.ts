import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import yahooFinance from "yahoo-finance2";
import { z } from "zod";
const server = new McpServer({
    name: "test",
    version: "1.0.0",

}, {
    capabilities: {
        tools: {}
    }
})

server.tool("add",
    { a: z.number(), b: z.number() },
    async ({ a, b }) => {
        return {
            content: [{ type: "text", text: `Sum of ${a} and ${b} is ${a + b}` }]
        }
    }
)

server.tool("get_stock_price",
    { symbol: z.string() },
    async ({ symbol }) => {
        try {
            const stock = await yahooFinance.quote(symbol)
            console.log(stock)
            // Extract and return only specific properties from the stock object
            return {
                content: [{
                    type: "text",
                    text: `Stock price of ${symbol} is $${stock.regularMarketPrice}`
                }]
            }
        } catch (error) {
            console.error("Error fetching stock data:", error)
            return {
                content: [{
                    type: "text",
                    text: `Unable to retrieve stock information for ${symbol}.`
                }]
            }
        }
    }
)
async function main() {
    const transport = new StdioServerTransport()
    await server.connect(transport)
}

main()
    .catch(console.error)
