import { check } from 'express-validator'

const googleImageSchema = [
  check('image')
    .exists()
    .isURL()
    .trim()
    .withMessage('Enter valid google image uri'),
]

export default googleImageSchema
