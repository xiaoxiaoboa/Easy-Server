import { PrivateMessageSaveType, PrivateMessageType } from "chat.type.js"
import { Op } from "sequelize"
import PrivateChat from "../model/chat_private.model.js"

class PrivateChatService {
  /* 创建一条新消息 */
  async newPrivateMessage(params: PrivateMessageSaveType) {
    try {
      const res = await PrivateChat.create({ ...params })
      return res
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 查询消息 */
  async queryPrivateMessage(user_id: string, to_id: string) {
    try {
      const res = await PrivateChat.findAll({
        where: {
          [Op.or]: [
            { user_id: user_id, to_id: to_id },

            { user_id: to_id, to_id: user_id }
          ]
        }
      })
      return res
    } catch (err) {
      throw Error("", { cause: err })
    }
  }
}

export default new PrivateChatService()
