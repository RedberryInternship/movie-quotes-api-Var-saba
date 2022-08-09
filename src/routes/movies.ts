import { getFilmGenres, addMovie, getAllMovies, deleteMovie } from 'controllers'
import { validateRequestSchema } from 'middlewares'
import { movieSchema, idSchema } from 'schemas'
import { uploadMovieImage } from 'utils'
import express from 'express'

const router = express.Router()

router.get('/film-genres', getFilmGenres)

router.get('/all-movies', getAllMovies)

router.delete('/delete-movie', idSchema, validateRequestSchema, deleteMovie)

router.post(
  '/add-movie',
  uploadMovieImage,
  movieSchema,
  validateRequestSchema,
  addMovie
)

export default router
