import { newNode, renderNode }  from "../core";
import { BlockGen, PaNode }     from "../types";
import { toGenerator }          from "../utils";

// ----------------------
// Types
// ----------------------

export interface BlockProps {}

export type BlockGenOrValue<OutVal = void> = OutVal extends void ? BlockGen<any> : (OutVal|BlockGen<OutVal>)

export type BlockArgs<
  Props extends BlockProps = BlockProps,
  OutVal = any
> = (
  [Props, BlockGenOrValue<OutVal>]|[BlockGenOrValue<OutVal>]
)

export type Block<Props = {}> = (name : string, ...args: BlockArgs<Props, any>) => any

// ----------------------
// Helpers
// ----------------------

interface BlockCreateOptions {
  lazy?:  boolean
}


/**
 * Creates a Block function
 *
 * @export
 * @template In
 * @template Out
 * @param {string} type
 * @param {BlockCreateOptions} [opts={}]
 * @returns {Block<In>}
 */
export function factory<In = {}, Out = void>(type: string, opts: BlockCreateOptions = {}) : Block<In> {
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
