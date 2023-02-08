import jwt from "jsonwebtoken"
import { CommonControllerNEXT, CommonControllerCTX } from "../types/types.js"
import { secert_key } from "../config/env.js"
import response from "../util/response.js"

export const auth = async (ctx: CommonControllerCTX, next: CommonControllerNEXT) => {
  const { authorization } = ctx.request.header
  const token = authorization?.replace("Bearer ", "")

  try {
    const user = jwt.verify(token!, secert_key!)
    ctx.state.user = user
  } catch (err) {
    ctx.body = response(0, "token认证失败", err)
    return
  }

  await next()
}
