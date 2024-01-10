var rootElement = _getRootFrameElement();
$(function () {
    //去除Enter键和Backspace键，避免按这两个键退出系统的问题
    $(document).keydown(function (e) {
        var doPrevent;
        if (e.keyCode == 8 || e.keyCode == 13) {//注：8为Backspace键，13为Enter键
            var d = e.srcElement || e.target;
            if (d.tagName.toUpperCase() == 'INPUT' || d.tagName.toUpperCase() == 'TEXTAREA' || $(d).attr('contenteditable') == "true") {
                doPrevent = d.readOnly || d.disabled;
            } else {
                doPrevent = true;
            }
        } else {
            doPrevent = false;
        }
        // //F5刷新 和 ctrl+R
        // if ((e.ctrlKey && e.keyCode == 82) ||
        //     e.keyCode == 116) {
        //     for (var key in window) {
        //         try {
        //             window[key] = null;
        //         } catch (e) {
        //
        //         }
        //     }
        // }
        if (doPrevent)
            e.preventDefault();
    });


    if (!rootElement.keepTimer) {
        //控制面板无操作问题  防止五分钟失效  两分钟刷新一次
        rootElement.keepTimer = setInterval(ajaxKeepSessionLive, 120000);
    }

    /**
     * 保证会话有效
     */
    function ajaxKeepSessionLive() {
        //向服务器发送ajax请求，添加随机数，避免IE下Ajax使用缓存导致session过期
        var keepSessionUrl = "StandardLoginAction_keepSessionLive.action?requestTime=" + Date.parse(new Date());
        $.ajax({
            url: keepSessionUrl,
            type: "GET",
            dataType: "json",
            success: function (data) {
            }
        });
    }
});

//字符串是否s结束
String.prototype.endWith = function (s) {
    if (s == null || s == "" || this.length == 0 || s.length > this.length)
        return false;
    if (this.substring(this.length - s.length) == s)
        return true;
    else
        return false;
    return true;
};
//字符串是否s开始
String.prototype.startWith = function (s) {
    if (s == null || s == "" || this.length == 0 || s.length > this.length)
        return false;
    if (this.substr(0, s.length) == s)
        return true;
    else
        return false;
    return true;
};
///<summary>获得字符串实际长度，中文2，英文1</summary>
///<param name="str">要获得长度的字符串</param>
String.prototype.realLength = function () {
    var realLength = 0, len = this.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = this.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128)
            realLength += 1;
        else realLength += 2;
    }
    return realLength;
}
//截取字符串
String.prototype.getRealSubStr = function (start, lenth) {
    var charCode = -1, retStr = '';
    var str = this.substr(start, lenth);
    var realLength = retStr.realLength();

    var i = 0;
    while (realLength <= lenth && i <= lenth) {
        retStr += str.substr(i, 1);
        realLength = retStr.realLength();
        i++;
    }
    return retStr;
}

/**
 * 获取字符串字节长度
 * @returns {number}
 */
String.prototype.getBytesLength = function () {
    return this.replace(/[^\x00-\xff]/gi, "--").length;
}

/**
 * 全部替换
 * g 执行全局匹配（查找所有匹配而非在找到第一个匹配后停止）
 * m 执行多行匹配
 * @param regex  //被替换的
 * @param replacement //替换的
 * @returns String
 */
String.prototype.replaceAll = function (regex, replacement) {
    //this.replace(/regex/g, replacement)
    return this.replace(new RegExp(regex, "gm"), replacement);
}

/**
 * 比较字符串是否相等，不区分大小写
 * @param str
 * @returns {Boolean}
 */
String.prototype.compareNotCase = function (str) {
    return this.toLowerCase() == str.toLowerCase();
}

/**
 * 判断字符串str是否包含在本字符串中
 * @param str
 * @returns {Boolean}
 */
String.prototype.indexOfNotCase = function (str) {
    return this.toLowerCase().indexOf(str.toLowerCase());
}

// 根据回调函数查找数组中的值
// ES6方法，兼容ES5的重写方法
Array.prototype.find = function (callback) {
    for (var i = 0; i < this.length; i++) {
        if (callback(this[i])) {
            return this[i];
        }
    }
    return null;
}


var getLength = function (str) {
    ///<summary>获得字符串实际长度，中文2，英文1</summary>
    ///<param name="str">要获得长度的字符串</param>
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128)
            realLength += 1;
        else realLength += 2;
    }
    return realLength;
};

//数组中是否存在e
Array.prototype.S = String.fromCharCode(2);
Array.prototype.in_array = function (e) {
    var r = new RegExp(this.S + e + this.S);
    return (r.test(this.S + this.join(this.S) + this.S));
};

//数组中e 的下标
Array.prototype.getIndex = function (e) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == e) {
            return i;
        }
    }
};

function toggleMyClass(mid, obj, className) {
    $(mid).each(function () {
        if (this == obj) {
            $(this).addClass(className);
        } else {
            $(this).removeClass(className);
        }
    });
};

/**
 * 音频文件获取编码后的字符串
 * js和java的ascii 1-127的字符循环编码匹配不同
 *    ascii      java        js
 *               +        %20
 *    !           %21        !
 *    '           %27        '
 *    (           %28        (
 *    )           %29        )
 *    ~           %7E        ~
 *    js 编码后对特殊字符做个处理
 */
function audioFileEncodeURI(value) {

    value = encodeURI(value);
    value = value.replace(/%20/gi, "+").replace(/(!)|(')|(\()|(\))|(\~)/gi, function (item) {
        return "%" + item.charCodeAt(0).toString(16).toLocaleUpperCase();
    });
    return value;
}

//获取数组中所有id组成的新数组 type 类型 'id' 或者 'name'
function getNewArrayByArray(array, type) {
    var newArray = [];
    if (type == null || array == null) {
        return newArray;
    }
    for (var i = 0; i < array.length; i++) {
        if (type == 'id') {
            if (array[i].id) {
                newArray.push(array[i].id);
            }
        } else if (type == 'vehiId') {
            if (array[i].vehiId) {
                newArray.push(array[i].vehiId);
            }
        } else if (type == 'name') {
            newArray.push(array[i].name);
        } else if (type == 'nm') {
            newArray.push(array[i].nm);
        }
    }
    return newArray;
};

//获取数组中值与值相同的id
function getArrayId(array, name) {
    if (name == null) {
        return 0;
    }
    for (var i = 0; i < array.length; i++) {
        if (array[i].name == name) {
            return array[i].id;
        }
    }
    return 0;
};

//获取数组中id与id相同的值
function getArrayName(array, id) {
    if (id == null) {
        return '';
    }
    for (var i = 0; i < array.length; i++) {
        if (array[i].id !== '' && array[i].id == id) {
            return array[i].name;
        }
    }
    return '';
};

//获取数组中id与id相同的数据
function getArrayObj(array, id) {
    if (id == null) {
        return '';
    }
    for (var i = 0; i < array.length; i++) {
        if (array[i].id == id) {
            return array[i];
        }
    }
    return '';
};

//获取数组中属性为param 的值为value 的  属性param2 的值
function getArrayParam(array, key, keyParam, resultRaram) {
    if (key == null || keyParam == null || resultRaram == null) {
        return '';
    }
    for (var i = 0; i < array.length; i++) {
        if (array[i][keyParam] == key) {
            return array[i][resultRaram];
        }
    }
    return '';
};

//多个获取获取数组中属性为param 的值为value 的  属性param2 的值
function getArrayParams(array, keys, keyParam, resultRaram) {
    if (keys == null || keyParam == null || resultRaram == null) {
        return '';
    }
    var keys_ = keys.split(',')
    var resultRaram_ = [];
    if (keys_ && keys_.length > 0) {
        for (var k = 0, j = keys_.length; k < j; k++) {
            var key = keys_[k];
            for (var i = 0; i < array.length; i++) {
                if (array[i][keyParam] == key) {
                    resultRaram_.push(array[i][resultRaram]);
                    break;
                }
            }
        }
    }
    return resultRaram_;
}


////获取数组中id与id相同的值
//function getMarkArrayName(array,id) {
//	if(id == null) {
//		return '';
//	}
//	for(var i = 0; i < array.length; i++) {
//		if(array[i].i == id) {
//			return array[i].n;
//		}
//	}
//	return '';
//};


//
function getArrayLevel(array, id) {
    if (id == null) {
        return '';
    }
    for (var i = 0; i < array.length; i++) {
        if (array[i].id == id) {
            return array[i].level;
        }
    }
    return '';
};

//根据id返回相应对象
function getArrayInfo(array, id) {
    if (id == null) {
        return null;
    }
    for (var i = 0; i < array.length; i++) {
        if (array[i].id == id) {
            return array[i];
        }
    }
    return null;
}

//根据id返回相应对象的索引
function getArrayIndex(array, id) {
    if (id == null) {
        return 0;
    }
    for (var i = 0; i < array.length; i++) {
        if (array[i].id == id) {
            return i;
        }
    }
    return 0;
}

function arrayToStr(arr) {
    var str = '';
    for (var i = 0; i < arr.length; i++) {
        if (i != 0) str += '|';
        str += arr[i].id + '&' + arr[i].name;
    }
    return str;
}

function arrayAbbrToStr(arr) {
    var str = '';
    for (var i = 0; i < arr.length; i++) {
        if (i != 0) str += '|';
        str += arr[i].id + '&' + arr[i].abbr;
    }
    return str;
}

function arrayDeviceToStr(arr) {
    var str = '';
    for (var i = 0; i < arr.length; i++) {
        if (i != 0) str += '|';
        str += arr[i] + '&' + arr[i];
    }
    return str;
}

//
//function arrayToMarkStr(arr) {
//	var str = '';
//	for(var i = 0; i < arr.length; i++) {
//		if(i != 0) str += '|';
//		str += arr[i].i + '&' + arr[i].n;
//	}
//	return str;
//}


function vehicleList2Arr(arr) {
    var str = '';
    for (var i = 0; i < arr.length; i++) {
        if (i != 0) str += '|';
        str += arr[i].nm + '&' + arr[i].nm;
    }
    return str;
}

//获取距离body的上边距
function getTop(e) {
    var offset = 0;
    var obj = e;
    while (obj != null && obj != document.body) {
        offset += obj.offsetTop;
        obj = obj.offsetParent;
    }
    while (obj != null && e != document.body) {
        if (offset > e.scrollTop) {
            offset -= e.scrollTop;
        }
        e = e.parentElement;
    }
    return offset;
}

//获取距离body的左边距
function getLeft(e) {
    var offset = 0;
    var obj = e;
    while (obj != null && obj != document.body) {
        offset += obj.offsetLeft;
        obj = obj.offsetParent;
    }
    while (e != null && e != document.body) {
        offset -= e.scrollLeft;
        e = e.parentElement;
    }
    return offset;
}

//限制输入数字
function restrictionsDigital(mid) {
    $(mid).on('blur', function () {
        var isNum = /^[0-9]*$/;
        var value = $.trim($(this).val());
        if (!isNum.test(value)) {
            $(this).val(value.substring(0, value.length - 1));
        }
    });
}


/**
 * 限制输入数字,可以以0开头
 */
function enterDigital_0(mid) {
    $(mid).on('input propertychange keypress', function () {
        var isNum = /\D/g;
        var value = $.trim($(this).val());
        if (isNum.test(value)) {
            $(this).val(value.replace(isNum, ''));
        }
        value = $.trim($(this).val());
        $(this).val(value);
    });
}


function enterDigital_vertical(mid) {
    $(mid).on('input propertychange keypress', function () {
        var isNum = /\|/g;
        var value = $.trim($(this).val());
        if (isNum.test(value)) {
            $(this).val(value.replace(isNum, ''));
        }
        value = $.trim($(this).val());
        $(this).val(value);
    });
}


/**
 * auther :lwm
 * 限制输入数字,且不能以0开头
 */

function enterDigital(mid) {
    $(mid).on('input propertychange keypress', function () {

        var word_num = $(this).val();
        var word_num_new = "";
        if (/[^\d]/.test(word_num)) { //替换非数字字符
            var word_num = word_num.replace(/[^\d]/g, "");
            //以上替换非数字字符赋值有可能出现0或0开头的数字组合，所以下面再次判断去掉0开头
            if (/^[0]+[0-9]+[0-9]*/g.test(word_num)) {
                var word_num = RegExp.rightContext;
            }
        } else if (/^[0]+[0-9]+[0-9]*/g.test(word_num)) {
            var word_num = RegExp.rightContext;
        }
        $(this).val(word_num);


    });
}


function enterHexDigitalString(mid) {
    $(mid).on('blur', function () {
        var isNum = /[^a-fA-F0-9]/g;
        var value = $.trim($(this).val());
        if (isNum.test(value)) {
            $(this).val(value.replace(isNum, ''));
        }
    });
}


/**
 * auther :lwm
 * 限制输入数字和.,且不能以0和.开头
 */

function enterDigital1(mid) {
    $(mid).on('input propertychange keypress', function () {

        var word_num = $(this).val();
        var word_num_new = "";
        if (/[^\d.]/.test(word_num)) { //替换非数字字符
            var word_num = word_num.replace(/[^\d.]/g, "");
            //以上替换非数字字符赋值有可能出现0或0开头的数字组合，所以下面再次判断去掉0开头
            if (/^[0]+[0-9]+[0-9]*/g.test(word_num)) {
                var word_num = RegExp.rightContext;
            }
        } else if (/^[0]+[0-9]+[0-9]*/g.test(word_num)) {
            var word_num = RegExp.rightContext;
        }
        $(this).val(word_num);


    });
}


/*
function enterDigital(mid) {
$(mid).on('input propertychange keypress',function() {
    var isNum = /\D/g;
    var value = $.trim($(this).val());
    if(isNum.test(value)) {
        $(this).val(value.replace(isNum,''));
    }
    value = $.trim($(this).val());
    if (value != '' && value != null && value != undefined ) {
        $(this).val(parseInt(value,10));
    }else {
        $(this).val(value);
    }

});
}
*/


/**
 * mid th panel 字段名称
 * 可以输入小数
 */
function enterDigitalContainPoint(mid) {
    $(mid).on('input propertychange keypress', function () {
        var regex = /^[0-9]{0,}(\.){0,1}[0-9]{0,}$/ig;
        var isNum = /[^\d.]/gi;
        var value = $.trim($(this).val());
        if (regex.test(value)) {
            $(this).val(value);
        } else {
            $(this).val(value.replace(isNum, ''));
        }
        if (value.length === 1 && value === '.') {
            $(this).val('');
        }
        if (value.split('.').length > 2) {
            $(this).val(value.substring(0, value.length - 1));
        }
    });
}


/**
 * mid th panel 字段名称
 * 可以输入小数
 */
function enterDigitalContainPointAndDecimalLength(mid, maxLength) {
    $(mid).on('input propertychange keypress', function () {
        var regex = /^[0-9]{0,}(\.){0,1}[0-9]{0,}$/ig;
        var isNum = /[^\d.]/gi;
        var value = $.trim($(this).val());
        if (regex.test(value)) {
            $(this).val(value);
        } else {
            $(this).val(value.replace(isNum, ''));
        }
        if (value.length === 1 && value === '.') {
            $(this).val('');
        }

        if (value.split('.')[1] && value.split('.')[1].length > maxLength) {
            $(this).val(value.substring(0, value.length - 1));
        }

        if (value.split('.').length > 2) {
            $(this).val(value.substring(0, value.length - 1));
        }
    });
}

/**
 * mid th panel 字段名称
 * 限制输入数字 最大max位数字 失败回调
 */
function enterDigitalEx(mid, maxNum, callback) {
    $('.input-' + mid).on('blur', function () {
        var isNum = /\D$/g;
        var value = $.trim($(this).val());

        if (isNumber(maxNum) && (value.length > maxNum)) {
//			alert('字符输入超过限制');
            $(this).val(value.substring(0, maxNum));
        }

        if (isNum.test(value)) {
            $(this).val(value.replace(isNum, ''));
            if (callback != null && typeof callback == 'function') {
                callback.apply();
            }
        }
    });
}

/**
 * mid th panel 字段名称
 * 限制输入数字 最小值minNum 最大值maxNum 失败回调
 */
function enterDigitalRange(mid, minNum, maxNum) {
    $(mid).on('input propertychange keypress', function () {
        var word_num = $(this).val();
        if (/[^\d]/.test(word_num)) { //替换非数字字符
            word_num = word_num.replace(/[^\d]/g, "");
        }
        if (word_num) {
            word_num = parseInt(word_num);
        } else {
            word_num = minNum;
        }
        if (word_num && word_num < minNum) {
            word_num = minNum;
        }
        if (word_num && word_num > maxNum) {
            word_num = maxNum;
        }
        $(this).val(word_num);


    });
}


/**
 * 限制输入数字和'.-'
 */
function enterDigitalAndPoint(mid) {
    $(mid).on('blur', function () {
        if (/[^\d.-]/g.test(this.value)) {
            this.value = this.value.replace(/[^\d.-]/g, '');  //清除“数字”和“.”“-”以外的字符
        }
        if (/^\./g.test(this.value)) {
            this.value = this.value.replace(/^\./g, '');  //验证第一个字符是数字而不是.
        }
        if (/^\-\./g.test(this.value)) {
            this.value = this.value.replace(/^\-\./g, '-'); //不能存在-.
        }
//		var isCkx2 = /\.{2,}/g; //不能有连续2个.
        if (/\.+\d*\-*\.+/g.test(this.value)) {//不能有超过2个的.
            //只保留第一个. 清除多余的.
            this.value = this.value.replace('.', '$#$').replace(/\./g, '').replace("$#$", '.');
        }
        if (/\-+\d*\.*\-+/g.test(this.value)) {//不能有超过2个的-
            //只保留第一个- 清除多余的-
            this.value = this.value.replace('-', '$#$').replace(/\-/g, '').replace('$#$', '-');
        } else {
            if (/\d+\.*\-/g.test(this.value)) {//不能以数字-开头
                this.value = this.value.substring(0, this.value.length - 1);
            }
        }
    });
}


function enterDigitalAndPoint3(mid) {
    $(mid).on('blur', function () {
        var isNum = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
        var value = $.trim($(this).val());
        if (!isNum.test(value)) {
            $(this).val("");
        }
        value = $.trim($(this).val());
        $(this).val(value);
    });
}

/**
 * 限制输入特殊字符
 * @param mid 元素
 * @param notSpace 是否不需要匹配空格
 */
function cleanSpelChar(mid, notSpace) {
    $(mid).on('blur', function () {
        /*var pattern = new RegExp("[`~%!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“\"'。，、？]");
		var value = $.trim($(this).val());
		if(value != null && value != '') {
			var rs = "";
			for (var i = 0; i < value.length; i++) {
				rs = rs+value.substr(i, 1).replace(pattern, '');
			}
			$(this).val(rs);
		}*/
        checkSpelChar(mid, notSpace);
    });
}

/**
 * 限制输入特殊字符
 * @param mid 元素
 * @param notSpace 是否不需要匹配空格
 */
function cleanSpelChar2(mid, notSpace) {
    $(document).on('blur', mid, function () {
        checkSpelChar(mid, notSpace);
    });
}

/**
 * 限制输入特殊字符
 * @param mid 元素
 * @param notSpace 是否不需要匹配空格
 */
function checkSpelChar(mid, notSpace) {
    var reg = /[\s@#,|?！!——￥【】~……<>"':*\\\/\$%\^&\*]+/g;
    if (mid == '#input-vehiIDNO') {
        reg = /[\s@,|?！!——￥【】~……<>"':*\\\/\$%\^&\*]+/g;
    }
    if (mid == '#key') {
        reg = /[\s@#|?！!——￥【】~……<>"':*\\\/\$%\^&\*]+/g;
    }
    if (notSpace) {
        reg = /[@#,|?！!——￥【】~……<>"':*\\\/\$%\^&\*]+/g;
        if (mid == '#input-vehiIDNO') {
            reg = /[@,|?！!——￥【】~……<>"':*\\\/\$%\^&\*]+/g;
        }
    }
    var value = $.trim($(mid).val());
    if (isEnglishStr(value)) {
        reg = /[@#,|?<>"':*\\\/\$%\^&\*]+/g;
        if (mid == '#input-vehiIDNO') {
            reg = /[@,|?<>"':*\\\/\$%\^&\*]+/g;
        }
    }
    if (reg.test(value)) {
        //if(!reg.test(str))  {
        $(mid).val(value.replace(reg, ''));
    }
}


/**
 * 限制"和'
 */
function cleanStringSymbolChar(mid) {
    $(mid).on('blur', function () {
        var reg = /["']+/g;
        var value = $.trim($(this).val());
        if (reg.test(value)) {
            $(this).val(value.replace(reg, ''));
        }
    });
}

/**
 * 只能输入汉字和字母
 */
function enterChar(mid) {
    $(mid).on('blur', function () {
        var isNum = /[\d]/g;
        var value = $.trim($(this).val());
        if (isNum.test(value)) {
            $(this).val(value.replace(isNum, ''));
        }
    });
}

/**
 * 限制只能输入汉字英文和数字
 */
function enterCharEnglishNumer(mid) {
    $(mid).on('blur', function () {
        var isNum = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g;
        var value = $.trim($(this).val());
        if (isNum.test(value)) {
            $(this).val(value.replace(isNum, ''));
        }
    });
}

/**
 * 限制只能输入汉字英文和数字以及-
 */
function enterCharEnglishNumerEx(mid) {
    $(mid).on('blur', function () {
        var isNum = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5\\-]/g;
        var value = $.trim($(this).val());
        if (isNum.test(value)) {
            $(this).val(value.replace(isNum, ''));
        }
    });
}

/**
 * 阿里云语音模板
 * 限制只能输入英文和数字以及_
 */
function enterVoiceTemplateID(mid) {
    $(mid).on('blur', function () {
        var isNum = /[^\a-\z\A-\Z0-9\\_]/g;
        var value = $.trim($(this).val());
        if (isNum.test(value)) {
            $(this).val(value.replace(isNum, ''));
        }
    });
}

/**
 * 限制输入特殊字符和汉字 可以输入 /和.
 */
function cleanChar(mid) {
    $(mid).on('input propertychange keypress', function () {
        var isNum = /[^\w\.\/]/ig;
        var value = $.trim($(this).val());
        if (isNum.test(value)) {
            $(this).val(value.replace(isNum, ''));
        }
    });
}


/**
 * 限制输入特殊字符和汉字
 */
function cleanChar2(mid) {
    $(mid).on('input propertychange keypress', function () {
        var isNum = /[^\w]/ig;
        var value = $.trim($(this).val());
        if (isNum.test(value)) {
            $(this).val(value.replace(isNum, ''));
        }
    });
}

/**
 * 限制输入特殊字符(除去@)和汉字
 */
function cleanCharAndNum(mid) {
    $(mid).on('blur', function () {
        var isNum = /[^\w\.\/@]/ig;
        var value = $.trim($(this).val());
        if (isNum.test(value)) {
            $(this).val(value.replace(isNum, ''));
        }
    });
}

/**
 * 限制输入空格 (键盘输入限制 中文输入只能单个输入)
 */
function cleanSpace(mid) {
    $(mid).on('blur', function () {
        var isNum = /\s+/ig;
        var value = $.trim($(this).val());
        if (isNum.test(value)) {
            $(this).val(value.replace(isNum, ''));
        }
    });
}

/**
 * 限制输入空格 （完成输入后限制 避免中文词组输入）
 */
function cleanSpaceEx(mid) {
    $(mid).on('blur', function () {
        var isNum = /\s+/ig;
        var value = $.trim($(this).val());
        if (value) {
            if (isNum.test(value)) {
                $(this).val(value.replace(isNum, ''));
            } else {
                $(this).val(value);
            }
        } else {
            $(this).val("");
        }
        var value = $(this).val();
        $(this).val(value);
    });
}


/**
 * 限制只能输入英文和数字
 */
function enterEnglishNumer(mid) {
    $(mid).on('blur', function () {
        var isNum = /[^\a-\z\A-\Z0-9]/g;
        var value = $.trim($(this).val());
        if (isNum.test(value)) {
            $(this).val(value.replace(isNum, ''));
        }
    });
}

/**
 * 限制输入汉字和中文特殊字符
 */
function cleanCharacter(mid) {
    $(mid).on('blur', function () {
//		var isNum = /[\u4E00-\u9FA5]/g;
        //是否含有中文（也包含日文和韩文）/[\u4E00-\u9FA5\uF900-\uFA2D]/
        //是否含有全角符号的函数 /[\uFF00-\uFFEF]/
        //中文特殊字符 ~·！@#￥%…&*（）——+{}|：“”《》？【】、；‘’，。、？ /[@#,|?<>"':*\\\/\$%\^&\*]+/g
        //英文特殊字符 ~`!@#$%^&*()_+{}|:"<>?[]\;',./  /[@#,|?<>"':*\\\/\$%\^&\*]+/g
        var isNum = /[\u4E00-\u9FA5\uF900-\uFA2D\uFF00-\uFFEF\·！…（）：“”《》？【】、；‘’，。、？]/g;
        var value = $.trim($(this).val());
        if (isNum.test(value)) {
            $(this).val(value.replace(isNum, ''));
        }
    });
}

var searchTimer = null;
var companyTree;
var oldCompanyId = null;

/**
 * 加载公司树结构
 * @param companys 公司列表
 * @param mid 顶点id
 * @param type 1区域
 */
function addCompanyTreeZtree(companys_, mid, type, titleName, displayName_, errtips_, isMoreSelect, imgPath, chkboxType, loadAll, dialog) {
    mid = mid ? mid : 0;
    if (!titleName) {
        var defaultName = getArrayName(companys_, mid);
        if (defaultName) {
            titleName = defaultName;
        } else {
            titleName = rootElement.lang.all_companies;
        }
    }
    var displayName, errtips;
    var companys = [];
    if (typeof rootElement.myUserRole != 'undefined' && rootElement.myUserRole.isChemicals()
        && type && type == '1') {
        companys.push({id: 0, name: '中国', parentId: -1});
        displayName = "选择区域";
        errtips = "区域列表中没有对应的值";
    } else {
        if (displayName_) {
            displayName = displayName_;
        } else {
            if (rootElement.myUserRole && rootElement.myUserRole.isPolice()) {
                displayName = rootElement.lang.btnSelectCompany;
            } else {
                displayName = rootElement.lang.btnSelectCompanyOrGroup;
            }
        }
        if (errtips_) {
            errtips = errtips_;
        } else {
            errtips = rootElement.lang.errCompanyNotExists;
        }
    }
    $('.td-company').flexPanel({
        InputModel: {
            display: displayName,
            value: '',
            name: 'company',
            pid: 'company',
            pclass: 'buttom',
            bgicon: 'true',
            hidden: true,
            hide: false
        }
    });

    if (typeof rootElement.myUserRole != 'undefined' && rootElement.myUserRole.isSanitationTruck()) {//环卫不显示线路
        for (var i = 0; i < companys_.length; i++) {
            if (companys_[i].level != 3) {
                companys.push(companys_[i]);
            }
        }
    } else {
        companys = companys_;
    }

    //加载车辆树
    companyTree = new vehicleTeamTree();
    companyTree.setRootId(mid);
    companyTree.setRootTitle(titleName);
    if (imgPath) {
        companyTree.setImgSrc(imgPath);
    }

    //TODO 多选有问题，先屏蔽掉
    isMoreSelect = false;

    if (!isMoreSelect) {
        companyTree.setIsMoreSelect(false);
    } else {
        companyTree.setIsMoreSelect(true);
        // 设置checkbox回调函数
        // 设置多一层，避免apply、call方法中this指向出现异常
        companyTree.setBeforeCheck(function (treeId, treeNode) {
            companyTree.validCheckAll(treeId, treeNode);
        });
    }
    if (chkboxType) {
        companyTree.setChkboxType(chkboxType);
    }
    companyTree.setDblClickExpand(false);
    companyTree.setTeamList(companys);
    companyTree.initTeamNode();
    // 加载全部子节点
    if (loadAll) {
        companyTree.setChildTreeNodeListAll();
    } else {
        companyTree.setChildTreeNodeList();
    }
    companyTree.initVehiTeamTree('company_tree', companyDblClickEvent, '', '', onExpandCompanyTree);
    // companyTree.loadVehiTeamTree('searchTeam', 'searchVehi');
    $('#company_tree').css('overflow', 'auto');
    $('#company_tree').hide();
    var isOut = true;
    $('.td-company #combox-company').off('input propertychange click').on('input propertychange click', function (e) {

        // 如果存在多选框，则进行数据回显
        if (isMoreSelect) {
            // 取消所有的选中
            companyTree.checkAllNodes(false);
            // 获取原有数据
            var selectIds = $('#hidden-company').val();
            var selectName = $('#combox-company').val();
            if (selectName === rootElement.lang.allEx) {
                companyTree.checkNodeById('0');
                // 选中所有
                companyTree.checkAllNodes(true);
            }
            if (selectIds) {
                var split = selectIds.split(',');
                if (split && split.length > 0) {
                    for (var i = 0; i < split.length; i++) {
                        companyTree.checkNodeById(split[i]);
                    }
                }
            }
        }

        if (dialog) {
            $('#company_tree').css('top', $('.td-company .btn-group').height() + 'px')
                .css('left', $('.td-company').position().left + 'px');
        } else {
            $('#company_tree').css('top', getTop($('.td-company .btn-group').get(0)) + $('.td-company .btn-group').height() + 'px');
            $('#company_tree').css('left', getLeft($('.td-company .btn-group').get(0)) + 'px');
        }

        $('#company_tree').css('width', $('.td-company .btn-group .item').width() - 10 + 'px'); /*z-tree padding:5px*/
        if (e.type == 'click') {
            isOut = false;
            $('#company_tree').show();
        }
        if (searchTimer == null) {
            searchTimer = setTimeout(function () {
                var name = $.trim($('.td-company #combox-company').val());
                if (name !== "") {
                    companyTree.searchCompany(name);
                }
                searchTimer = null;
            }, 200);
        }
    }).on('mouseover', function () {
        isOut = false;
    }).on('mouseout', function () {
        isOut = true;
    });

    $('.td-company .bg-icon-company').off('click').on('click', function () {
        if ($('#combox-company').get(0) && $('#combox-company').get(0).disabled) {
            return;
        }
        if (dialog) {
            $('#company_tree').css('top', $('.td-company .btn-group').height() + 'px')
                .css('left', $('.td-company').position().left + 'px');
        } else {
            $('#company_tree').css('top', getTop($('.td-company .btn-group').get(0)) + $('.td-company .btn-group').height() + 'px');
            $('#company_tree').css('left', getLeft($('.td-company .btn-group').get(0)) + 'px');
        }

        $('#company_tree').css('width', $('.td-company .btn-group .item').width() + 'px');
        if ($('#company_tree').css('display') == 'none') {
            $('#company_tree').show();
            isOut = false;
            if (searchTimer == null) {
                searchTimer = setTimeout(function () {
                    var name = $.trim($('.td-company #combox-company').val());
                    if (name !== "") {
                        companyTree.searchCompany(name);
                    }
                    searchTimer = null;
                }, 200);
            }
        } else {
            checkCompanyTreeParam();
        }
    }).off('mouseover').on('mouseover', function () {
        isOut = false;
    }).off('mouseout').on('mouseout', function () {
        isOut = true;
    });

    $('.td-company #combox-company').off('keydown').on('keydown', function (e) {
        if (e.keyCode == 13) {
            if (dialog) {
                $('#company_tree').css('top', $('.td-company .btn-group').height() + 'px')
                    .css('left', $('.td-company').position().left + 'px');
            } else {
                $('#company_tree').css('top', getTop($('.td-company .btn-group').get(0)) + $('.td-company .btn-group').height() + 'px');
                $('#company_tree').css('left', getLeft($('.td-company .btn-group').get(0)) + 'px');
            }

            $('#company_tree').css('width', $('.td-company .btn-group .item').width() + 'px');
            if ($('#company_tree').css('display') == 'none') {
                $('#company_tree').show();
                isOut = true;
                if (searchTimer == null) {
                    searchTimer = setTimeout(function () {
                        var name = $.trim($('.td-company #combox-company').val());
                        if (name !== "") {
                            var search = companyTree.searchCompany(name);
                            $('.td-company .span-tip').text('*');
                            if (search == null) {
                                $('.td-company #hidden-company').val('');
                                $('.td-company .span-tip').text(errtips);
                                oldCompanyId = '';
                                isOut = true;
                            }
                        } else {
                            $('.td-company #hidden-company').val('');
                            $('.td-company .span-tip').text(errtips);
                            oldCompanyId = '';
                            isOut = true;
                        }
                        searchTimer = null;
                    }, 200);
                }
            } else {
                checkCompanyTreeParam();
            }
        }
    });


    $('#company_tree').off('mouseover').on('mouseover', function () {
        isOut = false;
    }).off('mouseout').on('mouseout', function () {
        isOut = true;
    });

    // 插入多选按钮
    if (isMoreSelect) {

        var content = '<div id="submitBtn" style="cursor:pointer; ">' +
            '<a style="background:#1E9FFF; color:white; border-radius:5px; padding: 3px 9px; margin-bottom:4px; ">' + rootElement.lang.submit + '</a>' +
            '<hr style="margin-top: 5px;">' +
            '</div>';

        $('#company_tree').prepend(content)

        $('#submitBtn').on('click', function () {
            selectAllSubmit();
        })
    }


    $('body').on('click', function (e) {
        if (e.target.id == 'combox-company' || e.target.id == 'company_tree' || e.target.id.startsWith('company_tree_')) {
            return;
        }
        if (isOut && $('#company_tree').css('display') != 'none') {
            checkCompanyTreeParam();
        }
    });
    var checkCompanyTreeParam = function () {
        if ($('#combox-company').get(0) && $('#combox-company').get(0).disabled) {
            return;
        }
        var name = $.trim($('.td-company #combox-company').val());
        var selectNode = companyTree.selectVehicle();
        if (!selectNode) {
            $('#company_tree').hide();
            return
        }
        var selId = selectNode.id;
        if (selId != '*_0' && selId != '*_' + sid) {
            var id = selId.split('_')[1];
            var cname = getArrayName(companys, id);
            if (name == '' || name == cname) {
                companyDblClickEvent();
                isOut = true;
            } else {
                var plag = false;
                for (var i = 0; i < companys.length; i++) {
                    if (name == companys[i].name) {
                        companyDblClickEvent();
                        isOut = true;
                        plag = true;
                        return;
                    }
                }
                if (!plag) {
                    $('.td-company #hidden-company').val('');
                    $('.td-company .span-tip').text(errtips);
                    oldCompanyId = '';
                    $('#company_tree').hide();
                    isOut = true;
                }
            }
        } else {
            if (name == null || name == '') {
                if (typeof rootElement.myUserRole != 'undefined' && rootElement.myUserRole.isChemicals()
                    && type && type == '1') {
                    companyDblClickEvent();
                    isOut = true;
                } else {
                    $('.td-company #hidden-company').val('');
                    $('.td-company .span-tip').text(errtips);
                    oldCompanyId = '';
                    $('#company_tree').hide();
                    isOut = true;
                }
            } else {
                var plag = false;
                for (var i = 0; i < companys.length; i++) {
                    if (name == companys[i].name) {
                        companyDblClickEvent();
                        isOut = true;
                        plag = true;
                        return;
                    }
                }
                if (!plag) {
                    $('.td-company #hidden-company').val('');
                    $('.td-company .span-tip').text(errtips);
                    oldCompanyId = '';
                    $('#company_tree').hide();
                    isOut = true;
                }
            }
        }
    }
}


/**
 * 当展开公司树时
 */
function onExpandCompanyTree(event, treeId, node) {
    var parentId = node.selfId;
    //已经加载过的不需要再次加载
    if (node.children) {
        return;
    }
    var child = companyTree.teamMap[parentId].children;
    companyTree.addTeamNode(child, node);
}

/**
 * 加载公司树结构
 * @param companys 公司列表
 * @param mid 顶点id
 * @param type 1区域
 */
function addCompanyTree(companys_, mid, type, titleName, displayName_, errtips_) {
    var displayName, errtips;
    var companys = [];
    if (typeof rootElement.myUserRole != 'undefined' && rootElement.myUserRole.isChemicals()
        && type && type == '1') {
        companys.push({id: 0, name: '中国', parentId: -1});
        displayName = "选择区域";
        errtips = "区域列表中没有对应的值";
    } else {
        if (displayName_) {
            displayName = displayName_;
        } else {
            displayName = rootElement.lang.btnSelectCompany;
        }
        if (errtips_) {
            errtips = errtips_;
        } else {
            errtips = rootElement.lang.errCompanyNotExists;
        }
    }
    $('.td-company').flexPanel({
        InputModel: {
            display: displayName,
            value: '',
            name: 'company',
            pid: 'company',
            pclass: 'buttom',
            bgicon: 'true',
            hidden: true,
            hide: false
        }
    });

    if (typeof rootElement.myUserRole != 'undefined' && rootElement.myUserRole.isSanitationTruck()) {//环卫不显示线路
        for (var i = 0; i < companys_.length; i++) {
            if (companys_[i].level != 3) {
                companys.push(companys_[i]);
            }
        }
    } else {
        companys = companys_;
    }

    companyTree = new dhtmlXTreeObject("company_tree", "100%", "100%", 0);
    companyTree.enableCheckBoxes(false);
    companyTree.enableThreeStateCheckboxes(false);
    companyTree.setImagePath("../../../js/dxtree/imgs/");
    companyTree.fillCompany(companys, mid, titleName);
    companyTree.setOnDblClickHandler(companyDblClickEvent);
    $('#company_tree').css('overflow', 'auto');
    var isOut = true;
    $('.td-company #combox-company').on('input propertychange click', function (e) {

        $('#company_tree').css('top', getTop($('.td-company .btn-group').get(0)) + $('.td-company .btn-group').height() + 'px');
        $('#company_tree').css('left', getLeft($('.td-company .btn-group').get(0)) + 'px');
        $('#company_tree').css('width', $('.td-company .btn-group .item').width() + 'px');
        if (e.type == 'click') {
            isOut = false;
            $('#company_tree').show();
        }
        if (searchTimer == null) {
            searchTimer = setTimeout(function () {
                var name = $.trim($('.td-company #combox-company').val());
                if (name !== "") {
                    companyTree.searchCompany(name);
                }
                searchTimer = null;
            }, 200);
        }
    }).on('mouseover', function () {
        isOut = false;
    }).on('mouseout', function () {
        isOut = true;
    });

    $('.td-company .bg-icon-company').on('click', function () {
        if ($('#combox-company').get(0) && $('#combox-company').get(0).disabled) {
            return;
        }
        $('#company_tree').css('top', getTop($('.td-company .btn-group').get(0)) + $('.td-company .btn-group').height() + 'px');
        $('#company_tree').css('left', getLeft($('.td-company .btn-group').get(0)) + 'px');
        $('#company_tree').css('width', $('.td-company .btn-group .item').width() + 'px');
        if ($('#company_tree').css('display') == 'none') {
            $('#company_tree').show();
            isOut = false;
            if (searchTimer == null) {
                searchTimer = setTimeout(function () {
                    var name = $.trim($('.td-company #combox-company').val());
                    if (name !== "") {
                        companyTree.searchCompany(name);
                    }
                    searchTimer = null;
                }, 200);
            }
        } else {
            checkCompanyTreeParam();
        }
    }).on('mouseover', function () {
        isOut = false;
    }).on('mouseout', function () {
        isOut = true;
    });

    $('.td-company #combox-company').on('keydown', function (e) {
        if (e.keyCode == 13) {
            $('#company_tree').css('top', getTop($('.td-company .btn-group').get(0)) + $('.td-company .btn-group').height() + 'px');
            $('#company_tree').css('left', getLeft($('.td-company .btn-group').get(0)) + 'px');
            $('#company_tree').css('width', $('.td-company .btn-group .item').width() + 'px');
            if ($('#company_tree').css('display') == 'none') {
                $('#company_tree').show();
                isOut = true;
                if (searchTimer == null) {
                    searchTimer = setTimeout(function () {
                        var name = $.trim($('.td-company #combox-company').val());
                        if (name !== "") {
                            var search = companyTree.searchCompany(name);
                            $('.td-company .span-tip').text('*');
                            if (search == null) {
                                $('.td-company #hidden-company').val('');
                                $('.td-company .span-tip').text(errtips);
                                oldCompanyId = '';
                                isOut = true;
                            }
                        } else {
                            $('.td-company #hidden-company').val('');
                            $('.td-company .span-tip').text(errtips);
                            oldCompanyId = '';
                            isOut = true;
                        }
                        searchTimer = null;
                    }, 200);
                }
            } else {
                checkCompanyTreeParam();
            }
        }
    });


    $('#company_tree').on('mouseover', function () {
        isOut = false;
    }).on('mouseout', function () {
        isOut = true;
    });
    $('body').on('click', function () {
        if (isOut && $('#company_tree').css('display') != 'none') {
            checkCompanyTreeParam();
        }
    });
    var checkCompanyTreeParam = function () {
        if ($('#combox-company').get(0) && $('#combox-company').get(0).disabled) {
            return;
        }
        var name = $.trim($('.td-company #combox-company').val());
        var selId = companyTree.getSelectedItemId();
        if (selId != '*_0' && selId != '*_' + sid) {
            var id = selId.split('_')[1];
            var cname = getArrayName(companys, id);
            if (name == '' || name == cname) {
                companyDblClickEvent();
                isOut = true;
            } else {
                var plag = false;
                for (var i = 0; i < companys.length; i++) {
                    if (name == companys[i].name) {
                        companyDblClickEvent();
                        isOut = true;
                        plag = true;
                        return;
                    }
                }
                if (!plag) {
                    $('.td-company #hidden-company').val('');
                    $('.td-company .span-tip').text(errtips);
                    oldCompanyId = '';
                    $('#company_tree').hide();
                    isOut = true;
                }
            }
        } else {
            if (name == null || name == '') {
                if (typeof rootElement.myUserRole != 'undefined' && rootElement.myUserRole.isChemicals()
                    && type && type == '1') {
                    companyDblClickEvent();
                    isOut = true;
                } else {
                    $('.td-company #hidden-company').val('');
                    $('.td-company .span-tip').text(errtips);
                    oldCompanyId = '';
                    $('#company_tree').hide();
                    isOut = true;
                }
            } else {
                var plag = false;
                for (var i = 0; i < companys.length; i++) {
                    if (name == companys[i].name) {
                        companyDblClickEvent();
                        isOut = true;
                        plag = true;
                        return;
                    }
                }
                if (!plag) {
                    $('.td-company #hidden-company').val('');
                    $('.td-company .span-tip').text(errtips);
                    oldCompanyId = '';
                    $('#company_tree').hide();
                    isOut = true;
                }
            }
        }
    }
}

var searchRegionTimer = null;
var regionTree;
var oldRegionId = null;

/**
 * 加载公司树结构
 * @param regions 公司列表
 * @param mid 顶点id
 * @param type 1区域
 */
function addRegionTree(regions_, mid, type, titleName, displayName_, errtips_) {
    var displayName, errtips;
    var regions = [];
    if (typeof rootElement.myUserRole != 'undefined' && rootElement.myUserRole.isChemicals()
        && type && type == '1') {
        regions.push({id: 0, name: '中国', parentId: -1});
        displayName = "选择区域";
        errtips = "区域列表中没有对应的值";
    } else {
        if (displayName_) {
            displayName = displayName_;
        } else {
            displayName = rootElement.lang.btnSelectRegion;
        }
        if (errtips_) {
            errtips = errtips_;
        } else {
            errtips = '*';
        }
    }
    $('.td-region').flexPanel({
        InputModel: {
            display: displayName,
            value: '',
            name: 'region',
            pid: 'region',
            pclass: 'buttom',
            bgicon: 'true',
            hidden: true,
            hide: false
        }
    });

    if (typeof rootElement.myUserRole != 'undefined' && rootElement.myUserRole.isSanitationTruck()) {//环卫不显示线路
        for (var i = 0; i < regions_.length; i++) {
            if (regions_[i].level != 3) {
                regions.push(regions_[i]);
            }
        }
    } else {
        regions = regions_;
    }

    regionTree = new dhtmlXTreeObject("region_tree", "100%", "100%", 0);
    regionTree.enableCheckBoxes(false);
    regionTree.enableThreeStateCheckboxes(false);
    regionTree.setImagePath("../../../js/dxtree/imgs/");
    regionTree.fillCompany(regions, mid, titleName);
    regionTree.setOnDblClickHandler(regionDblClickEvent);
    $('#region_tree').css('overflow', 'auto');
    var isOut = true;
    $('.td-region #combox-region').on('input propertychange click', function (e) {

        $('#region_tree').css('top', getTop($('.td-region .btn-group').get(0)) + $('.td-region .btn-group').height() + 'px');
        $('#region_tree').css('left', getLeft($('.td-region .btn-group').get(0)) + 'px');
        $('#region_tree').css('width', $('.td-region .btn-group .item').width() + 'px');
        if (e.type == 'click') {
            isOut = false;
            $('#region_tree').show();
        }
        if (searchRegionTimer == null) {
            searchRegionTimer = setTimeout(function () {
                var name = $.trim($('.td-region #combox-region').val());
                if (name !== "") {
                    regionTree.searchCompany(name);
                }
                searchRegionTimer = null;
            }, 200);
        }
    }).on('mouseover', function () {
        isOut = false;
    }).on('mouseout', function () {
        isOut = true;
    });

    $('.td-region .bg-icon-region').on('click', function () {
        if ($('#combox-region').get(0) && $('#combox-region').get(0).disabled) {
            return;
        }
        $('#region_tree').css('top', getTop($('.td-region .btn-group').get(0)) + $('.td-region .btn-group').height() + 'px');
        $('#region_tree').css('left', getLeft($('.td-region .btn-group').get(0)) + 'px');
        $('#region_tree').css('width', $('.td-region .btn-group .item').width() + 'px');
        if ($('#region_tree').css('display') == 'none') {
            $('#region_tree').show();
            isOut = false;
            if (searchRegionTimer == null) {
                searchRegionTimer = setTimeout(function () {
                    var name = $.trim($('.td-region #combox-region').val());
                    if (name !== "") {
                        regionTree.searchCompany(name);
                    }
                    searchRegionTimer = null;
                }, 200);
            }
        } else {
            checkCompanyTreeParam();
        }
    }).on('mouseover', function () {
        isOut = false;
    }).on('mouseout', function () {
        isOut = true;
    });

    $('.td-region #combox-region').on('keydown', function (e) {
        if (e.keyCode == 13) {
            $('#region_tree').css('top', getTop($('.td-region .btn-group').get(0)) + $('.td-region .btn-group').height() + 'px');
            $('#region_tree').css('left', getLeft($('.td-region .btn-group').get(0)) + 'px');
            $('#region_tree').css('width', $('.td-region .btn-group .item').width() + 'px');
            if ($('#region_tree').css('display') == 'none') {
                $('#region_tree').show();
                isOut = true;
                if (searchRegionTimer == null) {
                    searchRegionTimer = setTimeout(function () {
                        var name = $.trim($('.td-region #combox-region').val());
                        if (name !== "") {
                            var search = regionTree.searchCompany(name);
                            $('.td-region .span-tip').text('*');
                            if (search == null) {
                                $('.td-region #hidden-region').val('');
                                $('.td-region .span-tip').text(errtips);
                                oldRegionId = '';
                                isOut = true;
                            }
                        } else {
                            $('.td-region #hidden-region').val('');
                            $('.td-region .span-tip').text(errtips);
                            oldRegionId = '';
                            isOut = true;
                        }
                        searchRegionTimer = null;
                    }, 200);
                }
            } else {
                checkCompanyTreeParam();
            }
        }
    });


    $('#region_tree').on('mouseover', function () {
        isOut = false;
    }).on('mouseout', function () {
        isOut = true;
    });
    $('body').on('click', function () {
        if (isOut && $('#region_tree').css('display') != 'none') {
            checkCompanyTreeParam();
        }
    });
    var checkCompanyTreeParam = function () {
        if ($('#combox-region').get(0) && $('#combox-region').get(0).disabled) {
            return;
        }
        var name = $.trim($('.td-region #combox-region').val());
        var selId = regionTree.getSelectedItemId();
        if (selId != '*_0' && selId != '*_' + sid) {
            var id = selId.split('_')[1];
            var cname = getArrayName(regions, id);
            if (name == '' || name == cname) {
                regionDblClickEvent();
                isOut = true;
            } else {
                var plag = false;
                for (var i = 0; i < regions.length; i++) {
                    if (name == regions[i].name) {
                        regionDblClickEvent();
                        isOut = true;
                        plag = true;
                        return;
                    }
                }
                if (!plag) {
                    $('.td-region #hidden-region').val('');
                    $('.td-region .span-tip').text(errtips);
                    oldCompanyId = '';
                    $('#region_tree').hide();
                    isOut = true;
                }
            }
        } else {
            if (name == null || name == '') {
                if (typeof rootElement.myUserRole != 'undefined' && rootElement.myUserRole.isChemicals()
                    && type && type == '1') {
                    regionDblClickEvent();
                    isOut = true;
                } else {
                    $('.td-region #hidden-region').val('');
                    $('.td-region .span-tip').text(errtips);
                    oldCompanyId = '';
                    $('#region_tree').hide();
                    isOut = true;
                }
            } else {
                var plag = false;
                for (var i = 0; i < regions.length; i++) {
                    if (name == regions[i].name) {
                        regionDblClickEvent();
                        isOut = true;
                        plag = true;
                        return;
                    }
                }
                if (!plag) {
                    $('.td-region #hidden-region').val('');
                    $('.td-region .span-tip').text(errtips);
                    oldCompanyId = '';
                    $('#region_tree').hide();
                    isOut = true;
                }
            }
        }
    }
}

/**
 * 检查数据
 * @returns {Boolean}
 */
function checkParam(ignoreNames, dom) {
    var flag = true;
    var i = 0;
    if (!dom) {
        dom = '#required-area';
    }
    $(dom + ' input,' + dom + ' textArea').each(function () {
        if (!$(this).hasClass("nocheckempty")) {
            var name = $(this).attr('data-name');
            if (name) {
                if (($(this).val() == null || $.trim($(this).val()) == '') && name != 'role'
                    && name != 'devIDNO' && name != 'icCard'
                    && name != 'phone' && name != 'email' && name != 'zsdriver' && name != 'applyFormFile' && name != 'issueCity' && name != 'operatorEx' && name != 'device' && name != 'vehicle' && name != 'authority'
                    && name != 'identity' && name != 'industry' && name != 'post' && name != 'departmentEx' && name != 'phoneEx' && name != 'onlineLicenseNum' && name != 'onlineStartTime' && name != 'onlineValidity'
                    && ((ignoreNames != null && ignoreNames.indexOf("," + name + ",") == -1) || ignoreNames == null)) {
                    $('.td-' + name).find('.span-tip').text(rootElement.lang.not_be_empty);
                    if (i == 0) {
                        $(dom = ' .panel-body').addClass('show');
                        $(this).focus();
                    }
                    i++;
                } else {
                    if ((ignoreNames != null && ignoreNames.indexOf("," + name + ",") == -1) || ignoreNames == null) {
                        $('.td-' + name).find('.span-tip').text('*');
                    }
                }
            }
        }

    });
    if (i != 0) {
        flag = false;
    }
    return flag;
}

function getParentCompany(companys, parentId) {
    for (var i = 0; i < companys.length; i++) {
        if (companys[i].id == parentId) {
            return companys[i];
        }
    }
    return null;
}

//获取父公司
function getPartCompanys(companys, parentCompanys, id) {
    for (var i = 0; i < companys.length; i++) {
        if (companys[i].id == id) {
            parentCompanys.push(companys[i]);
        }
    }
}

//获取子公司
function getChildCompanys(companys, childCompanys, id, noDepart) {
    for (var i = 0; i < companys.length; i++) {
        if (noDepart) {
            if (companys[i].parentId == id && companys[i].level != 12) {
                childCompanys.push(companys[i]);
            }
        } else {
            if (companys[i].parentId == id) {
                childCompanys.push(companys[i]);
            }
        }
    }
}

//获取子公司
function getAllChildCompanys(companys, childCompanys, id) {
    for (var i = 0; i < companys.length; i++) {
        if (companys[i].parentId == id) {
            childCompanys.push(companys[i]);
            var childCompanys2 = []
            getChildCompanys(companys, childCompanys2, companys[i].id)
            if (childCompanys2.length > 0) {
                getAllChildCompanys(companys, childCompanys, companys[i].id)
            }
        }
    }
}

/**
 * 添加页面锁屏
 * @param flag
 */
function disableForm(flag) {
    if (flag) {
        $('body').append('<div id="lockmask" style="position: fixed; left: 0px; top: 0px; width: 100%; height: 100%; overflow: hidden; -ms-filter:\'progid:DXImageTransform.Microsoft.Alpha(Opacity=50)\'; opacity: 0.5;filter:alpha(opacity=50);background: none repeat scroll 0% 0% rgb(220, 226, 241); z-index: 1994;"></div>');
    } else {
        $('#lockmask').remove();

    }

}

/**
 * 设置界面宽度
 */
function loadReportTableWidth(callBackFun) {
    // 解决pc端屏幕缩放比例对页面布局的影响
    handleScreen();
    // 生态眼屏蔽车牌列
    var myUserRole_ = _getRootFrameAttributes('myUserRole');
    if (myUserRole_ && myUserRole_.myUserRole && myUserRole_.myUserRole.isSTY) {
        var list = ['plateType', 'startSpeed', 'endSpeed', 'startPosition', 'endPosition', 'industryType'];
        hideTableColList(list);
    }
    var height = getWindowHeight();
    if (getTop($('.queryGraph-render').get(0)) == 0 || getTop($("#container").get(0)) != 0) {
        height = height - getTop($('.flexigrid .bDiv:not(.fixed-col)').get(0)) - $('.flexigrid .pDiv').height() - 10;
    }
    if (getTop($('.queryGraph-render').get(0)) != 0) {
        height = height - getTop($('.flexigrid .bDiv:not(.fixed-col)').get(0)) - $('.flexigrid .pDiv').height() - 10;
    }
    height = height < 0 ? 0 : height;
    $('.flexigrid .bDiv:not(.fixed-col)').height(height);
    if (typeof callBackFun == "function") {
        callBackFun();
    }
}

/**
 * 地图界面全屏显示
 */
function fullMapScreen() {
    $('body', rootElement.document).find('#main-topPanel').toggleClass('show');
    $('body', rootElement.document).find('#mainPanel-weizhi').toggleClass('map-full');
    $('body', rootElement.document).resize();
};

/**
 * 添加提示组件
 * @param id
 * @param tltle
 */
function setTooltip(id, tltle) {
    $(id).attr("title", tltle);
    $(id).tooltip();

    $(id).attr("title", "");
    $(id).attr("data-original-title", tltle);
}

/**
 * 判字符串断是否包含空格(字符前中后)
 * @param str
 * @returns
 */
function isCheckEmpty(str) {
    var reg = /\s/;
    return reg.test(str);
}

/**
 * 是否禁止系统右键  true 禁止
 */
function disableSysRight(id, disable, func) {
    if (disable) {
        if (typeof func != 'undefined' && func != null) {
            $(id).on('contextmenu', func);
        } else {
            $(id).on('contextmenu', function () {
                return false;
            });
        }
    } else {
        $(id).unbind('contextmenu');
    }
}

/**
 * 获取服务器ip
 * 与浏览器ip匹配
 */
function getComServerIp(lstSvrIp) {
    if (lstSvrIp != null && lstSvrIp.length > 0) {
        var host = window.location.host.split(':');
        if (host.length >= 1) {
            var addr = host[0];
            if (addr == 'localhost') {
                return "127.0.0.1";
            }
            for (var i = 0; i < lstSvrIp.length; ++i) {
                if (addr == lstSvrIp[i]) {
                    return lstSvrIp[i];
                }
            }
        }
        return lstSvrIp[0];
    }
    return "127.0.0.1";
}

//显示c++服务器调用错误信息
// PCServerErrorCode类后台同步更新
function getServerErrorMessage(result) {
    switch (result) {
        case 1:		//系统出现异常	$.dialog.tips 默认关闭时间为1.5秒
            return _getRootFrameAttributes('lang').lang.errException;
            break;
        case 2:		//用户无权限
            return _getRootFrameAttributes('lang').lang.errNoPrivilige;
            break;
        case 3:		//参数错误
            return _getRootFrameAttributes('lang').lang.errRequireParam;
            break;
        case 4:		//操作数据库出错
            return _getRootFrameAttributes('lang').lang.errDbConnErr;
            break;
        case 5:		//信息不存在
            return _getRootFrameAttributes('lang').lang.errNoExist;
            break;
        case 6:		//未知错误
            return _getRootFrameAttributes('lang').lang.errUnkown;
            break;
        case 7:		//名称已经被使用
            return _getRootFrameAttributes('lang').lang.errNameExist;
            break;
        case 21:		//设备信息不存在
            return _getRootFrameAttributes('lang').lang.errDeviceNoExist;
            break;
        case 22:		//没有收到设备的回馈信息
            return _getRootFrameAttributes('lang').lang.errorDeviceNoResponse;
            break;
        case 23:	//设备不在线
            return _getRootFrameAttributes('lang').lang.video_not_online;
            break;
        case 24:	//正在为其它客户端执行对讲操作
            return _getRootFrameAttributes('lang').lang.errDevUsing;
            ;
        case 25:	//设备媒体转发关联信息不存在
            return _getRootFrameAttributes('lang').lang.err_Dev_tran_msvr_empty;
        case 26:	//设备连接中断
            return _getRootFrameAttributes('lang').lang.errorDeviceDisconnect;
            break;
        case 27:	//未定义存储路径
            return _getRootFrameAttributes('lang').lang.err_dev_sto_pos_empty;
        case 28:	//正在升级
            return _getRootFrameAttributes('lang').lang.err_dev_up_upgrading;
        case 29:	//升级文件不正确
            return _getRootFrameAttributes('lang').lang.err_dev_up_file_woring;
        case 30:	//升级文件版本过低
            return _getRootFrameAttributes('lang').lang.err_dev_up_ver_low;
        case 31:	//升级文件校验失败
            return _getRootFrameAttributes('lang').lang.err_dev_up_verify_failed;
        case 32:	//通道信息不存在
            return _getRootFrameAttributes('lang').lang.err_dev_chn_no_exist;
        case 33:	//抓拍图片失败
            return _getRootFrameAttributes('lang').lang.err_dev_snap_jpg;
        case 34:	//硬盘空间不足
            return _getRootFrameAttributes('lang').lang.err_dev_disk_full;
        case 35:	//升级文件版本与设备版本相同，不执行升级操作
            return _getRootFrameAttributes('lang').lang.err_dev_up_ver_same;
        case 36:	//升级文件不存在或损坏不可读
            return _getRootFrameAttributes('lang').lang.err_dev_up_file_err;
        case 37:	//升级文件crc校验失败
            return _getRootFrameAttributes('lang').lang.err_dev_up_file_crc;
        case 38:	//不能从当前版本升级到目标版本
            return _getRootFrameAttributes('lang').lang.err_dev_up_ver_failed;
        case 39:	//升级失败
            return _getRootFrameAttributes('lang').lang.err_dev_up_failed;
        case 40:	//会话限制，如设备限制同时只允许有4个客户进行录像下载
            return _getRootFrameAttributes('lang').lang.err_dev_session_limit;
        case 41:	//会话重复
            return _getRootFrameAttributes('lang').lang.err_dev_session_exist;
        case 42:	//结束会话
            return _getRootFrameAttributes('lang').lang.err_dev_session_end;
        case 43:	//设备用户不存在
            return _getRootFrameAttributes('lang').lang.err_dev_use_no_exist;
        case 44:	//设备用户超出限制
            return _getRootFrameAttributes('lang').lang.err_dev_use_full;
        case 45:	//设备不支持此功能
            return _getRootFrameAttributes('lang').lang.device_nosupport;
            break;
        case 46:	//失败(设备应答)
            return _getRootFrameAttributes('lang').lang.gps_err_dev_resp_false;
            break;
        case 47:	//消息有误(设备应答)
            return _getRootFrameAttributes('lang').lang.gps_err_dev_resp_message_error;
            break;
        case 48:	//不支持(设备应答)
            return _getRootFrameAttributes('lang').lang.gps_err_dev_not_support;
            break;
        case 61:	//文件格式错误
            return _getRootFrameAttributes('lang').lang.errSImageType;
            break;
        case 62:	//服务器上不存在此文件
            return _getRootFrameAttributes('lang').lang.errorFileNotExists;
            break;
        case 63:	//文件已全部下载完成
            return _getRootFrameAttributes('lang').lang.errorFileDownloadAll;
            break;
        case 64:	//文件正在下载
            return _getRootFrameAttributes('lang').lang.errorFileDownloading;
            break;
        case 65:	//没有搜索到录像文件
            return _getRootFrameAttributes('lang').lang.errorVideoFileNotSearch;
            break;
        case 66:	//文件正在被使用
            return _getRootFrameAttributes('lang').lang.errorFileisUse;
            break;
        case 81:	//用户不存在
            return _getRootFrameAttributes('lang').lang.errLogin_UserNoExist;
            break;
        case 82:	//用户密码错误
            return _getRootFrameAttributes('lang').lang.errLogin_PasswordError;
            break;
        case 83:	//用户名错误
            return _getRootFrameAttributes('lang').lang.errLogin_UserError;
            break;
        case 84:	//优先级错误 （1078用户优先级）
            return _getRootFrameAttributes('lang').lang.errPriority_1078;
            break;
        case 101:	//服务器连接失败
            return _getRootFrameAttributes('lang').lang.errorServerConnectFail;
            break;
        case 102:	//服务器空间不足
            return _getRootFrameAttributes('lang').lang.errorServerSpaceNotEnough;
            break;
        case 103:	//服务器忙
            return _getRootFrameAttributes('lang').lang.err_svr_busy;
            break;
        case 104:	//服务器创建文件失败
            return _getRootFrameAttributes('lang').lang.err_svr_create_file;
            break;

        case 105:	//短信模块服务没有启动
            return _getRootFrameAttributes('lang').lang.err_svr_smsmod_no_work;
            break;
        case 106:	//服务器信息不存在，无法为客户提供服务
            return _getRootFrameAttributes('lang').lang.errServerNoExist;
            break;
        case 107:	//服务器正在下载
            return _getRootFrameAttributes('lang').lang.err_svr_downing;
            break;
        case 108:	//正在进行升级
            return _getRootFrameAttributes('lang').lang.err_svr_uploading;
            break;
        case 109:	//服务器不在线
            return _getRootFrameAttributes('lang').lang.errorServerOffline;
            break;
        case 110:	//服务器连接中断
            return _getRootFrameAttributes('lang').lang.errorServerDisconnect;
            break;
        case 111:	//服务器连接中断
            return _getRootFrameAttributes('lang').lang.The_evaluation_resultwas_not_found;
            break;
        case 216:
            return _getRootFrameAttributes('lang').lang.cmsv6Play216Tip;
            break
        case 217:
            return _getRootFrameAttributes('lang').lang.rule_ruleNotSelected
            break
        case 83100:
            return _getRootFrameAttributes('lang').exceedMaxVehicleNum;
            break;
        case 831001:
            return _getRootFrameAttributes('lang').exceedMaxVehicleNumAdmin;
            break;
        case 83101:
            return _getRootFrameAttributes('lang').maxVehicleNumErrorCode1;
        case 83102:
            return _getRootFrameAttributes('lang').maxVehicleNumErrorCode2;
        case 83103:
            return _getRootFrameAttributes('lang').maxVehicleNumErrorCode3;
        case 83104:
            return _getRootFrameAttributes('lang').maxVehicleNumErrorCode4;
        case 83105:
            return _getRootFrameAttributes('lang').maxVehicleNumErrorCode5;
        case 83106:
            return _getRootFrameAttributes('lang').maxVehicleNumErrorCode6;
        case 61000:
            return _getRootFrameAttributes('lang').emailSubscriptionsAccountRepeat;
            break;
        case 113:	//RET_SIM_INSTALLED = 113; //sim卡已安装
            return _getRootFrameAttributes('lang').errSimInstalled;
        default:	//未知错误
            return '';
    }
}

//显示错误信息
function showDialogErrorMessage(result, cmsserver, resultTip) {
    if (cmsserver != null && cmsserver == 1) {
        var timeout = 1;
        var message = getServerErrorMessage(result);
        if (message) {
            $.dialog.tipDanger(message, timeout);
        }
    } else {
        if ((typeof showErrorMessage) == 'function') {
            showErrorMessage(result, resultTip);
        }
        if (result == 2) {
            toLoginPage();
        }
    }
}

/**
 * 跳转到登录页
 */
function toLoginPage() {
    var loginPageType = '';
    var isFromV1 = '';
    if (rootElement.LS) {
        loginPageType = rootElement.LS.get('loginPageType');
        isFromV1 = rootElement.LS.get('isFromV1');
    } else {
        loginPageType = localStorage.getItem('loginPageType');
        isFromV1 = localStorage.getItem('isFromV1');
    }
    var suffix = '';
    if (typeof rootElement.vType != 'undefined' && rootElement.vType && loginPageType !== rootElement.vType) {
        suffix = '_' + rootElement.vType;
    }
    // 从v1 登录的 要退回v1
    if (isFromV1 === '1') {
        suffix = '_v1';
    }
    if (rootElement.vType === 'v7') {
        suffix = '';
    }
    // v9旧样式
    if (rootElement.myUserRole && rootElement.myUserRole.isPolice() && !rootElement.isPoliceStyle) {
        suffix = '_v9_old';
    }
    var url = "/808gps/login" + suffix + ".html";
    if (typeof cAccount != 'undefined' && cAccount) {
        url += "?c=" + cAccount;
    }
    if (rootElement.LS.get('helpCenter') && rootElement.LS.get('helpCenter') == "1") {
        url = "/808gps/login_help.html";
    }
    rootElement.window.location.href = url;
}

// js获取项目根路径，如： http://localhost:8083/xx
// 可能存在重复！！！
function getRootPath() {
    //获取当前网址，如： http://localhost:8083/xx/xx/xx.jsp
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录，如： xx/xx/xx.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht = curWwwPath.substring(0, pos);
    return localhostPaht;
}

// 百度谷歌经纬度互换【需要加额外参数】
// 需要改成三种坐标系相互转换： WGS84（10）、GCJ02 （1,3,7,9,11）、BD-09（2）
// toMap 1谷歌 ,2 百度, 3高德,7 离线谷歌, 8 离线百度 , 9 bing, 10osm 瓦片, 11 谷歌瓦片
// osm瓦片地图占时没有转，直接用 GCJ02处理
function convertBaiduGoogle(lat, lng, toMap, fromMap) {
    var x_pi = (3.14159265358979324 * 3000.0) / 180.0;
    lat = parseFloat(lat);
    lng = parseFloat(lng);
    var gps = {};
    gps.lng = lng;
    gps.lat = lat;
    // 境内才做转换
    if (!IsInsideChina(lat, lng, true)) {
        gps.lng = gps.lng.toFixed(6);
        gps.lat = gps.lat.toFixed(6);
        return gps;
    }
    // osm瓦片地图  WGS84
    if (fromMap && fromMap == 10) {
        // WGS84转GCj02
        var toGcj02 = WGS84_To_GCJ02(lng, lat);
        gps.lng = toGcj02.lng;
        gps.lat = toGcj02.lat;
        lng = toGcj02.lng;
        lat = toGcj02.lat;
        // GCj02转 BD-09
        if (toMap == 1 || toMap == 3 || toMap == 7 ||
            toMap == 9 || toMap == 11) {
        } else {
            var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_pi);
            var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_pi);
            gps.lng = z * Math.cos(theta) + 0.0065;
            gps.lat = z * Math.sin(theta) + 0.006;
        }
        return gps;
    }
    // 百度经纬度转为谷歌经纬度  BD-09 -> GCJ02
    if (toMap == 1 || toMap == 3 || toMap == 7 ||
        toMap == 9 || toMap == 11) {
        lng = lng - 0.0065, lat = lat - 0.006;
        var z = Math.sqrt(lng * lng + lat * lat) - 0.00002 * Math.sin(lat * x_pi);
        var theta = Math.atan2(lat, lng) - 0.000003 * Math.cos(lng * x_pi);
        gps.lng = z * Math.cos(theta);
        gps.lat = z * Math.sin(theta);
    } else {//谷歌经纬度转为百度经纬度 	 GCJ02 ->  BD-09
        var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_pi);
        var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_pi);
        gps.lng = z * Math.cos(theta) + 0.0065;
        gps.lat = z * Math.sin(theta) + 0.006;
    }
    gps.lng = gps.lng.toFixed(6);
    gps.lat = gps.lat.toFixed(6);
    return gps;
}

/**
 * 判断地图类型是否相等
 * 地图类型：<br>
 * WGS84:（OSM-10）<br>
 * GCJ02:（谷歌授权-1,高德-4,离线谷歌-8,bing-9,谷歌-11）<br>
 * BD-09:（离线百度-7,百度-3）
 * @param {number} param1 地图类型1
 * @param {number} param2 地图类型2
 * @returns {Boolean}
 */
function isMapTypeEquals(param1, param2) {
    if (param1 && param2) {
        return param1 == param2;
    }
    return false;
}

/**
 * 判断地图类型是否地图协议
 * 地图类型：<br>
 * WGS84:（OSM-10,天地图-18）<br>
 * GCJ02:（谷歌授权-1,高德-4,离线谷歌-8,bing-9,谷歌-11,四维-12）<br>
 * BD-09:（离线百度-7,百度-3）
 * @param {number} param1 地图类型1
 * @param {number} param2 地图类型2
 * @returns {Boolean}
 */
function isSameMapCoordinate(param1, param2) {
    if (param1 && param2) {
        // 地图三种坐标系类型
        var mapCoordinate = [[10, 18], [1, 4, 8, 9, 11, 12], [3, 7]];
        var index = 1;
        switch (Number(param1)) {
            case 10:
            case 18:
                index = 0;
                break;
            case 3:
            case 7:
                index = 2;
                break;
            default:
                break;
        }
        // 判断是否相同协议
        var coordinates = mapCoordinate[index];
        for (var i = 0, j = coordinates.length; i < j; i++) {
            if (coordinates[i] == param2) {
                return true;
            }
        }
    }
    return false;
}

/**
 * WGS84 、GCJ02、BD-09经纬度互转<br>
 * 地图类型：<br>
 * WGS84:（OSM-10）<br>
 * GCJ02:（谷歌授权-1,高德-4,离线谷歌-8,bing-9,谷歌-11,四维-12）<br>
 * BD-09:（离线百度-7,百度-3）
 * @param {String} lat  纬度
 * @param {String} lng  经度
 * @param {number} toMap  转换目标地图类型
 * @param {number} fromMap  经纬度地图类型
 * @returns {lng: xxx, lat: xxx}
 */
function convertBaiduGoogleEx(lat, lng, toMap, fromMap) {
    var x_pi = (3.14159265358979324 * 3000.0) / 180.0;
    lat = parseFloat(lat);
    lng = parseFloat(lng);
    var gps = {};
    gps.lng = lng;
    gps.lat = lat;
    if (fromMap && toMap) {
        // 设备的经纬度和osm坐标系是一样的
        if (fromMap == 65535) {
            fromMap = 10;
        }
    } else {
        return gps;
    }
    // 境内或者地图类型不同才做转换
    if (!IsInsideChina(lat, lng, true) || isMapTypeEquals(fromMap, toMap) || isSameMapCoordinate(fromMap, toMap)) {
        gps.lng = gps.lng.toFixed(6);
        gps.lat = gps.lat.toFixed(6);
        return gps;
    }

    // osm地图坐标  WGS84 -> GCj02、BD-09
    if (fromMap && (fromMap == 10 || fromMap == 18)) {
        // 天地图
        if (toMap == 10 || toMap == 18) {
            gps.lng = gps.lng.toFixed(6);
            gps.lat = gps.lat.toFixed(6);
            return gps;
        }
        // WGS84转GCj02
        var toGcj02 = WGS84_To_GCJ02(lng, lat);
        gps.lng = toGcj02.lng;
        gps.lat = toGcj02.lat;
        lng = toGcj02.lng;
        lat = toGcj02.lat;
        // GCj02 转  BD-09
        if (toMap == 3 || toMap == 7) {
            var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_pi);
            var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_pi);
            gps.lng = z * Math.cos(theta) + 0.0065;
            gps.lat = z * Math.sin(theta) + 0.006;
        }
        return gps;
    }
    // 百度地图坐标  BD-09 -> GCJ02、WGS84
    if (fromMap && (fromMap == 3 || fromMap == 7)) {
        // BD-09 -> GCJ02
        if (toMap == 1 || toMap == 4 || toMap == 8 ||
            toMap == 9 || toMap == 11 || toMap == 10
            || toMap == 12 || toMap == 18) {
            lng = lng - 0.0065, lat = lat - 0.006;
            var z = Math.sqrt(lng * lng + lat * lat) - 0.00002 * Math.sin(lat * x_pi);
            var theta = Math.atan2(lat, lng) - 0.000003 * Math.cos(lng * x_pi);
            gps.lng = z * Math.cos(theta);
            gps.lat = z * Math.sin(theta);
            // GCJ02 -> WGS84
            if (toMap == 10 || toMap == 18) {
                var wgsLngLat = GCJ02_To_WGS84(gps.lng, gps.lat)
                gps.lng = wgsLngLat.lng;
                gps.lat = wgsLngLat.lat;
            }
            return gps;
        }
    }
    // 谷歌、bing、高德地图坐标    GCJ02 ->  BD-09、WGS84
    // GCJ02 -> WGS84
    if (toMap == 10 || toMap == 18) {
        var wgsLngLat = GCJ02_To_WGS84(gps.lng, gps.lat)
        gps.lng = wgsLngLat.lng;
        gps.lat = wgsLngLat.lat;
        return gps;
    }
    // GCJ02 ->  BD-09
    var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_pi);
    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_pi);
    gps.lng = z * Math.cos(theta) + 0.0065;
    gps.lat = z * Math.sin(theta) + 0.006;
    gps.lng = gps.lng.toFixed(6);
    gps.lat = gps.lat.toFixed(6);
    return gps;
}

/**
 * WGS84转GCj02
 * @param lng
 * @param lat
 * @returns {*[]}
 */
function WGS84_To_GCJ02(lng, lat) {
    var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    var PI = 3.1415926535897932384626;
    var a = 6378245.0;
    var ee = 0.00669342162296594323;
    var gps = {};
    lat = parseFloat(lat);
    lng = parseFloat(lng);
    if (!IsInsideChina(lat, lng, true)) {
        gps.lng = lng.toFixed(6);
        gps.lat = lat.toFixed(6);
        return gps;
    } else {
        var dlat = transformLat(lng - 105.0, lat - 35.0, PI);
        var dlng = transformLon(lng - 105.0, lat - 35.0, PI);
        var radlat = lat / 180.0 * PI;
        var magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
        dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
        gps.lng = (lng + dlng).toFixed(6);
        gps.lat = (lat + dlat).toFixed(6);
        return gps;
    }
};

/**
 * GCJ02(火星地图,谷歌和高德) 转换为 WGS84 (osm瓦片)
 * @param lng
 * @param lat
 * @returns {*[]}
 */
function GCJ02_To_WGS84(lng, lat) {
    var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    var PI = 3.1415926535897932384626;
    var a = 6378245.0;
    var ee = 0.00669342162296594323;
    var gps = {};
    lat = parseFloat(lat);
    lng = parseFloat(lng);
    if (!IsInsideChina(lat, lng, true)) {
        gps.lng = lng.toFixed(6);
        gps.lat = lat.toFixed(6);
        return gps;
    } else {
        var dlat = transformLat(lng - 105.0, lat - 35.0, PI);
        var dlng = transformLon(lng - 105.0, lat - 35.0, PI);
        var radlat = lat / 180.0 * PI;
        var magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
        dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
        mglat = lat + dlat;
        mglng = lng + dlng;
        gps.lng = (lng * 2 - mglng).toFixed(6);
        gps.lat = (lat * 2 - mglat).toFixed(6);
        return gps;
    }
}


function transformLat(dblng, dblat, pi) {
    var ret = -100.0 + 2.0 * dblng + 3.0 * dblat + 0.2 * dblat * dblat + 0.1 * dblng * dblat + 0.2 * Math.sqrt(Math.abs(dblng));
    ret += (20.0 * Math.sin(6.0 * dblng * pi) + 20.0 * Math.sin(2.0 * dblng * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(dblat * pi) + 40.0 * Math.sin(dblat / 3.0 * pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(dblat / 12.0 * pi) + 320 * Math.sin(dblat * pi / 30.0)) * 2.0 / 3.0;
    return ret;
}

function transformLon(dblng, dblat, pi) {
    var ret = 300.0 + dblng + 2.0 * dblat + 0.1 * dblng * dblng + 0.1 * dblng * dblat + 0.1 * Math.sqrt(Math.abs(dblng));
    ret += (20.0 * Math.sin(6.0 * dblng * pi) + 20.0 * Math.sin(2.0 * dblng * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(dblng * pi) + 40.0 * Math.sin(dblng / 3.0 * pi)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(dblng / 12.0 * pi) + 300.0 * Math.sin(dblng / 30.0 * pi)) * 2.0 / 3.0;
    return ret;
}


/**
 * @description 射线法判断点是否在多边形内部
 * @param {Object} p 待判断的点，格式：{ x: X坐标, y: Y坐标 }
 * @param {Array} poly 多边形顶点，数组成员的格式同 p
 * @return {String} 点 p 和多边形 poly 的几何关系
 */
function rayCasting(p, poly) {
    var px = p.x,
        py = p.y,
        flag = false

    for (var i = 0, l = poly.length, j = l - 1; i < l; j = i, i++) {
        var sx = poly[i].x,
            sy = poly[i].y,
            tx = poly[j].x,
            ty = poly[j].y
        // 点与多边形顶点重合
        if ((sx === px && sy === py) || (tx === px && ty === py)) {
            return 'on'
        }

        // 判断线段两端点是否在射线两侧
        if ((sy < py && ty >= py) || (sy >= py && ty < py)) {
            // 线段上与射线 Y 坐标相同的点的 X 坐标
            var x = sx + (py - sy) * (tx - sx) / (ty - sy)

            // 点在多边形的边上
            if (x === px) {
                return 'on'
            }

            // 射线穿过多边形的边界
            if (x > px) {
                flag = !flag
            }
        }
    }
    // 射线穿过多边形边界的次数为奇数时点在多边形内
    return flag ? 'in' : 'out'
}


var regions = [];
//把中国划分为五个图形区域
regions.push(new RectangleInsets(54.141500, 109.687200, 39.374200, 135.000200));
regions.push(new RectangleInsets(49.220400, 79.446200, 42.889900, 96.330000));
regions.push(new RectangleInsets(42.889900, 73.124600, 29.529700, 124.143255));
regions.push(new RectangleInsets(29.529700, 82.968400, 26.718600, 97.035200));
regions.push(new RectangleInsets(29.529700, 97.025300, 20.414096, 124.367395));
regions.push(new RectangleInsets(20.414096, 107.975793, 17.871542, 111.744104));
//这几个区域不在上面五个区域中  不再国内
var regionNos = [];
regionNos.push(new RectangleInsets(22.284000, 101.865200, 20.098800, 106.665000));
regionNos.push(new RectangleInsets(21.542200, 106.452500, 20.487800, 108.051000));
regionNos.push(new RectangleInsets(55.817500, 109.032300, 50.325700, 119.127000));
// regionNos.push(new RectangleInsets(55.817500, 127.456800, 49.557400, 137.022700));
regionNos.push(new RectangleInsets(50.330000, 127.770000, 49.620000, 137.022700));
regionNos.push(new RectangleInsets(55.817500, 127.438000, 50.330000, 137.022700));

regionNos.push(new RectangleInsets(44.892200, 131.266200, 42.569200, 137.022700));
regionNos.push(new RectangleInsets(35.067203, 73.124600, 29.529700, 77.611654));
//香港 澳门 台湾 在国内
var regionInChinaNos = [];
//台湾
regionInChinaNos.push(new RectangleInsets(25.398623, 119.921265, 21.785006, 122.497559));
//香港
regionInChinaNos.push(new RectangleInsets(22.371854, 113.838099, 22.146008, 114.516499));
regionInChinaNos.push(new RectangleInsets(22.537524, 114.095661, 22.371854, 114.464757));
regionInChinaNos.push(new RectangleInsets(22.433870, 113.882942, 22.370784, 114.095661));
regionInChinaNos.push(new RectangleInsets(22.491584, 113.958831, 22.430663, 114.100260));
regionInChinaNos.push(new RectangleInsets(22.510015, 114.001087, 22.490248, 114.101698));
//澳门
regionInChinaNos.push(new RectangleInsets(22.219904, 113.559840, 22.109850, 113.615319));
regionInChinaNos.push(new RectangleInsets(22.219904, 113.545754, 22.159398, 113.560990));


function RectangleInsets(top, left, bottom, right) {
    this.top = top;
    this.left = left;
    this.bottom = bottom;
    this.right = right;
}

function InRectangle(rect, jingDu, weiDu) {
    jingDu = Number(jingDu);
    weiDu = Number(weiDu);
    return rect.right >= jingDu && rect.left <= jingDu && rect.top >= weiDu && rect.bottom <= weiDu;
}

/**
 *lat 纬度
 *lng 经度
 *chinaRegion  是否中国区域都纠偏  true 都纠偏 false  港澳台不纠偏
 */
function IsInsideChina(lat, lng, chinaRegion) {
    for (var i = 0; i < regions.length; i++) {
        if (InRectangle(regions[i], lng, lat)) {
            for (var j = 0; j < regionNos.length; j++) {
                if (InRectangle(regionNos[j], lng, lat)) {
                    return false;
                }
            }
            if (!chinaRegion) {
                for (var j = 0; j < regionInChinaNos.length; j++) {
                    if (InRectangle(regionInChinaNos[j], lng, lat)) {
                        return false;
                    }
                }
            }
            return true;
        }
    }
    return false;
}


//gps坐标转换为火星坐标（gcj02）谷歌、高德、四维使用此坐标
/**
 *lat 纬度
 *lng 经度
 *chinaRegion  是否中国区域都纠偏  true 都纠偏 false  港澳台不纠偏
 */
function fixCoordinate(lat, lng, chinaRegion) {
    var a = 6378245.0;
    var ee = 0.00669342162296594323;
    var pi = 3.14159265358979324;
    var gps = {};
    gps.lat = parseFloat(lat);
    gps.lng = parseFloat(lng);
    //设备不进行转换
    if (IsInsideChina(lat, lng, chinaRegion)) {//转换数据不对   百度中国()纠偏 谷歌大陆纠偏
        var dWeidu = transformLat(lng - 105.0, lat - 35.0, pi);
        var dJingDu = transformLon(lng - 105.0, lat - 35.0, pi);
        var radJingDu = lat / 180.0 * pi;
        var magic = Math.sin(radJingDu);
        magic = 1 - ee * magic * magic;
        var sqrtMagic = Math.sqrt(magic);
        dWeidu = (dWeidu * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
        dJingDu = (dJingDu * 180.0) / (a / sqrtMagic * Math.cos(radJingDu) * pi);
        gps.lat = gps.lat + dWeidu;
        gps.lng = gps.lng + dJingDu;
        gps.lng = gps.lng.toFixed(6);
        gps.lat = gps.lat.toFixed(6);
    } else {
        // console.log("粗略内地纠偏: "+gps.lat + ","+ gps.lng);
    }
    return gps;
}


//gps坐标转换为百度坐标
function fixConvert(lat, lng) {
    var x_pi = (3.14159265358979324 * 3000.0) / 180.0;
    var gps = fixCoordinate(lat, lng, true);
    //设备不进行转换 港澳台也需要纠偏
    if (IsInsideChina(lat, lng, true)) {//转换数据不对
        var x = gps.lng, y = gps.lat;
        var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
        var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
        gps.lng = z * Math.cos(theta) + 0.0065;
        gps.lat = z * Math.sin(theta) + 0.006;
        gps.lng = gps.lng.toFixed(6);
        gps.lat = gps.lat.toFixed(6);
    } else {
        // console.log("粗略国外: "+gps.lat + ","+ gps.lng);
    }
    return gps;
}

/**
 *lat 纬度
 *lng 经度
 *
 */
function fixCoordinateOriginal(lat, lng) {
    var gps = {};
    gps.lat = parseFloat(lat).toFixed(6);
    gps.lng = parseFloat(lng).toFixed(6);
    //设备不进行转换
    return gps;
}

//gps坐标转换
//mapType 地图类型 0谷歌 3百度 4 高德地图 9必应 7百度离线 8谷歌离线 10 openStreet 11 谷歌瓦片地图（卫星地图存在偏差）
//geocoderMapType 0默认 1谷歌 2百度 3高德 4四维 9必应
//defaultGeocoderMapType 0默认 1谷歌 2百度 3高德 4四维
function geocoderLngLat(lat, lng, mapType, geocoderMapType, defaultGeocoderMapType) {
    //  根据地图类型解析
    if (mapType && (mapType == 3 || mapType == 7)) {
        return fixConvert(lat, lng);
    } else if (mapType && (mapType == 9)) {//必应
        return fixCoordinate(lat, lng, true);
    } else if (mapType && (mapType == 10)) {// osm地图瓦片
        return fixCoordinateOriginal(lat, lng);
    } else if (mapType && (mapType == 18)) {// 天地图
        return fixCoordinateOriginal(lat, lng);
    } else if (mapType && (mapType == 4)) {// 高德地图香港澳门纠偏
        return fixCoordinate(lat, lng, true);
    } else {
        return fixCoordinate(lat, lng);
    }
}

/*
 * 判断图片类型
 *
 * @param fileObj  type="file"的javascript对象
 * @return true-符合要求,false-不符合
 */
function checkImgType(fileObj) {
    if (fileObj.value) {
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|JPEG|PNG|BMP)$/.test(fileObj.value)) {
            return false;
        }
    }
    return true;
}

/*
 * 判断图片大小
 *
 * @param fileObj type="file"的javascript对象
 * @param size 图片大小
 * @return true-符合要求,false-不符合
 */
function checkImgSize(fileObj, size) {
    if (fileObj.value) {
        if (fileObj.files && fileObj.files[0]) {
            //获取文件大小
            var fileSize = fileObj.files[0].size || fileObj.files[0].fileSize;
            if (fileSize > parseInt(size, 10) * 1024 * 1024) {
                return false;
            }
        } else { // 兼容IE
//        	var img = new Image(); //动态创建img
//    		img.src = fileObj.value;
//    		img.style.display = "none";
//    		img.onload = function(){
//    			img.fileSize= this.fileSize;
//    			alert(img.fileSize);//ie获取文件大小
//    		}
//    		if(img.readyState=="complete"){//已经load完毕，直接打印文件大小
//    			alert(img.filesize);//ie获取文件大小
//    		}else{
//    			img.onreadystatechange=function(){
//    				if(img.readyState=='complete'){//当图片load完毕
//    					alert(img.fileSize);//ie获取文件大小
//    				}
//    			}
//    		}
        }
    }
    return true;
}

//追加CSS文件到head标签内
function loadHeadCss(url, callback, document_, doc_) {
    var link = document.createElement("link");
    link.setAttribute("type", "text/css");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", url);
    var heads = null;
    if (document_) {
        heads = document_.getElementsByTagName("head");
    } else {
        heads = document.getElementsByTagName("head");
    }
    if (heads.length)
        heads[0].appendChild(link);
    else {
        if (doc_) {
            doc_.documentElement.appendChild(link);
        } else {
            doc.documentElement.appendChild(link);
        }
    }
    //判断服务器
    if (typeof link.onreadystatechange != 'undefined') {
        link.onreadystatechange = function () {
            //IE下的判断，判断是否加载完成
            if (link && (link.readyState == "loaded" || link.readyState == "complete")) {
                link.onreadystatechange = null;
                if (callback != null) {
                    callback();
                }
            }
        };
    } else if (typeof link.onload != 'undefined') {
        link.onload = function () {
            link.onload = null;
            if (callback != null) {
                callback();
            }
        };
    } else {
        if (callback != null) {
            callback();
        }
    }
}

//获取设备类型新增设备
function getTerminalTypes() {
    var pageType = getUrlParameter('pageType'); //2位警员管理
    var terminalTypes = [];
    if (pageType && pageType == 2) {//警员管理
        //terminalTypes.push({id:9,name: rootElement.lang.enforcement_terminal});
        //terminalTypes.push({id:11,name: rootElement.lang.ptt_terminal});
        //terminalTypes.push({id:10,name: rootElement.lang.dispatch_account});
    } else {
        terminalTypes.push({id: 5, name: rootElement.lang.positioning_terminal});
        terminalTypes.push({id: 7, name: rootElement.lang.video_terminal});
        terminalTypes.push({id: -7, name: rootElement.lang.Main_defense_terminal});//主防终端
//		terminalTypes.push({id:9,name: rootElement.lang.peopleDev});
    }
    if (rootElement.myUserRole && rootElement.myUserRole.isSanitationTruck()) {//环卫车
        terminalTypes.push({id: 8, name: '手持终端'});
    }
    return terminalTypes;
}

//获取设备类型   设备管理填充
function getTerminalAllTypes(pageType) {
    if (pageType == '' || pageType == null) {
        pageType = getUrlParameter('pageType'); //2为警员管理
    }
    var terminalTypes = [];
    if (pageType && pageType == 2) {//警员管理
        terminalTypes.push({id: 9, name: rootElement.lang.enforcement_terminal});
        terminalTypes.push({id: 11, name: rootElement.lang.ptt_terminal});
    } else {
        terminalTypes.push({id: 5, name: rootElement.lang.positioning_terminal});
        terminalTypes.push({id: 7, name: rootElement.lang.video_terminal});
        terminalTypes.push({id: 9, name: rootElement.lang.peopleDev});
        terminalTypes.push({id: -7, name: rootElement.lang.Main_defense_terminal});
    }
    if (rootElement.myUserRole && rootElement.myUserRole.isSanitationTruck()) {//环卫车
        terminalTypes.push({id: 8, name: '手持终端'});
    }
    terminalTypes.push({id: 10, name: rootElement.lang.dispatch_account});
    return terminalTypes;

}


//密码强度校验    当isCheck 传1表示进行数据校验，
function doCheckPsw(input, tip, isCheck) {
    //规则： 不能为单一数字，单一字母，单一符号 。必须包含两种以上
    //isEditAccount:是否修改账号密码弹窗，其他公司等密码不管控
    if ((typeof (isEditAccount) != "undefined" && isEditAccount == 1 && rootElement.myUserRole.isAdmin()) || isCheck == 1) {
        //var	reg = /^((?=.*\d)(?=.*\D)|(?=.*[A-Z])|(?=.*[a-z])(?=.*[^a-zA-Z]))^.{8,12}$/;
        var reg = /^((?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z]))^.{8,12}$/;
        var data = $(input).val();
        if (!reg.test(data)) {
            tip.text(rootElement.lang.password_error);
            return false;
        } else {
            tip.text("*");
            return true;
        }
    }
    return true;
}

//kg转为吨
function getGoodsBigAmount(amount) {
    if (amount != null && amount != '') {
        return parseInt(amount, 10) / 1000;
    }
    return 0;
}

//吨转为kg
function getGoodsSmallAmount(amount) {
    if (amount != null && amount != '') {
        return parseInt(parseFloat(amount) * 1000, 10);
    }
    return 0;
}

//创建一个名字为name的计时器，调用console.timeEnd(name)停止计时器并输出所耗时间（毫秒）
//function loadConsoleTime(flag, name) {
//	if(flag) {
//		console.time(name);
//	}else {
//		console.timeEnd(name);
//	}
//}

window._console = window.console;//将原始console对象缓存
window.console = (function (orgConsole) {
    return {//构造的新console对象
        log: getConsoleFn("log"),
        debug: getConsoleFn("debug"),
        info: getConsoleFn("info"),
        warn: getConsoleFn("warn"),
        exception: getConsoleFn("exception"),
        assert: getConsoleFn("assert"),
        dir: getConsoleFn("dir"),
        dirxml: getConsoleFn("dirxml"),
        trace: getConsoleFn("trace"),
        group: getConsoleFn("group"),
        groupCollapsed: getConsoleFn("groupCollapsed"),
        groupEnd: getConsoleFn("groupEnd"),
        profile: getConsoleFn("profile"),
        profileEnd: getConsoleFn("profileEnd"),
        count: getConsoleFn("count"),
        clear: getConsoleFn("clear"),
        time: getConsoleFn("time"),
        timeEnd: getConsoleFn("timeEnd"),
        timeStamp: getConsoleFn("timeStamp"),
        table: getConsoleFn("table"),
        error: getConsoleFn("error"),
        memory: getConsoleFn("memory"),
        markTimeline: getConsoleFn("markTimeline"),
        timeline: getConsoleFn("timeline"),
        timelineEnd: getConsoleFn("timelineEnd")
    };

    function getConsoleFn(name) {
        return function actionConsole() {
            if (typeof (orgConsole) !== "object") return "";
            if (typeof (orgConsole[name]) !== "function") return "";//判断原始console对象中是否含有此方法，若没有则直接返回
            return orgConsole[name].apply(orgConsole, Array.prototype.slice.call(arguments));//调用原始函数
        };
    }
}(window._console));

//IE8 不兼容 问题   查找数组是否包含元素  返回索引
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++) {
            if (from in this && this[from] === elt)
                return from;
        }
        return -1;
    };
}


//ie兼容  es6的String includes
String.prototype.includes = includes;

function includes(context) {
    if (this.indexOf(context) != -1) {
        return true;
    } else {
        return false;
    }
}

if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function (valueToFind, fromIndex) {

            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            // 1. var O be ? ToObject(this value).
            var o = Object(this);

            // 2. var len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If len is 0, return false.
            if (len === 0) {
                return false;
            }

            // 4. var n be ? ToInteger(fromIndex).
            //    (If fromIndex is undefined, this step produces the value 0.)
            var n = fromIndex | 0;

            // 5. If n ≥ 0, then
            //  a. var k be n.
            // 6. Else n < 0,
            //  a. var k be len + n.
            //  b. If k < 0, var k be 0.
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            function sameValueZero(x, y) {
                return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
            }

            // 7. Repeat, while k < len
            while (k < len) {
                // a. var elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(valueToFind, elementK) is true, return true.
                if (sameValueZero(o[k], valueToFind)) {
                    return true;
                }
                // c. Increase k by 1.
                k++;
            }

            // 8. Return false
            return false;
        }
    });
}

/**
 * 防止toFixed无法覆盖原来的方法
 * @param n
 * @returns {string|number|any}
 */
Number.prototype.toFixedPlus = function (n) {
    if (n > 20 || n < 0) {
        throw new RangeError('toFixed() digits argument must be between 0 and 20');
    }
    var number = this;
    if (number < 0) {
        return this.toFixedNegative(n);
    }
    if (isNaN(number) || number >= Math.pow(10, 21)) {
        return number.toString();
    }
    if (typeof (n) == 'undefined' || n == 0) {
        return (Math.round(number)).toString();
    }

    var result = number.toString();
    var arr = result.split('.');

    // 整数的情况
    if (arr.length < 2) {
        // 结尾不补充0
        /* result += '.';
         for (var i = 0; i < n; i += 1) {
             result += '0';
         }*/
        return result;
    }

    var integer = arr[0];
    var decimal = arr[1];
    if (decimal.length == n) {
        return result;
    }
    if (decimal.length < n) {
        // 结尾不补充0
        /* for (var i = 0; i < n - decimal.length; i += 1) {
             result += '0';
         }*/
        return result;
    }
    result = integer + '.' + decimal.substr(0, n);
    var last = decimal.substr(n, 1);
    // 四舍五入，转换为整数再处理，避免浮点数精度的损失
    if (parseInt(last, 10) >= 5) {
        var x = Math.pow(10, n);
        result = (Math.round((parseFloat(result) * x)) + 1) / x;
        result = result.toFixed(n);
    }
    return result;
};


// toFixed兼容方法  重写 实现四舍五入
Number.prototype.toFixed = function (n) {
    if (n > 20 || n < 0) {
        throw new RangeError('toFixed() digits argument must be between 0 and 20');
    }
    var number = this;
    if (number < 0) {
        return this.toFixedNegative(n);
    }
    if (isNaN(number) || number >= Math.pow(10, 21)) {
        return number.toString();
    }
    if (typeof (n) == 'undefined' || n == 0) {
        return (Math.round(number)).toString();
    }

    var result = number.toString();
    var arr = result.split('.');

    // 整数的情况
    if (arr.length < 2) {
        // 结尾不补充0
        // 经纬度转换的占时保留6位，不足补0
        if (n == 6) {
            result += '.';
            for (var i = 0; i < n; i += 1) {
                result += '0';
            }
        }

        return result;
    }

    var integer = arr[0];
    var decimal = arr[1];
    if (decimal.length == n) {
        return result;
    }
    if (decimal.length < n) {
        // 结尾不补充0
        // 经纬度转换的占时保留6位，不足补0
        if (n == 6) {
            for (var i = 0; i < n - decimal.length; i += 1) {
                result += '0';
            }
        }
        return result;
    }
    result = integer + '.' + decimal.substr(0, n);
    var last = decimal.substr(Number(n), 1);
    // 四舍五入，转换为整数再处理，避免浮点数精度的损失
    if (parseInt(last, 10) >= 5) {
        var x = Math.pow(10, n);
        result = (Math.round((parseFloat(result) * x)) + 1) / x;
        result = result.toFixed(n);
    }
    return result;
};

// toFixed兼容方法  重写 实现四舍五入
Number.prototype.toFixedEx = function (n) {
    if (n > 20 || n < 0) {
        throw new RangeError('toFixed() digits argument must be between 0 and 20');
    }
    var number = this;
    if (number < 0) {
        return this.toFixedNegative(n);
    }
    if (isNaN(number) || number >= Math.pow(10, 21)) {
        return number.toString();
    }
    if (typeof (n) == 'undefined' || n == 0) {
        return (Math.round(number)).toString();
    }

    var result = number.toString();
    var arr = result.split('.');

    // 整数的情况
    if (arr.length < 2) {
        // 结尾补充0
        result += '.';
        for (var i = 0; i < n; i += 1) {
            result += '0';
        }

        return result;
    }

    var integer = arr[0];
    var decimal = arr[1];
    if (decimal.length == n) {
        return result;
    }
    if (decimal.length < n) {
        // 结尾补充0
        for (var i = 0; i < n - decimal.length; i += 1) {
            result += '0';
        }
        return result;
    }
    result = integer + '.' + decimal.substr(0, n);
    var last = decimal.substr(Number(n), 1);
    // 四舍五入，转换为整数再处理，避免浮点数精度的损失
    if (parseInt(last, 10) >= 5) {
        var x = Math.pow(10, n);
        result = (Math.round((parseFloat(result) * x)) + 1) / x;
        result = result.toFixed(n);
    }
    return result;
};

/**
 * 重写tofixed 兼容负数
 * @param s
 * @returns {string|number}
 */
Number.prototype.toFixedNegative = function (s) {
    var that = this, changenum, index;
    // 负数
    if (this < 0) {
        that = -that;
    }
    changenum = (parseInt(that * Math.pow(10, s) + 0.5) / Math.pow(10, s)).toString();
    if (this < 0) {
        return -changenum;
    } else {
        return changenum;
    }
}

/**
 * tableObject 报表对象
 * lng1 定义的经度字段，需要和报表中的name相对应，没有则填null
 * lat1 定义的纬度字段，需要和报表中的name相对应，没有则填null
 * position1 定义的地理位置字段，需要和报表中的name相对应，没有则填null
 * lng2 定义的经度字段，需要和报表中的name相对应，没有则填null
 * lat2 定义的纬度字段，需要和报表中的name相对应，没有则填null
 * position2 定义的地理位置字段，需要和报表中的name相对应，没有则填null
 * toMap 地图类型
 */
var analysisLocationObject = (function (tableObject, lng1, lat1, position1, lng2, lat2, position2, toMap, position3, callback) {
    // 取地图tomap
    toMap = rootElement.toMap;

    //是否解析位置
    if (rootElement.myUserRole && !rootElement.myUserRole.getGeoAddress()) {
        return;
    }

    //lng 经度  lat 纬度  position地理位置
    function getValidLnglat_(lng, lat, position) {
        if (position != null && lng != null && lat != null) {
            var latlng = gpsGetPositionEx(lng, lat, 1);
            if (latlng != '0,0' && latlng == position) {
                return latlng;
            }
        }
        return "";
    }

    function checkNumber(val) {
        //正负数正则表达式
        //lastIndex 属性用于规定下次匹配的起始位置，该属性只有设置标志 g才能使用，使用同一个对象,存在全局匹配的时候，第二次验证需要手动置为0  regexNumber.lastIndex=0
        var regexNumber = /^[+-]?(\d+)(\.\d+)?$/g;
        return regexNumber.test(val);
    }

    //解析地理位置
    function analysisLocation() {
        var data = $(tableObject).flexGetData(); //获取查询的数据
        if (data && data.rows && data.rows.length > 0) {
            var infoList = data.rows;
            //取待解析的经纬度信息
            var latlngs = [];

            var latlng_ = [];
            for (var i = 0; i < infoList.length; i++) {
                var info = infoList[i];
                // var latlng1 = getValidLnglat_(info[lng1], info[lat1], info[position1]);
                var latlng1 = info[position1]; // 用不纠偏的值
                try {
                    //判断是不是经纬度
                    if (typeof latlng1 != 'undefined' && latlng1 != '' && latlng1 != null && latlng1.length <= 23 && latlng1.split(",").length == 2 && !latlngs.in_array(latlng1)) {
                        //判断是否经纬度  latlng1.length <= 23 && latlng1.split(",").length == 2 判断有问题
                        latlng_ = latlng1.split(",");
                        if (checkNumber(latlng_[0]) && checkNumber(latlng_[1])) {
                            latlngs.push(latlng1);
                        }
                    }
                    // var latlng2 = getValidLnglat_(info[lng2], info[lat2], info[position2]);
                    var latlng2 = info[position2];
                    if (typeof latlng2 != 'undefined' && latlng2 != '' && latlng2 != null && latlng2.length <= 23 && latlng2.split(",").length == 2 && !latlngs.in_array(latlng2)) {
                        //判断是否经纬度  latlng1.length <= 23 && latlng1.split(",").length == 2 判断有问题
                        latlng_ = latlng2.split(",");
                        if (checkNumber(latlng_[0]) && checkNumber(latlng_[1])) {
                            latlngs.push(latlng2);
                        }
                    }
                    var latlng3 = info[position3];
                    if (typeof latlng3 != 'undefined' && latlng3 != '' && latlng3 != null && latlng3.length <= 23 && latlng3.split(",").length == 2 && !latlngs.in_array(latlng3)) {
                        //判断是否经纬度  latlng1.length <= 23 && latlng1.split(",").length == 2 判断有问题
                        latlng_ = latlng3.split(",");
                        if (checkNumber(latlng_[0]) && checkNumber(latlng_[1])) {
                            latlngs.push(latlng3);
                        }
                    }
                } catch (e) {
                    console.error(e);
                }

            }
            if (latlngs.length > 0) {

                var url = "StandardReportAlarmAction_analysisLocation.action";
                var params = {
                    latlng: latlngs.join(';'),
                    toMap: toMap
                }

                $.myajax.jsonPost(url, params, false, function (json, success) {
                    if (success) {
                        updateTableLocation(json.mapLocation);
                    }
                });
            }
        }
    }

    //将解析的地理位置更新到报表
    function updateTableLocation(mapLocation) {
        if (mapLocation) {
            //循环界面div
            $('tr', tableObject).each(function () {
                if (position1 != null) {
                    var latlng = $.trim($('.' + position1 + ' a', this).html());
                    if (latlng != '' && mapLocation[latlng] != null) {
                        $('.' + position1 + ' a', this).html(mapLocation[latlng]);
                        callbackMethod(latlng, mapLocation[latlng]);
                    }
                }
                if (position2 != null) {
                    var latlng = $.trim($('.' + position2 + ' a', this).html());
                    if (latlng != '' && mapLocation[latlng] != null) {
                        $('.' + position2 + ' a', this).html(mapLocation[latlng])
                        callbackMethod(latlng, mapLocation[latlng]);
                    }
                }
                if (position3 != null) {
                    var latlng = $.trim($('.' + position3 + ' a', this).html());
                    if (latlng != '' && mapLocation[latlng] != null) {
                        $('.' + position3 + ' a', this).html(mapLocation[latlng])
                        callbackMethod(latlng, mapLocation[latlng]);
                    }
                }

            });
        }
    }

    function callbackMethod(latlng, address) {
        callback && typeof callback === 'function' ? callback.call(this, latlng, address) : null;
    }


    //执行解析
    new analysisLocation();
});

//执法仪终端类型
function getDevType() {
    var devType = [];
    devType.push({id: 9, name: rootElement.lang.enforcement_terminal});
    devType.push({id: 11, name: rootElement.lang.ptt_terminal});
    return devType;
}

//获取执法仪终端类型
function getDevTypeForId(id) {
    var devType = '';
    switch (parseInt(id)) {
        case 9:
            devType = rootElement.lang.enforcement_terminal;
            break;
        case 10:
            devType = rootElement.lang.dispatch_account;
            break;
        case 11:
            devType = rootElement.lang.ptt_terminal;
            break;
    }
    return devType;
}


//是否在线
function getChooseOnline() {
    var onlines = [];
    onlines.push({id: -1, name: '请选择'});
    onlines.push({id: 0, name: '不在线'});
    onlines.push({id: 1, name: '在线'});
    return onlines;
}

//获取用户类型
function getAccountType() {
    var accountType = [];
    accountType.push({id: 0, name: rootElement.lang.general_account});
    accountType.push({id: 1, name: rootElement.lang.dispatch_account});
    return accountType;
}


// 获取车牌颜色
function getPlate(plateTypes) {
    var platesArry = [1, 2, 3, 4, 5, 6, 8, 9, 93, 91, 92, 94, 0, 9, 224, 225];
    var plateColer = '';
    if (platesArry.in_array(plateTypes)) {
        if (plateTypes == 6) {
            plateTypes = 93;
        } else if (plateTypes == 8) {
            plateTypes = 91;
        }
        return getArrayName(getPlateTypes(), plateTypes);
    } else {
        plateColer = rootElement.lang.other;
    }
    return plateColer;
}


//获取公司所属行业
function getIndustryTypeByType(type) {
    var industryTypes = [];
    industryTypes.push({id: 1, name: rootElement.lang.logistics_transportation});
    industryTypes.push({id: 2, name: rootElement.lang.vehicle_rental});
    industryTypes.push({id: 10, name: rootElement.lang.dangerousGoodsTransportation});
    industryTypes.push({id: 11, name: rootElement.lang.passenger_transportation});
    industryTypes.push({id: 12, name: rootElement.lang.car_industry_type28});
    industryTypes.push({id: 13, name: rootElement.lang.ride_hailing});
    industryTypes.push({id: 3, name: rootElement.lang.bus_passenger});
    industryTypes.push({id: 4, name: rootElement.lang.taxi});
    industryTypes.push({id: 5, name: rootElement.lang.concrete_car});
    industryTypes.push({id: 6, name: rootElement.lang.special_vehicles});
    industryTypes.push({id: 9, name: rootElement.lang.coal_transportation});
    industryTypes.push({id: 8, name: rootElement.lang.automobile_4S_shop});
    industryTypes.push({id: 7, name: rootElement.lang.engineering_machinery});
    industryTypes.push({id: 0, name: rootElement.lang.other_areas});

    return getArrayName(industryTypes, parseInt(type));
}


//获取可以选择的终端类型
function getSelectVehType() {
    var selectVehType = [];
    selectVehType.push({id: 0, name: rootElement.lang.dev_organize});
    selectVehType.push({id: 1, name: rootElement.lang.dev_cooperate});
    return selectVehType;
}


//获取查岗明细 发送消息类型
function getSendObjectType(type) {
    var sendObjectTypes = [];
    sendObjectTypes.push({id: 1, name: '当前连接的下级平台'});
    sendObjectTypes.push({id: 2, name: '下级平台所属单一业户'});
    sendObjectTypes.push({id: 3, name: '下级平台所属所有业户'});
    return getArrayName(sendObjectTypes, parseInt(type));
}

//获取平台运政不匹配原因
function getMismatch(type) {
    var mismatchTypes = [];
    mismatchTypes.push({id: 0, name: '车牌不匹配'});
    mismatchTypes.push({id: 1, name: '颜色不匹配'});
    return getArrayName(mismatchTypes, parseInt(type));
}

function getVelocityType() {
    return velocityType;
}

//速度单位换算  默认传入是 公里    >> 英里  海里
//	1公里 = 0.5399568海里
//	1公里 = 0.6213712 英里
function valueConversion(value, report) {//value 可能是 x.xx公里/时     x.xx公里    x.xxx  转化为保留2为小数
    var speed = "0";
    if (value) {
        var val = parseFloat(value);//NaN
        var toFixed_ = 2;
        if (report && typeof rootElement.myUserRole != 'undefined') {
            toFixed_ = rootElement.myUserRole.getToFixed();
        }
        if (!isNaN(val)) {//判断是否为数字
            //速度单位 0 公里  1英里  2海里
            if (velocityType == 1) {
                speed = (val * 0.6213712).toFixed(toFixed_);
            } else if (velocityType == 2) {
                speed = (val * 0.5399568).toFixed(toFixed_);
            } else {
                speed = val.toFixed(toFixed_);
            }
        }
    }
    if (parseFloat(speed) === parseInt(speed)) {
        speed = parseInt(speed);
    }
    return speed + "";
}


//速度单位换算  默认传入是 英里  海里 公里    >> 公里
//	1公里 = 0.5399568海里
//	1公里 = 0.6213712 英里
function switchToKmConversion(value) {//value 可能是 x.xx公里/时     x.xx公里    x.xxx  转化为保留2为小数
    var speed = "0";
    if (value) {
        var val = parseFloat(value);//NaN
        var toFixed_ = 4;
        if (!isNaN(val)) {//判断是否为数字
            //速度单位 0 公里  1英里  2海里
            if (velocityType == 1) {
                speed = (val / 0.6213712).toFixed(toFixed_);
            } else if (velocityType == 2) {
                speed = (val / 0.5399568).toFixed(toFixed_);
            } else {
                speed = val.toFixed(toFixed_);
            }
        }
    }
    if (parseFloat(speed) === parseInt(speed)) {
        speed = parseInt(speed);
    }
    return speed + "";
}


//获取Cookie的参数值信息
function GetCookie(name) {
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) {
        var j = i + alen;
        if (document.cookie.substring(i, j) == arg)
            return getCookieVal(j);

        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0)
            break;
    }
    return null;
}

/**
 * 删除Cookie
 * @param name
 * @constructor
 */
function DelCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = GetCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

//获取Cookie的值数据
function getCookieVal(offset) {
    var endstr = document.cookie.indexOf(";", offset);
    if (endstr == -1)
        endstr = document.cookie.length;
    return unescape(document.cookie.substring(offset, endstr));
}

var velocityType = GetCookie('velocityType');

//速度单位换算  默认传入是 公里    >> 英里  海里
function speedConversion(value) {//value 可能是 x.xx公里/时     也可能是x.xxx
    var speed = toFixedEx2(valueConversion(value));
    //速度单位 0 公里  1英里  2海里
    if (velocityType == 1) {
        return speed + rootElement.lang.MilePerHour;
    } else if (velocityType == 2) {
        return speed + rootElement.lang.NauticalPerHour;
    } else {
        return speed + rootElement.lang.KmPerHour;
    }
}


//里程单位换算  默认传入是 公里    公里    >> 英里  海里
function mileageConversion(value, report, showLetter) {//value 可能是 x.xx公里     也可能是x.xxx
//	var type =	GetCookie('velocityType');
    var mileage = valueConversion(value, report);
    //速度单位 0 公里  1英里  2海里
    if (velocityType == 1) {
        return mileage + rootElement.lang.mile;
    } else if (velocityType == 2) {
        return mileage + rootElement.lang.nautical_mile;
    } else {
        if (showLetter) {
            return mileage + 'km';
        }
        return mileage + rootElement.lang.km;
    }
}

//里程单位换算，不带单位  默认传入是 公里    公里    >> 英里  海里
function mileageNumConversion(value, report, showLetter) {//value 可能是 x.xx公里     也可能是x.xxx
    var mileage = valueConversion(value, report);
    return mileage;
}


//图片显示
function previewImageNew(file, img) {
    //先怕判断文件类型
    if (!checkImgType(file)) {
        $(file).val("");
        $.dialog.tips(rootElement.lang.rule_image_format_error, 1);
        return;
    }
    //限制上传1M的图片
    if (!checkImgSize(file, 1)) {
        $(file).val("");
        $.dialog.tips(rootElement.lang.rule_image_size_error, 1);
        return;
    }
    if (file.files && file.files[0]) {
        var reader = new FileReader();
        reader.onload = function (evt) {
            img.src = evt.target.result;
        }
        reader.readAsDataURL(file.files[0]);
        $('#picture').show();
    } else if (file.value) { // 兼容IE
//		img.src = "";
        file.select();
        file.blur();
//		var src = document.selection.createRange().text;
//		$(img).attr('src', file.value);
        img.src = file.value;
//		$('#picture').show();
    }
}

//报表一个页面多种表格样式 对应隐藏问题
//隐藏th后, 查询错位问题
function hideTableTr(tableElement) {
    var hideList = [];
    $(tableElement).parent().parent().find('.hDivBox').find('th').each(function () {
        var isHide = $(this).attr('hidden');
        if (isHide) {
            hideList.push($(this).prop('className'));
        }
    });
    if (hideList && hideList.length > 0) {
        for (var i = 0, j = hideList.length; i < j; i++) {
            $(tableElement).find("." + hideList[i]).hide();
            $(tableElement).find("." + hideList[i]).attr('hidden', 'hidden');
        }
    }
}

//将http替换为https
function replaceHttps(url) {
    if (!/^https/.test(url)) {
        url = url.replace('http:', 'https:');
    }
    return url;
}


//获取车辆类型
function getVehicleType(vehicleType) {
    var vehicleArry = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    var vehicle = '';
    if (vehicleArry.in_array(vehicleType)) {
        switch (parseInt(vehicleType)) {
            case 0:
                vehicle = rootElement.lang.vehicle_none;
                break;
            case 1:
                vehicle = rootElement.lang.vehicle_Dangerous_goods_transporter;
                break;
            case 2:
                vehicle = rootElement.lang.vehicle_Ordinary_passenger_transport;
                break;
            case 3:
                vehicle = rootElement.lang.vehicle_Rural_passenger_vehicle;
                break;
            case 4:
                vehicle = rootElement.lang.vehicle_Taxi;
                break;
            case 5:
                vehicle = rootElement.lang.vehicle_Goods;
                break;
            case 6:
                vehicle = rootElement.lang.muckTruck;
                break;
            case 7:
                vehicle = rootElement.lang.sanitationTruck;
                break;
            case 8:
                vehicle = rootElement.lang.concreteCar;
                break;
            case 9:
                vehicle = rootElement.lang.excavator;
                break;
            case 11:
                vehicle = rootElement.lang.constructionVehicle;
                break;
            case 12:
                vehicle = rootElement.lang.tourist_charter;
                break;
            case 13:
                vehicle = rootElement.lang.city_charter;
                break;
            case 14:
                vehicle = rootElement.lang.lineCar;
                break;
            case 15:
                vehicle = rootElement.lang.bus;
                break;
            case 16:
                vehicle = rootElement.lang.privateCar;
                break;
            case 17:
                vehicle = rootElement.lang.schoolBus;
                break;
            case 18:
                vehicle = rootElement.lang.ride_hailing;
                break;
            case 19:
                vehicle = rootElement.lang.ship;
                break;
            default:
                break;
        }
    } else {
        vehicle = rootElement.lang.vehicle_none;
    }
    return vehicle;
}


//车辆类型
function getVehicleTypes() {
    var vehiTypes = [];
    vehiTypes.push({id: 0, name: rootElement.lang.vehicle_none});
    vehiTypes.push({id: 1, name: rootElement.lang.vehicle_Dangerous_goods_transporter});
    vehiTypes.push({id: 2, name: rootElement.lang.vehicle_Ordinary_passenger_transport});
    vehiTypes.push({id: 3, name: rootElement.lang.vehicle_Rural_passenger_vehicle});
    vehiTypes.push({id: 14, name: rootElement.lang.lineCar});
    vehiTypes.push({id: 12, name: rootElement.lang.tourist_charter});
    vehiTypes.push({id: 13, name: rootElement.lang.city_charter});
    vehiTypes.push({id: 4, name: rootElement.lang.vehicle_Taxi});
    vehiTypes.push({id: 18, name: rootElement.lang.ride_hailing});
    vehiTypes.push({id: 5, name: rootElement.lang.vehicle_Goods});
    vehiTypes.push({id: 6, name: rootElement.lang.muckTruck});
    vehiTypes.push({id: 7, name: rootElement.lang.sanitationTruck});
    vehiTypes.push({id: 8, name: rootElement.lang.concreteCar});
    vehiTypes.push({id: 9, name: rootElement.lang.excavator});
    vehiTypes.push({id: 11, name: rootElement.lang.constructionVehicle});
    vehiTypes.push({id: 15, name: rootElement.lang.bus});
    vehiTypes.push({id: 16, name: rootElement.lang.privateCar});
    vehiTypes.push({id: 17, name: rootElement.lang.schoolBus});
    vehiTypes.push({id: 19, name: rootElement.lang.ship});

    //vehiTypes.push({id:10,name: "小黄人"});
    return vehiTypes;
}

/**
 * 车辆设备类型
 * @returns {[]}
 */
function getVehicleDeviceType() {
    var devTypes = [];
    devTypes.push({id: 7, name: parent.lang.monitor_videoDevice});
    devTypes.push({id: 5, name: parent.lang.positioning_device});
    return devTypes;
}

/**
 * 睡眠几秒
 * @param numberMillis
 */
function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}


/**
 * 查看浏览器是否支持webStorage
 * @returns {boolean}
 */
function checkWebStorage() {
    if (typeof (Storage) !== "undefined") {
        return true;
    } else {
        return false;
    }
}

/**
 * 设置SessionStorage
 * @param key
 * @param value
 * @constructor
 */
function SetSessionStorage(key, value) {
    if (checkWebStorage()) {
        sessionStorage.setItem(key, value);
    } else {
        alert('Your browser does not support WebStorage');
    }
}

/**
 * 获取SessionStorage
 * @param key
 */
function getSessionStorage(key) {
    return sessionStorage.getItem(key);
}


/**
 * 删除SessionStorage
 * @param key
 */
function removeSessionStorage(key) {
    sessionStorage.removeItem(key);
}

/**
 * 删除所有保存的SessionStorage
 */
function removeAllSessionStorage() {
    sessionStorage.clear();
}


/**
 * 设置LocalStorage
 * @param key
 * @param value
 */
function setLocalStorage(key, value) {
    if (checkWebStorage()) {
        // localStorage.setItem(key, value);
        rootElement.LS.set(key, value);
    } else {
        alert('Your browser does not support WebStorage');
    }
}

/**
 * 获取LocalStorage
 * @param key
 */
function getLocalStorage(key) {
    //return localStorage.getItem(key);
    return rootElement.LS.get(key);    //读取，如果没有内容，则返回 undefined
}


/**
 * 删除LocalStorage
 * @param key
 */
function removeLocalStorage(key) {
    //localStorage.removeItem(key);
    rootElement.LS.remove(key);
}

/**
 * 删除所有保存的LocalStorage
 */
function removeAllLocalStorage() {
    // localStorage.clear();
    rootElement.LS.clear();
}


/**
 * 获取父窗口
 * @returns {Window}
 * @private
 */
function _getRootFrameElement() {
    var _indexTop = window;
    var origin = window.location.origin;
    var pathname = window.location.pathname;
    try {
        while (!_indexTop.isTtxRoot && pathname !== _indexTop.parent.location.pathname && origin === _indexTop.parent.location.origin) {
            _indexTop = _indexTop.parent;
            pathname = _indexTop.location.pathname;
        }
    } catch (e) {
        return _indexTop;
    }
    return _indexTop;
}

/**
 * 向上级查找对象最近父级存在就返回
 * @returns {Window}
 * @private
 */
function _getRootFrameAttributes(param) {
    var b = window.self;
    while (true) {
        if (typeof b[param] != 'undefined') {
            return b;
        }
        if (window.top === b) {//ie可能不相当
            return b;
        }
        b = b.parent;
    }
}


//函数节流工具
//通常用于window.onresize这种一秒钟多次调用的函数方法，用于函数节流
//使用方法： fn 要节流的函数  interval 节流间隔
var throttle = function (fn, interval) {
    var __self = fn, // 保存需要被延迟执行的函数引用
        timer, // 定时器
        firstTime = true; // 是否是第一次调用
    return function () {
        var args = arguments,
            __me = this;
        if (firstTime) { // 如果是第一次调用，不需延迟执行
            __self.apply(__me, args);
            return firstTime = false;
        }

        if (timer) { // 如果定时器还在，说明前一次延迟执行还没有完成
            return false;
        }
        timer = setTimeout(function () { // 延迟一段时间执行
            clearTimeout(timer);
            timer = null;
            __self.apply(__me, args);
        }, interval || 500);
    };
}

//获取数组中id与id相同的值 获取司机名称
function getDriverInfo(array, id) {
    var driverInfo = "";
    if (id == null) {
        return '';
    }
    for (var i = 0; i < array.length; i++) {
        if (array[i].id == id) {
            driverInfo = array[i].name;
            if (array[i].phone) {
                driverInfo += '(' + array[i].phone + ')';
            }
            break;
        }
    }
    return driverInfo;
};

function getKey() {
    var ret = "ttx";
    var str = "Aes1234";
    return ret + getNumberKey() + str;
}


/**
 * 获取设备通道号名称
 * @param devIdno
 * @param index
 */
function getChannelName(devIdno, index) {
    var dev = rootElement.vehicleManager.getDevice(devIdno);
    if (dev) {
        return chnName = dev.getSingleChnName(index) || '';
    } else {
        return "CH" + (index + 1);
    }
}

/**
 * 限制输入正整数
 */
function restrictNumber(number) {
    reg = /^[1-9]\d*$/;
    if (!reg.test(number) && number != null && number != '') {
        alert(rootElement.lang.validPositiveIntegers);
        return false;
    }
    return true;
}

/**
 * UTF-8编码
 * @param text
 */
function encodeUtf8(text) {
    var code = encodeURIComponent(text);
    var bytes = [];
    for (var i = 0; i < code.length; i++) {
        var c = code.charAt(i);
        if (c === '%') {
            var hex = code.charAt(i + 1) + code.charAt(i + 2);
            var hexVal = parseInt(hex, 16);
            bytes.push(hexVal);
            i += 2;
        } else bytes.push(c.charCodeAt(0));
    }
    var encoded = "";
    for (var i = 0; i < bytes.length; i++) {
        encoded += '%' + bytes[i].toString(16);
    }
    return decodeURIComponent(encoded);
}

//获取所有音视频类型
function getAllAvitemType() {
    var Avi = [];
    Avi.push({id: 0, name: rootElement.lang.midia});
    Avi.push({id: 1, name: rootElement.lang.report_vehicle_audio});
    Avi.push({id: 2, name: rootElement.lang.report_vehicle_video});
    Avi.push({id: 3, name: rootElement.lang.videoOraudio});
    return Avi;
}


//获取音视频类型
function getAvitemType(type) {
    var Avi = '';
    switch (parseInt(type)) {
        case 0:
            Avi = _getRootFrameAttributes('lang').lang.midia;
            break;
        case 1:
            Avi = _getRootFrameAttributes('lang').lang.report_vehicle_audio;
            break;
        case 2:
            Avi = _getRootFrameAttributes('lang').lang.report_vehicle_video;
            break;
        case 3:
            Avi = _getRootFrameAttributes('lang').lang.videoOraudio;
            break;
        default:
            Avi = _getRootFrameAttributes('lang').lang.midia;
            break;
    }
    return Avi;
}

//获取码流类型
function getStreamType(type) {
    var Stream = '';
    switch (parseInt(type)) {
        case -1:
            Stream = _getRootFrameAttributes('lang').lang.primaryOrSubstream; //主或子码流
            break;
        case 0:
            Stream = _getRootFrameAttributes('lang').lang.main_stream; //主码流
            break;
        case 1:
            Stream = _getRootFrameAttributes('lang').lang.subStream; //子码流
            break;
        default:
            Stream = _getRootFrameAttributes('lang').lang.primaryOrSubstream;
            break;
    }
    return Stream;
}

function getNumberKey() {
    var str = '';
    for (var i = 1; i < 7; i++) {
        str += i;
    }
    return str;
}

//获取存储类型
function getMemTypeType(type) {
    var Mem = '';
    switch (parseInt(type)) {
        case 0:
            Mem = _getRootFrameAttributes('lang').lang.masterOrDisaster_memory;
            break;
        case 1:
            Mem = _getRootFrameAttributes('lang').lang.main_Memory;
            break;
        case 2:
            Mem = _getRootFrameAttributes('lang').lang.disaster_Recovery;
            break;
        default:
            Mem = _getRootFrameAttributes('lang').lang.masterOrDisaster_memory;
            break;
    }
    return Mem;
}


//获取上传状态
function getStatus(type) {
    var status = '';
    switch (parseInt(type)) {
        case 0:
            status = _getRootFrameAttributes('lang').lang.track_pause;
            break;
        case 1:
            status = _getRootFrameAttributes('lang').lang.down_loading;
            break;
        case 2:
            status = _getRootFrameAttributes('lang').lang.cancel;
            break;
        case 3:
            status = _getRootFrameAttributes('lang').lang.failure;
            break;
        case 4:
            status = _getRootFrameAttributes('lang').lang.success;
            break;
    }
    return status;
}

/**
 * 下载文件
 * @param url
 */
function downloadFile(url) {
    try {
        //防止中午乱码
//        url = decodeURIComponent(url);
        var elemIF = document.createElement("iframe");
        elemIF.src = url;
        elemIF.style.display = "none";
        document.body.appendChild(elemIF);
    } catch (e) {

    }
}


/**
 * 适配IE6/7/8 不支持base64图片
 * @param locationCode 图片id
 * @returns {string}
 */
function getEmbedImageSrc(locationCode) {
    //for ie6、ie7
    if (document.all && navigator.userAgent.indexOf("MSIE 8.0") == -1) {
        return 'mhtml:' + document.location + '!' + locationCode;
    }

    //for ie8、FireFox 、Opera
    var codeReg = new RegExp(
        "--\\[MHTML_EMBED_CODE\\]\\n+"
        + "[^\\[]*?"
        + "Content-Location:\\s*" + locationCode + "\\s*\\n"
        + "[^\\[]*?"
        + "(?=\\n+--\\[MHTML_EMBED_CODE\\])"
    );

    var codePart = document.documentElement.innerHTML.match(codeReg)[0];

    codePart.match(/Content-Type:\s*(.*?)\n/)
    var imageType = RegExp.$1;

    codePart.match(/\n{2,}([\S\s]+?)$/i);
    var imageCode = RegExp.$1;

    return "data:" + imageType + ";base64," + imageCode;
}


/**
 * AES加密（需要先加载lib/aes/aes.min.js文件）
 * @param word
 * @returns {*}
 */
function encrypt(word, key) {
    var key = CryptoJS.enc.Utf8.parse(key);
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
    return encrypted.toString();
}


/**
 * AES解密
 * @param word
 * @returns {*}
 */
function decrypt(word, key) {
    var key = CryptoJS.enc.Utf8.parse(key);
    var decrypt = CryptoJS.AES.decrypt(word, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}

/**
 * Ajax提交
 * @param action
 * @param params
 * @param callback
 */
function submitAjax(action, params, callback) {
    $.ajax({
        type: 'POST',
        url: action,
        data: params,
        cache: false,/*禁用浏览器缓存*/
        dataType: 'json',
        success: function (json) {
            if (json.result == 0) {
                callback.call(this, json, action, true);
            } else {
                callback.call(this, json, action, false);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            try {
                if (p.onError) p.onError(XMLHttpRequest, textStatus, errorThrown);
            } catch (e) {
            }
            callback.call(this, null, action, false);
        }
    });
}


/**
 * 获取报警处理方式（旧）
 * @param handleWay
 */
function getHandleWay(handleWay) {
    handleWay = Number(handleWay);
    var result = '';
    if ((handleWay >> 0 & 1) > 0) {
        result += rootElement.lang.phone_notify + ";";
    }
    if ((handleWay >> 1 & 1) > 0) {
        result += rootElement.lang.stop_car + ";";
    }
    if ((handleWay >> 2 & 1) > 0) {
        result += rootElement.lang.warning_tip + ";";
    }
    if ((handleWay >> 3 & 1) > 0) {
        result += rootElement.lang.stop_adjust + ";";
    }
    if ((handleWay >> 4 & 1) > 0) {
        result += rootElement.lang.stop_rest + ";";
    }
    if ((handleWay >> 5 & 1) > 0) {
        result += rootElement.lang.stop_force + ";";
    }
    if ((handleWay >> 6 & 1) > 0) {
        result += rootElement.lang.audio_down + ";";
    }
    if ((handleWay >> 7 & 1) > 0) {
        result += rootElement.lang.other + ";";
    }
    return result;
}

/**
 * 获取报警处理方式
 * @param handleWay
 * @returns {*}
 */
function getHandleWayEx(handleWay) {
    switch (Number(handleWay)) {
        case 2:
            return rootElement.lang.audio_down;
        case 3:
            return rootElement.lang.phone_notify;
        case 4:
            return rootElement.lang.warning_tip;
        case 5:
            return rootElement.lang.stop_adjust;
        case 6:
            return rootElement.lang.other;
        case 7:
            return rootElement.lang.misjudgment;
        case 8:
            return rootElement.lang.confirm;
        case 9:
            return rootElement.lang.handleWayTip1;
        case 10:
            return rootElement.lang.handleWayTip2;
        case 11:
            return rootElement.lang.handleWayTip3;
        case 12:
            return rootElement.lang.handleWayTip4;
        case 13:
            return rootElement.lang.handleWayTip5;
    }
    return "";
}


/**
 * 获取处理方式集合
 * @returns {Array}
 */
function getHandleWayArray() {
    var way = [];
    way.push({id: '', name: rootElement.lang.all});
    way.push({id: '2', name: rootElement.lang.audio_down});
    way.push({id: '3', name: rootElement.lang.phone_notify});
    way.push({id: '4', name: rootElement.lang.warning_tip});
    way.push({id: '5', name: rootElement.lang.stop_adjust});
    way.push({id: '6', name: rootElement.lang.other});
    // way.push({id: '7', name: rootElement.lang.misjudgment});
    way.push({id: '8', name: rootElement.lang.confirm});
    way.push({id: '9', name: rootElement.lang.handleWayTip1});
    way.push({id: '10', name: rootElement.lang.handleWayTip2});
    way.push({id: '11', name: rootElement.lang.handleWayTip3});
    way.push({id: '12', name: rootElement.lang.handleWayTip4});
    way.push({id: '13', name: rootElement.lang.handleWayTip5});
    return way;
}

/**
 * 获取报警处理状态
 * @param status
 * @returns {string}
 */
function getHandleStatus(status) {
    var pos = rootElement.lang.report_unhandled;
    if (status != null && status != '' && status >= 0) {
        switch (Number(status)) {
            case 0:
                pos = rootElement.lang.report_unhandled;
                break;
            default:
                pos = rootElement.lang.report_handled;
                break;
        }
    }
    return pos;
}


/**
 * 获取上报状态
 * //未上报(0)、处理中(1)、处理完成(2)、不处理(3)、将来处理(4)
 * @param report
 * @returns {string}
 */
function getReportStatus(report) {
    var pos = "";
    try {
        report = parseInt(report);
    } catch (e) {
    }
    switch (report) {
        case 0:
            pos = rootElement.lang.rocessing_report_status_no;
            break;
        case 1:
            pos = rootElement.lang.rocessing_report_status_handle;
            break;
        case 2:
            pos = rootElement.lang.rocessing_report_status_complete;
            break;
        case 3:
            pos = rootElement.lang.rocessing_report_status_noHandle;
            break;
        case 4:
            pos = rootElement.lang.rocessing_report_status_future;
            break;
        case 5:
            pos = rootElement.lang.stop_adjust;
            break;
        case 6:
            pos = rootElement.lang.handleWayTip1;
            break;
        case 7:
            pos = rootElement.lang.handleWayTip2;
            break;
        case 8:
            pos = rootElement.lang.handleWayTip3;
            break;
        case 9:
            pos = rootElement.lang.handleWayTip4;
            break;
        case 10:
            pos = rootElement.lang.handleWayTip5;
            break;
        default:
            break;
    }
    return pos;
}


/**
 * 是否开启苏标版本
 * @returns {boolean}
 */
var cookie_enableSubiao = null;

function enableSubiao() {
    // 每个页面重新渲染前只获取一次cookie
    if (cookie_enableSubiao == null) {
        cookie_enableSubiao = GetCookie('enableSubiao');
    }
    var enableSubiao = cookie_enableSubiao;
    if (enableSubiao != null && enableSubiao != undefined && enableSubiao == 1) {
        return true;
    }
    return false;
}

/**
 * 是否开启808过检版本
 * @returns {boolean}
 */
function enable808CheckVesion() {
    var enable808CheckVesion = rootElement.enable808CheckVesion;
    if (enable808CheckVesion != null && enable808CheckVesion != undefined && enable808CheckVesion == 1) {
        return true;
    }
    return false;
}

/**
 * 登录是否启用AES加密
 */
var cookie_EnableAESLogin = null;

function enableAesLogin() {
    // 每个页面重新渲染前只获取一次cookie
    if (cookie_EnableAESLogin == null) {
        cookie_EnableAESLogin = GetCookie('EnableAESLogin');
    }
    var enableAesLogin = cookie_EnableAESLogin;
    if (enableAesLogin != null && enableAesLogin != undefined && enableAesLogin == 1) {
        return true;
    }
    return false;
}


/**
 * 渲染比例条
 * @param value
 * @returns {number}
 */
function formartNumber(value) {
    if (!isNaN(value) && value != null) {
        if (Number(value) < 0) {
            return 0;
        }
        if (Number(value) > 100) {
            return 100;
        }
    }
    return value;
}

/**
 * 阻止事件冒泡
 * @param evt
 */
function stopPropagationEvent(e) {
    var evt = e || window.event; //获取event对象
    if (evt.preventDefault) {
        evt.preventDefault(); //非IE浏览器
    } else {
        evt.returnValue = false; //在早期的IE版本中
    }
    event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true); //阻止事件冒泡
}

/**
 * 浏览器兼容版的element.dataset
 * @param element
 * @returns {DOMStringMap | *}
 */
function getDataSet(element) {
    var obj = {};
    if (element.dataset) {
        return element.dataset;
    } else {
        for (var i = 0; i < element.attributes.length; i++) {
            var key = element.attributes[i].nodeName;
            if (/^data-\w+$/.test(key)) {//判断是否以data-开头的属性名
                var value = element.attributes[i].nodeValue;//值
                var keyName = key.match(/^data-(\w+)/)[1];//键名
                obj[keyName] = value;//对象添加属性
            }
        }
    }
    return obj;
}

/**
 * 是不是IE
 * @returns {boolean}
 */
function ifStrongBrowser() {
    var explorer = navigator.userAgent;
    if (explorer.indexOf("Firefox") >= 0) {
        return true;
    } else if (explorer.indexOf("Chrome") >= 0) {
        return true;
    } else {
        return false;
    }
}

//运输行业类别
function getIndustryType() {

    var types = [];
    types.push({id: 10, name: rootElement.lang.car_industry_type1});//"道路旅客运输"
    types.push({id: 11, name: rootElement.lang.car_industry_type2});//"班车客运"
    types.push({id: 12, name: rootElement.lang.car_industry_type3});//"包车客运"
    types.push({id: 13, name: rootElement.lang.car_industry_type4});//"定线旅游"
    types.push({id: 14, name: rootElement.lang.car_industry_type5});//"非定线旅游"
    types.push({id: 15, name: rootElement.lang.car_industry_type36});//"县内客车"
    types.push({id: 20, name: rootElement.lang.car_industry_type6});//"道路货物运输"
    types.push({id: 21, name: rootElement.lang.car_industry_type7});//"道路普通货物运输"
    types.push({id: 22, name: rootElement.lang.car_industry_type8});//"货物专用运输"
    types.push({id: 23, name: rootElement.lang.car_industry_type9});//"大型物件运输"
    types.push({id: 30, name: rootElement.lang.car_industry_type10});//"道路危险货物运输"
    types.push({id: 31, name: rootElement.lang.car_industry_type11});//运营性危险货物运输
    types.push({id: 32, name: rootElement.lang.car_industry_type12});//非运营性危险货物运输
    types.push({id: 33, name: rootElement.lang.car_industry_type37});//普通货车
    types.push({id: 40, name: rootElement.lang.car_industry_type13});//机动车维修
    types.push({id: 41, name: rootElement.lang.car_industry_type14});//汽车维修
    types.push({id: 42, name: rootElement.lang.car_industry_type15});//危险货物运输车辆维修
    types.push({id: 43, name: rootElement.lang.car_industry_type16});//摩托车维修
    types.push({id: 44, name: rootElement.lang.car_industry_type17});//其他机动车维修
    types.push({id: 50, name: rootElement.lang.car_industry_type18});//机动车驾驶员培训
    types.push({id: 51, name: rootElement.lang.car_industry_type19});//普通机动车驾驶员培训
    types.push({id: 52, name: rootElement.lang.car_industry_type20});//道路运输驾驶员从业资格培训
    types.push({id: 53, name: rootElement.lang.car_industry_type21});//机动车驾驶员培训教练场
    types.push({id: 60, name: rootElement.lang.car_industry_type22});//站场服务
    types.push({id: 61, name: rootElement.lang.car_industry_type23});//道路旅客运输站
    types.push({id: 62, name: rootElement.lang.car_industry_type24});//道路货运站(场)
    types.push({id: 70, name: rootElement.lang.car_industry_type25});//国际道路运输
    types.push({id: 71, name: rootElement.lang.car_industry_type26});//国际道路旅客运输
    types.push({id: 72, name: rootElement.lang.car_industry_type27});//国际道路货物运输
    types.push({id: 80, name: rootElement.lang.car_industry_type28});//公交运输
    // types.push({id: 81, name: rootElement.lang.car_industry_type29});//公交运输
    types.push({id: 90, name: rootElement.lang.car_industry_type30});//出租运输
    types.push({id: 91, name: rootElement.lang.car_industry_type31});//客运出租运输
    types.push({id: 92, name: rootElement.lang.car_industry_type32});//货运出租运输
    types.push({id: 99, name: rootElement.lang.car_industry_type38});//其他
    types.push({id: 100, name: rootElement.lang.car_industry_type33});//汽车租赁
    types.push({id: 101, name: rootElement.lang.car_industry_type34});//客运汽车租赁
    types.push({id: 102, name: rootElement.lang.car_industry_type35});//货运汽车租赁
    return types;
}

//车辆类型
function getCarType() {
    var types = [];
    types.push({id: 10, name: rootElement.lang.car_class_type1});//客车
    types.push({id: 11, name: rootElement.lang.car_class_type2});//大型客车
    types.push({id: 12, name: rootElement.lang.car_class_type3});//中型客车
    types.push({id: 13, name: rootElement.lang.car_class_type4});//小型客车
    types.push({id: 14, name: rootElement.lang.car_class_type5});//轿车
    types.push({id: 15, name: rootElement.lang.car_class_type6});//大型卧铺客车
    types.push({id: 16, name: rootElement.lang.car_class_type7});//中型卧铺客车
    types.push({id: 20, name: rootElement.lang.car_class_type8});//普通货车
    types.push({id: 21, name: rootElement.lang.car_class_type9});//大型普通货车
    types.push({id: 22, name: rootElement.lang.car_class_type10});//中型普通货车
    types.push({id: 23, name: rootElement.lang.car_class_type11});//小型普通货车
    types.push({id: 30, name: rootElement.lang.car_class_type12});//专用运输车
    types.push({id: 31, name: rootElement.lang.car_class_type13});//集装箱车
    types.push({id: 32, name: rootElement.lang.car_class_type14});//大件运输车
    types.push({id: 33, name: rootElement.lang.car_class_type15});//保温冷藏车
    types.push({id: 34, name: rootElement.lang.car_class_type16});//商品车运输专用车辆
    types.push({id: 35, name: rootElement.lang.car_class_type17});//罐车
    types.push({id: 36, name: rootElement.lang.car_class_type18});//牵引车
    types.push({id: 37, name: rootElement.lang.car_class_type19});//挂车
    types.push({id: 38, name: rootElement.lang.car_class_type20});//平板车
    types.push({id: 39, name: rootElement.lang.car_class_type21});//其他专用车
    types.push({id: 40, name: rootElement.lang.car_class_type22});//危险品运输车
    types.push({id: 50, name: rootElement.lang.car_class_type23});//农用车
    types.push({id: 60, name: rootElement.lang.car_class_type24});//拖拉机
    types.push({id: 61, name: rootElement.lang.car_class_type25});//轮式拖拉机
    types.push({id: 62, name: rootElement.lang.car_class_type26});//手扶拖拉机
    types.push({id: 63, name: rootElement.lang.car_class_type27});//履带拖拉机
    types.push({id: 64, name: rootElement.lang.car_class_type28});//特种拖拉机
    types.push({id: 90, name: rootElement.lang.car_class_type29});//其他车辆
    return types;
}


// 车籍地
function getCarPlace() {
    var types = [];
    types.push({id: 110000, name: rootElement.lang.car_province_type1});//北京市
    types.push({id: 120000, name: rootElement.lang.car_province_type2});//天津市
    types.push({id: 130000, name: rootElement.lang.car_province_type3});//河北省
    types.push({id: 140000, name: rootElement.lang.car_province_type4});//山西省
    types.push({id: 150000, name: rootElement.lang.car_province_type5});//内蒙古自治区
    types.push({id: 210000, name: rootElement.lang.car_province_type6});//辽宁省
    types.push({id: 220000, name: rootElement.lang.car_province_type7});//吉林省
    types.push({id: 230000, name: rootElement.lang.car_province_type8});//黑龙江省
    types.push({id: 310000, name: rootElement.lang.car_province_type9});//上海市
    types.push({id: 320000, name: rootElement.lang.car_province_type10});//江苏省
    types.push({id: 330000, name: rootElement.lang.car_province_type11});//浙江省
    types.push({id: 340000, name: rootElement.lang.car_province_type12});//安徽省
    types.push({id: 350000, name: rootElement.lang.car_province_type13});//福建省
    types.push({id: 360000, name: rootElement.lang.car_province_type14});//江西省
    types.push({id: 370000, name: rootElement.lang.car_province_type15});//山东省
    types.push({id: 410000, name: rootElement.lang.car_province_type16});//河南省
    types.push({id: 420000, name: rootElement.lang.car_province_type17});//湖北省
    types.push({id: 430000, name: rootElement.lang.car_province_type18});//湖南省
    types.push({id: 440000, name: rootElement.lang.car_province_type19});//广东省
    types.push({id: 450000, name: rootElement.lang.car_province_type20});//广西壮族自治区
    types.push({id: 460000, name: rootElement.lang.car_province_type21});//海南省
    types.push({id: 500000, name: rootElement.lang.car_province_type22});//重庆市
    types.push({id: 510000, name: rootElement.lang.car_province_type23});//四川省
    types.push({id: 520000, name: rootElement.lang.car_province_type24});//贵州省
    types.push({id: 530000, name: rootElement.lang.car_province_type25});//云南省
    types.push({id: 540000, name: rootElement.lang.car_province_type26});//西藏自治区
    types.push({id: 610000, name: rootElement.lang.car_province_type27});//陕西省
    types.push({id: 620000, name: rootElement.lang.car_province_type28});//甘肃省
    types.push({id: 630000, name: rootElement.lang.car_province_type29});//青海省
    types.push({id: 640000, name: rootElement.lang.car_province_type30});//宁夏回族自治区
    types.push({id: 650000, name: rootElement.lang.car_province_type31});//新疆维吾尔自治区
    types.push({id: 710000, name: rootElement.lang.car_province_type32});//台湾省
    types.push({id: 720000, name: rootElement.lang.car_province_type33});//香港特别行政区
    types.push({id: 730000, name: rootElement.lang.car_province_type34});//澳门特别行政区
    return types;
}


/**
 * 格式化群组状态
 * @param status
 * @returns {string}
 */
function formatGroupStatus(status) {
    var statusStr = rootElement.lang.notCurrentGroup;
    if (status != null) {
        switch (Number(status)) {
            case 0:
                statusStr = rootElement.lang.notCurrentGroup;
                break;
            case 1:
                statusStr = rootElement.lang.currentGroup;
                break;
        }
    }
    return statusStr;
}

/**
 * 获取性别
 * @returns {Array}
 */
function getSexs() {
    var sexs = [];
    sexs.push({id: '1', name: rootElement.lang.man});
    sexs.push({id: '2', name: rootElement.lang.woman});
    return sexs;
}


/**
 * 根据id获取性别
 * @param id
 * @returns {string}
 */
function getSexById(id) {
    var sex = '';
    if (sex != null) {
        switch (Number(id)) {
            case 1:
                sex = rootElement.lang.man;
                break;
            case 2:
                sex = rootElement.lang.woman;
                break;
        }
    }
    return sex;
}


/**
 * 检查非空
 * @param id
 * @returns {boolean}
 */
function checkNull(id) {
    var result = $('#' + id).val();
    if (result == '' || result == null) {
        $('#' + id).parent().find('.span-tip').text(rootElement.lang.not_be_empty);
        return false;
    } else {
        $('#' + id).parent().find('.span-tip').text('*');
    }
    return true;
}

/**
 * 校验身份证号
 * @param card
 * @returns {boolean}
 */
function isCardNo(card) {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (reg.test(card) === false) {
        $.dialog.tipWarning(rootElement.lang.id_card_error);
        return false;
    }
    return true;
}

/**
 * 字符串是否全部为字母
 * @param str
 * @returns {boolean}
 */
function isEnglishStr(str) {
    var pattern = /^[a-zA-Z\s*]+$/;
    if (pattern.test(str) === false) {
        return false;
    }
    return true;
}


/**
 * 检测是否安装了服务器，启用
 * @returns {___anonymous82238_82269}
 */
var elementById = null;
var elementBackground = null;

function flashChecker(langType) {
    var hasFlash = 0;//是否安装了flash插件
    var flashVersion = 0; //flash版本
    var flashEnable = 0;//flash是否启用
    try {
        if (document.all) {
            var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
            if (swf) {
                hasFlash = 1;
                VSwf = swf.GetVariable("$version");
                flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
            }
        } else {
            if (navigator.plugins && navigator.plugins.length > 0) {
                var swf = navigator.plugins["Shockwave Flash"];
                if (swf) {
                    hasFlash = 1;
                    var words = swf.description.split(" ");
                    for (var i = 0; i < words.length; ++i) {
                        if (isNaN(parseInt(words[i]))) continue;
                        flashVersion = parseInt(words[i]);
                    }
                }
            }
        }
    } catch (e) {
        // TODO: handle exception
    }

    elementBackground = document.getElementById('ttx_flash_checker_ground');
    if (elementBackground) {
        elementBackground.style.visibility = 'hidden';
    } else {
        elementBackground = document.createElement("div");
        elementBackground.id = "ttx_flash_checker_ground";
        elementBackground.style.height = '100%';
        elementBackground.style.width = '100%';
        elementBackground.style.position = 'fixed';
        elementBackground.style.zIndex = '9999998';
        elementBackground.style.visibility = 'hidden';
        elementBackground.style.backgroundColor = '#38383D';
        document.body.appendChild(elementBackground);
    }
    elementById = document.getElementById('ttx_flash_checker_a');
    if (elementById) {//如果存在了
    } else {
        var elementById = document.createElement("a");
        elementById.style.height = '100%';
        elementById.style.width = '100%';
        elementById.style.position = 'fixed';
        elementById.style.cursor = 'pointer';
        elementById.style.zIndex = '9999999';
//    	elementById.style.visibility ='hidden';
        elementById.id = "ttx_flash_checker_a";
        elementById.target = "_blank";
        elementById.href = "http://www.adobe.com/go/getflash";
        var src_ = './images/flash_en.png';
        if (langType && langType == 'zh') {
            src_ = './images/flash_zh.png';
        }
        elementById.innerHTML = "<img style=\"position: absolute;transform: translate(-50%,-50%);left: 50%;top: 50%;\" src=\"" + src_ + "\">"
        elementBackground.appendChild(elementById);
    }
    if (!hasFlash) {//不存在搞个链接 然后点击弹窗
        elementBackground.style.visibility = 'visible';
//    	elementById.style.visibility ='visible';
    }
    return {f: hasFlash, v: flashVersion};
}


/**
 * 对象复制
 * @param obj
 * @returns {any}
 */
function cloneObjectFn(obj) {
    return JSON.parse(JSON.stringify(obj))
}


/**
 * 生成不同的颜色代码
 * @param code
 * @param colorArr
 * @returns {*}
 */
function createColorCode() {
    return (function (m, s, c) {
        return (c ? arguments.callee(m, s, c - 1) : '#') +
            s[m.floor(m.random() * 16)]
    })(Math, '0123456789abcdef', 5)
}


String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};

/**
 * 判断数组中是否存在某个数值
 * @param val
 * @returns {boolean}
 */
Array.prototype.contains = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) {
            return true;
        }
    }
    return false;
};

/**
 * 数组删除元素
 * @param val
 */
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};


/**
 * 监听页面显示事件
 * @param callback
 * @param callback2
 */
function pageListen(callback, callback2) {
    if (document.addEventListener) {
        var display = 'visible';
        document.addEventListener('msvisibilitychange', function () {
            display = document.msVisibilityState;
            if (display == 'visible') {
                callback.apply(this, arguments);
            } else {
                callback2.apply(this, arguments);
            }
        });
        document.addEventListener('mozvisibilitychange', function () {
            display = document.mozVisibilityState;
            if (display == 'visible') {
                callback.apply(this, arguments);
            } else {
                callback2.apply(this, arguments);
            }
        });
        document.addEventListener('webkitvisibilitychange', function () {
            display = document.webkitVisibilityState;
            if (display == 'visible') {
                callback.apply(this, arguments);
            } else {
                callback2.apply(this, arguments);
            }
        });
    }
}


function toRad(d) {
    return d * Math.PI / 180;
}

//计算两个点的距离 计算结果m 四舍五入取整m
function getDisance(lat1, lng1, lat2, lng2) { //#lat为纬度, lng为经度, 一定不要弄错
    var dis = 0;
    var radLat1 = toRad(lat1);
    var radLat2 = toRad(lat2);
    var deltaLat = radLat1 - radLat2;
    var deltaLng = toRad(lng1) - toRad(lng2);
    var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
    return Math.round(dis * 6378137);
}


//获取厂家类型 后台java代码 getFactoryType也需要同步更新【设备信息变更记录】
function getFactoryTypes() {
    var types = [];
    types.push({id: 0, name: rootElement.lang.unknown});
    types.push({id: 29, name: 'RM(29)'});		//锐明
    types.push({id: 26, name: 'HK(26)'});		//海康
    types.push({id: 23, name: 'HB(23)'});		//华宝
    types.push({id: 24, name: 'BSJ(24)'});		//博实结
    types.push({id: 16, name: 'TL(16)'});		//通立科技
    types.push({id: 27, name: 'TJ(27)'});		//同进视讯
    types.push({id: 14, name: 'RCM(14)'});		//锐驰曼
    types.push({id: 7, name: 'YJW(7)'});		//易甲文
    types.push({id: 2, name: 'DW(2)'});		//电为
    types.push({id: 70, name: 'ZY(70)'});		//
    types.push({id: 71, name: 'BSD(71)'});		//
    types.push({id: 10, name: 'HT(10)'});		//宏图
    types.push({id: 20, name: 'HD(20)'});		//宏电
    types.push({id: 9, name: 'YW(9)'});		//
    types.push({id: 11, name: 'SF(11)'});		//
    types.push({id: 4, name: 'EST(4)'});		//忆志科技
    types.push({id: 28, name: 'YX(28)'});		//雅讯
    types.push({id: 21, name: 'FZE(21)'});		//福泽尔
    types.push({id: 30, name: 'YA(30)'});		//
    types.push({id: 17, name: 'GM(17)'});		//国脉畅行
    types.push({id: 42, name: 'RTP(42)'});		//RTP-1078
    types.push({id: 32, name: 'BA(32)'});		//本安
    types.push({id: 81, name: 'ZTAC(81)'});		//中天安驰
    types.push({id: 82, name: 'QM(82)'});		//启明
    types.push({id: 83, name: 'SH(83)'});		//势航
    types.push({id: 84, name: 'XH(84)'});		//星海
    return types;
}

//设备协议类型
function getFactoryDevType() {
    var factoryDevTypes = [];
    factoryDevTypes.push({id: 1, name: rootElement.lang.standard2011});
    factoryDevTypes.push({id: 2, name: rootElement.lang.standardCompass});
    factoryDevTypes.push({id: 3, name: rootElement.lang.standard1078Vedio});
    if (!rootElement.myUserRole.isPolice()) {
        factoryDevTypes.push({id: 4, name: rootElement.lang.standard1078ShuBiao});//部标主动安全（苏标）
        factoryDevTypes.push({id: 28, name: rootElement.lang.standard1078ChuanBiao + "(2021)"});//部标主动安全(川标)(2021)
        factoryDevTypes.push({id: 26, name: rootElement.lang.standard1078GuangDong});//部标主动安全(广东)
        factoryDevTypes.push({id: 10, name: rootElement.lang.standard1078ChuanBiao});//部标主动安全(川标)
        factoryDevTypes.push({id: 5, name: rootElement.lang.standard1078ShanBiao});//部标主动安全（陕标）
        factoryDevTypes.push({id: 7, name: rootElement.lang.standard1078YingKou});//部标主动安全(辽宁)
        factoryDevTypes.push({id: 8, name: rootElement.lang.standard1078ZheBiao});//部标主动安全(浙标)
        factoryDevTypes.push({id: 9, name: rootElement.lang.standard1078YuBiao});//部标主动安全(渝标)
        factoryDevTypes.push({id: 11, name: rootElement.lang.standard1078JiBiao});//部标主动安全(吉标)
        factoryDevTypes.push({id: 12, name: rootElement.lang.standard1078ShangHai});//部标主动安全(上海)
        factoryDevTypes.push({id: 13, name: rootElement.lang.standard1078GuangXi});//部标主动安全(广西)
        factoryDevTypes.push({id: 14, name: rootElement.lang.standard1078XingJiang});//部标主动安全(新疆)
        factoryDevTypes.push({id: 16, name: rootElement.lang.standard1078JiangXi});//部标主动安全(江西)
        factoryDevTypes.push({id: 17, name: rootElement.lang.standard1078HeBei});//部标主动安全(河北)
        factoryDevTypes.push({id: 18, name: rootElement.lang.standard1078GanSu});//部标主动安全(甘肃)
        factoryDevTypes.push({id: 21, name: rootElement.lang.standard1078HeiLJ});//部标主动安全(黑龙江)
        factoryDevTypes.push({id: 22, name: rootElement.lang.standard1078Foshan});//部标主动安全(佛山)
        factoryDevTypes.push({id: 24, name: rootElement.lang.standard1078ShanDong});//部标主动安全(山东)
        factoryDevTypes.push({id: 25, name: rootElement.lang.standard1078XiangBiao});//部标主动安全(湘标)
        factoryDevTypes.push({id: 30, name: rootElement.lang.standard1078TianJin});//部标主动安全(天津)
        factoryDevTypes.push({id: 6, name: rootElement.lang.standard1078BuBiao});//部标主动安全(883)
        factoryDevTypes.push({id: 27, name: rootElement.lang.standard1078BeiJing});//部标主动安全(北京)
        factoryDevTypes.push({id: 31, name: rootElement.lang.standard1078JiangSu});//部标主动安全(江苏)

        factoryDevTypes.push({id: 19, name: "905(2014)"});//905(2014)
        factoryDevTypes.push({id: 20, name: "905(2020)"});//905(2014)
        factoryDevTypes.push({id: 29, name: rootElement.lang.taxi_beijing});//905(北京)
        factoryDevTypes.push({id: 23, name: '28181(2011)'});
    } else {
        factoryDevTypes.push({id: 16, name: '28181(2011)'});
    }
    factoryDevTypes.push({id: 15, name: '28181(2016)'});
    factoryDevTypes.push({id: 0, name: rootElement.lang.unknown});
    return factoryDevTypes;
}

/**
 * 对应数据库的协议值
 * @returns {[]}
 */
function getFaceProtocol() {
    var factoryDevTypes = [];
    factoryDevTypes.push({id: 0, name: rootElement.lang.nothing});
    factoryDevTypes.push({id: 14, name: rootElement.lang.standard1078JiBiao});
    factoryDevTypes.push({id: 18, name: rootElement.lang.standard1078XiangBiao});
    return factoryDevTypes;
}

/**
 * MAC校验状态,未校验、1: 成功，2: 失败
 * @returns {[]}
 */
function checkMACStatus() {
    var status = [];
    status.push({id: 1, name: rootElement.lang.success});
    status.push({id: 2, name: rootElement.lang.failure});
    status.push({id: 0, name: rootElement.lang.uncheckMac});
    return status;
}


function getFactoryDevTypeExName(params) {
    if (params.factoryDevType != null) {
        params.factoryDevType = switchFactoryDevTypeToWeb(params.factoryDevType, params.extendedProtocol);
    } else {
        params.factoryDevType = 1;
    }
    var factoryDevTypes = getFactoryDevType();
    return getArrayName(factoryDevTypes, params.factoryDevType);
}

/**
 * 数据库的苏标协议转换到web内对应的下拉对应值
 */
function switchFactoryDevTypeToWeb(factoryDevType, extendedProtocol) {
    var params = {};
    params.factoryDevType = factoryDevType;
    if (factoryDevType == 3 && extendedProtocol && extendedProtocol == 1) {
        params.factoryDevType = 4;
    } else if (factoryDevType == 3 && extendedProtocol && extendedProtocol == 2) {
        params.factoryDevType = 5;
    } else if (factoryDevType == 3 && extendedProtocol && extendedProtocol == 3) {
        params.factoryDevType = 6;
    } else if (factoryDevType == 3 && extendedProtocol && extendedProtocol == 4) {
        params.factoryDevType = 7;
    } else if (factoryDevType == 3 && extendedProtocol && extendedProtocol == 5) {
        params.factoryDevType = 8;
    } else if (factoryDevType == 3 && extendedProtocol && extendedProtocol == 6) {
        params.factoryDevType = 9;
    } else if (factoryDevType == 3 && extendedProtocol && extendedProtocol == 7) {
        params.factoryDevType = 10;
    } else if (factoryDevType == 3 && extendedProtocol && extendedProtocol == 8) {
        params.factoryDevType = 11;
    } else if (factoryDevType == 3 && extendedProtocol && extendedProtocol == 9) {
        params.factoryDevType = 12;
    } else if (factoryDevType == 3 && extendedProtocol && extendedProtocol == 10) {
        params.factoryDevType = 13;
    } else if (factoryDevType == 3 && extendedProtocol && extendedProtocol == 11) {
        params.factoryDevType = 14;
    } else if (factoryDevType == 3 && extendedProtocol && extendedProtocol == 12) {
        params.factoryDevType = 16;
    } else if (factoryDevType == 3 && extendedProtocol && extendedProtocol == 13) {
        params.factoryDevType = 17;
    } else if (factoryDevType == 3 && extendedProtocol && extendedProtocol == 14) {
        params.factoryDevType = 18;
    } else if (factoryDevType == 4 && extendedProtocol == 0) {
        params.factoryDevType = 19;
    } else if (factoryDevType == 6 && extendedProtocol == 0) {
        params.factoryDevType = 20;
    } else if (factoryDevType == 3 && extendedProtocol && extendedProtocol == 15) {
        params.factoryDevType = 21;
    } else if (factoryDevType == 3 && extendedProtocol && extendedProtocol == 16) {
        params.factoryDevType = 22;
    } else if (factoryDevType == 3 && extendedProtocol && extendedProtocol == 17) {
        params.factoryDevType = 24;
    } else if (factoryDevType == 3 && extendedProtocol && extendedProtocol == 18) {
        params.factoryDevType = 25;
    } else if (factoryDevType == 3 && extendedProtocol && extendedProtocol == 19) {
        params.factoryDevType = 26;
    } else if (factoryDevType == 3 && extendedProtocol && extendedProtocol == 20) {
        params.factoryDevType = 27;
    } else if (factoryDevType == 3 && extendedProtocol && extendedProtocol == 21) {
        params.factoryDevType = 28;
    } else if (factoryDevType == 3 && extendedProtocol && extendedProtocol == 22) {
        params.factoryDevType = 30;
    } else if (factoryDevType == 3 && extendedProtocol && extendedProtocol == 23) {
        params.factoryDevType = 31;
    } else if (factoryDevType == 16) {
        params.factoryDevType = 23;
    } else if (factoryDevType == 7 && extendedProtocol == 0) {
        params.factoryDevType = 29;
    }
    if (rootElement.myUserRole.isPolice() && factoryDevType == 16) {
        params.factoryDevType = 16;
    }
    return params.factoryDevType;
}


/**
 *
 * @param type        默认 -1
 *       bit0:ADAS, bit1: DSM, bit2:TMPS, bit3:BSD, bit4:激烈驾驶, bit5:卫星定位, bit6:智能检测
 *       bit7:驾驶员身份识别,bit8:车辆运行监测 bit9:设备失效监测
 *
 * @returns
 */
function getAlarmFilter(type) {
    var result = {};
    var defaultType = -1;
    if (type) {
        defaultType = type;
    }
    var allAlarms_ = alarmClassification(-1, defaultType);
    //报警类型过滤
    if (allAlarms_ && allAlarms_.length > 0) {
        var protocolValue = GetCookie('EnableProtocolValue');//如果是-1 直接全部报警
        if (protocolValue) {
            if (protocolValue == "-1") {
                return null;
            }
            var alarms_ = protocolValue.split(",");
            //执行交集
            var intersection = allAlarms_.filter(function (v) {
                //indexOf不考虑ie8 以下浏览器了
                return alarms_.indexOf(v.id) > -1;
            });
            if (intersection && intersection.length > 0) {
                var types_ = [];//唯一性
                var typeStrs_ = [];//可能重复
                var mainType_ = [];//可能重复
                var obj_ = null;
                for (var i = 0, j = intersection.length; i < j; i++) {
                    obj_ = intersection[i];
                    types_.push(obj_.id);
                    //不再考虑ie8  indexOf 兼容性问题
                    if (typeStrs_.indexOf(obj_.classify) > -1) {
                    } else {
                        typeStrs_.push(obj_.classify);
                    }
                    if (mainType_.indexOf(obj_.mainType) > -1) {
                    } else {
                        mainType_.push(obj_.mainType);
                    }
                }
                result.type = types_;
                result.typeStr = typeStrs_;
                result.mainTypes = mainType_;
                return result;
            }
        } else {
            return null;
        }
    }
    return {type: [], typeStr: [], mainTypes: []};
}


//600，602，601
/**
 *
 * @param protocolValue   按位判断协议类型
 *  bit0:部标主动安全(苏标)    bit1:部标主动安全(陕标)    bit2:部标主动安全(883)    bit3:部标主动安全(辽宁)
 bit4:部标主动安全(浙标)    bit5:部标主动安全(渝标)    bit6:部标主动安全(川标)    bit7:部标主动安全(吉标)
 bit8:部标主动安全(上海)    bit9:部标主动安全(广西)    bit10:部标主动安全(新疆)    bit11:部标主动安全(江西)
 bit12:部标主动安全(河北) bit13:部标主动安全(甘肃) bit14:部标主动安全(黑龙江),bit15:部标主动安全(佛山),
 bit16:部标主动安全(山东) bit17:部标主动安全(湘标) bit18:部标主动安全(广东) bit19:部标主动安全(北京)
 bit20:部标主动安全(天津) bit21:部标主动安全(江苏)
 * @param type    按位判断
 *       bit0:ADAS, bit1: DSM, bit2:TMPS, bit3:BSD, bit4:激烈驾驶, bit5:卫星定位, bit6:智能检测,bit7:驾驶员身份识别,bit8:车辆运行监测
 *       bit9:设备失效监测
 */

function alarmClassification(protocolValue, type, ignoreDrinkWater) {
    var alarmArry = [];
    //如果没有协议 和 类型直接返回空
    if (!type || !protocolValue) {
        return alarmArry;
    }
    var isAll = false;
    if (protocolValue == -1) {
        isAll = true;
    }
    // //部标主动安全(苏标)  // 部标主动安全(河北) // 部标主动安全(佛山) // 部标主动安全(山东) // 部标主动安全(湘标) // 部标主动安全(广东)
    var isShuBiao = (protocolValue & 1 == 1) || ((protocolValue >> 12) & 1 == 1) ||
        ((protocolValue >> 15) & 1 == 1) || ((protocolValue >> 16) & 1 == 1);
    var isShanBiao = (protocolValue >> 1) & 1 == 1;//部标主动安全(陕标)
    var isBuBiao = (protocolValue >> 2) & 1 == 1;//部标主动安全(883)
    var isYingKou = (protocolValue >> 3) & 1 == 1;//部标主动安全(辽宁)
    var isZheBiao = (protocolValue >> 4) & 1 == 1;//部标主动安全(浙标)
    var isYuBiao = (protocolValue >> 5) & 1 == 1;//部标主动安全(渝标)
    var isChuanBiao = (protocolValue >> 6) & 1 == 1;//部标主动安全(川标)
    var isJiBiao = (protocolValue >> 7) & 1 == 1;//部标主动安全(吉标)
    var isShangHai = (protocolValue >> 8) & 1 == 1;//部标主动安全(上海)
    var isGuangXi = (protocolValue >> 9) & 1 == 1;//部标主动安全(广西)
    var isXinJiang = (protocolValue >> 10) & 1 == 1;//部标主动安全(新疆)
    var isJiangXi = (protocolValue >> 11) & 1 == 1;//部标主动安全(江西)
    var isGuangDong = (protocolValue >> 18) & 1 == 1;// 和苏标差异DSM的 长时间不目视前方替代分神驾驶
    //ADAS
    var isGansu = (protocolValue >> 13) & 1 == 1;//部标主动安全(甘肃)
    // 黑龙江
    var isHeiLongJiang = (protocolValue >> 14) & 1 == 1;//部标主动安全(黑龙江)
    // 湘标
    var isHuNan = ((protocolValue >> 17) & 1 == 1);//部标主动安全(湘标)
    // 北京
    var isBeiJing = ((protocolValue >> 19) & 1 == 1);//部标主动安全(北京)
    //天津
    var isTianJin = ((protocolValue >> 20) & 1 == 1);//部标主动安全(天津)
    //江苏
    var isJiangSu = ((protocolValue >> 21) & 1 == 1);//部标主动安全(天津)

    //ADAS
    if ((type & 1) == 1) {
        //通用部分 ADAS
        alarmArry.push({
            id: '600',
            mainType: 'activeSafetyAdas',
            classify: 'alarmLeaveType_600',
            name: rootElement.lang.alarm_name_600 + rootElement.lang.alarm_name_11111
        });
        alarmArry.push({
            id: '601',
            mainType: 'activeSafetyAdas',
            classify: 'alarmLeaveType_600',
            name: rootElement.lang.alarm_name_600 + rootElement.lang.alarm_name_22222
        });
        // 前车碰撞报警 3级
        if (isBeiJing) {
            alarmArry.push({
                id: '1207',
                mainType: 'activeSafetyAdas',
                classify: 'alarmLeaveType_600',
                name: rootElement.lang.alarm_name_600 + rootElement.lang.alarm_name_33333
            });
        }


        alarmArry.push({
            id: '602',
            mainType: 'activeSafetyAdas',
            classify: 'alarmLeaveType_602',
            name: rootElement.lang.alarm_name_602 + rootElement.lang.alarm_name_11111
        });
        alarmArry.push({
            id: '603',
            mainType: 'activeSafetyAdas',
            classify: 'alarmLeaveType_602',
            name: rootElement.lang.alarm_name_602 + rootElement.lang.alarm_name_22222
        });

        // 车道偏离报警 3级
        if (isBeiJing) {
            alarmArry.push({
                id: '1209',
                mainType: 'activeSafetyAdas',
                classify: 'alarmLeaveType_602',
                name: rootElement.lang.alarm_name_602 + rootElement.lang.alarm_name_33333
            });
        }


        if (isJiangSu || isBeiJing || isGuangDong || isHuNan || isShuBiao || isShanBiao || isBuBiao || isYingKou || isZheBiao || isYuBiao
            || isChuanBiao || isJiBiao || isShangHai || isGuangXi || isXinJiang || isJiangXi || isTianJin) {
            if (!isJiangSu || isAll) {
                alarmArry.push({
                    id: '604',
                    mainType: 'activeSafetyAdas',
                    classify: 'alarmLeaveType_604',
                    name: rootElement.lang.alarm_name_604 + rootElement.lang.alarm_name_11111
                });
                alarmArry.push({
                    id: '605',
                    mainType: 'activeSafetyAdas',
                    classify: 'alarmLeaveType_604',
                    name: rootElement.lang.alarm_name_604 + rootElement.lang.alarm_name_22222
                });
            }
            // 车距过近报警 3级
            if (isBeiJing) {
                alarmArry.push({
                    id: '1208',
                    mainType: 'activeSafetyAdas',
                    classify: 'alarmLeaveType_604',
                    name: rootElement.lang.alarm_name_604 + rootElement.lang.alarm_name_33333
                });
            }

            if (isJiangSu || isBeiJing || isGuangDong || isHuNan || isShuBiao || isShanBiao || isBuBiao || isZheBiao || isYuBiao
                || isChuanBiao || isJiBiao || isShangHai || isGuangXi || isXinJiang || isTianJin) {
                alarmArry.push({
                    id: '606',
                    mainType: 'activeSafetyAdas',
                    classify: 'alarmLeaveType_606',
                    name: rootElement.lang.alarm_name_606 + rootElement.lang.alarm_name_11111
                });
                alarmArry.push({
                    id: '607',
                    mainType: 'activeSafetyAdas',
                    classify: 'alarmLeaveType_606',
                    name: rootElement.lang.alarm_name_606 + rootElement.lang.alarm_name_22222
                });
                // 行人碰撞报警 3级
                if (isBeiJing) {
                    alarmArry.push({
                        id: '1210',
                        mainType: 'activeSafetyAdas',
                        classify: 'alarmLeaveType_606',
                        name: rootElement.lang.alarm_name_606 + rootElement.lang.alarm_name_33333
                    });
                }
            }

            if (isJiangSu || isBeiJing || isGuangDong || isHuNan || isShuBiao || isShanBiao || isBuBiao || isYingKou || isZheBiao || isYuBiao
                || isChuanBiao || isJiBiao || isShangHai || isGuangXi || isXinJiang || isTianJin) {
                if ((!isHuNan && !isBeiJing) || isAll) {
                    alarmArry.push({
                        id: '608',
                        mainType: 'activeSafetyAdas',
                        classify: 'frequent',
                        name: rootElement.lang.alarm_name_608 + rootElement.lang.alarm_name_11111
                    });
                    alarmArry.push({
                        id: '609',
                        mainType: 'activeSafetyAdas',
                        classify: 'frequent',
                        name: rootElement.lang.alarm_name_608 + rootElement.lang.alarm_name_22222
                    });
                    alarmArry.push({
                        id: '610',
                        mainType: 'activeSafetyAdas',
                        classify: 'signs',
                        name: rootElement.lang.alarm_name_610 + rootElement.lang.alarm_name_11111
                    });
                    alarmArry.push({
                        id: '611',
                        mainType: 'activeSafetyAdas',
                        classify: 'signs',
                        name: rootElement.lang.alarm_name_610 + rootElement.lang.alarm_name_22222
                    });
                }
            }
        }
        //浙江无该报警
        if (isJiangSu || isGuangDong || isShuBiao || isShanBiao || isBuBiao || isYuBiao
            || isChuanBiao || isJiBiao || isShangHai || isGuangXi || isXinJiang || isYingKou) {
            alarmArry.push({
                id: '612',
                mainType: 'activeSafetyAdas',
                classify: 'barrier',
                name: rootElement.lang.alarm_name_612 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '613',
                mainType: 'activeSafetyAdas',
                classify: 'barrier',
                name: rootElement.lang.alarm_name_612 + rootElement.lang.alarm_name_22222
            });
        }
        //部标  	0x08：弯道车速预警
        if (isBuBiao) {
            alarmArry.push({
                id: '700',
                mainType: 'activeSafetyAdas',
                classify: 'curvedCar',
                name: rootElement.lang.alarm_name_700 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '701',
                mainType: 'activeSafetyAdas',
                classify: 'curvedCar',
                name: rootElement.lang.alarm_name_700 + rootElement.lang.alarm_name_22222
            });
        }
        //川标, 广西 , 新疆  重庆   0x08：驾驶辅助功能失效报警
        if (isBeiJing || isChuanBiao || isGuangXi || isXinJiang || isYuBiao) {
            alarmArry.push({
                id: '715',
                mainType: 'activeSafetyAdas',
                classify: 'auxiliarySB',
                name: rootElement.lang.alarm_name_715 + rootElement.lang.alarm_name_11111
            });
            if (!isBeiJing || isAll) {
                alarmArry.push({
                    id: '716',
                    mainType: 'activeSafetyAdas',
                    classify: 'auxiliarySB',
                    name: rootElement.lang.alarm_name_715 + rootElement.lang.alarm_name_22222
                });
            }
        }
        //浙江  0x07：路口快速通过报警
        if (isZheBiao) {
            alarmArry.push({
                id: '728',
                mainType: 'activeSafetyAdas',
                classify: 'intersectionSB',
                name: rootElement.lang.alarm_name_728 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '729',
                mainType: 'activeSafetyAdas',
                classify: 'intersectionSB',
                name: rootElement.lang.alarm_name_728 + rootElement.lang.alarm_name_22222
            });
        }
        //吉林  	0x08：实线变道(前后呼应)
        if (isJiBiao || isGuangDong || isTianJin || isYingKou) {
            // 部标主动安全(黑龙江) 兼容吉林版本,除了ADAS报警少了一个0x08：实线变道(前后呼应)
            alarmArry.push({
                id: '730',
                mainType: 'activeSafetyAdas',
                classify: 'solidLineSB',
                name: rootElement.lang.alarm_name_730 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '731',
                mainType: 'activeSafetyAdas',
                classify: 'solidLineSB',
                name: rootElement.lang.alarm_name_730 + rootElement.lang.alarm_name_22222
            });
        }
        if (isGuangDong || isJiBiao || isJiangXi || isHuNan || isTianJin) {
            //吉林   0x12：设备失效提醒
            if (!isGuangDong || isAll) {
                alarmArry.push({
                    id: '732',
                    mainType: 'activeSafetyAdas',
                    classify: 'deviceFailureSB',
                    name: rootElement.lang.alarm_name_732 + rootElement.lang.alarm_name_11111
                });
                alarmArry.push({
                    id: '733',
                    mainType: 'activeSafetyAdas',
                    classify: 'deviceFailureSB',
                    name: rootElement.lang.alarm_name_732 + rootElement.lang.alarm_name_22222
                });
            }
        }

        if (isGuangDong) {
            alarmArry.push({
                id: '542',
                mainType: 'activeSafetyAdas',
                classify: 'alarmLeaveType_542',
                name: rootElement.lang.alarm_name_542 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '543',
                mainType: 'activeSafetyAdas',
                classify: 'alarmLeaveType_542',
                name: rootElement.lang.alarm_name_542 + rootElement.lang.alarm_name_22222
            });
        }


        //通用事件
        if ((!isHeiLongJiang && !isBeiJing) || isAll) {
            alarmArry.push({
                id: '614',
                mainType: 'activeSafetyAdas',
                classify: 'identify',
                name: rootElement.lang.alarm_name_614 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '615',
                mainType: 'activeSafetyAdas',
                classify: 'identify',
                name: rootElement.lang.alarm_name_614 + rootElement.lang.alarm_name_22222
            });
            alarmArry.push({
                id: '616',
                mainType: 'activeSafetyAdas',
                classify: 'snapshot',
                name: rootElement.lang.alarm_name_616 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '617',
                mainType: 'activeSafetyAdas',
                classify: 'snapshot',
                name: rootElement.lang.alarm_name_616 + rootElement.lang.alarm_name_22222
            });
        }

        if (isBuBiao || isJiBiao || isChuanBiao || isJiangXi || isShangHai || isXinJiang || isYuBiao) {
            alarmArry.push({
                id: '840',
                mainType: 'activeSafetyAdas',
                classify: 'lowSpeedFcwWarning',
                name: rootElement.lang.alarm_name_840 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '841',
                mainType: 'activeSafetyAdas',
                classify: 'lowSpeedFcwWarning',
                name: rootElement.lang.alarm_name_840 + rootElement.lang.alarm_name_22222
            });
        }

        // 渣土车的路面抛洒
        if (isShuBiao) {
            alarmArry.push({
                id: '839',
                mainType: 'activeSafetyAdas',
                classify: 'alarmType_839',
                name: rootElement.lang.alarm_name_839
            });
        }

        // 不知道那个报警类型的，和喝水报警一起忽略
        if (ignoreDrinkWater) {
        } else {
            // 黑车
            alarmArry.push({
                id: '530',
                mainType: 'activeSafetyAdas',
                classify: 'blacklisted',
                name: rootElement.lang.alarm_name_530 + rootElement.lang.alarm_name_11111
            });

            alarmArry.push({
                id: '531',
                mainType: 'activeSafetyAdas',
                classify: 'blacklisted',
                name: rootElement.lang.alarm_name_530 + rootElement.lang.alarm_name_22222
            });

            alarmArry.push({
                id: '532',
                mainType: 'activeSafetyAdas',
                classify: 'whitelisted',
                name: rootElement.lang.alarm_name_532 + rootElement.lang.alarm_name_11111
            });

            alarmArry.push({
                id: '533',
                mainType: 'activeSafetyAdas',
                classify: 'whitelisted',
                name: rootElement.lang.alarm_name_532 + rootElement.lang.alarm_name_22222
            });

            alarmArry.push({
                id: '534',
                mainType: 'activeSafetyAdas',
                classify: 'authorizeOverdue',
                name: rootElement.lang.alarm_name_534 + rootElement.lang.alarm_name_11111
            });

            alarmArry.push({
                id: '535',
                mainType: 'activeSafetyAdas',
                classify: 'authorizeOverdue',
                name: rootElement.lang.alarm_name_534 + rootElement.lang.alarm_name_22222
            });

            alarmArry.push({
                id: '536',
                mainType: 'activeSafetyAdas',
                classify: 'unauthorized',
                name: rootElement.lang.alarm_name_536 + rootElement.lang.alarm_name_11111
            });

            alarmArry.push({
                id: '537',
                mainType: 'activeSafetyAdas',
                classify: 'unauthorized',
                name: rootElement.lang.alarm_name_536 + rootElement.lang.alarm_name_22222
            });
        }

        // 前车碰撞报警 3级
        if (isBeiJing) {
            // 限速报警
            alarmArry.push({
                id: '1214',
                mainType: 'activeSafetyAdas',
                classify: 'alarmLeaveType_1214',
                name: rootElement.lang.alarm_name_1214 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '1215',
                mainType: 'activeSafetyAdas',
                classify: 'alarmLeaveType_1214',
                name: rootElement.lang.alarm_name_1214 + rootElement.lang.alarm_name_22222
            });
            alarmArry.push({
                id: '1216',
                mainType: 'activeSafetyAdas',
                classify: 'alarmLeaveType_1214',
                name: rootElement.lang.alarm_name_1214 + rootElement.lang.alarm_name_33333
            });
            // 限高报警
            alarmArry.push({
                id: '1217',
                mainType: 'activeSafetyAdas',
                classify: 'alarmLeaveType_1217',
                name: rootElement.lang.alarm_name_1217 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '1218',
                mainType: 'activeSafetyAdas',
                classify: 'alarmLeaveType_1217',
                name: rootElement.lang.alarm_name_1217 + rootElement.lang.alarm_name_22222
            });
            alarmArry.push({
                id: '1219',
                mainType: 'activeSafetyAdas',
                classify: 'alarmLeaveType_1217',
                name: rootElement.lang.alarm_name_1217 + rootElement.lang.alarm_name_33333
            });
            // 限宽报警
            alarmArry.push({
                id: '1220',
                mainType: 'activeSafetyAdas',
                classify: 'alarmLeaveType_1220',
                name: rootElement.lang.alarm_name_1220 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '1221',
                mainType: 'activeSafetyAdas',
                classify: 'alarmLeaveType_1220',
                name: rootElement.lang.alarm_name_1220 + rootElement.lang.alarm_name_22222
            });
            alarmArry.push({
                id: '1222',
                mainType: 'activeSafetyAdas',
                classify: 'alarmLeaveType_1220',
                name: rootElement.lang.alarm_name_1220 + rootElement.lang.alarm_name_33333
            });
            // 限重报警
            alarmArry.push({
                id: '1223',
                mainType: 'activeSafetyAdas',
                classify: 'alarmLeaveType_1223',
                name: rootElement.lang.alarm_name_1223 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '1224',
                mainType: 'activeSafetyAdas',
                classify: 'alarmLeaveType_1223',
                name: rootElement.lang.alarm_name_1223 + rootElement.lang.alarm_name_22222
            });
            alarmArry.push({
                id: '1225',
                mainType: 'activeSafetyAdas',
                classify: 'alarmLeaveType_1223',
                name: rootElement.lang.alarm_name_1223 + rootElement.lang.alarm_name_33333
            });
        }

        //
        if (isChuanBiao) {
            alarmArry.push({
                id: '1400',
                mainType: 'activeSafetyAdas',
                classify: 'alarmLeaveType_1400',
                name: rootElement.lang.alarm_name_1400 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '1401',
                mainType: 'activeSafetyAdas',
                classify: 'alarmLeaveType_1400',
                name: rootElement.lang.alarm_name_1400 + rootElement.lang.alarm_name_22222
            });
        }
        if (isShuBiao) {
            alarmArry.push({
                id: '1402',
                mainType: 'activeSafetyAdas',
                classify: 'alarmLeaveType_1402',
                name: rootElement.lang.alarm_name_1402 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '1403',
                mainType: 'activeSafetyAdas',
                classify: 'alarmLeaveType_1402',
                name: rootElement.lang.alarm_name_1402 + rootElement.lang.alarm_name_22222
            });
        }
    }
    //DSM
    if (((type >> 1) & 1) == 1) {
        //通用报警
        //	0x01:疲劳驾驶报警
        alarmArry.push({
            id: '618',
            mainType: 'activeSafetyDsm',
            classify: 'alarmLeaveType_618',
            name: rootElement.lang.alarm_name_618 + rootElement.lang.alarm_name_11111
        });
        alarmArry.push({
            id: '619',
            mainType: 'activeSafetyDsm',
            classify: 'alarmLeaveType_618',
            name: rootElement.lang.alarm_name_618 + rootElement.lang.alarm_name_22222
        });
        if (rootElement.myUserRole && rootElement.myUserRole.isEpidemicSupport()) {
            alarmArry.push({
                id: '1429',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_1429',
                name: rootElement.lang.alarm_name_1429
            });
        }
        // 疲劳驾驶报警3级
        if (isBeiJing) {
            alarmArry.push({
                id: '1200',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_618',
                name: rootElement.lang.alarm_name_618 + rootElement.lang.alarm_name_33333
            });
        }

        //0x02:接打电话报警
        if (!isHeiLongJiang || isAll) {
            alarmArry.push({
                id: '620',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_620',
                name: rootElement.lang.alarm_name_620 + rootElement.lang.alarm_name_11111
            });
        }
        alarmArry.push({
            id: '621',
            mainType: 'activeSafetyDsm',
            classify: 'alarmLeaveType_620',
            name: rootElement.lang.alarm_name_620 + rootElement.lang.alarm_name_22222
        });
        // 接打电话报警 3级
        if (isBeiJing) {
            alarmArry.push({
                id: '1203',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_620',
                name: rootElement.lang.alarm_name_620 + rootElement.lang.alarm_name_33333
            });
        }


        //	0x03:抽烟报警
        if ((!isHeiLongJiang && !isJiangSu) || isAll) {
            alarmArry.push({
                id: '622',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_622',
                name: rootElement.lang.alarm_name_622 + rootElement.lang.alarm_name_11111
            });
        }
        if (!isJiangSu || isAll) {
            alarmArry.push({
                id: '623',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_622',
                name: rootElement.lang.alarm_name_622 + rootElement.lang.alarm_name_22222
            });
        }


        // 抽烟报警3级
        if (isBeiJing) {
            alarmArry.push({
                id: '1202',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_622',
                name: rootElement.lang.alarm_name_622 + rootElement.lang.alarm_name_33333
            });
        }

        //部标/吉林/川标/广西/新疆/重庆  无    0x04:分神驾驶报警
        if (isBeiJing || isGuangDong || isShuBiao || isShanBiao || isZheBiao || isShangHai) {
            if (!isGuangDong || isAll) {
                alarmArry.push({
                    id: '624',
                    mainType: 'activeSafetyDsm',
                    classify: 'alarmLeaveType_624',
                    name: rootElement.lang.alarm_name_624 + rootElement.lang.alarm_name_11111
                });
                alarmArry.push({
                    id: '625',
                    mainType: 'activeSafetyDsm',
                    classify: 'alarmLeaveType_624',
                    name: rootElement.lang.alarm_name_624 + rootElement.lang.alarm_name_22222
                });
            }
            // 分神驾驶3级
            if (isBeiJing) {
                alarmArry.push({
                    id: '1201',
                    mainType: 'activeSafetyDsm',
                    classify: 'alarmLeaveType_624',
                    name: rootElement.lang.alarm_name_624 + rootElement.lang.alarm_name_33333
                });
            }
        }

        if (isJiangSu || isBeiJing || isGuangDong || isShuBiao || isShanBiao || isYingKou || isZheBiao || isShangHai) {
            //部标/吉林/川标/广西 /新疆/重庆   无  0x05:驾驶员异常报警
            alarmArry.push({
                id: '626',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_626',
                name: rootElement.lang.alarm_name_626 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '627',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_626',
                name: rootElement.lang.alarm_name_626 + rootElement.lang.alarm_name_22222
            });

            // 驾驶员异常报警 3级
            if (isBeiJing) {
                alarmArry.push({
                    id: '1206',
                    mainType: 'activeSafetyDsm',
                    classify: 'alarmLeaveType_626',
                    name: rootElement.lang.alarm_name_626 + rootElement.lang.alarm_name_33333
                });
            }

        }
        //上海  0x2B:红外阻隔型墨镜报警
        //吉林 0x12：红外阻断型墨镜失效提醒
        //江西 0x09：红外阻断型墨镜失效提醒
        if (isYingKou || isBeiJing || isGuangDong || isHuNan || isShangHai || isJiBiao || isGansu || isJiangXi || isHeiLongJiang || isTianJin) {
            if (!isHeiLongJiang || isAll) {
                alarmArry.push({
                    id: '639',
                    mainType: 'activeSafetyDsm',
                    classify: 'sunglassFailure',
                    name: rootElement.lang.alarm_name_639 + rootElement.lang.alarm_name_11111
                });
            }
            if (!isBeiJing || isAll) {
                alarmArry.push({
                    id: '640',
                    mainType: 'activeSafetyDsm',
                    classify: 'sunglassFailure',
                    name: rootElement.lang.alarm_name_639 + rootElement.lang.alarm_name_22222
                });
            }
        }

        //陕标  0x06：驾驶人 IC 卡异常报警
        if (isShanBiao) {
            alarmArry.push({
                id: '641',
                mainType: 'activeSafetyDsm',
                classify: 'driverIC',
                name: rootElement.lang.alarm_name_641 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '642',
                mainType: 'activeSafetyDsm',
                classify: 'driverIC',
                name: rootElement.lang.alarm_name_641 + rootElement.lang.alarm_name_22222
            });
        }
        //不知道那个协议的报警  喝水报警
        if (ignoreDrinkWater) {
        } else {
            alarmArry.push({
                id: '644',
                mainType: 'activeSafetyDsm',
                classify: 'drinkWater',
                name: rootElement.lang.alarm_name_644 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '645',
                mainType: 'activeSafetyDsm',
                classify: 'drinkWater',
                name: rootElement.lang.alarm_name_644 + rootElement.lang.alarm_name_22222
            });

            //单手脱离方向盘
            alarmArry.push({
                id: '745',
                mainType: 'activeSafetyDsm',
                classify: 'oneHandsOff',
                name: rootElement.lang.alarm_name_745 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '746',
                mainType: 'activeSafetyDsm',
                classify: 'oneHandsOff',
                name: rootElement.lang.alarm_name_745 + rootElement.lang.alarm_name_22222
            });

            alarmArry.push({
                id: '1226',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_1226',
                name: rootElement.lang.alarm_name_1226 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '1227',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_1226',
                name: rootElement.lang.alarm_name_1226 + rootElement.lang.alarm_name_22222
            });

            alarmArry.push({
                id: '1228',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_1228',
                name: rootElement.lang.alarm_name_1228 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '1229',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_1228',
                name: rootElement.lang.alarm_name_1228 + rootElement.lang.alarm_name_22222
            });
            alarmArry.push({
                id: '1230',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_1230',
                name: rootElement.lang.alarm_name_1230 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '1231',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_1230',
                name: rootElement.lang.alarm_name_1230 + rootElement.lang.alarm_name_22222
            });
            alarmArry.push({
                id: '1232',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_1232',
                name: rootElement.lang.alarm_name_1232 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '1233',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_1232',
                name: rootElement.lang.alarm_name_1232 + rootElement.lang.alarm_name_22222
            });
        }

        //部标/吉林/川标/广西 /新疆/重庆/江西    0x04:长时间不目视前方报警
        if (isJiangSu || isHuNan || isBuBiao || isJiBiao || isHeiLongJiang || isChuanBiao || isGuangXi || isXinJiang || isYuBiao || isGansu || isJiangXi
            || isGuangDong || isTianJin || isYingKou) {
            if (!isHeiLongJiang || isAll) {
                alarmArry.push({
                    id: '702',
                    mainType: 'activeSafetyDsm',
                    classify: 'lookAhead',
                    name: rootElement.lang.alarm_name_702 + rootElement.lang.alarm_name_11111
                });
            }
            alarmArry.push({
                id: '703',
                mainType: 'activeSafetyDsm',
                classify: 'lookAhead',
                name: rootElement.lang.alarm_name_702 + rootElement.lang.alarm_name_22222
            });
        }
        //部标   0x05:系统不能正常工作报警
        if (isBuBiao) {
            alarmArry.push({
                id: '704',
                mainType: 'activeSafetyDsm',
                classify: 'notWork',
                name: rootElement.lang.alarm_name_704 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '705',
                mainType: 'activeSafetyDsm',
                classify: 'notWork',
                name: rootElement.lang.alarm_name_704 + rootElement.lang.alarm_name_22222
            });
        }
        //部标/ 川标 /上海/吉林//新疆/重庆/江西    0x06:驾驶员未系安全带报警
        if (isJiangSu || isBeiJing || isGuangDong || isHuNan || isBuBiao || isJiBiao || isChuanBiao || isJiangXi || isShangHai || isXinJiang || isYuBiao || isTianJin) {
            alarmArry.push({
                id: '706',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_706',
                name: rootElement.lang.alarm_name_706 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '707',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_706',
                name: rootElement.lang.alarm_name_706 + rootElement.lang.alarm_name_22222
            });
        }
        // 驾驶员未系安全带报警 3级
        if (isBeiJing) {
            alarmArry.push({
                id: '1205',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_706',
                name: rootElement.lang.alarm_name_706 + rootElement.lang.alarm_name_33333
            });
        }


        // 部标/川标/吉林/广西/新疆/重庆/江西     0x07:驾驶员不在驾驶位报警
        if (isHuNan || isBuBiao || isJiBiao || isHeiLongJiang || isChuanBiao || isGuangXi || isXinJiang || isYuBiao || isGansu || isJiangXi || isTianJin) {
            if (!isHeiLongJiang || isAll) {
                alarmArry.push({
                    id: '708',
                    mainType: 'activeSafetyDsm',
                    classify: 'notSeat',
                    name: rootElement.lang.alarm_name_708 + rootElement.lang.alarm_name_11111
                });
            }
            alarmArry.push({
                id: '709',
                mainType: 'activeSafetyDsm',
                classify: 'notSeat',
                name: rootElement.lang.alarm_name_708 + rootElement.lang.alarm_name_22222
            });
        }
        // 浙江/辽宁/陕标/苏标  无    0x06：双手同时脱离方向盘报警
        if (isJiangSu || isBeiJing || isGuangDong || isBuBiao || isJiangXi || isJiBiao || isChuanBiao || isGuangXi || isShangHai || isXinJiang || isYuBiao || isGansu || isTianJin) {
            alarmArry.push({
                id: '710',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_710',
                name: rootElement.lang.alarm_name_710 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '711',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_710',
                name: rootElement.lang.alarm_name_710 + rootElement.lang.alarm_name_22222
            });
        }
        // 双手同时脱离方向盘报警 3级
        if (isBeiJing) {
            alarmArry.push({
                id: '1204',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_710',
                name: rootElement.lang.alarm_name_710 + rootElement.lang.alarm_name_33333
            });
        }


        //川标/广西/ 新疆/重庆  0x07：驾驶员行为监测功能失效报警
        if (isBeiJing || isChuanBiao || isGuangXi || isXinJiang || isYuBiao) {
            alarmArry.push({
                id: '717',
                mainType: 'activeSafetyDsm',
                classify: 'driverMonitoringSB',
                name: rootElement.lang.alarm_name_717 + rootElement.lang.alarm_name_11111
            });
            if (!isBeiJing || isAll) {
                alarmArry.push({
                    id: '718',
                    mainType: 'activeSafetyDsm',
                    classify: 'driverMonitoringSB',
                    name: rootElement.lang.alarm_name_717 + rootElement.lang.alarm_name_22222
                });
            }
        }
        // 川标/ 新疆/重庆   0x05:驾驶员异常报警
        if (isChuanBiao || isXinJiang || isYuBiao) {
            alarmArry.push({
                id: '719',
                mainType: 'activeSafetyDsm',
                classify: 'driverAbnormalSB',
                name: rootElement.lang.alarm_name_719
            });
        }
        //浙江 0x06:探头遮挡报警
        //上海 0x2A:摄像头遮挡报警
        //吉林 0x13:设备遮挡失效提醒
        //江西 0x08:设备遮挡失效提醒
        if (isYingKou || isBeiJing || isGuangDong || isHuNan || isZheBiao || isShangHai || isJiBiao || isHeiLongJiang || isGansu || isJiangXi || isTianJin) {
            if (!isHeiLongJiang || isAll) {
                alarmArry.push({
                    id: '734',
                    mainType: 'activeSafetyDsm',
                    classify: 'occlusionSB',
                    name: rootElement.lang.alarm_name_734 + rootElement.lang.alarm_name_11111
                });
            }
            if (!isBeiJing || isAll) {
                alarmArry.push({
                    id: '735',
                    mainType: 'activeSafetyDsm',
                    classify: 'occlusionSB',
                    name: rootElement.lang.alarm_name_734 + rootElement.lang.alarm_name_22222
                });
            }
        }
        //吉林/浙江  0x11：换人驾驶事件
        if (isHuNan || isZheBiao || isJiBiao || isGuangDong || isTianJin || isChuanBiao) {
            if (isZheBiao || isJiBiao) {
                alarmArry.push({
                    id: '736',
                    mainType: 'activeSafetyDsm',
                    classify: 'substitutionSB',
                    name: rootElement.lang.alarm_name_736 + rootElement.lang.alarm_name_11111
                });
                alarmArry.push({
                    id: '737',
                    mainType: 'activeSafetyDsm',
                    classify: 'substitutionSB',
                    name: rootElement.lang.alarm_name_736 + rootElement.lang.alarm_name_22222
                });
            }
            //吉林/浙江  0x0F：超时驾驶报警
            alarmArry.push({
                id: '738',
                mainType: 'activeSafetyDsm',
                classify: 'overtimeSB',
                name: rootElement.lang.alarm_name_738 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '739',
                mainType: 'activeSafetyDsm',
                classify: 'overtimeSB',
                name: rootElement.lang.alarm_name_738 + rootElement.lang.alarm_name_22222
            });
        }

        if (isChuanBiao) {
            alarmArry.push({
                id: '1408',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_1408',
                name: rootElement.lang.alarm_name_1408 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '1409',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_1408',
                name: rootElement.lang.alarm_name_1408 + rootElement.lang.alarm_name_22222
            });
        }

        if (isBuBiao || isJiBiao || isChuanBiao || isJiangXi || isShangHai || isXinJiang || isYuBiao) {
            alarmArry.push({
                id: '845',
                mainType: 'activeSafetyDsm',
                classify: 'longDrivingDsm',
                name: rootElement.lang.alarm_name_845 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '846',
                mainType: 'activeSafetyDsm',
                classify: 'longDrivingDsm',
                name: rootElement.lang.alarm_name_845 + rootElement.lang.alarm_name_22222
            });
        }
        if (isBuBiao || isJiBiao || isChuanBiao || isJiangXi || isShangHai || isXinJiang || isYuBiao) {
            //司机归来事件
            alarmArry.push({
                id: '843',
                mainType: 'activeSafetyDsm',
                classify: 'driverReturnDsm',
                name: rootElement.lang.alarm_name_843
            });
            //身份认证失败事件
            alarmArry.push({
                id: '844',
                mainType: 'activeSafetyDsm',
                classify: 'driverIdentityFailureDsm',
                name: rootElement.lang.alarm_name_844
            });
            //身份认证成功事件
            alarmArry.push({
                id: '847',
                mainType: 'activeSafetyDsm',
                classify: 'driverIdentitySuccessDsm',
                name: rootElement.lang.alarm_name_847
            });
            if (isShangHai) {
                // 驾驶员正脸抓拍事件
                alarmArry.push({
                    id: '842',
                    mainType: 'activeSafetyDsm',
                    classify: 'driverFaceCaptureDsm',
                    name: rootElement.lang.alarm_name_842
                });
            }
        }

        //通用事件
        if ((!isHeiLongJiang && !isBeiJing) || isAll) {
            alarmArry.push({
                id: '628',
                mainType: 'activeSafetyDsm',
                classify: 'automatic',
                name: rootElement.lang.alarm_name_628 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '629',
                mainType: 'activeSafetyDsm',
                classify: 'automatic',
                name: rootElement.lang.alarm_name_628 + rootElement.lang.alarm_name_22222
            });
        }
        //浙江无
        //浙标 吉标 无
        if (isJiangSu || isGuangDong || isHuNan || isShuBiao || isShanBiao || isBuBiao || isYingKou || isYuBiao
            || isChuanBiao || isShangHai || isGuangXi || isXinJiang || isJiangXi) {
            alarmArry.push({
                id: '630',
                mainType: 'activeSafetyDsm',
                classify: 'change',
                name: rootElement.lang.alarm_name_630 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '631',
                mainType: 'activeSafetyDsm',
                classify: 'change',
                name: rootElement.lang.alarm_name_630 + rootElement.lang.alarm_name_22222
            });
        }

        if (isJiangSu || isHuNan || isGuangDong || isTianJin) {
            alarmArry.push({
                id: '525',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_525',
                name: rootElement.lang.alarm_name_525 + rootElement.lang.alarm_name_11111
            });
            if (isJiangSu || isGuangDong || isTianJin) {
                alarmArry.push({
                    id: '541',
                    mainType: 'activeSafetyDsm',
                    classify: 'alarmLeaveType_525',
                    name: rootElement.lang.alarm_name_525 + rootElement.lang.alarm_name_22222
                });
            }


            if ((!isGuangDong && !isJiangSu) || isAll) {
                alarmArry.push({
                    id: '526',
                    mainType: 'activeSafetyDsm',
                    classify: 'alarmType_526',
                    name: rootElement.lang.alarm_name_526
                });
            }
        }


        if (isChuanBiao) {
            alarmArry.push({
                id: '1238',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_1238',
                name: rootElement.lang.alarm_name_1238 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '1239',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_1238',
                name: rootElement.lang.alarm_name_1238 + rootElement.lang.alarm_name_22222
            });

            alarmArry.push({
                id: '1410',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_1410',
                name: rootElement.lang.alarm_name_1410 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '1411',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_1410',
                name: rootElement.lang.alarm_name_1410 + rootElement.lang.alarm_name_22222
            });

            alarmArry.push({
                id: '1404',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_1404',
                name: rootElement.lang.alarm_name_1404 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '1405',
                mainType: 'activeSafetyDsm',
                classify: 'alarmLeaveType_1404',
                name: rootElement.lang.alarm_name_1404 + rootElement.lang.alarm_name_22222
            });
        }
    }
    //TMPS胎压
    if (((type >> 2) & 1) == 1) {
        //苏标/川标/广西/ 新疆/重庆
        if (isJiangSu || isGuangDong || isShuBiao || isChuanBiao || isGuangXi || isXinJiang || isYuBiao) {
            alarmArry.push({
                id: '632',
                mainType: 'activeSafetyTmps',
                classify: 'tire',
                name: rootElement.lang.alarm_name_632
            });
        }
    }
    //  BSD接近报警
    if (((type >> 3) & 1) == 1) {
        //吉林无
        if (isJiangSu || isGuangDong || isZheBiao || isShuBiao || isShanBiao || isBuBiao /*|| isYingKou */ || isYuBiao
            || isChuanBiao || isShangHai || isGuangXi || isXinJiang || isJiangXi) {
            if (isJiangSu || isGuangDong || isZheBiao || isShuBiao || isShanBiao || isBuBiao /*|| isYingKou*/ || isYuBiao
                || isChuanBiao || isShangHai || isGuangXi || isXinJiang) {
                alarmArry.push({
                    id: '633',
                    mainType: 'activeSafetyProximity',
                    classify: 'rear',
                    name: rootElement.lang.alarm_name_633
                });
                alarmArry.push({
                    id: '634',
                    mainType: 'activeSafetyProximity',
                    classify: 'leftRear',
                    name: rootElement.lang.alarm_name_634
                });
            }
            alarmArry.push({
                id: '635',
                mainType: 'activeSafetyProximity',
                classify: 'rightRear',
                name: rootElement.lang.alarm_name_635
            });


            if (isJiangSu) {
                alarmArry.push({
                    id: '1432',
                    mainType: 'activeSafetyProximity',
                    classify: 'alarmType_1432',
                    name: rootElement.lang.alarm_name_1432
                });
            }

        }
        // 渣土车
        if (isShuBiao || isChuanBiao || isTianJin) {
            alarmArry.push({
                id: '747',
                mainType: 'activeSafetyProximity',
                classify: 'alarmType_747',
                name: rootElement.lang.alarm_name_747
            });
            alarmArry.push({
                id: '748',
                mainType: 'activeSafetyProximity',
                classify: 'alarmType_748',
                name: rootElement.lang.alarm_name_748
            });
            alarmArry.push({
                id: '749',
                mainType: 'activeSafetyProximity',
                classify: 'alarmType_749',
                name: rootElement.lang.alarm_name_749
            });
        }
        if (isBeiJing) {
            // 盲区监测报警
            alarmArry.push({
                id: '1211',
                mainType: 'activeSafetyProximity',
                classify: 'alarmLeaveType_1211',
                name: rootElement.lang.alarm_name_1211 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '1212',
                mainType: 'activeSafetyProximity',
                classify: 'alarmLeaveType_1211',
                name: rootElement.lang.alarm_name_1211 + rootElement.lang.alarm_name_22222
            });
            alarmArry.push({
                id: '1213',
                mainType: 'activeSafetyProximity',
                classify: 'alarmLeaveType_1211',
                name: rootElement.lang.alarm_name_1211 + rootElement.lang.alarm_name_33333
            });
        }
        // 20210526
        if (isChuanBiao) {
            alarmArry.push({
                id: '1234',
                mainType: 'activeSafetyProximity',
                classify: 'alarmLeaveType_1234',
                name: rootElement.lang.alarm_name_1234 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '1235',
                mainType: 'activeSafetyProximity',
                classify: 'alarmLeaveType_1234',
                name: rootElement.lang.alarm_name_1234 + rootElement.lang.alarm_name_22222
            });
        }
        if (isChuanBiao) {
            alarmArry.push({
                id: '1414',
                mainType: 'activeSafetyProximity',
                classify: 'alarmType_1414',
                name: rootElement.lang.alarm_name_1414
            });
            alarmArry.push({
                id: '1415',
                mainType: 'activeSafetyProximity',
                classify: 'alarmType_1415',
                name: rootElement.lang.alarm_name_1415
            });
        }
    }
    //激烈驾驶报警
    if (((type >> 4) & 1) == 1) {
        ///川标/广西/ 新疆/重庆
        if (isChuanBiao || isGuangXi || isXinJiang || isYuBiao) {
            alarmArry.push({
                id: '720',
                mainType: 'activeSafetyFierce',
                classify: 'acceleratedSB',
                name: rootElement.lang.alarm_name_720
            });
            alarmArry.push({
                id: '721',
                mainType: 'activeSafetyFierce',
                classify: 'decelerationSB',
                name: rootElement.lang.alarm_name_721
            });
            alarmArry.push({
                id: '722',
                mainType: 'activeSafetyFierce',
                classify: 'sharpTurnSB',
                name: rootElement.lang.alarm_name_722
            });
            alarmArry.push({
                id: '723',
                mainType: 'activeSafetyFierce',
                classify: 'idleSpeedSB',
                name: rootElement.lang.alarm_name_723
            });
            alarmArry.push({
                id: '724',
                mainType: 'activeSafetyFierce',
                classify: 'flameoutSB',
                name: rootElement.lang.alarm_name_724
            });
            alarmArry.push({
                id: '725',
                mainType: 'activeSafetyFierce',
                classify: 'coastingSB',
                name: rootElement.lang.alarm_name_725
            });
            alarmArry.push({
                id: '726',
                mainType: 'activeSafetyFierce',
                classify: 'overturnSB',
                name: rootElement.lang.alarm_name_726
            });
        }


        // 20210526
        if (isChuanBiao) {
            alarmArry.push({
                id: '1236',
                mainType: 'activeSafetyFierce',
                classify: 'alarmType_1236',
                name: rootElement.lang.alarm_name_1236
            });
        }

        if (isChuanBiao || isGuangXi || isXinJiang || isYuBiao) {
            alarmArry.push({
                id: '1242',
                mainType: 'activeSafetyFierce',
                classify: 'alarmType_1242',
                name: rootElement.lang.alarm_name_1242
            });
            alarmArry.push({
                id: '1243',
                mainType: 'activeSafetyFierce',
                classify: 'alarmType_1243',
                name: rootElement.lang.alarm_name_1243
            });
            alarmArry.push({
                id: '1244',
                mainType: 'activeSafetyFierce',
                classify: 'alarmType_1244',
                name: rootElement.lang.alarm_name_1244
            });
        }

        // IO报警
        if (isChuanBiao) {
            //
            alarmArry.push({
                id: '1416',
                mainType: 'activeSafetyFierce',
                classify: 'alarmType_1416',
                name: rootElement.lang.alarm_name_1416
            });
            alarmArry.push({
                id: '1417',
                mainType: 'activeSafetyFierce',
                classify: 'alarmType_1417',
                name: rootElement.lang.alarm_name_1417
            });
            alarmArry.push({
                id: '1418',
                mainType: 'activeSafetyFierce',
                classify: 'alarmType_1418',
                name: rootElement.lang.alarm_name_1418
            });
            alarmArry.push({
                id: '1419',
                mainType: 'activeSafetyFierce',
                classify: 'alarmType_1419',
                name: rootElement.lang.alarm_name_1419
            });
            alarmArry.push({
                id: '1420',
                mainType: 'activeSafetyFierce',
                classify: 'alarmType_1420',
                name: rootElement.lang.alarm_name_1420
            });
            alarmArry.push({
                id: '1421',
                mainType: 'activeSafetyFierce',
                classify: 'alarmType_1421',
                name: rootElement.lang.alarm_name_1421
            });
            alarmArry.push({
                id: '1422',
                mainType: 'activeSafetyFierce',
                classify: 'alarmType_1422',
                name: rootElement.lang.alarm_name_1422
            });
            alarmArry.push({
                id: '1423',
                mainType: 'activeSafetyFierce',
                classify: 'alarmType_1423',
                name: rootElement.lang.alarm_name_1423
            });
            alarmArry.push({
                id: '1424',
                mainType: 'activeSafetyFierce',
                classify: 'alarmType_1424',
                name: rootElement.lang.alarm_name_1424
            });
            alarmArry.push({
                id: '1425',
                mainType: 'activeSafetyFierce',
                classify: 'alarmType_1425',
                name: rootElement.lang.alarm_name_1425
            });
            alarmArry.push({
                id: '1426',
                mainType: 'activeSafetyFierce',
                classify: 'alarmType_1426',
                name: rootElement.lang.alarm_name_1426
            });
            alarmArry.push({
                id: '1427',
                mainType: 'activeSafetyFierce',
                classify: 'alarmType_1427',
                name: rootElement.lang.alarm_name_1427
            });
        }
    }
    //卫星定位
    if (((type >> 5) & 1) == 1) {
        ///川标/ 新疆/重庆
        if (isChuanBiao || isXinJiang || isYuBiao) {
            alarmArry.push({
                id: '727',
                mainType: 'activeSafetySatellite',
                classify: 'overspeedSB',
                name: rootElement.lang.alarm_name_727
            });
            alarmArry.push({
                id: '744',
                mainType: 'activeSafetySatellite',
                classify: 'overspeedSBRoad',
                name: rootElement.lang.alarm_name_744
            });
        }

        if (isChuanBiao) {
            alarmArry.push({
                id: '1406',
                mainType: 'activeSafetySatellite',
                classify: 'alarmType_1406',
                name: rootElement.lang.alarm_name_1406
            });
            alarmArry.push({
                id: '1407',
                mainType: 'activeSafetySatellite',
                classify: 'alarmType_1407',
                name: rootElement.lang.alarm_name_1407
            });
            alarmArry.push({
                id: '1412',
                mainType: 'activeSafetySatellite',
                classify: 'alarmType_1412',
                name: rootElement.lang.alarm_name_1412
            });
            alarmArry.push({
                id: '1413',
                mainType: 'activeSafetySatellite',
                classify: 'alarmType_1413',
                name: rootElement.lang.alarm_name_1413
            });
        }
    }
    //智能检测
    if (((type >> 6) & 1) == 1) {
        //上海
        if (isShangHai || isJiangXi || isHuNan) {
            alarmArry.push({
                id: '740',
                mainType: 'activeSafetyZnjc',
                classify: 'carOverloadSB',
                name: rootElement.lang.alarm_name_740 + rootElement.lang.alarm_name_11111
            });
            alarmArry.push({
                id: '741',
                mainType: 'activeSafetyZnjc',
                classify: 'carOverloadSB',
                name: rootElement.lang.alarm_name_740 + rootElement.lang.alarm_name_22222
            });
            if (isShangHai) {
                alarmArry.push({
                    id: '742',
                    mainType: 'activeSafetyZnjc',
                    classify: 'offSitePassengerSB',
                    name: rootElement.lang.alarm_name_742 + rootElement.lang.alarm_name_11111
                });
                alarmArry.push({
                    id: '743',
                    mainType: 'activeSafetyZnjc',
                    classify: 'offSitePassengerSB',
                    name: rootElement.lang.alarm_name_742 + rootElement.lang.alarm_name_22222
                });
            }
        }

        if (isHuNan) {
            alarmArry.push({
                id: '527',
                mainType: 'activeSafetyZnjc',
                classify: 'alarmType_527',
                name: rootElement.lang.alarm_name_527
            });
            alarmArry.push({
                id: '528',
                mainType: 'activeSafetyZnjc',
                classify: 'alarmType_528',
                name: rootElement.lang.alarm_name_528
            });
            alarmArry.push({
                id: '529',
                mainType: 'activeSafetyZnjc',
                classify: 'alarmType_529',
                name: rootElement.lang.alarm_name_529
            });
        }

        if (isChuanBiao) {
            alarmArry.push({
                id: '545',
                mainType: 'activeSafetyZnjc',
                classify: 'alarmType_545',
                name: rootElement.lang.alarm_name_545
            });
            alarmArry.push({
                id: '549',
                mainType: 'activeSafetyZnjc',
                classify: 'alarmType_549',
                name: rootElement.lang.alarm_name_549
            });
            alarmArry.push({
                id: '1237',
                mainType: 'activeSafetyZnjc',
                classify: 'alarmType_1237',
                name: rootElement.lang.alarm_name_1237
            });
        }
    }
    // 驾驶员身份识别
    if (((type >> 7) & 1) == 1) {
        // 黑龙江
        if (isHeiLongJiang || isTianJin) {
            alarmArry.push({
                id: '510',
                mainType: 'activeSafetyDriverIdentification',
                classify: 'alarmType_510',
                name: rootElement.lang.alarm_name_510
            });
            alarmArry.push({
                id: '511',
                mainType: 'activeSafetyDriverIdentification',
                classify: 'alarmType_511',
                name: rootElement.lang.alarm_name_511
            });
            alarmArry.push({
                id: '699',
                mainType: 'activeSafetyDriverIdentification',
                classify: 'alarmType_699',
                name: rootElement.lang.alarm_name_699
            });
        }
        //陕标 	  	0x12：驾驶人身份识别事件
        //浙江 	  	0x09：驾驶员人脸身份识别事件
        //江西		0x12：驾驶人身份识别事件
        if (isZheBiao || isJiangXi || isShanBiao || isTianJin || isYingKou) {
            alarmArry.push({
                id: '643',
                mainType: 'activeSafetyDriverIdentification',
                classify: 'alarmType_643',
                name: rootElement.lang.alarm_name_643
            });
        }

        if ((!isGuangDong && !isBeiJing && !isYingKou) || isAll) {
            alarmArry.push({
                id: '697',
                mainType: 'activeSafetyDriverIdentification',
                classify: 'alarmType_697',
                name: rootElement.lang.alarm_name_697
            });
            alarmArry.push({
                id: '698',
                mainType: 'activeSafetyDriverIdentification',
                classify: 'alarmType_698',
                name: rootElement.lang.alarm_name_698
            });
        }
        if ((!isBeiJing && !isYingKou) || isAll) {
            alarmArry.push({
                id: '636',
                mainType: 'activeSafetyDriverIdentification',
                classify: 'alarmType_636',
                name: rootElement.lang.alarm_name_636
            });
            alarmArry.push({
                id: '686',
                mainType: 'activeSafetyDriverIdentification',
                classify: 'alarmType_686',
                name: rootElement.lang.alarm_name_686
            });
        }

        if (isHuNan || isJiBiao || isTianJin) {
            alarmArry.push({
                id: '646',
                mainType: 'activeSafetyDriverIdentification',
                classify: 'alarmType_646',
                name: rootElement.lang.alarm_name_646
            });
            alarmArry.push({
                id: '647',
                mainType: 'activeSafetyDriverIdentification',
                classify: 'alarmType_647',
                name: rootElement.lang.alarm_name_647
            });
            alarmArry.push({
                id: '648',
                mainType: 'activeSafetyDriverIdentification',
                classify: 'alarmType_648',
                name: rootElement.lang.alarm_name_648
            });
            alarmArry.push({
                id: '649',
                mainType: 'activeSafetyDriverIdentification',
                classify: 'alarmType_649',
                name: rootElement.lang.alarm_name_649
            });
        }
    }
    // 车辆运行监测
    if (((type >> 8) & 1) == 1) {
        // 黑龙江
        if (isHeiLongJiang || isHuNan) {
            alarmArry.push({
                id: '512',
                mainType: 'activeSafetyVehicleOperationMonitoring',
                classify: 'alarmType_512',
                name: rootElement.lang.alarm_name_512
            });
        }
        if (isHeiLongJiang) {
            alarmArry.push({
                id: '513',
                mainType: 'activeSafetyVehicleOperationMonitoring',
                classify: 'alarmType_513',
                name: rootElement.lang.alarm_name_513
            });
            alarmArry.push({
                id: '514',
                mainType: 'activeSafetyVehicleOperationMonitoring',
                classify: 'alarmType_514',
                name: rootElement.lang.alarm_name_514
            });
            alarmArry.push({
                id: '515',
                mainType: 'activeSafetyVehicleOperationMonitoring',
                classify: 'alarmType_515',
                name: rootElement.lang.alarm_name_515
            });
            alarmArry.push({
                id: '523',
                mainType: 'activeSafetyVehicleOperationMonitoring',
                classify: 'alarmType_523',
                name: rootElement.lang.alarm_name_523
            });
            alarmArry.push({
                id: '524',
                mainType: 'activeSafetyVehicleOperationMonitoring',
                classify: 'alarmType_524',
                name: rootElement.lang.alarm_name_524
            });
        }
    }
    // 设备失效监测
    if (((type >> 9) & 1) == 1) {
        // 黑龙江
        if (isHeiLongJiang || isTianJin) {
            alarmArry.push({
                id: '516',
                mainType: 'activeSafetyEquipmentFailureMonitoring',
                classify: 'alarmType_516',
                name: rootElement.lang.alarm_name_516
            });
            alarmArry.push({
                id: '517',
                mainType: 'activeSafetyEquipmentFailureMonitoring',
                classify: 'alarmType_517',
                name: rootElement.lang.alarm_name_517
            });
            alarmArry.push({
                id: '518',
                mainType: 'activeSafetyEquipmentFailureMonitoring',
                classify: 'alarmType_518',
                name: rootElement.lang.alarm_name_518
            });
            alarmArry.push({
                id: '519',
                mainType: 'activeSafetyEquipmentFailureMonitoring',
                classify: 'alarmType_519',
                name: rootElement.lang.alarm_name_519
            });
            alarmArry.push({
                id: '520',
                mainType: 'activeSafetyEquipmentFailureMonitoring',
                classify: 'alarmType_520',
                name: rootElement.lang.alarm_name_520
            });
            alarmArry.push({
                id: '521',
                mainType: 'activeSafetyEquipmentFailureMonitoring',
                classify: 'alarmType_521',
                name: rootElement.lang.alarm_name_521
            });
            alarmArry.push({
                id: '522',
                mainType: 'activeSafetyEquipmentFailureMonitoring',
                classify: 'alarmType_522',
                name: rootElement.lang.alarm_name_522
            });
        }
    }
    return alarmArry;
}


/**
 * 报警分析
 * @parm type  1 司机报警分析 不含胎压
 * @parm bitType  bit0:酒测数据相关主动安全报警
 * @returns {___anonymous130409_130452}
 */
function inintAlarmTable(type, bitType) {
    var armtable = new Hashtable();
    var alarmTypes = [];
    //报警与字段映射
    //ADAS报警
    armtable.put(600, {id: 'arm600_count', name: rootElement.lang.alarm_name_600 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(600);//默认类型
    armtable.put(601, {id: 'arm601_count', name: rootElement.lang.alarm_name_600 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(601);//默认类型
    armtable.put(602, {id: 'arm602_count', name: rootElement.lang.alarm_name_602 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(602);//默认类型
    armtable.put(603, {id: 'arm603_count', name: rootElement.lang.alarm_name_602 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(603);//默认类型
    armtable.put(604, {id: 'arm604_count', name: rootElement.lang.alarm_name_604 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(604);//默认类型
    armtable.put(605, {id: 'arm605_count', name: rootElement.lang.alarm_name_604 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(605);//默认类型
    armtable.put(606, {id: 'arm606_count', name: rootElement.lang.alarm_name_606 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(606);//默认类型
    armtable.put(607, {id: 'arm607_count', name: rootElement.lang.alarm_name_606 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(607);//默认类型
    armtable.put(608, {id: 'arm608_count', name: rootElement.lang.alarm_name_608 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(608);//默认类型
    armtable.put(609, {id: 'arm609_count', name: rootElement.lang.alarm_name_608 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(609);//默认类型
    armtable.put(610, {id: 'arm610_count', name: rootElement.lang.alarm_name_610 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(610);//默认类型
    armtable.put(611, {id: 'arm611_count', name: rootElement.lang.alarm_name_610 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(611);//默认类型
    armtable.put(612, {id: 'arm612_count', name: rootElement.lang.alarm_name_612 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(612);//默认类型
    armtable.put(613, {id: 'arm613_count', name: rootElement.lang.alarm_name_612 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(613);//默认类型
    armtable.put(700, {id: 'arm700_count', name: rootElement.lang.alarm_name_700 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(700);//默认类型
    armtable.put(701, {id: 'arm701_count', name: rootElement.lang.alarm_name_700 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(701);//默认类型
    //需要新增的报警字段
    //驾驶辅助功能失效报警1级总数
    armtable.put(715, {id: 'arm715_count', name: rootElement.lang.alarm_name_715 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(715);//默认类型
    //驾驶辅助功能失效报警2级总数
    armtable.put(716, {id: 'arm716_count', name: rootElement.lang.alarm_name_715 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(716);//默认类型
    //路口快速通过报警1级总数
    armtable.put(728, {id: 'arm728_count', name: rootElement.lang.alarm_name_728 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(728);//默认类型
    //路口快速通过报警2级总数
    armtable.put(729, {id: 'arm729_count', name: rootElement.lang.alarm_name_728 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(729);//默认类型
    // 730 //实线变道报警1级
    armtable.put(730, {id: 'arm730_count', name: rootElement.lang.alarm_name_730 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(730);//默认类型
    //实线变道报警2级
    armtable.put(731, {id: 'arm731_count', name: rootElement.lang.alarm_name_730 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(731);//默认类型
    // 730 //设备失效提醒报警1级总数
    armtable.put(732, {id: 'arm732_count', name: rootElement.lang.alarm_name_732 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(732);//默认类型
    //设备失效提醒报警1级总数
    armtable.put(733, {id: 'arm733_count', name: rootElement.lang.alarm_name_732 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(733);//默认类型

    //DSM报警
    armtable.put(618, {id: 'arm618_count', name: rootElement.lang.alarm_name_618 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(618);//默认类型
    armtable.put(619, {id: 'arm619_count', name: rootElement.lang.alarm_name_618 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(619);//默认类型
    armtable.put(620, {id: 'arm620_count', name: rootElement.lang.alarm_name_620 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(620);//默认类型
    armtable.put(621, {id: 'arm621_count', name: rootElement.lang.alarm_name_620 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(621);//默认类型
    armtable.put(622, {id: 'arm622_count', name: rootElement.lang.alarm_name_622 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(622);//默认类型
    armtable.put(623, {id: 'arm623_count', name: rootElement.lang.alarm_name_622 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(623);//默认类型
    armtable.put(624, {id: 'arm624_count', name: rootElement.lang.alarm_name_624 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(624);//默认类型
    armtable.put(625, {id: 'arm625_count', name: rootElement.lang.alarm_name_624 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(625);//默认类型
    armtable.put(626, {id: 'arm626_count', name: rootElement.lang.alarm_name_626 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(626);//默认类型
    armtable.put(627, {id: 'arm627_count', name: rootElement.lang.alarm_name_626 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(627);//默认类型
    // 730 //墨镜失效报警1级总数
    armtable.put(639, {id: 'arm639_count', name: rootElement.lang.alarm_name_639 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(639);//默认类型
    //墨镜失效报警2级总数
    armtable.put(640, {id: 'arm640_count', name: rootElement.lang.alarm_name_639 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(640);//默认类型
    armtable.put(745, {id: 'arm745_count', name: rootElement.lang.alarm_name_745 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(745);//默认类型
    armtable.put(746, {id: 'arm746_count', name: rootElement.lang.alarm_name_745 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(746);//默认类型
    armtable.put(641, {id: 'arm641_count', name: rootElement.lang.alarm_name_641 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(641);//默认类型
    armtable.put(642, {id: 'arm642_count', name: rootElement.lang.alarm_name_641 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(642);//默认类型
    armtable.put(644, {id: 'arm644_count', name: rootElement.lang.alarm_name_644 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(644);//默认类型
    armtable.put(645, {id: 'arm645_count', name: rootElement.lang.alarm_name_644 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(645);//默认类型
    armtable.put(702, {id: 'arm702_count', name: rootElement.lang.alarm_name_702 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(702);//默认类型
    armtable.put(703, {id: 'arm703_count', name: rootElement.lang.alarm_name_702 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(703);//默认类型
    armtable.put(704, {id: 'arm704_count', name: rootElement.lang.alarm_name_704 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(704);//默认类型
    armtable.put(705, {id: 'arm705_count', name: rootElement.lang.alarm_name_704 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(705);//默认类型
    armtable.put(706, {id: 'arm706_count', name: rootElement.lang.alarm_name_706 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(706);//默认类型
    armtable.put(707, {id: 'arm707_count', name: rootElement.lang.alarm_name_706 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(707);//默认类型
    armtable.put(708, {id: 'arm708_count', name: rootElement.lang.alarm_name_708 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(708);//默认类型
    armtable.put(709, {id: 'arm709_count', name: rootElement.lang.alarm_name_708 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(709);//默认类型
    armtable.put(710, {id: 'arm710_count', name: rootElement.lang.alarm_name_710 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(710);//默认类型
    armtable.put(711, {id: 'arm711_count', name: rootElement.lang.alarm_name_710 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(711);//默认类型
    // 730 //驾驶员行为监测功能失效报警1级总数
    armtable.put(717, {id: 'arm717_count', name: rootElement.lang.alarm_name_717 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(717);//默认类型
    //驾驶员行为监测功能失效报警2级总数
    armtable.put(718, {id: 'arm718_count', name: rootElement.lang.alarm_name_717 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(718);//默认类型
    armtable.put(719, {id: 'arm719_count', name: rootElement.lang.alarm_name_719});
    alarmTypes.push(719);//默认类型
    // 730 //探头遮挡报警1级总数
    armtable.put(734, {id: 'arm734_count', name: rootElement.lang.alarm_name_734 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(734);//默认类型
    //探头遮挡报警1级总数
    armtable.put(735, {id: 'arm735_count', name: rootElement.lang.alarm_name_734 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(735);//默认类型
    // 730 //换人驾驶报警1级总数
    armtable.put(736, {id: 'arm736_count', name: rootElement.lang.alarm_name_736 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(736);//默认类型
    //换人驾驶报警2级总数
    armtable.put(737, {id: 'arm737_count', name: rootElement.lang.alarm_name_736 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(737);//默认类型
    // 730 //超时驾驶报警1级总数
    armtable.put(738, {id: 'arm738_count', name: rootElement.lang.alarm_name_738 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(738);//默认类型
    //超时驾驶报警1级总数
    armtable.put(739, {id: 'arm739_count', name: rootElement.lang.alarm_name_738 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(739);//默认类型

    //TMPS胎压
    //胎压统计  司机没有
    if (type && type == 1) {
    } else {
        armtable.put(632, {id: 'arm632_count', name: rootElement.lang.alarm_name_632});
        alarmTypes.push(632);//默认类型
    }

    //BSD接近报警
    armtable.put(633, {id: 'arm633_count', name: rootElement.lang.alarm_name_633});
    alarmTypes.push(633);//默认类型
    armtable.put(634, {id: 'arm634_count', name: rootElement.lang.alarm_name_634});
    alarmTypes.push(634);//默认类型
    armtable.put(635, {id: 'arm635_count', name: rootElement.lang.alarm_name_635});
    alarmTypes.push(635);//默认类型

    //激烈驾驶报警
    //急加速报警总数
    armtable.put(720, {id: 'arm720_count', name: rootElement.lang.alarm_name_720});
    alarmTypes.push(720);//默认类型
    //急减速报警总数
    armtable.put(721, {id: 'arm721_count', name: rootElement.lang.alarm_name_721});
    alarmTypes.push(721);//默认类型
    //急转弯报警总数
    armtable.put(722, {id: 'arm722_count', name: rootElement.lang.alarm_name_722});
    alarmTypes.push(722);//默认类型
    //怠速报警总数
    armtable.put(723, {id: 'arm723_count', name: rootElement.lang.alarm_name_723});
    alarmTypes.push(723);//默认类型
    //异常熄火报警
    armtable.put(724, {id: 'arm724_count', name: rootElement.lang.alarm_name_724});
    alarmTypes.push(724);//默认类型
    //空挡滑行报警
    armtable.put(725, {id: 'arm725_count', name: rootElement.lang.alarm_name_725});
    alarmTypes.push(725);//默认类型
    //发动机超转报警
    armtable.put(726, {id: 'arm726_count', name: rootElement.lang.alarm_name_726});
    alarmTypes.push(726);//默认类型
    //卫星定位
    //超速报警总数
    armtable.put(727, {id: 'arm727_count', name: rootElement.lang.alarm_name_727});
    alarmTypes.push(727);//默认类型
    //超过道路限速报警总数
    armtable.put(744, {id: 'arm744_count', name: rootElement.lang.alarm_name_744});
    alarmTypes.push(744);//默认类型
    //智能检测
    // 730 //车厢超载报警1级总数
    armtable.put(740, {id: 'arm740_count', name: rootElement.lang.alarm_name_740 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(740);//默认类型
    //车厢超载报警1级总数
    armtable.put(741, {id: 'arm741_count', name: rootElement.lang.alarm_name_740 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(741);//默认类型
    // 730 //站外上客报警1级总数
    armtable.put(742, {id: 'arm742_count', name: rootElement.lang.alarm_name_742 + rootElement.lang.alarm_name_11111});
    alarmTypes.push(742);//默认类型
    //站外上客报警1级总数
    armtable.put(743, {id: 'arm743_count', name: rootElement.lang.alarm_name_742 + rootElement.lang.alarm_name_22222});
    alarmTypes.push(743);//默认类型
    armtable.put(545, {id: 'arm545_count', name: rootElement.lang.alarm_name_545});
    alarmTypes.push(545);//默认类型
    armtable.put(549, {id: 'arm549_count', name: rootElement.lang.alarm_name_549});
    alarmTypes.push(549);//默认类型
    armtable.put(1237, {id: 'arm1237_count', name: rootElement.lang.alarm_name_1237});
    alarmTypes.push(1237);//默认类型

    if (bitType) {
        // 酒测相关报警
        if ((bitType & 1) == 1) {
            armtable.put(1226, {
                id: 'arm1226_count',
                name: rootElement.lang.alarm_name_1226 + rootElement.lang.alarm_name_11111
            });
            alarmTypes.push(1226);//酒测正常
            armtable.put(1227, {
                id: 'arm1227_count',
                name: rootElement.lang.alarm_name_1226 + rootElement.lang.alarm_name_22222
            });
            alarmTypes.push(1227);//酒测正常
            armtable.put(1228, {
                id: 'arm1228_count',
                name: rootElement.lang.alarm_name_1228 + rootElement.lang.alarm_name_11111
            });
            alarmTypes.push(1228);//未完成酒测
            armtable.put(1229, {
                id: 'arm1229_count',
                name: rootElement.lang.alarm_name_1228 + rootElement.lang.alarm_name_22222
            });
            alarmTypes.push(1229);//未完成酒测
            armtable.put(1230, {
                id: 'arm1230_count',
                name: rootElement.lang.alarm_name_1230 + rootElement.lang.alarm_name_11111
            });
            alarmTypes.push(1230);//酒后驾驶
            armtable.put(1231, {
                id: 'arm1231_count',
                name: rootElement.lang.alarm_name_1230 + rootElement.lang.alarm_name_22222
            });
            alarmTypes.push(1231);//酒后驾驶
            armtable.put(1232, {
                id: 'arm1232_count',
                name: rootElement.lang.alarm_name_1232 + rootElement.lang.alarm_name_11111
            });
            alarmTypes.push(1232);//醉驾驾驶
            armtable.put(1233, {
                id: 'arm1233_count',
                name: rootElement.lang.alarm_name_1232 + rootElement.lang.alarm_name_22222
            });
            alarmTypes.push(1233);//醉驾驾驶
        }
    }
    return {armtable: armtable, alarmTypes: alarmTypes};

}


/**
 * 主动安全一二级名称
 * @param type
 * @returns {string|*}
 */
function getSafeAlarmName(type) {
    var typeslevel1 = [600, 602, 604, 606, 608, 610, 612, 700, 715, 728, 730, 732, 618, 620, 622, 624, 626, 639, 641, 644, 745, 702, 704, 706, 708,
        710, 717, 734, 736, 738, 740, 742, 1226, 1228, 1230, 1232, 1408, 1410, 1404, 530, 532, 534, 536, 614, 616, 628, 630, 542, 525, 840, 845, 1211,
        1214, 1217, 1220, 1223, 1334, 1337, 1340, 1343, 900, 903, 906, 909, 912, 915, 918, 921, 924, 927, 930, 933, 936, 939, 942, 945, 967, 971, 1400, 1402, 1404, 1238, 1234];
    var typeslevel12 = [601, 603, 605, 607, 609, 611, 613, 701, 716, 729, 731, 733, 619, 621, 623, 625, 627, 640, 642, 645, 746, 703, 705, 707, 709,
        711, 718, 735, 737, 739, 741, 743, 1227, 1229, 1231, 1233, 1409, 1411, 1405, 531, 533, 535, 537, 615, 617, 629, 631, 543, 541, 841, 846, 1212, 1215,
        1218, 1221, 1224, 1335, 1338, 1341, 1344, 901, 904, 907, 910, 913, 916, 919, 922, 925, 928, 931, 934, 937, 940, 943, 946, 972, 1401, 1403, 1405, 1239, 1235];
    var typeslevel13 = [1213, 1216, 1219, 1222, 1225, 1336, 1339, 1342, 1345, 902, 905, 908, 911, 914, 917, 920, 923, 926, 929, 932, 935, 938, 941, 944, 947, 968, 973];
    var typeslevel13Ex = {
        1200: 618, 1201: 624, 1203: 620, 1204: 710, 1205: 706, 1206: 626, 1207: 600, 1208: 604,
        1209: 602, 1210: 606, 968: 967,
    };
    var typeslevel14 = {
        948: 900, 950: 903, 952: 906, 954: 912, 956: 915, 958: 918, 961: 924, 963: 933, 965: 939, 969: 967, 974: 971,
    };
    var typeslevel15 = {
        949: 900, 951: 903, 953: 906, 955: 912, 957: 915, 959: 918, 960: 921, 962: 924, 964: 933, 966: 939, 970: 967, 975: 971,
    };

    var name = rootElement.lang['alarm_name_' + type];
    if (typeslevel1.contains(type)) {
        name += rootElement.lang.alarm_name_11111;
    }
    if (typeslevel12.contains(type)) {
        name = rootElement.lang['alarm_name_' + (type - 1)] + rootElement.lang.alarm_name_22222;
    }
    if (typeslevel13.contains(type)) {
        name = rootElement.lang['alarm_name_' + (type - 2)] + rootElement.lang.alarm_name_33333;
    }
    if (typeslevel13Ex[type]) {
        name = rootElement.lang['alarm_name_' + typeslevel13Ex[type]] + rootElement.lang.alarm_name_33333;
    }
    if (typeslevel14[type]) {
        name = rootElement.lang['alarm_name_' + typeslevel14[type]] + rootElement.lang.alarm_name_44444;
    }
    if (typeslevel15[type]) {
        name = rootElement.lang['alarm_name_' + typeslevel15[type]] + rootElement.lang.alarm_name_55555;
    }
    return name;
}

/**
 * 获取主动安全一级报警
 * @param type
 * @returns {string|*}
 */
function getSafeAlarmLevel1(type) {
    var typeslevel1 = [600, 602, 604, 606, 608, 610, 612, 700, 715, 728, 730, 732, 618, 620, 622, 624, 626, 639, 641, 644, 745, 702, 704, 706, 708,
        710, 717, 734, 736, 738, 740, 742, 1226, 1228, 1230, 1232, 1408, 1410, 1404, 530, 532, 534, 536, 614, 616, 628, 630, 542, 525, 840, 845, 1211,
        1214, 1217, 1220, 1223, 1334, 1337, 1340, 1343, 900, 903, 906, 909, 912, 915, 918, 921, 924, 927, 930, 933, 936, 939, 942, 945, 967, 971, 1400, 1402, 1404, 1238, 1234];
    var typeslevel12 = [601, 603, 605, 607, 609, 611, 613, 701, 716, 729, 731, 733, 619, 621, 623, 625, 627, 640, 642, 645, 746, 703, 705, 707, 709,
        711, 718, 735, 737, 739, 741, 743, 1227, 1229, 1231, 1233, 1409, 1411, 1405, 531, 533, 535, 537, 615, 617, 629, 631, 543, 541, 841, 846, 1212, 1215,
        1218, 1221, 1224, 1335, 1338, 1341, 1344, 901, 904, 907, 910, 913, 916, 919, 922, 925, 928, 931, 934, 937, 940, 943, 946, 972, 1401, 1403, 1405, 1239, 1235];
    if (typeslevel1.contains(type)) {
        return type;
    }
    if (typeslevel12.contains(type)) {
        return type - 1;
    }
    return -1;
}


//随机生成16进制颜色码
function randomColor() {
    return "#" + Math.floor(Math.random() * 16).toString(16) + Math.floor(Math.random() * 16).toString(16) + Math.floor(Math.random() * 16).toString(16)
        + Math.floor(Math.random() * 16).toString(16) + Math.floor(Math.random() * 16).toString(16) + Math.floor(Math.random() * 16).toString(16);
}

function randomColorByType(type) {
    if (type) {
        var color = (type * type * type / 100000000).toString(16).substr(2, 6).toUpperCase();
        if (color.startsWith('0000')) {
            return randomColor();
        }
        return '#' + color;
    }
    return randomColor();
}

//停运上报获取停运原因
function getReason(reasonType) {
    var reasonArry = [1, 2, 3, 4, 5];
    var reason = '';
    if (reasonArry.in_array(reasonType)) {
        switch (reasonType) {
            case 1:
                reason = rootElement.lang.run_stop_reason_weather;
                break;
            case 2:
                reason = rootElement.lang.run_stop_reason_breakdown;
                break;
            case 3:
                reason = rootElement.lang.run_stop_reason_road_resistance;
                break;
            case 4:
                reason = rootElement.lang.run_stop_reason_repair;
                break;
            case 5:
                reason = rootElement.lang.run_stop_reason_other;
                break;
            default:
                break;
        }
    } else {
        reason = rootElement.lang.other;
    }
    return reason;
}

/**
 * 加减时间天数
 * @param date
 * @param num
 * @returns {string}
 */
function addDateDay(str, num) {
    var date = strToDate(str);
    date.setDate(date.getDate() + num);
    var time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    return timestampToTime(time, "yyyy-MM-dd");
}

/**
 * 字符串转date
 * @param str
 * @returns {Date}
 */
function strToDate(str) {
    // 转换日期格式
    str = str.replace(/-/g, '/');
    // 创建日期对象
    return new Date(str);
}

/**
 * 格式化时间戳
 * @param timestamp
 * @returns {string}
 */
function timestampToTime(timestamp, fmt) {
    if (timestamp) {
        if (typeof timestamp == 'string') {
            timestamp = timestamp.replace(/-/g, '/');
        }
        fmt = fmt ? fmt : "yyyy-MM-dd hh:mm:ss";
        var date = new Date(timestamp);
        var o = {
            "M+": date.getMonth() + 1,               //月份
            "d+": date.getDate(),                    //日
            "h+": date.getHours(),                   //小时
            "m+": date.getMinutes(),                 //分
            "s+": date.getSeconds(),                 //秒
            "q+": Math.floor((date.getMonth() + 3) / 3),//季度
            "S": date.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }
}


/**
 * 加减时间天数
 * @param date
 * @param num
 * @returns {string}
 */
function offsetDateDay(date, num) {
    date.setDate(date.getDate() + num);
    var time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    return timestampToTime(time);
}

/**
 * 是不是n天之前
 * @param date
 * @param num
 * @returns {string}
 */
function pastOffsetDay(date, num) {
    var now = new Date()
    now.setDate(now.getDate() - num);
    return now >= date;
}

function htmlEscape(text) {
    return text.replace(/[<>&"]/g, function (c) {
        return {'<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;'}[c];
    });
}


function strToHtml(text) {
    var arrEntities = {'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"'};
    return text.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
        return arrEntities[t];
    });
}

$.fn.isOnScreen = function () {

    var win = $(window);

    var viewport = {
        top: win.scrollTop(),
    };
    viewport.bottom = viewport.top + win.height();

    var bounds = this.offset();
    bounds.bottom = bounds.top + this.outerHeight();

    return (!(viewport.bottom < bounds.top || viewport.top > bounds.bottom));

};

/**
 * 主动安全扩展协议
 * @param type
 * @returns {number}
 */
function getExtendedProtocol(type) {
    switch (type) {
        case 6:
            return 3;
        case 7:
            return 4;
        case 8:
            return 5;
        case 9:
            return 6;
        case 10:
            return 7;
        case 11:
            return 8;
        case 12:
            return 9;
        case 13:
            return 10;
        case 14:
            return 11;
        case 16:
            return 12;
        case 17:
            return 13;
        case 18:
            return 14;
        case 19:
        case 20:
        case 29:
            return 0;
        case 21:
            return 15;
        case 22:
            return 16;
        case 24:
            return 17;
        case 25:
            return 18;
        case 26:
            return 19;
        case 27:
            return 20;
        case 28:
            return 21;
        case 30:
            return 22;
    }

}

function checkFull() {
    return document.fullscreenElement ||
        document.msFullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement || false;
}

function getDataset(ele) {
    if (ele.dataset) {
        return ele.dataset;
    } else {
        var attrs = ele.attributes,//元素的属性集合
            dataset = {}, name, matchStr;
        for (var i = 0; i < attrs.length; i++) { //是否是data- 开头
            matchStr = attrs[i].name.match(/^data-(.+)/);
            if (matchStr) { //data-auto-play 转成驼峰写法 autoPlay
                name = matchStr[1].replace(/-([\da-z])/gi, function (all, letter) {
                    return letter.toUpperCase();
                });
                dataset[name] = attrs[i].value;
            }
        }
        return dataset;
    }
}

function getCompany(companys, id) {
    for (var i = 0; i < companys.length; i++) {
        if (companys[i].id == id) {
            return companys[i];
        }
    }
}


/**
 * 自定义分页
 * @param rows
 * @param table
 */
function getPaginationList(rows, table) {
    var param = $(table).flexGetParams();
    var start = (param.newp - 1) * param.rp;
    if (start >= rows.length) {
        param.newp = 1;
        start = 0;
    }
    var end = param.newp * param.rp;
    var infos = [];
    for (var i = start; i < rows.length && i < end; i++) {
        infos.push(rows[i]);
    }
    var pagination = {currentPage: param.newp, pageRecords: param.rp, totalRecords: rows.length};
    var json = {};
    json.infos = infos;
    json.pagination = pagination;
    return json;
}


// 排序方法(默认降序) 主要用于数字排序
function compareProperty(prop, asc) {
    return function (a, b) {
        // 升序
        if (asc) {
            return (a[prop] || 0) - (b[prop] || 0);
        }
        // 降序
        return (b[prop] || 0) - (a[prop] || 0);
    }
}

/**
 * 获取地图类型对应的名称
 * @param {Number} mapType
 * @returns {String}
 */
function getMapName(mapType) {
    var name = "";
    if (mapType) {
        switch (Number(mapType)) {
            case 3:
                name = _getRootFrameAttributes('lang').lang.mapBaidu;
                break;
            case 1:
                name = _getRootFrameAttributes('lang').lang.mapGoogle;
                break;
            case 9:
                name = _getRootFrameAttributes('lang').lang.mapBing;
                break;
            case 4:
                name = _getRootFrameAttributes('lang').lang.mapAutonavi;
                break;
            case 7:
                name = _getRootFrameAttributes('lang').lang.offlineMapBaidu;
                break;
            case 8:
                name = _getRootFrameAttributes('lang').lang.offlineMapGoogle;
                break;
            case 10:
                name = _getRootFrameAttributes('lang').lang.mapOSMTiles;
                break;
            case 11:
                name = _getRootFrameAttributes('lang').lang.mapGoogleTiles;
                break;
            case 12:
                name = _getRootFrameAttributes('lang').lang.mapMapBar;
                break;
            case 18:
                name = _getRootFrameAttributes('lang').lang.tianDiTu;
                break;
            case 65535:// 轨迹回放绘制，终端
                name = _getRootFrameAttributes('lang').lang.policeOrVehicel;
                break;
            default:
                break;
        }
    }
    return name;
}

function disabledInput(id) {
    $(id).prop('disabled', 'disabled');
}

function disabledSpan(id) {
    $(id + ' span').prop('onclick', null);
}

function getMapSelect(mapShield, mapType, isSeparate) {
    var mapSelect = [];
    // web参考 initMapShieldModel代码，确实两个地图类型
    // 这个是配置按位顺序 对应的地图类型 （根据配置显示可以切换地图类型）
    var types = [3, 1, 9, 4, 7, 8, 12, 0, 10, 11, 18];
    // 地图类型对应的名称
    var names = [_getRootFrameAttributes('lang').lang.mapBaidu,
        _getRootFrameAttributes('lang').lang.mapGoogle,
        _getRootFrameAttributes('lang').lang.mapBing,
        _getRootFrameAttributes('lang').lang.mapAutonavi,
        _getRootFrameAttributes('lang').lang.offlineMapBaidu,
        _getRootFrameAttributes('lang').lang.offlineMapGoogle,
        _getRootFrameAttributes('lang').lang.mapMapBar,
        '',
        _getRootFrameAttributes('lang').lang.mapOSMTiles,
        _getRootFrameAttributes('lang').lang.mapGoogleTiles,
        _getRootFrameAttributes('lang').lang.tianDiTu];
    // web下拉列表，用于排序
    // 百度-> 谷歌瓦片->谷歌授权->mapinfo->bing->高德->四维->百度离线->谷歌离线->osm
    var sort = [1, 0, 4, 2, 8, 9, 5, 0, 7, 3, 6];
    // 地图类型对应的配置位（下拉列表不包含当前地图类型）
    var typeMap = [];
    typeMap[3] = 0;
    typeMap[1] = 1;
    typeMap[9] = 2;
    typeMap[4] = 3;
    typeMap[7] = 4;
    typeMap[8] = 5;
    typeMap[12] = 6;
    typeMap[10] = 8;
    typeMap[11] = 9;
    typeMap[18] = 10;
    var index = typeMap[Number(mapType)];

    var count = 0
    var first = true;
    for (var i = 0, len = types.length; i < len; i++) {
        if (((Number(mapShield) >> i) & 1) == 0) {
            if (((Number(mapShield) >> index) & 1) > 0 && first) {
                count = 0;
                first = false;
            } else {
                count = 1;
            }
            if (count != 0 && types[i] != 0) {
                // if (mapType != types[i] && count != 0 && types[i] != 0) {
                mapSelect.push({type: types[i], name: names[i], index: sort[i]});
            }
            count++;
        }
    }

    if (((Number(mapShield) >> index) & 1) > 0) { //如果上一次登录的地图被屏蔽
        for (var i = 0, len = types.length; i < len; i++) {
            if (((Number(mapShield) >> i) & 1) == 0 && types[i] != 0 && types[i] != 1) {
                // if (((Number(mapShield) >> i) & 1) == 0 && types[i] != 0 && types[i] != 1 && types[i] != 9) {
                mapType = types[i];
                rootElement.saveMapTypeLoaction(mapType);
                break;
            }
        }
    }
    mapSelect.sort(compareProperty('index', true));

    // 越南服务器只显示谷歌
    if (rootElement.enableVietnam) {
        mapSelect = [{type: 11, name: _getRootFrameAttributes('lang').lang.mapGoogleTiles, index: 2}];
    }
    // 规则界面，切换不影响全局
    if (isSeparate) {
        return mapSelect;
    }
    return mapSelect;
    // 以下代码会导致轨迹回放切换更改实时定位地图解析类型，地图没有重新渲染
    /* if (typeof rootElement.saveMapType === 'function') {
        rootElement.saveMapType(mapType);
    }
    if (typeof rootElement.saveMapTypeLoaction === 'function') {
        rootElement.saveMapTypeLoaction(mapType);
    } */
}


/**
 * 登录后，判断初始地图是否被屏蔽了
 * @param mapShield
 * @param mapType
 */
function judgeShieldMap(mapShield, mapType) {
    // web参考 initMapShieldModel代码，确实两个地图类型
    // 这个是配置按位顺序 对应的地图类型 （根据配置显示可以切换地图类型）
    var types = [3, 1, 9, 4, 7, 8, 0, 0, 10, 11, 18];
    // 地图类型对应的配置位（下拉列表不包含当前地图类型）
    var typeMap = [];
    typeMap[3] = 0;
    typeMap[1] = 1;
    typeMap[9] = 2;
    typeMap[4] = 3;
    typeMap[7] = 4;
    typeMap[8] = 5;
    typeMap[10] = 8;
    typeMap[11] = 9;
    typeMap[18] = 10;
    var index = typeMap[Number(mapType)];
    // 如果上一次登录的地图被屏蔽
    var isShield = false;
    if (((Number(mapShield) >> index) & 1) > 0) {
        isShield = true;
        for (var i = 0, len = types.length; i < len; i++) {
            if (((Number(mapShield) >> i) & 1) == 0 && types[i] != 0 && types[i] != 1 && types[i] != 9) {
                mapType = types[i];
                break;
            }
        }
    }
    if (isShield) {
        if (typeof rootElement.saveMapType === 'function') {
            rootElement.saveMapType(mapType);
        }
        if (typeof rootElement.saveMapTypeLoaction === 'function') {
            rootElement.saveMapTypeLoaction(mapType);
        }
    }
}


function parseTime(time) {
    time = "" + time;
    var ss = subTime(time, time.length - 2, time.length);
    var mm = subTime(time, time.length - 4, time.length - 2);
    var hh = subTime(time, time.length - 6, time.length - 4);
    return hh + ":" + mm + ":" + ss;
}

function subTime(time, bg, ed) {
    time = "" + time;
    var result = time.substring(bg, ed);
    if (result) {
        if (result.length < 2) {
            for (var i = result.length; i < 2; i++) {
                result = "0" + result;
            }
        }
    } else {
        result = "00";
    }
    return result;
}

function parseTimeToLong(time) {
    time = "" + time;
    var str = time.split(':');
    var result = "";
    for (var i = 0; i < str.length; i++) {
        result += str[i];
    }
    if (!result) {
        result = "0";
    }
    return parseInt(result);
}


function showThLineList(listObj) {
    setTimeout(function () {
        if (typeof listObj == 'object' && listObj.length > 0) {
            for (var i = 0; i < listObj.length; i++) {
                $('.th-' + listObj[i]).show();
                $('.td-' + listObj[i]).show();
            }
        }
    }, 256);
}


/**
 * 是否数字
 * @param val
 * @returns
 */
function isNumber(val) {
    // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除，
    if (val === "" || val == null) {
        return false;
    }
    if (!isNaN(val)) {
        //对于空数组和只有一个数值成员的数组或全是数字组成的字符串，isNaN返回false，例如：'123'、[]、[2]、['123'],isNaN返回false,
        //所以如果不需要val包含这些特殊情况，则这个判断改写为if(!isNaN(val) && typeof val === 'number' )
        return true;
    } else {
        return false;
    }
}


/**
 * 限制输入数字
 * @param ele
 */
function cleanLimitNumber(ele) {
    $(ele).prop('type', 'number');
    $(ele).blur(function () {
        var val = Math.abs($(this).val());
        $(this).val(val.toFixed(0));
    })
}


//获取平台事件
function getPlatformEvent(type) {
    var status = '';
    switch (parseInt(type)) {
        case 2001:
            status = rootElement.lang.platformLogin;
            break;
        case 2002:
            status = rootElement.lang.platformOffLine;
            break;
    }
    return status;
}

/**
 * 平台链接日志
 * @param type
 * @returns {string}
 */
function platformConnLog(type) {
    var status = '';
    switch (parseInt(type)) {
        case 0:
            status = rootElement.lang.success;
            break;
        case 1:
            status = rootElement.lang.ipAddressError;
            break;
        case 2:
            status = rootElement.lang.accessCodeError;
            break;
        case 3:
            status = rootElement.lang.userRegisteredError;
            break;
        case 4:
            status = rootElement.lang.passwordError;
            break;
        case 5:
            status = rootElement.lang.resourceCrisis;
            break;
        case 6:
            status = rootElement.lang.other;
            break;
    }
    return status;
}

//取窗口滚动条高度
function getScrollTop() {
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
        scrollTop = document.body.scrollTop;
    }
    return scrollTop;
}

/**
 * 解压缩
 * @param str
 */
function uncompress(str) {
    if (!str) {
        return '';
    }
    // base64 字符串解码
    var decode = atob(str)
    // 将二进制字符串转换为字符数组
    var charData = decode.split('').map(function (x) {
        return x.charCodeAt(0);
    });
    // 转Uint8Array数组
    var binData = new Uint8Array(charData);
    // gzip解压
    var data = pako.inflate(binData);
    // uint8Array转String
    var jsonSTr = Utf8ArrayToStr(data);
    // 字符串转json对象
    return JSON.parse(jsonSTr);
}

/**
 * uint8Array转String
 */
function Utf8ArrayToStr(array) {
    var out, i, len, c;
    var char2, char3;
    out = "";
    len = array.length;
    i = 0;
    while (i < len) {
        c = array[i++];
        switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                // 0xxxxxxx
                out += String.fromCharCode(c);
                break;
            case 12:
            case 13:
                // 110x xxxx   10xx xxxx
                char2 = array[i++];
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode(((c & 0x0F) << 12) |
                    ((char2 & 0x3F) << 6) |
                    ((char3 & 0x3F) << 0));
                break;
        }
    }

    return out;
}

/**
 * 处理URL
 * 如果是http直接访问c++ 端口，否则需要nginx转发
 * url 链接
 * useSendcondRule 是否使用第二种规则
 */
function handleVideoUrl(url, useSendcondRule) {
    if (url.startWith('ws:') || url.startWith('wss:')) {
        return url;
    }
    if (location.protocol === 'http:') {
        return url;
    }
    if (!useSendcondRule && url && url.startWith('https:')) {
        return url;
    }
    var urlNew = new URL(url);
    var videoPort = urlNew.port;
    if (rootElement.httpsMapHttpPortParams && !useSendcondRule) {
        var httpsPort = rootElement.httpsMapHttpPortParamsMap[videoPort];
        httpsPort = httpsPort ? httpsPort : ('1' + videoPort);
        url = url.replace("http://", "https://").replace(":" + videoPort, ":" + httpsPort);
        return url;
    }
    if (useSendcondRule && videoPort.length === 5 && videoPort.startWith('1')) {
        videoPort = videoPort.substring(1, videoPort.length);
    }
    var httpsPort = '1' + videoPort;
    url = url.replace("http://", "https://").replace(":" + videoPort, ":" + httpsPort);
    return url;
}

if (typeof window.URL !== 'function') {
    window.URL = function (url) {
        var protocol = url.split('//')[0],
            comps = url.split('#')[0].replace(/^(https\:\/\/|http\:\/\/)|(\/)$/g, '').split('/'),
            host = comps[0],
            search = comps[comps.length - 1].split('?')[1],
            tmp = host.split(':'),
            port = tmp[1],
            hostname = tmp[0];
        search = typeof search !== 'undefined' ? '?' + search : '';
        return {
            hash: url.indexOf('#') > -1 ? url.substring(url.indexOf('#')) : '',
            protocol: protocol,
            host: host,
            hostname: hostname,
            href: url,
            pathname: '/' + comps.splice(1).map(function (o) {
                return /\?/.test(o) ? o.split('?')[0] : o;
            }).join('/'),
            search: search,
            origin: protocol + '//' + host,
            port: typeof port !== 'undefined' ? port : ''
        };
    }
}


/**
 * 报警选项
 */
function getViolations() {
    var violations = [];
    violations.push({id: '', name: rootElement.lang.noModifyAlarmType});
    violations.push({id: '0', name: rootElement.lang.nothing});
    violations.push({id: '174', name: rootElement.lang.alarm_name_174});
    violations.push({id: '404', name: rootElement.lang.alarm_name_404});
    violations.push({id: '176', name: rootElement.lang.alarm_name_176});
    violations.push({id: '11', name: rootElement.lang.alarm_name_11});
    violations.push({id: '9999', name: rootElement.lang.alarm_name_9999});
    return violations;
}


/**
 * 备注选项
 * 从LocalStorage缓存中获取
 */
function getRemark(remarks_) {
    var Remark = [];
    var remarks = getLocalStorage(remarks_);
    if (remarks != null) {
        for (var i = 0; i < remarks.split(",").length; i++) {
            Remark.push({id: i, name: remarks.split(",")[i]});
        }
    }
    return Remark;
}


/**
 * 获取地图面的中心点
 * @param str
 * @returns {string}
 */
function getCenterPointByPos(lngStr, latStr) {
    if (!lngStr || !latStr) {
        return "";
    }
    var ary = lngStr.split(',');
    var bry = latStr.split(',');
    var path = [];
    for (var i = 0; i < ary.length; i++) {
        path.push({lng: ary[i], lat: bry[i]});
    }
    return getCenterPoint(path);
}


function getCenterPoint(path) {

//var path =e.;

//Array<Point> 返回多边型的点数组

//var ret=parseFloat(num1)+parseFloat(num2);

    var x = 0.0;

    var y = 0.0;

    for (var i = 0; i < path.length; i++) {

        x = x + parseFloat(path[i].lng);

        y = y + parseFloat(path[i].lat);

    }

    x = x / path.length;

    y = y / path.length;

//return new BMap.Point(path[0].lng,path[0].lat);

    return x + ',' + y;

//return path[0];

}

/**
 * 查岗回复内容
 */
function computeInspectReply(text) {
    if (!text) {
        return 0;
    }
    text = text.replace('=', '').replace('?', '');
    try {
        var rlt = eval(text);
        //结果非数字
        if (isNaN(rlt)) {
            return '';
        }
        return rlt;
    } catch (e) {
        return '';
    }
}

/**
 * 查岗回复是否正确
 * @return IsRight  0-未知 1-正确， 2-错误
 */
function inspectReplyIsRight(text, replyContent) {
    if (!text) {
        return 0;
    }
    text = text.replace('=', '').replace('?', '');
    try {
        var rlt = eval(text);
        //结果非数字
        if (isNaN(rlt)) {
            return 0;
        }
        //结果正确
        if (rlt == replyContent) {
            return 1;
        } else {
            //结果错误
            return 2;
        }
    } catch (e) {
        //表达式不能正常执行时候·当做文字类查岗处理，文字类查岗当做正确
        return 0;
    }
}


/**
 * 两数相除
 * @param value1
 * @param value2
 */
function divide(value1, value2) {

    if (value1 == null || (value2 == null || value2 == 0) || isNaN(value1) || value1 == undefined || isNaN(value2) || value2 == undefined || value1 == '' || value2 == '') {
        return 0;
    }
    return value1 / value2 * 100;

}

/**
 * 两数相减
 * @param value1
 * @param value2
 * @returns {number}
 */
function subtract(value1, value2) {

    if (value1 == null || isNaN(value1) || value1 == undefined || value1 == '') {
        value1 = 0;
    }

    if (value2 == null || isNaN(value2) || value2 == undefined || value2 == '') {
        value2 = 0;
    }
    return value1 - value2;

}

/**
 * 获取规则管理的列表
 * @returns {Array}
 */
function getRuleGroup() {
    var isPolice = rootElement.myUserRole && rootElement.myUserRole.isPolice();
    var ruleGroup = [];
    // 格式说明，id 用于入库规则类型，根据ip来获取配置权限
    // parentId 分配规则按车辆界面使用，树结构。统一父级
    // tab 规则管理对应的元素id，根据权限来隐藏或者移除元素

    // ruleGroup.push({id: -1, name: "行为", parentId: 0});

    if (!isPolice) {
        // 疲劳驾驶
        ruleGroup.push({id: -1, name: rootElement.lang.fatigueDriving, parentId: 0, icon: 'fas fa-user-injured'});
        ruleGroup.push({id: 1, name: rootElement.lang.rule_fatigue, parentId: -1, tab: 'fatigue'});
        ruleGroup.push({id: 41, name: rootElement.lang.rule_fatigue_single, parentId: -1, tab: 'fatigueSingle'});
        ruleGroup.push({id: 42, name: rootElement.lang.Vehicle_running_timeout_rule_daily, parentId: -1, tab: 'vehicleRunningTimeout'});


        // 速度限行
        ruleGroup.push({id: -2, name: rootElement.lang.rule_class_speed_limit, parentId: 0, icon: 'fas fa-flag-checkered'});
        ruleGroup.push({id: 4, name: rootElement.lang.rule_areaPeriodSpeed, parentId: -2, tab: 'areaSpeed'});
        ruleGroup.push({id: 11, name: rootElement.lang.rule_linerangelimit, parentId: -2, tab: 'linerangelimit'});//分段限速规则
        if (rootElement.myUserRole && rootElement.myUserRole.isHaveRole(4)) {
            ruleGroup.push({id: 14, name: rootElement.lang.rule_roadGrade, parentId: -2, tab: 'roadGrade'});
        }
        ruleGroup.push({id: 5, name: rootElement.lang.rule_nightDriving, parentId: -2, tab: 'periodSpeed'});
        ruleGroup.push({id: 39, name: rootElement.lang.rule_overspeed, parentId: -2, tab: 'overspeed'});
        ruleGroup.push({id: 40, name: rootElement.lang.rule_night_overspeed, parentId: -2, tab: 'nightOverspeed'});

        // 传感器类
        ruleGroup.push({id: -3, name: rootElement.lang.rule_class_sensor, parentId: 0, icon: 'fas fa-ticket-alt'});
        ruleGroup.push({id: 31, name: rootElement.lang.overrunDetection, parentId: -3, tab: 'OverrunReminder'});
        ruleGroup.push({id: 19, name: rootElement.lang.acc_abnormal, parentId: -3, tab: 'accAbnormal'});
        ruleGroup.push({id: 25, name: rootElement.lang.alarm_black_screen, parentId: -3, tab: 'alarmBlackscreen'});
        ruleGroup.push({id: 6, name: rootElement.lang.rule_parkingTooLong, parentId: -3, tab: 'parkingTooLong'});
        ruleGroup.push({id: 15, name: rootElement.lang.rule_abnormalPosition, parentId: -3, tab: 'abnormalPosition'});
        ruleGroup.push({id: 20, name: rootElement.lang.position_abnormal, parentId: -3, tab: 'positionAbnormal'});
        ruleGroup.push({id: 21, name: rootElement.lang.offline_abnormal, parentId: -3, tab: 'offlineAbnormal'});

        // 身份识别
        ruleGroup.push({id: -4, name: rootElement.lang.driver_recognise, parentId: 0, icon: 'fas fa-user-astronaut'});
        ruleGroup.push({id: 17, name: rootElement.lang.driver_recognise, parentId: -4, tab: 'driverCheck'});
        ruleGroup.push({id: 22, name: rootElement.lang.dynamic_check, parentId: -4, tab: 'driverCheckAuto'});
    }


    // 区域线路
    ruleGroup.push({id: -5, name: rootElement.lang.rule_class_regional, parentId: 0, icon: 'fas fa-route'});
    ruleGroup.push({id: 2, name: rootElement.lang.rule_forbidInto, parentId: -5, tab: 'forbidInto'});
    ruleGroup.push({id: 3, name: rootElement.lang.rule_forbidOut, parentId: -5, tab: 'forbidOut'});
    if (!isPolice) {
        ruleGroup.push({id: 7, name: rootElement.lang.rule_lineOffset, parentId: -5, tab: 'lineOffset'});
        ruleGroup.push({id: 12, name: rootElement.lang.rule_keypoint, parentId: -5, tab: 'keypoint'});//关键点规则
        if (rootElement.myUserRole && !rootElement.myUserRole.isPolice() && rootElement.myUserRole.isOpenFenceLine()) {
            ruleGroup.push({id: 27, name: rootElement.lang.fence_line_management, parentId: -5, tab: 'fenceLineRule'});
        }
        ruleGroup.push({id: 28, name: rootElement.lang.gather_alarm_rule_title, parentId: -5, tab: 'gatherAlarmRule'});
        ruleGroup.push({id: 29, name: rootElement.lang.hot_area_rule_title, parentId: -5, tab: 'hotAreaAlarmRule'});
        ruleGroup.push({
            id: 34,
            name: rootElement.lang.rule_way_point_statistics,
            parentId: -5,
            tab: 'wayPointStatistics'
        });
        ruleGroup.push({
            id: 36,
            name: rootElement.lang.Cross_regional_operating_rules,
            parentId: -5,
            tab: 'crossRegionalInfo'
        });
    }
    if (rootElement.myUserRole && rootElement.myUserRole.isEpidemicSupport()) {
        ruleGroup.push({
            id: 46,
            name: rootElement.lang.inAndout_epidemic_area,
            parentId: -5,
            tab: 'inAndoutEpidemicArea'
        });
        ruleGroup.push({
            id: 47,
            name: rootElement.lang.coming_epidemic_area,
            parentId: -5,
            tab: 'comingEpidemicArea'
        });
    }
    // 报警规则
    ruleGroup.push({id: -6, name: rootElement.lang.rule_class_alarm, parentId: 0, icon: 'fas fa-car-crash'});
    ruleGroup.push({id: 13, name: rootElement.lang.rule_alarmMotion, parentId: -6, tab: 'alarmMotion'});//报警联动规则
    if (!isPolice) {
        ruleGroup.push({id: 16, name: rootElement.lang.alarm_rule_grade, parentId: -6, tab: 'alarmRule'});
        ruleGroup.push({id: 24, name: rootElement.lang.alarm_handling_reminder, parentId: -6, tab: 'alarmReminder'});
        if (rootElement.myUserRole && !rootElement.myUserRole.isPolice() && rootElement.myUserRole.isEnableRole(29)) {
            ruleGroup.push({
                id: 26,
                name: rootElement.lang.platformAlarmLevel,
                parentId: -6,
                tab: 'platformAlarmLevel'
            });
        }
        ruleGroup.push({id: 32, name: rootElement.lang.alarm_shielded, parentId: -6, tab: 'alarmMask'});
        ruleGroup.push({id: 33, name: rootElement.lang.rule_false_positive, parentId: -6, tab: 'falsePositive'});
        ruleGroup.push({id: 35, name: rootElement.lang.rule_five_level_alarm, parentId: -6, tab: 'fiveLevelAlarm'});
        ruleGroup.push({id: 43, name: rootElement.lang.threeLevelRiskRule, parentId: -6, tab: 'threeLevelRiskRule'});
        ruleGroup.push({id: 44, name: rootElement.lang.alarmClassifiedHandling, parentId: -6, tab: 'alarmClassifiedHandling'});
        if (rootElement.myUserRole.isEnableChuanBiao()) {
            ruleGroup.push({id: 45, name: rootElement.lang.No_travel_rules_chuan, parentId: -2, tab: 'noTravelRules'});
        }
        var enableNetworkControlAlarmReportBlackLabel = GetCookie("enableNetworkControlAlarmReportBlackLabel");
        if (enableNetworkControlAlarmReportBlackLabel === '1') {
            ruleGroup.push({id: 48, name: rootElement.lang.No_travel_rules_hei, parentId: -2, tab: 'noTravelRulesHeiBiao'});
        }
        /*        if (rootElement.myUserRole.isEnableChuanBiao()) {
                    ruleGroup.push({id: 45, name: rootElement.lang.No_travel_rules, parentId: -2, tab: 'noTravelRules'});
                }*/
    }

    // 定时任务
    ruleGroup.push({id: -7, name: rootElement.lang.param_task_type_timing, parentId: 0, icon: 'fas fa-paper-plane'});
    ruleGroup.push({id: 9, name: rootElement.lang.rule_timerRecording, parentId: -7, tab: 'timerRecording'});
    ruleGroup.push({id: 10, name: rootElement.lang.rule_wifiDownload, parentId: -7, tab: 'wifiDownload'});
    if (!isPolice) {
        ruleGroup.push({id: 8, name: rootElement.lang.rule_timingPicture, parentId: -7, tab: 'timingPicture'});
        ruleGroup.push({id: 30, name: rootElement.lang.rule_timingTts, parentId: -7, tab: 'timingTts'});
        ruleGroup.push({
            id: 37,
            name: rootElement.lang.Customized_information_release,
            parentId: -7,
            tab: 'customizedInfo'
        });
    }

    if (!isPolice) {
        ruleGroup.push({id: -8, name: rootElement.lang.rule_class_other, parentId: 0, icon: 'fas fa-prescription-bottle'});
        if (rootElement.myUserRole && rootElement.myUserRole.isZSYRoadList()) {
            ruleGroup.push({id: 18, name: rootElement.lang.zsy_temporaryRoad, parentId: -8, tab: 'temporaryRoad'});
        }
        ruleGroup.push({id: 23, name: rootElement.lang.accessory, parentId: -8, tab: 'accessory'});
        ruleGroup.push({id: 38, name: rootElement.lang.rule_due_reminder, parentId: -8, tab: 'dueReminder'});
    }
    return ruleGroup;
}

function initExportForm(url) {
    showExportingTip();
    url = url + "&exportType=1"
    $('<form method="post" name="exportForm" action="" style="display: none;"></form>')
        .attr('action', url)
        .appendTo('body')
        .submit()
        .remove();
}

/**
 * 根据参数，生成表单
 * 适用于@RequestBody
 */
function initExportFormByParams(url, params) {
    showExportingTip();
    if (!params.exportType) {
        url = url + "&exportType=1"
    }
    var formContent = '<form method="post" name="exportForm" action="" style="display: none;">';
    for (var param in params) {
        formContent += '<input type="text" name="' + param + '" value="' + params[param] + '"/>'
    }
    formContent += '</form>'
    $(formContent)
        .attr('action', url)
        .appendTo('body')
        .submit()
        .remove();
}

function showExportingTip() {
    var exportingTip;
    if (rootElement.lang) {
        exportingTip = rootElement.lang.exporting;
    } else {
        exportingTip = "正在导出中...";
    }
    alert(exportingTip);
}

function checkNullObject(data) {
    return JSON.stringify(data) == "{}";
}

// 判断是否为手机号
function isPoneAvailable(pone) {
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(pone)) {
        return false;
    } else {
        return true;
    }
}

// 判断是否为手机号或者座机号
function isPhoneNum(phone) {
    var testPhone = /^(1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8})?$/;
    var testFixedPhone = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
    if (!testPhone.test(phone) && !testFixedPhone.test(phone)) {
        return false;//验证失败
    } else {
        return true;//验证成功
    }
}

//公司功能配置
function companyVersionRelation() {
    var data = [];
    var allIds = [];
    if (rootElement.myUserRole.isEnableDirtTruck()) {
        allIds.push(1);
        data.push({id: 1, name: rootElement.lang.dirtTruckManagement});
    }
    if (rootElement.myUserRole.isEnableHasSchoolBus()) {
        allIds.push(2);
        data.push({id: 2, name: rootElement.lang.school_bus_management});
    }
    if (rootElement.myUserRole.isEnable905()) {
        allIds.push(3);
        data.push({id: 3, name: rootElement.lang.wisdomCarManagement});
    }
    if (data.length > 0) {
        data.unshift({id: allIds.toString(), name: rootElement.lang.all});
    }
    return data;
}


//初始化车辆状态
function initDeviceSearchTypes() {
    var vehiTypes = [];
    vehiTypes.push({id: -1, name: rootElement.lang.all});
    // 设备号
    vehiTypes.push({id: 1, name: rootElement.lang.device_number});
    // 产品厂家
    vehiTypes.push({id: 2, name: rootElement.lang.products_businesses});
    // 产品型号
    vehiTypes.push({id: 3, name: rootElement.lang.product_model});
    // 运输企业、【设备信息：所属公司】
    vehiTypes.push({id: 4, name: rootElement.lang.company_name});
    return vehiTypes;
}

// 初始化车辆状态
function initDeviceSearchModel() {
    $('#select-queryType').show();
    $('#select-queryValue').show();
    $('#select-queryType').flexPanel({
        ComBoboxModel: {
            button: [[{
                display: rootElement.lang.name_like,
                width: '80px',
                value: '',
                name: 'queryType',
                pid: 'queryType',
                pclass: 'buttom',
                bgcolor: 'gray',
                bgicon: 'true',
                hide: false,
                hidden: true
            }]],
            combox:
                {name: 'searchType', option: arrayToStr(initDeviceSearchTypes())}
        }
    });
    $('#select-queryValue').flexPanel({
        InputModel: {
            display: rootElement.lang.name_param,
            value: '',
            name: 'queryValue',
            pid: 'queryValue',
            pclass: 'buttom',
            bgicon: '',
            hidden: true,
            hide: false,
            onlySearch: true
        }
    });
}

function getAuthorityType() {
    var AuthorityType = [];
    AuthorityType.push({id: 0, name: rootElement.lang.Project_Transport_Management});
    AuthorityType.push({id: 1, name: rootElement.lang.Waste_disposal_management});
    AuthorityType.push({id: 2, name: rootElement.lang.Engineering_route_approval_management});
    AuthorityType.push({id: 3, name: rootElement.lang.Time_and_speed_management});
    AuthorityType.push({id: 4, name: rootElement.lang.Final_approval_by_the_Muck_Office});
    return AuthorityType;
}


function getSpeedString(speed) {
    return valueConversion(speed / 10.0) + ' ' + rootElement.lang.KmPerHour;
}

function getGaoDuString(gaodu) {
    return rootElement.lang.gaodu1 + gaodu + '(m)';
}


//时间秒数转换为时分秒
function getTimeDifference2(second) {
    var difValue = "";
    if (second != null && second == 0) {
        difValue += " " + 0 + ' ' + rootElement.lang.min_second;
        return difValue;
    }
    var days = parseInt(second / (60 * 60 * 24));
    var hours = parseInt(second % (60 * 60 * 24) / (60 * 60));
    var minutes = parseInt(second % (60 * 60) / 60);
    var seconds = parseInt(second % 60);
    if (days != 0) {
        difValue += days + rootElement.lang.min_day;
    }
    if (hours != 0) {
        difValue += hours + rootElement.lang.min_hour;
    }
    if (minutes != 0) {
        difValue += minutes + rootElement.lang.min_minute;
    }
    if (seconds != 0) {
        difValue += seconds + rootElement.lang.min_second;
    }
    return difValue;
}

/**
 * 时间秒数转换为时分秒，超过60s 则不显示秒
 */
function getTimeDifference4(second, showSecond) {
    var difValue = "";
    if (second != null && second == 0) {
        difValue += " " + 0 + ' ' + rootElement.lang.min_second;
        return difValue;
    }
    var days = parseInt(second / (60 * 60 * 24));
    var hours = parseInt(second / (60 * 60) - days * 24);
    var minutes = parseInt(second / (60) - days * 24 * 60 - hours * 60);
    var seconds = parseInt(second - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60);
    var arr = [];
    if (days != 0) {
        arr.push(days + rootElement.lang.min_day);
    }
    if (hours != 0) {
        arr.push(hours + rootElement.lang.min_hour);
    }
    if (minutes != 0) {
        arr.push(minutes + rootElement.lang.min_minute);
    }
    if ((seconds != 0 && arr.length === 0) || showSecond) {
        arr.push(seconds + rootElement.lang.min_second);
    }
    difValue = arr.join(' ');
    return difValue;
}


/**
 * 时间秒数转换为时分秒
 */
function getTimeDifference(second) {
    var difValue = "";
    if (second != null && second == 0) {
        difValue += " " + 0 + ' ' + rootElement.lang.min_second;
        return difValue;
    }
    var days = parseInt(second / (60 * 60 * 24));
    var hours = parseInt(second / (60 * 60) - days * 24);
    var minutes = parseInt(second / (60) - days * 24 * 60 - hours * 60);
    var seconds = parseInt(second - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60);
    if (days != 0) {
        difValue += days + ' ' + rootElement.lang.min_day;
    }
    if (hours != 0) {
        difValue += " " + hours + ' ' + rootElement.lang.min_hour;
    }
    if (minutes != 0) {
        difValue += " " + minutes + ' ' + rootElement.lang.min_minute;
    }
    if (seconds != 0) {
        difValue += " " + seconds + ' ' + rootElement.lang.min_second;
    }
    return difValue;
}

/**
 * 格式化文件大小的JS方法
 * @param filesize
 * @returns {string|*}
 */
function renderSize(filesize) {
    if (!filesize || isNaN(filesize)) {
        return "0 Bytes";
    }
    var unitArr = new Array("Bytes", "KB", "M", "G", "TB", "PB", "EB", "ZB", "YB");
    var srcsize = parseFloat(filesize);
    var index = Math.floor(Math.log(srcsize) / Math.log(1024));
    var size = srcsize / Math.pow(1024, index);
    size = size.toFixed(1);//保留的小数位数
    return size + unitArr[index];
}


/**
 * 报警类型和开始类型不一样的时候，就是为结束报警
 */
function isStartAlarm(alarm) {
    var armType = alarm.type;
    var startType = alarm.stType;
    var param1 = alarm.p1;
    //中石油临时路单
    //param[0]:0位 时间超时 1位:距离超时 2位:表示报警结束
    if (armType == 149) {
        if ((param1 & 4) > 0) {
            return false;
        } else {
            return true;
        }
    } else {
        if (startType == armType || startType == 0) {
            return true;
        } else {
            return false;
        }
    }
}

/***
 * 客户端对应的地图类型转换成web对应的地图
 * @param type
 * @returns {number}
 */
function toWebMapType(type) {
    switch (parseInt(type)) {
        case -1:
            return 10;
        case 0:
            return 1;
        case 3:
            return 3;
        case 12:
            return 4;
        case 14:
            return 7;
        case 15:
            return 8;
        case 13:
            return 9;
        case 16:
            return 10;
        case 17:
            return 11;
        case 18:
            return 18;
        default:
            return 3;
    }
}

function removeWdateReadonly() {
    // 清理Wdate的所有readonly
    $('input.Wdate').removeAttr('readonly')
}

/**
 * 时分秒 转秒数
 * @param time
 * @returns {number}
 */
function timeToSecond(time) {
    var timeArr = time.split(':');
    var hour = timeArr[0];
    var min = timeArr[1];
    var sec = timeArr[2];
    return Number(hour * 3600) + Number(min * 60) + Number(sec);
}

/**
 * 时间转毫秒数
 * @param str
 * @returns {number}
 */
function dateTimeStrToMillisecond(str) {
    if (!str) {
        return 0;
    }
    var arr = str.split(/[- : \/]/);
    return Date.parse(new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]));
}

/**
 * 数字a大小 是否在 range 之间
 * @param a 16
 * @param range [11,50]
 */
function numberIsBetweenRange(a, range) {
    return a >= range[0] && a <= range[1];
}

/**
 * 替换指定传入参数的值,url为地址,paramName为参数,replaceWith为新值
 * @param url
 * @param paramName
 * @param replaceVal
 * @returns {string}
 */
function replaceParamVal(url, paramName, replaceVal) {
    if (!url || !paramName || !replaceVal) {
        return url;
    }
    var oUrl = url.toString();
    var re = eval('/(' + paramName + '=)([^&]*)/gi');
    return oUrl.replace(re, paramName + '=' + replaceVal);
}


var safetyPlatformAlarm = [];

/**
 * 主动安全相关的报警
 * @type {*[]}
 */
function pushSafetyPlatformAlarm(name, pid, id) {
    safetyPlatformAlarm.push({id: id, pId: pid, name: name});
}

/**
 * 主动安全平台相关的报警
 */
function initSafetyPlatformAlarm() {
    // 已经完成一次初始化了
    if (safetyPlatformAlarm.length > 0) {
        return safetyPlatformAlarm;
    }
    safetyPlatformAlarm = [];
    pushSafetyPlatformAlarm(rootElement.lang.safety + "(" + rootElement.lang.platform + ")", 0, -99);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_900 + rootElement.lang.alarm_name_11111, -99, 900);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_900 + rootElement.lang.alarm_name_22222, -99, 901);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_900 + rootElement.lang.alarm_name_33333, -99, 902)
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_900 + rootElement.lang.alarm_name_44444, -99, 948);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_900 + rootElement.lang.alarm_name_55555, -99, 949);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_903 + rootElement.lang.alarm_name_11111, -99, 903);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_903 + rootElement.lang.alarm_name_22222, -99, 904);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_903 + rootElement.lang.alarm_name_33333, -99, 905);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_903 + rootElement.lang.alarm_name_44444, -99, 950);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_903 + rootElement.lang.alarm_name_55555, -99, 951);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_906 + rootElement.lang.alarm_name_11111, -99, 906);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_906 + rootElement.lang.alarm_name_22222, -99, 907);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_906 + rootElement.lang.alarm_name_33333, -99, 908);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_906 + rootElement.lang.alarm_name_44444, -99, 952);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_906 + rootElement.lang.alarm_name_55555, -99, 953);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_909 + rootElement.lang.alarm_name_11111, -99, 909);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_909 + rootElement.lang.alarm_name_22222, -99, 910);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_909 + rootElement.lang.alarm_name_33333, -99, 911);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_912 + rootElement.lang.alarm_name_11111, -99, 912);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_912 + rootElement.lang.alarm_name_22222, -99, 913);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_912 + rootElement.lang.alarm_name_33333, -99, 914);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_912 + rootElement.lang.alarm_name_44444, -99, 954);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_912 + rootElement.lang.alarm_name_55555, -99, 955);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_915 + rootElement.lang.alarm_name_11111, -99, 915);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_915 + rootElement.lang.alarm_name_22222, -99, 916);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_915 + rootElement.lang.alarm_name_33333, -99, 917);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_915 + rootElement.lang.alarm_name_44444, -99, 956);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_915 + rootElement.lang.alarm_name_55555, -99, 957);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_918 + rootElement.lang.alarm_name_11111, -99, 918);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_918 + rootElement.lang.alarm_name_22222, -99, 919);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_918 + rootElement.lang.alarm_name_33333, -99, 920);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_918 + rootElement.lang.alarm_name_44444, -99, 958);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_918 + rootElement.lang.alarm_name_55555, -99, 959);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_921 + rootElement.lang.alarm_name_11111, -99, 921);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_921 + rootElement.lang.alarm_name_22222, -99, 922);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_921 + rootElement.lang.alarm_name_33333, -99, 923);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_921 + rootElement.lang.alarm_name_55555, -99, 960);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_924 + rootElement.lang.alarm_name_11111, -99, 924);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_924 + rootElement.lang.alarm_name_22222, -99, 925);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_924 + rootElement.lang.alarm_name_33333, -99, 926);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_924 + rootElement.lang.alarm_name_44444, -99, 961);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_924 + rootElement.lang.alarm_name_55555, -99, 962);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_927 + rootElement.lang.alarm_name_11111, -99, 927);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_927 + rootElement.lang.alarm_name_22222, -99, 928);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_927 + rootElement.lang.alarm_name_33333, -99, 929);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_930 + rootElement.lang.alarm_name_11111, -99, 930);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_930 + rootElement.lang.alarm_name_22222, -99, 931);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_930 + rootElement.lang.alarm_name_33333, -99, 932);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_933 + rootElement.lang.alarm_name_11111, -99, 933);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_933 + rootElement.lang.alarm_name_22222, -99, 934);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_933 + rootElement.lang.alarm_name_33333, -99, 935);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_933 + rootElement.lang.alarm_name_44444, -99, 963);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_933 + rootElement.lang.alarm_name_55555, -99, 964);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_936 + rootElement.lang.alarm_name_11111, -99, 936);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_936 + rootElement.lang.alarm_name_22222, -99, 937);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_936 + rootElement.lang.alarm_name_33333, -99, 938);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_939 + rootElement.lang.alarm_name_11111, -99, 939);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_939 + rootElement.lang.alarm_name_22222, -99, 940);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_939 + rootElement.lang.alarm_name_33333, -99, 941);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_939 + rootElement.lang.alarm_name_44444, -99, 965);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_939 + rootElement.lang.alarm_name_55555, -99, 966);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_942 + rootElement.lang.alarm_name_11111, -99, 942);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_942 + rootElement.lang.alarm_name_22222, -99, 943);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_942 + rootElement.lang.alarm_name_33333, -99, 944);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_945 + rootElement.lang.alarm_name_11111, -99, 945);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_945 + rootElement.lang.alarm_name_22222, -99, 946);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_945 + rootElement.lang.alarm_name_33333, -99, 947);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_967 + rootElement.lang.alarm_name_11111, -99, 967);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_967 + rootElement.lang.alarm_name_22222, -99, 637);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_967 + rootElement.lang.alarm_name_33333, -99, 968);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_967 + rootElement.lang.alarm_name_44444, -99, 969);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_967 + rootElement.lang.alarm_name_55555, -99, 970);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_971 + rootElement.lang.alarm_name_11111, -99, 971);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_971 + rootElement.lang.alarm_name_22222, -99, 972);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_971 + rootElement.lang.alarm_name_33333, -99, 973);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_971 + rootElement.lang.alarm_name_44444, -99, 974);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_971 + rootElement.lang.alarm_name_55555, -99, 975);

    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_1334 + rootElement.lang.alarm_name_11111, -99, 1334);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_1334 + rootElement.lang.alarm_name_22222, -99, 1335);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_1334 + rootElement.lang.alarm_name_33333, -99, 1336)
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_1337 + rootElement.lang.alarm_name_11111, -99, 1337);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_1337 + rootElement.lang.alarm_name_22222, -99, 1338);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_1337 + rootElement.lang.alarm_name_33333, -99, 1339)
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_1340 + rootElement.lang.alarm_name_11111, -99, 1340);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_1340 + rootElement.lang.alarm_name_22222, -99, 1341);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_1340 + rootElement.lang.alarm_name_33333, -99, 1342)
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_1343 + rootElement.lang.alarm_name_11111, -99, 1343);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_1343 + rootElement.lang.alarm_name_22222, -99, 1344);
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_1343 + rootElement.lang.alarm_name_33333, -99, 1345)

    // 超速报警等级报警
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_1315, -99, 1315)
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_1316, -99, 1316)
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_1317, -99, 1317)
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_1318, -99, 1318)
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_1346, -99, 1346)
    // 疲劳驾驶等级报警
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_1319, -99, 1319)
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_1320, -99, 1320)
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_1321, -99, 1321)
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_1322, -99, 1322)
    pushSafetyPlatformAlarm(rootElement.lang.alarm_name_1323, -99, 1323)
    return safetyPlatformAlarm;
}


/**
 * 判断节点的父级是否展开，有一个不展开就 返回false
 * @param node
 * @returns {string}
 */
function parentIsOpen(node, rlt) {
    if (node) {
        var parentNode = node.getParentNode();
        if (parentNode && !parentNode.open) {
            rlt = false
            return rlt;
        }
        return parentIsOpen(parentNode, rlt)
    }
    return rlt;
}

/**
 * 动态填充语言包
 * @param {String} elementClass 元素共同点class
 * @param {Object} language 语言包对应的对象
 */
function dynamicLanguage(elementClass, language) {
    if (elementClass && language) {
    } else {
        return;
    }
    // 动态词条
    $(elementClass).each(function () {
        var obj = $(this);
        // 直接替换内容
        var content = obj.data('i18n');
        if (content) {
            var str = language[content];
            obj.html(str);
        }
        // title
        if (obj.data('i18n-title')) {
            content = obj.data('i18n-title');
        }
        if (content) {
            var str = language[content];
            obj.prop('title', str);
        }
        // placeholder
        content = obj.data('i18n-placeholder');
        if (content) {
            var str = language[content];
            obj.prop('placeholder', str);
        }
    });
}


//车牌类型
function getPlateTypes() {
    var plateTypes = [];
    plateTypes.push({id: 1, name: rootElement.lang.blue_label});
    plateTypes.push({id: 2, name: rootElement.lang.yellow_label});
    plateTypes.push({id: 3, name: rootElement.lang.black_label});
    plateTypes.push({id: 4, name: rootElement.lang.white_label});
    plateTypes.push({id: 5, name: rootElement.lang.green});
    plateTypes.push({id: 93, name: rootElement.lang.yellowGreen});
    plateTypes.push({id: 224, name: rootElement.lang.yellowGreen + 'FJ'});
    plateTypes.push({id: 225, name: rootElement.lang.whiteGreen + 'FJ'});
    plateTypes.push({id: 91, name: rootElement.lang.agriculturalYellow});
    plateTypes.push({id: 92, name: rootElement.lang.agroGreen});
    plateTypes.push({id: 94, name: rootElement.lang.gradualGreen});
    plateTypes.push({id: 0, name: rootElement.lang.nonePlate});
    plateTypes.push({id: 9, name: rootElement.lang.other});
    return plateTypes;
}

/**
 * 获取车辆车牌颜色对应的颜色码
 * @param {number} plate
 * @returns {*}
 */
function getPlateColorCode(plate) {
    if (!plate) {
        plate = 0;
    }
    var color = "#ccc";
    switch (parseInt(plate)) {
        case 1:
            color = "#0000FE";
            break;//蓝色
        case 2:
            color = "#FBED02";
            break;//黄牌
        case 3:
            color = "#010101";
            break;//黑牌
        case 4:
            color = "#F7F7F7";
            break;//白牌
        case 5:
            color = "#187D02";
            break; //青草绿
        case 224:
            color = "#AEC215";
            break;
        case 225:
            color = "#98d2a7";
            break; //白绿
        case 93:
            color = "#AEC215";
            break; //黄绿
        case 91:
            color = "#D2B401";
            break;//农黄
        case 92:
            color = "#18A280";
            break; //农绿
        case 94:
            color = "#5AFD62";
            break;//渐变绿
        case 9:
            color = "#ccc";
            break;//其他
        default:
            color = "#ccc";
            break;
    }
    var name = getArrayName(getPlateTypes(), plate);
    return {color: color, name: name};
}


/**
 * 车辆设备变更类型
 * @param type 1是设备的
 * @returns {[]}
 */
function getVehicleModifyTypes(type) {
    var types = [];
    // 保证id 和  StandardDeviceLogOperateUtils.getCheckParam() 集合一致
    types.push({id: 'all', name: rootElement.lang.all});
    // 设备相关的变更
    types.push({id: "getCompany", name: rootElement.lang.belong_company});
    if (type && type == 1) {
        types.push({id: "getChnName", name: rootElement.lang.alarm_channel});
        types.push({id: "getSimInfo", name: rootElement.lang.sim});
        types.push({id: "getDevType", name: rootElement.lang.device_type});
    } else {
        types.push({id: "getChnName,changeDeviceChn", name: rootElement.lang.alarm_channel});
        types.push({id: "getSimInfo,changeDeviceSimInfo", name: rootElement.lang.sim});
        types.push({id: "getDevType,changeDeviceDevType", name: rootElement.lang.device_type});
    }
    types.push({id: "getSerialID", name: rootElement.lang.device_serial});
    types.push({id: "getBrand", name: rootElement.lang.product_brand});
    types.push({id: "getModel", name: rootElement.lang.product_model});
    types.push({id: "getSoftwareVer", name: rootElement.lang.software_version});
    types.push({id: "getHardwareVer", name: rootElement.lang.hardware_version});
    types.push({id: "getFactory", name: rootElement.lang.products_businesses});
    types.push({id: "getRemark", name: rootElement.lang.remark});
    types.push({id: "getProtocol", name: rootElement.lang.protocolType});
    types.push({id: "getFactoryType", name: rootElement.lang.device_factory_type});
    types.push({id: "getNetAddrType", name: rootElement.lang.device_selectAddress2});
    types.push({id: "getPassWord", name: rootElement.lang.identityCheack});
    types.push({id: "getUseStatus", name: rootElement.lang.use_status});
    types.push({id: "getServerPort", name: rootElement.lang.serverPort});
    types.push({id: "getServerAddress", name: rootElement.lang.serverAddress});
    types.push({id: "getTransportEnterprise", name: rootElement.lang.transportEnterprise});
    types.push({id: "getAccessLineWay", name: rootElement.lang.accessLineMode});
    types.push({id: "getInstallationPlace", name: rootElement.lang.instalPlace});
    types.push({id: "getSimMolectronCode", name: rootElement.lang.noncoding});
    types.push({id: "getCameraNumber", name: rootElement.lang.cameraNumber});
    types.push({id: "getPickupNumber", name: rootElement.lang.pickupNumber});
    types.push({id: "getStorageMediumType", name: rootElement.lang.videoStorageMediaType});
    types.push({id: "getStorageMediumModel", name: rootElement.lang.videoStorageMediumModel});
    types.push({id: "getStorageMediumSize", name: rootElement.lang.videoStorageMediumCapacity});
    if (type && type == 1) {
        return types;
    }
    types.push({id: "getDriver", name: rootElement.lang.driver});
    types.push({id: "getVehiIDNO", name: rootElement.lang.report_vehiIdno});
    types.push({id: "getStatus", name: rootElement.lang.taxi_status});
    types.push({id: "getPlateType", name: rootElement.lang.license_plate_type});
    types.push({id: "getVehiColor", name: rootElement.lang.vehicle_color});
    types.push({id: "getVehiBand", name: rootElement.lang.vehicle_brand});
    types.push({id: "getVehiType", name: rootElement.lang.vehicle_type});
    types.push({id: "getAbbr", name: rootElement.lang.vehicle_abbr});
    types.push({id: "getVehiUse", name: rootElement.lang.vehicle_purposes});
    types.push({id: "getIcon", name: rootElement.lang.vehicle_icons});
    types.push({id: "getPayBegin", name: rootElement.lang.agreement_start_date});
    types.push({id: "getPayEnd", name: rootElement.lang.agreement_end_date});
    types.push({id: "getStlTm", name: rootElement.lang.device_installTime});
    types.push({id: "getVehicleGrade", name: rootElement.lang.vehicle_vehicleGrade});
    types.push({id: "getApprovedNumber", name: rootElement.lang.vehicle_approvedNumber});
    types.push({id: "getApprovedLoad", name: rootElement.lang.vehicle_approvedLoad});
    types.push({id: "getEngineNum", name: rootElement.lang.travelmanger_engineNumber});
    /*  types.push({id: "getChnName,changeDeviceChn", name: rootElement.lang.alarm_channel});*/
    types.push({id: "getIoInName,changeDeviceIoIn", name: "IO"});
    types.push({id: "getTempName,changeDeviceTemp", name: rootElement.lang.map_pop_item_sensor});
    types.push({id: "changeDevice", name: rootElement.lang.vehicle_change_device});
    types.push({id: "addVehicleDevice", name: rootElement.lang.vehicle_device_add});
    types.push({id: "addVehicle", name: rootElement.lang.new_vehicles});
    types.push({id: "delVehicle", name: rootElement.lang.report_vehicleModify_delVehicle});
    types.push({id: "delVehicleDevice", name: rootElement.lang.vehicle_delete_device});
    types.push({id: "changeDeviceModule", name: rootElement.lang.peripheral_modules});
    return types;
}

/**
 * 查询轨迹列表
 * @param {String} devIdno 设备号
 * @param {String} vehiIdno 车牌号
 * @param {String} bTimeStr 开始时间（长时间 2020-03-31 10::10:10）
 * @param {String} eTimeStr 结束时间（长时间 2020-03-31 10::10:10）
 */
function showAlarmLine(devIdno, vehiIdno, bTimeStr, eTimeStr) {
    var startTime = dateStrLongTime2Date(bTimeStr);
    var endTime = dateStrLongTime2Date(eTimeStr);
    if (!startTime && !endTime) {
        return;
    }
    if (!startTime) {
        startTime = endTime;
    }
    if (!endTime) {
        endTime = startTime;
    }
    // 查询时间前后30秒
    bTimeStr = dateFormat2TimeString(new Date(startTime.getTime() - 1000 * 30));
    eTimeStr = dateFormat2TimeString(new Date(endTime.getTime() + 1000 * 30));
    $.dialog({
        id: 'showAlarmLine',
        title: rootElement.lang.track_playback,
        content: 'url:AlarmTrack/Track.html?vehiIdno=' + encodeURIComponent(vehiIdno) + "&devIdno=" + devIdno + "&beginTime=" + bTimeStr + "&endTime=" + eTimeStr,
        width: '975px',
        height: '720px',
        minHeight: '550px',
        min: false,
        max: false,
        lock: true,
    });
}

/**
 * 通过车牌号获取别名<br>
 *     优先使用简称 > 车牌号
 * @param {String} vehiIdno
 */
function getVehicleAbbr(vehiIdno) {
    // 当前版本占时移除简称
    if (!vehiIdno) {
        return vehiIdno;
    }
    var vehicle = rootElement.vehicleManager.getVehicle(vehiIdno);
    if (vehicle) {
        return vehicle.getSelfNumbered();
    }
    return vehiIdno;
}

/**
 * 数组去重
 * @param arr
 * @returns {*}
 */
Array.prototype.distinct = function (arr) {
    return arr.filter(function (item, index, arr) {
        return arr.indexOf(item, 0) === index;
    });
}

/**
 * 获取通用的表格每页条数
 */
function getCommTablePageSize() {
    var pageSize = rootElement.LS.get("customize-page-size");
    if (!pageSize || isNaN(pageSize)) {
        pageSize = 10;
    }
    return pageSize;
}


/**
 * 初始化时间选择器
 */
function initDateSelector(domSelector, opt) {
    var _dom = $(domSelector)
    _dom.addClass('Wdate');
    _dom.attr('readonly', 'readonly');
    _dom.click(function () {
        WdatePicker(opt);
    });
}

/**
 * 计算字符串的字节长度
 * @param str
 * @returns {*}
 */
function bytesLnegth(str) {
    var count = str.length;
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) {
            count++;
        }
    }
    return count;
}

/**
 * 页面缩放后获取 pageX pageY 的值
 */
function getPageXYVal(val) {
    var m = detectZoom();
    var scale = Number(m) / 100;
    return val * scale;
}

/**
 * 页面缩放后获取 宽高 的值
 */
function getWidthHeightByZoom(val) {
    var m = detectZoom();
    var scale = Number(m) / 100;
    return val * scale;
}

//是否谷歌浏览器
function isBrowseChrome() {
    return (navigator.userAgent.toLowerCase().match(/chrome\/([\d.]+)/) != null) ? true : false;
}

/**
 * 是否移动端
 * @returns {boolean}
 */
function mobileAndTabletCheck() {
    var check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

/**
 * 解决pc端屏幕缩放比例对页面布局的影响
 */
function handleScreen(callBackFun) {
    if (!isBrowseChrome()) {
        return;
    }
    var m = detectZoom();
    document.body.style.zoom = 100 / Number(m);
    if (typeof callBackFun == "function") {
        callBackFun();
    }
}

function detectZoom() {
    if (!isBrowseChrome() || mobileAndTabletCheck()) {
        return 100;
    }
    var urlScale = typeof rootElement != "undefined" ? rootElement.getUrlParameter('scale') : getUrlParameter('scale');
    if (urlScale) {
        urlScale = 100 / urlScale * 100;
        return urlScale;
    }
    var ratio = 0,
        screen = window.screen,
        ua = navigator.userAgent.toLowerCase();
    if (window.devicePixelRatio !== undefined) {
        ratio = window.devicePixelRatio;
    } else if (~ua.indexOf('msie')) {
        if (screen.deviceXDPI && screen.logicalXDPI) {
            ratio = screen.deviceXDPI / screen.logicalXDPI;
        }
    } else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
        ratio = window.outerWidth / window.innerWidth;
    }
    if (!ratio) {
        ratio = 1;
    }
    var realWidth = rootElement.window.innerWidth * ratio;
    ratio = Math.round(ratio * 100);
    if (realWidth > 1920) {
        ratio = ratio * 1920 / realWidth;
    }
    return ratio;
}

function getWindowHeight() {
    if (!isBrowseChrome()) {
        return $(window).height();
    }
    var zoom = document.body.style.zoom;
    var height = $(window).height();
    if (zoom) {
        return height / zoom;
    }
    return height;
}

function getWindowWidth() {
    if (!isBrowseChrome() || !document.body.style) {
        return $(window).width();
    }
    var zoom = document.body.style.zoom;
    var width = $(window).width();
    if (zoom) {
        return width / zoom;
    }
    return width;
}

/**
 * 校验是否存在上传的无用图片
 */
function checkNolessUpload() {
    if (typeof WebUploaderUtil === 'undefined') return;

    for (var key in window) {
        if (key === 'that') {
            continue;
        }
        if (window[key] instanceof WebUploaderUtil) {
            window[key].clearUselessPictures();
        }
    }
}

/**
 * 获取浏览器缩放等级
 * @returns {number}
 */
function getWindowRatio() {
    var ratio = 0;
    var screen = window.screen;
    var ua = navigator.userAgent.toLowerCase();

    if (window.devicePixelRatio !== undefined) {
        ratio = window.devicePixelRatio;
    } else if (~ua.indexOf('msie')) {
        if (screen.deviceXDPI && screen.logicalXDPI) {
            ratio = screen.deviceXDPI / screen.logicalXDPI;
        }
    } else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
        ratio = window.outerWidth / window.innerWidth;
    }

    if (ratio) {
        ratio = Math.round(ratio * 100);
    }
    return ratio;
}


/**
 * 点击放大图片
 * @param _this 图片img元素
 */
function bigImgShow(_this) {
    if ($("#outerdiv").length == 0) {
        $("body").after('<div id="outerdiv" style="position:fixed;top:0;left:0;background:rgba(0,0,0,0.7);z-index:10001;width:100%;height:100%;display:none;">\n' +
            '        <div id="innerdiv" style="position:absolute;">\n' +
            '            <img id="bigimg" style="border:5px solid #fff;" src="" />\n' +
            '        </div>\n' +
            '    </div>');
    }

    var outerdiv = "#outerdiv";
    var innerdiv = "#innerdiv";
    var bigimg = "#bigimg";
    var src = _this.attr("src");//获取当前点击的pimg元素中的src属性
    $(bigimg).attr("src", src);//设置#bigimg元素的src属性

    /*获取当前点击图片的真实大小，并显示弹出层及大图*/
    $("<img/>").attr("src", src).load(function () {
        var windowW = getWindowWidth();//获取当前窗口宽度
        var windowH = getWindowHeight();//获取当前窗口高度
        var realWidth = this.width;//获取图片真实宽度
        var realHeight = this.height;//获取图片真实高度
        var imgWidth, imgHeight;
        var scale = 0.8;//缩放尺寸，当图片真实宽度和高度大于窗口宽度和高度时进行缩放

        /*if (realWidth > realHeight) {
            imgWidth = windowW * scale;
            imgHeight = imgWidth / realWidth * realHeight;
            if (imgHeight > windowH * scale) {
                imgHeight = windowH * scale;
            }
        } else {
            imgHeight = windowH * scale;
            imgWidth = imgHeight / realHeight * realWidth;
            if (imgWidth > windowW * scale) {
                imgWidth = windowW * scale;
            }
        }*/

        if (realHeight > windowH * scale) {//判断图片高度
            imgHeight = windowH * scale;//如大于窗口高度，图片高度进行缩放
            imgWidth = imgHeight / realHeight * realWidth;//等比例缩放宽度
            if (imgWidth > windowW * scale) {//如宽度扔大于窗口宽度
                imgWidth = windowW * scale;//再对宽度进行缩放
            }
        } else if (realWidth > windowW * scale) {//如图片高度合适，判断图片宽度
            imgWidth = windowW * scale;//如大于窗口宽度，图片宽度进行缩放
            imgHeight = imgWidth / realWidth * realHeight;//等比例缩放高度
        } else {//如果图片真实高度和宽度都符合要求，高宽不变
            imgWidth = realWidth;
            imgHeight = realHeight;
        }
        $(bigimg).css("height", imgHeight);//以最终的高度对图片缩放
        $(bigimg).css("width", imgWidth);//以最终的宽度对图片缩放

        var w = (windowW * document.body.style.zoom - imgWidth) / 2;//计算图片与窗口左边距
        var h = (windowH * document.body.style.zoom - imgHeight) / 2;//计算图片与窗口上边距
        $(innerdiv).css({"top": h, "left": w});//设置#innerdiv的top和left属性
        $(outerdiv).fadeIn("fast");//淡入显示#outerdiv及.pimg
    });

    $(outerdiv).click(function () {//再次点击淡出消失弹出层
        $(this).fadeOut("fast");
    });
}

var allTtxMap = new Map();
var ttxMapId = 1;

function registerTtxMap(ttxMapGl) {
    rootElement.allTtxMap.set(rootElement.ttxMapId, ttxMapGl);
    rootElement.ttxMapId++;
}

function changeGlobalMapType(mapType) {
    rootElement.allTtxMap.forEach(function (ttxMapGl, ttxMapId) {
        try {
            ttxMapGl.changeMapType(mapType);
        } catch (e) {
            rootElement.allTtxMap.delete(ttxMapId);
        }
    })
}

/**
 * 将字面量对象转为url参数
 * @param param 将要转为URL参数字符串的对象
 * @param key URL参数字符串的前缀
 * @param encode true/false 是否进行URL编码
 * @returns {string}
 */
function urlEncode(param, key, encode) {
    if (param == null) return '';
    var paramStr = '';
    var t = typeof (param);
    if (t == 'string' || t == 'number' || t == 'boolean') {
        paramStr += '&' + key + '=' + (encode ? encodeURIComponent(param) : param);
    } else {
        for (var i in param) {
            var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
            paramStr += urlEncode(param[i], k, encode);
        }
    }
    return paramStr;
}


function getComputedStyleEx(el, style) {
    var stl = el.currentStyle || document.defaultView && document.defaultView.getComputedStyle(el);
    return stl ? style ? stl[style] : stl : null;
}

/**
 * 禁止input自动提示
 * @param id
 */
function disableInputAutoComplete() {
    $('input').prop('autocomplete', 'off');
}

/**
 * 报警处理误报通用处理
 * @param handleWay
 * @param handleContent
 * @param datas
 * @returns {*|string}
 */
function false_positive_commonHandle(handleWay, handleContent, datas) {
    if (datas && handleWay == 5) {
        var array = [
            {id: 'equipmentfailure', name: rootElement.lang.adas_equipment_failure},
            {id: 'badweather', name: rootElement.lang.bad_weather}
        ];
        return getArrayName(array, datas.FalseArmReason)
    }
    return handleContent;
}

function padStart(txt, length) {
    var l = txt.length;
    if (l < length) {
        for (var i = 0; i < length - l; i++) {
            txt = "0" + txt;
        }
    }
    return txt;
}


/**
 * 808自动升级的
 * @returns {[]}
 */
function initAutoUpgradeTypes() {
    var types = [];
    types.push({id: 0, name: rootElement.lang.policeOrVehicel});//
    types.push({id: 100, name: rootElement.lang.autoUpgrade_type_adas});//
    types.push({id: 101, name: rootElement.lang.autoUpgrade_type_dsm});
    types.push({id: 102, name: rootElement.lang.autoUpgrade_type_tire});
    types.push({id: 103, name: rootElement.lang.autoUpgrade_type_blind});
    return types;
}

/**
 * 数字转字母
 * @param len
 * @returns {string}
 */
function formatNumToCode(len) {
    return String.fromCharCode(len + 65);
}

function toFixedEx2(value) {
    var d = value.toString().split(".");
    if (d.length == 1) {
        value = value.toString() + ".00";
        return value;
    }
    if (d.length > 1) {
        if (d[1].length < 2) {
            value = value.toString() + "0";
        }
        return value;
    }

}


/**
 * 转换
 * @param cols
 */
function switchToTableGroupModelTabs(cols) {
    var displays = [],
        names = [],
        types = [],
        lengths = [];
    for (var i = 0; i < cols.length; i++) {
        displays.push(cols[i].display);
        names.push(cols[i].name);
        types.push(cols[i].type);
        lengths.push(cols[i].length);
    }
    return {display: displays, name: names, type: types, length: lengths};
}

//车辆类型
function getFreightVehicleTypes() {
    var cargoVehiTypes = [];
    for (var i = 1; i < 71; i++) {
        cargoVehiTypes.push({id: i, name: rootElement.lang["general_cargo_vehicle_type_" + i]});
    }
    return cargoVehiTypes;
}

/**
 *报表报警处理按钮
 */
function getOperatorAlarmHandle(row) {
    if (row['handleStatus'] == 0 || (row['handleStatus'] < 0 && row['approvalStatus'] == 3)) {
        //1.不灰  可点击:没有报警处理||(申诉不通过)
        return "<a class=\"edit\"  href=\"javascript:doAlarmHandle('" + row['guid'] + "','" + row['devIdno'] + "','" + row['vehiIdno'] + "','" + row['armType'] + "','" + row['handleContent'] + "'," + false + ",'" + row['armTimeStart'] + "','" + row['armTimeEnd'] + "','" + row['recId'] + "','" + row['armDesc'] + "','" + row['bTimeStr'] + "'," + row['handleStatus'] + ");\" title=\"" + rootElement.lang.monitor_alarm_handle + "\"></a>";
    } else if (row['handleStatus'] > 0 && rootElement.myUserRole.isEnableAlarmRepeatProcessing()) {
        //2.不灰  可点击：有报警处理&&可重复处理
        return "<a class=\"edit\" href=\"javascript:doAlarmHandle('" + row['guid'] + "','" + row['devIdno'] + "','" + row['vehiIdno'] + "','" + row['armType'] + "','" + row['handleContent'] + "'," + false + ",'" + row['armTimeStart'] + "','" + row['armTimeEnd'] + "','" + row['recId'] + "','" + row['armDesc'] + "','" + row['bTimeStr'] + "'," + row['handleStatus'] + ");\" title=\"" + rootElement.lang.report_handled + "\"></a>";
    } else {
        //3.灰  不可点击
        var bottonTitle;
        if (row['handleStatus'] > 0) {
            bottonTitle = rootElement.lang.report_handled;
        } else {
            bottonTitle = rootElement.lang.monitor_alarm_handle;
        }
        return "<a class=\"not-edit\" href=\"javascript:void(0,0);\" title=\"" + bottonTitle + "\"></a>";
    }
}

/**
 * 车辆状态颜色
 * @returns {string}
 */
function getVehiIconColor() {
    return {
        online: '#009900',
        offline: '#656C7B',
        alarm: '#F02E2D',
        parkaccon: '#BB6FDD',//未定位
        stopaccoff: '#8d9810',//停车
        stopaccon: rootElement.isPoliceStyle ? '#7272ff' : '#4343E8',//怠速
        io: '#26c9ff'
    }
}


/**
 * Orc识别错误
 * https://ai.baidu.com/ai-doc/OCR/dk3h7y5vr
 * @param code  错误码
 */
function dialogOcrError(code) {
    if (typeof code != "undefined"
        && rootElement.lang["baidu_orc_code_" + code]) {
        $.dialog.tipDanger(rootElement.lang["baidu_orc_code_" + code])
        return;
    }
    $.dialog.tipDanger(rootElement.lang.identifyFail)
}

/**
 * 判断是否ftp文件
 * @param url
 * @returns {boolean}
 */
function isFtpUrl(url) {
    if (!url) {
        return false;
    }
    url = $.trim(url);
    if (url.startWith('ftp:')) {
        return true;
    }
    return false;
}

//获取URL参数信息
function getUrlParameter(name) {
    if (location.search == '') {
        return '';
    }
    var o = {};
    var search = location.search;
    if (location.hash) {
        search += location.hash;
    }
    search = search.replace(/\?/, '');//只替换第一个问号,如果参数中带有问号,当作普通文本
    var s = search.split('&');
    for (var i = 0; i < s.length; i++) {
        o[s[i].split('=')[0]] = s[i].split('=')[1];
    }
    return o[name] == undefined ? '' : o[name];
}

//固定保留小数
function returnFloat(value, bit) {
    var value = value.toFixed(bit);
    /*    if ((value | 0) === value && bit>0) {
            value=value.toString()+".";
            for (var i = 0; i < bit; i++) {
                value=value.toString()+"0";
            }
        }
        return value;*/
    var xsd = value.toString().split(".");
    if (xsd.length == 1) {
        value = value.toString() + ".";
        for (var i = 0; i < bit; i++) {
            value = value.toString() + "0";
        }
        return value;
    }
    if (xsd.length > 1) {
        if (xsd[1].length < bit) {
            for (var i = 0; i < bit - xsd[1].length; i++) {
                value = value.toString() + "0";
            }
        }
        return value;
    }
}

/**
 * html转义
 */
function html2Escape(sHtml) {
    if (!sHtml || typeof sHtml != 'string') {
        return sHtml;
    }
    return sHtml.replace(/[<>&"]/g, function (c) {
        return {'<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;'}[c];
    });
}


/**
 * 获取选择弹框数据
 * @param dom dom节点
 * @param type 弹框类型
 */
function getDialogQueryParams(dom, type) {
    for (var key in window) {
        if (window[key] instanceof rootElement.SelectDialog) {
            return window[key].getQueryParam();
        }
    }

    var typeArray = {
        'selVehicle': 1,
        'selCompany': 2,
        'selUser': 3,
        'selDriver': 4,
        'device': 5,
    }
    var queryCompanyId = rootElement.defaultSelCompany;
    var queryVehicleType = rootElement.defaultSelVehicleType;
    var queryCompanyLeave = rootElement.defaultCompanyLeave;
    // 车辆
    if(type === 'selVehicle'){
        queryCompanyId = rootElement.defaultSelCompany;
        queryVehicleType = rootElement.defaultSelVehicleType;
        queryCompanyLeave = rootElement.defaultCompanyLeave;
    }
    // 公司
    if(type === 'selCompany'){
        // queryCompanyId = rootElement.defaultCompanyId;
        // queryVehicleType = '';
        // queryCompanyLeave = rootElement.defaultCompanyLeave;
        queryCompanyId = '';
        queryVehicleType = '';
        queryCompanyLeave = '';
    }

    var data = {
        ids: $('#hidden-' + dom).val(),
        selCompanyId: queryCompanyId,
        vehicleType: queryVehicleType,
        selCompanyLeave: queryCompanyLeave,
        type: typeArray[type]
    }
    return {
        selectDialog: encodeURIComponent(JSON.stringify(data))
    }
}


(function () {
    'use strict';

    /**
     * Format string with argument list or object
     * @param  {object | arguments} args
     * @return {String}
     */
    if (!String.prototype.format) {
        String.prototype.format = function (args) {
            var result = this;
            if (arguments.length > 0) {
                var reg;
                if (arguments.length <= 2 && typeof (args) == 'object') {
                    for (var key in args) {
                        if (args[key] !== undefined) {
                            reg = new RegExp('(' + (arguments[1] ? arguments[1].replace('0', key) : '{' + key + '}') + ')', 'g');
                            result = result.replace(reg, args[key]);
                        }
                    }
                } else {
                    for (var i = 0; i < arguments.length; i++) {
                        if (arguments[i] !== undefined) {
                            reg = new RegExp('({[' + i + ']})', 'g');
                            result = result.replace(reg, arguments[i]);
                        }
                    }
                }
            }
            return result;
        };
    }

    /**
     * Judge the string is a integer number
     *
     * @access public
     * @return bool
     */
    if (!String.prototype.isNum) {
        String.prototype.isNum = function (s) {
            if (s !== null) {
                var r, re;
                re = /\d*/i;
                r = s.match(re);
                return (r == s) ? true : false;
            }
            return false;
        };
    }

    if (!String.prototype.endsWith) {
        String.prototype.endsWith = function (searchString, position) {
            var subjectString = this.toString();
            if (position === undefined || position > subjectString.length) {
                position = subjectString.length;
            }
            position -= searchString.length;
            var lastIndex = subjectString.indexOf(searchString, position);
            return lastIndex !== -1 && lastIndex === position;
        };
    }

    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (searchString, position) {
            position = position || 0;
            return this.lastIndexOf(searchString, position) === position;
        };
    }

    if (!String.prototype.includes) {
        String.prototype.includes = function () {
            return String.prototype.indexOf.apply(this, arguments) !== -1;
        };
    }

})();


/**
 * 司机人脸识别弹窗可以区分成功、失败
 * @returns {number[]}
 */
function faceRecognitionClassifyAlarmTypes() {
    return [
        636,//驾驶员识别事件(平台)
        646,//插卡比对身份识别上报事件
        647,//巡检比对身份识别上报事件
        648,//点火比对身份识别上报事件
        649,//离开返回比对身份识别上报事件
        664,//人证不符报警(平台) 报警参数参考636
        686,//动态查岗(平台)
        696,//驾驶员识别事件
        697,//刷脸签到身份识别上报事件  参考646报警的解析
        698,//动态查岗身份识别上报事件  参考646报警的解析
        // 699,//驾驶员身份比对结果上报
    ];
}

/**
 * 判断是否人脸识别报警
 * @param armType
 * @returns {boolean}
 */
function isFaceRecognitionClassifyAlarm(armType) {
    if (!armType) {
        return false;
    }
    var type = parseInt(armType);
    var arr = faceRecognitionClassifyAlarmTypes();
    return arr.indexOf(type) > -1;
}


/**
 * 转换成安全健康对于的报间类型(身份识别)
 * http://192.168.1.192:8989/web/#/1?page_id=1551
 * 类型+100000表示识别成功
 * 类型+200000表示识别失败
 * @param armType
 * @param alarmInfo
 * @returns {boolean}
 */
function changeFaceRecognitionClassifyAlarmType(armType, alarmInfo) {
    if (isFaceRecognitionClassifyAlarm(armType)) {
        // 1识别成功
        if (alarmInfo == 1) {
            armType = 100000 + parseInt(armType);
        } else {
            armType = 200000 + parseInt(armType);
        }
    }
    return armType;
}


/**
 * 拦截文件大小<br>
 * struts做了限制文件大小<br>
 * https://blog.csdn.net/netBananaHOT/article/details/43018353<br>
 * @param {string} id 元素id
 * @returns {bool}
 */
function interceptFileSize(id) {
    var fileInput = document.getElementById(id);
    if (!fileInput || !fileInput.files) {
        return false;
    }
    var files = fileInput.files;
    if (!files || files.length == 0) {
        return false;
    }
    for (var i = 0, j = files.length; i < j; i++) {
        if (files[i].size > 524288000) {
            return true;
        }
    }
    return false;
}


/**
 * 日期调整
 * @param s 秒
 * @returns {String}
 */
function secondsFormat(s) {
    var day = Math.floor(s / (24 * 3600)); // Math.floor()向下取整
    var hour = Math.floor((s - day * 24 * 3600) / 3600);
    var minute = Math.floor((s - day * 24 * 3600 - hour * 3600) / 60);
    var second = s - day * 24 * 3600 - hour * 3600 - minute * 60;
    var str = '';
    if (day > 0) {
        str += day + rootElement.lang.day;
    }
    if (hour > 0) {
        str += hour + rootElement.lang.hour;
    }
    if (minute > 0) {
        str += minute + rootElement.lang.minute;
    }
    if (second > 0) {
        str += second + rootElement.lang.second;
    }
    return str;
}


/**
 * 日期调整
 * @param s 秒
 * @returns {String}
 */
function secondsFormat2(s) {
    var day = Math.floor(s / (24 * 3600)); // Math.floor()向下取整
    var hour = Math.floor((s - day * 24 * 3600) / 3600);
    var minute = Math.floor((s - day * 24 * 3600 - hour * 3600) / 60);
    var second = s - day * 24 * 3600 - hour * 3600 - minute * 60;
    var str = '';
    if (day > 0) {
        str += day + rootElement.lang.day;
    }
    if (hour > 0) {
        str += hour + rootElement.lang.hour;
    }
    if (minute > 0) {
        str += minute + rootElement.lang.minute;
    }
    if (second > 0 && !str) {
        str += second + rootElement.lang.second;
    }
    return str;
}

/**
 * 验证IP地址或域名格式
 * @param value
 * @returns {boolean}
 */
function serviceAddressVerification(value) {
    return /^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])|(([a-zA-Z\d][a-zA-Z\d-_]+\.)+[a-zA-Z\d-_][^ ]*))$/.test(value)
}
