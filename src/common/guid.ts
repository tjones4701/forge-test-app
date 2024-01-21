export class Guid {
  private value: string;
  private static validator = new RegExp(
    "^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$",
    "i"
  );
  private static EMPTY = "00000000-0000-0000-0000-000000000000";

  constructor(guid: string) {
    if (!guid) {
      throw new TypeError("Invalid argument; `value` has no value.");
    }
    this.value = Guid.EMPTY;
    if (guid && Guid.isGuid(guid)) {
      this.value = guid;
    }
  }

  public static isGuid(guid: any): boolean {
    const value = guid.toString();
    return guid && (guid instanceof Guid || Guid.validator.test(value));
  }

  public static create(): Guid {
    return new Guid(
      [Guid.gen(2), Guid.gen(1), Guid.gen(1), Guid.gen(1), Guid.gen(3)].join(
        "-"
      )
    );
  }

  public static createEmpty(): Guid {
    return new Guid("emptyguid");
  }

  public static parse(guid: string): Guid {
    return new Guid(guid);
  }

  public static raw(): string {
    return [
      Guid.gen(2),
      Guid.gen(1),
      Guid.gen(1),
      Guid.gen(1),
      Guid.gen(3),
    ].join("-");
  }

  private static gen(count: number): string {
    let out = "";
    for (let i = 0; i < count; i++) {
      // tslint:disable-next-line:no-bitwise
      out += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return out;
  }

  public equals(other: any): boolean {
    // Comparing string `value` against provided `guid` will auto-call
    // toString on `guid` for comparison
    return Guid.isGuid(other) && this.value === other.toString();
  }

  public isEmpty(): boolean {
    return this.value === Guid.EMPTY;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): any {
    return {
      value: this.value,
    };
  }
}
