import { FeedType, FeedTypeJSON } from "feed.type"

export interface User_FavouriteType {
  user_id: string
  feed_id: string
  createdAt: string
}
export type InComplateFavouriteType = Omit<User_FavouriteType, "feed_id">

export interface UserFavouritedFeeds extends User_FavouriteType {
  feed: Omit<FeedTypeJSON, "user">
}
