import {LogicType, TypeKind} from "./logic-type.ts";


export class LAnyType extends LogicType {
  kind: TypeKind = TypeKind.Any;

  equals(other: LogicType): boolean {
    return other instanceof LAnyType;
  }

  toString(): string {
    return "Any";
  }
}

export const Any=new LAnyType;