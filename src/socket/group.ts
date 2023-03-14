import group_numbersService from "../service/group_numbers.service.js"
import { MessageType } from "chat.type"
import { Server, Socket } from "socket.io"
import ChatHistoryService from "../service/chat_history.service.js"
type Props = [Server, Socket]

/* 群聊 */
export const groupChat = async (...props: Props) => {
  const [io, socket] = props

  /* 上线后先把用户添加进所加入的群组的房间里 */
  socket.on("connected", async (user_id: string) => {
    await joinRoom(user_id, socket)
  })

  /* 监听群组消息 */
  socket.on("group_chat", async (room_id: string, params: MessageType) => {
    const { createdAt, user, ...result } = params
    /* 存储 */
    await ChatHistoryService.newMessage(result)
    /* 转发给群组 */
    socket.to(room_id).emit("group_messages", params)
    /* 新消息提醒 */
    io.of("/").to(room_id).emit("new_message", params)
  })
}

export const groupChatHistory = (...props: Props) => {
  const [io, socket] = props

  socket.on("group_chat_history", async (group_id: string, callback) => {
    try {
      const res = await ChatHistoryService.queryGroupMessages(group_id)
      callback(res)
    } catch (err) {
      console.log(err)
    }
  })
}

/* 加入房间 */
export const joinRoom = async (user_id: string, socket: Socket) => {
  try {
    const res = await group_numbersService.queryJoined(user_id)
    res.map(i => socket.join(i.group_id))
  } catch (err) {
    console.log(err)
  }
}
