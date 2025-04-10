import type { LogicError } from "../frontend/errors";
import type { ParserContext } from "../frontend/parser/context";
import { Identifier, type LogicNode } from "../frontend/parser/ast";
// import type { LgSemanticError } from "../frontend/errors/semantics.ts";

export interface LogicConfig {
  project: {
    name: string;
    version: string;
    description: string;
  };
  types: {
    max_str_size: 128;
  };
  build: {
    entry: string;
    output: string;
  };
  target: {
    byte_order: string;
  };
  paths: {
    src_dir: string;
    debug_dir: string;
  };
}

export interface ParseResult<T> {
  isOk: boolean;
  value?: T;
  error?: LogicError;
}

export type LogicParser<T> = (context: ParserContext) => ParseResult<T>;

// export interface SemanticResult<T> {
//   isOk: boolean;
//   error?: LgSemanticError;
//   value?: T;
// }

export type TokenLocation = {
  filename: string;
  line: number;
  col: number;
  offset: number;
};

// export enum PrimitiveType {
//   STR = "Str",
//   INT = "Int",
//   BOOLEAN = "Bool",
//   UNKNOWN = "Unknown",
// }
//
// export class ArrayType{
//   type="Array"
//   constructor(public of:LogicType) {}
//   toString():string{
//     return `[${this.of.toString()}]`;
//   }
// }
//
// export enum ObjectType {
//   Range= "Range",
// }
//
// export enum SpecialType {
//   ANY = "any",
// }
//
// export type LogicType = PrimitiveType | SpecialType | ObjectType |Identifier | ArrayType;
