import { BlockGen } from "../types";
import { registerPage } from "../core"

export function page(name: string, generator: BlockGen) {
  registerPage(name, generator);
}
