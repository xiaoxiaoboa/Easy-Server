import feedService from "../service/feed.service.js"
import { CommonControllerCTX, CommonControllerNEXT } from "../types/types.js"
import { Feed, FeedType, FeedTypeJSON } from "../types/feed.type.js"
import response from "../util/response.js"
import { feedTypeToJson, feedTypeRestore } from "../util/conversionFeedType.js"
import { nanoid } from "nanoid"

const { CreateFeed } = feedService

class FeedController {
  async publish(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data = ctx.request.body
    const user = ctx.state.user

    const initData = {
      feed_id: nanoid(12),
      feed_text: "",
      feed_attach: [],
      feed_liked: [],
      feed_likedCount: 0,
      feed_comment: [],
      feed_commentCount: 0
    }

    const newFeed = feedTypeToJson({ ...initData, ...data })

    try {
      const res = await CreateFeed(newFeed)
      const resData: Feed = {
        feed_user: user,
        feed: feedTypeRestore(res)
      }

      ctx.body = response(1, "已成功创建瞬间", resData)
    } catch (err) {
      ctx.status = 500
      ctx.body = response(0, "创建瞬间失败", err)
    }
  }
}

export default new FeedController()
