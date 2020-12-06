import { inspect }      from 'util'
import { expect }       from 'chai'
import { PalapaError }  from '../../lib/error'

export function dump(obj: Object) {
  console.log(inspect(obj, false, null, true))
}

export async function expectThrow(fn : Function) : Promise<PalapaError> {
  let error = null
  try {
    await fn()
  }
  catch (err) {
    error = err
  }
  expect(error).to.exist
  expect(error instanceof PalapaError).to.be.true;
  return error as PalapaError;
}
