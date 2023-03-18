import { FeedType } from "feed.type.js"
import { RegisterData, UserType, UserTypeJSON } from "user.type.js"
import { UserFavouritedFeeds } from "user_favourite.type"

/* 反序列化 */
export const toParse = (param: any | any[]): FeedType | FeedType[] => {
  if (Array.isArray(param)) {
    return param.map(item => ({
      ...item,
      feed_liked: { ...item.feed_liked, liked: JSON.parse(item.feed_liked.liked) },
      feed_attach: {
        ...item.feed_attach,
        attach: JSON.parse(item.feed_attach.attach)
      }
    }))
  } else {
    return {
      ...param,
      feed_liked: { ...param.feed_liked, liked: JSON.parse(param.feed_liked.liked) },
      feed_attach: {
        ...param.feed_attach,
        attach: JSON.parse(param.feed_attach.attach)
      }
    }
  }
}

export const favToParse = (param: UserFavouritedFeeds[]) => {
  return param.map(item => ({
    ...item,
    feed: {
      ...item.feed,
      feed_liked: {
        ...item.feed.feed_liked,
        liked: JSON.parse(item.feed.feed_liked.liked)
      },
      feed_attach: {
        ...item.feed.feed_attach,
        attach: JSON.parse(item.feed.feed_attach.attach)
      }
    }
  }))
}
