import { ResponseType } from "../types/types.js"

const response = <T>(
  code: number,
  message: string,
  data: T,
  more?: boolean
): ResponseType<T> => {
  return {
    code,
    message,
    data,
    more
  }
}

export default response
