import { check } from 'express-validator'

const movieSchema = [
  check('movie_description_en')
    .exists()
    .notEmpty()
    .withMessage('Movie description in English is required'),

  check('movie_description_ge')
    .exists()
    .notEmpty()
    .withMessage('Movie description in Georgian is required'),

  check('movie_name_ge')
    .exists()
    .notEmpty()
    .withMessage('Movie name in Georgian is required'),

  check('movie_name_en')
    .exists()
    .notEmpty()
    .withMessage('Movie name in English is required'),

  check('director_en')
    .exists()
    .notEmpty()
    .withMessage('Director name in English is required'),

  check('director_ge')
    .exists()
    .notEmpty()
    .withMessage('Director name in Georgian is required'),

  check('budget')
    .exists()
    .withMessage('Budget is required')
    .isNumeric()
    .withMessage('Budget must be a number'),

  check('film_genres')
    .exists()
    .isArray()
    .withMessage('Film genres should be type of array with string values')
    .custom((arr: string[]) => {
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

      for (let i = 0; i < arr.length; i++) {
        if (!filmGenres.includes(arr[i])) {
          return false
        }
      }

      return true
    })
    .withMessage(
      'Film Genres should be array of strings and contain only following genres: Adventure, Musicals, Romance, Fantasy, Romance, Mystery, Action, Comedy, Horror, Sports, Drama.'
    ),
]

export default movieSchema
