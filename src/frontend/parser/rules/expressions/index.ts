import { type LogicNode } from "../../ast";
import { type LogicParser } from "../../types";
import { logicOr } from "./logic-or";

export const expression: LogicParser<LogicNode> = (context) => {
  return logicOr(context);
};
