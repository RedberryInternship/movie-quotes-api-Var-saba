import { validateRequestSchema } from 'middlewares'
import express from 'express'
import {
  emailActivationSchema,
  googleImageSchema,
  passwordSchema,
  userSchema,
} from 'schemas'
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
  '/register-user-with-google',
  userSchema,
  googleImageSchema,
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
