import { BlockGen, Maybe } from "./types";

/**
 *
 *
 * @export
 * @param {*} err
 */
export function panic(err : any) : never {
  throw new Error(err);
}

/**
 *
 *
 * @export
 */
export function noop() : void {}

/**
 *
 *
 * @export
 */
export function identity<T>(id: T) : T {
  return id;
}

/**
 *
 *
 * @export
 * @param {...any[]} args
 * @returns
 */
export function pipe(...args: any[]) {
  return {
    to: (funcs: Function[]) => funcs.forEach(f => f(...args))
  }
}

/**
 *
 *
 * @export
 * @param {unknown} f
 * @returns {f is BlockGen}
 */
export function isGenerator(f : unknown) : f is BlockGen {
  return typeof(f) == 'function';
}

/**
 *
 *
 * @export
 * @template T
 * @param {*} val
 * @returns {BlockGen<T>}
 */
export function toGenerator<T = any>(val : any) : BlockGen<T> {
  return isGenerator(val) ? val : () => val;
}

/**
 *
 *
 * @export
 * @param {*} obj
 * @returns {(obj is null|undefined|"")}
 */
export function falsy(obj: any) : obj is null|undefined|"" {
  return obj === null || obj === void 0 || (typeof obj === 'string' && obj.length === 0);
}

/**
 *
 *
 * @export
 * @param {*} obj
 * @returns {boolean}
 */
export function isPrimitive(obj: any) : boolean {
  return falsy(obj) || typeof(obj) === 'string' || typeof(obj) === 'number' || typeof(obj) === 'boolean'
}

type _FuncArgs = Array<any>
type _Func<T extends _FuncArgs, R> = (...args: T) => R

/**
 *
 *
 * @export
 * @template T
 * @template R
 * @param {_Func<T, R>} func
 * @returns
 */
export function cached<T extends _FuncArgs, R>(func : _Func<T, R>) {
  let result : any = null;
  let called = false;
  return ((...args: T) => {
    if (!called) {
      result = func(...args);
      called = true;
    }
    return result;
  }) as _Func<T, R> 
}

/**
 *
 *
 * @export
 * @template T
 * @param {*} obj
 * @param {string} key
 * @param {Maybe<T>} [defaultValue=null]
 * @returns {Maybe<T>}
 */
export function get<T = any>(obj: any, key: string|string[], defaultValue: Maybe<T> = null) : Maybe<T> {
  if (falsy(obj)) return defaultValue;

  const path  = Array.isArray(key) ? key : key.split('.');

  let ref = obj;

  while (path.length > 0) {
    const key = path.shift() as string;

    if (isPrimitive(ref)) {
      return defaultValue;
    }
    ref = ref[key];
  }
  return ref === void 0 ? defaultValue : ref as T;
}

/**
 *
 *
 * @export
 * @param {*} obj
 * @param {string} key
 * @param {*} value
 */
export function set(obj: any, key: string|string[], value: any) {
  const path    = Array.isArray(key) ? key : key.split('.');
  const [final] = path.splice(-1);

  const ref = get(obj, path);

  if (isPrimitive(ref)) {
    return null;
  }

  ref[final] = value;
}
