export class IndexedSet<T=any> {
    private items: T[] = [];
    private indexMap: Map<T, number> = new Map();

    add(value: T): number {
        if (this.indexMap.has(value)) return this.indexOf(value);
        this.items.push(value);
        const index=this.items.length;
        this.indexMap.set(value, index);
        return index;
    }

    has(value: T): boolean {
        return this.indexMap.has(value);
    }

    get(index: number): T | undefined {
        return this.items[index];
    }

    indexOf(value: T): number {
        return this.indexMap.get(value) ?? -1;
    }

    delete(value: T): boolean {
        const index = this.indexMap.get(value);
        if (index === undefined) return false;

        const last = this.items.pop()!;
        if (index !== this.items.length) {
            this.items[index] = last;
            this.indexMap.set(last, index);
        }

        this.indexMap.delete(value);
        return true;
    }

    get size(): number {
        return this.items.length;
    }

    [Symbol.iterator]() {
        return this.items.values();
    }
}
