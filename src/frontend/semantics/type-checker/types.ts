import type {LogicType} from "../../../types";


export interface TypeCheckerResult {
    isOk: boolean,
    error?: string,
    type?:LogicType
}