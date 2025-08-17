import type { KyInstance } from "ky";
import type { HttpAdapter, HttpRequest } from "../adapter";

export class KyAdapter implements HttpAdapter {
	private ky: KyInstance;

	constructor(ky: KyInstance) {
		this.ky = ky;
	}

	async requestJson(request: HttpRequest) {
		const response = await this.ky(request.url, {
			method: request.method,
			headers: request.headers,
			body: request.body,
			throwHttpErrors: false,
		});

		return {
			status: response.status,
			headers: Object.fromEntries(response.headers.entries()),
			body: response.body,
		};
	}
}
