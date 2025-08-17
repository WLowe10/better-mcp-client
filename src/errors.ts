import type { JSONRPCError } from "./generated/types";

export interface UnauthorizedErrorOptions {
	messsage?: string;

	/**
	 * The OAuth URL for the server
	 *
	 * note: If one is not found in the response headers, the default will be site_url + "/oauth/authorize"
	 */
	resourceMetadataUrl?: string;
}

export class UnauthorizedError extends Error {
	public resourceMetadataUrl: string | undefined;

	constructor(opts?: UnauthorizedErrorOptions) {
		super(opts?.messsage ?? "Unauthorized");

		this.name = "UnauthorizedError";
		this.resourceMetadataUrl = opts?.resourceMetadataUrl;
	}
}

export class ServerError extends Error {
	public jsonRpcError: JSONRPCError["error"];

	constructor(error: JSONRPCError["error"]) {
		super(`Server Error: ${error.code}: ${error.message}`);

		this.name = "ServerError";
		this.jsonRpcError = error;
	}
}
