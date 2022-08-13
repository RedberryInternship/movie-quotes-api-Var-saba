import { quoteSchema, idSchema, changeQuoteSchema } from 'schemas'
import { addQuote, deleteQuote, changeQuote } from 'controllers'
import { validateRequestSchema } from 'middlewares'
import { uploadQuoteImage } from 'utils'
import express from 'express'

const router = express.Router()

router.delete('/delete-quote', idSchema, validateRequestSchema, deleteQuote)

router.put(
  '/change-quote',
  uploadQuoteImage,
  idSchema,
  changeQuoteSchema,
  validateRequestSchema,
  changeQuote
)

router.post(
  '/add-quote',
  uploadQuoteImage,
  quoteSchema,
  validateRequestSchema,
  addQuote
)

export default router
