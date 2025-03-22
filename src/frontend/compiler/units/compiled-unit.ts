/**
 * Represents a compiled unit of PVM bytecode, including constants and global instructions.
 */
export class CompiledUnit {
  /** Total number of bytes used by constants in the constant table. */
  public totalConstantBytes: number;

  /** Byte array representing the constant table. */
  public constantTable: Uint8Array;

  /** Byte array representing global instructions. */
  public globalInstructions: Uint8Array;

  /** Total number of bytes used by global instructions. */
  public totalGlobalBytes: number;

  /**
   * Creates a new CompiledUnit instance with default buffer sizes.
   */
  constructor() {
    this.totalConstantBytes = 0;
    this.constantTable = new Uint8Array(1024);
    this.globalInstructions = new Uint8Array(1024);
    this.totalGlobalBytes = 0;
  }
}
