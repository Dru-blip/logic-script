import { Option } from "commander";
import type { LogicCommand } from "../types";
import { parse } from "../../frontend/parser";
import { TypeChecker } from "../../frontend/semantics/type-checker/type-checker.ts";
import { compileNode } from "../../frontend/compiler/functions";

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
      const typeChecker = new TypeChecker(filePath);
      const res = typeChecker.check(ast.value!);
      // console.log(res)
      if (res.isOk) {
        console.log("validation successful");
        // console.log(res)
      } else {
        res.error?.printError(content);
      }
    }
  },
  options: [
    new Option(
      "-f, --file <file>",
      "The logic file to validate",
    ).makeOptionMandatory(),
  ],
};
