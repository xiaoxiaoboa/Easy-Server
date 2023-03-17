import { auth } from "../middleware/auth.middleware.js"
import Router from "koa-router"
import feedController from "../controller/feed.controller.js"

const {
  publish,
  queryUserFeeds,
  queryAllFeeds,
  likeFeed,
  deleteFeed,
  queryComment,
  publishComment,
  queryFav,
  deleteComment,
  querAttaches
} = feedController

const feedRouter = new Router()

feedRouter
  .post("/feed_query", auth, queryUserFeeds)
  .post("/feed_create", auth, publish)
  .get("/feeds_all", queryAllFeeds)
  .post("/feed_like", auth, likeFeed)
  .post("/feed_delete", auth, deleteFeed)
  .post("/feed_comment", queryComment)
  .post("/comment_create", auth, publishComment)
  .post("/feed_fav", auth, queryFav)
  .post("/comment_delete", auth, deleteComment)
  .post("/feed_attaches", auth, querAttaches)

export default feedRouter
