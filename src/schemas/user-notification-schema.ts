import { check } from 'express-validator'

const userNotificationSchema = [
  check('receiverId')
    .trim()
    .isLength({ min: 24, max: 24 })
    .withMessage('receiverId should include 24 characters'),

  check('senderId')
    .trim()
    .isLength({ min: 24, max: 24 })
    .withMessage('senderId should include 24 characters'),

  check('notificationType')
    .exists()
    .notEmpty()
    .withMessage('Notification type is required')
    .custom((value) => {
      if (value !== 'like' && value !== 'comment') {
        return false
      }

      return true
    })
    .withMessage("Notification type should be 'like' or 'comment'"),
]

export default userNotificationSchema
