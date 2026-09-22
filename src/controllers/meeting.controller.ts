import type { NextFunction, Request, Response } from 'express'
import { WeekDateSchema } from '../scrapper/schema.js'
import { scrapingService } from '../scrapper/meeting.service.js'

export async function getByWeek(req: Request, res: Response, next: NextFunction) {
  const parsed = WeekDateSchema.safeParse(req.query)
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: 'invalid year and week' })
    return
  }
  try {
    const data = await scrapingService.getMeetingData(parsed.data)

    res.json({ ok: true, data })
  } catch (error) {
    next(error)
  }
}
