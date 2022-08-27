import { validateRequestSchema } from 'middlewares'
import express, { RequestHandler } from 'express'
import { uploadUserImage } from 'utils'
import {
  secondaryEmailSchema,
  changeUserSchema,
  passwordSchema,
  idSchema,
} from 'schemas'
import {
  addSecondaryEmail,
  ChangeUsername,
  changePassword,
  getUserDetails,
  uploadUserImg,
} from 'controllers'

const router = express.Router()

router.get('/user-details', getUserDetails)

router.put(
  '/change-password',
  idSchema,
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

router.post(
  '/secondary-email',
  idSchema,
  secondaryEmailSchema,
  validateRequestSchema,
  addSecondaryEmail
)

router.put(
  '/change-username',
  idSchema,
  changeUserSchema,
  validateRequestSchema,
  ChangeUsername
)

export default router
