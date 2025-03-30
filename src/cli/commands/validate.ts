import { Option } from "commander";
import type { LogicCommand } from "../types";
import { parse } from "../../frontend/parser";


export const validateCommand: LogicCommand = {
  command: "validate",
  description: "Validate a logic file",
  action: async (options) => {
    const cwd = process.cwd();
    const filePath = cwd + "/" + options.file;
    console.log(`Validating logic file: ${filePath}`);
    const file = Bun.file(filePath);
    const content = await file.text();

    const parser = parse(content, filePath);
    const ast = parser.parse();
    if (ast.isOk) {
      console.log("Validation");
    }
  },
  options: [
    new Option(
      "-f, --file <file>",
      "The logic file to validate",
    ).makeOptionMandatory(),
  ],
};
