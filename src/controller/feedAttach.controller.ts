import response from "../util/response.js"
import { CommonControllerCTX, CommonControllerNEXT } from "types"
import { File } from "../types/upload.type.js"

class FeedAttachController {
  async feedAttachUpload(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const files: File[] = ctx.request.body
    const { user_id } = ctx.state.user
    let filesPath: string[] = []

    files.map(file => {
      if (file.mimetype?.includes("image")) {
        filesPath.push(`/images/${user_id}/${file.newFilename}`)
      } else if (file.mimetype?.includes("video")) {
        filesPath.push(`/videos/${user_id}/${file.newFilename}`)
      }
    })

    ctx.body = response(1, "图片上传成功", filesPath)
  }
}

export default new FeedAttachController()
