export type RegisterMemberReq = {
  password: string
  email: string
  name: string
}

export type EmailActivationReq = {
  email: string
  token: string
}

export type RegisterGoogleMemberReq = {
  email: string
  image: string
  name: string
}
