import { Guid } from "src/common/guid";

export class Store<
  T extends StoreItem = StoreItem,
  U extends new () => T = new () => T
> {
  ClassRef: U;

  constructor(classRef: U) {
    this.ClassRef = classRef;
  }

  invoke(action: string) {}
  /**
   *
   * @param key Needs to be overriden by the subclass
   */
  async get(key: string): Promise<T> {
    throw new Error("Method not implemented.");
  }

  /**
   *
   * @param key Needs to be overriden by the subclass
   */
  async set(key: string, value: T): Promise<T | undefined> {
    throw new Error("Method not implemented.");
  }

  create(): Promise<T> {
    const instance = this.createInstance();
    const saveData = { ...instance };
    delete saveData.store;

    return this.set(instance.id, instance);
  }

  async update(data: T): Promise<T> {
    const existing = await this.get(data.id);

    if (existing == null) {
      throw new Error("Item does not exist");
    }
    for (var i in data) {
      existing[i] = data[i];
    }
    return await this.set(existing.id, existing);
  }

  delete(key: string): Promise<T | undefined> {
    return this.set(key, undefined);
  }

  createInstance(data?: any) {
    const instance = new this.ClassRef();
    instance.id = Guid.create().toString();
    instance.store = this;
    if (data != null) {
      for (var i in data) {
        instance[i] = data[i];
      }
      return instance;
    }
  }
}

export class StoreItem {
  store: Store;
  id: string;
}
