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
  password: string
  id: string
}

export type ChangeMemberUsername = {
  username: string
  id: string
}

export type NewEmailReq = {
  userId: string
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

export type ChangeQuoteReq = {
  quoteEn: string
  quoteGe: string
  id: string
}

export type CommentReq = {
  commentText: string
  quoteId: string
  userId: string
}

export type LikeQueryReq = {
  query: {
    quoteId: string
    userId: string
  }
}

export type QuoteRequestQuery = {
  query: {
    page: string
  }
}

export type NewsFeedRequestQuery = {
  query: {
    searchValue: string
  }
}

export type NotificationReq = {
  notificationType: string
  receiverId: string
  senderId: string
}

export type AllNotificationReq = {
  page: string
  id: string
}

export type SecondaryEmailReq = {
  email: string
  id: string
}
