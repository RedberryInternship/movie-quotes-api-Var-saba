export type RegisterMemberReq = {
  password: string
  email: string
  name: string
}

export type EmailActivationReq = {
  email: string
  token: string
}
