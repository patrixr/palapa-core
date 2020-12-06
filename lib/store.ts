import { newSession } from "./core";
import { PageCatalog, PaNode, PaSession, Maybe } from "./types";
import { get, set } from "./utils";

const STORE_KEY = '__palapa_store__';
export interface PalapaStore {
  session:        Maybe<PaSession>,
  pageCatalog:    PageCatalog,
  activeNode:     Maybe<PaNode>
}

export function palapaStore() : PalapaStore {
  const store = get<PalapaStore>(global, STORE_KEY, {
    session: null,
    pageCatalog: {},
    activeNode: null
  });

  set(global, STORE_KEY, store);
  
  return store as PalapaStore;
}
