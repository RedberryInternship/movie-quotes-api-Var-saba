import { RequestQuery, RequestBody, Response, Id } from 'types.d'
import { NotificationReq } from './types.d'
import { User } from 'models'

export const addUserNotification = async (
  req: RequestBody<NotificationReq>,
  res: Response
) => {
  try {
    const { receiverId, senderId, notificationType } = req.body

    const senderUser = await User.findById(senderId).select('_id name image')
    if (!senderUser) {
      return res.status(404).json({ message: 'Sender user not found' })
    }

    const receiverUser = await User.findById(receiverId)
    if (!receiverUser) {
      return res.status(404).json({ message: 'Receiver user not found' })
    }

    let newNotification = {
      date: new Date().toString(),
      notificationType,
      new: true,
    }

    await User.findByIdAndUpdate(receiverId, {
      $push: {
        notifications: {
          ...newNotification,
          user: senderUser._id,
        },
      },
    })

    return res.status(200).json({
      ...newNotification,
      user: senderUser,
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

export const markAsReadNotifications = async (
  req: RequestQuery<Id>,
  res: Response
) => {
  try {
    const { id } = req.query

    if (id.length !== 24) {
      return res
        .status(422)
        .json({ message: 'User id should include 24 characters' })
    }

    const currentUser = await User.findById(id)

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (currentUser.notifications.length === 0) {
      return res
        .status(409)
        .json({ message: 'User notification list is empty' })
    }

    currentUser.notifications.forEach((notification) => {
      if (notification.new === true) {
        notification.new = false
      }
    })

    await currentUser.save()

    return res.status(201).json({
      message: 'Notifications marked as read',
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    })
  }
}
