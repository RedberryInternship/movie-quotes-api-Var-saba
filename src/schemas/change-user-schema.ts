import { check } from 'express-validator'

const changeUserSchema = [
  check('name')
    .optional()
    .trim()
    .isLength({
      min: 3,
      max: 15,
    })
    .withMessage(
      'Name should include at least 3 & max.15 lower case characters'
    ),

  check('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Enter valid email address'),

  check('password')
    .optional()
    .trim()
    .isLength({
      min: 8,
      max: 15,
    })
    .withMessage(
      'Password should include at least 8 & max.15 lower case characters'
    ),
]

export default changeUserSchema
