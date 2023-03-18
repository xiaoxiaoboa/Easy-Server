import { InComplateFavouriteType } from "user_favourite.type.js"
import { Feed_attachType } from "./feed_attach.type.js"
import { Feed_CommentType } from "./feed_comment.type.js"
import { Feed_LikedType } from "./feed_liked.type.js"
import { UserType } from "./user.type"

export interface Feed {
  feed_id: string
  feed_userID: string
  feed_text: string
  createdAt: string
  updatedAt: string
}

export interface FeedType extends Feed {
  comment_count: number
  feed_liked: Feed_LikedType
  feed_attach: Feed_attachType
  user: Pick<UserType, "user_id" | "nick_name" | "avatar">
  user_favourites: InComplateFavouriteType[]
}

export interface QueryUserFeedsType {
  user_id: string
  limit: number
  offset: number
}
