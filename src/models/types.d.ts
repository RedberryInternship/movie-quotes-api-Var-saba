export type UserModel = {
  password?: string
  verified: boolean
  image: string
  email: string
  name: string
  notifications: {
    notificationType: string
    new: boolean
    date: string
    user: object
  }[]
  secondaryEmails: { email: string; verified: boolean }[]
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
  movie: { movieNameEn: string; movieNameGe: string }
  quoteEn: string
  quoteGe: string
  likes: object[]
  image: string
  user: object
}
