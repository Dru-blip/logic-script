import {type LogicNode, NodeType} from "../node";

export class AssignmentExpression implements LogicNode {
  type: NodeType = NodeType.AssignmentExpression;
  constructor(
    public target: LogicNode,
    public value: LogicNode,
  ) {}
}
