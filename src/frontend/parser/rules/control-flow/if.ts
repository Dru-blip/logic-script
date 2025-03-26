import type { LogicParser } from "../../../../types";
import { LgSyntaxError } from "../../../errors";
import { TokenType } from "../../../lexer";
import type { LogicNode } from "../../ast";
import { IfStatement} from "../../ast/control-flow/if";
import { block } from "../statements/block";
import { logicAnd } from "../expressions/logic-and";

export const ifExpresion: LogicParser<IfStatement|LogicNode> = (context) => {
  if (!context.check(TokenType.IF)) {
    return LgSyntaxError.unexpected(context, "Expected 'if'");
  }

  context.advance()

  const condition=logicAnd(context)

  if(!condition.isOk){
    return condition
  }
  
  const thenBlock=block(context)

  if(!thenBlock.isOk){
    return thenBlock
  }

  const elseBlock=block(context)
  
  if(!elseBlock.isOk){
    return elseBlock
  }

  return {
    isOk: true,
    value: new IfStatement(
      <LogicNode>condition.value,
      <LogicNode>thenBlock.value,
      <LogicNode>elseBlock.value
    ),
  };
};
