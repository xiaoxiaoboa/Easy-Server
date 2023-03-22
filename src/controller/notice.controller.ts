import response from "../util/response.js"
import { CommonControllerCTX, CommonControllerNEXT } from "types.js"
import NoticeService from "../service/notice.service.js"
import UserService from "../service/user.service.js"

/* 查询notice未读私聊消息 */
export const notice_message = async (
  ctx: CommonControllerCTX,
  next: CommonControllerNEXT
) => {
  const data = ctx.request.body
  try {
    const res = await NoticeService.queryMessageNotice(data.user_id, data.type)
    ctx.body = response(1, "查询到了未读消息", res)
  } catch (err) {
    ctx.status = 500
    ctx.body = response(0, "查询失败", `${err}`)
  }
}

/* 将和已读消息相关的记录都更新为已读 */
export const updateNotice = async (
  ctx: CommonControllerCTX,
  next: CommonControllerNEXT
) => {
  const data = ctx.request.body
  try {
    const params = {
      source_id: data.source_id,
      notice_id: data.notice_id
    }
    await NoticeService.updateRelateToSource(params)
    ctx.body = response(1, "消息已读", null)
  } catch (err) {
    ctx.status = 500
    ctx.body = response(0, "修改失败", `${err}`)
  }
}

/* 查询好友请求点赞评论的未读通知 */
export const notice = async (ctx: CommonControllerCTX, next: CommonControllerNEXT) => {
  const data = ctx.request.body
  try {
    const res = await NoticeService.queryNotice(data.target_id)
    if (res.length > 0) {
      const user_ids = res.map(i => i.dataValues.desc)
      const userRes: any[] = await UserService.queryManyUsers(user_ids)
      for (const item of res) {
        item.dataValues.source = userRes.find(i => i.user_id === item.dataValues.desc)
        switch (item.dataValues.type) {
          case "0":
            item.dataValues.msg = "申请成为你的好友"
            break
          case "01":
            item.dataValues.msg = "同意了你的好友申请"
            break
          case "00":
            item.dataValues.msg = "拒绝了你的好友申请"
            break
          case "2":
            item.dataValues.msg = "给你的帖子评论啦"
            
            break
          case "3":
            item.dataValues.msg = "给你的帖子点赞啦"
            break
          default:
            item.dataValues.msg = ""
            break
        }
      }
    }
    ctx.body = response(1, "查询成功", res)
  } catch (err) {
    ctx.status = 500
    ctx.body = response(0, "查询失败", `${err}`)
  }
}

/* 查询好友请求 */
// export const

/* 
  通知类型：
  type                desc
  0 添加好友的请求      user_id 
  01  同意好友
  00  拒绝好友         拒绝信息

  1 聊天消息           {user_id,msg}
  2 评论消息           {user_id,msg}   21已读
  3 点赞消息           user_id   
  
*/
