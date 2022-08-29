import mongoose from 'mongoose'

const validId = (id: string) => {
  return mongoose.isValidObjectId(id)
}

export default validId
