import { markAsReadNotifications, addUserNotification } from 'controllers'
import { validateRequestSchema } from 'middlewares'
import { userNotificationSchema } from 'schemas'
import express from 'express'

const router = express.Router()

router.get('/mark-as-read', markAsReadNotifications)

router.post(
  '/add-notification',
  userNotificationSchema,
  validateRequestSchema,
  addUserNotification
)

export default router
