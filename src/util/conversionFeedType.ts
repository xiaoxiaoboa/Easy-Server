import { FeedType, FeedTypeJSON } from "feed.type.js"
import { RegisterData, UserType, UserTypeJSON } from "user.type.js"

export const feedTypeToJson = (data: any) => {
  // return {
  //   ...data,
  //   feed_liked: JSON.stringify(data.feed_liked),
  //   feed_comment: JSON.stringify(data.feed_comment),
  //   feed_attach: JSON.stringify(data.feed_attach)
  // }
}

export const feedTypeRestore = (data: any) => {
  // return {
  //   ...data,
  //   feed_liked: JSON.parse(data.feed_liked),
  //   feed_comment: JSON.parse(data.feed_comment),
  //   feed_attach: JSON.parse(data.feed_attach)
  // }
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

/* 反序列化 */
export const toParse = (param: FeedTypeJSON | FeedTypeJSON[]): FeedType | FeedType[] => {
  if (Array.isArray(param)) {
    return param.map(item => ({
      ...item,
      feed_liked: { ...item.feed_liked, liked: JSON.parse(item.feed_liked.liked) },
      feed_attach: {
        ...item.feed_attach,
        attach: JSON.parse(item.feed_attach.attach)
      },
      feed_comment: {
        ...item.feed_comment,
        comment: JSON.parse(item.feed_comment.comment)
      }
    }))
  } else {
    return {
      ...param,
      feed_liked: { ...param.feed_liked, liked: JSON.parse(param.feed_liked.liked) },
      feed_attach: {
        ...param.feed_attach,
        attach: JSON.parse(param.feed_attach.attach)
      },
      feed_comment: {
        ...param.feed_comment,
        comment: JSON.parse(param.feed_comment.comment)
      }
    }
  }
}

export const toJson = (param: FeedType | FeedType[]): FeedTypeJSON | FeedTypeJSON[] => {
  if (Array.isArray(param)) {
    return param.map(item => ({
      ...item,
      feed_liked: { ...item.feed_liked, liked: JSON.stringify(item.feed_liked.liked) },
      feed_attach: {
        ...item.feed_attach,
        attach: JSON.stringify(item.feed_attach.attach)
      },
      feed_comment: {
        ...item.feed_comment,
        comment: JSON.stringify(item.feed_comment.comment)
      }
    }))
  } else {
    return {
      ...param,
      feed_liked: { ...param.feed_liked, liked: JSON.stringify(param.feed_liked.liked) },
      feed_attach: {
        ...param.feed_attach,
        attach: JSON.stringify(param.feed_attach.attach)
      },
      feed_comment: {
        ...param.feed_comment,
        comment: JSON.stringify(param.feed_comment.comment)
      }
    }
  }
}
