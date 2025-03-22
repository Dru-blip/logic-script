import type { FileSink } from "bun";
import type { CompiledUnit } from "./units/compiled-unit";

export class Transformer {
  static write(fileWriter: FileSink, unit: CompiledUnit) {
    fileWriter.write(unit.constantTable);
    fileWriter.end();
  }
}
