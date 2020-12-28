import { Dictionnary }  from "./types";

type LogMethod = "info"|"error"|"debug"

const emoji = (type: string) : string => {
  const mapping : Dictionnary<string> = {
    "info": "🏝",
    "error": "😨",
    "debug": "👾",
    "panic": "💥"
  }
  return (mapping[type] as string) || ""; 
}

const format = (name : string, msg : string, type: string) : string => {
  return `${emoji(type)}  [${name}] ${new Date().toLocaleTimeString()}: ${msg}`
}

const print = (method: LogMethod, msg: string) => {
  if (!process.env.SILENT) {
    console[method](msg);
  }
}

/**
 *
 *
 * @export
 * @param {string} [name='palapa']
 * @returns
 */
export function Logger(name = 'palapa') {
  return {
    info: (msg: string) => print('info', format(name, msg, 'info')),
    debug: (msg: string) => print('debug', format(name, msg, 'debug')),
    error: (msg: string) => print('error', format(name, msg, 'error'))
  }
}


export default Logger;
