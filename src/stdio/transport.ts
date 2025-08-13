import type { Transport } from "../transport/transport";

export class StdioTransport implements Transport {
	public async send(request: unknown) {}
}
