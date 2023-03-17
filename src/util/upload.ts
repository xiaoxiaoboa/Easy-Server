import {
  dir_resource,
  dir_upload,
  path_images,
  path_videos
} from "../constant/path.constant.js"
import fs from "fs"
import { File } from "../types/upload.type.js"
import { nanoid } from "nanoid"
import formidable from "formidable"
import { Feed_attach } from "feed_attach.type.js"

/* 移动到用户目录 */
export const upload = async (data: formidable.Files, user_id: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const files = Object.values(data)
    if (files.length === 0) {
      resolve(1)
    } else {
      for (let item of files) {
        const fileName = (item as File).newFilename
        const fileType = (item as File).mimetype

        if (fileType?.includes("image")) {
          fs.rename(
            `${dir_upload}/${fileName}`,
            `${dir_resource}${path_images}${user_id}/${fileName}`,
            err => {
              if (err) throw reject("文件移动失败")
            }
          )
        } else if (fileType?.includes("video")) {
          fs.rename(
            `${dir_upload}/${fileName}`,
            `${dir_resource}${path_videos}${user_id}/${fileName}`,
            err => {
              if (err) throw reject("文件移动失败")
            }
          )
        }

        resolve(1)
      }
    }
  })
}

/* 把帖子图片和视频数据组成可存入数据库格式 */
export const attachUpload = (
  data: formidable.Files,
  user_id: string
): Promise<Feed_attach[]> => {
  return new Promise((resolve, reject) => {
    const files = Object.values(data)

    let filesData: Feed_attach[] = []

    files.map(file => {
      const fileType = (file as File).mimetype?.split("/")[0]
      switch (fileType) {
        case "image":
          filesData.push({
            id: nanoid(10),
            type: fileType,
            link: `${path_images}${user_id}/${(file as File).newFilename}`
          })
          break
        case "video":
          filesData.push({
            id: nanoid(10),
            type: fileType,
            link: `${path_videos}${user_id}/${(file as File).newFilename}`
          })
          break
        default:
          reject("格式错误")
          return
      }
    })
    resolve(filesData)
  })
}
