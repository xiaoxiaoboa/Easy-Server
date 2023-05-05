import dotenv from "dotenv"

dotenv.config()

const port = parseInt(process.env.APP_LOCALHOST_PORT!) || 3000
const mysql = {
  host: process.env.MYSQL_HOST || "localhost",
  port: process.env.MYSQL_PORT || 3306,
  root: process.env.MYSQL_ROOT || "root",
  pwd: process.env.MYSQL_PWD || "",
  db: process.env.MYSQL_DB || ""
}

const secert_key = process.env.SECRET_KEY

const baseUrl = process.env.APP_BASE_URL

export { port, mysql, secert_key, baseUrl }
