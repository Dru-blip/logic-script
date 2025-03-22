import type { FileSink } from "bun";
import type { LogicConfig } from "../../types";
import type { Program } from "../parser/ast";
import { CompiledUnit } from "./units/compiled-unit";

/**
 * Represents the context for compiling a PVM source file.
 */
export class CompilerContext {
  /** The compiled unit containing constants and global instructions. */
  public unit: CompiledUnit;

  /**
   * Creates a new compiler context.
   *
   * @param {LogicConfig} config - The configuration settings for the compiler.
   * @param {{ root: string; src: string; output: string }} paths - Directory paths for the project.
   */
  constructor(
    public config: LogicConfig,
    public paths: {
      /** Root directory of the project. */
      root: string;
      /** Source directory containing the PVM source files. */
      src: string;
      /** Output directory for compiled bytecode. */
      output: string;
    },
  ) {
    this.unit = new CompiledUnit();
  }
}
