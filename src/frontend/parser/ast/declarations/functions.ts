import { BlockStatement } from "../statements";
import { type LogicNode, NodeType } from "../node";
import type { Identifier } from "./variable.ts";

export class FunctionParam {
  constructor(
    public id: Identifier,
  ) {}
}

export class FunctionDeclaration implements LogicNode {
  readonly type = NodeType.FunctionDeclaration;

  constructor(
    public name: Identifier,
    public params: FunctionParam[],
    public body: BlockStatement,
  ) {}
}
