import request from '@/utils/request'
import type{UserResponseData,User,AllRoleResponseData,setRoleData} from './type'

enum API{
    GETUSER_URL='/admin/acl/user/',
    SAVEUSER_URL = '/admin/acl/user/save',
    UPDATEUSER_URL = '/admin/acl/user/update',
    // 获取角色数据
    GETROLEINFO_URL = '/admin/acl/user/toAssign/',
    // 角色分配
    SETROLE_URL = '/admin/acl/user/doAssignRole',
    // 删除单个用户
    DELETEUSER_URL = '/admin/acl/user/remove/',
    // 批量删除用户
    DELETESELECTUSER_URL = '/admin/acl/user/batchRemove'
}
// 获取所有用户信息
export const getAllUserReq = (page:number,limit:number,username:string)=>request.get<any,UserResponseData>(API.GETUSER_URL+`${page}/${limit}/?username=${username}`)
// 添加用户的请求
export const saveUserReq = (data:User)=>request.post<any,any>(API.SAVEUSER_URL,data)

// 更新或添加用户
export const saveOrUpdateUserReq = (data:User)=>{
    if(data.id){
        return request.put<any,any>(API.UPDATEUSER_URL,data)
    }else{
        return request.post<any,any>(API.SAVEUSER_URL,data)
    }
}
// 根据用户获取角色数据
export const getAllRoleReq = (adminId:number)=>request.get<any,AllRoleResponseData>(API.GETROLEINFO_URL+adminId)
// 角色分配的请求
export const setRoleReq = (data:setRoleData)=>request.post<any,any>(API.SETROLE_URL,data)
// 删除单个用户
export const deleteUserReq = (id:number)=>request.delete<any,any>(API.DELETEUSER_URL+id)
// 批量删除用户
export const deleteSelectUserReq = (idList:number[])=>request.delete<any,any>(API.DELETESELECTUSER_URL,{data:idList})