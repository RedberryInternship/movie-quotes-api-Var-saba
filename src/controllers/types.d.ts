export type Email = { email: string }

export type EmailActivationReq = {
  token: string
}

export type RegisterMemberReq = {
  password: string
  email: string
  name: string
}

export type RegisterGoogleMemberReq = {
  email: string
  image: string
  name: string
}

export type ChangePasswordReq = {
  headers: {
    authorization: string
  }
  body: {
    password: string
  }
}

export type ChangeMemberReq = {
  password?: string
  email?: string
  name?: string
  id: string
}

export type NewEmailReq = {
  user: string
  token: string
}

export type ChangeMovieReq = {
  movieDescriptionEn: string
  movieDescriptionGe: string
  movieNameEn: string
  movieNameGe: string
  movieGenres: string[]
  directorEn: string
  directorGe: string
  budget: number
  id: string
}
