export abstract class LogicObject {
  properties: Map<string, any> = new Map();
  methods: Map<string, (args: any[]) => any> = new Map();

  // Set a property
  setProperty(key: string, value: any) {
    this.properties.set(key, value);
  }

  getProperty(key: string) {
    return this.properties.get(key);
  }

  // Define a method
  setMethod(name: string, fn: (args: any[]) => any) {
    return this.methods.set(name, fn);
  }

  // Call a method
  callMethod(name: string, args: any[]) {
    const method = this.methods.get(name);
    if (!method) {
      throw new Error(`Method '${name}' not found.`);
    }
    return method(args);
  }
}
