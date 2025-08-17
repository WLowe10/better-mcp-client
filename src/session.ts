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
	CancelledNotification,
} from "./generated/types";

export interface SessionOptions {
	client: Client;
}

// food for thought: should the session id be updated if it changes? It very well could...

export class Session {
	private sessionId: string | null = null;
	private lastRequestId: number = 0;
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

	public async initialize(): Promise<InitializeResult> {
		const response = await this.client.initialize(
			{},
			{
				requestId: this.getNextRequestId(),
			}
		);

		const sessionId = response.meta?.sessionId;

		if (sessionId) {
			this.sessionId = sessionId;
		}

		return response.data;
	}

	public async ping(): Promise<Result> {
		const response = await this.client.ping({
			requestId: this.getNextRequestId(),
			sessionId: this.sessionId ?? undefined,
		});

		return response.data;
	}

	public async sendRequestCancelledNotification(
		params: CancelledNotification["params"]
	): Promise<Result> {
		const response = await this.client.sendRequestCancelledNotification(params, {
			requestId: this.getNextRequestId(),
			sessionId: this.sessionId ?? undefined,
		});

		return response.data;
	}

	public async setLoggingLevel(level: LoggingLevel): Promise<Result> {
		const response = await this.client.setLoggingLevel(level, {
			requestId: this.getNextRequestId(),
			sessionId: this.sessionId ?? undefined,
		});

		return response.data;
	}

	public async sendInitializedNotification(): Promise<Result> {
		const response = await this.client.sendInitializedNotification({
			requestId: this.getNextRequestId(),
			sessionId: this.sessionId ?? undefined,
		});

		return response.data;
	}

	public async sendRootsListChangedNotification(): Promise<Result> {
		const response = await this.client.sendRootsListChangedNotification({
			requestId: this.getNextRequestId(),
			sessionId: this.sessionId ?? undefined,
		});

		return response.data;
	}

	public async complete(params: CompleteRequest["params"]): Promise<CompleteResult> {
		const response = await this.client.complete(params, {
			requestId: this.getNextRequestId(),
			sessionId: this.sessionId ?? undefined,
		});

		return response.data;
	}

	public async listTools(params?: ListToolsRequest["params"]): Promise<ListToolsResult> {
		const response = await this.client.listTools(params, {
			requestId: this.getNextRequestId(),
			sessionId: this.sessionId ?? undefined,
		});

		return response.data;
	}

	public async callTool(params: CallToolRequest["params"]): Promise<CallToolResult> {
		const response = await this.client.callTool(params, {
			requestId: this.getNextRequestId(),
			sessionId: this.sessionId ?? undefined,
		});

		return response.data;
	}

	public async listPrompts(params?: ListPromptsRequest["params"]): Promise<ListPromptsResult> {
		const response = await this.client.listPrompts(params, {
			requestId: this.getNextRequestId(),
			sessionId: this.sessionId ?? undefined,
		});

		return response.data;
	}

	public async getPrompt(params: GetPromptRequest["params"]): Promise<GetPromptResult> {
		const response = await this.client.getPrompt(params, {
			requestId: this.getNextRequestId(),
			sessionId: this.sessionId ?? undefined,
		});

		return response.data;
	}

	public async listResources(
		params?: ListResourcesRequest["params"]
	): Promise<ListResourcesResult> {
		const response = await this.client.listResources(params, {
			requestId: this.getNextRequestId(),
			sessionId: this.sessionId ?? undefined,
		});

		return response.data;
	}

	public async readResource(params: ReadResourceRequest["params"]): Promise<ReadResourceResult> {
		const response = await this.client.readResource(params, {
			requestId: this.getNextRequestId(),
			sessionId: this.sessionId ?? undefined,
		});

		return response.data;
	}

	public async subscribeResource(params: SubscribeRequest["params"]): Promise<Result> {
		const response = await this.client.subscribeResource(params, {
			requestId: this.getNextRequestId(),
			sessionId: this.sessionId ?? undefined,
		});

		return response.data;
	}

	public async unsubscribeResource(params: SubscribeRequest["params"]): Promise<Result> {
		const response = await this.client.unsubscribeResource(params, {
			requestId: this.getNextRequestId(),
			sessionId: this.sessionId! ?? undefined,
		});

		return response.data;
	}

	public async listResourceTemplates(
		params?: ListResourcesRequest["params"]
	): Promise<ListResourceTemplatesResult> {
		const response = await this.client.listResourceTemplates(params, {
			requestId: this.getNextRequestId(),
			sessionId: this.sessionId ?? undefined,
		});

		return response.data;
	}

	private getNextRequestId() {
		return ++this.lastRequestId;
	}
}
