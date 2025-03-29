import { LogicType, TypeKind } from "./logic-type.ts";

export class LArrayType extends LogicType {
  kind: TypeKind = TypeKind.ArrayType;

  constructor(public of: LogicType) {
    super();
  }

  equals(other: LogicType): boolean {
    return other instanceof LArrayType && this.of.equals(other.of);
  }

  toString(): string {
    return `[${this.of.toString()}]`;
  }
}

