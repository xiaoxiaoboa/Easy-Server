import { CommonControllerNEXT, CommonControllerCTX } from "../types/types.js"
import userService from "../service/user.service.js"
import jwt from "jsonwebtoken"
import { secert_key } from "../config/env.js"
import response from "../util/response.js"
import getDefaultImg from "../util/getDefaultImg.js"
import fs from "fs/promises"
import sharp from "sharp"
import {
  AlterationCoverType,
  hashedPwdType,
  LoginData,
  RegisterData,
  UserType
} from "user.type.js"
import {
  full_path,
  dir_resource,
  path_images,
  path_videos
} from "../constant/path.constant.js"

const { UserRegister, UserLogin, QueryUser, UpdateUser } = userService

class UsersController {
  /* 登录 */
  async login(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data: LoginData = ctx.request.body
    try {
      const existedData = await QueryUser({ email: data.email })
      const res = await UserLogin(data, existedData)
      if (res) {
        const { passwd, ...result } = existedData
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
    const data: hashedPwdType = ctx.request.body
    const defaultValue = await getDefaultImg()
    try {
      await fs.mkdir(`${dir_resource}${path_images}${data.user_id}/`, {
        recursive: true
      })
      await fs.mkdir(`${dir_resource}${path_videos}${data.user_id}/`, {
        recursive: true
      })

      const res = await UserRegister({ ...data, ...defaultValue })
      const { passwd, ...result } = res

      ctx.body = { code: 1, message: "注册成功", data: result }
      ctx.body = response(1, "注册成功", result)
    } catch (err) {
      ctx.status = 400
      ctx.body = response(0, "注册出错，请重试", { data, err })
    }
  }

  /* 修改封面 */
  async alterationCover(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const requestData: AlterationCoverType = ctx.request.body
    const filesName: string[] = []

    try {
      for (let item in requestData.base64) {
        /* 获取Base64码 */
        const [base64Head, base64] =
          requestData.base64[item as keyof typeof requestData.base64].split(",")
        /* 将base64转换为Buffer */
        const buf = Buffer.from(base64, "base64")

        const fileName = item + Date.now()
        /* 保存到本地 */
        await sharp(buf).toFile(
          `${dir_resource}${path_images}${requestData.user_id}/${fileName}.webp`
        )
        filesName.push(fileName)
      }

      /* 图片的地址 */
      const path = {
        profile_img: `/images/${requestData.user_id}/${filesName[0]}.webp`,
        profile_blurImg: `/images/${requestData.user_id}/${filesName[1]}.webp`
      }

      /* 更新数据库 */
      await UpdateUser(requestData.user_id, path)

      /* 返回更新后的用户信息 */
      const userRes = await QueryUser({ user_id: requestData.user_id })

      const { passwd, ...result } = userRes
      ctx.body = response(1, "修改成功", result)
    } catch (err) {
      ctx.status = 500
      ctx.body = response(0, "修改失败", err)
    }
  }

  /* 查询用户 */
  async queryUser(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const requestData = ctx.request.body
    console.log(requestData)
    try {
      const { passwd, ...result } = await QueryUser(requestData)

      ctx.body = response(1, "找到用户", result)
    } catch (err) {
      ctx.status = 500
      ctx.body = response(0, "未找到用户", err)
    }
  }

  /* 收藏帖子 */
  async modifyFeed_fav(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data = ctx.request.body
  }
}

export default new UsersController()
