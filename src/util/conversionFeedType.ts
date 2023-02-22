import { FeedType,FeedTypeJSON } from "feed.type.js"
import { Json } from "sequelize/types/utils"

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
    feed_liked: JSON.parse(data.feed_liked) as string[],
    feed_comment: JSON.parse(data.feed_comment) as string[],
    feed_attach: JSON.parse(data.feed_attach) as string[]
  }
}
