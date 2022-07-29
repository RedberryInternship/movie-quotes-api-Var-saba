import { RegisterMemberReq, EmailActivationReq } from './types.d'
import { RequestBody, Response } from 'types.d'
import sgMail from '@sendgrid/mail'
import jwt from 'jsonwebtoken'
import { User } from 'models'
import bcrypt from 'bcryptjs'

export const registerUser = async (
  req: RequestBody<RegisterMemberReq>,
  res: Response
) => {
  try {
    const { name, email, password } = req.body

    if (!/^[a-z0-9]+$/g.test(name) || !/^[a-z0-9]+$/g.test(password)) {
      return res
        .status(422)
        .json({ message: 'Credentials should include lowercase characters!' })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(409).json({ message: `User is already registered!` })
    }

    if (process.env.SENGRID_API_KEY) {
      await sgMail.setApiKey(process.env.SENGRID_API_KEY)

      const emailToken = jwt.sign({ email }, process.env.EMAIL_SECRET!)

      await sgMail.send(
        {
          to: email,
          from: 'vartasashvili94@gmail.com',
          subject: 'Account verification',
          text: `<a href="${process.env.FRONTEND_URI}?emailToConfirm=${email}&token=${emailToken}">Click to Confirm Email</a>`,
        },
        false,
        async (err: any) => {
          if (err) {
            return res
              .status(400)
              .json({ message: 'User registration failed!' })
          }

          const hashedPassword = await bcrypt.hash(password, 12)
          await User.create({ name, email, password: hashedPassword })

          return res.status(201).json({
            message:
              'User registered successfully! Account verification link sent.',
          })
        }
      )
    } else {
      return res.status(401).json({ message: 'Sendgrid api key is missing!' })
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export const userEmailActivation = async (
  req: RequestBody<EmailActivationReq>,
  res: Response
) => {
  try {
    const { email, token } = req.body

    const existingUser = await User.findOne({ email })

    if (!existingUser) {
      return res.status(404).json({ message: `User is not registered yet!` })
    }

    const verified = jwt.verify(token, process.env.EMAIL_SECRET!)

    if (verified) {
      await User.updateOne({ email }, { verified: true })

      return res.status(200).json({
        message: 'Account activated successfully!',
      })
    }

    return res.status(401).json({ message: 'Token is not valid' })
  } catch (error) {
    return res.status(500).json({ message: 'Email verification failed!' })
  }
}
