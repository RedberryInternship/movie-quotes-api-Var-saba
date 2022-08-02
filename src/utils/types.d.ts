import { UserModel } from 'models'
import multer from 'multer'

type UserModelType = mongoose.Model<UserModel>

export type StorageFunction = (location: string) => multer.StorageEngine

export type FilterReq = express.Request<Record<string, {}>>

export type Model = UserModelType

export type Callback = (param1: null, param2: boolean, param3?: string) => void

export type File = { mimetype: string }

export type Storage = (
  storageName: string,
  model: Model,
  title: string
) => multer.Multer
