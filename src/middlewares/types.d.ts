export type ValidateResultReq = { body: {} }

export type AuthBody = {
  cookies: {
    token: string
  }
  url: string
  headers: {
    authorization: string
  }
}
