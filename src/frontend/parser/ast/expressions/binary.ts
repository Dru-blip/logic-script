import { Token } from "../../../lexer";
import { type LogicNode, NodeType } from "../node";

export class BinaryExpression implements LogicNode {
  readonly type = NodeType.BinaryExpression;
  constructor(
    public operator: Token,
    public left: LogicNode,
    public right: LogicNode,
  ) {}
}
