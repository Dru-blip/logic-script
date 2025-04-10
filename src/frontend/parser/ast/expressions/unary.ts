import { Token } from "../../../lexer";
import { type LogicNode, NodeType } from "../node";

export class UnaryExpression implements LogicNode {
  readonly type = NodeType.UnaryExpression;

  constructor(
    public operator: Token,
    public argument: LogicNode,
  ) {}
}
