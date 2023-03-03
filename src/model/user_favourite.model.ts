import { DataTypes } from "sequelize"
import seq from "../db/seq.js"
import Feed from "./feed.model.js"
import User from "./user.model.js"

const User_Favourite = seq.define(
  "user_favourite",
  {
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: "用户ID"
    },
    feed_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: "feed ID"
    }
  },
  { tableName: "user_favourite", updatedAt: false }
)

// User_Favourite.sync({ force: true })
User.hasMany(User_Favourite, { foreignKey: "user_id", sourceKey: "user_id" })
User_Favourite.belongsTo(User, {
  targetKey: "user_id",
  foreignKey: "user_id",
  onDelete: "CASCADE"
})
Feed.hasMany(User_Favourite, { foreignKey: "feed_id", sourceKey: "feed_id" })
User_Favourite.belongsTo(Feed, {
  targetKey: "feed_id",
  foreignKey: "feed_id",
  onDelete: "CASCADE"
})

export default User_Favourite
