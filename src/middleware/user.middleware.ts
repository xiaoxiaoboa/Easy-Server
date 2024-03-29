import userService from "../service/user.service.js"
import { CommonControllerNEXT, CommonControllerCTX } from "../types/types.js"
import bcrypt from "bcrypt"
import { nanoid } from "nanoid"
import response from "../util/response.js"
import { LoginData, RegisterData } from "user.type.js"

const { queryUser } = userService

/* 登录验证 */
export const loginIsExistVerify = async (
  ctx: CommonControllerCTX,
  next: CommonControllerNEXT
) => {
  const data: LoginData = ctx.request.body
  try {
    const existedData = await queryUser({ email: data.email })
    if (!existedData) {
      throw Error("")
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = response(0, "用户不存在", { data, err })
    return
  }
  await next()
}

/* 注册验证 */
export const registerIsExistVerify = async (
  ctx: CommonControllerCTX,
  next: CommonControllerNEXT
) => {
  const data: LoginData = ctx.request.body
  try {
    const existedData = await queryUser({ email: data.email })
    if (existedData) {
      ctx.body = response(0, "用户已存在", data)
      return
    }
  } catch (err) {
    ctx.body = response(0, "验证账号出错，请重试", { data, err })
    return
  }
  await next()
}

/* hash密码 */
export const bcryptPwd = async (ctx: CommonControllerCTX, next: CommonControllerNEXT) => {
  const data: RegisterData = ctx.request.body
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPwd = await bcrypt.hash(data.passwd, salt)
    const newData = { ...data, user_id: nanoid(11), passwd: hashedPwd }
    ctx.request.body = newData
  } catch (err) {
    ctx.status = 500
    ctx.body = response(0, "密码加密出错，请重试", err)
    return
  }
  await next()
}
