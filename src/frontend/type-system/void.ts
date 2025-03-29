import { LogicType, TypeKind } from "./logic-type.ts";

export class LVoid extends LogicType {
  kind: TypeKind = TypeKind.Void;

  equals(other: LogicType): boolean {
    return other instanceof LVoid;
  }

  toString(): string {
    return "void";
  }
}

export const Void = new LVoid();
