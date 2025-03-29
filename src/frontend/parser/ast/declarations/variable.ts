// import { type LogicType, type TokenLocation } from "";
import type { TokenLocation } from "../../../../types";
import { type LogicNode, NodeType, type LogicExpression } from "../node";
import { LogicType } from "../../../type-system";

export class Identifier implements LogicNode {
  readonly type = NodeType.Identifier;

  constructor(
    public name: string,
    public location: TokenLocation,
  ) {}
}

export class VariableDeclaration implements LogicNode {
  readonly type = NodeType.VariableDeclaration;

  constructor(
    public name: Identifier,
    public initializer: LogicNode | null,
    public declType: LogicType,
  ) {}
}
