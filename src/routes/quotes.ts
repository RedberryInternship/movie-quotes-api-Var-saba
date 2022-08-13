import { validateRequestSchema } from 'middlewares'
import { uploadQuoteImage } from 'utils'
import { addQuote } from 'controllers'
import { quoteSchema } from 'schemas'
import express from 'express'

const router = express.Router()

router.post(
  '/add-quote',
  uploadQuoteImage,
  quoteSchema,
  validateRequestSchema,
  addQuote
)

export default router
