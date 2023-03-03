export interface User_FavouriteType {
  user_id: string
  feed_id: string
  createdAt: string
}
export type InComplateFavouriteType = Omit<User_FavouriteType, "feed_id">
