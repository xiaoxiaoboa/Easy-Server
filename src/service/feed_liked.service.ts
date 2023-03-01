import { Feed_LikedRequestType } from "feed_liked.type.js"
import Feed_Like from "../model/feed_liked.model.js"

interface Feed_likeType {
  feed_id: string
  feed_userID: string
  feed_liked: string
  feed_likedCount: number
}

class Feed_LikedService {
  async create_like(params: Feed_likeType) {
    try {
      const res = await Feed_Like.create({ ...params })
    } catch (err) {
      throw Error("", { cause: err })
    }
  }
}

export default new Feed_LikedService()
