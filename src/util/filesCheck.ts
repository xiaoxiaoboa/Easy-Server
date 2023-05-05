import formidable from "formidable"
import { File } from "../types/upload.type.js"

const mimetype = ["image", "video"]
const filesCheck = async (data: formidable.Files) => {
  return new Promise((resolve, reject) => {
    const files = Object.values(data)

    if (files.length < 0) resolve("")
    for (const item of files) {
      const size = (item as File).size
      if (size > 10 * 1024 * 1024) {
        reject("文件太大，单个文件不能超过10M")
      } else {
        if (mimetype.includes((item as File).mimetype!)) {
          reject("不支持此类型文件")
        }
      }
    }
    resolve("")
  })
}

export default filesCheck
