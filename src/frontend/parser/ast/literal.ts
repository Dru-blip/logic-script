// import { PrimitiveType, type TokenLocation } from "../types";
import { type TokenLocation} from "../../../types";
import { type LogicNode, NodeType } from "./node";
import {LogicType} from "../../type-system";

export class LogicLiteral<T = any, Ty extends LogicType>
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
