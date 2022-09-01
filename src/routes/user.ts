import { validateRequestSchema } from 'middlewares'
import express, { RequestHandler } from 'express'
import { uploadUserImage } from 'utils'
import {
  secondaryEmailActivation,
  addSecondaryEmail,
  changePrimaryEmail,
  ChangeUsername,
  changePassword,
  getUserDetails,
  uploadUserImg,
  deleteEmail,
} from 'controllers'
import {
  secondaryEmailSchema,
  changeUserSchema,
  passwordSchema,
  idSchema,
} from 'schemas'

const router = express.Router()

router.get('/user-details', getUserDetails)

router.put(
  '/change-password',
  passwordSchema,
  validateRequestSchema,
  changePassword as RequestHandler
)

router.put('/verify-secondary-email', secondaryEmailActivation)

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

router.put(
  '/change-primary-email',
  idSchema,
  secondaryEmailSchema,
  validateRequestSchema,
  changePrimaryEmail
)

router.delete(
  '/delete-secondary-email',
  idSchema,
  secondaryEmailSchema,
  validateRequestSchema,
  deleteEmail
)

export default router
