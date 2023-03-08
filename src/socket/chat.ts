import { Server, Socket } from "socket.io"
import { socketIdMap } from "./notice.js"

type Props = [Server, Socket]

/* 一对一聊天 */
export function privateChat(...props: Props) {
  const [io, socket] = props

  socket.on("private message", async (user_id: string, msg: string) => {
    socket.to(socketIdMap.get(user_id)).emit(user_id, msg)

    console.log(socketIdMap.get(user_id), user_id, msg)
  })

  socket.on("disconnect", () => {
    console.log("断开连接了")
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
