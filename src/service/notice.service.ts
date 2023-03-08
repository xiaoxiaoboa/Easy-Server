import { Op } from "sequelize"
import Notice from "../model/notice.model.js"
import { NoticeType } from "../types/notice.type.js"

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

  /* 查询 */
  async queryNotice(user_id: string) {
    try {
      const res = await Notice.findAll({
        where: {
          [Op.and]: [{ user_id: user_id }, { done: 0 }]
        }
      })
      return res
    } catch (err) {
      throw Error("", { cause: err })
    }
  }
  /* 更新 */
  async updateNotice(notice_id: string, done: boolean, type?: string) {
    try {
      const res = await Notice.update({ done, type }, { where: { notice_id } })
      return res
    } catch (err) {
      
      throw Error("", { cause: err })
    }
  }
}

export default new NoticeController()
