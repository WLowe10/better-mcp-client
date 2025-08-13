export interface HttpRequest {
	url: string;
	method: string;
	body?: string;
	headers?: Record<string, string>;
}

export interface HttpResponse {
	status: number;
	headers: Record<string, string>;
	body?: unknown;
	stream?: AsyncGenerator<string, void, unknown>;
}

export interface StreamHttpResponse {
	status: number;
	headers: Record<string, string>;
	stream: AsyncGenerator<string, void, unknown>;
}

export interface HttpAdapter {
	requestJson(request: HttpRequest): Promise<HttpResponse>;
}
