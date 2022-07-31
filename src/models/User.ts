import { UserModel } from './types.d'
import mongoose from 'mongoose'

const { Schema } = mongoose

const userSchema = new Schema<UserModel>({
  name: {
    type: String,
    lowercase: true,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  verified: {
    type: Boolean,
    default: false,
  },

  password: { type: String },

  image: {
    type: String,
  },
})

const User = mongoose.model('user', userSchema)

export default User
