export default {
    // 计算时间差
    getDatePoor (start, end) {
        end = end || new Date()
        let startTime = new Date(start).getTime()
        let endTime = new Date(end).getTime()
        if (startTime > endTime) {
            let curTime = new Date().getTime()
            return curTime - startTime
        }
        return endTime - startTime
    },
    /**
     * 秒转天时分秒
     */
    secondToDate (second) {
        if (!second) {
            return ''
        }
        second = parseInt(second)
        let s = 0
        let m = 0
        let h = 0
        let d = 0
        s = second % 60
        m = parseInt(second / 60)
        if (m >= 60) {
            h = parseInt(m / 60)
            m = m % 60
        }
        if (h >= 24) {
            d = parseInt(h / 24)
        }
        h = h % 24
        if (d !== 0) {
            return d + '天' + h + '时' + m + '分' + s + '秒'
        }
        if (h !== 0) {
            return h + '时' + m + '分' + s + '秒'
        }
        if (m !== 0) {
            return m + '分' + s + '秒'
        }
        return s + '秒'
    },
    /**
     * 日期格式化
     */
    dateFormat (date = new Date(), fmt = 'yyyy-MM-dd hh:mm:ss') {
        date = typeof date === 'number' ? new Date(date) : date
        let o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'q+': Math.floor((date.getMonth() + 3) / 3),
            'S': date.getMilliseconds()
        }
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        for (let k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
            }
        }
        return fmt
    },
    /**
     * 添加减少年  返回新的日期对象
     */
    addYear (date, year = 0) {
        if (Math.abs(year) === 0) {
            return date
        }
        return new Date(date.getFullYear() + year, date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
    },
    /**
     * 添加减少月  返回新的日期对象
     */
    addMonth (date, month = 0) {
        if (Math.abs(month) === 0) {
            return date
        }
        return new Date(date.getFullYear(), date.getMonth() + month, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
    },
    /**
     * 添加减少天数  返回新的日期对象
     */
    addDate (date, days = 0) {
        if (Math.abs(days) === 0) {
            return date
        }
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, date.getHours(), date.getMinutes(), date.getSeconds())
    },
    /**
     * 添加减少小时  返回新的日期对象
     */
    addHour (date, hour = 0) {
        if (Math.abs(hour) === 0) {
            return date
        }
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + hour, date.getMinutes(), date.getSeconds())
    },
    /**
     * 添加减少分钟  返回新的日期对象
     */
    addMinute (date, minute = 0) {
        if (Math.abs(minute) === 0) {
            return date
        }
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes() + minute, date.getSeconds())
    },
    /**
     * 添加减少秒钟  返回新的日期对象
     */
    addSecond (date, second = 0) {
        if (Math.abs(second) === 0) {
            return date
        }
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() + second)
    },
    dateFormat2 (d, istime) {
        if (!d) return null
        if (typeof d === 'number') {
            d = new Date(d)
        }
        var year = d.getFullYear()
        var month = this.fixzero(d.getMonth() + 1, 2)
        var date = this.fixzero(d.getDate(), 2)
        var str = year + '-' + month + '-' + date
        if (istime) {
            var hour = this.fixzero(d.getHours(), 2)
            var min = this.fixzero(d.getMinutes(), 2)
            var sec = this.fixzero(d.getSeconds(), 2)
            str += ' ' + hour + ':' + min + ':' + sec
        }
        return str
    },
    dateParse (s, istime) {
        var d = new Date()
        var year = s.substring(0, 4)
        var month = (s.substring(5, 7) - 1)
        var date = s.substring(8, 10)
        d.setFullYear(year, month, date)
        if (istime) {
            var hour = s.substring(11, 13)
            var min = s.substring(14, 16)
            var sec = s.substring(17, 19)
            d.setHours(hour, min, sec, 0)
        }
        return d
    },
    /**
     * 补零
     */
    fixzero (s, size) {
        s = s.toString()
        if (s.length === size) return s
        var dest = ''
        for (var i = 0; i < size - s.length; i++) {
            dest += '0'
        }
        return dest + s
    },
    /**
     * 转换日期格式
     * @param now
     */
    dateToString (now = new Date()) {
        let month = (now.getMonth() + 1).toString().length > 1 ? now.getMonth() + 1 : '0' + (now.getMonth() + 1)
        let day = now.getDate().toString().length > 1 ? now.getDate() : '0' + now.getDate()
        return now.getFullYear() + '-' + month + '-' + day
    },
    /**
     * 返回时间短提示
     * @param date 毫秒值-1524122125363/日期格式-date对象/字符串模板格式-‘2017-01-30 11:11:11’或"2018/03/22 17:30:20"
     */
    shortTime (date) {
        let d, str = ''
        if (date) {
            if (typeof date === 'string') {
                // chrome浏览器能够识别"2018/03/22 17:30:20"和"2018-03-22 17:30:20"
                // firefox和ie浏览器只能识别"2018/03/22 17:30:20"
                d = new Date(date.replace(/-/g, '/'))
            } else if (date instanceof Date) {
                d = date
            }
            if (d) {
                str = this.dateFormat(d)
                var current = new Date()
                // 获取相关秒数
                var diff = (current.getTime() - d.getTime()) / 1000
                if (diff >= 0) {
                    if (diff < 60) {
                        str = '刚刚'
                    } else if (diff < (60 * 60)) {
                        str = parseInt(diff / 60) + "分钟前"
                    } else if (diff < (60 * 60 * 24)) {
                        str = parseInt(diff / (60 * 60)) + "小时前"
                    } else if (diff < (60 * 60 * 24 * 30)) {
                        str = parseInt(diff / (60 * 60 * 24)) + "天前"
                    } else if (diff < (60 * 60 * 24 * 365)) {
                        str = parseInt(diff / (60 * 60 * 24 * 30)) + "个月前"
                    } else if (diff >= (60 * 60 * 24 * 365)) {
                        str = parseInt(diff / (60 * 60 * 24 * 365)) + "年前"
                    }
                }
            }
        }
        return str
    }
}