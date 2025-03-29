import { type LogicNode, NodeType } from "../node";
import type { TokenLocation } from "../../../../types";

export class AssignmentExpression implements LogicNode {
  type: NodeType = NodeType.AssignmentExpression;

  constructor(
    public location: TokenLocation,
    public target: LogicNode,
    public value: LogicNode,
  ) {}
}
