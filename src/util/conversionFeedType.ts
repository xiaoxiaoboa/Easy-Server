import { FeedType, FeedTypeJSON, Feed_attach } from "feed.type.js"
import { RegisterData, UserType, UserTypeJSON } from "user.type"

export const feedTypeToJson = (data: FeedType): FeedTypeJSON => {
  return {
    ...data,
    feed_liked: JSON.stringify(data.feed_liked),
    feed_comment: JSON.stringify(data.feed_comment),
    feed_attach: JSON.stringify(data.feed_attach)
  }
}

export const feedTypeRestore = (data: FeedTypeJSON): FeedType => {
  return {
    ...data,
    feed_liked: JSON.parse(data.feed_liked),
    feed_comment: JSON.parse(data.feed_comment),
    feed_attach: JSON.parse(data.feed_attach)
  }
}

export const userTypeToJson = (data: RegisterData): UserTypeJSON => {
  return {
    ...data,
    favourite_feeds: JSON.stringify(data.favourite_feeds)
  }
}
export const userTypeRestore = (data: UserTypeJSON): RegisterData => {
  return {
    ...data,
    favourite_feeds: JSON.parse(data.favourite_feeds)
  }
}
