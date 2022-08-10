import { StorageFunction, FilterReq, Callback, Model, File } from './types.d'
import { deleteFile } from 'utils'
import multer from 'multer'
import fs from 'fs'

export const multerStorage: StorageFunction = (location: string) => {
  const storage = multer.diskStorage({
    destination: (_req, _res, cb) => {
      cb(null, `public/images/${location}`)
    },

    filename: (_req, file, cb) => {
      const ext = file.mimetype.split('/')[1]
      cb(null, `${new Date().toISOString()}.${ext}`)
    },
  })

  return storage
}

export const multerFilter = (model: Model, text: string) => {
  const filter = async (req: FilterReq, file: File, cb: Callback) => {
    try {
      if (req.body.id) {
        if (req.body.id.length !== 24) {
          req.body.fileValidationError = 'id should contain 24 characters'
          return cb(null, false, req.body.fileValidationError)
        }

        const currentDoc = await model.findById(req.body.id)

        if (!currentDoc) {
          req.body.fileValidationError = `${text} not found`
          return cb(null, false, req.body.fileValidationError)
        }

        if (file.mimetype.startsWith('image') && currentDoc) {
          if (
            fs.existsSync(`public/${currentDoc?.image}`) &&
            currentDoc.image
          ) {
            deleteFile(`public/${currentDoc?.image}`)
          }

          cb(null, true)
        }
      }

      if (!file.mimetype.startsWith('image')) {
        req.body.fileValidationError = 'Upload only image'
        return cb(null, false, req.body.fileValidationError)
      }

      cb(null, true)
    } catch (error: any) {
      return (req.body.fileValidationError = 'Image upload failed')
    }
  }

  return filter
}
