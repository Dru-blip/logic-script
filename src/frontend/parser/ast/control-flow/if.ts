import { NodeType, type LogicNode } from "../node";

export class IfExpression implements LogicNode {
  type: NodeType = NodeType.IfExpression;

  constructor(
    public condition: LogicNode,
    public then: LogicNode,
    public or: LogicNode,
  ) {}
}
