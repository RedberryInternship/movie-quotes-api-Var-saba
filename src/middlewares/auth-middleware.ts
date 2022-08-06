import jwt, { JwtPayload } from 'jsonwebtoken'
import { Response, Next } from 'types'
import { AuthBody } from './types.d'

const authMiddleware = (req: AuthBody, res: Response, next: Next) => {
  try {
    const url = req.url

    if (
      url.includes('/register-user') ||
      url.includes('/google-auth') ||
      url.includes('/verify-email') ||
      url.includes('/authorization') ||
      url.includes('/film-genres') ||
      url.includes('/activate-account')
    ) {
      return next()
    } else {
      const secretText = process.env.JWT_SECRET

      if (secretText) {
        const { authorization } = req.headers

        if (!authorization) {
          return res.status(401).json({
            message: 'Missing authorization headers',
          })
        }

        const token = authorization.trim().split(' ')[1]

        let verified: string | JwtPayload
        verified = jwt.verify(token, secretText)

        if (verified) {
          return next()
        }

        return res.status(401).json({ message: 'User is not authorized' })
      }
    }
  } catch (error: any) {
    return res.status(403).json({ message: 'Token is not valid' })
  }
}

export default authMiddleware
