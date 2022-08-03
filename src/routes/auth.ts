import { validateRequestSchema, authorizationReq } from 'middlewares'
import express from 'express'
import {
  userAccountActivation,
  activateNewUserEmail,
  verifyUserEmail,
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

router.get('/activate-new-user-email', activateNewUserEmail)

router.get('/activate-account', userAccountActivation)

router.get('/verify-email', verifyUserEmail)

router.post(
  '/authorization',
  authSchema,
  validateRequestSchema,
  authorizationReq,
  authorization
)

router.post(
  '/register-user',
  passwordSchema,
  userSchema,
  validateRequestSchema,
  registerUser
)

export default router
