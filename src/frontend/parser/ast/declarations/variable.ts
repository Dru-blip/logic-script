import type { Optional } from "../../../optional";
import { type LogicType, type TokenLocation } from "../../types";
import { type LogicNode, NodeType, type LogicExpression } from "../node";

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

  // public static make(
  //   name: Identifier,
  //   initializer: LogicNode | null,
  //   declType: LogicType,
  // ): VariableDeclaration {
  //   return new VariableDeclaration(name, initializer, declType);
  // }
}
