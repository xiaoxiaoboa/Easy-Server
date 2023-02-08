import Koa from "koa"
import usersRouter from "../router/users.route.js"
import { koaBody } from "koa-body"
import cors from "@koa/cors";


const app = new Koa()

app.use(cors())
app.use(koaBody())
app.use(usersRouter.routes())

export default app
