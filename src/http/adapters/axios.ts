import type { AxiosInstance } from "axios";
import type { HttpAdapter, HttpRequest } from "../adapter";

export class AxiosAdapter implements HttpAdapter {
	private axios: AxiosInstance;

	constructor(axios: AxiosInstance) {
		this.axios = axios;
	}

	async requestJson(request: HttpRequest) {
		const response = await this.axios.request({
			url: request.url,
			method: request.method,
			headers: request.headers,
			data: request.body,
			responseType: "arraybuffer",
			validateStatus: () => true, // should never throw
		});

		let readableStream: ReadableStream<Uint8Array> | null = null;

		if (response.data) {
			const buffer = new Uint8Array(response.data); // convert ArrayBuffer → Uint8Array

			readableStream = new ReadableStream<Uint8Array>({
				start(controller) {
					controller.enqueue(buffer);
					controller.close();
				},
			});
		}

		return {
			status: response.status,
			headers: response.headers as Record<string, string>,
			body: readableStream,
		};
	}
}
