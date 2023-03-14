import { DataTypes } from "sequelize"
import seq from "../db/seq.js"
import User from "./user.model.js"

const ChatHistory = seq.define(
  "chat_history",
  {
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: "消息所属用户"
    },
    to_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: "消息发送目标的用户id"
    },
    msg: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: "消息文本"
    }
  },
  { tableName: "chat_history", updatedAt: false }
)
export default ChatHistory

// ChatHistory.sync({ force: true })

User.hasMany(ChatHistory, { foreignKey: "user_id", sourceKey: "user_id" })
ChatHistory.belongsTo(User, {
  targetKey: "user_id",
  foreignKey: "user_id",
  onDelete: "CASCADE"
})
