import type { LogicLiteral } from "../../../parser/ast";
import type { CompilerContext } from "../../context";
import type { CompilerFunction } from "../../types";

export const literal: CompilerFunction<LogicLiteral> = (
  node: LogicLiteral,
  context: CompilerContext,
) => {
  if (node.literalType === "string") {
    console.log(`String(${node.value})`);
  }

  if (node.literalType === "number") {
    console.log(`Number(${node.value})`);
  }

  if (node.literalType === "boolean") {
    console.log(`Boolean(${node.value})`);
  }
};
