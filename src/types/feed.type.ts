import User from "@/model/user.model"
import { UserType } from "user.type"

export interface Feed {
  feed: FeedType
  feed_user: UserType
}

export interface FeedType {
  feed_id: string
  feed_text: string
  feed_attach: string[]
  feed_liked: string[]
  feed_likedCount: number
  feed_comment: string[]
  feed_commentCount: number
  createdAt: string
  updatedAt: string
}

/* 将其中feed_liked,feed_attach和feed_comment的类型变为string并生成新类型 */
export type FeedTypeJSON = {
  [key in keyof FeedType]: FeedType[key] extends string[] ? string : FeedType[key]
}
