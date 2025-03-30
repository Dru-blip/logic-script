import { LObject } from "./object.ts";
import { LogicType, TypeKind } from "./logic-type.ts";

export class LIter extends LObject {
  kind: TypeKind = TypeKind.IterType;

  constructor(
    public id: string,
    public elementType: LogicType,
  ) {
    super(id);
  }

  equals(other: LogicType): boolean {
    return (
      other instanceof LIter &&
      other.elementType === this.elementType &&
      super.equals(other)
    );
  }

  toString(): string {
    return `Iter<${this.id}>`;
  }
}
