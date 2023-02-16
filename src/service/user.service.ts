/* 数据库操作 */

import { Model } from "sequelize"
import {
  LoginData,
  QueryUserParamsType,
  RegisterData,
  UserIsExistType,
  UserType
} from "../types/types.js"
import User from "../model/user.model.js"
import bcrypt from "bcrypt"

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

    /* 将时间改为本地时间再返回给前端 */
    if (user) {
      const newCreateDate = new Date((user.dataValues as UserType).createdAt)
      const newUpdateDate = new Date((user.dataValues as UserType).updatedAt)

      user.dataValues = {
        ...user?.dataValues,
        createdAt: newCreateDate.toLocaleString(),
        updatedAt: newUpdateDate.toLocaleString()
      }
    }

    return user
  }

  async updateUser(user_id: string, params: any) {
    const updataValue = typeof params === "object" ? params : { params }
    const res = await User.update(updataValue, {
      where: { user_id }
    })
    return res
  }
}

export default new UserService()
