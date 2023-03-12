import { PrivateMessageType } from "chat.type.js"
import { Server, Socket } from "socket.io"
import PrivateChatService from "../service/chat_private.service.js"

type Props = [Server, Socket]

export const socketIdMap = new Map()

/* 上线后存储每个客户端的socketid */
export const connectd_chat = (...props: Props) => {
  const [io, socket] = props

  socket.on("connected", async (socket_id: string, user_id: string) => {
    socketIdMap.set(user_id, socket_id)
  })
}

export function privateChatHistory(...props: Props) {
  const [io, socket] = props
  socket.on("private_chat_history", async (user_id: string, to_id: string, callback) => {
    try {
      const res = await PrivateChatService.queryPrivateMessage(user_id, to_id)
      callback(res)
    } catch (err) {
      console.log(err)
    }
  })
}

/* 一对一聊天 */
export function privateChat(...props: Props) {
  const [io, socket] = props

  socket.on("private_chat", async (user_id: string, params: PrivateMessageType) => {
    const toSocket_id = socketIdMap.get(user_id)
    try {
      const { createdAt, ...result } = params
      await PrivateChatService.newPrivateMessage(result)
      socket.to(toSocket_id).emit("private_message", params)
    } catch (err) {
      console.log(err)
    }
  })
}

/* 群聊 */
export const groupChat = (...props: Props) => {
  const [io, socket] = props

  socket.join("room1")

  socket.on("groupMessages", (room_id: string, data: any) => {
    console.log(room_id, data)
    socket.to(room_id).emit("groupMessages", data)
  })

  socket.on("disconnect", () => {
    console.log("断开连接了")
  })
}
