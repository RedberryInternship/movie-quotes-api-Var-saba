import { movieSchema, idSchema, userIdSchema } from 'schemas'
import { validateRequestSchema } from 'middlewares'
import { uploadMovieImage } from 'utils'
import express from 'express'
import {
  getFilmGenres,
  getAllMovies,
  deleteMovie,
  changeMovie,
  addMovie,
} from 'controllers'

const router = express.Router()

router.delete('/delete-movie', idSchema, validateRequestSchema, deleteMovie)

router.get('/film-genres', getFilmGenres)

router.get('/all-movies', getAllMovies)

router.post(
  '/add-movie',
  uploadMovieImage,
  userIdSchema,
  movieSchema,
  validateRequestSchema,
  addMovie
)

router.put(
  '/change-movie',
  uploadMovieImage,
  idSchema,
  movieSchema,
  validateRequestSchema,
  changeMovie
)

export default router
