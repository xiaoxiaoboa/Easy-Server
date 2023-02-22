export interface RegisterData {
  nick_name: string
  email: string
  passwd: string
  avatar: string
  profile_img: string
  profile_blurImg: string
}

export interface LoginData {
  email: string
  passwd: string
}

export interface UserType extends RegisterData {
  id: number
  user_id: string
  createdAt: string
  updatedAt: string
}

export interface CompressRequestType {
  user_id: string
  pic: File
  base64: string
}

export interface AlterationCoverType {
  user_id: string
  base64: {
    background: string
    background_blur: string
  }
}

export interface QueryUserParamsType {
  [key: string]: string
}
