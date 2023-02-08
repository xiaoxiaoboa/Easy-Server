import { DataTypes } from "sequelize"
import seq from "../db/seq.js"

const User = seq.define(
  "user",
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
    }
  },
  { tableName: "users" }
)

// User.sync({ force: true })
export default User
