import { auth } from "../middleware/auth.middleware.js"
import Router from "koa-router"
import feedController from "../controller/feed.controller.js"

const { publish } = feedController

const feedRouter = new Router()

feedRouter.post("/create_feed", auth, publish)

export default feedRouter
