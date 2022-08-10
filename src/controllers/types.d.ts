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
  userId: string
  token: string
}

export type ChangeMovieReq = {
  movie_description_en: string
  movie_description_ge: string
  movie_name_en: string
  movie_name_ge: string
  film_genres: string[]
  director_en: string
  director_ge: string
  budget: number
  id: string
}
