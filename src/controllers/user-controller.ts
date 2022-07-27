import { RequestBody, Response } from 'types'
import { RegisterMemberReq } from './types.d'
import sgMail from '@sendgrid/mail'
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

    const existingName = await User.findOne({ name })
    const existingEmail = await User.findOne({ email })

    if (existingName || existingEmail) {
      return res
        .status(409)
        .json({ message: `User with this credentials is already registered!` })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await User.create({ name, email, password: hashedPassword })

    if (process.env.SENGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENGRID_API_KEY)

      await sgMail.send({
        to: email,
        from: 'vartasashvili94@gmail.com',
        subject: 'Account verification',
        text: 'verification email',
      })
    }

    return res.status(201).json({ message: 'User registered successfully!' })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}
