//账号信息的ts类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
//代表一个账号信息的ts类型
export interface User {
  id?: number
  createTime?: string
  updateTime?: string
  username: string
  password?: string
  name: string
  phone?: null
  roleName?: string
}
//数组包含全部的用户信息
export type Records = User[]
//获取全部用户信息接口返回的数据ts类型
export interface UserResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    pages: number
  }
}

// 角色类型
export interface RoleData {
  id?: number;
  createTime?: string;
  updateTime?: string;
  roleName: string;
  remark?: any;
}
export interface AllRoleResponseData extends ResponseData{
  data:{
    assignRoles:RoleData[],
    allRolesList:RoleData[]
  }
}

// 角色分配请求需要的参数的类型
export interface setRoleData{
  roleIdList: number[]
  userId: number
}