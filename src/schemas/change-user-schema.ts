import { check } from 'express-validator'

const changeUserSchema = [
  check('username')
    .optional()
    .trim()
    .isLength({
      min: 3,
      max: 20,
    })
    .withMessage(
      'Username should include at least 3 & max.20 lower case characters'
    ),
]

export default changeUserSchema
