import { createServer } from "http"
import { Server, Socket } from "socket.io"
import Koa from "koa"
import { koaBody } from "koa-body"
import cors from "@koa/cors"
import staticServe from "koa-static"
import usersRouter from "../router/users.route.js"
import compressRouter from "../router/compress.route.js"
import feedRouter from "../router/feed.route.js"
import groupRouter from "../router/chat_group.route.js"
import range from "koa-range"
import { privateChat, connectd_chat, privateChatHistory } from "../socket/chat.js"
import {
  addFriends,
  agreeRequest,
  connected_root,
  rejectRequest,
  disconnect
} from "../socket/notice.js"
import {
  groupChat,
  groupChatHistory,
  groupMumbers,
  groupUpdate
} from "../socket/group.js"

const app = new Koa()

const server = createServer(app.callback())

export const io = new Server(server, {
  cors: { origin: "*" }
})

app
  .use(cors())
  .use(range)
  .use(staticServe("src/assets"))
  .use(staticServe("data/resource"))
  .use(
    koaBody({
      multipart: true,
      formidable: {
        uploadDir: `${process.cwd()}/data/upload`,
        // keepExtensions: true
      }
    })
  )
  .use(usersRouter.routes())
  .use(compressRouter.routes())
  .use(feedRouter.routes())
  .use(groupRouter.routes())
  .on("error", error => {
    // console.log("server err", error)
  })

/* socket启动 */
const OnRoot = (socket: Socket) => {
  connected_root(io, socket)
  disconnect(io, socket)
  addFriends(io, socket)
  agreeRequest(io, socket)
  rejectRequest(io, socket)
}

const OnChat = (socket: Socket) => {
  // console.log("有程序连接进chat了")
  connectd_chat(io, socket)
  privateChatHistory(io, socket)
  privateChat(io, socket)
}

const OnGroupChat = (socket: Socket) => {

  groupChat(io, socket)
  groupChatHistory(io, socket)
  groupMumbers(io, socket)
  groupUpdate(io, socket)
}

io.of("/", OnRoot)
io.of("/chat", OnChat)
io.of("/group_chat", OnGroupChat)

export default server
