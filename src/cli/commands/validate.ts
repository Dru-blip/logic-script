import { Option } from "commander";
import type { LogicCommand } from "../types";
import { parse } from "../../frontend/parser";
import {TypeChecker} from "../../frontend/semantics/type-checker/type-checker.ts";

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
      console.info(`No parsing errors`);
      const typeChecker = new TypeChecker();
      typeChecker.check(ast.value!)
    }
  },
  options: [
    new Option(
      "-f, --file <file>",
      "The logic file to validate",
    ).makeOptionMandatory(),
  ],
};
