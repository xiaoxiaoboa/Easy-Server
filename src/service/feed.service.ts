import Feed from "../model/feed.model.js"
import { FeedType, FeedTypeJSON } from "../types/feed.type.js"

class FeedService {
  async CreateFeed(data: FeedTypeJSON): Promise<FeedTypeJSON> {
    const newFeed = await Feed.create({ ...data })
    return newFeed.dataValues
  }
}

export default new FeedService()
