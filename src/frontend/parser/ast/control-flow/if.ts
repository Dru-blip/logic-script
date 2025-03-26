import { NodeType, type LogicNode } from "../node";
import {BlockStatement} from "../statements";

export class IfStatement implements LogicNode {
  type: NodeType = NodeType.IfStatement;

  constructor(
    public condition: LogicNode,
    public then: BlockStatement,
    public or?: BlockStatement,
    public elseIfBlocks?: LogicNode[]
  ) {}
}
