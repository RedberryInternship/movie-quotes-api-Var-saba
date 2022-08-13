export type UserModel = {
  password?: string
  verified: boolean
  image: string
  email: string
  name: string
}

export type MovieModel = {
  movieDescriptionEn: string
  movieDescriptionGe: string
  movieNameEn: string
  movieNameGe: string
  movieGenres: string[]
  directorEn: string
  directorGe: string
  quotes: object[]
  image?: string
  budget: number
  userId: string
}

export type QuoteModel = {
  comments: { user: object; commentText: string }[]
  quoteNameEn: string
  quoteNameGe: string
  movieId: string
  likes: number
  image: string
  user: object
  user: object
}
