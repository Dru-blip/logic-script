import { LObject } from "./object.ts";
import { type LogicType, TypeKind } from "./logic-type.ts";
import type {FunctionParam} from "../parser/ast/declarations/functions.ts";

export class LFuncType extends LObject {
  kind: TypeKind = TypeKind.FunctionType
  constructor(
    id: string,
    public params: FunctionParam[],
    public returnType: LogicType,
  ) {
    super(id);
  }
  equals(other: LogicType): boolean {
    return super.equals(other);
  }
  toString(): string {
    return `Function`;
  }
}
