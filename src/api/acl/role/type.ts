interface ResponseData {
    message: string,
    ok: string,
    code: number
}
//职位数据类型
export interface roleDate {
    id?: number;
    createTime?: string;
    updateTime?: string;
    roleName: string;
    remark?: any;
}
//全部职位的数组的ts类型
export type Records = roleDate[]
//全部职位数据的相应的ts类型
export interface RoleResponseData extends ResponseData {
    data: {
        records: Records
        total: number;
        size: number;
        current: number;
        orders?: any[];
        optimizeCountSql: boolean;
        hitCount: boolean;
        countId?: any;
        maxLimit?: any;
        searchCount: boolean;
        pages: number;
    }
}

//菜单与按钮数据的ts类型
export interface MunuData {
    id: number
    createTime: string
    updateTime: string
    pid: number
    name: string
    code: string
    toCode: string
    type: number
    status: null
    level: number
    children?: MenuList
    select: boolean
}
export type MenuList = MunuData[]

//菜单权限与按钮权限数据的ts类型
export interface MenuResponseData extends ResponseData {
    data: MenuList
}
