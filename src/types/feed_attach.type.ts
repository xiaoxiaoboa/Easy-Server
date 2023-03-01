export interface Feed_attachType {
  feed_id: string
  feed_userID: string
  attach: Feed_attach[]
  count: number
}
export type Feed_attachServiceType = {
  [key in keyof Feed_attachType]: Feed_attachType[key] extends number ? number : string
}
export interface Feed_attach {
  id: string
  type: "image" | "video"
  link: string
}
