import { it, expect, vi } from "vitest";
import { HttpTransport } from "./transport";
import { UnauthorizedError } from "../errors";

const dummyHttpAdapter = {
	requestJson: vi.fn(),
};

const transport = new HttpTransport({
	url: "https://test.com/mcp",
	adapter: dummyHttpAdapter,
});

it("should forward custom headers if included", async () => {
	const transport = new HttpTransport({
		url: "https://test.com/mcp",
		adapter: dummyHttpAdapter,
		headers: {
			"x-test-header": "12345",
		},
	});

	dummyHttpAdapter.requestJson.mockResolvedValueOnce({
		status: 200,
		headers: {},
		body: {},
	});

	await transport.send({ data: "{}", meta: {} });

	expect(dummyHttpAdapter.requestJson).toHaveBeenCalledWith({
		url: "https://test.com/mcp",
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json,text/event-stream",
			"x-test-header": "12345",
		},
		body: "{}",
	});
});

it("should parse the mcp session id if available", async () => {
	dummyHttpAdapter.requestJson.mockResolvedValueOnce({
		status: 200,
		headers: {
			"mcp-session-id": "12345",
		},
		body: {},
	});

	const response = await transport.send({ data: "{}", meta: {} });

	expect(response.meta.sessionId).toBe("12345");
});

it("should parse the protected resource metadata url if available", async () => {
	const expectedUrl = "https://test.com/.well-known/oauth-protected-resource";

	dummyHttpAdapter.requestJson.mockResolvedValueOnce({
		status: 401,
		headers: {
			"www-authenticate": `resource_metadata="${expectedUrl}"`,
		},
		body: {},
	});

	// this is to make sure that the assertions in the catch block are reached
	expect.assertions(2);

	try {
		await transport.send({ data: "{}", meta: {} });
	} catch (err: any) {
		expect(err).toBeInstanceOf(UnauthorizedError);

		expect((err as UnauthorizedError).resourceMetadataUrl).toBe(expectedUrl);
	}
});
