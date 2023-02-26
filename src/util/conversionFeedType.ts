import { FeedType, FeedTypeJSON, Feed_attach } from "feed.type.js"

export const feedTypeToJson = (data: FeedType): FeedTypeJSON => {
  return {
    ...data,
    feed_liked: JSON.stringify(data.feed_liked),
    feed_comment: JSON.stringify(data.feed_comment),
    feed_attach: JSON.stringify(data.feed_attach)
  }
}

export const feedTypeRestore = (data: FeedTypeJSON): FeedType => {
  data.feed_liked
  return {
    ...data,
    feed_liked: JSON.parse(data.feed_liked),
    feed_comment: JSON.parse(data.feed_comment),
    feed_attach: JSON.parse(data.feed_attach)
  }
}
