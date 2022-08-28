import { RequestQuery, RequestBody, Response, Id } from 'types.d'
import { NotificationReq, AllNotificationReq } from './types.d'
import { validId } from 'utils'
import { User } from 'models'
import crypto from 'crypto'

export const addUserNotification = async (
  req: RequestBody<NotificationReq>,
  res: Response
) => {
  try {
    const { receiverId, senderId, notificationType } = req.body

    if (!validId(receiverId) || !validId(senderId)) {
      return res.status(422).json({ message: 'Enter valid id' })
    }

    const senderUser = await User.findById(senderId).select('_id name image')
    if (!senderUser) {
      return res.status(404).json({ message: 'Sender user not found' })
    }

    const receiverUser = await User.findById(receiverId)
    if (!receiverUser) {
      return res.status(404).json({ message: 'Receiver user not found' })
    }

    let newNotification = {
      _id: crypto.randomBytes(16).toString('hex'),
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

    return res.status(201).json({
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

    if (!validId(id)) {
      return res.status(422).json({ message: 'Enter valid id' })
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

    return res.status(200).json({
      message: 'Notifications marked as read',
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

export const getUserNotifications = async (
  req: RequestQuery<AllNotificationReq>,
  res: Response
) => {
  try {
    const { id, page } = req.query

    if (!validId(id)) {
      return res.status(422).json({ message: 'Enter valid id' })
    }

    if (!page) {
      return res.status(422).json({ message: 'page query param is required' })
    }

    const currentUser = await User.findById(id).populate({
      path: 'notifications',
      populate: {
        path: 'user',
        select: '_id name image',
      },
    })

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    const notificationCount = currentUser.notifications.length

    if (notificationCount === 0) {
      return res.status(200).json([])
    }

    let newNotificationCount = 0

    currentUser.notifications.forEach((notification) => {
      if (notification.new) {
        newNotificationCount++
      }
    })

    const userNotifications = {
      notifications: currentUser.notifications
        .reverse()
        .slice((+page - 1) * 10, +page * 10),
      paginationInfo: {
        hasMoreNotifications: +page * 10 < notificationCount,
      },
      newNotificationCount,
    }

    return res.status(200).json(userNotifications)
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    })
  }
}
