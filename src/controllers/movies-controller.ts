import { Response, RequestBody, RequestQuery, QueryId } from 'types.d'
import { MovieModel, Movie, User } from 'models'
import { ChangeMovieReq } from './types.d'
import { deleteFile } from 'utils'
import mongoose from 'mongoose'
import fs from 'fs'

export const getMovieGenres = async (_, res: Response) => {
  const movieGenres = [
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

  return res.status(200).json(movieGenres)
}

export const addMovie = async (req: RequestBody<MovieModel>, res: Response) => {
  try {
    const {
      movieDescriptionGe,
      movieDescriptionEn,
      movieNameEn,
      movieNameGe,
      directorEn,
      directorGe,
      movieGenres,
      budget,
      userId,
    } = req.body

    if (!req.file) {
      return res.status(422).json({ message: 'Upload movie image' })
    }

    const imagePathDb = `images/movies/${req.file?.filename}`

    const existingMovieEn = await Movie.findOne({ movieNameEn })
    const existingMovieGe = await Movie.findOne({ movieNameGe })

    if (existingMovieEn || existingMovieGe) {
      if (fs.existsSync(`public/${imagePathDb}`)) {
        deleteFile(`public/${imagePathDb}`)
      }
      return res.status(409).json({ message: 'Movie is already added' })
    }

    const newMovie = await Movie.create({
      movieDescriptionGe,
      movieDescriptionEn,
      movieNameEn,
      movieNameGe,
      directorEn,
      directorGe,
      movieGenres,
      budget,
      userId,
    })

    newMovie.image = imagePathDb

    await newMovie.save()

    return res.status(201).json(newMovie)
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

    const movies = (
      await Movie.find({
        userId: new mongoose.Types.ObjectId(userId),
      }).populate({
        path: 'quotes',
        select: '-movieId',
      })
    ).reverse()

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

export const changeMovie = async (
  req: RequestBody<ChangeMovieReq>,
  res: Response
) => {
  try {
    const {
      movieDescriptionEn,
      movieDescriptionGe,
      movieGenres,
      movieNameEn,
      movieNameGe,
      directorEn,
      directorGe,
      budget,
      id,
    } = req.body

    const existingMovie = await Movie.findById(id)

    if (!existingMovie) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    if (req.file) {
      if (fs.existsSync(`public/${existingMovie.image}`)) {
        deleteFile(`public/${existingMovie.image}`)
      }
      existingMovie.image = `images/movies/${req.file?.filename}`
    }
    existingMovie.movieDescriptionEn = movieDescriptionEn
    existingMovie.movieDescriptionGe = movieDescriptionGe
    existingMovie.movieGenres = movieGenres
    existingMovie.movieNameEn = movieNameEn
    existingMovie.movieNameGe = movieNameGe
    existingMovie.directorEn = directorEn
    existingMovie.directorGe = directorGe
    existingMovie.budget = budget
    await existingMovie.save()

    return res.status(200).json(existingMovie)
  } catch (error: any) {
    return res
      .status(409)
      .json({ message: 'Movie with this name is already added' })
  }
}
