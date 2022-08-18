import { languageValidation } from 'utils'
import { check } from 'express-validator'

const quoteSchema = [
  check('movie')
    .trim()
    .isLength({ min: 24, max: 24 })
    .withMessage('movie id should include 24 characters'),

  check('user')
    .trim()
    .isLength({ min: 24, max: 24 })
    .withMessage('user should include 24 characters'),

  check('quoteEn')
    .exists()
    .notEmpty()
    .withMessage('Quote description in English is required')
    .custom((value) => {
      return languageValidation(value, 'en')
    })
    .withMessage('Enter English characters and symbols'),

  check('quoteGe')
    .exists()
    .notEmpty()
    .withMessage('Quote description in Georgian is required')
    .custom((value) => {
      return languageValidation(value, 'ge')
    })
    .withMessage('Enter Georgian characters and symbols'),
]

export default quoteSchema
