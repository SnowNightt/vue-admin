import request from '@/utils/request'
import type { RoleResponseData, roleDate, MenuResponseData } from './type'
enum API {
    // 获取角色分页列表
    GETALLROLES_URL = '/admin/acl/role/',
    // 删除职位
    DELETEROLE_URL = '/admin/acl/role/remove/',
    // 添加职位 post
    ADDROLE_URL = '/admin/acl/role/save',
    // 更新职位 put
    UPDATEROLE_URL = '/admin/acl/role/update',
    // 根据角色获取菜单
    ALLPERMISSTION = '/admin/acl/permission/toAssign/',
    //给相应的职位分配权限
    SETPERMISTION_URL = '/admin/acl/permission/doAssign/?',

}

// 获取所有角色
export const getAllRolesInfo = (page: number, limit: number, roleName: string) => request.get<any, RoleResponseData>(API.GETALLROLES_URL + `${page}/${limit}/?roleName=${roleName}`)
// 删除职位
export const deleteRoleReq = (roleId: number) => request.delete<any, any>(API.DELETEROLE_URL + roleId)
// 添加职位
export const addRoleReq = (data: roleDate) => request.post<any, any>(API.ADDROLE_URL, data)
// 更新职位
export const updateRoleReq = (data: roleDate) => request.put<any, any>(API.UPDATEROLE_URL, data)
// //获取全部的菜单与按钮的数据
export const getAllMenuReq = (roleId: number) => request.get<any, MenuResponseData>(API.ALLPERMISSTION + roleId)
//给相应的职位下发权限
export const reqSetPermisstion = (roleId: number, permissionId: number[]) =>
    request.post<any,any>(
        API.SETPERMISTION_URL + `roleId=${roleId}&permissionId=${permissionId}`,
    )