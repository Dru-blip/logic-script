import { type LogicNode, NodeType } from "../node.ts";

export class BreakStatement implements LogicNode {
  type: NodeType = NodeType.BreakStatement;

  constructor() {}
}
