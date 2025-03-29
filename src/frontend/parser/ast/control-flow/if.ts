import { NodeType, type LogicNode } from "../node";
import { BlockStatement } from "../statements";
import type { TokenLocation } from "../../../../types";

export class IfStatement implements LogicNode {
  type: NodeType = NodeType.IfStatement;

  constructor(
    public location: TokenLocation,
    public condition: LogicNode,
    public then: BlockStatement,
    public or?: BlockStatement,
    public elseIfBlocks?: LogicNode[],
  ) {}
}
