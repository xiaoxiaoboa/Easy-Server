import { Feed_LikedType } from "feed_liked.type.js"
import { Transaction } from "sequelize"
import Feed_Liked from "../model/feed_liked.model.js"

class Feed_LikedService {
  async create_like(feed_id: string, user_id: string) {
    try {
      const res = await Feed_Liked.create({ feed_id, liked: user_id })
      return res
    } catch (err) {
      throw Error("", { cause: err })
    }
  }
  /* 查找liked */
  async queryOneLiked(feed_id: string) {
    try {
      const res = await Feed_Liked.findAll({
        where: { feed_id }
      })
      return res
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 删除 */
  async deleteLiked(feed_id: string, user_id: string) {
    try {
      const res = await Feed_Liked.destroy({
        where: { feed_id, liked: user_id }
      })
    } catch (err) {}
  }
}

export default new Feed_LikedService()
