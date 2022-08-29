import { check } from 'express-validator'

const secondaryEmailSchema = [
  check('email')
    .exists()
    .trim()
    .isEmail()
    .withMessage('Enter valid email address!'),
]

export default secondaryEmailSchema
