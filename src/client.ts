import { LATEST_PROTOCOL_VERSION } from "./constants";
import type {
	CallToolRequest,
	CallToolResult,
	CompleteRequest,
	CompleteResult,
	GetPromptRequest,
	GetPromptResult,
	Implementation,
	InitializeResult,
	JSONRPCResponse,
	ListPromptsRequest,
	ListPromptsResult,
	ListResourcesRequest,
	ListResourcesResult,
	ListResourceTemplatesRequest,
	ListResourceTemplatesResult,
	ListToolsRequest,
	ListToolsResult,
	LoggingLevel,
	ReadResourceRequest,
	ReadResourceResult,
	Result,
	SubscribeRequest,
} from "./generated/types";
import type { Transport, TransportRequestMetadata, TransportResponse } from "./transport";
import {
	isValidCallToolResult,
	isValidCompleteResult,
	isValidEmptyResult,
	isValidGetPromptResult,
	isValidInitializeResult,
	isValidJSONRPCError,
	isValidJSONRPCResponse,
	isValidListPromptsResult,
	isValidListResourcesResult,
	isValidListResourceTemplatesResult,
	isValidListToolsResult,
	isValidReadResourceResult,
} from "./validators";

function assertValidJsonRpcResponse(response: unknown): asserts response is JSONRPCResponse {
	if (!isValidJSONRPCResponse(response)) {
		if (!isValidJSONRPCError(response)) {
			throw new Error("Invalid JSON-RPC response");
		}

		throw new Error(`Server error: ${response.error.message}`);
	}
}

export interface ClientOptions {
	info: Implementation;
	transport: Transport;
}

export class Client {
	private info: Implementation;
	private transport: Transport;

	constructor(opts: ClientOptions) {
		this.info = opts.info;
		this.transport = opts.transport;
	}

	public async initialize(
		meta?: TransportRequestMetadata
	): Promise<TransportResponse<InitializeResult>> {
		const response = await this.transport.send({
			data: JSON.stringify({
				id: meta?.requestId,
				jsonrpc: "2.0",
				method: "initialize",
				params: {
					protocolVersion: LATEST_PROTOCOL_VERSION,
					clientInfo: this.info,
					capabilities: {},
				},
			}),
		});

		assertValidJsonRpcResponse(response.data);

		if (!isValidInitializeResult(response.data.result)) {
			throw new Error("Invalid JSON-RPC response");
		}

		return {
			data: response.data.result,
			meta: response.meta,
		};
	}

	public async ping(meta?: TransportRequestMetadata): Promise<TransportResponse<Result>> {
		const response = await this.transport.send({
			data: JSON.stringify({
				id: meta?.requestId,
				method: "ping",
			}),
			meta,
		});

		assertValidJsonRpcResponse(response.data);

		if (!isValidEmptyResult(response.data.result)) {
			throw new Error("Invalid JSON-RPC response");
		}

		return {
			data: response.data.result,
			meta: response.meta,
		};
	}

	public async setLoggingLevel(
		level: LoggingLevel,
		meta?: TransportRequestMetadata
	): Promise<TransportResponse<Result>> {
		const response = await this.transport.send({
			data: JSON.stringify({
				id: meta?.requestId,
				method: "logging/setLevel",
				params: {
					level,
				},
			}),
			meta,
		});

		assertValidJsonRpcResponse(response.data);

		if (!isValidEmptyResult(response.data.result)) {
			throw new Error("Invalid JSON-RPC response");
		}

		return {
			data: response.data.result,
			meta: response.meta,
		};
	}

	public async sendInitializedNotification(
		meta?: TransportRequestMetadata
	): Promise<TransportResponse<Result>> {
		const response = await this.transport.send({
			data: JSON.stringify({
				id: meta?.requestId,
				jsonrpc: "2.0",
				method: "notifications/initialized",
			}),
			meta,
		});

		assertValidJsonRpcResponse(response.data);

		if (!isValidEmptyResult(response.data.result)) {
			throw new Error("Invalid JSON-RPC response");
		}

		return {
			data: response.data.result,
			meta: response.meta,
		};
	}

	public async sendRootsListChangedNotification(
		meta?: TransportRequestMetadata
	): Promise<TransportResponse<Result>> {
		const response = await this.transport.send({
			data: JSON.stringify({
				id: meta?.requestId,
				jsonrpc: "2.0",
				method: "notifications/roots/list_changed",
			}),
			meta,
		});

		assertValidJsonRpcResponse(response.data);

		if (!isValidEmptyResult(response.data.result)) {
			throw new Error("Invalid JSON-RPC response");
		}

		return {
			data: response.data.result,
			meta: response.meta,
		};
	}

	public async complete(
		params: CompleteRequest["params"],
		meta?: TransportRequestMetadata
	): Promise<TransportResponse<CompleteResult>> {
		const response = await this.transport.send({
			data: JSON.stringify({
				id: meta?.requestId,
				jsonrpc: "2.0",
				method: "completion/complete",
				params,
			}),
			meta,
		});

		assertValidJsonRpcResponse(response.data);

		if (!isValidCompleteResult(response.data.result)) {
			throw new Error("Invalid JSON-RPC response");
		}

		return {
			data: response.data.result,
			meta: response.meta,
		};
	}

	public async listTools(
		params?: ListToolsRequest["params"],
		meta?: TransportRequestMetadata
	): Promise<TransportResponse<ListToolsResult>> {
		const response = await this.transport.send({
			data: JSON.stringify({
				id: meta?.requestId,
				jsonrpc: "2.0",
				method: "tools/list",
				params,
			}),
			meta,
		});

		assertValidJsonRpcResponse(response.data);

		if (!isValidListToolsResult(response.data.result)) {
			throw new Error("Invalid JSON-RPC response");
		}

		return {
			data: response.data.result,
			meta: response.meta,
		};
	}

	public async callTool(
		params: CallToolRequest["params"],
		meta?: TransportRequestMetadata
	): Promise<TransportResponse<CallToolResult>> {
		const response = await this.transport.send({
			data: JSON.stringify({
				id: meta?.requestId,
				jsonrpc: "2.0",
				method: "tools/call",
				params,
			}),
			meta,
		});

		assertValidJsonRpcResponse(response.data);

		if (!isValidCallToolResult(response.data.result)) {
			throw new Error("Invalid JSON-RPC response");
		}

		return {
			data: response.data.result,
			meta: response.meta,
		};
	}

	public async listPrompts(
		params?: ListPromptsRequest["params"],
		meta?: TransportRequestMetadata
	): Promise<TransportResponse<ListPromptsResult>> {
		const response = await this.transport.send({
			data: JSON.stringify({
				id: meta?.requestId,
				jsonrpc: "2.0",
				method: "prompts/list",
				params,
			}),
			meta,
		});

		assertValidJsonRpcResponse(response.data);

		if (!isValidListPromptsResult(response.data.result)) {
			throw new Error("Invalid JSON-RPC response");
		}

		return {
			data: response.data.result,
			meta: response.meta,
		};
	}

	public async getPrompt(
		params: GetPromptRequest["params"],
		meta?: TransportRequestMetadata
	): Promise<TransportResponse<GetPromptResult>> {
		const response = await this.transport.send({
			data: JSON.stringify({
				id: meta?.requestId,
				jsonrpc: "2.0",
				method: "prompts/get",
				params,
			}),
		});

		assertValidJsonRpcResponse(response.data);

		if (!isValidGetPromptResult(response.data.result)) {
			throw new Error("Invalid JSON-RPC response");
		}

		return {
			data: response.data.result,
			meta: response.meta,
		};
	}

	public async listResources(
		params?: ListResourcesRequest["params"],
		meta?: TransportRequestMetadata
	): Promise<TransportResponse<ListResourcesResult>> {
		const response = await this.transport.send({
			data: JSON.stringify({
				id: meta?.requestId,
				jsonrpc: "2.0",
				method: "resources/list",
				params,
			}),
			meta,
		});

		assertValidJsonRpcResponse(response.data);

		if (!isValidListResourcesResult(response.data.result)) {
			throw new Error("Invalid JSON-RPC response");
		}

		return {
			data: response.data.result,
			meta: response.meta,
		};
	}

	public async readResource(
		params: ReadResourceRequest["params"],
		meta?: TransportRequestMetadata
	): Promise<TransportResponse<ReadResourceResult>> {
		const response = await this.transport.send({
			data: JSON.stringify({
				id: meta?.requestId,
				jsonrpc: "2.0",
				method: "resources/read",
				params,
			}),
		});

		assertValidJsonRpcResponse(response.data);

		if (!isValidReadResourceResult(response.data.result)) {
			throw new Error("Invalid JSON-RPC response");
		}

		return {
			data: response.data.result,
			meta: response.meta,
		};
	}

	public async subscribeResource(
		params: SubscribeRequest["params"],
		meta?: TransportRequestMetadata
	): Promise<TransportResponse<Result>> {
		const response = await this.transport.send({
			data: JSON.stringify({
				id: meta?.requestId,
				method: "resources/subscribe",
				params,
			}),
			meta,
		});

		assertValidJsonRpcResponse(response.data);

		if (!isValidEmptyResult(response.data.result)) {
			throw new Error("Invalid JSON-RPC response");
		}

		return {
			data: response.data.result,
			meta: response.meta,
		};
	}

	public async unsubscribeResource(
		params: SubscribeRequest["params"],
		meta?: TransportRequestMetadata
	): Promise<TransportResponse<Result>> {
		const response = await this.transport.send({
			data: JSON.stringify({
				id: meta?.requestId,
				method: "resources/unsubscribe",
				params,
			}),
			meta,
		});

		assertValidJsonRpcResponse(response.data);

		if (!isValidEmptyResult(response.data.result)) {
			throw new Error("Invalid JSON-RPC response");
		}

		return {
			data: response.data.result,
			meta: response.meta,
		};
	}

	public async listResourceTemplates(
		params?: ListResourceTemplatesRequest["params"],
		meta?: TransportRequestMetadata
	): Promise<TransportResponse<ListResourceTemplatesResult>> {
		const response = await this.transport.send({
			data: JSON.stringify({
				id: meta?.requestId,
				jsonrpc: "2.0",
				method: "resources/templates/list",
				params,
			}),
			meta,
		});

		assertValidJsonRpcResponse(response.data);

		if (!isValidListResourceTemplatesResult(response.data.result)) {
			throw new Error("Invalid JSON-RPC response");
		}

		return {
			data: response.data.result,
			meta: response.meta,
		};
	}
}
