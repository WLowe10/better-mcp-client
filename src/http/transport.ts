import { UnauthorizedError } from "../errors";
import type { Transport, TransportRequest } from "../transport";
import type { HttpAdapter } from "./adapter";

async function collectTextFromReadableStream(
	stream: ReadableStream<Uint8Array>,
	isStreaming: boolean = false
): Promise<string> {
	const reader = stream.getReader();
	const decoder = new TextDecoder();

	let text = "";

	while (true) {
		const readResult = await reader.read();

		if (readResult.done) {
			break;
		}

		text += decoder.decode(readResult.value, {
			stream: isStreaming,
		});
	}

	return text;
}

const resourceMetadataRegex = /resource_metadata="([^"]*)"/;

function parseResourceMetadataUrlFromHeader(header: string): string | null {
	const match = resourceMetadataRegex.exec(header);

	if (!match) {
		return null;
	}

	return match[1] ?? null;
}

export interface HttpTransportOptions {
	/** The url of the MCP server */
	url: string;
	/** Custom headers to include in requests */
	headers?: Record<string, string>;
	/** The HTTP adapter to use for sending requests */
	adapter: HttpAdapter;
}

export class HttpTransport implements Transport {
	private url: string;
	private headers: Record<string, string>;
	private adapter: HttpAdapter;

	constructor(opts: HttpTransportOptions) {
		this.url = opts.url;
		this.adapter = opts.adapter;
		this.headers = opts.headers ?? {};
	}

	public async send(request: TransportRequest) {
		const headers: Record<string, string> = {
			"Content-Type": "application/json",
			"Accept": "application/json,text/event-stream",
			...this.headers,
		};

		if (request.meta?.sessionId) {
			headers["Mcp-Session-Id"] = request.meta.sessionId;
		}

		const response = await this.adapter.requestJson({
			url: this.url,
			method: "POST",
			headers,
			body: request.data,
		});

		if (!response.body) {
			throw new Error("Missing response body");
		}

		// unauthenticated, check for auth URL in response headers
		if (response.status === 401) {
			const wwwAuthenticate = response.headers["www-authenticate"];

			let resourceMetadataUrl = null;

			if (wwwAuthenticate) {
				resourceMetadataUrl = parseResourceMetadataUrlFromHeader(wwwAuthenticate);
			}

			throw new UnauthorizedError({
				resourceMetadataUrl: resourceMetadataUrl ?? undefined,
			});
		}

		const contentType = response.headers["content-type"];

		if (!contentType) {
			throw new Error("Missing content-type header");
		}

		let dataStr;

		if (contentType === "application/json") {
			dataStr = await collectTextFromReadableStream(response.body);
		} else if (contentType === "text/event-stream") {
			const bodyText = await collectTextFromReadableStream(response.body, true);

			// const responseText = await collectTextFromStreamingResponse(response);
			const eventLines = bodyText.split("\n");
			const dataLine = eventLines.find((line) => line.startsWith("data: "));

			if (!dataLine) {
				throw new Error("Data not found in event");
			}

			dataStr = dataLine.slice(6); // 6 is the length of the "data: " prefix
		} else {
			throw new Error(`Unsupported content-type: ${contentType}`);
		}

		let dataObj;

		try {
			dataObj = JSON.parse(dataStr);
		} catch {
			throw new Error("Failed to parse response JSON");
		}

		const responseSessionId = response.headers["mcp-session-id"];

		return {
			data: dataObj,
			meta: {
				sessionId: responseSessionId,
			},
		};
	}
}
