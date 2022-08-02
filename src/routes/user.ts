import { validateRequestSchema } from 'middlewares'
import express, { RequestHandler } from 'express'
import { uploadUserImage } from 'utils'
import {
  userAccountActivation,
  verifyUserEmail,
  changePassword,
  uploadUserImg,
  authorization,
  registerUser,
  googleAuth,
} from 'controllers'
import {
  googleUserSchema,
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

router.patch(
  '/upload-user-image',
  uploadUserImage,
  idSchema,
  validateRequestSchema,
  uploadUserImg
)

export default router
