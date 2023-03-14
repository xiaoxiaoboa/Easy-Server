import { DataTypes } from "sequelize"
import seq from "../db/seq.js"

const ChatGroup = seq.define(
  "chat_group",
  {
    group_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: "群组id"
    },
    group_owner: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: "群主id"
    },
    group_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: "群组名称"
    },
    group_avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: "群组头像"
    },
    group_desc: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: false,
      comment: "群组描述"
    }
  },
  { tableName: "chat_group", updatedAt: false }
)

export default ChatGroup

// ChatGroup.sync({ force: true })
