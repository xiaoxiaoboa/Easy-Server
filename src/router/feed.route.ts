import { auth } from "../middleware/auth.middleware.js"
import Router from "koa-router"
import feedController from "../controller/feed.controller.js"
import { upload } from "../middleware/upload.middle.js"

const { publish, feedAttachUpload, queryUserFeeds, queryAllFeeds, likeFeed, deleteFeed } =
  feedController

const feedRouter = new Router()

feedRouter
  .post("/feed_query", auth, queryUserFeeds)
  .post("/feed_create", auth, publish)
  .post("/feed_attach", auth, upload, feedAttachUpload)
  .get("/feeds_all", queryAllFeeds)
  .post("/feed_like", auth, likeFeed)
  .post("/feed_delete", auth, deleteFeed)

export default feedRouter
