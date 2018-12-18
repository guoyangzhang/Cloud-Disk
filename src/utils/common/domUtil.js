export default {
    /**
     * 获取标签的真实属性值 包含小数
     * tag 标签对象
     * attr 要获取的属性值
     * isNumber 是否转换为number类型
     */
    getTagComputedStyle (tag, attr, isNumber) {
        if (!tag || !tag.nodeName || typeof tag !== 'object') {
            return isNumber ? 0 : ''
        }
        let attrValue = window.getComputedStyle(tag)[attr]
        if (attrValue.indexOf('px') !== -1) {
            attrValue = attrValue.substring(0, attrValue.length - 2)
        }
        return isNumber ? Number(attrValue) : attrValue
    },
    getStyle (obj, attr) {
        if (obj.currentStyle) {
            return obj.currentStyle[attr]
        } else {
            return document.defaultView.getComputedStyle(obj, null)[attr]
        }
    },
    setBodyFontSize (p) {
        var width = window.innerWidth

        var px = width / 120

        var body = document.getElementsByTagName('body')[0]

        body.style.fontSize = px + 'px'
    },
    offsetTop ($event) {
        let target = $event.nodeName ? $event : $event.target
        let offsetTop = 0
        while (target.previousElementSibling !== null) {
            target = target.previousElementSibling
            offsetTop += target.offsetHeight
            if (target.style.marginTop !== '') {
                offsetTop += parseFloat(target.style.marginTop)
            }
            if (target.style.marginBottom !== '') {
                offsetTop += target.style.marginBottom
            }
        }
        return offsetTop
    },
    //
    offset ($event) {
        let target = $event.nodeName ? $event : $event.target
        let site = {
            left: target.offsetLeft + 'px',
            top: target.offsetTop + 'px'
        }
        return site
    },
    /**
     *
     */
    position ($event) {
        let target = $event.nodeName ? $event : $event.target
        let stTarget = $event.nodeName ? $event : $event.target
        let scrollTop = 0
        let site = {
            left: target.offsetLeft,
            top: target.offsetTop - scrollTop
        }
        while (target.offsetParent) {
            target = target.offsetParent
            site.left += target.offsetLeft
            site.top += target.offsetTop
        }
        while (stTarget.parentNode && stTarget.parentNode.nodeName.toLowerCase() !== 'body') {
            stTarget = stTarget.parentNode
            scrollTop += stTarget.scrollTop
        }
        site.top -= scrollTop
        return site
    },

    /**
     * dom高亮处理，高亮开始
     * @param o dom对象
     * @param flag
     * @param rndColor
     * @param url
     */
    fHl (o, flag, rndColor, url) {
        var bgCor = ''
        var fgCor = ''
        if (rndColor) {
            bgCor = fRndCor(10, 20)
            fgCor = fRndCor(230, 255)
        } else {
            bgCor = '#F0F'
            fgCor = 'red'
        }
        var re = new RegExp(flag, 'i')
        for (var i = 0; i < o.childNodes.length; i++) {
            var o_ = o.childNodes[i]
            var oP = o_.parentNode
            if (o_.nodeType === 1) {
                // 匹配内容时不要对字段名进行匹配，只匹配字段内容
                if (o_.className === 'special') continue
                this.fHl(o_, flag, rndColor, url)
            } else if (o_.nodeType === 3) {
                if (!(oP.nodeName === 'A')) {
                    if (o_.data.search(re) === -1) continue
                    var temp = fEleA(o_.data, flag)
                    oP.replaceChild(temp, o_)
                }
            }
        }

        // ------------------------------------------------
        function fEleA (text, flag) {
            var style = ' style="color:' + fgCor + ';" '
            var o = document.createElement('span')
            var str = ''
            var re = new RegExp('(' + flag + ')', 'gi')
            if (url) {
                str = text.replace(re, '<a href="' + url + '$1"' + style + '>$1</a>')  // 这里是给关键字加链接，红色的$1是指上面链接地址后的具体参数。
            } else {
                str = text.replace(re, '<span ' + style + '>$1</span>')  // 不加链接时显示
            }
            o.innerHTML = str
            return o
        }

        // ------------------------------------------------
        function fRndCor (under, over) {
            if (arguments.length === 1) {
                over = under
                under = 0
            } else if (arguments.length === 0) {
                under = 0
                over = 255
            }
            var r = fRandomBy(under, over).toString(16)
            r = padNum(r, r, 2)
            var g = fRandomBy(under, over).toString(16)
            g = padNum(g, g, 2)
            var b = fRandomBy(under, over).toString(16)
            b = padNum(b, b, 2)
            // defaultStatus=r+' '+g+' '+b
            return '#' + r + g + b

            function fRandomBy (under, over) {
                switch (arguments.length) {
                    case 1:
                        return parseInt(Math.random() * under + 1)
                    case 2:
                        return parseInt(Math.random() * (over - under + 1) + under)
                    default:
                        return 0
                }
            }

            function padNum (str, num, len) {
                var temp = ''
                for (var i = 0; i < len; temp += num, i++) {
                    temp = (temp += str).substr(temp.length - len)
                    return temp
                }
            }
        }
    }
}
