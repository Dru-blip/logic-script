export class Opcode {
  // STACK operations
  static readonly PUSH = 0x01;
  static readonly POP = 0x02;
  static readonly DUP = 0x03;
  static readonly SWAP = 0x04;

  // Arithmetic Operations
  static readonly ADD = 0x10;
  static readonly SUB = 0x11;
  static readonly MUL = 0x12;
  static readonly DIV = 0x13;
  static readonly MOD = 0x14;

  // Logical Operations
  static readonly AND = 0x20;
  static readonly OR = 0x21;
  static readonly XOR = 0x22;
  static readonly NOT = 0x24;

  // Comparison Operations
  static readonly EQ = 0x30;
  static readonly NEQ = 0x31;
  static readonly GT = 0x32;
  static readonly LT = 0x33;
  static readonly GTE = 0x34;
  static readonly LTE = 0x35;

  // Control Flow Operations
  static readonly JMP = 0x40;
  static readonly JZ = 0x41;
  static readonly JNZ = 0x42;
  static readonly CALL = 0x43;
  static readonly RET = 0x44;

  // Memory Operations
  static readonly LOAD = 0x50;
  static readonly LOAD_CONST = 0x51;
  static readonly STORE = 0x52;

  // Function management
  static readonly FUNC = 0x60;
  static readonly FUNC_END = 0x61;

  // Miscellaneous
  static readonly HALT = 0x79;

  // Map tokens to hex values
  static readonly TOKEN_MAP: Record<string, number> = {
    PUSH: Opcode.PUSH,
    POP: Opcode.POP,
    DUP: Opcode.DUP,
    SWAP: Opcode.SWAP,
    ADD: Opcode.ADD,
    SUB: Opcode.SUB,
    MUL: Opcode.MUL,
    DIV: Opcode.DIV,
    MOD: Opcode.MOD,
    AND: Opcode.AND,
    OR: Opcode.OR,
    XOR: Opcode.XOR,
    NOT: Opcode.NOT,
    EQ: Opcode.EQ,
    NEQ: Opcode.NEQ,
    GT: Opcode.GT,
    LT: Opcode.LT,
    GTE: Opcode.GTE,
    LTE: Opcode.LTE,
    JMP: Opcode.JMP,
    JZ: Opcode.JZ,
    JNZ: Opcode.JNZ,
    CALL: Opcode.CALL,
    RET: Opcode.RET,
    LOAD: Opcode.LOAD,
    LOAD_CONST: Opcode.LOAD_CONST,
    STORE: Opcode.STORE,
    FUNC: Opcode.FUNC,
    FUNC_END: Opcode.FUNC_END,
    HALT: Opcode.HALT,
  };

  // Map TokenType symbols to Opcode values
  static readonly TOKEN_TO_OPCODE: Record<string, number> = {
    "+": Opcode.ADD,
    "-": Opcode.SUB,
    "*": Opcode.MUL,
    "/": Opcode.DIV,
    "%": Opcode.MOD,
    "==": Opcode.EQ,
    "!=": Opcode.NEQ,
    "<": Opcode.LT,
    ">": Opcode.GT,
    "<=": Opcode.LTE,
    ">=": Opcode.GTE,
    and: Opcode.AND,
    or: Opcode.OR,
    "!": Opcode.NOT,
  };
}
