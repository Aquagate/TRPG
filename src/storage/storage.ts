import { TavernCore } from "../data/models";

export interface StorageProvider {
  getCore(): Promise<TavernCore | null>;
  saveCore(core: TavernCore): Promise<void>;
  mergeCore(local: TavernCore, remote: TavernCore): Promise<TavernCore>;
}
