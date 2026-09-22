export class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
  }
}

export const NotFound = (msg: string) => new HttpError(404, msg)
