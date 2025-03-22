type Indexed = {
  value: Uint8Array;
  index: number;
};

export class ConstantTable {
  public constants: Map<string, Indexed>;
  constructor() {
    this.constants = new Map();
  }
  addConstant(name: string, value: Indexed): void {
    this.constants.set(name, value);
  }
  getConstant(name: string): Indexed | undefined {
    return this.constants.get(name);
  }

  hasConstant(name: string): boolean {
    return this.constants.has(name);
  }

  toBuffer(): Uint8Array {
    const totalLength = Array.from(this.constants.values()).reduce(
      (acc, value) => acc + value.value.length,
      0,
    );
    const buffer = new Uint8Array(totalLength);
    let offset = 0;
    for (const [name, value] of this.constants) {
      buffer.set(value.value, offset);
      offset += value.value.length;
    }
    return buffer;
  }
}
