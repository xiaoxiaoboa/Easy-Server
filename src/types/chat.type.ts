import { UserType } from "user.type.js"

export interface PrivateMessageType {
  user_id: string
  to_id: string
  msg: string
  createdAt: string
}

export type PrivateMessageSaveType = Omit<PrivateMessageType, "createdAt">
