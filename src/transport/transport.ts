import type { RequestId } from "../generated/types";

export interface TransportRequestMetadata {
	/** The ID of the request */
	requestId?: RequestId;
	/** The session ID for the transport */
	sessionId?: string;
}

export interface TransportRequest {
	data: string;
	meta?: TransportRequestMetadata;
}

export interface TransportResponseMetadata {
	/** The session ID for the transport */
	sessionId?: string;
}

export interface TransportResponse<TData = unknown> {
	data: TData;
	meta?: TransportResponseMetadata;
}

export interface Transport {
	send(request: TransportRequest): Promise<TransportResponse>;
}
