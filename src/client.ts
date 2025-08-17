import { LATEST_PROTOCOL_VERSION } from "./constants";
import type {
	InitializeRequest,
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
	ClientCapabilities,
	RequestId,
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
	capabilities?: ClientCapabilities;
	transport: Transport;
}

// export type ClientInitializeParams =
export interface ClientSendRequestOptions {
	method: string;
	requestId?: RequestId;
	params?: Record<string, unknown>;
}

export class Client {
	private info: Implementation;
	private capabilities: ClientCapabilities | null;
	private transport: Transport;

	constructor(opts: ClientOptions) {
		this.info = opts.info;
		this.transport = opts.transport;
		this.capabilities = opts.capabilities ?? null;
	}

	public getCapabilities(): ClientCapabilities | null {
		return this.capabilities;
	}

	public async sendRequest(
		opts: ClientSendRequestOptions,
		meta?: TransportRequestMetadata
	): Promise<TransportResponse<Result>> {
		const response = await this.transport.send({
			data: JSON.stringify({
				id: opts?.requestId,
				method: opts.method,
				params: opts.params,
			}),
			meta,
		});

		assertValidJsonRpcResponse(response.data);

		return {
			data: response.data.result,
			meta: response.meta,
		};
	}

	public async initialize(
		params?: Partial<InitializeRequest["params"]>,
		meta?: TransportRequestMetadata
	): Promise<TransportResponse<InitializeResult>> {
		const result = await this.sendRequest(
			{
				method: "initialize",
				requestId: meta?.requestId,
				params: {
					protocolVersion: LATEST_PROTOCOL_VERSION,
					clientInfo: this.info,
					capabilities: this.capabilities ?? {},
					...params,
				},
			},
			meta
		);

		if (!isValidInitializeResult(result.data)) {
			throw new Error("Invalid JSON-RPC response");
		}

		return result as TransportResponse<InitializeResult>;
	}

	public async ping(meta?: TransportRequestMetadata): Promise<TransportResponse<Result>> {
		const result = await this.sendRequest(
			{
				method: "ping",
				requestId: meta?.requestId,
			},
			meta
		);

		if (!isValidEmptyResult(result.data)) {
			throw new Error("Invalid JSON-RPC response");
		}

		return result;
	}

	public async setLoggingLevel(
		level: LoggingLevel,
		meta?: TransportRequestMetadata
	): Promise<TransportResponse<Result>> {
		const result = await this.sendRequest(
			{
				method: "logging/setLevel",
				requestId: meta?.requestId,
				params: {
					level,
				},
			},
			meta
		);

		if (!isValidEmptyResult(result.data)) {
			throw new Error("Invalid JSON-RPC response");
		}

		return result;
	}

	public async sendInitializedNotification(
		meta?: TransportRequestMetadata
	): Promise<TransportResponse<Result>> {
		const result = await this.sendRequest(
			{
				method: "notifications/initialized",
				requestId: meta?.requestId,
			},
			meta
		);

		if (!isValidEmptyResult(result.data)) {
			throw new Error("Invalid JSON-RPC response");
		}

		return result;
	}

	public async sendRootsListChangedNotification(
		meta?: TransportRequestMetadata
	): Promise<TransportResponse<Result>> {
		const result = await this.sendRequest(
			{
				method: "notifications/roots/list_changed",
				requestId: meta?.requestId,
			},
			meta
		);

		if (!isValidEmptyResult(result.data)) {
			throw new Error("Invalid JSON-RPC response");
		}

		return result;
	}

	public async complete(
		params: CompleteRequest["params"],
		meta?: TransportRequestMetadata
	): Promise<TransportResponse<CompleteResult>> {
		const result = await this.sendRequest(
			{
				method: "completion/complete",
				requestId: meta?.requestId,
				params,
			},
			meta
		);

		if (!isValidCompleteResult(result.data)) {
			throw new Error("Invalid JSON-RPC response");
		}

		return result as TransportResponse<CompleteResult>;
	}

	public async listTools(
		params?: ListToolsRequest["params"],
		meta?: TransportRequestMetadata
	): Promise<TransportResponse<ListToolsResult>> {
		const result = await this.sendRequest(
			{
				method: "tools/list",
				requestId: meta?.requestId,
				params,
			},
			meta
		);

		if (!isValidListToolsResult(result.data)) {
			throw new Error("Invalid JSON-RPC response");
		}

		return result as TransportResponse<ListToolsResult>;
	}

	public async callTool(
		params: CallToolRequest["params"],
		meta?: TransportRequestMetadata
	): Promise<TransportResponse<CallToolResult>> {
		const result = await this.sendRequest(
			{
				method: "tools/call",
				requestId: meta?.requestId,
				params,
			},
			meta
		);

		if (!isValidCallToolResult(result.data)) {
			throw new Error("Invalid JSON-RPC response");
		}

		return result as TransportResponse<CallToolResult>;
	}

	public async listPrompts(
		params?: ListPromptsRequest["params"],
		meta?: TransportRequestMetadata
	): Promise<TransportResponse<ListPromptsResult>> {
		const result = await this.sendRequest(
			{
				method: "prompts/list",
				requestId: meta?.requestId,
				params,
			},
			meta
		);

		if (!isValidListPromptsResult(result.data)) {
			throw new Error("Invalid JSON-RPC response");
		}

		return result as TransportResponse<ListPromptsResult>;
	}

	public async getPrompt(
		params: GetPromptRequest["params"],
		meta?: TransportRequestMetadata
	): Promise<TransportResponse<GetPromptResult>> {
		const result = await this.sendRequest(
			{
				method: "prompts/get",
				requestId: meta?.requestId,
				params,
			},
			meta
		);

		if (!isValidGetPromptResult(result.data)) {
			throw new Error("Invalid JSON-RPC response");
		}

		return result as TransportResponse<GetPromptResult>;
	}

	public async listResources(
		params?: ListResourcesRequest["params"],
		meta?: TransportRequestMetadata
	): Promise<TransportResponse<ListResourcesResult>> {
		const result = await this.sendRequest(
			{
				method: "resources/list",
				requestId: meta?.requestId,
				params,
			},
			meta
		);

		if (!isValidListResourcesResult(result.data)) {
			throw new Error("Invalid JSON-RPC response");
		}

		return result as TransportResponse<ListResourcesResult>;
	}

	public async readResource(
		params: ReadResourceRequest["params"],
		meta?: TransportRequestMetadata
	): Promise<TransportResponse<ReadResourceResult>> {
		const result = await this.sendRequest(
			{
				method: "resources/read",
				requestId: meta?.requestId,
				params,
			},
			meta
		);

		if (!isValidReadResourceResult(result.data)) {
			throw new Error("Invalid JSON-RPC response");
		}

		return result as TransportResponse<ReadResourceResult>;
	}

	public async subscribeResource(
		params: SubscribeRequest["params"],
		meta?: TransportRequestMetadata
	): Promise<TransportResponse<Result>> {
		const result = await this.sendRequest(
			{
				method: "resources/subscribe",
				requestId: meta?.requestId,
				params,
			},
			meta
		);

		if (!isValidEmptyResult(result.data)) {
			throw new Error("Invalid JSON-RPC response");
		}

		return result;
	}

	public async unsubscribeResource(
		params: SubscribeRequest["params"],
		meta?: TransportRequestMetadata
	): Promise<TransportResponse<Result>> {
		const result = await this.sendRequest(
			{
				method: "resources/unsubscribe",
				requestId: meta?.requestId,
				params,
			},
			meta
		);

		if (!isValidEmptyResult(result.data)) {
			throw new Error("Invalid JSON-RPC response");
		}

		return result;
	}

	public async listResourceTemplates(
		params?: ListResourceTemplatesRequest["params"],
		meta?: TransportRequestMetadata
	): Promise<TransportResponse<ListResourceTemplatesResult>> {
		const result = await this.sendRequest(
			{
				method: "resources/templates/list",
				requestId: meta?.requestId,
				params,
			},
			meta
		);

		if (!isValidListResourceTemplatesResult(result.data)) {
			throw new Error("Invalid JSON-RPC response");
		}

		return result as TransportResponse<ListResourceTemplatesResult>;
	}
}
