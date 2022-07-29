import { emailActivationSchema, passwordSchema, userSchema } from 'schemas'
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
  userSchema,
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
