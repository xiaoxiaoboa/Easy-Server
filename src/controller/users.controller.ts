import { CommonControllerNEXT, CommonControllerCTX } from "../types/types.js"
import userService from "../service/user.service.js"
import jwt from "jsonwebtoken"
import { secert_key } from "../config/env.js"
import response from "../util/response.js"
import getDefaultImg from "../util/getDefaultImg.js"
import fs from "fs/promises"
import sharp from "sharp"
import { hashedPwdType, LoginData, UserType } from "user.type.js"
import {
  dir_resource,
  dir_upload,
  path_images,
  path_videos
} from "../constant/path.constant.js"
import UserFavouriteService from "../service/user_favourite.service.js"
import seq from "../db/seq.js"
import FriendsService from "../service/friends.service.js"
import { File } from "../types/upload.type.js"
import { upload } from "../util/upload.js"
import filesCheck from "../util/filesCheck.js"
import FriendService from "../service/friends.service.js"

const { userRegister, userLogin, queryUser, updateUser } = userService
const { queryFavourite, deleteFavourite, newFav } = UserFavouriteService
const { createFriend, queryFriends, deleteFriend } = FriendsService

class UsersController {
  /* 登录 */
  async login(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data: LoginData = ctx.request.body
    try {
      const existedData = await queryUser({ email: data.email })
      const res = await userLogin(data, existedData)
      if (res) {
        const { passwd, ...result } = existedData
        const token = jwt.sign(result, secert_key!)

        ctx.body = response(1, "登录成功", { result, token })
      } else {
        ctx.body = response(0, "登录失败，密码错误", data)
      }
    } catch (err) {
      ctx.status = 500
      ctx.body = response(0, "登录出错，请重试", { data, err })
    }
  }

  /* 注册 */
  async register(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data: hashedPwdType = ctx.request.body
    const defaultValue = await getDefaultImg()

    try {
      const res = await userRegister({ ...data, ...defaultValue })
      const { passwd, ...result } = res

      await fs.mkdir(`${dir_resource}${path_images}${data.user_id}/`, {
        recursive: true
      })
      await fs.mkdir(`${dir_resource}${path_videos}${data.user_id}/`, {
        recursive: true
      })

      ctx.body = response(1, "注册成功", result)
    } catch (err) {
      ctx.status = 400
      ctx.body = response(0, "注册出错，请重试", { data, err: `${err}` })
    }
  }

  /* 修改封面 */
  async alterationCover(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data = ctx.request.body
    const file = ctx.request.files
    const newFileName = (file?.background as File).newFilename
    const newData = JSON.parse(data.data)
    try {
      /* 图片的地址 */
      const path = {
        profile_img: `/images/${newData.user_id}/${newFileName}`,
        profile_blurImg: `/images/${newData.user_id}/${newData.blur.fileName}`
      }

      /* 更新数据库 */
      await updateUser(newData.user_id, path)

      /* 返回更新后的用户信息 */
      const userRes = await queryUser({ user_id: newData.user_id })

      /* 移动文件到用户文件夹 */
      const base64 = newData.blur.base64.split(",")[1]
      const buf = Buffer.from(base64, "base64")
      await sharp(buf).toFile(
        `${dir_resource}${path_images}${newData.user_id}/${newData.blur.fileName}`
      )

      await fs.rename(
        `${dir_upload}/${newFileName}`,
        `${dir_resource}${path_images}${newData.user_id}/${newFileName}`
      )

      const { passwd, ...result } = userRes
      ctx.body = response(1, "修改成功", result)
    } catch (err) {
      ctx.status = 500
      ctx.body = response(0, "修改失败", err)
    }
  }

  /* 修改头像 */
  async alterationAvatar(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data = ctx.request.body
    const file = ctx.request.files
    const fileName = (file?.avatar as File).newFilename
    const newData = JSON.parse(data.user)

    try {
      const path = {
        avatar: `/images/${newData.user_id}/${fileName}`
      }

      /* 更新数据库 */
      await updateUser(newData.user_id, path)

      /* 返回更新后的用户信息 */
      const userRes = await queryUser({ user_id: newData.user_id })

      /* 移动到用户文件夹 */
      await fs.rename(
        `${dir_upload}/${fileName}`,
        `${dir_resource}${path_images}${newData.user_id}/${fileName}`
      )

      const { passwd, ...result } = userRes
      ctx.body = response(1, "修改成功", result)
    } catch (err) {
      ctx.status = 500
      ctx.body = response(0, "修改失败", err)
    }
  }

  /* 查询用户 */
  async queryUser(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data = ctx.request.body
    try {
      const { passwd, ...result } = await queryUser(
        { user_id: data.user_id },
        data.fields
      )

      ctx.body = response(1, "找到用户", result)
    } catch (err) {
      ctx.status = 500
      ctx.body = response(0, "未找到用户", err)
    }
  }

  /* 收藏帖子 */
  async favourite(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data = ctx.request.body

    try {
      const result = await seq.transaction(async () => {
        const favs = await queryFavourite(data.user_id)

        const allIds = favs.map(item => item.feed_id)

        const isFav = allIds.includes(data.feed_id)

        if (isFav) {
          await deleteFavourite(data.feed_id)
        } else {
          await newFav(data.user_id, data.feed_id)
        }

        return isFav
      })

      ctx.body = response(1, `${result ? "取消收藏" : "收藏成功"}`, null)
    } catch (err) {
      ctx.status = 500

      ctx.body = response(0, "收藏失败", `${err}`)
    }
  }

  /* 查找用户好友 */
  async getFriends(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data = ctx.request.body
    try {
      const res = await queryFriends(data.user_id)
      ctx.body = response(1, "找到好友", res)
    } catch (err) {
      ctx.status = 500
      ctx.body = response(0, "查找好友失败", `${err}`)
    }
  }

  /* 上传聊天中的图片或视频 */
  async messageUpload(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data = ctx.request.body
    const files = ctx.request.files
    const file = Object.values(files!)[0]
    let path: string = ""
    try {
      const friendRes = await FriendService.friendShip(data.user_id, data.friend_id)
      if (friendRes || data.isGroup) {
        /* 检查文件 */
        // await filesCheck(files!)
        if ((file as File).mimetype?.includes("image")) {
          path = `${path_images}${data.user_id}/${(file as File).newFilename}`
        } else if ((file as File).mimetype?.includes("video")) {
          path = `${path_videos}${data.user_id}/${(file as File).newFilename}`
        }
        await upload(files!, data.user_id)
        ctx.body = response(1, "上传图片", path)
      } else {
        console.log("@")
        throw Error("不能上传，你和对方不是双向好友")
      }
    } catch (err) {
      ctx.status = 500
      ctx.body = response(0, "上传失败", `${err}`)
    }
  }

  /* 删除好友 */
  async delFriend(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data = ctx.request.body
    try {
      await deleteFriend(data.user_id, data.friend_id)
      ctx.body = response(1, "删除成功", null)
    } catch (err) {
      ctx.status = 500
      ctx.body = response(0, "删除失败", `${err}`)
    }
  }
}

export default new UsersController()
