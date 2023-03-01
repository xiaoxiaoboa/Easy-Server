import Feed_attach from "../model/feed_attach.model.js"

interface Feed_attachServiceType {
  feed_id: string
  feed_userID: string
  feed_attach: string
  feed_attachCount: number
}

class Feed_CommentService {
  async create_attach(params: Feed_attachServiceType) {
    try {
      const res = await Feed_attach.create({ ...params })
      return res
    } catch (err) {
      throw Error("", { cause: err })
    }
  }
}

export default new Feed_CommentService()
