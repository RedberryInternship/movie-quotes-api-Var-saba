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
  quoteEn: string
  quoteGe: string
  likes: object[]
  movie: object
  image: string
  user: object
}
