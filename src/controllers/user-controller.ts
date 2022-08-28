import { emailData, generateEmail, validId } from 'utils'
import jwt_decode from 'jwt-decode'
import sgMail from '@sendgrid/mail'
import jwt from 'jsonwebtoken'
import { User } from 'models'
import bcrypt from 'bcryptjs'
import {
  SecondaryEmailActivation,
  ChangeMemberUsername,
  SecondaryEmailReq,
  ChangePasswordReq,
  SecondaryEmail,
  Email,
} from './types.d'
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

    if (!validId(id)) {
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
    const { id, fileValidationError } = req.body

    const currentUser = await User.findById(id)

    if (!validId(id)) {
      return res.status(422).json({ message: 'Enter valid id' })
    }

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (fileValidationError) {
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

    if (!validId(id)) {
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

    if (existingUser.secondaryEmails.length > 1) {
      existingUser.secondaryEmails = existingUser.secondaryEmails.reverse()
      await existingUser.save()
    }

    return res.status(200).json(existingUser)
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

export const addSecondaryEmail = async (
  req: RequestBody<SecondaryEmailReq>,
  res: Response
) => {
  try {
    const { id, email } = req.body

    if (!validId(id)) {
      return res.status(422).json({ message: 'Enter valid id' })
    }

    const existingUser = await User.findById(id)

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!existingUser.password) {
      return res
        .status(409)
        .json({ message: "Google account user can't add secondary email" })
    }

    const duplicateEmail = existingUser.secondaryEmails.find(
      (item) => item.email === email
    )

    if (duplicateEmail || existingUser.email === email) {
      return res
        .status(409)
        .json({ message: 'Provided email address is already added' })
    }

    await existingUser.update({
      $push: {
        secondaryEmails: {
          email,
          verified: false,
        },
      },
    })

    const token = jwt.sign({ email }, process.env.JWT_SECRET!)

    const emailTemp = generateEmail(
      existingUser.name,
      'email',
      `profile/?secondaryEmailVerificationToken=${token}&emailId=${id}`
    )

    sgMail.setApiKey(process.env.SENGRID_API_KEY!)

    const data = emailData(email, 'email address', emailTemp)

    await sgMail.send(data, false, async (err: any) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        })
      }

      const currentUser = await User.findById(id)

      return res.status(201).json(currentUser?.secondaryEmails.at(-1))
    })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export const deleteEmail = async (
  req: RequestBody<SecondaryEmailReq>,
  res: Response
) => {
  try {
    const { id, email } = req.body

    if (!validId(id)) {
      return res.status(422).json({ message: 'Enter valid id' })
    }

    const existingUser = await User.findById(id)

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    const existingEmail = existingUser.secondaryEmails.find(
      (item) => item.email === email
    )

    if (!existingEmail) {
      return res.status(404).json({
        message: "Provided email doesn't exist in secondary emails list",
      })
    }

    existingUser.secondaryEmails = existingUser.secondaryEmails.filter(
      (item) => item.email !== email
    )

    await existingUser.save()
    return res.status(200).json({ message: 'Email deleted successfully' })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export const changePrimaryEmail = async (
  req: RequestBody<SecondaryEmailReq>,
  res: Response
) => {
  try {
    const { id, email } = req.body

    if (!validId(id)) {
      return res.status(422).json({ message: 'Enter valid id' })
    }

    const existingUser = await User.findById(id)

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (existingUser.email === email) {
      return res
        .status(409)
        .json({ message: 'Provided email is already primary' })
    }

    const existingEmail = existingUser.secondaryEmails.find(
      (item) => item.email === email
    )

    if (!existingEmail) {
      return res.status(404).json({
        message: "Provided email doesn't exist in secondary emails list",
      })
    }

    if (!existingEmail.verified) {
      return res.status(409).json({
        message: 'Email is not verified',
      })
    }

    existingUser.secondaryEmails = existingUser.secondaryEmails.filter(
      (item) => item.email !== email
    )
    await existingUser.save()

    await existingUser.update({
      $push: {
        secondaryEmails: {
          email: existingUser.email,
          verified: true,
        },
      },
    })

    existingUser.email = email
    await existingUser.save()

    const token = jwt.sign({ email, id }, process.env.JWT_SECRET!)

    return res.status(200).json({ token })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export const secondaryEmailActivation = async (
  req: RequestQuery<SecondaryEmailActivation>,
  res: Response
) => {
  try {
    const { id, secondaryEmailVerificationToken } = req.query

    if (!validId(id)) {
      return res.status(422).json({ message: 'Enter valid user id' })
    }

    if (!secondaryEmailVerificationToken) {
      return res.status(422).json({ message: 'verification token is required' })
    }

    const existingUser = await User.findById(id)
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    let userEmil = jwt_decode<SecondaryEmail>(
      secondaryEmailVerificationToken
    ).secondaryEmail

    const existingEmail = existingUser.secondaryEmails.find(
      (item) => item.email === userEmil
    )

    if (!existingEmail) {
      return res.status(404).json({
        message: "Provided email doesn't exist in secondary emails list",
      })
    }

    existingEmail.verified = true
    await existingUser.save()
    return res.status(200).json({ message: 'Email verified successfully' })
  } catch (error: any) {
    return res.status(422).json({ message: 'JWT token is invalid' })
  }
}
