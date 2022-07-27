import express from 'express'

const server = express()

server.listen(4444, () => {
  console.log('server listening on port http://localhost:4444')
})
