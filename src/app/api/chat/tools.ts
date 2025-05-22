import type {
    RunnableToolFunctionWithParse,
    RunnableToolFunctionWithoutParse,
  } from "openai/lib/RunnableFunction.mjs";
  import { z } from "zod";
  import { zodToJsonSchema } from "zod-to-json-schema";
  import type { JSONSchema } from "openai/lib/jsonschema.mjs";
    
  export const tools: (
    | RunnableToolFunctionWithoutParse
    | RunnableToolFunctionWithParse<{ query: string }>
  )[] = [
    {
      type: "function",
      function: {
        name: "getToken",
        description: "Use this tool to get a unique token",
        parse: JSON.parse,
        parameters: zodToJsonSchema(
          z.object({
            query: z.string().describe("seed string"),
          })
        ) as JSONSchema,
        function: async ({ query }: { query: string }) =>
          Math.random().toString(36).substring(7),
        strict: true,
      },
    },
  ];