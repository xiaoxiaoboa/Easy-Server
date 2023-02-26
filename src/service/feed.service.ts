import Feed from "../model/feed.model.js"
import { FeedTypeJSON } from "../types/feed.type.js"

class FeedService {
  /* 创建帖子 */
  async CreateFeed(data: FeedTypeJSON): Promise<FeedTypeJSON> {
    const newFeed = await Feed.create({ ...data })
    return newFeed.dataValues
  }

  /* 获取所有帖子 */
  async GetAllFeeds() {
    const allFeeds = await Feed.findAll({ order: [["createdAt", "DESC"]] })
    return allFeeds
  }
}

export default new FeedService()
