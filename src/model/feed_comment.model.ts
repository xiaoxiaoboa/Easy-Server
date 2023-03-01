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
      unique: true,
      comment: "feed ID"
    },
    feed_userID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: "用户ID"
    },
    feed_comment: {
      type: DataTypes.JSON,
      allowNull: false,
      unique: false,
      comment: "feed的评论"
    },
    feed_commentCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      unique: false,
      comment: "feed被评论的数量"
    }
  },
  { tableName: "feed_comment", timestamps: false }
)

// Feed_Comment.sync({ force: true })

Feed.hasOne(Feed_Comment, { foreignKey: "feed_id", sourceKey: "feed_id" })
Feed_Comment.belongsTo(Feed, {
  targetKey: "feed_id",
  foreignKey: "feed_id",
  onDelete: "CASCADE"
})

export default Feed_Comment
