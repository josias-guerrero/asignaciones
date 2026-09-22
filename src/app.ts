import express, { type Application } from 'express'
import { meetingsRouter } from './routes/meetings.routes.js'
import { errorHandler, notFound } from './middlewares/error.middleware.js'

const app: Application = express()
app.use(express.json())

app.use('/api/meetings', meetingsRouter)

app.use(notFound)
app.use(errorHandler)

export default app
