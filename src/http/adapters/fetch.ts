import type { HttpAdapter, HttpRequest } from "../adapter";

export class FetchAdapter implements HttpAdapter {
	async requestJson(request: HttpRequest) {
		const response = await fetch(request.url, {
			method: request.method,
			headers: request.headers,
			body: request.body,
		});

		return {
			status: response.status,
			headers: Object.fromEntries(response.headers.entries()),
			body: response.body,
		};
	}
}
