export interface HttpRequest {
	url: string;
	method: string;
	body?: string;
	headers?: Record<string, string>;
}

export interface HttpResponse {
	status: number;
	headers: Record<string, string>;
	body: ReadableStream<Uint8Array> | null;
}

export interface HttpAdapter {
	requestJson(request: HttpRequest): Promise<HttpResponse>;
}
