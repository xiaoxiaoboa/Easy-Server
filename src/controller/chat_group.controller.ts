import response from "../util/response.js"
import { CommonControllerCTX, CommonControllerNEXT } from "types.js"
import ChatGroupService from "../service/chat_group.service.js"
import GroupNumbersService from "../service/group_numbers.service.js"
import { File } from "upload.type.js"
import { dir_resource, path_images } from "../constant/path.constant.js"
import seq from "../db/seq.js"
import { attachUpload, upload } from "../util/upload.js"
import fs from "fs/promises"
import ChatHistoryService from "../service/chat_history.service.js"
import userService from "../service/user.service.js"

class ChatGroupController {
  /* 创建 */
  async create(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data = ctx.request.body
    const files = ctx.request.files

    const newGroupData = JSON.parse(data.data)
    const numbersData: string[] = JSON.parse(data.numbers)
    numbersData.push(newGroupData.group_owner)
    let groupAvatarPath = ""

    if (files) {
      const file = files.file as File
      const type = file.mimetype?.split("/")[0]
      if (type === "image") {
        groupAvatarPath = `${path_images}${newGroupData.group_id}/${file.newFilename}`
        newGroupData.group_avatar = groupAvatarPath
      }
    }

    try {
      const result = await seq.transaction(async t => {
        const group = await ChatGroupService.newChatGroup(newGroupData, t)
        await GroupNumbersService.newGroupNumber(newGroupData.group_id, numbersData, t)
        return group
      })
      await fs.mkdir(`${dir_resource}${path_images}${newGroupData.group_id}/`, {
        recursive: true
      })
      await upload(files!, newGroupData.group_id)
      ctx.body = response(1, "创建群组", result)
    } catch (err) {
      ctx.status = 500
      ctx.body = response(0, "创建失败", `${err}`)
    }
  }

  /* 更换头像 */
  async updateAvatar(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const files = ctx.request.files
    const data = ctx.request.body

    try {
      const newData = await attachUpload(files!, JSON.parse(data.group_id))
      if (newData[0]) {
        await ChatGroupService.update(JSON.parse(data.group_id), {
          group_avatar: newData[0].link
        })
        await upload(files!, JSON.parse(data.group_id))
        ctx.body = response(1, "修改头像", newData[0].link)
      }
    } catch (err) {
      ctx.status = 500
      ctx.body = response(0, "修改失败", `${err}`)
    }
  }

  /* 查询群聊未读消息 */
  async queryUnreadMessage(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data = ctx.request.body
    try {
      const user = await userService.queryUser({ user_id: data.user_id })
      const offline = user.offline
      const ids = (data.ids as string[]).map(i => `'${i}'`)
      const res = await ChatHistoryService.queryUnreadGroupMessages(ids, offline)

      ctx.body = response(1, "获取群聊未读消息", res)
    } catch (err) {
      ctx.status = 500
      ctx.body = response(0, "获取失败", `${err}`)
    }
  }
}

export default new ChatGroupController()
