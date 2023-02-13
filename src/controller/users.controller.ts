import {
  CommonControllerNEXT,
  CommonControllerCTX,
  RegisterData,
  LoginData
} from "../types/types.js"
import userService from "../service/user.service.js"
import jwt from "jsonwebtoken"
import { secert_key } from "../config/env.js"
import response from "../util/response.js"
import getDefaultImg from "../util/getDefaultImg.js"

const { UserRegister, UserLogin, UserIsExist } = userService

class UsersController {
  /* 登录 */
  async login(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data: LoginData = ctx.request.body
    try {
      const existedData = await UserIsExist(data.email)
      const res = await UserLogin(data, existedData.data?.dataValues!)
      if (res) {
        const { passwd, ...result } = existedData.data?.dataValues!
        const token = jwt.sign(result, secert_key!)
        ctx.body = response(1, "登录成功", { result, token })
      } else {
        ctx.body = response(0, "登录失败，密码错误", data)
      }
    } catch (err) {
      ctx.status = 400
      ctx.body = response(0, "登录出错，请重试", { data, err })
    }
  }

  /* 注册 */
  async register(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data: RegisterData = ctx.request.body
    const defaultValue = await getDefaultImg()
    try {
      const res = await UserRegister({ ...data, ...defaultValue })
      const { passwd, ...result } = res
      ctx.body = { code: 1, message: "注册成功", data: result }
      ctx.body = response(1, "注册成功", result)
    } catch (err) {
      ctx.status = 400
      ctx.body = response(0, "注册出错，请重试", { data, err })
    }
  }
}

export default new UsersController()
