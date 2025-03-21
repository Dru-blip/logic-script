import {
  BinaryExpression,
  LogicLiteral,
  Program,
  UnaryExpression,
  type LogicNode,
} from "../../parser/ast";
import { GroupingExpression } from "../../parser/ast/expressions/group";
import type { CompilerContext } from "../context";
import type { CompilerFunction } from "../types";
import { binary } from "./expressions/binary";
import { group } from "./expressions/group";
import { literal } from "./expressions/literal";
import { unary } from "./expressions/unary";
import { program } from "./statements/program";

export const compileNode: CompilerFunction<LogicNode> = (
  node,
  context: CompilerContext,
) => {
  if (node instanceof Program) {
    program(node, context);
    return;
  }

  if (node instanceof GroupingExpression) {
    group(node, context);
    return;
  }

  if (node instanceof BinaryExpression) {
    binary(node, context);
    return;
  }

  if (node instanceof UnaryExpression) {
    unary(node, context);
    return;
  }

  if (node instanceof LogicLiteral) {
    literal(node, context);
    return;
  }
};
