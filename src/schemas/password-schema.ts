import { check } from 'express-validator'

const passwordSchema = [
  check('password')
    .trim()
    .isLength({
      min: 8,
      max: 15,
    })
    .withMessage(
      'Password should include at least 8 & max.15 lower case characters'
    ),
]

export default passwordSchema
