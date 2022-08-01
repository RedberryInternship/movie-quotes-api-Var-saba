import { validateRequestSchema } from 'middlewares'
import express, { RequestHandler } from 'express'
import {
  userAccountActivation,
  verifyUserEmail,
  changePassword,
  authorization,
  registerUser,
  googleAuth,
} from 'controllers'
import {
  googleUserSchema,
  passwordSchema,
  userSchema,
  authSchema,
} from 'schemas'

const router = express.Router()

router.post('/google-auth', googleUserSchema, validateRequestSchema, googleAuth)

router.post('/authorization', authSchema, validateRequestSchema, authorization)

router.get('/activate-account', userAccountActivation)

router.get('/verify-email', verifyUserEmail)

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

export default router
