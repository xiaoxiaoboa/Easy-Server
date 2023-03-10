import { DataTypes } from "sequelize"
import seq from "../db/seq.js"
import Feed from "./feed.model.js"
import User from "./user.model.js"

const Feed_Liked = seq.define(
  "feed_liked",
  {
    feed_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: "feed ID"
    },
    feed_userID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: "用户ID"
    },
    liked: {
      type: DataTypes.JSON,
      allowNull: false,
      unique: false,
      comment: "feed被点赞的用户"
    }
  },
  { tableName: "feed_liked", timestamps: false }
)

// Feed_Liked.sync({ force: true })

Feed.hasOne(Feed_Liked, { foreignKey: "feed_id", sourceKey: "feed_id" })
Feed_Liked.belongsTo(Feed, {
  targetKey: "feed_id",
  foreignKey: "feed_id",
  onDelete: "CASCADE"
})
User.hasOne(Feed_Liked, { foreignKey: "feed_userID", sourceKey: "user_id" })
Feed_Liked.belongsTo(User, {
  targetKey: "user_id",
  foreignKey: "feed_userID",
  onDelete: "CASCADE"
})

export default Feed_Liked
