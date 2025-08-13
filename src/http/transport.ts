import { UnauthorizedError } from "../errors";
import type { Transport, TransportRequest } from "../transport";
import type { HttpAdapter } from "./adapter";

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

		const responseSessionId = response.headers["mcp-session-id"];

		return {
			data: response.body,
			meta: {
				sessionId: responseSessionId,
			},
		};
	}
}
