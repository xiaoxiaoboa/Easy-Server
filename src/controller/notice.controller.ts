import response from "../util/response.js"
import { CommonControllerCTX, CommonControllerNEXT } from "types.js"
import NoticeService from "../service/notice.service.js"
import { NoticeType } from "notice.type.js"
import { Model } from "sequelize"
import { Socket } from "socket.io"
import userService from "../service/user.service.js"
import { isOnline } from "../socket/notice.js"

const { queryNotice, createNotice, updateNotice } = NoticeService

/* 查询notice */
export const notice_query = async (
  ctx: CommonControllerCTX,
  next: CommonControllerNEXT
) => {
  const data = ctx.request.body
  try {
    const res = await queryNotice(data.user_id)
    ctx.body = response(1, "查询到了全部通知", res)
  } catch (err) {
    ctx.status = 500
    ctx.body = response(1, "查询到了全部通知", `${err}`)
  }
}

/* 
  通知类型：
  type              desc
  0 添加好友的请求      user_id 
  01  同意好友
  00  拒绝好友         拒绝信息

  1 聊天消息           {user_id,msg}
  2 评论消息           {user_id,msg}
  3 关注消息           user_id
  
*/
/* 下面是对存储通知和取回通知的一些处理 */

/* 处理好友请求 */
export const newNotice = async (params: Omit<NoticeType, "createdAt" | "id">) => {
  try {
    const res = await createNotice(params)
    return res
  } catch (err) {
    console.log(err)
  }
}

/* 处理暂存的用户通知 */
export const handleNotice = async (socket: Socket, user_id: string) => {
  try {
    const res = await NoticeService.queryNotice(user_id)
    for (const item of res) {
      sendBackNotice(item.dataValues, socket)
    }
  } catch (err) {
    console.log(err)
  }
}
/* 给客户端发送notice */
const sendBackNotice = async (notice: NoticeType, socket: Socket) => {
  const { notice_id, user_id, createdAt, type } = notice
  switch (notice.type) {
    case "0":
      try {
        const res = await userService.queryUser({ user_id: notice.desc }, [
          "user_id",
          "avatar",
          "nick_name"
        ])

        const newData = {
          notice: {
            notice_id,
            type
          },
          data: { ...res, timestamp: createdAt }
        }
        socket.emit(`notice_${user_id}`, newData)
      } catch (err) {
        console.log(err)
      }
      break
    case "00":
      const newData = {
        notice: {
          notice_id,
          type
        },
        data: { msg: notice.desc, timestamp: createdAt }
      }
      socket.emit(`notice_${user_id}`, newData, (res: any, err: any) => {
        if (res) {
          updateNotice(notice.notice_id, true)
        }
      })
      break
    case "1":
      break
    case "2":
      break
    case "3":
      break
    default:
      break
  }
}
