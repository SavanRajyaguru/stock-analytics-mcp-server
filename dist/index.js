"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const yahoo_finance2_1 = __importDefault(require("yahoo-finance2"));
const zod_1 = require("zod");
const server = new mcp_js_1.McpServer({
    name: "test",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {}
    }
});
server.tool("add", { a: zod_1.z.number(), b: zod_1.z.number() }, (_a) => __awaiter(void 0, [_a], void 0, function* ({ a, b }) {
    return {
        content: [{ type: "text", text: `Sum of ${a} and ${b} is ${a + b}` }]
    };
}));
server.tool("get_stock_price", { symbol: zod_1.z.string() }, (_a) => __awaiter(void 0, [_a], void 0, function* ({ symbol }) {
    try {
        const stock = yield yahoo_finance2_1.default.quote(symbol);
        console.log(stock);
        // Extract and return only specific properties from the stock object
        return {
            content: [{
                    type: "text",
                    text: `Stock price of ${symbol} is $${stock.regularMarketPrice}`
                }]
        };
    }
    catch (error) {
        console.error("Error fetching stock data:", error);
        return {
            content: [{
                    type: "text",
                    text: `Unable to retrieve stock information for ${symbol}.`
                }]
        };
    }
}));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const transport = new stdio_js_1.StdioServerTransport();
        yield server.connect(transport);
    });
}
main()
    .catch(console.error);
