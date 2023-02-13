import Koa from "koa"
import usersRouter from "../router/users.route.js"
import { koaBody } from "koa-body"
import cors from "@koa/cors"
import getDefaultImg from "../util/getDefaultImg.js"
import staticServe from "koa-static";

const app = new Koa()

app.use(cors())
app.use(staticServe('src/assets'))
app.use(koaBody())
app.use(usersRouter.routes())

getDefaultImg()

export default app
