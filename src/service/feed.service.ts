import Feed_attach from "../model/feed_attach.model.js"
import Feed from "../model/feed.model.js"
import Feed_Liked from "../model/feed_liked.model.js"
import Feed_Comment from "../model/feed_comment.model.js"
import User from "../model/user.model.js"
import { Feed_attachServiceType } from "../types/feed_attach.type.js"
import { Feed_LikedServiceType } from "../types/feed_liked.type.js"
import User_Favourite from "../model/user_favourite.model.js"
import seq from "../db/seq.js"
import { QueryUserFeedsType } from "feed.type.js"
import { QueryTypes, Transaction } from "sequelize"

class FeedService {
  /* 创建帖子 */
  async createFeed(data: any, t: Transaction) {
    try {
      const newFeed = await Feed.create({ ...data }, { transaction: t })
      return newFeed.dataValues
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 获取所有帖子 */
  async getAllFeeds(limit: number, offset: number) {
    try {
      const allFeeds = await Feed.findAll({
        limit,
        offset,
        include: [
          Feed_Liked,
          Feed_attach,
          User_Favourite,
          { model: User, attributes: ["user_id", "nick_name", "avatar"] }
        ],
        attributes: {
          include: [
            /* 查询每个帖子的评论数量 */
            [
              seq.literal(
                `(SELECT COUNT(*) FROM feed_comment WHERE feed_comment.feed_id = feed.feed_id)`
              ),
              "comment_count"
            ]
          ]
        },

        order: [["createdAt", "DESC"]]
      })

      return JSON.stringify(allFeeds)
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 查找一个帖子 */
  async queryOneFeed(feed_id: string): Promise<any> {
    try {
      const res = await Feed.findOne({
        where: { feed_id }
      })
      return res?.dataValues
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 查询用户帖子 */
  async queryUserFeeds(params: QueryUserFeedsType) {
    try {
      const allFeeds = await Feed.findAll({
        limit: params.limit,
        offset: params.offset,
        where: { feed_userID: params.user_id },
        include: [
          Feed_Liked,
          Feed_attach,
          { model: User_Favourite, attributes: ["user_id", "createdAt"] },
          { model: User, attributes: ["user_id", "nick_name", "avatar"] }
        ],
        attributes: {
          include: [
            /* 查询每个帖子的评论数量 */
            [
              seq.literal(
                `(SELECT COUNT(*) FROM feed_comment WHERE feed_comment.feed_id = feed.feed_id)`
              ),
              "comment_count"
            ]
          ]
        },
        order: [["createdAt", "DESC"]]
      })

      return JSON.stringify(allFeeds)
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 点赞 */
  async modifyFeed_like(params: { feed_id: string; liked: string; count: number }) {
    try {
      const result = await Feed_Liked.update(
        { ...params },
        {
          where: { feed_id: params.feed_id }
        }
      )
      return result
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 删除帖子 */
  async modifyFeed_delete(feed_id: string): Promise<number> {
    try {
      const res = await Feed.destroy({
        where: { feed_id }
      })
      return res
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 获取帖子评论 */
  async queryFeed_comment(feed_id: string) {
    try {
      const res = seq.query(
        `SELECT feed_comment.comment,feed_comment.comment_id,feed_comment.feed_id,feed_comment.user_id,feed_comment.createdAt,users.avatar,users.nick_name FROM feed_comment  LEFT JOIN users ON (feed_comment.user_id = users.user_id) WHERE feed_id = '${feed_id}' ORDER BY feed_comment.createdAt ASC`,
        { raw: true, type: QueryTypes.SELECT }
      )
      return res
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 获取用户收藏的帖子 */
  async queryFavouriteFeed(user_id: string, limit: number, offset: number) {
    try {
      const res = await User_Favourite.findAll({
        limit,
        offset,
        where: { user_id },
        include: [
          {
            model: Feed,
            include: [
              Feed_Liked,
              Feed_attach,
              User_Favourite,
              { model: User, attributes: ["user_id", "nick_name", "avatar"] }
            ],
            attributes: {
              include: [
                /* 查询每个帖子的评论数量 */
                [
                  seq.literal(
                    `(SELECT COUNT(*) FROM feed_comment WHERE feed_comment.feed_id = feed.feed_id)`
                  ),
                  "comment_count"
                ]
              ]
            }
          }
        ]
      })
      return JSON.stringify(res)
    } catch (err) {
      throw Error("", { cause: err })
    }
  }
}

export default new FeedService()
