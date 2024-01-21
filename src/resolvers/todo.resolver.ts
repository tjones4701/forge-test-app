import { storage } from "@forge/api";
import Resolver from "@forge/resolver";
import { ChecklistItem } from "src/backend/checklist-store";
import { ServerStore } from "src/backend/server-store";

const resolver = new Resolver();

const getUniqueId = () => "_" + Math.random().toString(36).substr(2, 9);

const getListKeyFromContext = (context) => {
  console.log(context);
  const { localId: id } = context;
  return id.split("/")[id.split("/").length - 1];
};

const getAll = async (listId) => {
  return (await storage.get(listId)) || [];
};

resolver.define("get-all", ({ context }) => {
  return getAll(getListKeyFromContext(context));
});

resolver.define("create", async ({ payload, context }) => {
  const listId = getListKeyFromContext(context);
  const records = await getAll(listId);
  const id = getUniqueId();

  const newRecord = {
    id,
    ...payload,
  };

  await storage.set(getListKeyFromContext(context), [...records, newRecord]);

  return newRecord;
});

resolver.define("update", async ({ payload, context }) => {
  const listId = getListKeyFromContext(context);
  let records = await getAll(listId);

  records = records.map((item) => {
    if (item.id === payload.id) {
      return payload;
    }
    return item;
  });

  await storage.set(getListKeyFromContext(context), records);

  return payload;
});

resolver.define("delete", async ({ payload, context }) => {
  const listId = getListKeyFromContext(context);
  let records = await getAll(listId);

  records = records.filter((item) => item.id !== payload.id);

  await storage.set(getListKeyFromContext(context), records);

  return payload;
});

resolver.define("delete-all", ({ context }) => {
  return storage.set(getListKeyFromContext(context), []);
});

const stores = {
  [ChecklistItem.name]: ChecklistItem,
};

function createStore(name: string, context) {
  const ClassRef = stores[name];
  if (ClassRef != null) {
    return new ServerStore(ClassRef, context);
  }
}

resolver.define("server-store", async ({ payload, context }) => {
  const { store, action, params } = payload;
  const serverStore = createStore(store, context);
  const method = serverStore[action];
  if (method == null) {
    throw new Error("Method not found");
  }
  return serverStore[action](...params);
});

export const handler = resolver.getDefinitions();
