import { Op, QueryTypes } from "sequelize"
import seq from "../db/seq.js"
import Friends from "../model/friends.model.js"
import User from "../model/user.model.js"

class FriendsService {
  /* 创建一行 */
  async createFriend(user_id: string, friend_id: string) {
    try {
      const res = await Friends.create({ user_id, friend_id })
      return res.dataValues
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  async queryFriends(user_id: string) {
    try {
      const res = await seq.query(
        `SELECT friends.user_id,friends.friend_id,friends.createdAt, users.avatar,users.nick_name FROM friends LEFT JOIN users  ON (users.user_id = friends.friend_id) WHERE friends.user_id = '${user_id}'`,
        { raw: true, type: QueryTypes.SELECT }
      )
      return res
    } catch (err) {
      console.log(err)
      throw Error("", { cause: err })
    }
  }
}

export default new FriendsService()
