import Application from "koa"
import Router from "koa-router"
import { Model } from "sequelize"

export type CommonControllerCTX = Application.ParameterizedContext<
  any,
  Router.IRouterParamContext<any, {}>,
  any
>
export type CommonControllerNEXT = Application.Next

export interface RegisterData {
  nick_name: string
  email: string
  passwd: string
  avatar: string
  profile_img: string
  createAt: string
}
export interface LoginData {
  email: string
  passwd: string
}
export interface UserType {
  id: number
  user_id: string
  nick_name: string
  email: string
  passwd: string
  avatar: string
  profile_img: string
  createAt: string
  updateAt: string
}

export interface UserIsExistType {
  isExist: boolean
  data: Model<UserType> | null
}

export interface ResponseType<T> {
  code: number
  message: string
  data: T
}
