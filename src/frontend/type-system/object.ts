import { LogicType, TypeKind } from "./logic-type.ts";
import { Identifier } from "../parser/ast";

export class LObject extends LogicType {
  kind: TypeKind = TypeKind.ObjectType;

  constructor(public id: string) {
    super();
  }

  equals(other: LogicType): boolean {
    throw new Error("Method not implemented.");
  }

  toString(): string {
    return `Object<${this.id}>`
  }
}
