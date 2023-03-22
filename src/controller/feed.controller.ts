import feedService from "../service/feed.service.js"
import { CommonControllerCTX, CommonControllerNEXT } from "../types/types.js"
import response from "../util/response.js"
import { nanoid } from "nanoid"
import { File } from "../types/upload.type.js"
import userService from "../service/user.service.js"
import { path_images, path_videos, dir_resource } from "../constant/path.constant.js"
import fs from "fs/promises"
import seq from "../db/seq.js"
import Feed_AttachService from "../service/feed_attach.service.js"
import feed_likedService from "../service/feed_liked.service.js"
import feed_commentService from "../service/feed_comment.service.js"
import { QueryUserFeedsType } from "feed.type.js"
import { upload, attachUpload } from "../util/upload.js"
import NoticeService from "../service/notice.service.js"
import UserService from "../service/user.service.js"
import { io } from "../app/index.js"
import { socketIdMap } from "../socket/notice.js"

const {
  createFeed,
  getAllFeeds,
  modifyFeed_like,
  modifyFeed_delete,
  queryUserFeeds,
  queryFeed_comment,
  queryFavouriteFeed,
  queryOneFeed
} = feedService
const { create_attach, queryOneAttach, queryAllAttach } = Feed_AttachService
const { create_like, queryOneLiked, deleteLiked } = feed_likedService
const { create_comment, delete_comment } = feed_commentService

class FeedController {
  /* 发布帖子 */
  async publish(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data = ctx.request.body
    const files = ctx.request.files
    const user_info = ctx.state.user

    const feedUser = JSON.parse(data.data)

    const feed_id = nanoid(12)
    try {
      /* 使用事务 */
      const result = await seq.transaction(async t => {
        /* 把移动后的文件组成可存入数据库的格式 */
        const filesSaveData = await attachUpload(files!, user_info.user_id)
        /* 把帖子数据插入数据库 */
        const feed = await createFeed({ ...feedUser, feed_id: feed_id }, t)

        /* 帖子的图片或视频插入数据库 */
        const attachesData = filesSaveData.map(i => ({
          feed_id,
          feed_userID: feedUser.feed_userID,
          attach_id: i.id,
          attach_type: i.type,
          attach_link: i.link
        }))
        const feed_attaches = await create_attach(attachesData, t)

        /* 移动上传的文件 */
        await upload(files!, user_info.user_id)
        return {
          ...feed,
          feed_attaches,
          comment_count: 0,
          feed_likeds: [],
          user_favourites: []
        }
      })
      ctx.body = response(1, "创建成功", result)
    } catch (err) {
      ctx.status = 500
      ctx.body = response(0, "创建失败", `${err}`)
    }
  }

  /* 查询用户的帖子 */
  async queryUserFeeds(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data: QueryUserFeedsType = ctx.request.body
    try {
      const res = await queryUserFeeds(data)
      ctx.body = response(1, "获取全部帖子成功", res)
    } catch (err) {
      ctx.status = 500
      console.log(err)
      ctx.body = `${err}`
    }
  }

  /* 获取所有帖子 */
  async queryAllFeeds(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data = ctx.request.query
    const limit = parseInt(data.limit as string)
    const offset = parseInt(data.offset as string)
    try {
      const res = await getAllFeeds(limit, offset)

      ctx.body = response(1, "获取成功", res)
    } catch (err) {
      ctx.status = 500
      ctx.body = response(0, "获取帖子失败", `${err}`)
    }
  }

  /* 帖子点赞 */
  async likeFeed(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data = ctx.request.body

    try {
      const allLiked = await queryOneLiked(data.feed_id)

      const isLiked = allLiked.find(i => i.dataValues.liked === data.user_id)

      if (isLiked) {
        await deleteLiked(data.feed_id, data.user_id)
        ctx.body = response(1, "取消点赞成功", null)
      } else {
        await create_like(data.feed_id, data.user_id)
        if (data.user_id !== data.feed_userId) {
          const userRes = await UserService.queryUser({ user_id: data.user_id }, [
            "nick_name",
            "avatar",
            "user_id"
          ])
          const noticeRes = await NoticeService.createNotice({
            notice_id: nanoid(10),
            source_id: data.user_id,
            target_id: data.feed_userId,
            desc: data.user_id,
            type: "3"
          })
          const newData = {
            ...noticeRes,
            source: userRes,
            msg: "给你的帖子点赞啦"
          }

          io.of("/").to(socketIdMap.get(data.feed_userId)).emit("notice", newData)
        }
        ctx.body = response(1, "点赞成功", null)
      }
    } catch (err) {
      ctx.status = 500
      console.log(err)
      ctx.body = response(0, "点赞失败", `${err}`)
    }
  }

  /* 删除帖子 */
  async deleteFeed(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data = ctx.request.body

    try {
      await seq.transaction(async () => {
        const attach = await queryOneAttach(data.feed_id)

        await modifyFeed_delete(data.feed_id)

        if (attach.length > 0) {
          for (let item of attach) {
            await fs.rm(dir_resource + item.dataValues.attach_link)
          }
        }

        return 1
      })
      ctx.body = response(1, "删除成功", null)
    } catch (err) {
      ctx.status = 500
      ctx.body = response(0, "删除失败", `${err}`)
    }
  }

  /* 获取帖子评论 */
  async queryComment(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data = ctx.request.body
    try {
      const res = await queryFeed_comment(data.feed_id)
      ctx.body = response(1, "获取所有评论", res)
    } catch (err) {
      ctx.status = 500
      console.log(err)
      ctx.body = response(0, "获取评论失败", `${err}`)
    }
  }
  /* 发布评论 */
  async publishComment(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data = ctx.request.body
    try {
      const res = await create_comment({ ...data })

      const userRes = await UserService.queryUser({ user_id: data.user_id }, [
        "nick_name",
        "avatar",
        "user_id"
      ])
      const noticeRes = await NoticeService.createNotice({
        notice_id: nanoid(10),
        source_id: data.user_id,
        target_id: data.feed_userId,
        desc: data.user_id,
        type: "2"
      })

      const newData = {
        ...noticeRes,
        source: userRes,
        msg: "给你的帖子评论啦",
        comment_msg: data.comment
      }

      io.of("/").to(socketIdMap.get(data.feed_userId)).emit("notice", newData)
      ctx.body = response(1, "发布评论", null)
    } catch (err) {
      ctx.status = 500
      console.log(err)
      ctx.body = response(0, "发布评论失败", `${err}`)
    }
  }

  /* 获取用户收藏的帖子 */
  async queryFav(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data = ctx.request.body
    try {
      const res = await queryFavouriteFeed(data.user_id, data.limit, data.offset)

      console.log(res)
      ctx.body = response(1, "获取收藏的帖子", res)
    } catch (err) {
      ctx.status = 500
      console.log(err)
      ctx.body = response(0, "获取收藏的帖子", `${err}`)
    }
  }

  /* 删除评论 */
  async deleteComment(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data = ctx.request.body
    try {
      await delete_comment(data.comment_id)
      ctx.body = response(1, "删除评论", null)
    } catch (err) {
      ctx.status = 500
      ctx.body = response(0, "删除评论", null)
    }
  }

  /* 获取用户所有帖子的图片和视频 */
  async querAttaches(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data = ctx.request.body
    try {
      const res = await queryAllAttach(data.user_id)
      ctx.body = response(1, "图片和视频", res)
    } catch (err) {
      ctx.status = 500
      ctx.body = response(0, "获取失败", `${err}`)
    }
  }
}

export default new FeedController()
