import { parseTOML } from "confbox";
import { compile } from "../../frontend/compiler";
import type { LogicCommand } from "../types";
import { readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import type { LogicConfig } from "../../types";
import { CompilerContext } from "../../frontend/compiler/context";

export const exists = (path: string) => {
  return existsSync(path);
};

export const compileCommand: LogicCommand = {
  command: "compile",
  description: "Compiles a logic project",
  action: async () => {
    const projectPath = process.cwd();
    const tomlPath = `${projectPath}/logic.toml`;
    const isExists = exists(tomlPath);
    if (!isExists) {
      console.error(`No logic.toml found in ${projectPath}`);
      process.exit(1);
    }
    try {
      const configFile = Bun.file(tomlPath);
      const projectConfig = parseTOML<LogicConfig>(await configFile.text());
      const srcPath = `${projectPath}/${projectConfig.paths.src_dir}`;

      const srcExists = exists(srcPath);
      if (!srcExists) {
        console.error(`No src directory found in ${projectPath}`);
        process.exit(1);
      }
      const srcFiles = await readdir(srcPath);
      const targetPath = `${projectPath}/${projectConfig.build.output}`;
      for (const fileName of srcFiles) {
        console.log(`Compiling ${fileName} ...`);
        const file = Bun.file(`${targetPath}/${fileName}`);
        const writer = file.writer();
        const context = new CompilerContext(projectConfig, writer, {
          src: srcPath,
          output: targetPath,
          root: projectPath,
        });
        await compile(`${srcPath}/${fileName}`, context);
      }
    } catch (error) {
      throw error;
    }
  },
};
