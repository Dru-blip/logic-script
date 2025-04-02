import type { IRInstruction } from "./ir-generator/generator.ts";

export class StackFrame {
  // Stores local variables for this frame
  locals: Map<string, any> = new Map();
  // Return address (index to return to in the calling function)
  returnAddress: number;
  // Reference to the calling frame
  caller: StackFrame | null;

  ip: number = 0;

  constructor(
    returnAddress: number = 0,
    caller: StackFrame | null = null,
    public instructions: IRInstruction[] = [],
  ) {
    this.returnAddress = returnAddress;
    this.caller = caller;
  }
}
