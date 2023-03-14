import response from "../util/response.js"
import { CommonControllerCTX, CommonControllerNEXT } from "types.js"
import ChatGroupService from "../service/chat_group.service.js"
import GroupNumbersService from "../service/group_numbers.service.js"
import { File } from "upload.type.js"
import { dir_resource, path_images } from "../constant/path.constant.js"
import seq from "../db/seq.js"
import { upload } from "../util/upload.js"
import fs from "fs/promises"

class ChatGroupController {
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
        const numbers = await GroupNumbersService.newGroupNumber(
          newGroupData.group_id,
          numbersData,
          t
        )
        return { group, numbers }
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
}

export default new ChatGroupController()
