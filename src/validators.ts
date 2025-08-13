// these functions wrap the generated validators

import * as generatedValidators from "./generated/validators";
import type {
	JSONRPCError,
	JSONRPCResponse,
	Result,
	InitializeResult,
	ListToolsResult,
	CallToolResult,
	ListPromptsResult,
	GetPromptResult,
	ListResourcesResult,
	ListResourceTemplatesResult,
	ReadResourceResult,
	CompleteResult,
} from "./generated/types";

export function isValidJSONRPCResponse(result: unknown): result is JSONRPCResponse {
	return generatedValidators.JSONRPCResponse(result);
}

export function isValidEmptyResult(result: unknown): result is Result {
	return generatedValidators.EmptyResult(result);
}

export function isValidJSONRPCError(result: unknown): result is JSONRPCError {
	return generatedValidators.JSONRPCError(result);
}

export function isValidJSONRPCNotification(result: unknown): result is JSONRPCError {
	return generatedValidators.JSONRPCNotification(result);
}

export function isValidInitializeResult(response: unknown): response is InitializeResult {
	return generatedValidators.InitializeResult(response);
}

export function isValidListToolsResult(response: unknown): response is ListToolsResult {
	return generatedValidators.ListToolsResult(response);
}

export function isValidCallToolResult(response: unknown): response is CallToolResult {
	return generatedValidators.CallToolResult(response);
}

export function isValidListPromptsResult(response: unknown): response is ListPromptsResult {
	return generatedValidators.ListPromptsResult(response);
}

export function isValidGetPromptResult(response: unknown): response is GetPromptResult {
	return generatedValidators.GetPromptResult(response);
}

export function isValidListResourcesResult(response: unknown): response is ListResourcesResult {
	return generatedValidators.ListResourcesResult(response);
}

export function isValidListResourceTemplatesResult(
	response: unknown
): response is ListResourceTemplatesResult {
	return generatedValidators.ListResourceTemplatesResult(response);
}

export function isValidReadResourceResult(response: unknown): response is ReadResourceResult {
	return generatedValidators.ReadResourceResult(response);
}

export function isValidCompleteResult(response: unknown): response is CompleteResult {
	return generatedValidators.CompleteResult(response);
}
