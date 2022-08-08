import { swaggerMiddleware, authMiddleware } from 'middlewares'
import { userRouter, authRouter, moviesRouter } from 'routes'
import express, { RequestHandler } from 'express'
import SwaggerUI from 'swagger-ui-express'
import { connectToMongo } from 'config'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import cors from 'cors'

const server = express()
server.use(cors())

dotenv.config()
connectToMongo()

server.use(bodyParser.json())
server.use('/api-docs', SwaggerUI.serve, swaggerMiddleware())

server.use(express.static('public'))

server.use(authMiddleware as RequestHandler)

server.use(authRouter)
server.use(userRouter)

server.use(moviesRouter)

server.listen(process.env.SERVER_PORT, () => {
  console.log(
    `server listening on port http://localhost:${process.env.SERVER_PORT}`
  )
})
