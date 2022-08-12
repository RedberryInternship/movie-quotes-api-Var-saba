import { languageValidation } from 'utils'
import { check } from 'express-validator'

const movieSchema = [
  check('movieDescriptionEn')
    .exists()
    .notEmpty()
    .withMessage('Movie description in English is required')
    .custom((value) => {
      return languageValidation(value, 'en')
    })
    .withMessage('Enter English characters and symbols'),

  check('movieDescriptionGe')
    .exists()
    .notEmpty()
    .withMessage('Movie description in Georgian is required')
    .custom((value) => {
      return languageValidation(value, 'ge')
    })
    .withMessage('Enter Georgian characters and symbols'),

  check('movieNameGe')
    .exists()
    .notEmpty()
    .withMessage('Movie name in Georgian is required')
    .custom((value) => {
      return languageValidation(value, 'ge')
    })
    .withMessage('Enter Georgian characters and symbols'),

  check('movieNameEn')
    .exists()
    .notEmpty()
    .withMessage('Movie name in English is required')
    .custom((value) => {
      return languageValidation(value, 'en')
    })
    .withMessage('Enter English characters and symbols'),

  check('directorEn')
    .exists()
    .notEmpty()
    .withMessage('Director name in English is required')
    .custom((value) => {
      return languageValidation(value, 'en')
    })
    .withMessage('Enter English characters and symbols'),

  check('directorGe')
    .exists()
    .notEmpty()
    .withMessage('Director name is required')
    .custom((value) => {
      return languageValidation(value, 'ge')
    })
    .withMessage('Enter Georgian characters and symbols'),

  check('budget')
    .exists()
    .withMessage('Budget is required')
    .isNumeric()
    .withMessage('Budget must be a number'),

  check('movieGenres')
    .exists()
    .isArray()
    .withMessage('Movie genres should be type of array with string values')
    .custom((arr: string[]) => {
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
      for (let i = 0; i < arr.length; i++) {
        if (!movieGenres.includes(arr[i])) {
          return false
        }
      }

      return true
    })
    .withMessage(
      'Movie Genres should be array of strings and contain only following genres: Adventure, Musicals, Romance, Fantasy, Romance, Mystery, Action, Comedy, Horror, Sports, Drama.'
    ),
]

export default movieSchema
