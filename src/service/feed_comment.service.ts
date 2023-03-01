import { Feed_CommentServiceType } from "feed_comment.type.js"
import Feed_Comment from "../model/feed_comment.model.js"

class Feed_CommentService {
  async create_comment(params: Feed_CommentServiceType) {
    try {
      const res = await Feed_Comment.create({ ...params })
      return res
    } catch (err) {
      throw Error("", { cause: err })
    }
  }
}

export default new Feed_CommentService()
