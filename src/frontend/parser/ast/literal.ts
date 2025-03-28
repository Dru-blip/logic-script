// import { PrimitiveType, type TokenLocation } from "../types";
import {ArrayType, type LogicType, type PrimitiveType, type TokenLocation} from "../../../types";
import { type LogicNode, NodeType } from "./node";

export class LogicLiteral<T = any, Ty extends PrimitiveType>
  implements LogicNode
{
  type = NodeType.Literal;
  literalType: string;
  value: T;
  location: TokenLocation;
  declType: LogicType;

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


export class ArrayLiteral implements LogicNode{
  type=NodeType.ArrayLiteral
  constructor(public values:LogicNode[],public location:TokenLocation) {}
}
