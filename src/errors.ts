import type { JSONRPCError } from "./generated/types";

export interface UnauthorizedErrorOptions {
	messsage?: string;
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
