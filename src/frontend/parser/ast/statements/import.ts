import { type LogicNode, NodeType } from "../node";
import type { TokenLocation } from "../../../../types";

export class ImportStatement implements LogicNode {
  readonly type = NodeType.ImportStatement;

  constructor(
    public readonly location: TokenLocation,
    public path: string,
  ) {}
}
