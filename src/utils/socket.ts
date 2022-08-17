import { Server, Socket } from 'socket.io'

const EVENTS = {
  connection: 'connection',

  movies: {
    on: {
      DELETE_MOVIE_QUOTE: 'DELETE_MOVIE_QUOTE',
      DISLIKE_QUOTE: 'DISLIKE_QUOTE',
      UPDATE_MOVIE: 'UPDATE_MOVIE',
      LIKE_QUOTE: 'LIKE_QUOTE',
      EDIT_QUOTE: 'EDIT_QUOTE',
      ADD_QUOTE: 'ADD_QUOTE',
      ADD_MOVIE: 'ADD_MOVIE',
    },

    emit: {
      SEND_NEW_MOVIE_QUOTES: 'SEND_NEW_MOVIE_QUOTES',
      SEND_UPDATED_MOVIE: 'SEND_UPDATED_MOVIE',
      SEND_DISLIKE_QUOTE: 'SEND_DISLIKE_QUOTE',
      SEND_EDITED_QUOTE: 'SEND_EDITED_QUOTE',
      SEND_NEW_QUOTE: 'SEND_NEW_QUOTE',
      SEND_NEW_MOVIE: 'SEND_NEW_MOVIE',
      SEND_NEW_LIKE: 'SEND_NEW_LIKE',
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

    socket.on(EVENTS.movies.on.ADD_QUOTE, (quote) => {
      socket.emit(EVENTS.movies.emit.SEND_NEW_QUOTE, quote)
    })

    socket.on(EVENTS.movies.on.EDIT_QUOTE, (editedQuote) => {
      socket.emit(EVENTS.movies.emit.SEND_EDITED_QUOTE, editedQuote)
    })

    socket.on(EVENTS.movies.on.LIKE_QUOTE, (data, quoteId) => {
      io.sockets.emit(EVENTS.movies.emit.SEND_NEW_LIKE, data.newLike, quoteId)
    })

    socket.on(EVENTS.movies.on.DISLIKE_QUOTE, (data, quoteId) => {
      io.sockets.emit(
        EVENTS.movies.emit.SEND_DISLIKE_QUOTE,
        data.userDislike,
        quoteId
      )
    })
  })
}

export default socket
