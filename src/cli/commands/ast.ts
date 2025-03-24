import { Option } from "commander";
import type { LogicCommand } from "../types";

export const astCommand: LogicCommand = {
  command: "ast-dump",
  description: "Generate an AST for a given file",
  action: async (options) => {
    // const ast = await generateAst(file);
    console.log(options);
  },
  options: [
    new Option(
      "-t, --to <format>",
      "Generate an XML representation of the AST",
    ),
  ],
};
