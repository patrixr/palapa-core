

export class PalapaError extends Error {
  constructor(msg: any, public status: number, public type: string) {
    super(msg);
  }
}

// -----> PRESETS <-----

const factory = (status: number, type: string) => {
  return (msg : string) : never => { throw new PalapaError(msg, status, type) }
}

export const throw404 = factory(404, 'NOT_FOUND');
export const throw500 = factory(500, 'INTERNAL_ERROR');
