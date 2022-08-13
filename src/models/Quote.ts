import { QuoteModel } from './types.d'
import mongoose from 'mongoose'

const { Schema } = mongoose

const quoteSchema = new Schema<QuoteModel>({
  movieId: {
    type: String,
    required: true,
  },

  quoteNameEn: {
    type: String,
    required: true,
  },

  quoteNameGe: {
    type: String,
    required: true,
  },

  user: { type: Schema.Types.ObjectId, ref: 'user', required: true },

  likes: {
    type: Number,
    required: true,
    default: 0,
  },

  comments: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'user' },
      commentText: {
        type: String,
      },
    },
  ],
})

const Quote = mongoose.model('quote', quoteSchema)

export default Quote
