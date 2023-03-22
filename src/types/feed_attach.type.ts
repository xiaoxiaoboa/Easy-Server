export interface Feed_attachType {
  feed_id: string
  feed_userID: string
  attach_id: string
  attach_type: "image" | "video"
  attach_link: string
}
export interface Feed_attach {
  id: string
  type: "image" | "video"
  link: string
}
