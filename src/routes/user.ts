import { validateRequestSchema } from 'middlewares'
import {
  emailActivationSchema,
  googleUserSchema,
  passwordSchema,
  userSchema,
} from 'schemas'
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

router.put(
  '/activate-account',
  emailActivationSchema,
  validateRequestSchema,
  userEmailActivation
)

export default router
