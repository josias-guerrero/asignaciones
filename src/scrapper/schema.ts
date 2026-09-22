import z from 'zod'

export const WeekDateSchema = z.object({
  year: z.coerce.number().int().min(200),
  week: z.coerce.number().int().min(1).max(53),
})
