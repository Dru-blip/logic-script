export interface LogicCommand {
  command: string;
  description: string;
  action: (...args: any[]) => Promise<void>;
}

export interface CliMetadata {
  version: string;
  name: string;
  description: string;
}
