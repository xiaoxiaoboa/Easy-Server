import {
  CommonControllerNEXT,
  CommonControllerCTX,
  RegisterData,
  LoginData,
  UserType,
  AlterationCoverType
} from "../types/types.js"
import userService from "../service/user.service.js"
import jwt from "jsonwebtoken"
import { secert_key } from "../config/env.js"
import response from "../util/response.js"
import getDefaultImg from "../util/getDefaultImg.js"
import fs from "fs/promises"
import sharp from "sharp"

const { UserRegister, UserLogin, QueryUser, updateUser } = userService

class UsersController {
  /* 登录 */
  async login(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data: LoginData = ctx.request.body
    try {
      const existedData = await QueryUser({ email: data.email })
      const res = await UserLogin(data, existedData?.dataValues!)
      if (res) {
        const { passwd, ...result } = existedData?.dataValues!
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

      await fs.mkdir(`${process.cwd()}/data/resource/images/${result.user_id}/`, {
        recursive: true
      })

      ctx.body = { code: 1, message: "注册成功", data: result }
      ctx.body = response(1, "注册成功", result)
    } catch (err) {
      ctx.status = 400
      ctx.body = response(0, "注册出错，请重试", { data, err })
    }
  }

  async alterationCover(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const requestData: AlterationCoverType = ctx.request.body
    const keys = Object.keys(requestData.base64)

    try {
      for (let item in requestData.base64) {
        /* 获取Base64码 */
        const [base64Head, base64] =
          requestData.base64[item as keyof typeof requestData.base64].split(",")
        /* 将base64转换为Buffer */
        const buf = Buffer.from(base64, "base64")

        /* 保存到本地 */
        await sharp(buf).toFile(
          `${process.cwd()}/data/resource/images/${requestData.user_id}/${item}.webp`
        )
      }

      /* 图片的地址 */
      const path = {
        profile_img: `/images/${requestData.user_id}/${keys[0]}.webp`,
        profile_blurImg: `/images/${requestData.user_id}/${keys[1]}.webp`
      }

      /* 更新数据库 */
      await updateUser(requestData.user_id, path)

      /* 返回更新后的用户信息 */
      const userRes = await QueryUser({ user_id: requestData.user_id })

      

      const { passwd, ...result } = userRes?.dataValues
      ctx.body = response(1, "修改成功", result)
    } catch (err) {
      ctx.status = 500
      ctx.body = response(0, "修改失败", err)
    }
  }
}

export default new UsersController()
