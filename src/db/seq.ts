import { Sequelize } from "sequelize"
import { mysql } from "../config/env.js"
// const { Sequelize } = require("sequelize")
// const config = require('../config/env')

const { host, port, root, pwd, db } = mysql

const seq = new Sequelize(db, root, pwd, {
  host: host,
  dialect: "mysql",
  timezone: '+08:00'
})

seq
  .authenticate()
  .then(() => console.log("连接成功"))
  .catch(() => console.log("连接失败"))

export default seq
