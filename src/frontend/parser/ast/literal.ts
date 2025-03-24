import { PrimitiveType, type TokenLocation } from "../types";
import { type LogicNode, NodeType } from "./node";

export class LogicLiteral<T = any, Ty extends PrimitiveType>
  implements LogicNode
{
  type = NodeType.Literal;
  literalType: string;
  value: T;
  location: TokenLocation;
  declType: PrimitiveType;

  constructor(
    value: T,
    declType: Ty,
    literalType: string,
    location: TokenLocation,
  ) {
    this.value = value;
    this.literalType = literalType;
    this.location = location;
    this.declType = declType;
  }
}
