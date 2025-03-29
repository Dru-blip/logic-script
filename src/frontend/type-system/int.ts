import { LogicType, TypeKind } from "./logic-type.ts";

export class LInt extends LogicType {
  kind: TypeKind = TypeKind.Int;

  equals(other: LogicType): boolean {
    return other instanceof LInt;
  }

  toString(): string {
    return "Int";
  }
}

export const Int:LInt=new LInt;