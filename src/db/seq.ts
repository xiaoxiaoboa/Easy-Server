import { Sequelize } from "sequelize"
import { mysql } from "../config/env.js"

const { host, port, root, pwd, db } = mysql

const seq = new Sequelize(db, root, pwd, {
  host: host,
  dialect: "mysql",
  dialectOptions: {
    dateStrings: true,
    typeCast: true
  },
  timezone: "+08:00",
  logging: false
})

seq
  .authenticate()
  .then(() => console.log("数据库连接成功"))
  .catch(() => console.log("数据库连接失败"))

export default seq
