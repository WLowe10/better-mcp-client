import fs from "node:fs";
import Ajv from "ajv";
import ajvStandalone from "ajv/dist/standalone";
import mcpSchema from "../schemas/mcp.json";

const ajv = new Ajv({
	schemas: [mcpSchema],
	code: {
		esm: true,
		source: true,
	},
	formats: {
		// this just skips the validation of these formats
		// to actually validate these formats, we will have to use "ajv-formats"
		"byte": true,
		"uri": true,
		"uri-template": true,
	},
	// the mcp schema uses a type union for the request id definition
	allowUnionTypes: true,
});

const validationModuleCode = ajvStandalone(ajv, {
	JSONRPCResponse: "#/definitions/JSONRPCResponse", // the success response type
	JSONRPCError: "#/definitions/JSONRPCError", // the error response type
	JSONRPCNotification: "#/definitions/JSONRPCNotification",
	EmptyResult: "#/definitions/EmptyResult",
	InitializeResult: "#/definitions/InitializeResult",
	ListToolsResult: "#/definitions/ListToolsResult",
	CallToolResult: "#/definitions/CallToolResult",
	ListPromptsResult: "#/definitions/ListPromptsResult",
	GetPromptResult: "#/definitions/GetPromptResult",
	ListResourcesResult: "#/definitions/ListResourcesResult",
	ListResourceTemplatesResult: "#/definitions/ListResourceTemplatesResult",
	ReadResourceResult: "#/definitions/ReadResourceResult",
	CompleteResult: "#/definitions/CompleteResult",
});

fs.writeFileSync("./src/generated/validators.js", validationModuleCode);
