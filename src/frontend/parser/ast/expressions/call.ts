import { type LogicNode, NodeType } from "../node.ts";
import type { TokenLocation } from "../../../../types";

export class CallExpression implements LogicNode {
  type: NodeType = NodeType.CallExpression;

  constructor(
    public location: TokenLocation,
    public callee: LogicNode,
    public args: LogicNode[],
  ) {}
}
