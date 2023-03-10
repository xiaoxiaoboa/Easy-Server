import { DataTypes } from "sequelize"
import seq from "../db/seq.js"
import User from "./user.model.js"
import Feed from "./feed.model.js"

const Feed_attach = seq.define(
  "feed_attach",
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
    attach: {
      type: DataTypes.JSON,
      allowNull: true,
      unique: false,
      comment: "feed包含的图片或视频地址"
    }
  },
  { tableName: "feed_attach", timestamps: false }
)

// Feed_attach.sync({ force: true })

Feed.hasOne(Feed_attach, { foreignKey: "feed_id", sourceKey: "feed_id" })
Feed_attach.belongsTo(Feed, {
  targetKey: "feed_id",
  foreignKey: "feed_id",
  onDelete: "CASCADE"
})

User.hasOne(Feed_attach, { foreignKey: "feed_userID", sourceKey: "user_id" })
Feed_attach.belongsTo(User, {
  targetKey: "user_id",
  foreignKey: "feed_userID",
  onDelete: "CASCADE"
})

export default Feed_attach
