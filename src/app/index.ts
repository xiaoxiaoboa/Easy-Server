import Koa from "koa"
import { koaBody } from "koa-body"
import cors from "@koa/cors"
import staticServe from "koa-static"
import usersRouter from "../router/users.route.js"
import compressRouter from "../router/compress.route.js"
import feedRouter from "../router/feed.route.js"
import range from "koa-range"

const app = new Koa()

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
  
  
export default app
