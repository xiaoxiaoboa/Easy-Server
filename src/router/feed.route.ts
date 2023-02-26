import { auth } from "../middleware/auth.middleware.js"
import Router from "koa-router"
import feedController from "../controller/feed.controller.js"
import { upload } from "../middleware/upload.middle.js"

const { publish, feedAttachUpload, queryFeeds, queryAllFeeds } = feedController

const feedRouter = new Router()

feedRouter
  .post("/feed_query", auth, queryFeeds)
  .post("/feed_create", auth, publish)
  .post("/feed_attach", auth, upload, feedAttachUpload)
  .get("/feeds_all", queryAllFeeds)

export default feedRouter
