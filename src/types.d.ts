type JsonType = Send<{ message: string }, this>

export type Next = () => void

export interface RequestBody<ReqBody> extends Express.Request {
  body: ReqBody
}

export interface Response extends Express.Response {
  status: (number: number) => { json: JsonType }
  json: JsonType
}
