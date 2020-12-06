import { inspect } from 'util'

export function dump(obj: Object) {
  console.log(inspect(obj, false, null, true))
}
