import { check } from 'express-validator'

const emailActivationSchema = [
  check('email')
    .exists()
    .trim()
    .isEmail()
    .withMessage('Enter valid email address!'),

  check('token').exists().trim().withMessage('Token is required!'),
]

export default emailActivationSchema
