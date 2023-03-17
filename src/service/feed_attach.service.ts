import { Transaction } from "sequelize"
import Feed_attach from "../model/feed_attach.model.js"
import { Feed_attachServiceType } from "../types/feed_attach.type.js"

class Feed_AttachService {
  async create_attach(params: Feed_attachServiceType, t: Transaction) {
    try {
      const res = await Feed_attach.create({ ...params }, { transaction: t })
      return res
    } catch (err) {
      throw Error("", { cause: `attach${err}` })
    }
  }

  /* 查找attach */
  async queryOneAttach(feed_id: string): Promise<Feed_attachServiceType> {
    try {
      const res = await Feed_attach.findOne({
        where: { feed_id }
      })

      return res?.dataValues
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 查找用户所有的attach */
  async queryAllAttach(user_id: string) {
    try {
      const res = await Feed_attach.findAll({
        where: { feed_userID: user_id },
        attributes: ['attach']
      })
      return res
    } catch (err) {
      throw Error("", { cause: err })
    }
  }
}

export default new Feed_AttachService()
