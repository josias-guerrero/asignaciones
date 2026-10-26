import fs from 'fs'
import { BadRequest, NotFound } from '../errors/http-error.js'
import path from 'path'
const FILE_PATH = path.resolve(process.cwd(), 'bd', 'publishers.json')

interface publisher {
  id: number
  name: string
}

export function getPublisherNames(): publisher[] {
  if (!fs.existsSync(FILE_PATH)) return []

  const data = fs.readFileSync(FILE_PATH, 'utf8')

  if (!data.trim()) return []

  return JSON.parse(data)
}

export function addNewPublisher(newName: string) {
  if (!newName.trim()) {
    throw BadRequest('Not name given to add new publisher')
  }
  const names = getPublisherNames()

  const maxId = names.reduce((max, item) => (item.id > max ? item.id : max), -1)
  const nextId = maxId + 1

  names.push({ id: nextId, name: newName })
  updateBd(names)
}

function updateBd(names: publisher[]) {
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true })
  fs.writeFileSync(FILE_PATH, JSON.stringify(names, null, 2), 'utf8')
}

export function setPublishers(names: string[]) {
  if (!Array.isArray(names) || names.length === 0) {
    throw BadRequest('cannot set an empty string of names or invalid array')
  }

  let publishers: publisher[] = []
  for (let i = 0; i < names.length; i++) {
    publishers.push({ id: i, name: names[i]! })
  }

  updateBd(publishers)
}

export function deletePublisher(id: number) {
  if (typeof !id === 'number' && Number.isNaN(id)) throw BadRequest(`Invalid Id provided: ${id}`)

  const publishers = getPublisherNames()
  const newPublishersList = publishers.filter((publisher) => publisher.id !== id)

  if (publishers.length === newPublishersList.length) {
    throw BadRequest(`publisher with id ${id} not found`)
  }

  updateBd(newPublishersList)
}

export function updatePublisher(id: number, newName: string) {
  const publishers = getPublisherNames()
  let found = false
  const newPublishersList = publishers.map((publisher) => {
    if (publisher.id === id) {
      found = true
      return { id: publisher.id, name: newName }
    }
    return publisher
  })

  if (!found) {
    throw NotFound(`publisher with id ${id} not found`)
  }

  updateBd(newPublishersList)
}
