import type { Client } from "./client";
import type {
	CallToolResult,
	CallToolRequest,
	CompleteRequest,
	CompleteResult,
	InitializeResult,
	ListToolsRequest,
	ListToolsResult,
	LoggingLevel,
	Result,
	ListPromptsRequest,
	ListPromptsResult,
	GetPromptRequest,
	GetPromptResult,
	ListResourcesRequest,
	ListResourcesResult,
	ReadResourceRequest,
	ReadResourceResult,
	SubscribeRequest,
	ListResourceTemplatesResult,
} from "./generated/types";

export interface SessionOptions {
	client: Client;
}

export class Session {
	private lastRequestId: number = 0;
	private sessionId: string | null = null;
	private client: Client;

	constructor(opts: SessionOptions) {
		this.client = opts.client;
	}

	public getSessionId(): string | null {
		return this.sessionId;
	}

	public setSessionId(sessionId: string | null): void {
		this.sessionId = sessionId;
	}

	public getLastRequestId() {
		return this.lastRequestId;
	}

	private assertInitialized() {
		if (this.sessionId === null) {
			throw new Error("Session is not initialized");
		}
	}

	public async initialize(): Promise<InitializeResult> {
		const response = await this.client.initialize({
			requestId: ++this.lastRequestId,
		});

		const sessionId = response.meta?.sessionId;

		// note to self: what if a user uses a Session with a transport that doesn't require a session id. Should we even force it here then?
		if (typeof sessionId !== "string") {
			throw new Error("Failed to get session ID from initialize response");
		}

		this.sessionId = sessionId;

		return response.data;
	}

	public async ping(): Promise<Result> {
		this.assertInitialized();

		const response = await this.client.ping({
			requestId: ++this.lastRequestId,
			sessionId: this.sessionId!,
		});

		return response.data;
	}

	public async setLoggingLevel(level: LoggingLevel): Promise<Result> {
		this.assertInitialized();

		const response = await this.client.setLoggingLevel(level, {
			requestId: ++this.lastRequestId,
			sessionId: this.sessionId!,
		});

		return response.data;
	}

	public async sendInitializedNotification(): Promise<Result> {
		this.assertInitialized();

		const response = await this.client.sendInitializedNotification({
			requestId: ++this.lastRequestId,
			sessionId: this.sessionId!,
		});

		return response.data;
	}

	public async sendRootsListChangedNotification(): Promise<Result> {
		this.assertInitialized();

		const response = await this.client.sendRootsListChangedNotification({
			requestId: ++this.lastRequestId,
			sessionId: this.sessionId!,
		});

		return response.data;
	}

	public async complete(params: CompleteRequest["params"]): Promise<CompleteResult> {
		this.assertInitialized();

		const response = await this.client.complete(params, {
			requestId: ++this.lastRequestId,
			sessionId: this.sessionId!,
		});

		return response.data;
	}

	public async listTools(params?: ListToolsRequest["params"]): Promise<ListToolsResult> {
		this.assertInitialized();

		const response = await this.client.listTools(params, {
			requestId: ++this.lastRequestId,
			sessionId: this.sessionId!,
		});

		return response.data;
	}

	public async callTool(params: CallToolRequest["params"]): Promise<CallToolResult> {
		this.assertInitialized();

		const response = await this.client.callTool(params, {
			requestId: ++this.lastRequestId,
			sessionId: this.sessionId!,
		});

		return response.data;
	}

	public async listPrompts(params?: ListPromptsRequest["params"]): Promise<ListPromptsResult> {
		this.assertInitialized();

		const response = await this.client.listPrompts(params, {
			requestId: ++this.lastRequestId,
			sessionId: this.sessionId!,
		});

		return response.data;
	}

	public async getPrompt(params: GetPromptRequest["params"]): Promise<GetPromptResult> {
		this.assertInitialized();

		const response = await this.client.getPrompt(params, {
			requestId: ++this.lastRequestId,
			sessionId: this.sessionId!,
		});

		return response.data;
	}

	public async listResources(
		params?: ListResourcesRequest["params"]
	): Promise<ListResourcesResult> {
		this.assertInitialized();

		const response = await this.client.listResources(params, {
			requestId: ++this.lastRequestId,
			sessionId: this.sessionId!,
		});

		return response.data;
	}

	public async readResource(params: ReadResourceRequest["params"]): Promise<ReadResourceResult> {
		this.assertInitialized();

		const response = await this.client.readResource(params, {
			requestId: ++this.lastRequestId,
			sessionId: this.sessionId!,
		});

		return response.data;
	}

	public async subscribeResource(params: SubscribeRequest["params"]): Promise<Result> {
		this.assertInitialized();

		const response = await this.client.subscribeResource(params, {
			requestId: ++this.lastRequestId,
			sessionId: this.sessionId!,
		});

		return response.data;
	}

	public async unsubscribeResource(params: SubscribeRequest["params"]): Promise<Result> {
		this.assertInitialized();

		const response = await this.client.unsubscribeResource(params, {
			requestId: ++this.lastRequestId,
			sessionId: this.sessionId!,
		});

		return response.data;
	}

	public async listResourceTemplates(
		params?: ListResourcesRequest["params"]
	): Promise<ListResourceTemplatesResult> {
		this.assertInitialized();

		const response = await this.client.listResourceTemplates(params, {
			requestId: ++this.lastRequestId,
			sessionId: this.sessionId!,
		});

		return response.data;
	}
}
