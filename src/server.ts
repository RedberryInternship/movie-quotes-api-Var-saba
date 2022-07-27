import { connectToMongo } from 'config'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

const server = express()
server.use(cors())

dotenv.config()
connectToMongo()

server.use(express.json())

server.listen(process.env.SERVER_PORT, () => {
  console.log(
    `server listening on port http://localhost:${process.env.SERVER_PORT}`
  )
})
