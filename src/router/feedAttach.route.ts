import Router from "koa-router"
import { upload } from "../middleware/upload.middle.js"
import FeedAttachController from "../controller/feedAttach.controller.js"
import { auth } from "../middleware/auth.middleware.js"

const { feedAttachUpload } = FeedAttachController

const uploadRouter = new Router()

uploadRouter.post("/feed_upload", auth, upload, feedAttachUpload)

export default uploadRouter
