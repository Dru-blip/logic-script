import type { Identifier } from "../declarations";
import { NodeType, type LogicNode } from "../node";

export class AssignmentExpression implements LogicNode {
  type: NodeType = NodeType.AssignmentExpression;
  constructor(
    public ident: Identifier,
    public value: LogicNode,
  ) {}
}
