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
      unique: false,
      comment: "feed ID"
    },
    feed_userID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: "用户ID"
    },
    attach_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: "feed包含的图片或视频地址"
    },
    attach_type: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: "attach类型"
    },
    attach_link: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: "attach链接"
    }
  },
  { tableName: "feed_attach", timestamps: false }
)

// Feed_attach.sync({ force: true })

Feed.hasMany(Feed_attach, {
  foreignKey: "feed_id",
  sourceKey: "feed_id"
})
Feed_attach.belongsTo(Feed, {
  targetKey: "feed_id",
  foreignKey: "feed_id",
  onDelete: "CASCADE",
})

User.hasMany(Feed_attach, { foreignKey: "feed_userID", sourceKey: "user_id" })
Feed_attach.belongsTo(User, {
  targetKey: "user_id",
  foreignKey: "feed_userID",
  onDelete: "CASCADE"
})

export default Feed_attach
