import { Response, RequestBody, RequestQuery, QueryId } from 'types.d'
import { MovieModel, Movie, User } from 'models'
import { deleteFile } from 'utils'
import mongoose from 'mongoose'
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
      userId,
    } = req.body

    const imagePathDb = `images/movies/${req.file?.filename}`

    if (!req.file) {
      return res.status(422).json({ message: 'Upload movie image' })
    }

    const existingMovieEn = await Movie.findOne({ movie_name_en })
    const existingMovieGe = await Movie.findOne({ movie_name_ge })

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
      userId,
    })

    newMovie.image = imagePathDb

    await newMovie.save()

    return res.status(201).json({ message: 'Movie added successfully' })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export const getAllMovies = async (
  req: RequestQuery<{ userId: string }>,
  res: Response
) => {
  try {
    const { userId } = req.query

    const existingUser = await User.findById(userId)

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    const movies = await Movie.find({
      userId: new mongoose.Types.ObjectId(userId),
    })

    return res.status(200).json(movies)
  } catch (error: any) {
    return res.status(422).json({
      message: 'Provided userId is invalid',
    })
  }
}

export const deleteMovie = async (req: QueryId, res: Response) => {
  try {
    const id = { _id: new mongoose.Types.ObjectId(req.query.id) }

    const movie = await Movie.findOne(id)

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    if (movie.image) {
      deleteFile(`public/${movie.image}`)
    }

    await Movie.deleteOne(id)
    return res.status(200).json({ message: 'Movie deleted successfully' })
  } catch (error: any) {
    return res.status(422).json({ message: 'Enter valid id' })
  }
}
