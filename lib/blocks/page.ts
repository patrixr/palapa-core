import { BlockGen } from "../types";
import { registerPage, newNode } from "../core"

export function page(name: string, generator: BlockGen) {
  registerPage(name, generator);
}
