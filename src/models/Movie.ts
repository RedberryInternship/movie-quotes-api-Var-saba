import { MovieModel } from './types.d'
import mongoose from 'mongoose'

const { Schema } = mongoose

const movieSchema = new Schema<MovieModel>({
  movie_name_en: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  movie_name_ge: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  budget: {
    type: Number,
    required: true,
  },

  film_genres: [
    {
      type: String,
      required: true,
    },
  ],

  movie_description_en: { type: String, required: true, trim: true },

  movie_description_ge: { type: String, required: true, trim: true },

  director_en: { type: String, required: true, trim: true },

  director_ge: { type: String, required: true, trim: true },
})

const Movie = mongoose.model('movie', movieSchema)

export default Movie
