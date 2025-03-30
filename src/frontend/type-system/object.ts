import { LogicType, TypeKind } from "./logic-type.ts";

export class LObject extends LogicType {
  kind: TypeKind = TypeKind.ObjectType;

  constructor(public id: string) {
    super();
  }

  equals(other: LogicType): boolean {
    return other instanceof LObject && other.id === this.id;
  }

  toString(): string {
    return `Object<${this.id}>`;
  }
}
