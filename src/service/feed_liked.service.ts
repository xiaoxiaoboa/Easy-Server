import { Feed_LikedServiceType } from "feed_liked.type.js"
import { Transaction } from "sequelize"
import Feed_Liked from "../model/feed_liked.model.js"

class Feed_LikedService {
  async create_like(params: Feed_LikedServiceType, t: Transaction) {
    try {
      const res = await Feed_Liked.create({ ...params }, { transaction: t })
      return res
    } catch (err) {
      throw Error("", { cause: err })
    }
  }
  /* 查找liked */
  async queryOneLiked(feed_id: string): Promise<Feed_LikedServiceType> {
    try {
      const res = await Feed_Liked.findOne({
        where: { feed_id }
      })
      return res?.dataValues
    } catch (err) {
      throw Error("", { cause: err })
    }
  }
}

export default new Feed_LikedService()
