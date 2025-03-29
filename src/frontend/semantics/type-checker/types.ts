import type {SemanticResult} from "../../../types";
import {LogicType} from "../../type-system";


export interface TypeCheckerResult extends SemanticResult<LogicType|never>{}