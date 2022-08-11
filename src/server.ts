import { swaggerMiddleware, authMiddleware } from 'middlewares'
import { userRouter, authRouter, moviesRouter } from 'routes'
import express, { RequestHandler } from 'express'
import SwaggerUI from 'swagger-ui-express'
import { connectToMongo } from 'config'
import bodyParser from 'body-parser'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { socket } from 'utils'
import dotenv from 'dotenv'
import cors from 'cors'

const server = express()
server.use(cors())

const httpServer = createServer(server)

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
})

dotenv.config()
connectToMongo()

server.use(bodyParser.json())
server.use('/api-docs', SwaggerUI.serve, swaggerMiddleware())

server.use(express.static('public'))

server.use(authMiddleware as RequestHandler)

server.use(authRouter)
server.use(userRouter)

server.use(moviesRouter)

httpServer.listen(process.env.SERVER_PORT, () => {
  console.log(
    `server listening on port http://localhost:${process.env.SERVER_PORT}`
  )
  socket({ io })
})
