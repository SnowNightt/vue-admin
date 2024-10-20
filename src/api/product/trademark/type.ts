export interface ResponseData {
    code: number
    ok: boolean
    message: string
}
export interface RecordsObj {
    id?: number
    tmName: string
    logoUrl: string
}
export type RecordsArr = RecordsObj[]
export interface ResponseBody extends ResponseData {
    data: {
        records: RecordsArr
        total: number
        size: number
        current: number
        searchCount: boolean
        pages: number
    }

}



  