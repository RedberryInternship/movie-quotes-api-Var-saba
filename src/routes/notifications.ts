import { validateRequestSchema } from 'middlewares'
import { userNotificationSchema } from 'schemas'
import express from 'express'
import {
  markAsReadNotifications,
  getUserNotifications,
  addUserNotification,
} from 'controllers'

const router = express.Router()

router.put('/mark-as-read', markAsReadNotifications)

router.get('/user-notifications', getUserNotifications)

router.post(
  '/add-notification',
  userNotificationSchema,
  validateRequestSchema,
  addUserNotification
)

export default router
