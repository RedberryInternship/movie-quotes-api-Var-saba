import { Response, RequestBody, ImageReqBody } from 'types.d'
import { MovieModel, Movie } from 'models'

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

    const existingMovieEn = await Movie.findOne({ movie_name_en })
    const existingMovieGe = await Movie.findOne({ movie_name_ge })

    if (existingMovieEn || existingMovieGe) {
      return res.status(409).json({ message: 'Movie is already added' })
    }

    await Movie.create({
      movie_description_ge,
      movie_description_en,
      movie_name_en,
      movie_name_ge,
      director_en,
      director_ge,
      film_genres,
      budget,
    })

    return res.status(201).json({ message: 'Movie added successfully' })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export const uploadMovieImage = async (
  req: RequestBody<ImageReqBody>,
  res: Response
) => {
  try {
    const currentMovie = await Movie.findById(req.body.id)
    if (!currentMovie) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    if (req.body.fileValidationError) {
      return res.status(422).json({ message: 'Upload only image' })
    }

    if (req.file) {
      currentMovie.image = req.file.path.substring(7)

      await currentMovie.save()
      return res.status(201).json({
        message: 'Movie image uploaded successfully',
      })
    } else return res.status(422).json({ message: 'Upload movie image' })
  } catch (error) {
    return res.status(422).json({ message: 'Movie Id is not valid' })
  }
}
