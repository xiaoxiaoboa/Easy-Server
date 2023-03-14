import response from "../util/response.js"
import { CommonControllerCTX, CommonControllerNEXT } from "types.js"
import GroupNumbersService from "../service/group_numbers.service.js"

class GroupNumbersController {
  async create(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data = ctx.request.body
    try {
      // const res = await GroupNumbersService.newGroupNumber(data)
      // ctx.body = response(1, "加入群组", res)
    } catch (err) {
      ctx.status = 500
      ctx.body = response(0, "加入失败", `${err}`)
    }
  }

  async queryAllJoined(ctx: CommonControllerCTX, next: CommonControllerNEXT) {
    const data = ctx.request.body
    try {
      const res = await GroupNumbersService.queryJoined(data.user_id)
      ctx.body = response(1, "查询所有加入的群组", res)
    } catch (err) {
      ctx.status = 500
      ctx.body = response(0, "查询群组失败", `${err}`)
    }
  }
}
export default new GroupNumbersController()
