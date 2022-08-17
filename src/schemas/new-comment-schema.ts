import { check } from 'express-validator'

const newCommentSchema = [
  check('quoteId')
    .trim()
    .isLength({ min: 24, max: 24 })
    .withMessage('quoteId should include 24 characters'),

  check('userId')
    .trim()
    .isLength({ min: 24, max: 24 })
    .withMessage('userId should include 24 characters'),

  check('commentText')
    .exists()
    .trim()
    .notEmpty()
    .withMessage('Comment text is required'),
]

export default newCommentSchema
