import { type LogicNode, NodeType } from "../node.ts";
import type { TokenLocation } from "../../../../types";

export class ContinueStatement implements LogicNode {
  type: NodeType = NodeType.ContinueStatement;

  constructor(public readonly location: TokenLocation) {}
}
