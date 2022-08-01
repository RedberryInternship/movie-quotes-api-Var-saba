import { googleUserSchema, passwordSchema, userSchema } from 'schemas'
import { validateRequestSchema } from 'middlewares'
import express, { RequestHandler } from 'express'
import {
  googleAuth,
  userAccountActivation,
  verifyUserEmail,
  changePassword,
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
  '/change-password',
  passwordSchema,
  validateRequestSchema,
  changePassword as RequestHandler
)

router.post('/google-auth', googleUserSchema, validateRequestSchema, googleAuth)

router.get('/verify-email', verifyUserEmail)

router.get('/activate-account', userAccountActivation)

export default router
