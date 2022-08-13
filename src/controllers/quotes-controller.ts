import { Quote, Movie, QuoteModel, User } from 'models'
import { RequestBody, Response } from 'types.d'
import { deleteFile } from 'utils'
import mongoose from 'mongoose'
import fs from 'fs'

export const addQuote = async (req: RequestBody<QuoteModel>, res: Response) => {
  try {
    const { movieId, quoteNameEn, quoteNameGe, user } = req.body

    if (!req.file) {
      return res.status(422).json({ message: 'Upload quote image' })
    }

    const imagePathDb = `images/movies/${req.file?.filename}`

    const existingQuoteEn = await Quote.findOne({ quoteNameEn })
    const existingQuoteGe = await Quote.findOne({ quoteNameGe })

    const currentUser = User.findById(user)

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (existingQuoteEn || existingQuoteGe) {
      if (fs.existsSync(`public/${imagePathDb}`)) {
        deleteFile(`public/${imagePathDb}`)
      }
      return res.status(409).json({ message: 'Quote is already added' })
    }

    const currentMovie = await Movie.findById(movieId).select('-__v -_id')

    if (currentMovie) {
      const newQuote = await Quote.create({
        quoteNameEn,
        quoteNameGe,
        movieId,
        user,
      })
      newQuote.image = imagePathDb

      await newQuote.save()

      await Movie.findByIdAndUpdate(movieId, {
        $push: {
          quotes: {
            _id: new mongoose.Types.ObjectId(newQuote._id),
          },
        },
      })

      return res.status(201).json(newQuote.populate('user'))
    }

    return res.status(404).json({ message: 'Movie not found' })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}
