import Koa from "koa"
import usersRouter from "../router/users.route.js"
import { koaBody } from "koa-body"
import cors from "@koa/cors"
import staticServe from "koa-static"
import compressRouter from "../router/compress.route.js"

const app = new Koa()

app.use(cors())
app.use(staticServe("src/assets"))
app.use(staticServe("data/resource"))
app.use(koaBody())
app.use(usersRouter.routes()).use(compressRouter.routes())

export default app
