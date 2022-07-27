import { passwordSchema, userSchema } from 'schemas'
import { validateRequestSchema } from 'middlewares'
import { registerUser } from 'controllers'
import express from 'express'

const router = express.Router()

router.post(
  '/register-user',
  passwordSchema,
  userSchema,
  validateRequestSchema,
  registerUser
)

export default router
