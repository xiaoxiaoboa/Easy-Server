import feedService from "../service/feed.service.js"
import { CommonControllerCTX, CommonControllerNEXT } from "../types/types.js"
import response from "../util/response.js"
import { nanoid } from "nanoid"
import { File } from "../types/upload.type.js"
import userService from "../service/user.service.js"
import { path_images, path_videos, dir_resource } from "../constant/path.constant.js"
import fs from "fs/promises"
import seq from "../db/seq.js"
import feed_attachService from "../service/feed_attach.service.js"
import feed_likedService from "../service/feed_liked.service.js"
import feed_commentService from "../service/feed_comment.service.js"
import { toParse } from "../util/conversionFeedType.js"
import { Feed_attach } from "feed_attach.type.js"
import { QueryUserFeedsType } from "feed.type.js"
import { Feed_CommentRequestType } from "feed_comment.type.js"

const {
  createFeed,
  getAllFeeds,
  modifyFeed_like,
  queryOneFeed,
  modifyFeed_delete,
  queryUserFeeds,
  queryFeed_comment
} = feedService
const { queryUser } = userService
const { create_attach, queryOneAttach } = feed_attachService
const { create_like, queryOneLiked } = feed_likedService
const { create_comment } = feed_commentService

class FeedController {
  /* 发布帖子 */
  async publish(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data = ctx.request.body
    const user_info = ctx.state.user

    const feed_id = nanoid(12)
    try {
      /* 使用事务 */
      const result = await seq.transaction(async t => {
        const feed = await createFeed({ ...data, feed_id: feed_id })

        const attach = await create_attach({
          feed_id,
          feed_userID: data.feed_userID,
          count: 0,
          attach: JSON.stringify(data.feed_attach)
        })
        const liked = await create_like({
          feed_id,
          feed_userID: data.feed_userID,
          liked: JSON.stringify([])
        })

        return toParse(
          JSON.parse(
            JSON.stringify({
              ...feed,
              user: user_info,
              feed_liked: liked.dataValues,
              feed_comment: [],
              feed_attach: attach.dataValues,
              user_favourites: []
            })
          )
        )
      })
      ctx.body = response(1, "创建成功", result)
    } catch (err) {
      ctx.status = 500
      ctx.body = response(0, "创建失败", `${err}`)
    }
  }

  /* 帖子图片和视频上传 */
  async feedAttachUpload(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const files: File[] = ctx.request.body
    const { user_id } = ctx.state.user
    let filesData: any[] = []

    files.map(file => {
      const fileType = file.mimetype?.split("/")[0]
      switch (fileType) {
        case "image":
          filesData.push({
            id: nanoid(10),
            type: fileType,
            link: `${path_images}${user_id}/${file.newFilename}`
          })
          break
        case "video":
          filesData.push({
            id: nanoid(10),
            type: fileType,
            link: `${path_videos}${user_id}/${file.newFilename}`
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
    const data: QueryUserFeedsType = ctx.request.body
    try {
      const res = await queryUserFeeds(data)
      ctx.body = response(1, "获取全部帖子成功", toParse(JSON.parse(res)))
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

      ctx.body = response(1, "获取成功", toParse(JSON.parse(res)))
      // ctx.body = response(1, "获取成功", JSON.parse(res))
    } catch (err) {
      ctx.status = 500
      console.log(err)
      ctx.body = response(0, "获取失败", `${err}`)
    }
  }

  /* 帖子点赞 */
  async likeFeed(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data = ctx.request.body

    try {
      const result = await seq.transaction(async () => {
        const oneLiked = await queryOneLiked(data.feed_id)

        const parsedLiked = JSON.parse(oneLiked.liked) as string[]
        let likedCount = oneLiked.liked.length

        const isLiked = parsedLiked.includes(data.user_id)

        let newData: string

        if (isLiked) {
          newData = JSON.stringify(parsedLiked.filter(item => item !== data.user_id))
          likedCount -= 1
        } else {
          newData = JSON.stringify([...parsedLiked, data.user_id])
          likedCount += 1
        }

        await modifyFeed_like({
          feed_id: data.feed_id,
          liked: newData,
          count: likedCount
        })

        console.log(newData)
        return isLiked
      })

      ctx.body = response(1, `${result ? "取消点赞" : "点赞成功"}`, null)
    } catch (err) {
      ctx.status = 500
      console.log(err)
      ctx.body = response(0, "点赞失败", `${err}`)
    }

    // try {
    //   const findRes = feedTypeRestore(await queryOneFeed(data.feed_id))
    //   let feed_likedCount = findRes.feed_likedCount

    //   const isLiked = findRes.feed_liked.includes(data.user_id)
    //   let newData: string[] = []

    //   if (isLiked) {
    //     newData = findRes.feed_liked.filter(item => item !== data.user_id)
    //     feed_likedCount -= 1
    //   } else {
    //     newData = [...findRes.feed_liked, data.user_id]
    //     feed_likedCount += 1
    //   }

    //   const modifyRes = await modifyFeed_like(
    //     data.feed_id,
    //     JSON.stringify(newData),
    //     feed_likedCount
    //   )
    //   ctx.body = response(1, `${isLiked ? "取消点赞" : "点赞成功"}`, modifyRes)
    // } catch (err) {
    //   ctx.status = 500
    //   ctx.body = response(0, "操作失败", err)
    // }
  }

  /* 删除帖子 */
  async deleteFeed(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data = ctx.request.body

    try {
      await seq.transaction(async () => {
        const oneAttach = await queryOneAttach(data.feed_id)
        const attach = JSON.parse(oneAttach.attach) as Feed_attach[]

        await modifyFeed_delete(data.feed_id)

        if (attach.length > 0) {
          for (let item of attach) {
            await fs.rm(dir_resource + item.link)
          }
        }

        return 1
      })
      ctx.body = response(1, "删除成功", null)
    } catch (err) {
      ctx.status = 500
      ctx.body = response(0, "删除失败", `${err}`)
    }

    // try {
    //   const findRes = feedTypeRestore(await queryOneFeed(data.feed_id))
    //   const attach = findRes.feed_attach

    //   if (findRes.feed_userID !== data.user_id) {
    //     throw Error("帖子和用户不匹配")
    //   }

    //   if (attach.length > 0) {
    //     for (let item of attach) {
    //       await fs.rm(dir_resource + item.attach_link)
    //     }
    //   }

    //   const delRes = await modifyFeed_delete(data.feed_id)

    //   ctx.body = response(1, "删除成功", delRes)
    // } catch (err) {
    //   ctx.status = 500
    //   ctx.body = JSON.stringify(response(0, "删除失败", `${err}`))
    // }
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
      ctx.body = response(1, "获取评论失败", `${err}`)
    }
  }
  /* 发布评论 */
  async publishComment(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data = ctx.request.body
    try {
      const res = await create_comment({ ...data })
      ctx.body = response(1, "发布评论", null)
    } catch (err) {
      ctx.status = 500
      console.log(err)
      ctx.body = response(1, "发布评论失败", `${err}`)
    }
  }
}

export default new FeedController()
