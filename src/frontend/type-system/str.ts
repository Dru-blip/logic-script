import {LogicType, TypeKind} from "./logic-type.ts";


export class LStr extends LogicType {
  kind: TypeKind=TypeKind.Str;

  equals(other: LogicType): boolean {
    return other instanceof LStr;
  }

  toString(): string {
    return "Str";
  }
}

export const Str=new LStr;