import jwt, { JwtPayload } from 'jsonwebtoken'
import { Response, Next } from 'types'
import { AuthBody } from './types.d'

const authMiddleware = (req: AuthBody, res: Response, next: Next) => {
  try {
    const excludeUris = [
      '/register-user',
      '/register-google-user',
      '/verify-email',
      '/activate-account',
    ]

    excludeUris.forEach((uri) => {
      if (req.url.includes(uri)) {
        return next()
      }
    })

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
  } catch (error: any) {
    console.log(error)
    return res.status(403).json({ message: 'Token is not valid' })
  }
}

export default authMiddleware
