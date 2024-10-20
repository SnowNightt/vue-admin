

// 获取时间信息
export const getTime = () => {
    let message = ''
    let hours = new Date().getHours()
    if (hours <= 12) {
        message = '上午好！'
    } else if (hours <= 17) {
        message = '下午好！'
    } else {
        message = '晚上好！'
    }
    return message
}