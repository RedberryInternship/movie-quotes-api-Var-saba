import { getFilmGenres, addMovie } from 'controllers'
import { validateRequestSchema } from 'middlewares'
import { uploadMovieImage } from 'utils'
import { movieSchema } from 'schemas'
import express from 'express'

const router = express.Router()

router.get('/film-genres', getFilmGenres)

router.post(
  '/add-movie',
  uploadMovieImage,
  movieSchema,
  validateRequestSchema,
  addMovie
)

export default router
