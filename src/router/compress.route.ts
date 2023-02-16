import Router from "koa-router"
import compress from "../middleware/compress.middle.js"

const compressRouter = new Router()

compressRouter.post("/compress", compress)

export default compressRouter
