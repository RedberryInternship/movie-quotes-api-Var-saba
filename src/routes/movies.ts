import { getFilmGenres, addMovie, uploadMovieImg } from 'controllers'
import { validateRequestSchema } from 'middlewares'
import { movieSchema, idSchema } from 'schemas'
import { uploadMovieImage } from 'utils'
import express from 'express'

const router = express.Router()

router.get('/film-genres', getFilmGenres)

router.post('/add-movie', movieSchema, validateRequestSchema, addMovie)

router.patch(
  '/upload-movie-image',
  uploadMovieImage,
  idSchema,
  validateRequestSchema,
  uploadMovieImg
)

export default router
