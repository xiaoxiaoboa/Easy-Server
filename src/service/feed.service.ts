import Feed_attach from "../model/feed_attach.model.js"
import { feedTypeRestore } from "@/util/conversionFeedType.js"
import Feed from "../model/feed.model.js"
import { FeedType, FeedTypeJSON } from "../types/feed.type.js"
import Feed_Liked from "../model/feed_liked.model.js"
import Feed_Comment from "../model/feed_comment.model.js"
import User from "../model/user.model.js"

class FeedService {
  /* 创建帖子 */
  async CreateFeed(data: any): Promise<any> {
    const newFeed = await Feed.create({ ...data })
    return newFeed.dataValues
  }

  /* 获取所有帖子 */
  async GetAllFeeds() {
    try {
      const allFeeds = await Feed.findAll({
        include: [
          { model: Feed_Liked },
          { model: Feed_Comment },
          { model: Feed_attach },
          { model: User }
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

  /* 点赞 */
  async modifyFeed_like(feed_id: string, feed_liked: string, feed_likedCount: number) {
    const result = await Feed.update(
      { feed_liked, feed_likedCount },
      {
        where: { feed_id }
      }
    )
    return result
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
