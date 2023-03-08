import Router from "koa-router"
import usersController from "../controller/users.controller.js"
import {
  loginIsExistVerify,
  registerIsExistVerify,
  bcryptPwd
} from "../middleware/user.middleware.js"
import { auth } from "../middleware/auth.middleware.js"
import { notice_query } from "../controller/notice.controller.js"

const usersRouter = new Router()

const { login, register, alterationCover, queryUser, favourite, getFriends } =
  usersController

usersRouter
  .post("/login", loginIsExistVerify, login)
  .post("/register", registerIsExistVerify, bcryptPwd, register)
  .post("/cover", auth, alterationCover)
  .post("/user", auth, queryUser)
  .post("/fav", auth, favourite)
  .post("/notice", auth, notice_query)
  .post("/friends", auth, getFriends)

/* 测试token */
usersRouter.post("/test", auth, (ctx, next) => {
  ctx.body = "测试"
})

export default usersRouter
