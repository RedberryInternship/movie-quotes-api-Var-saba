import { check } from 'express-validator'

const changeUserSchema = [
  check('username')
    .optional()
    .trim()
    .isLength({
      min: 3,
      max: 15,
    })
    .withMessage(
      'Username should include at least 3 & max.15 lower case characters'
    ),
]

export default changeUserSchema
