import { MessageType } from "chat.type.js"
import { Server, Socket } from "socket.io"
import ChatHistoryService from "../service/chat_history.service.js"
import { socketIdMap as notice_socketIds } from "./notice.js"
import NoticeService from "../service/notice.service.js"
import { nanoid } from "nanoid"
import { NoticeType } from "notice.type.js"
import userService from "../service/user.service.js"
import FriendService from "../service/friends.service.js"
import ChatGroupService from "../service/chat_group.service.js"

type Props = [Server, Socket]

export const socketIdMap = new Map()

/* 上线后存储每个客户端的socketid */
export const connectd_chat = (...props: Props) => {
  const [io, socket] = props

  socket.on("connected", async (socket_id: string, user_id: string) => {
    console.log("上线了")
    socketIdMap.set(user_id, socket_id)
  })
  socket.on("disconnect", () => {
    console.log("下线了")
  })
}

/* 取回聊天记录 */
export function privateChatHistory(...props: Props) {
  const [io, socket] = props
  socket.on("private_chat_history", async (user_id: string, to_id: string, callback) => {
    try {
      const res = await ChatHistoryService.queryPrivateMessages(user_id, to_id)
      callback(res)
    } catch (err) {
      console.log(err)
    }
  })
}

/* 一对一聊天 */
export function privateChat(...props: Props) {
  const [io, socket] = props

  /* 监听私聊消息 */
  socket.on("private_chat", async (params: MessageType, callback) => {
    const toSocket_id = socketIdMap.get(params.to_id)

    try {
      const { createdAt, user, ...result } = params
      const friendRes = await FriendService.friendShip(params.to_id, params.user_id)
      const isGroup = await ChatGroupService.queryGroup(params.to_id)

      if (friendRes || isGroup) {
        /* 存储 */
        const messageRes = await ChatHistoryService.newMessage({
          ...result,
          ch_id: nanoid(10),
          status: 1
        })

        params.createdAt = messageRes.dataValues.createdAt
        callback(true)
        /* 转发给对方 */
        socket
          .to(toSocket_id)
          .timeout(1000)
          .emit("private_message", params, async (err: any, res: any) => {
            // console.log(res, err)
            if (res.length === 0) {
              const newNoticeData = {
                notice_id: nanoid(10),
                target_id: params.to_id,
                source_id: params.user_id,
                type: "1",
                desc: messageRes.dataValues.ch_id
              }
              /* 存储notice */
              const noticeRes = await NoticeService.createNotice(newNoticeData)

              const userRes = await userService.queryUser(
                { user_id: newNoticeData.source_id },
                ["user_id", "avatar", "nick_name"]
              )

              const newData = {
                ...newNoticeData,
                done: 0,
                source: userRes,
                message: {
                  ...messageRes.dataValues,
                  conversation_id: params.conversation_id
                },
                createdAt: messageRes.dataValues.createdAt,
                total: 1
              }
              /* 发送新消息通知 */
              io.of("/")
                .to(notice_socketIds.get(params.to_id))
                .emit("new_notice_message", newData)
            } else if (res[0] !== "nosave") {
              console.log(res[0])
              const newData = {
                notice_id: nanoid(10),
                target_id: params.to_id,
                source_id: params.user_id,
                type: "1",
                desc: messageRes.dataValues.ch_id
              }
              await NoticeService.createNotice(newData)
            }
          })
      } else {
        callback(false)
      }
    } catch (err) {
      console.log(err)
    }
  })
}
