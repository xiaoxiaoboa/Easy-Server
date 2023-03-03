import { FeedType, FeedTypeJSON } from "feed.type.js"
import { RegisterData, UserType, UserTypeJSON } from "user.type.js"

/* 反序列化 */
export const toParse = (param: FeedTypeJSON | FeedTypeJSON[]): FeedType | FeedType[] => {
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

/* 序列化 */
export const toJson = (param: FeedType | FeedType[]): FeedTypeJSON | FeedTypeJSON[] => {
  if (Array.isArray(param)) {
    return param.map(item => ({
      ...item,
      feed_liked: { ...item.feed_liked, liked: JSON.stringify(item.feed_liked.liked) },
      feed_attach: {
        ...item.feed_attach,
        attach: JSON.stringify(item.feed_attach.attach)
      }
    }))
  } else {
    return {
      ...param,
      feed_liked: { ...param.feed_liked, liked: JSON.stringify(param.feed_liked.liked) },
      feed_attach: {
        ...param.feed_attach,
        attach: JSON.stringify(param.feed_attach.attach)
      }
    }
  }
}
