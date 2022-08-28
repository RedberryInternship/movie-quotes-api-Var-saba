import { deleteFile, populateQuote, includeChecker, validId } from 'utils'
import { RequestBody, Response, QueryId } from 'types.d'
import { Quote, Movie, QuoteModel, User } from 'models'
import mongoose from 'mongoose'
import fs from 'fs'
import {
  NewsFeedRequestQuery,
  QuoteRequestQuery,
  ChangeQuoteReq,
  LikeQueryReq,
  CommentReq,
} from './types.d'

export const addQuote = async (req: RequestBody<QuoteModel>, res: Response) => {
  try {
    const { movie, quoteEn, quoteGe, user } = req.body

    if (!req.file) {
      return res.status(422).json({ message: 'Upload quote image' })
    }

    const imagePathDb = `images/quotes/${req.file?.filename}`

    const existingQuoteEn = await Quote.findOne({ quoteEn })
    const existingQuoteGe = await Quote.findOne({ quoteGe })

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

    const currentMovie = await Movie.findById(movie).select('-_id')

    if (currentMovie) {
      const newQuote = await Quote.create({
        quoteEn,
        quoteGe,
        movie,
        user,
      })

      newQuote.image = imagePathDb

      await (
        await (await newQuote.save()).populate('user', 'name image')
      ).populate('movie', 'movieNameEn movieNameGe')

      await Movie.findByIdAndUpdate(movie, {
        $push: {
          quotes: {
            _id: new mongoose.Types.ObjectId(newQuote._id),
          },
        },
      })

      return res.status(201).json(newQuote)
    }

    return res.status(404).json({ message: 'Movie not found' })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export const deleteQuote = async (req: QueryId, res: Response) => {
  try {
    if (validId(req.query.id)) {
      return res.status(422).json({ message: 'Enter valid id' })
    }

    const id = { _id: new mongoose.Types.ObjectId(req.query.id) }

    const quote = await Quote.findOne(id)

    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' })
    }

    if (quote.image) {
      deleteFile(`public/${quote.image}`)
    }

    await Movie.updateOne(
      { quotes: id },
      {
        $pull: {
          quotes: new mongoose.Types.ObjectId(quote.id),
        },
      }
    )

    await Quote.deleteOne(id)

    return res.status(200).json({ deletedQuoteId: req.query.id })
  } catch (error: any) {
    return res.status(422).json({ message: 'Enter valid id' })
  }
}

export const changeQuote = async (
  req: RequestBody<ChangeQuoteReq>,
  res: Response
) => {
  try {
    const { id, quoteEn, quoteGe } = req.body

    if (!validId(id)) {
      return res.status(422).json({ message: 'Enter valid id' })
    }

    const existingQuote = await Quote.findById(id)
      .select('-movie')
      .populate({
        path: 'user',
        select: '_id name image',
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: '_id name image',
        },
      })

    if (!existingQuote) {
      return res.status(404).json({ message: 'Quote not found' })
    }

    if (req.file) {
      if (fs.existsSync(`public/${existingQuote.image}`)) {
        deleteFile(`public/${existingQuote.image}`)
      }
      existingQuote.image = `images/quotes/${req.file?.filename}`
    }

    existingQuote.quoteEn = quoteEn
    existingQuote.quoteGe = quoteGe
    await existingQuote.save()

    return res.status(200).json(existingQuote)
  } catch (error: any) {
    return res.status(409).json({ message: 'This quote is already added' })
  }
}

export const getCertainMovieQuotes = async (req: QueryId, res: Response) => {
  try {
    const { id } = req.query

    if (!validId(id)) {
      return res.status(422).json({ message: 'Enter valid id' })
    }

    const existingMovie = await Movie.findById(id)
      .select('quotes')
      .populate({
        path: 'quotes',
        select: '-movie',
        populate: {
          path: 'comments',
          populate: {
            path: 'user',
            select: '_id name image',
          },
        },
      })
      .populate({
        path: 'quotes',
        populate: {
          path: 'user',
          select: '_id name image',
        },
      })

    if (!existingMovie) {
      return res.status(404).json({ message: 'Movie and quotes not found' })
    }

    const quotesList = existingMovie

    return res.status(200).json(quotesList.quotes.reverse())
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export const likeQuote = async (req: LikeQueryReq, res: Response) => {
  try {
    const { quoteId, userId } = req.query

    if (!validId(quoteId) || !validId(userId)) {
      return res.status(422).json({ message: 'Enter valid id' })
    }

    const id = { _id: new mongoose.Types.ObjectId(quoteId) }

    const quote = await Quote.findOne(id)

    const existingUser = await User.findById(userId)

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' })
    }

    if (quote.likes.includes(new mongoose.Types.ObjectId(userId))) {
      return res.status(409).json({ message: 'User already liked this quote' })
    }

    await quote.update({
      $push: {
        likes: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
    })

    return res.status(200).json({ newLike: userId })
  } catch (error: any) {
    return res.status(422).json({ message: 'Enter valid id' })
  }
}

export const commentOnQuote = async (
  req: RequestBody<CommentReq>,
  res: Response
) => {
  try {
    const { commentText, quoteId, userId } = req.body

    if (!validId(quoteId) || !validId(userId)) {
      return res.status(422).json({ message: 'Enter valid id' })
    }

    const existingQuote = await Quote.findById(quoteId)

    if (!existingQuote) {
      return res.status(404).json({ message: 'Quote not found' })
    }

    const existingUser = await User.findById(userId)

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    await existingQuote.update({
      $push: {
        comments: {
          user: new mongoose.Types.ObjectId(userId),
          commentText,
        },
      },
    })

    const currentComments = await Quote.findById(quoteId).populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'name _id image',
      },
    })

    return res.status(201).json(currentComments?.comments.at(-1))
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export const dislikeQuote = async (req: LikeQueryReq, res: Response) => {
  try {
    const { quoteId, userId } = req.query

    if (!validId(quoteId) || !validId(userId)) {
      return res.status(422).json({ message: 'Enter valid id' })
    }

    const id = { _id: new mongoose.Types.ObjectId(quoteId) }

    const quote = await Quote.findOne(id)

    const existingUser = await User.findById(userId)

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' })
    }

    if (!quote.likes.includes(new mongoose.Types.ObjectId(userId))) {
      return res
        .status(409)
        .json({ message: 'User have not liked this quote yet' })
    }

    await quote.update({
      $pull: {
        likes: new mongoose.Types.ObjectId(userId),
      },
    })

    return res.status(200).json({ userDislike: userId })
  } catch (error: any) {
    return res.status(422).json({ message: 'Enter valid id' })
  }
}

export const getAllQuote = async (req: QuoteRequestQuery, res: Response) => {
  try {
    const totalQuotes = await Quote.find().countDocuments()

    const quotes = await populateQuote(+req.query.page || 1, 3)

    if (quotes.length === 0) {
      return res.status(200).json({
        quotes: [],
      })
    }

    return res.status(200).json({
      quotes,
      paginationInfo: {
        hasMoreQuotes: +req.query.page * 3 < totalQuotes,
      },
    })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export const getNewsFeedPost = async (
  req: NewsFeedRequestQuery,
  res: Response
) => {
  try {
    const { searchValue } = req.query

    if (searchValue) {
      const searchKeyWord = searchValue.slice(1).toLowerCase()
      const newsFeedPosts = await populateQuote()

      if (searchValue.trim()[0] === '@') {
        const matchedMovies = newsFeedPosts.filter((post) =>
          includeChecker(
            post.movie.movieNameEn,
            post.movie.movieNameGe,
            searchKeyWord
          )
        )
        return res.status(200).json(matchedMovies)
      }

      if (searchValue.trim()[0] === '#') {
        const matchedQuotes = newsFeedPosts.filter((post) =>
          includeChecker(post.quoteEn, post.quoteGe, searchKeyWord)
        )
        return res.status(200).json(matchedQuotes)
      }
    }

    return res
      .status(422)
      .json({ message: "Search value should starts with '@' or '#'" })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}
