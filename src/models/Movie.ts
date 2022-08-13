import { MovieModel } from './types.d'
import mongoose from 'mongoose'

const { Schema } = mongoose

const movieSchema = new Schema<MovieModel>({
  movieNameEn: {
    type: String,
    required: true,
  },

  movieNameGe: {
    type: String,
    required: true,
  },

  userId: {
    type: String,
    required: true,
  },

  budget: {
    type: Number,
    required: true,
  },

  movieGenres: [
    {
      type: String,
      required: true,
    },
  ],

  image: {
    type: String,
  },

  movieDescriptionEn: { type: String, required: true, trim: true },

  movieDescriptionGe: { type: String, required: true, trim: true },

  directorEn: { type: String, required: true, trim: true },

  directorGe: { type: String, required: true, trim: true },

  quotes: [{ type: Schema.Types.ObjectId, ref: 'quote' }],
})

const Movie = mongoose.model('movie', movieSchema)

export default Movie
