import { type LogicNode, NodeType } from "../node.ts";
import type { TokenLocation } from "../../../../types";

export class MemberExpression implements LogicNode {
  type: NodeType = NodeType.MemberExpression;

  constructor(
    public readonly location: TokenLocation,
    public object: LogicNode,
    public member: LogicNode,
  ) {}
}
