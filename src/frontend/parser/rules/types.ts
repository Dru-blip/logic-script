import {ArrayType, type LogicParser, type LogicType, ObjectType, PrimitiveType, SpecialType} from "../../../types";
import {TokenType} from "../../lexer";
import {Identifier} from "../ast";
import {LgSyntaxError} from "../../errors";


export const typeParser:LogicParser<LogicType>=(context)=>{
    const {currentToken}=context

    let declType:LogicType
    switch (currentToken.type){
        case TokenType.INT:{
            context.advance()
            declType=PrimitiveType.INT
            break
        }
        case TokenType.STR:{
            context.advance()
            declType=PrimitiveType.STR
            break
        }
        case TokenType.BOOL:{
            context.advance()
            declType=PrimitiveType.BOOLEAN
            break
        }
        case TokenType.ANY:{
            context.advance()
            declType=SpecialType.ANY
            break
        }
        case TokenType.TYRANGE:{
            context.advance()
            declType=ObjectType.Range
            break
        }
        case TokenType.IDENTIFIER:{
            declType=new Identifier(currentToken.literal, currentToken.location!)
            context.advance()
            break
        }
        case TokenType.LSQRB:{
            context.advance()
            const of=typeParser(context)
            if(!of.isOk){
                return of
            }
            if(!context.check(TokenType.RSQRB)){
                return LgSyntaxError.unexpected(context,"]")
            }
            context.advance()
            declType=new ArrayType(of.value!)
            break
        }
        default:{
            return LgSyntaxError.unexpected(context,"unknown type")
        }
    }

    return {
        isOk:true,
        value:declType!
    }
}