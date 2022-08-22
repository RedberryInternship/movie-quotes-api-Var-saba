import { Quote } from 'models'

const populateQuote = async (page?: number, quotesPerPage?: number) => {
  const quotes = await Quote.find()
    .sort({ _id: -1 })
    .skip(page && quotesPerPage ? (page - 1) * quotesPerPage : 0)
    .limit(quotesPerPage ? quotesPerPage : 0)
    .populate({
      path: 'user',
      select: 'name image _id',
    })
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: '_id name image',
      },
    })
    .populate({
      path: 'movie',
      select: 'movieNameEn movieNameGe _id image',
    })

  return quotes
}

export default populateQuote
