/* 数据库操作 */

import { Model } from "sequelize"

import User from "../model/user.model.js"
import Feed from "../model/feed.model.js"
import bcrypt from "bcrypt"
import { LoginData, QueryUserParamsType, RegisterData, UserType } from "user.type.js"
import { FeedType } from "../types/feed.type.js"

class UserService {
  /* 注册操作 */
  async UserRegister(data: RegisterData): Promise<UserType> {
    const newUser = await User.create({ ...data })
    return newUser.dataValues
  }

  /* 登录操作 */
  async UserLogin(data: LoginData, existedData: UserType) {
    const comparePwd = await bcrypt.compare(data.passwd, existedData.passwd)
    return comparePwd
  }

  /* 查询用户 */
  async QueryUser(params: QueryUserParamsType) {
    const user = await User.findOne({
      where: {
        ...params
      }
    })

    return user
  }

  /* 更新用户 */
  async UpdateUser(user_id: string, params: any) {
    const updataValue = typeof params === "object" ? params : { params }
    const res = await User.update(updataValue, {
      where: { user_id }
    })
    return res
  }

  /* 查询用户帖子 */
  async QueryUserFeeds(user_id: string) {
    const res = await Feed.findAll({
      where: { user_id }
    })
    return res
  }
}

export default new UserService()
