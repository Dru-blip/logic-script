import { BlockStatement } from "../statements/block";
import { type LogicNode, NodeType, type LogicExpression } from "../node";

export class FunctionDeclaration implements LogicNode {
  readonly type = NodeType.FunctionDeclaration;
  constructor(
    public name: string,
    public params: { name: string }[],
    public body: LogicNode[],
  ) {}
}
