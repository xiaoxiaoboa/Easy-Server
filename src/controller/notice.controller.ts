import response from "../util/response.js"
import { CommonControllerCTX, CommonControllerNEXT } from "types.js"
import NoticeService from "../service/notice.service.js"
import { NoticeType } from "notice.type.js"
import { Model } from "sequelize"
import { Socket } from "socket.io"
import userService from "../service/user.service.js"
import ChatHistoryService from "../service/chat_history.service.js"

/* 查询notice私聊消息 */
export const notice_query = async (
  ctx: CommonControllerCTX,
  next: CommonControllerNEXT
) => {
  const data = ctx.request.body
  try {
    const res = await NoticeService.queryNotice(data.user_id, data.type)
    ctx.body = response(1, "查询到了全部通知", res)
  } catch (err) {
    ctx.status = 500
    ctx.body = response(0, "查询失败", `${err}`)
  }
}

/* 查询好友请求 */
// export const 

/* 
  通知类型：
  type                desc
  0 添加好友的请求      user_id 
  01  同意好友
  00  拒绝好友         拒绝信息

  1 聊天消息           {user_id,msg}
  2 评论消息           {user_id,msg}  20 未读 21已读
  3 点赞消息           user_id  30 未读 31已读
  
*/
/* 下面是对存储通知和取回通知的一些处理 */

/* 处理暂存的用户通知 */
export const handleNotice = async (socket: Socket, user_id: string) => {
  try {
    // const res = await NoticeService.queryNotice(user_id)
    // for (const item of res) {
    //   sendBackNotice(item.dataValues, socket)
    // }
  } catch (err) {
    console.log(err)
  }
}
/* 给客户端发送notice */
const sendBackNotice = async (notice: NoticeType, socket: Socket) => {
  const { notice_id, target_id, source_id, createdAt, type, desc } = notice
  switch (notice.type) {
    case "0":
      try {
        const res = await userService.queryUser({ user_id: notice.desc }, [
          "user_id",
          "avatar",
          "nick_name"
        ])

        const newData = {
          notice,
          user: { ...res },
          timestamp: createdAt
        }
        socket.emit(`notice_${target_id}`, newData)
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
      socket.emit(`notice_${source_id}`, newData, async (res: any, err: any) => {
        if (res) {
          await NoticeService.updateNotice(notice.notice_id, true)
        }
      })
      break
    case "1":
      try {
        const res = await getNoticeMessageData(notice)
        socket.emit(`notice_messages_${target_id}`, res)
      } catch (err) {
        console.log(err)
      }

      break
    case "2":
      break
    case "3":
      break
    default:
      break
  }
}

/* 获取notice新消息的数据 */
export const getNoticeMessageData = async (notice: NoticeType) => {
  const userRes = await userService.queryUser({ user_id: notice.source_id }, [
    "user_id",
    "avatar",
    "nick_name"
  ])
  const messageRes = await ChatHistoryService.queryOneMessage(notice.desc)
  return {
    ...notice,
    source: userRes,
    msg: messageRes
  }
}
