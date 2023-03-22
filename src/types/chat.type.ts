import { UserType } from "user.type.js"

export interface MessageType {
  user_id: string
  to_id: string
  msg: string
  msg_type: string
  conversation_id: string
  user: {
    avatat: string
    nick_name: string
  }
  createdAt: string
  status: number
}

export type MessageSaveType = Omit<
  MessageType,
  "createdAt" | "user" | "conversation_id"
> & {
  ch_id: string
}

export interface ChatGroupSaveType {
  group_id: string
  group_owner: string
  group_name: string
  group_avatar: string
  group_desc: string
}
export interface GroupNumbersSaveType {
  group_id: string
  user_id: string
}
