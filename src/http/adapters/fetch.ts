import type { HttpAdapter, HttpRequest } from "../adapter";

async function collectTextFromStreamingResponse(response: Response) {
	const reader = response.body!.getReader();
	const decoder = new TextDecoder();

	let text = "";

	while (true) {
		const readResult = await reader.read();

		if (readResult.done) {
			break;
		}

		text += decoder.decode(readResult.value);
	}

	return text;
}

export class FetchAdapter implements HttpAdapter {
	async requestJson(request: HttpRequest) {
		const response = await fetch(request.url, {
			method: request.method,
			headers: request.headers,
			body: request.body,
		});

		const contentType = response.headers.get("content-type");

		let data;

		if (!contentType) {
			throw new Error("Missing content-type header");
		}

		if (contentType === "application/json") {
			data = await response.json();
		} else if (contentType === "text/event-stream") {
			const responseText = await collectTextFromStreamingResponse(response);
			const eventLines = responseText.split("\n");
			const dataLine = eventLines.find((line) => line.startsWith("data: "));

			if (!dataLine) {
				throw new Error("Data not found in event");
			}

			data = JSON.parse(dataLine.slice("data: ".length));
		} else {
			throw new Error(`Unsupported content-type: ${contentType}`);
		}

		return {
			status: response.status,
			headers: Object.fromEntries(response.headers.entries()),
			body: data,
		};
	}

	async requestStream(request: HttpRequest) {
		const response = await fetch(request.url, {
			method: request.method,
			headers: request.headers,
			body: request.body,
		});

		if (!response.body) {
			throw new Error("Response body is not readable");
		}

		const reader = response.body.getReader();
		const decoder = new TextDecoder();

		async function* streamGenerator() {
			while (true) {
				const readResult = await reader.read();

				if (readResult.done) {
					break;
				}

				yield decoder.decode(readResult.value);
			}
		}

		return {
			status: response.status,
			headers: Object.fromEntries(response.headers.entries()),
			stream: streamGenerator(),
		};
	}
}
