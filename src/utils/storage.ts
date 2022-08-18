import { multerFilter, multerStorage } from 'utils'
import { User, Movie, Quote } from 'models'
import { Storage } from './types.d'
import multer from 'multer'

const storage: Storage = (storageName, model, title) => {
  return multer({
    storage: multerStorage(storageName),
    fileFilter: multerFilter(model, title),
  })
}

export const uploadUserImage = storage('users', User, 'user').single('image')

export const uploadMovieImage = storage('movies', Movie, 'movie').single(
  'image'
)
export const uploadQuoteImage = storage('quotes', Quote, 'quote').single(
  'image'
)

export default storage
