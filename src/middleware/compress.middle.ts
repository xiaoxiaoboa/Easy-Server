import response from "../util/response.js"
import sharp from "sharp"
import {
  CommonControllerCTX,
  CommonControllerNEXT,
  CompressRequestType
} from "../types/types.js"

const compressImg = async (ctx: CommonControllerCTX, next: CommonControllerNEXT) => {
  const requestData: CompressRequestType = ctx.request.body
  const [base64Head, base64] = requestData.base64.split(",")

  try {
    const buf = Buffer.from(base64, "base64")

    const buffered = await sharp(buf)
      .blur(60)
      // .toFormat("jpeg")
      .resize({ width: 340, fit: "cover" })
      .toBuffer()

    const data = { compressed: base64Head + "," + buffered.toString("base64") }

    ctx.body = response(1, "图片处理成功", data)
  } catch (err) {
    ctx.body = err
  }
}

export default compressImg
