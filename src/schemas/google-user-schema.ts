import { check } from 'express-validator'

const googleUserSchema = [
  check('name').exists().trim().withMessage('Name is required!'),

  check('email')
    .exists()
    .trim()
    .isEmail()
    .withMessage('Enter valid email address'),
]

export default googleUserSchema
