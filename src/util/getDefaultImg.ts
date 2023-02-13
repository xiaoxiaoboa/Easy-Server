import fs from "fs/promises"
import path from "path"

const directoryPath = path.join(process.cwd(), "/src/assets/images")
const backgroundImg = "background.jpg"

const MIN_NUM = 0
const MAX_NUM = 5

const getDefaultImg = async () => {
  const filesNames = await fs.readdir(directoryPath, "utf-8")
  const randomNum = Math.ceil(Math.random() * (MAX_NUM - MIN_NUM + MIN_NUM))

  const profile_img =  "/images/" + backgroundImg
  const avatar = "/images/" + filesNames[randomNum]

  return { profile_img, avatar }
}

export default getDefaultImg
