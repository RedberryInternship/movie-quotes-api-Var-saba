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
  image?: string
  budget: number
  userId: string
}
