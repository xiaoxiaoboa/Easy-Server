import { feedTypeRestore } from "@/util/conversionFeedType.js"
import Feed from "../model/feed.model.js"
import { FeedType, FeedTypeJSON } from "../types/feed.type.js"

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
  /* 查找一个帖子 */
  async queryOneFeed(feed_id: string): Promise<FeedTypeJSON> {
    const res = await Feed.findOne({
      where: { feed_id }
    })
    return res?.dataValues
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
}

export default new FeedService()
