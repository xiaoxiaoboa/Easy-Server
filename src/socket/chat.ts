import { MessageType } from "chat.type.js"
import { Server, Socket } from "socket.io"
import ChatHistoryService from "../service/chat_history.service.js"
import { socketIdMap as notice_socketIds } from "./notice.js"

type Props = [Server, Socket]

export const socketIdMap = new Map()

/* 上线后存储每个客户端的socketid */
export const connectd_chat = (...props: Props) => {
  const [io, socket] = props

  socket.on("connected", async (socket_id: string, user_id: string) => {
    socketIdMap.set(user_id, socket_id)
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
  socket.on("private_chat", async (params: MessageType) => {
    const toSocket_id = socketIdMap.get(params.to_id)
    try {
      const { createdAt, user, ...result } = params
      /* 存储 */
      await ChatHistoryService.newMessage(result)

      /* 转发给对方 */
      socket.to(toSocket_id).emit("private_message", params)

      
      
      /* 发送新消息通知 */
      io.of("/").to(notice_socketIds.get(params.to_id)).emit("new_message", params)
    } catch (err) {
      console.log(err)
    }
  })
}
