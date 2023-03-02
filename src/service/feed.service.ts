import Feed_attach from "../model/feed_attach.model.js"
import Feed from "../model/feed.model.js"
import Feed_Liked from "../model/feed_liked.model.js"
import Feed_Comment from "../model/feed_comment.model.js"
import User from "../model/user.model.js"
import { Feed_attachServiceType } from "../types/feed_attach.type.js"
import { Feed_LikedServiceType } from "../types/feed_liked.type.js"
import User_Favourite from "../model/user_favourite.model.js"
import seq from "../db/seq.js"
import { QueryUserFeedsType } from "feed.type.js"

class FeedService {
  /* 创建帖子 */
  async createFeed(data: any) {
    try {
      const newFeed = await Feed.create({ ...data })
      return newFeed.dataValues
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 获取所有帖子 */
  async getAllFeeds(limit: number, offset: number) {
    try {
      const allFeeds = await Feed.findAll({
        limit: limit,
        offset: offset,
        include: [
          Feed_Liked,
          Feed_Comment,
          Feed_attach,
          { model: User_Favourite, attributes: ["user_id", "createdAt"] },
          { model: User, attributes: ["user_id", "nick_name", "avatar"] }
        ],
        order: [["createdAt", "DESC"]]
      })

      return JSON.stringify(allFeeds)
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 查找一个帖子 */
  async queryOneFeed(feed_id: string): Promise<any> {
    try {
      const res = await Feed.findOne({
        where: { feed_id }
      })
      return res?.dataValues
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 查询用户帖子 */
  async queryUserFeeds(params: QueryUserFeedsType) {
    try {
      const allFeeds = await Feed.findAll({
        limit: params.limit,
        offset: params.offset,
        where: { feed_userID: params.user_id },
        include: [
          Feed_Liked,
          Feed_Comment,
          Feed_attach,
          { model: User_Favourite, attributes: ["user_id", "createdAt"] },
          { model: User, attributes: ["user_id", "nick_name", "avatar"] }
        ],
        order: [["createdAt", "DESC"]]
      })

      return JSON.stringify(allFeeds)
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 点赞 */
  async modifyFeed_like(params: { feed_id: string; liked: string; count: number }) {
    try {
      const result = await Feed_Liked.update(
        { ...params },
        {
          where: { feed_id: params.feed_id }
        }
      )
      return result
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 删除帖子 */
  async modifyFeed_delete(feed_id: string): Promise<number> {
    try {
      const res = await Feed.destroy({
        where: { feed_id }
      })
      return res
    } catch (err) {
      throw Error("", { cause: err })
    }
  }
}

export default new FeedService()
