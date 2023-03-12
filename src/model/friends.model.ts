import { DataTypes } from "sequelize"
import seq from "../db/seq.js"
import User from "./user.model.js"

const Friends = seq.define(
  "friends",
  {
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: "用户id"
    },
    friend_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: "用户好友的id"
    }
  },
  { tableName: "friends", updatedAt: false }
)
export default Friends

// Friends.sync({ force: true })

User.hasMany(Friends, { foreignKey: "user_id", sourceKey: "user_id" })
Friends.belongsTo(User, {
  targetKey: "user_id",
  foreignKey: "user_id",
  onDelete: "CASCADE"
})

User.hasMany(Friends, { foreignKey: "friend_id", sourceKey: "user_id" })
Friends.belongsTo(User, {
  targetKey: "user_id",
  foreignKey: "friend_id",
  onDelete: "CASCADE"
})
