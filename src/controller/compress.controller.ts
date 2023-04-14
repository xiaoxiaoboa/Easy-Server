import response from "../util/response.js"
import sharp from "sharp"
import { CommonControllerCTX, CommonControllerNEXT } from "../types/types.js"
import { CompressRequestType } from "user.type.js"
import { File } from "../types/upload.type.js"

const compressImg = async (ctx: CommonControllerCTX, next: CommonControllerNEXT) => {
  const data = ctx.request.files
  const file = (data as any).file as File
  try {
    const buffer = await sharp(file.filepath)
      .blur(60)
      .resize({ width: 340, fit: "cover" })
      .toBuffer()

    const newData = {
      fileName: file.newFilename,
      base64: `data:${file.mimetype};base64,${buffer.toString("base64")}`
    }
    ctx.body = response(1, "图片处理成功", newData)
  } catch (err) {
    ctx.status = 500
    ctx.body = response(0, "图片处理失败", `${err}`)
  }
}

export default compressImg
