export interface Dictionnary<T = any> {
  [key: string]: T
}

export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export interface PaContext {
  title:    string
}

type Builder<T> = (...args: any[]) => T

export type PaContextStack = PaContext[]

export type BlockGen<T = any> = (...args: any[]) => T

export type PageCatalog = { [key: string]: Builder<PaNode> }

export type Maybe<T> = T|null

export interface PaNode<Props = {}, DataType = any> {
  name:       string
  type:       string
  generator:  BlockGen
  nodes:      PaNode[]
  context:    Partial<PaContext>
  props:      Partial<Props>
  data?:      DataType
}

export interface PaSession {
  root: PaNode
}

export interface RenderOptions {
  page?:  string
}
