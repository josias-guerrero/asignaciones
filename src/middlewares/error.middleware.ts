import type { NextFunction, Request, Response } from 'express'
import { HttpError } from '../errors/http-error.js'
import { FetchError } from 'ofetch'

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ ok: false, error: 'Route not found' })
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error(err)
  if (err instanceof FetchError) {
    if (err.status == 404) res.status(404).json({ ok: false, error: 'Page not found in wol' })

    if (err.status) res.status(err.status).json({ ok: false, error: err.message })
  }
  if (err instanceof HttpError) {
    res.status(err.status).json({ ok: false, error: err.message })
    return
  }
  res.status(500).json({ ok: false, error: 'Internal server error' })
}
