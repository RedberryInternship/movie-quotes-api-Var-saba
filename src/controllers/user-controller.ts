import { ChangePasswordReq, ChangeMemberUsername, Email } from './types.d'
import jwt_decode from 'jwt-decode'
import mongoose from 'mongoose'
import { User } from 'models'
import bcrypt from 'bcryptjs'
import {
  RequestQuery,
  ImageReqBody,
  RequestBody,
  AccessToken,
  Response,
} from 'types.d'

export const changePassword = async (
  req: RequestBody<ChangePasswordReq>,
  res: Response
) => {
  try {
    const { password, id } = req.body

    if (!mongoose.isValidObjectId(id)) {
      return res.status(422).json({ message: 'Enter valid id' })
    }

    const existingUser = await User.findById(id)

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!existingUser.password) {
      return res.status(409).json({
        message:
          "User is registered with google account. You can't change password of google user.",
      })
    }

    existingUser.password = await bcrypt.hash(password, 12)
    await existingUser.save()

    return res.status(200).json({ message: 'Password updated successfully' })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export const uploadUserImg = async (
  req: RequestBody<ImageReqBody>,
  res: Response
) => {
  try {
    const currentUser = await User.findById(req.body.id)
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (req.body.fileValidationError) {
      return res.status(422).json({ message: 'Upload only image' })
    }

    if (req.file) {
      currentUser.image = req.file.path.substring(7)

      await currentUser.save()
      return res.status(201).json({
        message: 'User image uploaded successfully',
      })
    } else return res.status(422).json({ message: 'Upload user image' })
  } catch (error) {
    return res.status(422).json({ message: 'User Id is not valid' })
  }
}

export const ChangeUsername = async (
  req: RequestBody<ChangeMemberUsername>,
  res: Response
) => {
  try {
    const { id, username } = req.body

    if (!mongoose.isValidObjectId(id)) {
      return res.status(422).json({ message: 'Enter valid id' })
    }

    const currentUser = await User.findById(id)

    if (!currentUser) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    currentUser.name = username
    await currentUser.save()

    return res.status(200).json({
      message: 'Username changed successfully',
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

export const getUserDetails = async (
  req: RequestQuery<AccessToken>,
  res: Response
) => {
  try {
    const { accessToken } = req.query
    let email = jwt_decode<Email>(accessToken).email

    if (!email) {
      return res.status(401).json({ message: 'Enter valid JWT token' })
    }

    const existingUser = await User.findOne({ email }).select(
      '-password -verified -notifications'
    )

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json(existingUser)
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    })
  }
}
