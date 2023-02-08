/* 数据库操作 */

import { Model } from "sequelize"
import { LoginData, RegisterData, UserIsExistType, UserType } from "../types/types.js"
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
  async UserIsExist(email: string): Promise<UserIsExistType> {
    const user: Model<UserType> | null = await User.findOne({
      where: {
        email
      }
    })
    return user ? { isExist: true, data: user } : { isExist: false, data: null }
  }
}

export default new UserService()
