import { type LogicNode, NodeType } from "../node";
import type { TokenLocation } from "../../../../types";

export class RangeStatement implements LogicNode {
  readonly type = NodeType.RangeStatement;

  constructor(
    public readonly location: TokenLocation,
    public start: LogicNode,
    public end: LogicNode,
    public body: LogicNode,
  ) {}
}
