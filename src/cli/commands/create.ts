import type { Command } from "commander";
import { mkdir } from "node:fs/promises";
import type { LogicCommand } from "../types";
import { logicTomlTemplate } from "../lib/toml-template";

export const createProject: LogicCommand = {
  command: "create <name>",
  description: "create a new logic project",
  action: async (name) => {
    const cwd = process.cwd();
    const projectPath = `${cwd}/${name}`;
    const srcPath = `${projectPath}/src`;
    await mkdir(projectPath, { recursive: true });
    await Bun.write(`${projectPath}/logic.toml`, logicTomlTemplate(name));
    await mkdir(srcPath, { recursive: true });
    const content = "Hello World";
    await Bun.write(`${srcPath}/main.lgs`, content);
  },
};
