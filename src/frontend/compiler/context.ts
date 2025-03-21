import type { FileSink } from "bun";
import type { LogicConfig } from "../../types";
import type { Program } from "../parser/ast";

export class CompilerContext {
  public ast: Program | null = null;
  constructor(
    public config: LogicConfig,
    public writer: FileSink,
    public paths: {
      root: string;
      src: string;
      output: string;
    },
  ) {}
}
