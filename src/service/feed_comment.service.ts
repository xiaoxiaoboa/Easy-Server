import { Feed_CommentRequestType, Feed_CommentType } from "feed_comment.type.js"
import Feed_Comment from "../model/feed_comment.model.js"

class Feed_CommentService {
  /* 创建评论 */
  async create_comment(params: Feed_CommentRequestType): Promise<Feed_CommentType> {
    try {
      const res = await Feed_Comment.create({ ...params })
      return res.dataValues
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 删除评论 */
  async delete_comment(comment_id: string) {
    try {
      const res = await Feed_Comment.destroy({
        where: { comment_id }
      })
      return res
    } catch (err) {
      throw Error("", { cause: err })
    }
  }
}

export default new Feed_CommentService()
