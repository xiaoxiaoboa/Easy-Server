import { ChatGroupSaveType } from "chat.type.js"
import { Transaction } from "sequelize"
import ChatGroup from "../model/chat_group.model.js"

class ChatGroupService {
  async newChatGroup(params: ChatGroupSaveType, t: Transaction) {
    try {
      const res = await ChatGroup.create({ ...params }, { transaction: t })
      return res
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  
}

export default new ChatGroupService()
