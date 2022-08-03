import { validateRequestSchema } from 'middlewares'
import express, { RequestHandler } from 'express'
import { uploadUserImage } from 'utils'
import {
  userAccountActivation,
  changeUserCredentials,
  activateNewUserEmail,
  verifyUserEmail,
  changePassword,
  getUserDetails,
  uploadUserImg,
  authorization,
  registerUser,
  googleAuth,
} from 'controllers'
import {
  googleUserSchema,
  changeUserSchema,
  passwordSchema,
  userSchema,
  authSchema,
  idSchema,
} from 'schemas'

const router = express.Router()

router.post('/google-auth', googleUserSchema, validateRequestSchema, googleAuth)

router.post('/authorization', authSchema, validateRequestSchema, authorization)

router.get('/activate-account', userAccountActivation)

router.get('/verify-email', verifyUserEmail)

router.get('/activate-new-user-email', activateNewUserEmail)

router.post(
  '/register-user',
  passwordSchema,
  userSchema,
  validateRequestSchema,
  registerUser
)

export default router
