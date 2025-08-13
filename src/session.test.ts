import { expect, it, vi } from "vitest";
import { Client } from "./client";
import { Session } from "./session";

const dummyTransport = {
	send: vi.fn(),
};

const client = new Client({
	info: {
		name: "test client",
		version: "0.0.1",
	},
	transport: dummyTransport,
});

it("initialize should store the session id", async () => {
	const session = new Session({
		client,
	});

	dummyTransport.send.mockResolvedValueOnce({
		data: {
			id: 1,
			jsonrpc: "2.0",
			result: {
				protocolVersion: "2025-06-18",
				serverInfo: { name: "My Server", version: "1.0.0" },
				capabilities: { tools: {}, prompts: {}, logging: {} },
			},
		},
		meta: {
			sessionId: "12345",
		},
	});

	await session.initialize();

	expect(session.getSessionId()).toBe("12345");
});

it("operation should increment the request id", async () => {
	const session = new Session({
		client,
	});

	expect(session.getLastRequestId()).toBe(0);

	dummyTransport.send.mockResolvedValueOnce({
		data: {
			id: 1,
			jsonrpc: "2.0",
			result: {
				protocolVersion: "2025-06-18",
				serverInfo: { name: "My Server", version: "1.0.0" },
				capabilities: { tools: {}, prompts: {}, logging: {} },
			},
		},
		meta: {
			sessionId: "12345",
		},
	});

	await session.initialize();

	expect(session.getLastRequestId()).toBe(1);
});
