import type { Command } from "commander";
import { mkdir } from "node:fs/promises";
import type { LogicCommand } from "../types";
import { logicTomlTemplate } from "../lib/toml-template";

/**
 * CLI command to create a new logic project.
 */
export const createProject: LogicCommand = {
  command: "create <name>",
  description: "Create a new logic project",

  /**
   * Creates a new project directory, initializes a `logic.toml` configuration file,
   * and sets up a `src` folder with a default main source file.
   *
   * @param {string} name - The name of the project.
   * @returns {Promise<void>} A promise that resolves when the project is created.
   */
  action: async (name: string): Promise<void> => {
    const cwd = process.cwd();
    const projectPath = `${cwd}/${name}`;
    const srcPath = `${projectPath}/src`;

    // Create project directory
    await mkdir(projectPath, { recursive: true });

    // Write default configuration file
    await Bun.write(`${projectPath}/logic.toml`, logicTomlTemplate(name));

    // Create source directory
    await mkdir(srcPath, { recursive: true });

    // Create a default source file
    const content = "Hello World";
    await Bun.write(`${srcPath}/main.lgs`, content);
  },
};
