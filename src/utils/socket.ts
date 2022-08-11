import { Server, Socket } from 'socket.io'

const EVENTS = {
  connection: 'connection',

  movies: {
    on: {
      ADD_MOVIE: 'ADD_MOVIE',
    },

    emit: {
      SEND_NEW_MOVIE: 'SEND_NEW_MOVIE',
    },
  },
}

const socket = ({ io }: { io: Server }) => {
  io.on(EVENTS.connection, (socket: Socket) => {
    console.log(`user connected ${socket.id}`)

    socket.on(EVENTS.movies.on.ADD_MOVIE, (newMovieData) => {
      socket.emit(EVENTS.movies.emit.SEND_NEW_MOVIE, newMovieData)
    })
  })
}

export default socket
