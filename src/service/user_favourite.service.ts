import Feed from "../model/feed.model.js"
import { User_FavouriteType } from "user_favourite.type.js"
import User_Favourite from "../model/user_favourite.model.js"

class User_FavouriteService {
  async createFavourite(params: any) {
    try {
      const res = await User_Favourite.create({ ...params })
      return res.dataValues
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 查找favourite */
  async queryFavourite(user_id?: string): Promise<User_FavouriteType[]> {
    try {
      const res = await User_Favourite.findAll({ where: { user_id } })
      return JSON.parse(JSON.stringify(res))
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 删除一个 */
  async deleteFavourite(feed_id: string) {
    try {
      const res = await User_Favourite.destroy({ where: { feed_id } })
      return res
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  /* 新增一个 */
  async newFav(user_id: string, feed_id: string) {
    try {
      const res = await User_Favourite.create({ user_id, feed_id })
      return res.dataValues
    } catch (err) {
      throw Error("", { cause: err })
    }
  }

  
}

export default new User_FavouriteService()
