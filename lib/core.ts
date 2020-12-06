import { palapaStore }        from "./store";
import { noop, panic, pipe }  from "./utils";
import Logger                 from './logger'
import {
  Partial,
  PaNode,
  PageCatalog,
  PaSession,
  RenderOptions,
  BlockGen
} from "./types";

const store   = palapaStore();
const logger  = Logger('palapa:core');

type SessionInvoker<T>    = (s: PaSession) => T
type OptionalArgLeft<T,P> = [T|null|undefined,P]|[P]

/**
 * Will throw if there is no active session
 *
 * @export
 * @param {PaNode} [caller]
 */
export function invokeSession<T>(...args: OptionalArgLeft<PaNode, SessionInvoker<T>>) : T {
  const invoker   = args.length === 1 ? args[0] : args[1];
  const type      = args.length === 1 ? 'block' : args[0]?.type;

  if (!store.session) {
    panic(`${type || 'block'} called outside of render session`);
  }

  return invoker(store.session)
}

/**
 * Creates a new node
 *
 * @export
 * @param {string} name
 * @param {string} type
 * @param {BlockGen} gen
 * @param {Partial<PaNode>} [params]
 * @returns {PaNode}
 */
export function newNode<P = {}>(name: string, type: string, gen: BlockGen, opts?: Partial<PaNode<P>>) : PaNode<P> {
  return {
    name:       name,
    generator:  gen,
    type:       type,
    context:    opts?.context || {},
    nodes:      [],
    props:      {}
  }
}

/**
 *
 *
 * @export
 * @returns {PageCatalog}
 */
export function getCatalog() : PageCatalog {
  return store.pageCatalog;
}

/**
 *
 *
 * @export
 * @param {PaNode} page
 */
export function registerPage(name: string, generator: BlockGen) {
  getCatalog()[name] = () => newNode(name, 'page', generator);
}

/**
 *
 *
 * @export
 */
export function resetCatalog() {
  store.pageCatalog = {};
}

/**
 *
 *
 * @export
 * @returns {PaNode[]}
 */
export function getAllPages() : PaNode[] {
  return Object.values(getCatalog()).map(b => b());
}

/**
 *
 *
 * @export
 * @param {string} page
 * @returns {PaNode}
 */
export function getPage(page : string) : PaNode {
  const catalog = getCatalog();

  if (!catalog) {
    pipe(`Page ${page} does not exist`).to([logger.error, panic]);
  }

  return getCatalog()[page]();
}

/**
 * Creates a new palapa session
 *
 * @export
 * @returns {PaSession}
 */
export function newSession() : PaSession {
  return {
    root: newNode('palapa', 'app', noop)
  }
}

/**
 *
 *
 * @export
 * @param {PaNode} [caller]
 * @returns {PaNode}
 */
export function getActiveNode(caller?: PaNode) : PaNode {
  return invokeSession(caller, (session) => {
    return store.activeNode || session.root;
  });
}

/**
 *
 *
 * @export
 * @param {PaNode} node
 */
export function setActiveNode(node: PaNode) {
  invokeSession(node, () => {
    store.activeNode = node;
  });
}

/**
 *
 *
 * @param {PaNode} node
 */
export async function renderNode(node: PaNode) {
  const parent = getActiveNode(node);

  parent.nodes.push(node);
  setActiveNode(node);
  node.data = await node.generator();
  setActiveNode(parent);
}

/**
 *
 *
 * @export
 * @param {RenderOptions} [opts={}]
 */
export async function render(opts : RenderOptions = {}) : Promise<PaSession> {
  const session = newSession();

  store.session = session;

  const pages = opts.page ? [getPage(opts.page)] : getAllPages();

  setActiveNode(store.session.root);

  for (const page of pages) {
    logger.info(`Rendering page ${page.name}`);
    await renderNode(page);
  }

  store.session = null;

  return session;
}
