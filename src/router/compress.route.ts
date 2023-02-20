import Router from "koa-router"
import compress from "../middleware/compress.middle.js"
import { auth } from "../middleware/auth.middleware.js"

const compressRouter = new Router()

compressRouter.post("/compress", auth, compress)

export default compressRouter
