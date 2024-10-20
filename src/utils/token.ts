// 设置登陆获取到的token
export const setUserToken = (token:string)=>{
    localStorage.setItem('TOKEN',token)
}
// 获取用户token
export const getUserToken = ():string=>{
    return (localStorage.getItem('TOKEN') as string)
}

// 删除用户token
export const removeUserToken = ()=>{
    localStorage.removeItem('TOKEN')
}