import response from "../util/response.js"
import { CommonControllerCTX, CommonControllerNEXT } from "types"
import { File } from "../types/upload.type.js"
import fs from "fs/promises"
import {
  dir_resource,
  dir_upload,
  path_images,
  path_videos
} from "../constant/path.constant.js"

export const upload = async (ctx: CommonControllerCTX, next: CommonControllerNEXT) => {
  const data = ctx.request.files
  const { user_id } = ctx.state.user
  const files = Object.values(data!)

  if (files.length === 0) {
    ctx.body = response(0, "没有图片或视频", null)
    await next()
  } else {
    try {
      for (let item of files) {
        const fileName = (item as File).newFilename
        const fileType = (item as File).mimetype

        if (fileType?.includes("image")) {
          await fs.rename(
            `${dir_upload}/${fileName}`,
            `${dir_resource}${path_images}${user_id}/${fileName}`
          )
        } else if (fileType?.includes("video")) {
          await fs.rename(
            `${dir_upload}/${fileName}`,
            `${dir_resource}${path_videos}${user_id}/${fileName}`
          )
        }
      }

      ctx.body = response(1, "图片上传成功", null)
      ctx.request.body = files
      await next()
    } catch (err) {
      ctx.status = 500
      ctx.body = response(0, "图片上传失败", err)
    }
  }
}
