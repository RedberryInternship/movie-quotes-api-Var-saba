import { validateRequestSchema } from 'middlewares'
import { addQuote, deleteQuote } from 'controllers'
import { quoteSchema, idSchema } from 'schemas'
import { uploadQuoteImage } from 'utils'
import express from 'express'

const router = express.Router()

router.delete('/delete-quote', idSchema, validateRequestSchema, deleteQuote)

router.post(
  '/add-quote',
  uploadQuoteImage,
  quoteSchema,
  validateRequestSchema,
  addQuote
)

export default router
