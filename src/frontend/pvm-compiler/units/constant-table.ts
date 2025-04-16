type Indexed = {
  value: Uint8Array;
  index: number;
};

export class ConstantTable {
  public constants: Map<string, Indexed>;
  constructor() {
    this.constants = new Map();
    this.addConstant("true", {
      index: 0,
      value: new Uint8Array([0x00, 0x03, 0x01, 0x01]),
    });
    this.addConstant("false", {
      index: 1,
      value: new Uint8Array([0x01, 0x03, 0x01, 0x00]),
    });
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

  getBufferLength(): number {
    return Array.from(this.constants.values()).reduce(
      (acc, value) => acc + value.value.length,
      0,
    );
  }

  getSize(): number {
    return this.constants.size;
  }

  toBuffer(): Uint8Array {
    const totalLength = this.getBufferLength();
    const buffer = new Uint8Array(totalLength);
    let offset = 0;
    for (const [name, value] of this.constants) {
      buffer.set(value.value, offset);
      offset += value.value.length;
    }
    return buffer;
  }
}
