import { parseTOML } from "confbox";
import { compile } from "../../frontend/pvm-compiler";
import type { LogicCommand } from "../types";
import { readdir, mkdir } from "node:fs/promises";
import { existsSync, rmdirSync } from "node:fs";
import type { LogicConfig } from "../../types";
import { CompilerContext } from "../../frontend/pvm-compiler/context";
import { Transformer } from "../../frontend/pvm-compiler/transformer";

/**
 * Checks if a file or directory exists.
 *
 * @param {string} path - The file or directory path to check.
 * @returns {boolean} `true` if the path exists, otherwise `false`.
 */
export const exists = (path: string): boolean => {
  return existsSync(path);
};

/**
 * CLI command to compile a logic project.
 */
export const compileCommand: LogicCommand = {
  command: "compile",
  description: "Compiles a logic project",

  /**
   * Executes the compilation process.
   * Reads `logic.toml` for project configuration, compiles all source files,
   * and writes the output as PVM bytecode files.
   *
   * @throws {Error} If `logic.toml` is missing or the source directory is not found.
   */
  action: async () => {
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
      const targetPath = `${projectPath}/${projectConfig.build.output}`;

      if (exists(targetPath)) {
        rmdirSync(targetPath, { recursive: true });
      }

      await mkdir(targetPath, { recursive: true });

      // Compile each source file
      for (const fileName of srcFiles) {
        console.log(`Compiling ${fileName} ...`);

        const file = Bun.file(`${targetPath}/${fileName.split(".")[0]}.pvm`);
        // const writer = file.writer();

        const context = new CompilerContext(projectConfig, {
          src: srcPath,
          output: targetPath,
          root: projectPath,
        });

        // Compile the source file
        const compiler = await compile(`${srcPath}/${fileName}`, context);
        compiler.run();

        // Write compiled unit to file
        Transformer.write(file.writer(), context.unit);
        // writer.end();
      }
    } catch (error) {
      throw error;
    }
  },
};
