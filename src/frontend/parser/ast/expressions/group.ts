import { NodeType, type LogicExpression, type LogicNode } from "../node";

export class GroupingExpression implements LogicExpression {
  type: NodeType = NodeType.GroupingExpression;
  constructor(public expr: LogicNode) {}
}
