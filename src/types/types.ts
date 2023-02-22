import Application from "koa"
import Router from "koa-router"
import { Model } from "sequelize"

export type CommonControllerCTX = Application.ParameterizedContext<
  any,
  Router.IRouterParamContext<any, {}>,
  any
>
export type CommonControllerNEXT = Application.Next

export interface ResponseType<T> {
  code: number
  message: string
  data: T
}
