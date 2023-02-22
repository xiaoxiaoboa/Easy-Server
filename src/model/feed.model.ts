import { DataTypes } from "sequelize"
import seq from "../db/seq.js"
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
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: "用户ID"
    },
    feed_text: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
      comment: "feed 内容"
    },
    feed_attach: {
      type: DataTypes.JSON,
      allowNull: true,
      unique: false,
      comment: "feed包含的图片或视频地址"
    },
    feed_liked: {
      type: DataTypes.JSON,
      allowNull: false,
      unique: false,
      comment: "feed被点赞的用户"
    },
    feed_likedCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      unique: false,
      comment: "feed被点赞的数量"
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
  { tableName: "feed" }
)

// Feed.sync({ force: true })
// Feed.belongsTo(User, { targetKey: "user_id", foreignKey: "user_id", onDelete: "CASCADE" })

export default Feed
