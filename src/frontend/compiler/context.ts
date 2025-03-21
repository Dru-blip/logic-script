import type { FileSink } from "bun";
import type { LogicConfig } from "../../types";
import type { Program } from "../parser/ast";
import type { CompiledUnit } from "./units/compiled-unit";

export class CompilerContext {
  // public ast: Program | null = null;
  public unit: CompiledUnit;
  constructor(
    public config: LogicConfig,
    // public writer: FileSink,
    public paths: {
      root: string;
      src: string;
      output: string;
    },
  ) {}
}
