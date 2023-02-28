import feedService from "../service/feed.service.js"
import { CommonControllerCTX, CommonControllerNEXT } from "../types/types.js"
import { Feed, FeedType, Feed_attach, likeFeedRequestType } from "../types/feed.type.js"
import response from "../util/response.js"
import { feedTypeToJson, feedTypeRestore } from "../util/conversionFeedType.js"
import { nanoid } from "nanoid"
import { File } from "../types/upload.type.js"
import userService from "../service/user.service.js"
import { UserType } from "user.type.js"
import { dir_resource, path_images, path_videos } from "../constant/path.constant.js"
import fs from "fs/promises"

const { CreateFeed, GetAllFeeds, modifyFeed_like, queryOneFeed, modifyFeed_delete } =
  feedService
const { QueryUser, QueryUserFeeds } = userService

class FeedController {
  /* 发布帖子 */
  async publish(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data = ctx.request.body
    const user = ctx.state.user

    const initData = {
      feed_id: nanoid(12),
      feed_text: "",
      feed_attach: [],
      feed_liked: [],
      feed_likedCount: 0,
      feed_comment: [],
      feed_commentCount: 0
    }

    const newFeed = feedTypeToJson({ ...initData, ...data })

    try {
      const res = await CreateFeed(newFeed)
      const resData: Feed = {
        feed_user: user,
        feed: feedTypeRestore(res)
      }
      ctx.body = response(1, "已成功创建帖子", resData)
    } catch (err) {
      ctx.status = 500
      ctx.body = response(0, "创建帖子失败", err)
    }
  }

  /* 帖子图片和视频上传 */
  async feedAttachUpload(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const files: File[] = ctx.request.body
    const { user_id } = ctx.state.user
    let filesData: Feed_attach[] = []

    files.map(file => {
      const fileType = file.mimetype?.split("/")[0]
      switch (fileType) {
        case "image":
          filesData.push({
            id: nanoid(10),
            attach_type: fileType,
            attach_link: `${path_images}${user_id}/${file.newFilename}`
          })
          break
        case "video":
          filesData.push({
            id: nanoid(10),
            attach_type: fileType,
            attach_link: `${path_videos}${user_id}/${file.newFilename}`
          })
          break
        default:
          ctx.body = response(0, "上传失败", files)
          return
      }
    })

    ctx.body = response(1, "上传成功", filesData)
  }

  /* 查询用户的帖子 */
  async queryUserFeeds(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data: { user_id: string } = ctx.request.body
    try {
      const res = await QueryUserFeeds(data.user_id)
      const feed_user = await QueryUser({ user_id: data.user_id })

      const feeds: Feed[] = res
        .map(obj => ({
          feed_user: feed_user,
          feed: feedTypeRestore(obj.dataValues)
        }))
        .reverse()

      ctx.body = response(1, "已找到用户的所有帖子", feeds)
    } catch (err) {
      ctx.status = 500
      ctx.body = response(0, "查找帖子失败", err)
    }
  }

  /* 获取所有帖子 */
  async queryAllFeeds(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    try {
      const res = await GetAllFeeds()
      const allFeeds: FeedType[] = res.map(item => feedTypeRestore(item.dataValues))
      const feeds: Feed[] = []
      for (let item of allFeeds) {
        const userRes = await QueryUser({ user_id: item.feed_userID })
        const feed: Feed = {
          feed: item,
          feed_user: userRes
        }
        feeds.push(feed)
      }
      ctx.body = response(1, "获取成功", feeds)
    } catch (err) {
      ctx.status = 500
      ctx.body = response(0, "获取失败", err)
    }
  }

  /* 帖子点赞 */
  async likeFeed(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data: likeFeedRequestType = ctx.request.body

    try {
      const findRes = feedTypeRestore(await queryOneFeed(data.feed_id))
      let feed_likedCount = findRes.feed_likedCount

      const isLiked = findRes.feed_liked.includes(data.user_id)
      let newData: string[] = []

      if (isLiked) {
        newData = findRes.feed_liked.filter(item => item !== data.user_id)
        feed_likedCount -= 1
      } else {
        newData = [...findRes.feed_liked, data.user_id]
        feed_likedCount += 1
      }

      const modifyRes = await modifyFeed_like(
        data.feed_id,
        JSON.stringify(newData),
        feed_likedCount
      )
      ctx.body = response(1, `${isLiked ? "取消点赞" : "点赞成功"}`, modifyRes)
    } catch (err) {
      ctx.status = 500
      ctx.body = response(0, "操作失败", err)
    }
  }

  /* 删除帖子 */
  async deleteFeed(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data = ctx.request.body

    try {
      const findRes = feedTypeRestore(await queryOneFeed(data.feed_id))
      const attach = findRes.feed_attach

      if (findRes.feed_userID !== data.user_id) {
        throw Error("帖子和用户不匹配")
      }

      if (attach.length > 0) {
        for (let item of attach) {
          await fs.rm(dir_resource + item.attach_link)
        }
      }

      const delRes = await modifyFeed_delete(data.feed_id)

      ctx.body = response(1, "删除成功", delRes)
    } catch (err) {
      ctx.status = 500
      ctx.body = JSON.stringify(response(0, "删除失败", `${err}`))
    }
  }
}

export default new FeedController()
