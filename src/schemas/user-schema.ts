import { check } from 'express-validator'

const userSchema = [
  check('name')
    .trim()
    .isLength({
      min: 3,
      max: 15,
    })
    .withMessage(
      'Name should include at least 3 & max.15 lower case characters'
    ),

  check('email')
    .exists()
    .trim()
    .isEmail()
    .withMessage('Enter valid email address'),
]

export default userSchema
