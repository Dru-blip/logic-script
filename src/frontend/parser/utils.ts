import { PrimitiveType } from "../../types";
import { TokenType } from "../lexer";

export const tokenToType = (token: TokenType) => {
  if (token === TokenType.INT) {
    return PrimitiveType.INT;
  } else if (token === TokenType.STR) {
    return PrimitiveType.STR;
  } else {
    return PrimitiveType.BOOLEAN;
  }
};
