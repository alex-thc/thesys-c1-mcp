import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { RunnableToolFunctionWithoutParse, RunnableToolFunctionWithParse } from "openai/lib/RunnableFunction.mjs";

type OpenAiToolsInputType = {
    type: "function";
    function: {
      name: string;
      description?: string;
      parameters: Record<string, unknown>; // JSONSchema
    };
  };
  
  export type ToolsListServerResponseType = {
    tools: {
      name: string;
      description?: string;
      inputSchema: Record<string, unknown>; // JSONSchema
    }[];
  };
  
  /**
   * Maps the tool list received from the server via tools/list to the OpenAI tools format
   * @param toolList
   * @returns
   */
  export const mapToolListToOpenAiTools = (
    client: Client,
    toolList: ToolsListServerResponseType
  ): RunnableToolFunctionWithoutParse[] => {
    return toolList.tools.map((tool) => ({
      type: "function",
      function: {
        name: tool.name,
        description: tool.description ?? "",
        parameters: tool.inputSchema,
        function: async (args: string) =>
            callTool(client, tool.name, args),
      },
    }));
  };

  const callTool = async (
    client: Client,
    toolName: string,
    inputArgs: string
  ): Promise<[err: null, result: any] | [err: string, result: null]> => {
    try {

      console.log("calling tool " + toolName + " with args " + inputArgs);

      const args = inputArgs !== "" ? JSON.parse(inputArgs): {};

  
      const resourceContent = await client.callTool({
        name: toolName,
        arguments: args,
      });

      console.log("tool result: " + resourceContent);
  
      return [null, resourceContent];
    } catch (error) {
      console.error("Error parsing arguments:", error);
      return [(error as Error).message, null];
    }
  };