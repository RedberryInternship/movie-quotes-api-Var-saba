import { googleUserSchema, passwordSchema, userSchema } from 'schemas'
import { validateRequestSchema } from 'middlewares'
import express from 'express'
import {
  registerUserWithGoogle,
  userAccountActivation,
  verifyUserEmail,
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

router.get('/verify-email', verifyUserEmail)

router.get('/activate-account', userAccountActivation)

export default router
