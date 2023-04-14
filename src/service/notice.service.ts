import seq from "../db/seq.js"
import { Op, QueryTypes } from "sequelize"
import Notice from "../model/notice.model.js"
import { NoticeType } from "../types/notice.type.js"
import User from "../model/user.model.js"
import ChatHistory from "../model/chat_history.model.js"

class NoticeController {
  /* 创建 */
  async createNotice(params: Omit<NoticeType, "createdAt" | "id">) {
    try {
      const res = await Notice.create({ ...params })
      return res.dataValues
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 查询指定id的notice */
  async query(notice_id: string) {
    try {
      const res = await Notice.findOne({ where: { notice_id } })
      return res
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 查询用户全部未读私聊消息 */
  async queryMessageNotice(target_id: string, type: string) {
    try {
      const res: any[] = await seq.query(
        `(SELECT notice.*, t.total
              FROM notice
              JOIN (
                SELECT target_id, source_id, MAX(id) AS id, COUNT(*) AS total
                FROM notice
                WHERE target_id = '${target_id}'AND type = '${type}' AND done= 0
                GROUP BY source_id
              ) AS t
              ON notice.target_id = t.target_id
              AND notice.source_id = t.source_id
              AND notice.id = t.id
              ORDER BY notice.createdAt DESC)`,
        { type: QueryTypes.SELECT }
      )
      if (res.length > 0) {
        /* ===============查用户========================== */
        const user_ids = res.map(item => `'${item.source_id}'`)
        const users: any[] = await seq.query(
          `(
          SELECT  u.user_id,u.nick_name,u.avatar FROM users as u WHERE u.user_id IN (${user_ids.join(
            ","
          )})
        )`,
          { type: QueryTypes.SELECT }
        )
        res.forEach(item => {
          item.source = users.find(i => i.user_id === item.source_id)
        })
        /* ===============查消息========================== */
        /* 找出id */
        const ch_ids = res.map(item => `'${item.desc}'`)
        /* 查询和id对应的message */
        const messages: any[] = await seq.query(
          `(SELECT * FROM chat_history WHERE ch_id IN (${ch_ids.join(",")}))`,
          { type: QueryTypes.SELECT }
        )
        /* 讲message组合到对应的数据中 */
        res.forEach(item => {
          item.message = messages.find(i => i.ch_id === item.desc)
        })
      }
      return res
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 查询好友请求 */
  async queryFriendRequestNotic(target_id: string) {
    try {
      const res = await Notice.findAll({
        where: {
          [Op.and]: [{ target_id }, { type: "0" }, { done: 0 }]
        },
        attributes: ["desc"]
      })
      return res
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 查询点赞评论好友请求的未读通知 */
  async queryNotice(target_id: string) {
    try {
      const res = await Notice.findAll({
        where: {
          target_id,
          source_id: {
            [Op.ne]: target_id
          },
          [Op.or]: [{ type: { [Op.like]: "0%" } }, { type: { [Op.in]: ["2", "3"] } }],
          done: 0
        },
        order: [["createdAt", "DESC"]]
      })
      return res
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 更新 */
  async updateNotice(notice_id: string, done: number) {
    try {
      const res = await Notice.update({ done }, { where: { notice_id } })
      return res
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 已读通知 */
  async updateRelateToSource({
    source_id,
    notice_id
  }: {
    source_id?: string
    notice_id?: string
  }) {
    try {
      if (source_id) {
        await Notice.update(
          { done: 1 },
          {
            where: { source_id }
          }
        )
      } else if (notice_id) {
        await Notice.update(
          { done: 1 },
          {
            where: { notice_id }
          }
        )
      }
    } catch (err) {
      throw Error("", { cause: err })
    }
  }
}

export default new NoticeController()
