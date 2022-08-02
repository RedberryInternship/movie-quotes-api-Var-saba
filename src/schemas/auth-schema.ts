import { check } from 'express-validator'

const authSchema = [
  check('email').trim().notEmpty().isEmail().withMessage('Enter valid email'),

  check('password').trim().notEmpty().withMessage('Password is required'),
]

export default authSchema
