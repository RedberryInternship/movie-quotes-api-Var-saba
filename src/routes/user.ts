import { googleUserSchema, passwordSchema, userSchema } from 'schemas'
import { validateRequestSchema } from 'middlewares'
import express from 'express'
import {
  registerUserWithGoogle,
  userEmailActivation,
  registerUser,
} from 'controllers'

const router = express.Router()

router.post(
  '/register-user',
  passwordSchema,
  userSchema,
  validateRequestSchema,
  registerUser
)

router.post(
  '/register-google-user',
  googleUserSchema,
  validateRequestSchema,
  registerUserWithGoogle
)

router.get('/activate-account', userEmailActivation)

export default router
