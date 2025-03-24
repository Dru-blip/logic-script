import { astCommand } from "./src/cli/commands/ast";
import { compileCommand } from "./src/cli/commands/compile";
import { createProject } from "./src/cli/commands/create";
import { LogicCli } from "./src/cli/logic-cli";

const cli = new LogicCli({
  version: "1.0.0",
  name: "Logic",
  description: "Logic CLI",
});

cli.addCommand(createProject).addCommand(compileCommand).addCommand(astCommand);

cli.program.parse(process.argv);
