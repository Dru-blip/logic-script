import { NodeType, type LogicNode } from "../node";

export class IfStatement implements LogicNode {
  type: NodeType = NodeType.IfStatement;

  constructor(
    public condition: LogicNode,
    public then: LogicNode,
    public or: LogicNode,
  ) {}
}
