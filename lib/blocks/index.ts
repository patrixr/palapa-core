import { newNode, renderNode } from "../core";
import { BlockGen, PaNode } from "../types";
import { toGenerator } from "../utils";

// ----------------------
// Types
// ----------------------

export interface BlockProperties {}

export type BlockGenOrValue<T = void> = T extends void ? BlockGen<any> : (T|BlockGen<T>)

export type BlockArgs<In extends BlockProperties = BlockProperties, Out = any> = ([In, BlockGenOrValue<Out>]|[BlockGenOrValue<Out>])

// ----------------------
// Helpers
// ----------------------

interface BlockCreateOptions {
  lazy?:  boolean
}

export function createBlock<In, Out = void>(type: string, opts: BlockCreateOptions = {}) {
  const { lazy = false } = opts;

  return async (name : string, ...args: BlockArgs<In, Out>) : Promise<PaNode<In, Out>> => {
    const [props, generator] = parseBlockArgs(args);
    
    const node = newNode<In>(name, type, generator, { props })
    
    if (!lazy) {
      await renderNode(node);
    }

    return node;
  }
}

export function parseBlockArgs<In, Out = any>(args: BlockArgs<In, Out>) : [Partial<In>, BlockGen<Out>] {
  const generator = toGenerator(args.length === 1 ? args[0] : args[1]);
  const props     = args.length === 1 ? {} : args[0];

  return [props, generator];
}
