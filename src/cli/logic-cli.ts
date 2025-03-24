import { Command } from "commander";
import type { CliMetadata, LogicCommand } from "./types";

export class LogicCli {
  program: Command;
  constructor(info: CliMetadata) {
    this.program = new Command(info.name);
    this.program.version(info.version);
    this.program.description(info.description);
  }

  addCommand(lc: LogicCommand) {
    const cmd = this.program
      .command(lc.command)
      .description(lc.description)
      .action(lc.action);

    for (const option of lc.options ?? []) {
      cmd.addOption(option);
    }

    return this;
  }
}
