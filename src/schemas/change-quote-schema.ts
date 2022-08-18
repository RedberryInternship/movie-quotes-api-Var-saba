import { languageValidation } from 'utils'
import { check } from 'express-validator'

const changeQuoteSchema = [
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

export default changeQuoteSchema
