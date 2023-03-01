import { Model } from "sequelize"

import User from "../model/user.model.js"
import Feed from "../model/feed.model.js"
import bcrypt from "bcrypt"
import {
  hashedPwdType,
  LoginData,
  QueryUserParamsType,
  RegisterData,
  UserType,
  UserTypeJSON
} from "user.type.js"

class UserService {
  /* 注册操作 */
  async UserRegister(data: hashedPwdType): Promise<UserType> {
    const newUser = await User.create({ ...data })
    return newUser.dataValues
  }

  /* 登录操作 */
  async UserLogin(data: LoginData, existedData: UserType) {
    const comparePwd = await bcrypt.compare(data.passwd, existedData.passwd)
    return comparePwd
  }

  /* 查询用户 */
  async QueryUser(params: QueryUserParamsType): Promise<UserType> {
    const user = await User.findOne({
      where: {
        ...params
      }
    })
    return user?.dataValues
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
      where: { feed_userID: user_id }
    })
    return res
  }

  /* 收藏帖子 */
  async FavouriteUserFeed() {}
}

export default new UserService()
