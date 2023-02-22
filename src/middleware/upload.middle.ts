import response from "../util/response.js"
import { CommonControllerCTX, CommonControllerNEXT } from "types"
import { File } from "../types/upload.type.js"
import fs from "fs/promises"

const path = process.cwd()

export const upload = async (ctx: CommonControllerCTX, next: CommonControllerNEXT) => {
  const data = ctx.request.files
  const { user_id } = ctx.state.user
  const files = Object.values(data!)

  if (files.length === 0) {
    ctx.body = response(0, "图片上传失败", null)
    return
  } else {
    try {
      for (let item of files) {
        const fileName = (item as File).newFilename
        const fileType = (item as File).mimetype

        if (fileType?.includes("image")) {
          await fs.rename(
            `${path}/data/upload/${fileName}`,
            `${path}/data/resource/images/${user_id}/${fileName}`
          )
        } else if (fileType?.includes("video")) {
          await fs.rename(
            `${path}/data/upload/${fileName}`,
            `${path}/data/resource/videos/${user_id}/${fileName}`
          )
        }
      }

      ctx.body = response(1, "图片上传成功", null)
      ctx.request.body = files
      next()
    } catch (err) {
      ctx.status = 500
      ctx.body = response(0, "图片上传失败", err)
    }
  }
}
