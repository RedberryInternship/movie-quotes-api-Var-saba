import { Server, Socket } from 'socket.io'

const EVENTS = {
  connection: 'connection',

  movies: {
    on: {
      ADD_MOVIE: 'ADD_MOVIE',
      UPDATE_MOVIE: 'UPDATE_MOVIE',
      DELETE_MOVIE_QUOTE: 'DELETE_MOVIE_QUOTE',
    },

    emit: {
      SEND_NEW_MOVIE: 'SEND_NEW_MOVIE',
      SEND_UPDATED_MOVIE: 'SEND_UPDATED_MOVIE',
      SEND_NEW_MOVIE_QUOTES: 'SEND_NEW_MOVIE_QUOTES',
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

    socket.on(EVENTS.movies.on.DELETE_MOVIE_QUOTE, (deletedQuoteId) => {
      socket.emit(EVENTS.movies.emit.SEND_NEW_MOVIE_QUOTES, deletedQuoteId)
    })
  })
}

export default socket
