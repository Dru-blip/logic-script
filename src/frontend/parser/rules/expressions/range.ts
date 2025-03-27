import type {LogicParser} from "../../../../types";
import {RangeExpression} from "../../ast/expressions/range.ts";
import {logicOr} from "./logic-or.ts";
import {TokenType} from "../../../lexer";
import type {LogicNode} from "../../ast";


export const range:LogicParser<RangeExpression|LogicNode>=(context)=>{
    const start=logicOr(context)

    if(!start.isOk){
        return start
    }

    if(!context.check(TokenType.RANGE)){
        return start
    }

    context.advance();

    const end=logicOr(context)

    if(!end.isOk){
        return end
    }

    return {
        isOk: true,
        value:new RangeExpression(start.value!,end.value!)
    }
}