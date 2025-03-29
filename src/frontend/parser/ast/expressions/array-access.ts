import { type LogicNode, NodeType } from "../node.ts";
import type { TokenLocation } from "../../../../types";

export class ArrayAccess implements LogicNode {
  type: NodeType = NodeType.ArrayAccess;

  constructor(
    public array: LogicNode,
    public index: LogicNode,
    public location: TokenLocation,
  ) {}
}
