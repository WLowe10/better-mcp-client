import { describe, expect, it, vi } from "vitest";
import { Client } from "./client";
import type {
	CallToolResult,
	CompleteResult,
	GetPromptResult,
	InitializeResult,
	ListPromptsResult,
	ListResourcesResult,
	ListResourceTemplatesResult,
	ListToolsResult,
	ReadResourceResult,
	Result,
} from "./generated/types";

const dummyTransport = {
	send: vi.fn(),
};

const client = new Client({
	info: {
		name: "test client",
		version: "0.0.1",
	},
	transport: dummyTransport,
});

it("throws when the jsonrpc response is invalid", async () => {
	dummyTransport.send.mockResolvedValueOnce({
		data: {
			message: "this is not a valid jsonrpc response",
		},
		meta: {},
	});

	await expect(client.ping()).rejects.toThrowError("Invalid JSON-RPC response");
});

it("throws when server responds with jsonrpc error", async () => {
	dummyTransport.send.mockResolvedValueOnce({
		data: {
			id: 1,
			jsonrpc: "2.0",
			error: {
				code: -32601,
				message: "Method not found",
			},
		},
		meta: {},
	});

	await expect(client.ping()).rejects.toThrowError("Server error: Method not found");
});

describe("Operations", () => {
	describe("initialize", () => {
		it("should return the result when valid", async () => {
			const expectedResult: InitializeResult = {
				protocolVersion: "2025-06-18",
				serverInfo: { name: "My Server", version: "1.0.0" },
				capabilities: { tools: {}, prompts: {}, logging: {} },
			};

			dummyTransport.send.mockResolvedValueOnce({
				data: {
					id: 1,
					jsonrpc: "2.0",
					result: expectedResult,
				},
			});

			const result = await client.initialize();

			expect(result.data).toEqual(expectedResult);
		});

		it("should throw on an invalid result", async () => {
			dummyTransport.send.mockResolvedValueOnce({
				data: {
					id: 1,
					jsonrpc: "2.0",
					result: {},
				},
			});

			await expect(() => client.initialize()).rejects.toThrowError();
		});
	});

	describe("ping", () => {
		it("should return the result when valid", async () => {
			const expectedResult: Result = {};

			dummyTransport.send.mockResolvedValueOnce({
				data: {
					id: 1,
					jsonrpc: "2.0",
					result: expectedResult,
				},
			});

			const result = await client.ping();

			expect(result.data).toEqual(expectedResult);
		});

		// note: the ping method returns an empty result, so any jsonrpc result object will work
		// there is no other path to test for
	});

	describe("setLoggingLevel", () => {
		it("should return the result when valid", async () => {
			const expectedResult: Result = {};

			dummyTransport.send.mockResolvedValueOnce({
				data: {
					id: 1,
					jsonrpc: "2.0",
					result: expectedResult,
				},
			});

			const result = await client.setLoggingLevel("info");

			expect(result.data).toEqual(expectedResult);
		});

		// note: the setLoggingLevel method returns an empty result, so any jsonrpc result object will work
		// there is no other path to test for
	});

	describe("sendInitializedNotification", () => {
		it("should return the result when valid", async () => {
			const expectedResult: Result = {};

			dummyTransport.send.mockResolvedValueOnce({
				data: {
					id: 1,
					jsonrpc: "2.0",
					result: expectedResult,
				},
			});

			const result = await client.sendInitializedNotification();

			expect(result.data).toEqual(expectedResult);
		});

		// note: the sendInitializedNotification method returns an empty result, so any jsonrpc result object will work
		// there is no other path to test for
	});

	describe("sendRootsListChangedNotification", () => {
		it("should return the result when valid", async () => {
			const expectedResult: Result = {};

			dummyTransport.send.mockResolvedValueOnce({
				data: {
					id: 1,
					jsonrpc: "2.0",
					result: expectedResult,
				},
			});

			const result = await client.sendRootsListChangedNotification();

			expect(result.data).toEqual(expectedResult);
		});

		// note: the sendRootsListChangedNotification method returns an empty result, so any jsonrpc result object will work
		// there is no other path to test for
	});

	describe("complete", () => {
		it("should return the result when valid", async () => {
			const expectedResult: CompleteResult = {
				completion: {
					values: ["one", "two", "three"],
					total: 10,
					hasMore: true,
				},
			};

			dummyTransport.send.mockResolvedValueOnce({
				data: {
					id: 1,
					jsonrpc: "2.0",
					result: expectedResult,
				},
			});

			const result = await client.complete({
				ref: {
					type: "ref/prompt",
					name: "test_prompt",
				},
				argument: {
					name: "language",
					value: "ts",
				},
			});

			expect(result.data).toEqual(expectedResult);
		});

		it("should throw on an invalid result", async () => {
			dummyTransport.send.mockResolvedValueOnce({
				data: {
					id: 1,
					jsonrpc: "2.0",
					result: {
						values: [1, 2, 3],
						total: 10,
						hasMore: true,
					},
				},
			});

			await expect(() =>
				client.complete({
					ref: {
						type: "ref/prompt",
						name: "test_prompt",
					},
					argument: {
						name: "language",
						value: "ts",
					},
				})
			).rejects.toThrowError();
		});
	});

	describe("listTools", () => {
		it("should return the result when valid", async () => {
			const expectedResult: ListToolsResult = {
				tools: [
					{
						name: "test_tool",
						description: "A test tool",
						inputSchema: {
							type: "object",
							properties: {
								num1: { type: "number" },
								num2: { type: "number" },
							},
							required: ["num1", "num2"],
						},
					},
				],
			};

			dummyTransport.send.mockResolvedValueOnce({
				data: {
					id: 1,
					jsonrpc: "2.0",
					result: expectedResult,
				},
			});

			const result = await client.listTools();

			expect(result.data).toEqual(expectedResult);
		});

		it("should throw on an invalid result", async () => {
			dummyTransport.send.mockResolvedValueOnce({
				data: {
					id: 1,
					jsonrpc: "2.0",
					result: {
						tools: [
							{
								foo: "bar",
							},
						],
					},
				},
			});

			await expect(() => client.listTools()).rejects.toThrowError();
		});
	});

	describe("callTool", () => {
		it("should return the result when valid", async () => {
			const expectedResult: CallToolResult = {
				content: [
					{
						type: "text",
						text: "result: 4",
					},
				],
			};

			dummyTransport.send.mockResolvedValueOnce({
				data: {
					id: 1,
					jsonrpc: "2.0",
					result: expectedResult,
				},
			});

			const result = await client.callTool({
				name: "test_tool",
				input: {
					num1: 2,
					num2: 2,
				},
			});

			expect(result.data).toEqual(expectedResult);
		});

		it("should throw on an invalid result", async () => {
			dummyTransport.send.mockResolvedValueOnce({
				data: {
					id: 1,
					jsonrpc: "2.0",
					result: {},
				},
			});

			await expect(() =>
				client.callTool({
					name: "test_tool",
					input: {
						num1: 2,
						num2: 2,
					},
				})
			).rejects.toThrowError();
		});
	});

	describe("listPrompts", () => {
		it("should return the result when valid", async () => {
			const expectedResult: ListPromptsResult = {
				prompts: [
					{
						name: "test_prompt",
						description: "A test prompt",
					},
				],
			};

			dummyTransport.send.mockResolvedValueOnce({
				data: {
					id: 1,
					jsonrpc: "2.0",
					result: expectedResult,
				},
			});

			const result = await client.listPrompts();

			expect(result.data).toEqual(expectedResult);
		});

		it("should throw on an invalid result", async () => {
			dummyTransport.send.mockResolvedValueOnce({
				data: {
					id: 1,
					jsonrpc: "2.0",
					result: {},
				},
			});

			await expect(() => client.listPrompts()).rejects.toThrowError();
		});
	});

	describe("getPrompt", () => {
		it("should return the result when valid", async () => {
			const expectedResult: GetPromptResult = {
				messages: [
					{
						role: "user",
						content: { type: "text", text: "Hello, world!" },
					},
				],
			};

			dummyTransport.send.mockResolvedValueOnce({
				data: {
					id: 1,
					jsonrpc: "2.0",
					result: expectedResult,
				},
			});

			const result = await client.getPrompt({
				name: "test_prompt",
			});

			expect(result.data).toEqual(expectedResult);
		});

		it("should throw on an invalid result", async () => {
			dummyTransport.send.mockResolvedValueOnce({
				data: {
					id: 1,
					jsonrpc: "2.0",
					result: {},
				},
			});

			await expect(() =>
				client.getPrompt({
					name: "test_prompt",
				})
			).rejects.toThrowError();
		});
	});

	describe("listResources", () => {
		it("should return the result when valid", async () => {
			const expectedResult: ListResourcesResult = {
				resources: [
					{
						name: "test_resource",
						uri: "http://test.com/test_resource",
						description: "A test resource",
					},
				],
			};

			dummyTransport.send.mockResolvedValueOnce({
				data: {
					id: 1,
					jsonrpc: "2.0",
					result: expectedResult,
				},
			});

			const result = await client.listResources();

			expect(result.data).toEqual(expectedResult);
		});

		it("should throw on an invalid result", async () => {
			dummyTransport.send.mockResolvedValueOnce({
				data: {
					id: 1,
					jsonrpc: "2.0",
					result: {},
				},
			});

			await expect(() => client.listResources()).rejects.toThrowError();
		});
	});

	describe("readResource", () => {
		it("should return the result when valid", async () => {
			const expectedResult: ReadResourceResult = {
				contents: [
					{
						uri: "https://test.com/test_resource",
						text: "abc",
					},
				],
			};

			dummyTransport.send.mockResolvedValueOnce({
				data: {
					id: 1,
					jsonrpc: "2.0",
					result: expectedResult,
				},
			});

			const result = await client.readResource({
				uri: "https://test.com/test_resource",
			});

			expect(result.data).toEqual(expectedResult);
		});

		it("should throw on an invalid result", async () => {
			dummyTransport.send.mockResolvedValueOnce({
				data: {
					id: 1,
					jsonrpc: "2.0",
					result: {},
				},
			});

			await expect(() =>
				client.readResource({
					uri: "https://test.com/test_resource",
				})
			).rejects.toThrowError();
		});
	});

	describe("subscribeResource", () => {
		it("should return the result when valid", async () => {
			const expectedResult: Result = {};

			dummyTransport.send.mockResolvedValueOnce({
				data: {
					id: 1,
					jsonrpc: "2.0",
					result: expectedResult,
				},
			});

			const result = await client.subscribeResource({
				uri: "https://test.com/test_resource",
			});

			expect(result.data).toEqual(expectedResult);
		});

		// note: the subscribeResource method returns an empty result, so any jsonrpc result object will work
		// there is no other path to test for
	});

	describe("unsubscribeResource", () => {
		it("should return the result when valid", async () => {
			const expectedResult = {};

			dummyTransport.send.mockResolvedValueOnce({
				data: {
					id: 1,
					jsonrpc: "2.0",
					result: expectedResult,
				},
			});

			const result = await client.unsubscribeResource({
				uri: "https://test.com/test_resource",
			});

			expect(result.data).toEqual(expectedResult);
		});

		// note: the unsubscribeResource method returns an empty result, so any jsonrpc result object will work
		// there is no other path to test for
	});

	describe("listResourceTemplates", () => {
		it("should return the result when valid", async () => {
			const expectedResult: ListResourceTemplatesResult = {
				resourceTemplates: [
					{
						name: "test_template",
						description: "A test resource template",
						uriTemplate: "https://test.com/{resource}",
					},
				],
			};

			dummyTransport.send.mockResolvedValueOnce({
				data: {
					id: 1,
					jsonrpc: "2.0",
					result: expectedResult,
				},
			});

			const result = await client.listResourceTemplates();

			expect(result.data).toEqual(expectedResult);
		});

		it("should throw on an invalid result", async () => {
			dummyTransport.send.mockResolvedValueOnce({
				data: {
					id: 1,
					jsonrpc: "2.0",
					result: {},
				},
			});

			await expect(() => client.listResourceTemplates()).rejects.toThrowError();
		});
	});
});
