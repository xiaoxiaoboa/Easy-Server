import { UserType } from "user.type.js"

export interface MessageType {
  user_id: string
  to_id: string
  msg: string
  conversation_id: string
  user: {
    avatat: string
    nick_name: string
  }
  createdAt: string
}

export type MessageSaveType = Omit<MessageType, "createdAt" | "user" | "conversation_id">

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
