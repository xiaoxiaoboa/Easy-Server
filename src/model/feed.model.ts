import { DataTypes } from "sequelize"
import seq from "../db/seq.js"
import Feed_attach from "./feed_attach.model.js"
import Feed_Comment from "./feed_comment.model.js"
import Feed_Liked from "./feed_liked.model.js"
import User from "./user.model.js"

const Feed = seq.define(
  "feed",
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
    feed_text: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: false,
      comment: "feed 内容"
    }
  },
  { tableName: "feed", charset: "utf8mb4" }
)

// Feed.sync({ force: true })
User.hasMany(Feed, { foreignKey: "feed_userID", sourceKey: "user_id" })
Feed.belongsTo(User, {
  targetKey: "user_id",
  foreignKey: "feed_userID",
  onDelete: "CASCADE"
})


export default Feed
