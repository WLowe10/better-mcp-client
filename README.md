# better-mcp-client

This library is a TypeScript client implementation for the [Model Context Protocol (MCP)](https://modelcontextprotocol.io).

What makes this client the best?

- zero dependencies
- works in any runtime (browser, node, etc)
- separation of stateless and stateful client features

## Why not use `@modelcontextprotocol/sdk`

As of `2025-08-12`, there are multiple reasons to use `better-mcp-client` over `@modelcontextprotocol/sdk`

- `@modelcontextprotocol/sdk` utilizes exports that may not work with module resolution
- `@modelcontextprotocol/sdk` depends on node

## Get started

### Install

```sh
pnpm add @better-mcp/client
# or
yarn add @better-mcp/client
# or
npm install @better-mcp/client
```

## Examples

### Over HTTP

```ts
import { Client } from "@better-mcp/client";
import { HttpTransport, FetchAdapter } "@better-mcp/client/http"

const transport = new HttpTransport({
	adapter: new FetchAdapter(),
	url: "http://localhost:8000/mcp",
});

const client = new Client({
	info: {
		name: "my-mcp-client",
		version: "0.0.1",
	},
	transport,
});

// initialize client
const initializeResult = await client.initialize();
const sessionId = initializeResult.meta.sessionId;

// list tools
await client.listTools(
	{},
	{
		sessionId,
	}
);
```

### Over stdio

```ts
import { Client } from "@better-mcp/client";
import { StdioTransport } "@better-mcp/client/stdio"

const transport = new StdioTransport({
	command: "node",
	args: ["./dist/main.js"]
});

const client = new Client({
	info: {
		name: "my-mcp-client",
		version: "0.0.1",
	},
	transport,
});

// start the process
transport.start();

// initialize client
const initializeResult = await client.initialize();

// list tools
await client.listTools();
```

### Session

`Session` is a wrapper around `Client` that automatically manages the `mcp-session-id` and `requestId`.

```ts
const transport = new HttpTransport({
	adapter: new FetchAdapter(),
	url: "http://localhost:8000/mcp",
});

const client = new Client({
	info: {
		name: "my-mcp-client",
		version: "0.0.1",
	},
	transport,
});

const session = new Session({
	client,
});

await session.initialize();

// no need to pass around the session id anymore :)
await client.listTools();
```
