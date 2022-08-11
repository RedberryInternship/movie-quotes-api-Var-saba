import { Server, Socket } from 'socket.io'

const EVENTS = {
  connection: 'connection',

  MOVIES: {
    ADD_MOVIE: 'ADD_MOVIE',
    UPDATE_MOVIE: 'UPDATE_MOVIE',
  },
}

const socket = ({ io }: { io: Server }) => {
  io.on(EVENTS.connection, (socket: Socket) => {
    console.log(`user connected ${socket.id}`)
  })
}

export default socket
