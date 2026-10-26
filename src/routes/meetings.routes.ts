import { Router } from 'express'
import { getByWeek } from '../controllers/meeting.controller.js'
import {
  createNewPublisher,
  deletePublisherById,
  getAllPublishers,
  updatePublisherById,
} from '../publishers/publishers.controller.js'

export const meetingsRouter: Router = Router()
meetingsRouter.get('/', getByWeek)
meetingsRouter.get('/publishers', getAllPublishers)
// meetingsRouter.post('/publishers', setPublishers)
meetingsRouter.post('/publishers/new', createNewPublisher)
meetingsRouter.patch('/publishers/:id', updatePublisherById)
meetingsRouter.delete('/publishers/:id', deletePublisherById)
