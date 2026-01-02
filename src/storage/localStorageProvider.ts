import { TavernCore } from "../models/types";
import { StorageProvider } from "./storage";

const STORAGE_KEY = "tavern_core_v1";

export class LocalStorageProvider implements StorageProvider {
  async getCore(): Promise<TavernCore | null> {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as TavernCore;
  }

  async saveCore(core: TavernCore): Promise<void> {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(core));
  }

  async mergeCore(incoming: TavernCore): Promise<TavernCore> {
    const current = await this.getCore();
    if (!current) {
      await this.saveCore(incoming);
      return incoming;
    }
    const newer = new Date(incoming.meta.updatedAt) > new Date(current.meta.updatedAt) ? incoming : current;
    await this.saveCore(newer);
    return newer;
  }
}
