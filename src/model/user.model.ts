import { DataTypes } from "sequelize"
import seq from "../db/seq.js"
import Feed from "./feed.model.js"

const User = seq.define(
  "users",
  {
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: "用户ID"
    },
    nick_name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "用户昵称"
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: "用户邮箱"
    },
    passwd: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: "用户密码"
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: "用户头像"
    },
    profile_img: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: "用户背景图"
    },
    profile_blurImg: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: "处理过的用户背景图"
    }
  },
  { tableName: "users" }
)

// User.sync({ force: true })
// User.hasMany(Feed, { foreignKey: "feed_userID", sourceKey: "user_id" })
export default User
