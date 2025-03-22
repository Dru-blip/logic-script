import { ConstantTable } from "./constant-table";

/**
 * Represents a compiled unit of PVM bytecode, including constants and global instructions.
 */
export class CompiledUnit {
  /** Total number of bytes used by constants in the constant table. */
  public totalConstantBytes: number;

  public totalConstants: number;

  /** Byte array representing the constant table. */
  public constantTable: ConstantTable;

  /** Byte array representing global instructions. */
  public globalInstructions: Uint8Array;

  /** Total number of bytes used by global instructions. */
  public totalGlobalBytes: number;

  /**
   * Creates a new CompiledUnit instance with default buffer sizes.
   */
  constructor() {
    this.totalConstantBytes = 0;
    this.totalConstants = 0;
    this.constantTable = new ConstantTable();
    this.globalInstructions = new Uint8Array(1024);
    this.totalGlobalBytes = 0;
  }
}
