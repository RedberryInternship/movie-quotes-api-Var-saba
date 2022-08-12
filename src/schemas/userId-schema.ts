import { check } from 'express-validator'

const userIdSchema = [
  check('userId')
    .trim()
    .exists()
    .isLength({ min: 24, max: 24 })
    .withMessage('User id should include 24 characters'),
]

export default userIdSchema
