import { BlockStatement } from "../statements";
import { type LogicNode, NodeType, type LogicExpression } from "../node";
import type { Identifier } from "./variable.ts";
import { LogicType } from "../../../type-system";

export class FunctionParam {
  constructor(
    public id: Identifier,
    public paramType: LogicType,
  ) {}
}

export class FunctionDeclaration implements LogicNode {
  readonly type = NodeType.FunctionDeclaration;

  constructor(
    public name: Identifier,
    public params: FunctionParam[],
    public body: BlockStatement,
    public returnType: LogicType,
  ) {}
}
