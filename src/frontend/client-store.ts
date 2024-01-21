import { invoke } from "@forge/bridge";
import { Store, StoreItem } from "src/shared/store";

export class ClientStore<T extends StoreItem> extends Store<T, new () => T> {
  async invoke(action: string, ...params: any[]): Promise<any> {
    return await invoke("server-store", {
      store: this.ClassRef.name,
      action: action,
      params: params ?? [],
    });
  }

  create() {
    return this.invoke("create");
  }

  update(data: T) {
    return this.invoke("update", data);
  }

  delete(key: string) {
    return this.invoke("delete", key);
  }
}
