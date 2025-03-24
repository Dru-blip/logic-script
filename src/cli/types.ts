import type { Option } from "commander";

export interface LogicCommand {
  command: string;
  description: string;
  action: (...args: any[]) => Promise<void>;
  options?: Option[];
}

export interface CliMetadata {
  version: string;
  name: string;
  description: string;
}
