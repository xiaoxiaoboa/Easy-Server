import { ChatGroupSaveType, GroupNumbersSaveType } from "chat.type.js"
import { QueryTypes, Transaction } from "sequelize"
import GroupNumbers from "../model/group_numbers.model.js"
import ChatGroup from "../model/chat_group.model.js"
import seq from "../db/seq.js"

class GroupNumbersService {
  /* 创建群组时，一次性加入的多个成员 */
  async newGroupNumber(group_id: string, numbers_id: string[], t: Transaction) {
    const newData = numbers_id.map(item => ({ group_id, user_id: item }))

    try {
      const res = await GroupNumbers.bulkCreate(newData, { transaction: t })
      return res
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 加入已有的群组 */
  async newNumber() {}

  /* 查询用户加入的群组 */
  async queryJoined(user_id: string): Promise<ChatGroupSaveType[]> {
    try {
      const res = await seq.query(
        `(SELECT g.group_id,g.group_avatar,g.group_desc,g.group_name,g.group_owner FROM group_numbers as gn LEFT JOIN chat_group as g ON (g.group_id = gn.group_id) WHERE gn.user_id = '${user_id}')`,
        { raw: true, type: QueryTypes.SELECT }
      )
      return res as any
    } catch (err) {
      throw Error("", { cause: err })
    }
  }
}

export default new GroupNumbersService()
