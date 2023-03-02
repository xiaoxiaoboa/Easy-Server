import { CommonControllerCTX, CommonControllerNEXT } from "types.js"
import Feed_Liked from "../service/feed_liked.service.js"
import Feed from "../service/feed.service.js"

const { queryOneFeed } = Feed

class Feed_LikedController {
  async like(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data = ctx.request.body
    const feed = await queryOneFeed(data.feed_id)

    // const res = await feed_like("")
  }
}
