import { Response, RequestBody } from 'types.d'
import { MovieModel, Movie } from 'models'
import { deleteFile } from 'utils'
import fs from 'fs'

export const getFilmGenres = async (_, res: Response) => {
  try {
    const filmGenres = [
      'Adventure',
      'Musicals',
      'Romance',
      'Fantasy',
      'Romance',
      'Mystery',
      'Action',
      'Comedy',
      'Horror',
      'Sports',
      'Drama',
    ]

    return res.status(200).json(filmGenres)
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

export const addMovie = async (req: RequestBody<MovieModel>, res: Response) => {
  try {
    const {
      movie_description_ge,
      movie_description_en,
      movie_name_en,
      movie_name_ge,
      director_en,
      director_ge,
      film_genres,
      budget,
    } = req.body

    if (!req.file) {
      return res.status(422).json({ message: 'Upload movie image' })
    }

    const existingMovieEn = await Movie.findOne({ movie_name_en })
    const existingMovieGe = await Movie.findOne({ movie_name_ge })

    const imagePathDb = `images/movies/${req.file?.filename}`

    if (existingMovieEn || existingMovieGe) {
      if (fs.existsSync(`public/${imagePathDb}`)) {
        deleteFile(`public/${imagePathDb}`)
      }

      return res.status(409).json({ message: 'Movie is already added' })
    }

    const newMovie = await Movie.create({
      movie_description_ge,
      movie_description_en,
      movie_name_en,
      movie_name_ge,
      director_en,
      director_ge,
      film_genres,
      budget,
    })

    newMovie.image = imagePathDb

    await newMovie.save()

    return res.status(201).json({ message: 'Movie added successfully' })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}
