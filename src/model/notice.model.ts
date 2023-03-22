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
    target_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: "目标ID"
    },
    source_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: "来源ID"
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
  { tableName: "notice", updatedAt: false, charset: "utf8mb4" }
)
export default Notice

// Notice.sync({ force: true })

User.hasMany(Notice, { foreignKey: "target_id", sourceKey: "user_id" })

Notice.belongsTo(User, {
  targetKey: "user_id",
  foreignKey: "target_id",
  onDelete: "CASCADE"
})

