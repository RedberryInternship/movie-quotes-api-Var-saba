import { passwordSchema, userSchema, emailActivationSchema } from 'schemas'
import { registerUser, userEmailActivation } from 'controllers'
import { validateRequestSchema } from 'middlewares'
import express from 'express'

const router = express.Router()

router.post(
  '/register-user',
  passwordSchema,
  userSchema,
  validateRequestSchema,
  registerUser
)

router.put(
  '/activate-account',
  emailActivationSchema,
  validateRequestSchema,
  userEmailActivation
)

export default router
