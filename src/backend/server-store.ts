import { invoke } from "@forge/bridge";
import { Store, StoreItem } from "src/shared/store";

import { storage } from "@forge/api";

type Context = {
  localId: string;
};

export class ServerStore<T extends StoreItem> extends Store<T, new () => T> {
  context: Context;
  constructor(classRef, context: any) {
    super(classRef);
    this.context = context;
  }
  async get(key: string) {
    const data = await storage.get(key);
    if (data == null) {
      return null;
    }
    return this.createInstance(data);
  }

  async set(key: string, saveData: T | undefined) {
    if (key == undefined) {
      await storage.delete(key);
      return undefined;
    }
    await storage.set(key, saveData);
    return saveData;
  }
}
