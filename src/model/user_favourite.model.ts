import { DataTypes } from "sequelize"
import seq from "../db/seq.js"
import User from "./user.model.js"

const User_Favourite = seq.define(
  "user_favourite",
  {
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: "用户ID"
    },
    feeds_id: {
      type: DataTypes.JSON,
      allowNull: false,
      unique: false,
      comment: "feeds ID"
    }
  },
  { tableName: "user_favourite", timestamps: false }
)

// User_Favourite.sync({ force: true })
// User_Favourite.belongsTo(User, {
//   targetKey: "user_id",
//   foreignKey: "user_id",
//   onDelete: "CASCADE"
// })

export default User_Favourite
