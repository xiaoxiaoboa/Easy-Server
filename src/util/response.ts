import { ResponseType } from "../types/types.js"

const response = <T>(code: number, message: string, data: T): ResponseType<T> => {
  return {
    code,
    message,
    data
  }
}

export default response
