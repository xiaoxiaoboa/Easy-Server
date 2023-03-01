export interface Feed_CommentType {
  feed_id: string
  feed_userID: string
  comment: string[]
  count: number
}

export type Feed_CommentServiceType = {
  [key in keyof Feed_CommentType]: Feed_CommentType[key] extends number ? number : string
}
