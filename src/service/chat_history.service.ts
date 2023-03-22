import User from "../model/user.model.js"
import { MessageSaveType, MessageType } from "chat.type.js"
import { Op, QueryTypes } from "sequelize"
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

  /* 查询某一条消息 */
  async queryOneMessage(ch_id: string) {
    try {
      const res = await ChatHistory.findOne({
        where: { ch_id }
      })
      return res?.dataValues
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 查询用户下线后未读的群聊消息 */
  async queryUnreadGroupMessages(to_id: string[], offline: string) {
    const result: any[] = []
    try {
      const res: any[] = await seq.query(
        `(
        SELECT
            chat_history.*,
            t.total 
          FROM
            chat_history
          JOIN (
            SELECT
              user_id,
              to_id,
              MAX( id ) AS id,
              COUNT(*) AS total 
            FROM
              chat_history 
            WHERE
              to_id IN (${to_id.join(",")}) AND createdAt > '${offline}'
            GROUP BY
              user_id,
              to_id 
            ) AS t ON chat_history.id = t.id
          ORDER BY
            chat_history.createdAt DESC
      )`,
        { type: QueryTypes.SELECT }
      )

      if (res.length > 0) {
        /* ===============查群组========================== */

        const group_ids = res.map(i => `'${i.to_id}'`)

        const groups: any[] = await seq.query(
          `(
            SELECT cg.group_id, cg.group_avatar, cg.group_name FROM chat_group as cg WHERE cg.group_id IN (${group_ids.join(
              ","
            )})
            )`,
          { type: QueryTypes.SELECT }
        )
        res.forEach(item => {
          const newData = {
            notice_id: "",
            target_id: "",
            source_id: "",
            type: "1",
            desc: "",
            done: 0,
            message: "",
            total: "",
            source: {},
            createdAt: ""
          }
          ;(newData.notice_id = groups.find(i => i.group_id === item.to_id).group_id),
            (newData.target_id = groups.find(i => i.group_id === item.to_id).group_id),
            (newData.source_id = item.user_id),
            (newData.message = item)
          newData.total = item.total
          newData.createdAt = item.createdAt
          newData.source = {
            user_id: groups.find(i => i.group_id === item.to_id).group_id,
            avatar: groups.find(i => i.group_id === item.to_id).group_avatar,
            nick_name: groups.find(i => i.group_id === item.to_id).group_name
          }
          result.push(newData)
        })
      }

      return result
    } catch (err) {
      throw Error("", { cause: err })
    }
  }
}

export default new ChatHistoryService()
