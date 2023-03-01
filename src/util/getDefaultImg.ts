import fs from "fs/promises"
import path from "path"

const directoryPath = path.join(process.cwd(), "/src/assets/images")
const backgroundImg = "background.jpg"
const background_blurImg = "background_blur.webp"

const MIN_NUM = 0
const MAX_NUM = 5

const getDefaultImg = async () => {
  const filesNames = await fs.readdir(directoryPath, "utf-8")

  const randomNum = Math.floor(Math.random() * (MAX_NUM - MIN_NUM)) + MIN_NUM

  const findImg = filesNames.filter(fileName =>
    fileName.includes(randomNum.toString())
  )[0]

  const profile_img = "/images/" + backgroundImg
  const avatar = "/images/" + findImg
  const profile_blurImg = "/images/" + background_blurImg

  return { profile_img, avatar, profile_blurImg }
}

export default getDefaultImg
