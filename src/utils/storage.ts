import { multerFilter, multerStorage } from 'utils'
import { Storage } from './types.d'
import { User } from 'models'
import multer from 'multer'

const storage: Storage = (storageName, model, title) => {
  return multer({
    storage: multerStorage(storageName),
    fileFilter: multerFilter(model, title),
  })
}

export const uploadUserImage = storage('users', User, 'user').single('image')

export default storage
