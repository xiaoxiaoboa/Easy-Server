export interface Feed_LikedType {
  feed_id: string
  feed_userID: string
  liked: string[]
  count: number
}

export type Feed_LikedServiceType = {
  [key in keyof Feed_LikedType]: Feed_LikedType[key] extends number ? number : string
}