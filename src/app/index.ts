import Koa from "koa"
import { koaBody } from "koa-body"
import cors from "@koa/cors"
import staticServe from "koa-static"
import usersRouter from "../router/users.route.js"
import compressRouter from "../router/compress.route.js"
import feedRouter from "../router/feed.route.js"

const app = new Koa()

app.use(cors())
app.use(staticServe("src/assets"))
app.use(staticServe("data/resource"))
app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: `${process.cwd()}/data/upload`,
      keepExtensions: true
    }
  })
)
app.use(usersRouter.routes()).use(compressRouter.routes()).use(feedRouter.routes())

export default app
