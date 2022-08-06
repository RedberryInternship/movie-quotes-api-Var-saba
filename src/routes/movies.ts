import { getFilmGenres } from 'controllers'
import express from 'express'

const router = express.Router()

router.get('/film-genres', getFilmGenres)

export default router
