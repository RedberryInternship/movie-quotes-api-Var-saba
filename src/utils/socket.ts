import { Server, Socket } from 'socket.io'

const EVENTS = {
  connection: 'connection',

  movies: {
    on: {
      DELETE_MOVIE_QUOTE: 'DELETE_MOVIE_QUOTE',
      DISLIKE_QUOTE: 'DISLIKE_QUOTE',
      UPDATE_MOVIE: 'UPDATE_MOVIE',
      DELETE_MOVIE: 'DELETE_MOVIE',
    },

    emit: {
      SEND_NEW_MOVIE_QUOTES: 'SEND_NEW_MOVIE_QUOTES',
      SEND_DELETED_MOVIE_ID: 'SEND_DELETED_MOVIE_ID',
      SEND_UPDATED_MOVIE: 'SEND_UPDATED_MOVIE',
      SEND_NEW_MOVIE: 'SEND_NEW_MOVIE',
    },
  },

  quotes: {
    on: {
      ADD_QUOTE_NEWS_FEED: 'ADD_QUOTE_NEWS_FEED',
      ADD_NOTIFICATION: 'ADD_NOTIFICATION',
      ADD_COMMENT: 'ADD_COMMENT',
      LIKE_QUOTE: 'LIKE_QUOTE',
      EDIT_QUOTE: 'EDIT_QUOTE',
      ADD_QUOTE: 'ADD_QUOTE',
      ADD_MOVIE: 'ADD_MOVIE',
    },
    emit: {
      SEND_NEW_QUOTE_NEWS_FEED: 'SEND_NEW_QUOTE_NEWS_FEED',
      SEND_NEW_NOTIFICATION: 'SEND_NEW_NOTIFICATION',
      SEND_DISLIKE_QUOTE: 'SEND_DISLIKE_QUOTE',
      SEND_EDITED_QUOTE: 'SEND_EDITED_QUOTE',
      SEND_NEW_COMMENT: 'SEND_NEW_COMMENT',
      SEND_NEW_QUOTE: 'SEND_NEW_QUOTE',
      SEND_NEW_LIKE: 'SEND_NEW_LIKE',
    },
  },

  user: {
    on: {
      CHANGE_PRIMARY_EMAIL: 'CHANGE_PRIMARY_EMAIL',
      ADD_SECONDARY_EMAIL: 'ADD_SECONDARY_EMAIL',
      UPLOAD_USER_IMAGE: 'UPLOAD_USER_IMAGE',
      CHANGE_USERNAME: 'CHANGE_USERNAME',
      DELETE_EMAIL: 'DELETE_EMAIL',
    },
    emit: {
      SEND_NEW_PRIMARY_EMAIL: 'SEND_NEW_PRIMARY_EMAIL',
      SEND_DELETED_EMAIL_IDS: 'SEND_DELETED_EMAIL_IDS',
      SEND_SECONDARY_EMAIL: 'SEND_SECONDARY_EMAIL',
      SEND_NEW_USERNAME: 'SEND_NEW_USERNAME',
      SEND_NEW_IMAGE: 'SEND_NEW_IMAGE',
    },
  },
}

const socket = ({ io }: { io: Server }) => {
  io.on(EVENTS.connection, (socket: Socket) => {
    socket.on(EVENTS.quotes.on.ADD_MOVIE, (newMovie) => {
      socket.emit(EVENTS.movies.emit.SEND_NEW_MOVIE, newMovie)
    })

    socket.on(EVENTS.movies.on.UPDATE_MOVIE, (updatedMovie) => {
      socket.emit(EVENTS.movies.emit.SEND_UPDATED_MOVIE, updatedMovie)
    })

    socket.on(
      EVENTS.user.on.CHANGE_PRIMARY_EMAIL,
      (primaryEmail, oldPrimary) => {
        socket.emit(
          EVENTS.user.emit.SEND_NEW_PRIMARY_EMAIL,
          primaryEmail,
          oldPrimary
        )
      }
    )

    socket.on(EVENTS.user.on.UPLOAD_USER_IMAGE, (data) => {
      socket.emit(EVENTS.user.emit.SEND_NEW_IMAGE, data.image)
    })

    socket.on(EVENTS.user.on.DELETE_EMAIL, (deletedEmail) => {
      socket.emit(EVENTS.user.emit.SEND_DELETED_EMAIL_IDS, deletedEmail)
    })

    socket.on(EVENTS.user.on.CHANGE_USERNAME, (username) => {
      socket.emit(EVENTS.user.emit.SEND_NEW_USERNAME, username)
    })

    socket.on(EVENTS.movies.on.DELETE_MOVIE, (deletedMovieId) => {
      io.sockets.emit(EVENTS.movies.emit.SEND_DELETED_MOVIE_ID, deletedMovieId)
    })

    socket.on(EVENTS.movies.on.DELETE_MOVIE_QUOTE, (deletedQuoteId) => {
      io.sockets.emit(EVENTS.movies.emit.SEND_NEW_MOVIE_QUOTES, deletedQuoteId)
    })

    socket.on(EVENTS.quotes.on.ADD_QUOTE, (quote) => {
      socket.emit(EVENTS.quotes.emit.SEND_NEW_QUOTE, quote)
    })

    socket.on(EVENTS.quotes.on.ADD_QUOTE_NEWS_FEED, (quote) => {
      io.sockets.emit(EVENTS.quotes.emit.SEND_NEW_QUOTE_NEWS_FEED, quote)
    })

    socket.on(EVENTS.quotes.on.EDIT_QUOTE, (editedQuote) => {
      io.sockets.emit(EVENTS.quotes.emit.SEND_EDITED_QUOTE, editedQuote)
    })

    socket.on(EVENTS.quotes.on.LIKE_QUOTE, (data, quoteId) => {
      io.sockets.emit(EVENTS.quotes.emit.SEND_NEW_LIKE, data.newLike, quoteId)
    })

    socket.on(EVENTS.quotes.on.ADD_COMMENT, (newComment, quoteId) => {
      io.sockets.emit(EVENTS.quotes.emit.SEND_NEW_COMMENT, newComment, quoteId)
    })

    socket.on(EVENTS.user.on.ADD_SECONDARY_EMAIL, (email) => {
      socket.emit(EVENTS.user.emit.SEND_SECONDARY_EMAIL, email)
    })

    socket.on(EVENTS.movies.on.DISLIKE_QUOTE, (data, quoteId) => {
      io.sockets.emit(
        EVENTS.quotes.emit.SEND_DISLIKE_QUOTE,
        data.userDislike,
        quoteId
      )
    })

    socket.on(
      EVENTS.quotes.on.ADD_NOTIFICATION,
      (newNotification, receiverId) => {
        io.sockets.emit(
          EVENTS.quotes.emit.SEND_NEW_NOTIFICATION,
          newNotification,
          receiverId
        )
      }
    )
  })
}

export default socket
