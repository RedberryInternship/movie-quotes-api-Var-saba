export type RegisterMemberReq = {
  password: string
  email: string
  name: string
}

export type EmailActivationReq = {
  token: string
}

export type RegisterGoogleMemberReq = {
  email: string
  image: string
  name: string
}

export type Email = { email: string }
