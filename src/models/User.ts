import { UserModel } from './types.d'
import mongoose from 'mongoose'

const { Schema } = mongoose

const userSchema = new Schema<UserModel>(
  {
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

    notifications: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'user',
        },
        date: {
          type: String,
        },
        new: {
          type: Boolean,
          default: true,
        },
        notificationType: {
          type: String,
        },
        _id: {
          type: String,
        },
      },
    ],

    image: {
      type: String,
    },
  },
  {
    versionKey: false,
  }
)

const User = mongoose.model('user', userSchema)

export default User
