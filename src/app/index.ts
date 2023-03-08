import { createServer } from "http"
import { Server, Socket } from "socket.io"
import Koa from "koa"
import { koaBody } from "koa-body"
import cors from "@koa/cors"
import staticServe from "koa-static"
import usersRouter from "../router/users.route.js"
import compressRouter from "../router/compress.route.js"
import feedRouter from "../router/feed.route.js"
import range from "koa-range"
import { privateChat, groupChat } from "../socket/chat.js"
import { addFriends, agreeRequest, online, rejectRequest } from "../socket/notice.js"

const app = new Koa()

const server = createServer(app.callback())

export const io = new Server(server, {
  cors: { origin: ["http://localhost:5173", "http://localhost:4173"] }
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
        keepExtensions: true
      }
    })
  )
  .use(usersRouter.routes())
  .use(compressRouter.routes())
  .use(feedRouter.routes())
  .on("error", error => {
    // console.log("server err", error)
  })

// io.on("connection", socket => {
//   console.log("连接到copy")
//   io.to(socket.id)
//     .timeout(1000)
//     .emit("online", "哈哈", (err: any, response: any) => {
//       if (err) {
//         console.log(err)
//       } else {
//         console.log("res:", response)
//       }
//     })
// })

/* socket启动 */
const OnRoot = (socket: Socket) => {
  // console.log("连接到root")
  online(io, socket)
  addFriends(io, socket)
  agreeRequest(io, socket)
  rejectRequest(io, socket)
}

const OnChat = (socket: Socket) => {
  // console.log("有程序连接进chat了")
  privateChat(io, socket)

  /* 退出 */
  socket.on("disconnection", () => console.log("有程序退出了"))
}

const OnGroupChat = (socket: Socket) => {
  // console.log("有程序连接进group了")

  groupChat(io, socket)
}

io.of("/", OnRoot)
io.of("/chat", OnChat)
io.of("/group_chat", OnGroupChat)
export default server
