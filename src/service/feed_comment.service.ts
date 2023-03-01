import Feed_Comment from "../model/feed_comment.model.js"

interface Feed_CommentServiceType {
  feed_id: string
  feed_userID: string
  feed_comment: string
  feed_commentCount: number
}

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
