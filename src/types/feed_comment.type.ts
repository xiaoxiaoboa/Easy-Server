export interface Feed_CommentType {
  feed_id: string
  user_id: string
  comment_id: string
  comment: string
  createdAt: string
}

export type Feed_CommentRequestType = Omit<Feed_CommentType, "createdAt">

export interface Feed_CommentResponseType extends Feed_CommentRequestType {
  nick_name: string
  avatar:string
}