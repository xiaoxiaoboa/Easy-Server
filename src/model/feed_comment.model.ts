import { DataTypes } from "sequelize"
import seq from "../db/seq.js"
import User from "./user.model.js"
import Feed from "./feed.model.js"

const Feed_Comment = seq.define(
  "feed_comment",
  {
    feed_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: "feed ID"
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: "user ID"
    },
    comment_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: "评论ID"
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: false,
      comment: "feed的评论"
    }
  },
  { tableName: "feed_comment", updatedAt: false,charset:"utf8mb4" }
)

// Feed_Comment.sync({ force: true })

Feed.hasMany(Feed_Comment, { foreignKey: "feed_id", sourceKey: "feed_id" })
Feed_Comment.belongsTo(Feed, {
  targetKey: "feed_id",
  foreignKey: "feed_id",
  onDelete: "CASCADE"
})

export default Feed_Comment
