import { RequestBody, Response, RequestQuery, ImageReqBody } from 'types.d'
import { generateEmail, emailData, isLowercase } from 'utils'
import jwt_decode from 'jwt-decode'
import sgMail from '@sendgrid/mail'
import jwt from 'jsonwebtoken'
import { User } from 'models'
import bcrypt from 'bcryptjs'
import {
  RegisterGoogleMemberReq,
  EmailActivationReq,
  RegisterMemberReq,
  ChangePasswordReq,
  AuthorizationReq,
  ChangeMemberReq,
  Email,
} from './types.d'

export const registerUser = async (
  req: RequestBody<RegisterMemberReq>,
  res: Response
) => {
  try {
    const { name, email, password } = req.body

    if (!isLowercase(name) || !isLowercase(password)) {
      return res
        .status(422)
        .json({ message: 'Credentials should include lowercase characters!' })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(409).json({ message: `User is already registered!` })
    }

    if (process.env.SENGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENGRID_API_KEY)

      const emailToken = jwt.sign({ email }, process.env.JWT_SECRET!)

      const emailTemp = generateEmail(name, 'account', `/?token=${emailToken}`)

      const data = emailData(email, 'account', emailTemp)

      await sgMail.send(data, false, async (err: any) => {
        if (err) {
          return res.status(500).json({
            message: err.message,
          })
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        await User.create({ name, email, password: hashedPassword })

        return res.status(201).json({
          message:
            'User registered successfully! Account verification link sent.',
        })
      })
    } else {
      return res.status(401).json({ message: 'Sendgrid api key is missing!' })
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export const googleAuth = async (
  req: RequestBody<RegisterGoogleMemberReq>,
  res: Response
) => {
  try {
    const { name, email } = req.body

    const existingUser = await User.findOne({ email })

    const token = jwt.sign({ email }, process.env.JWT_SECRET!)

    if (!existingUser) {
      const newUser = await User.create({ name, email })

      newUser.verified = true

      await newUser.save()
    }

    return res.status(200).json({
      token,
    })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export const userAccountActivation = async (
  req: RequestQuery<EmailActivationReq>,
  res: Response
) => {
  try {
    const { token } = req.query

    const verified = jwt.verify(token, process.env.JWT_SECRET!)

    if (verified) {
      let userEmil = jwt_decode<Email>(token).email

      const existingUser = await User.findOne({ email: userEmil })

      if (!existingUser) {
        return res.status(404).json({ message: `User is not registered yet!` })
      }

      await User.updateOne({ email: userEmil }, { verified: true })

      return res.status(200).json({
        message: 'Account activated successfully!',
      })
    } else {
      return res.status(401).json({
        message:
          'User is not authorized to activate account. Token verification failed',
      })
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

export const verifyUserEmail = async (
  req: RequestQuery<Email>,
  res: Response
) => {
  try {
    const { email } = req.query

    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (!email || !email.match(emailRegex)) {
      return res.status(422).json({
        message: 'Enter valid email query param',
      })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      if (existingUser.password) {
        const token = jwt.sign({ email }, process.env.JWT_SECRET!)

        const emailTemp = generateEmail(
          existingUser.name,
          'email',
          `/?emailVerificationToken=${token}`
        )

        if (process.env.SENGRID_API_KEY) {
          sgMail.setApiKey(process.env.SENGRID_API_KEY)
        }

        const data = emailData(email, 'email address', emailTemp)

        await sgMail.send(data, false, async (err: any) => {
          if (err) {
            return res.status(500).json({
              message: err.message,
            })
          }

          return res.status(200).json({
            message: 'Email verification link sent. Check your email.',
          })
        })
      }

      return res.status(200).json({
        message:
          "User is registered with google authentication. Can't change google account password.",
      })
    } else {
      return res.status(404).json({
        message: 'User with this email is not registered yet.',
      })
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

export const changePassword = async (req: ChangePasswordReq, res: Response) => {
  try {
    const { authorization } = req.headers
    const { password } = req.body

    const token = authorization.trim().split(' ')[1]

    const verified = jwt.verify(token, process.env.JWT_SECRET!)

    if (verified) {
      let email = jwt_decode<Email>(token).email

      const existingUser = await User.findOne({ email })

      if (!existingUser || !existingUser.password) {
        return res.status(404).json({ message: `User is not registered!` })
      }

      const hashedPassword = await bcrypt.hash(password, 12)

      await User.updateOne({ email }, { password: hashedPassword })

      return res.status(200).json({ message: 'Password updated successfully' })
    } else {
      return res.status(401).json({
        message:
          'User is not authorized to change password. Token verification failed.',
      })
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export const authorization = async (
  req: RequestBody<AuthorizationReq>,
  res: Response
) => {
  try {
    const { email, password } = req.body
    const currentUser = await User.findOne({ email })

    if (!currentUser || !currentUser.password) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!currentUser.verified) {
      return res.status(403).json({
        message: 'User can not log in because account is not verified yet',
      })
    }

    const isMatch = await bcrypt.compare(password, currentUser.password!)

    if (isMatch && process.env.JWT_SECRET) {
      const accessToken = jwt.sign({ email, password }, process.env.JWT_SECRET)

      return res.status(200).json({ token: accessToken })
    } else {
      return res.status(401).json({
        message: 'User is not authorized to change password',
      })
    }
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

export const changeUserCredentials = async (
  req: RequestBody<ChangeMemberReq>,
  res: Response
) => {
  try {
    const { id, email, name, password } = req.body

    const currentUser = await User.findById(id)

    if (!currentUser) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    if (name) {
      currentUser.name = name
    }

    if (password && currentUser.password) {
      const hashedPassword = await bcrypt.hash(password, 12)
      currentUser.password = hashedPassword
    }

    if (email) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET!)

      const emailTemp = generateEmail(
        currentUser.name,
        'email',
        `/news-feed/user-profile?token=${token}&userId=${currentUser.id}`
      )

      if (process.env.SENGRID_API_KEY) {
        sgMail.setApiKey(process.env.SENGRID_API_KEY)
      }

      const data = emailData(email, 'email address', emailTemp)

      await sgMail.send(data, false, async (err: any) => {
        if (err) {
          return res.status(500).json({
            message: err.message,
          })
        }

        return res.status(200).json({
          message: 'Email verification link sent. Check your email.',
        })
      })
    }

    await currentUser.save()
    return res
      .status(200)
      .json({ message: 'User credentials updated successfully' })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    })
  }
}
