import { getFilmGenres, addMovie } from 'controllers'
import { validateRequestSchema } from 'middlewares'
import { movieSchema } from 'schemas'
import express from 'express'

const router = express.Router()

router.get('/film-genres', getFilmGenres)

router.post('/add-movie', movieSchema, validateRequestSchema, addMovie)

export default router
