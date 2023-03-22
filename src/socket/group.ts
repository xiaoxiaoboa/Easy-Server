import group_numbersService from "../service/group_numbers.service.js"
import { MessageType } from "chat.type"
import { Server, Socket } from "socket.io"
import ChatHistoryService from "../service/chat_history.service.js"
import ChatGroupService from "../service/chat_group.service.js"
import { nanoid } from "nanoid"
import UserService from "../service/user.service.js"
type Props = [Server, Socket]

/* 群聊 */
export const groupChat = async (...props: Props) => {
  const [io, socket] = props

  /* 上线后先把用户添加进所加入的群组的房间里 */
  socket.on("connected", async (user_id: string) => {
    await joinRoom(user_id, socket)
  })

  /* 查询用户下线后未读的消息 */
  socket.on("unreadMessages", async (to_id: string[], user_id: string, callback) => {
    const user = await UserService.queryUser({ user_id })
    const offline = user.offline

    const ids = to_id.map(i => `'${i}'`)
    const res = await ChatHistoryService.queryUnreadGroupMessages(ids, offline)

    callback(res)
  })

  /* 监听群组消息 */
  socket.on("group_chat", async (room_id: string, params: MessageType, callback) => {
    const { createdAt, user, ...result } = params
    try {
      /* 存储 */
      result.status = 1
      const messageRes = await ChatHistoryService.newMessage({
        ...result,
        ch_id: nanoid(10)
      })
      /* 转发给群组 */
      socket.to(room_id).emit("group_messages", params, async (err: any, res: any) => {
        console.log(res)
        if (res.length === 0) {
          /* 新消息提醒 */
          const groupRes = await ChatGroupService.queryGroup(params.to_id)
          const newData = {
            notice_id: nanoid(10),
            target_id: params.to_id,
            source_id: params.to_id,
            type: "1",
            desc: "",
            done: 0,
            source: {
              avatar: groupRes.group_avatar,
              nick_name: groupRes.group_name,
              user_id: groupRes.group_id
            },
            message: messageRes,
            createdAt: messageRes.dataValues.createdAt
          }
          io.of("/").to(room_id).emit("new_notice_message", newData)
        } else if (res[0] !== "nosave") {
        }
      })

      callback(true)
    } catch (err) {
      callback(false)
    }
  })
}

/* 消息记录 */
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

/* 成员 */
export const groupMumbers = async (...props: Props) => {
  const [io, socket] = props

  socket.on("mumbers", async (group_id: string, callback) => {
    try {
      const res = await group_numbersService.queryMumbers(group_id)
      callback(res)
    } catch (err) {
      console.log(err)
    }
  })
}

/* 更新 */
export const groupUpdate = (...props: Props) => {
  const [io, socket] = props

  socket.on(
    "update",
    async (group_id: string, params: { [key: string]: string }, callback) => {
      try {
        await ChatGroupService.update(group_id, params)
        callback(true)
      } catch (err) {
        callback(false)
        console.log(err)
      }
    }
  )
}
