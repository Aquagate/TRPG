import { get, set } from "idb-keyval";
import { TavernCore } from "../data/models";
import { StorageProvider } from "./storage";

const CORE_KEY = "tavern_core";

export class IndexedDbStorage implements StorageProvider {
  async getCore(): Promise<TavernCore | null> {
    return (await get(CORE_KEY)) ?? null;
  }

  async saveCore(core: TavernCore): Promise<void> {
    await set(CORE_KEY, core);
  }

  async mergeCore(local: TavernCore, remote: TavernCore): Promise<TavernCore> {
    if (remote.meta.updatedAt > local.meta.updatedAt) {
      return remote;
    }
    return local;
  }
}
