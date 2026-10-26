import type { Request, Response } from 'express'
import {
  addNewPublisher,
  deletePublisher,
  getPublisherNames,
  updatePublisher,
} from './publishers.service.js'
import { BadRequest } from '../errors/http-error.js'

export function getAllPublishers(_req: Request, res: Response) {
  const data = getPublisherNames()
  res.json({ ok: true, data })
}

export function createNewPublisher(req: Request, res: Response) {
  const { name } = req.body

  if (typeof name !== 'string') {
    throw BadRequest('The name must be provided')
  }

  addNewPublisher(name)
  res.status(201).send()
}

export function deletePublisherById(req: Request, res: Response) {
  const { id } = req.params

  if (!id) {
    throw BadRequest('The id must be provided')
  }

  deletePublisher(Number(id))
  res.status(204).send()
}

export function updatePublisherById(req: Request, res: Response) {
  const { id } = req.params
  const { name } = req.body

  if (typeof name !== 'string') {
    throw BadRequest('The new name must be provided')
  }
  if (!id) {
    throw BadRequest('The id must be provided')
  }

  updatePublisher(Number(id), name)

  res.status(200).send()
}
