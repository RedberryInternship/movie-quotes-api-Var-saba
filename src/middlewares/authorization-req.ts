import { RequestBody, Response, AuthorizationReq, Next } from 'types'
import { User } from 'models'

const authorizationReq = async (
  req: RequestBody<AuthorizationReq>,
  res: Response,
  next: Next
) => {
  try {
    const { email } = req.body
    const currentUser = await User.findOne({ email })

    if (!currentUser || !currentUser.password) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!currentUser.verified) {
      return res.status(403).json({
        message: 'User can not log in because account is not verified yet',
      })
    }

    return next()
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export default authorizationReq
