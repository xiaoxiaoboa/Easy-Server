import Router from "koa-router"
import usersController from "../controller/users.controller.js"
import {
  loginIsExistVerify,
  registerIsExistVerify,
  bcryptPwd
} from "../middleware/user.middleware.js"
import { auth } from "../middleware/auth.middleware.js"
import { notice_message, updateNotice, notice } from "../controller/notice.controller.js"

const usersRouter = new Router()

const {
  login,
  register,
  alterationCover,
  queryUser,
  favourite,
  getFriends,
  messageUpload,
  alterationAvatar,
  delFriend
} = usersController

usersRouter
  .post("/login", loginIsExistVerify, login)
  .post("/register", registerIsExistVerify, bcryptPwd, register)
  .post("/cover", auth, alterationCover)
  .post("/user", auth, queryUser)
  .post("/fav", auth, favourite)
  .post("/friends", auth, getFriends)
  .post("/notice_message", auth, notice_message)
  .post("/read", auth, updateNotice)
  .post("/notice", auth, notice)
  .post("/message_upload", auth, messageUpload)
  .post("/avatar", auth, alterationAvatar)
  .post("/del_friend", auth, delFriend)

/* 测试token */
usersRouter.post("/test", auth, (ctx, next) => {
  ctx.body = "测试"
})

export default usersRouter
