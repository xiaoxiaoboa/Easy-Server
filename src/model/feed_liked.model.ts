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
      unique: false,
      comment: "feed ID"
    },
    liked: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: "feed被点赞的用户"
    }
  },
  { tableName: "feed_liked", timestamps: false }
)

// Feed_Liked.sync({ force: true })

Feed.hasMany(Feed_Liked, { foreignKey: "feed_id", sourceKey: "feed_id" })
Feed_Liked.belongsTo(Feed, {
  targetKey: "feed_id",
  foreignKey: "feed_id",
  onDelete: "CASCADE"
})

export default Feed_Liked
