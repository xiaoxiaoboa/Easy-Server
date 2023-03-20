import { io } from "../app/index.js"
import { Server, Socket } from "socket.io"
import NoticeService from "../service/notice.service.js"
import { handleNotice } from "../controller/notice.controller.js"
import UserService from "../service/user.service.js"
import FriendsService from "../service/friends.service.js"
import { nanoid } from "nanoid"
import seq from "../db/seq.js"
import GroupNumbersService from "../service/group_numbers.service.js"
import { joinRoom } from "./group.js"
import ChatHistoryService from "../service/chat_history.service.js"

type Props = [Server, Socket]

export const socketIdMap = new Map()

/* 上线后存储每个客户端的socketid */
export const connected_root = (...props: Props) => {
  const [io, socket] = props

  socket.on("connected", async (socket_id: string, user_id: string) => {
    await joinRoom(user_id, socket)
    socketIdMap.set(user_id, socket_id)
  })

  /* 查询用户下线后未读的消息 */
  socket.on("unreadMessages", async (to_id: string[], user_id: string, callback) => {
    const user = await UserService.queryUser({ user_id })
    const offline = user.offline
    // const groups = await GroupNumbersService.queryJoined(user_id)
    // const groupIds = groups.map(i => i.group_id)

    const ids = to_id.map(i => `'${i}'`)
    const res = await ChatHistoryService.queryUserAll(ids, offline)

    callback(res)
  })
}
/* 下线 */
export const disconnect = (...props: Props) => {
  const [io, socket] = props

  socket.on("disconnect", async () => {
    /* 下线时存储时间 */
    socketIdMap.forEach((val, key) => {
      if (val === socket.id) {
        UserService.updateUser(key, { offline: new Date() })
      }
    })

    // await UserService.updateUser(key,)
  })
}

/* 添加好友请求 */
export const addFriends = (...props: Props) => {
  const [io, socket] = props

  socket.on("friendsRequest", async (self_id: string, user_id: string) => {
    const userSocketId = socketIdMap.get(user_id)

    try {
      const noticeRes = await NoticeService.querySthNotic(user_id, "0")
      const isExist = noticeRes.some(item => item.dataValues.desc === self_id)
      if (isExist) return

      const friendRes = await NoticeService.createNotice({
        notice_id: nanoid(10),
        target_id: user_id,
        source_id: self_id,
        type: "0",
        desc: self_id
      })
      const userRes = await UserService.queryUser({ user_id: self_id }, [
        "user_id",
        "avatar",
        "nick_name"
      ])
      const newData = {
        ...friendRes,
        source: { ...userRes },
        createdAt: new Date()
      }

      socket.to(userSocketId).emit("friendsRequest", newData)
    } catch (err) {
      console.log("好友请求信息数据库存储失败")
    }
  })
}

/* 同意好友请求 */
export const agreeRequest = (...props: Props) => {
  const [io, socket] = props
  socket.on(
    "agreeRequest",
    async (user_id: string, friend_id: string, notice_id: string, callback) => {
      console.log(user_id, friend_id, notice_id)
      try {
        await seq.transaction(async () => {
          await FriendsService.createFriend(user_id, friend_id)
          await FriendsService.createFriend(friend_id, user_id)
          await NoticeService.updateNotice(notice_id, true, "01")
        })
        callback("success")
      } catch (err) {
        console.log("好友信息存储失败")
      }
    }
  )
}

/* 拒绝好友请求 */
export const rejectRequest = (...props: Props) => {
  const [io, socket] = props

  socket.on(
    "rejectRequest",
    async (notic_id: string, friend_id: string, user_id: string) => {
      const userSocketId = socketIdMap.get(friend_id)
      try {
        await NoticeService.updateNotice(notic_id, true, "00")
        const userRes = await UserService.queryUser({ user_id }, ["nick_name"])
        const noticeRes = await NoticeService.createNotice({
          notice_id: nanoid(10),
          type: "00",
          desc: `用户[${userRes.nick_name}]拒绝了你的好友请求`,
          target_id: friend_id,
          source_id: user_id
        })
        const newData = {
          notice: {
            notice_id: noticeRes.nocite_id,
            type: noticeRes.type
          },
          data: { msg: noticeRes.desc, timestamp: noticeRes.createdAt }
        }
        socket.to(userSocketId).emit("rejectRequest", newData)
      } catch (err) {
        console.log(err)
      }
    }
  )
}
