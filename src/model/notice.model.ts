import { DataTypes } from "sequelize"
import seq from "../db/seq.js"
import User from "../model/user.model.js"

const Notice = seq.define(
  "notice",
  {
    notice_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: "id"
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: "用户ID"
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: "通知类型"
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: false,
      comment: "内容"
    },
    done: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      unique: false,
      comment: "是否完成",
      defaultValue: false
    }
  },
  { tableName: "notice", updatedAt: false }
)
export default Notice

// Notice.sync({ force: true })

User.hasMany(Notice, { foreignKey: "user_id", sourceKey: "user_id" })

Notice.belongsTo(User, {
  targetKey: "user_id",
  foreignKey: "user_id",
  onDelete: "CASCADE"
})
