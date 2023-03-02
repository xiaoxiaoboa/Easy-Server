import User from "../model/user.model.js"
import Feed from "../model/feed.model.js"
import bcrypt from "bcrypt"
import { hashedPwdType, LoginData, QueryUserParamsType, UserType } from "user.type.js"
import User_Favourite from "../model/user_favourite.model.js"

class UserService {
  /* 注册操作 */
  async userRegister(data: hashedPwdType): Promise<UserType> {
    const newUser = await User.create({ ...data })
    return newUser.dataValues
  }

  /* 登录操作 */
  async userLogin(data: LoginData, existedData: UserType) {
    const comparePwd = await bcrypt.compare(data.passwd, existedData.passwd)
    return comparePwd
  }

  /* 查询用户 */
  async queryUser(params: QueryUserParamsType): Promise<UserType> {
    const user = await User.findOne({
      where: {
        ...params
      }
    })
    return user?.dataValues
  }

  /* 更新用户 */
  async updateUser(user_id: string, params: any) {
    const updataValue = typeof params === "object" ? params : { params }
    const res = await User.update(updataValue, {
      where: { user_id }
    })
    return res
  }

  /* 收藏帖子 */
  async favourite_feed(user_id: string, feed_ids: string) {
    try {
      const res = await User_Favourite.update(
        { feed_ids },
        {
          where: { user_id }
        }
      )
      return res
    } catch (err) {
      throw Error("", { cause: err })
    }
  }
}

export default new UserService()
