import { InComplateFavouriteType } from "user_favourite.type.js"
import { Feed_attachType, Feed_attachServiceType } from "./feed_attach.type.js"
import { Feed_CommentType, Feed_CommentServiceType } from "./feed_comment.type.js"
import { Feed_LikedServiceType, Feed_LikedType } from "./feed_liked.type.js"
import { UserType } from "./user.type"

export interface Feed {
  feed_id: string
  feed_userID: string
  feed_text: string
  createdAt: string
  updatedAt: string
}

export interface FeedType extends Feed {
  feed_liked: Feed_LikedType
  feed_comment: Feed_CommentType
  feed_attach: Feed_attachType
  user: Pick<UserType, "user_id" | "nick_name" | "avatar">
  user_favourites: InComplateFavouriteType[]
}

export interface FeedTypeJSON extends Feed {
  feed_liked: Feed_LikedServiceType
  feed_comment: Feed_CommentServiceType
  feed_attach: Feed_attachServiceType
  user: Pick<UserType, "user_id" | "nick_name" | "avatar">
  user_favourites: InComplateFavouriteType[]
}
