import { Router } from 'express'
import { getByWeek } from '../controllers/meeting.controller.js'

export const meetingsRouter: Router = Router()
meetingsRouter.get('/', getByWeek)
