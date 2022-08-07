import { check } from 'express-validator'

const movieSchema = [
  check('movie_description_en')
    .trim()
    .exists()
    .withMessage('Movie description in English is required'),

  check('movie_description_ge')
    .trim()
    .exists()
    .withMessage('Movie description in Georgian is required'),

  check('movie_name_ge')
    .trim()
    .exists()
    .withMessage('Movie name in Georgian is required'),

  check('movie_name_en')
    .trim()
    .exists()
    .withMessage('Movie name in English is required'),

  check('director_en')
    .trim()
    .exists()
    .withMessage('Director name in English is required'),

  check('director_ge')
    .trim()
    .exists()
    .withMessage('Director name in Georgian is required'),

  check('budget')
    .exists()
    .withMessage('Budget is required')
    .isNumeric()
    .withMessage('Budget must be a number'),

  check('options.*')
    .isLength({
      min: 1,
    })
    .withMessage('Film genres should contain at least one genre'),
]

export default movieSchema
