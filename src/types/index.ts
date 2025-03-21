import type { Node } from "typescript";
import type { Program } from "../frontend/parser/ast";

export interface LogicConfig {
  project: {
    name: string;
    version: string;
    description: string;
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
  };
}
