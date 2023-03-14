import { DataTypes } from "sequelize"
import seq from "../db/seq.js"
import ChatGroup from "./chat_group.model.js"
import User from "./user.model.js"

const GroupNumbers = seq.define(
  "group_numbers",
  {
    group_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: "群组id"
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: "成员id"
    }
  },
  { tableName: "group_numbers", updatedAt: false }
)
export default GroupNumbers

// GroupNumbers.sync({ force: true })

ChatGroup.hasMany(GroupNumbers, { foreignKey: "group_id", sourceKey: "group_id" })
GroupNumbers.belongsTo(ChatGroup, {
  targetKey: "group_id",
  foreignKey: "group_id",
  onDelete: "CASCADE"
})

User.hasMany(GroupNumbers, { foreignKey: "user_id", sourceKey: "user_id" })
GroupNumbers.belongsTo(User, {
  targetKey: "user_id",
  foreignKey: "user_id",
  onDelete: "CASCADE"
})
