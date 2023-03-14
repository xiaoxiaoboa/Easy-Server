import User from "../model/user.model.js"
import { MessageSaveType, MessageType } from "chat.type.js"
import { Op } from "sequelize"
import ChatHistory from "../model/chat_history.model.js"
import seq from "../db/seq.js"

class ChatHistoryService {
  /* 创建一条新消息 */
  async newMessage(params: MessageSaveType) {
    try {
      const res = await ChatHistory.create({ ...params })
      return res
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 查询私聊消息 */
  async queryPrivateMessages(user_id: string, to_id: string) {
    try {
      const res = await ChatHistory.findAll({
        where: {
          [Op.or]: [
            { user_id: user_id, to_id: to_id },

            { user_id: to_id, to_id: user_id }
          ]
        },
        include: [{ model: User, attributes: ["nick_name", "avatar"] }],
        order: [["createdAt", "ASC"]]
      })
      return res
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 查询群组消息 */
  async queryGroupMessages(to_id: string) {
    try {
      const res = await ChatHistory.findAll({
        where: { to_id },
        include: [{ model: User, attributes: ["nick_name", "avatar"] }],
        order: [["createdAt", "ASC"]]
      })
      return res
    } catch (err) {
      throw Error("", { cause: err })
    }
  }
}

export default new ChatHistoryService()
