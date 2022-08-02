import { check } from 'express-validator'

const idSchema = [
  check('id')
    .trim()
    .isLength({ min: 24, max: 24 })
    .withMessage('id should include 24 characters'),
]

export default idSchema
