import ChatGroupController from "../controller/chat_group.controller.js"
import GroupNunmbersController from "../controller/group_numbers.controller.js"
import { auth } from "../middleware/auth.middleware.js"
import Router from "koa-router"

const { create: group_create, updateAvatar, queryUnreadMessage } = ChatGroupController
const { create: groupNumber_create, queryAllJoined } = GroupNunmbersController

const groupRouter = new Router()

groupRouter
  .post("/group_create", auth, group_create)
  .post("/group_join", auth, groupNumber_create)
  .post("/group_joined", auth, queryAllJoined)
  .post("/group_avatar", auth, updateAvatar)
  .post("/group_unreadmsg", auth, queryUnreadMessage)

export default groupRouter
