import Feed_attach from "../model/feed_attach.model.js"
import { Feed_attachServiceType } from "../types/feed_attach.type.js"

class Feed_CommentService {
  async create_attach(params: Feed_attachServiceType) {
    try {
      const res = await Feed_attach.create({ ...params })
      return res
    } catch (err) {
      throw Error("", { cause: `attach${err}` })
    }
  }
}

export default new Feed_CommentService()
