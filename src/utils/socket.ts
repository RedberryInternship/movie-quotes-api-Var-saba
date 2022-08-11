import { Server, Socket } from 'socket.io'

const EVENTS = {
  connection: 'connection',

  movies: {
    on: {
      ADD_MOVIE: 'ADD_MOVIE',
      UPDATE_MOVIE: 'UPDATE_MOVIE',
    },

    emit: {
      SEND_NEW_MOVIE: 'SEND_NEW_MOVIE',
      SEND_UPDATED_MOVIE: 'SEND_UPDATED_MOVIE',
    },
  },
}

const socket = ({ io }: { io: Server }) => {
  io.on(EVENTS.connection, (socket: Socket) => {
    socket.on(EVENTS.movies.on.ADD_MOVIE, (newMovie) => {
      socket.emit(EVENTS.movies.emit.SEND_NEW_MOVIE, newMovie)
    })

    socket.on(EVENTS.movies.on.UPDATE_MOVIE, (updatedMovie) => {
      socket.emit(EVENTS.movies.emit.SEND_UPDATED_MOVIE, updatedMovie)
    })
  })
}

export default socket
