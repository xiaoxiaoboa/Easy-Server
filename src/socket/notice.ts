import { io } from "../app/index.js"
import { Server, Socket } from "socket.io"
import NoticeService from "../service/notice.service.js"
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
      const noticeRes = await NoticeService.queryFriendRequestNotic(user_id)
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
        createdAt: new Date(),
        msg: "申请成为你的好友"
      }
      console.log(newData)
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
      const userSocketId = socketIdMap.get(friend_id)
      try {
        await FriendsService.createFriend(user_id, friend_id)
        await FriendsService.createFriend(friend_id, user_id)
        await NoticeService.updateNotice(notice_id, true, "01")

        const userRes = await UserService.queryUser({ user_id }, [
          "nick_name",
          "avatar",
          "user_id"
        ])
        const noticeRes = await NoticeService.createNotice({
          notice_id: nanoid(10),
          type: "01",
          desc: user_id,
          target_id: friend_id,
          source_id: user_id
        })
        const newData = {
          ...noticeRes,
          source: userRes,
          msg: "同意了你的好友申请"
        }
        socket.to(userSocketId).emit("agreeRequest", newData)
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
    async (notice_id: string, friend_id: string, user_id: string) => {
      const userSocketId = socketIdMap.get(friend_id)
      try {
        await NoticeService.updateNotice(notice_id, true, "0")
        const userRes = await UserService.queryUser({ user_id }, [
          "nick_name",
          "avatar",
          "user_id"
        ])
        const noticeRes = await NoticeService.createNotice({
          notice_id: nanoid(10),
          type: "00",
          desc: user_id,
          target_id: friend_id,
          source_id: user_id
        })
        const newData = {
          ...noticeRes,
          source: userRes,
          msg: "拒绝了你的好友申请"
        }
        socket.to(userSocketId).emit("rejectRequest", newData)
      } catch (err) {
        console.log(err)
      }
    }
  )
}
