import { AuthorizationReq, RequestQuery, RequestBody, Response } from 'types.d'
import { generateEmail, emailData, isLowercase, validEmail } from 'utils'
import jwt_decode from 'jwt-decode'
import sgMail from '@sendgrid/mail'
import jwt from 'jsonwebtoken'
import { User } from 'models'
import bcrypt from 'bcryptjs'
import {
  RegisterGoogleMemberReq,
  EmailActivationReq,
  RegisterMemberReq,
  NewEmailReq,
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

    if (!validEmail(email)) {
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

export const authorization = async (
  req: RequestBody<AuthorizationReq>,
  res: Response
) => {
  try {
    const { email, password } = req.body
    const currentUser = await User.findOne({ email })

    const isMatch = await bcrypt.compare(password, currentUser?.password!)

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

export const activateNewUserEmail = async (
  req: RequestQuery<NewEmailReq>,
  res: Response
) => {
  try {
    const { token, userId } = req.query

    let newEmail = jwt_decode<Email>(token).email

    if (!newEmail) {
      return res.status(404).json({ message: 'Enter valid JWT token' })
    }

    const existingUser = await User.findById(userId)

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    existingUser.email = newEmail

    await existingUser.save()

    return res.status(200).json({
      message: 'User email changed successfully',
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    })
  }
}
