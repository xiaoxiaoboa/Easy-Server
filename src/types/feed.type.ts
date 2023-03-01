import { Feed_attachType, Feed_attachServiceType } from "./feed_attach.type.js"
import { Feed_CommentType, Feed_CommentServiceType } from "./feed_comment.type.js"
import { Feed_LikedServiceType, Feed_LikedType } from "./feed_liked.type.js"
import { UserType } from "./user.type"

export interface Feed {
  feed_id: string
  feed_userID: string
  feed_text: string
  user: UserType
  createdAt: string
  updatedAt: string
}

export interface FeedType extends Feed {
  feed_liked: Feed_LikedType
  feed_comment: Feed_CommentType
  feed_attach: Feed_attachType
}

export interface FeedTypeJSON extends Feed {
  feed_liked: Feed_LikedServiceType
  feed_comment: Feed_CommentServiceType
  feed_attach: Feed_attachServiceType
}
