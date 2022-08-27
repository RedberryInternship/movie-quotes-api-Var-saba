import { check } from 'express-validator'

const passwordSchema = [
  check('password')
    .trim()
    .isLength({
      min: 8,
      max: 15,
    })
    .withMessage('Password should include at least 8 & max.15 characters')
    .custom((value: string) => {
      if (value.toLowerCase() !== value) {
        return false
      }

      return true
    })
    .withMessage('Password should include only lower case characters'),
]

export default passwordSchema
