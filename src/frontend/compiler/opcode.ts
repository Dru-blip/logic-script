export enum OpCode {
    // Stack operations
    PUSH = 0x01,       // Push a value onto the stack
    POP = 0x02,        // Pop the top value from the stack
    DUP = 0x03,        // Duplicate the top value on the stack
    SWAP = 0x04,       // Swap the top two values on the stack

    // Arithmetic operations
    ADD = 0x10,        // Pop two values, push their sum
    SUB = 0x11,        // Pop two values, push their difference
    MUL = 0x12,        // Pop two values, push their product
    DIV = 0x13,        // Pop two values, push their quotient
    MOD = 0x14,        // Pop two values, push their modulus

    // Logical operations
    AND = 0x20,
    OR = 0x21,
    NOT = 0x22,
    EQ = 0x23,         // Equal
    NEQ = 0x24,        // Not equal
    GT = 0x25,         // Greater than
    LT = 0x26,         // Less than
    GTE = 0x27,        // Greater than or equal
    LTE = 0x28,        // Less than or equal

    // Control flow
    JMP = 0x30,        // Jump to address
    JZ = 0x31,         // Jump if zero
    JNZ = 0x32,        // Jump if not zero
    CALL = 0x33,       // Call subroutine
    RET = 0x34,        // Return from subroutine

    // Memory access
    LOAD = 0x40,       // Load from memory
    STORE = 0x41,      // Store to memory

    // Misc
    HALT = 0xFF        // Stop execution
}
