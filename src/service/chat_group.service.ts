import { ChatGroupSaveType } from "chat.type.js"
import { Transaction } from "sequelize"
import ChatGroup from "../model/chat_group.model.js"

class ChatGroupService {
  /* 创建 */
  async newChatGroup(params: ChatGroupSaveType, t: Transaction) {
    try {
      const res = await ChatGroup.create({ ...params }, { transaction: t })
      return res
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 更新 */
  async update(group_id: string, params: { [key: string]: string }) {
    try {
      const res = await ChatGroup.update(
        { ...params },
        {
          where: { group_id }
        }
      )
      return res
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 查询 */
  async queryGroup(group_id: string) {
    try {
      const res = await ChatGroup.findOne({
        where: { group_id }
      })
      return res?.dataValues
    } catch (err) {
      throw Error("", { cause: err })
    }
  }
}

export default new ChatGroupService()
