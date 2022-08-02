import { swaggerMiddleware, authMiddleware } from 'middlewares'
import express, { RequestHandler } from 'express'
import SwaggerUI from 'swagger-ui-express'
import { connectToMongo } from 'config'
import { userRouter } from 'routes'
import dotenv from 'dotenv'
import cors from 'cors'

const server = express()
server.use(cors())

dotenv.config()
connectToMongo()

server.use(express.json())
server.use('/api-docs', SwaggerUI.serve, swaggerMiddleware())

server.use(express.static('public'))

server.use(authMiddleware as RequestHandler)

server.use(userRouter)

server.listen(process.env.SERVER_PORT, () => {
  console.log(
    `server listening on port http://localhost:${process.env.SERVER_PORT}`
  )
})
