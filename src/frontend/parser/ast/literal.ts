import { type TokenLocation } from "../types";
import { type LogicNode, NodeType } from "./node";

export class LogicLiteral<T = any> implements LogicNode {
  type = NodeType.Literal;
  literalType: string;
  value: T;
  location: TokenLocation;

  constructor(value: T, literalType: string, location: TokenLocation) {
    this.value = value;
    this.literalType = literalType;
    this.location = location;
  }
}
