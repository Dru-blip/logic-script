import { Option } from "commander";
import type { LogicCommand } from "../types";
import { parse } from "../../frontend/parser";
import {IRGenerator} from "../../frontend/eval/ir-generator/generator.ts";


export const runCommand: LogicCommand = {
  command: "run",
  description: "runs a logic file",
  action: async (options) => {
    const cwd = process.cwd();
    const filePath = cwd + "/" + options.file;
    console.log(`Validating logic file: ${filePath}`);
    const file = Bun.file(filePath);
    const content = await file.text();

    const parser = parse(content, filePath);
    const ast = parser.parse();
    if (ast.isOk) {
      const generator=new IRGenerator()
      const irModule=generator.visitProgram(ast.value!)
      console.log(irModule)
    }
  },
  options: [
    new Option(
      "-f, --file <file>",
      "The logic file to run",
    ).makeOptionMandatory(),
  ],
};
