import { Option } from "commander";
import type { LogicCommand } from "../types";
import { existsSync, rmdirSync } from "node:fs";
import { readdir, mkdir } from "node:fs/promises";

import { parseTOML } from "confbox";
import type { LogicConfig } from "../../types";
import { parse } from "../../frontend/parser";

import type { LogicNode } from "../../frontend/parser/ast";

/**
 * Checks if a file or directory exists.
 *
 * @param {string} path - The file or directory path to check.
 * @returns {boolean} `true` if the path exists, otherwise `false`.
 */
export const exists = (path: string): boolean => {
  return existsSync(path);
};

export const astCommand: LogicCommand = {
  command: "ast-dump",
  description: "Generate an AST for a given file",
  action: async (options) => {
    const projectPath = process.cwd();
    const tomlPath = `${projectPath}/logic.toml`;
    const isExists = exists(tomlPath);

    if (!isExists) {
      console.error(`No logic.toml found in ${projectPath}`);
      process.exit(1);
    }

    try {
      // Read and parse the configuration file
      const configFile = Bun.file(tomlPath);
      const projectConfig = parseTOML<LogicConfig>(await configFile.text());
      const srcPath = `${projectPath}/${projectConfig.paths.src_dir}`;

      if (!exists(srcPath)) {
        console.error(`No src directory found in ${projectPath}`);
        process.exit(1);
      }

      // Read source files
      const srcFiles = await readdir(srcPath);
      const targetPath = `${projectPath}/${projectConfig.paths.debug_dir ?? "debug"}`;

      if (exists(targetPath)) {
        rmdirSync(targetPath, { recursive: true });
      }

      await mkdir(targetPath, { recursive: true });

      // Compile each source file
      for (const fileName of srcFiles) {
        console.log(`Parsing ${fileName} ...`);

        const file = Bun.file(`${targetPath}/${fileName.split(".")[0]}.json`);

        const source = Bun.file(`${srcPath}/${fileName}`);
        const parser = parse(await source.text(), fileName);
        const ast = parser.parse();
        // const xml = convertLogicNodeToXml(ast);

        await file.write(JSON.stringify(ast, null, 4));
      }
    } catch (error) {
      throw error;
    }
  },
  options: [
    new Option(
      "-t, --to <format>",
      "Generate an XML representation of the AST",
    ),
  ],
};
