import { Feed_LikedServiceType } from "feed_liked.type.js"
import Feed_Like from "../model/feed_liked.model.js"


class Feed_LikedService {
  async create_like(params: Feed_LikedServiceType) {
    try {
      const res = await Feed_Like.create({ ...params })
      return res
    } catch (err) {
      throw Error("", { cause: err })
    }
  }
}

export default new Feed_LikedService()
