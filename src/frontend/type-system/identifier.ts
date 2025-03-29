import {LogicType, TypeKind} from "./logic-type.ts";
import {Identifier} from "../parser/ast";


export class LIdentifier extends LogicType {
  kind: TypeKind=TypeKind.Identifier;

  constructor(public id:Identifier) {
      super();
  }

  equals(other: LogicType): boolean {
    return false;
  }

  toString(): string {
    return "";
  }
}