var rootElement = _getRootFrameElement();
$(function () {
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
function getBrowseVersion() {
    var userAgent = navigator.userAgent.toLowerCase();
    var browser = userAgent.match(/(firefox|chrome|safari|opera|msie)/);
    var browserId = "msie";
    var browserVersion = "";
    var isIE11 = (userAgent.toLowerCase().indexOf("trident") > -1 && userAgent.indexOf("rv") > -1);

    var ua = navigator.userAgent;
    var isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1; //android
    var isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios

    if (isAndroid) {
        return 'Android';
    }
    if (isiOS) {
        return 'ios';
    }

    if (isIE11) {
        browserId = "msie";
        browserVersion = "11.0";
    } else {
        if (browser.length >= 2) {
            browserId = browser[1];
        } else {
            browserId = "msie";
        }
        browserVersion = (userAgent.match(new RegExp('.+(?:version)[\/: ]([\\d.]+)')) || userAgent.match(new RegExp('(?:' + browserId + ')[\/: ]([\\d.]+)')) || [0, '0'])[1];
    }
    return browserId + browserVersion;
}

/**
 * 是否IE9以下 包含ie9
 */
function isBrowseIE9Fllow() {
    var version = getBrowseVersion();
    if (version.indexOf("msie") != -1) {
        version = Number(version.substring(4, version.length));
        if (version <= 9) {
            return true;
        } else {
            return false;
        }
    }
    return false;
}

//判断是否为ie5
function isBrowseIE5() {
    return (getBrowseVersion() == "msie5.5") ? true : false;
}

//判断是否为ie6
function isBrowseIE6() {
    return (getBrowseVersion() == "msie6.0") ? true : false;
}

//是否为IE7
function isBrowseIE7() {
    return (getBrowseVersion() == "msie7.0") ? true : false;
}

//是否为IE8
function isBrowseIE8() {
    return (getBrowseVersion() == "msie8.0") ? true : false;
}

//是否为IE9
function isBrowseIE9() {
    return (getBrowseVersion() == "msie9.0") ? true : false;
}

//是否为IE
function isBrowseIE() {
    return (getBrowseVersion().indexOf("msie") != -1) ? true : false;
}

//是否谷歌浏览器
function isBrowseGoogle() {
    return (navigator.userAgent.toLowerCase().match(/chrome/) != null) ? true : false;
}

//是否谷歌浏览器
function isBrowseChrome() {
    return (navigator.userAgent.toLowerCase().match(/chrome\/([\d.]+)/) != null) ? true : false;
}

//是否为Firefox
function isBrowseFirefox() {
    return (navigator.userAgent.toLowerCase().match(/firefox/) != null) ? true : false;
}

//是否为Safari
function isBrowseSafari() {
    return (navigator.userAgent.toLowerCase().match(/version\/([\d.]+).*safari/) != null) ? true : false;
}

//是否支持html5
//geolocation，它是HTML5新加支持的新特性；
//它是由HTML5工作组以外的Geolocation工作组制定的。要检查浏览器是否支持它可以用一下方法
function supportHtml5() {
    return !!navigator.geolocation;
}

//是否为移动端
function isMobile() {
    if (navigator.userAgent.match(/(iPhone|iPad|iPod|Android|ios)/i)) {
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


//获取Cookie的值数据
function getCookieVal(offset) {
    var endstr = document.cookie.indexOf(";", offset);
    if (endstr == -1)
        endstr = document.cookie.length;
    return unescape(document.cookie.substring(offset, endstr));
}

// 获取Cookie的参数值信息
// 页面级cookie缓存对象(可能问题，界面cookie修改以后，未能计算修改缓存对象的值)
var pageCookieCacheObject = {};

function GetCookie(name) {
    if (pageCookieCacheObject[name]) {
        return pageCookieCacheObject[name];
    }
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) {
        var j = i + alen;
        if (document.cookie.substring(i, j) == arg) {
            pageCookieCacheObject[name] = getCookieVal(j);
        }
        if (pageCookieCacheObject[name]) {
            return pageCookieCacheObject[name];
        }
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0)
            break;
    }
    return null;
}

//设置浏览器的Cookie参数
function SetCookie(name, value) {
    //判断为undefined
    if (typeof value == "undefined") {
        return;
    }
    //// 0、-0、 null、""、false、undefined 或者 NaN，那么if判断 false 其他为true
    if (!value && typeof value != "undefined" && value !== 0 && value !== "0") {
        return;
    }

    var argv = SetCookie.arguments;
    var argc = SetCookie.arguments.length;
    var expires = new Date();
    expires.setTime(expires.getTime() + (365 * 24 * 60 * 60 * 1000));

    var protocol = this.location.protocol;
    var path = (3 < argc) ? argv[3] : null;
    var domain = (4 < argc) ? argv[4] : null;
    var secure = (5 < argc) ? argv[5] : false;
    // if (protocol === 'https:') {
    //     secure = true;
    // }
    document.cookie = name + "=" + escape(value) +
        ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
        ((path == null) ? "" : ("; path=" + path)) +
        ((domain == null) ? "" : ("; domain=" + domain)) +
        ((secure == true) ? "; secure" : "");
    pageCookieCacheObject[name] = value;
}

/**
 * 删除cookie
 * @param name cookie的名称
 */
function delCookie(name) {
    setCookie(name, ' ', -1);
};

//设置浏览器Cookie参数失效
function SetCookieExpire(name) {
    var date = new Date();
    date.setTime(date.getTime() - 10000);
    document.cookie = name + "=;expires=" + date.toGMTString() + "; path=/";
}

//限制特殊字符
function specialChar(e) {
    var keynum = e.keyCode || e.which;
    if (keynum == 222 || keynum == 188 || keynum == 32
        || keynum == 109 || keynum == 107 || keynum == 189
        || keynum == 186 || keynum == 187 || keynum == 190
        || keynum == 192 || keynum == 191 || keynum == 220
        || keynum == 17 || keynum == 219 || keynum == 221) {
        return false;
    }

    if (e.shiftKey) {
        if ((keynum >= 48 && keynum <= 57) || keynum == 32
            || keynum == 187 || keynum == 109 || keynum == 107
            || keynum == 186 || keynum == 222 || keynum == 189
            || keynum == 190 || keynum == 219 || keynum == 221) {
            return false;
        }
    }

    return true;
}

//限制只输入数字
function onKeyDownDigit(myEvent) {
    var k;
    if (window.event)
        k = myEvent.keyCode;     //IE,chrome
    else
        k = myEvent.which;     //firefox

    if ((k == 46) || (k == 8) || (k == 9) || (k == 189) || (k == 109)
        || (k == 190) || (k == 110) || (k >= 48 && k <= 57)
        || (k >= 96 && k <= 105) || (k >= 37 && k <= 40)) {

    } else if (k == 13) {
//		将输入键转成tab键	
//		if (window.event)
//			myEvent.keyCode = 9;
//		else
//			myEvent.which = 9;
    } else {
        if (document.all)
            myEvent.returnValue = false; //ie
        else
            myEvent.preventDefault(); //ff
    }
}

//显示ajax加载动画
function showAjaxLoading(id, flag, showtext) {
    if (flag) {
        if (typeof showtext != "undefined" && showtext) {
            $(id).html("<img src='../images/loading.gif'/>" + rootElement.lang.loading);
        } else {
            $(id).html("<img src='../images/loading.gif'/>");
        }
    } else {
        $(id).text("");
    }
}

//显示ajax加载动画
function showAjaxSaving(id, flag, showtext) {
    if (flag) {
        if (typeof showtext != "undefined" && showtext) {
            $(id).html("<img src='../images/loading.gif'/>" + rootElement.lang.saving);
        } else {
            $(id).html("<img src='../images/loading.gif'/>");
        }
    } else {
        $(id).text("");
    }
}

//配置焦点和失去焦点的显示提示信息
function setInputFocusBuleTip(id, tip) {
    var temp = $(id).val();
    if (temp === "") {
        $(id).val(tip);
    }
    $(id).focus(function () {
        var user = $(id).val();
        if (user === tip) {
            $(id).val("");
        }
    });

    $(id).blur(function () {
        var user = $(id).val();
        if (user === "") {
            $(id).val(tip);
        }
    });
}

//判断ip地址是否有效  
function checkIPAddress(id, errId, tip, isMultiply) {
    var ip = $.trim($(id).val());
    var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;//正则表达式
    if (ip && ip.split(',').length > 0) {
        var ips = ip.split(',');
        for (var int = 0; int < ips.length; int++) {
            var curIp = ips[int];
            if (re.test(curIp)) {
                if (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256)
                    $(errId).text("*");
                return true;
            } else {
                // var doname = /^([\w-]+\.)+((com)|(net)|(org)|(gov\.cn)|(info)|(cc)|(com\.cn)|(net\.cn)|(org\.cn)|(name)|(biz)|(tv)|(cn)|(mobi)|(name)|(sh)|(ac)|   (io)|(tw)|(com\.tw)|(hk)|(com\.hk)|(ws)|(travel)|(us)|(tm)|(la)|(me\.uk)|(org\.uk)|(ltd\.uk)|(plc\.uk)|(in)|(eu)|(it)|(jp)|(pro))$/;
                //var flag_domain = doname.test(curIp);
                var flag_domain = curIp.indexOf(".");
                if (flag_domain != -1) {
                    $(errId).text("*");
                    return true;
                } else {
                    $(errId).text(tip);
                    return false;
                }
            }
        }
    } else {
        if (re.test(ip)) {
            if (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256)
                $(errId).text("*");
            return true;
        } else {
            // var doname = /^([\w-]+\.)+((com)|(net)|(org)|(gov\.cn)|(info)|(cc)|(com\.cn)|(net\.cn)|(org\.cn)|(name)|(biz)|(tv)|(cn)|(mobi)|(name)|(sh)|(ac)|   (io)|(tw)|(com\.tw)|(hk)|(com\.hk)|(ws)|(travel)|(us)|(tm)|(la)|(me\.uk)|(org\.uk)|(ltd\.uk)|(plc\.uk)|(in)|(eu)|(it)|(jp)|(pro))$/;
            // var flag_domain = doname.test(ip);
            var flag_domain = ip.indexOf(".");
            if (flag_domain) {
                $(errId).text("*");
                return true;
            } else {
                $(errId).text(tip);
                return false;
            }
        }
    }


}

function checkPortValid(id, errId, tip) {
    var port = $.trim($(id).val());
    if (port.indexOf(';') != -1) {
        port = port.split(';');
        for (var i = 0, len = port.length; i < len; i++) {
            var portNum = Number(port[i]);
            if (portNum === "" || portNum < 0 || portNum > 65535) {
                $(errId).text(tip);
                return false;
            }
        }
        $(errId).text("*");
        return true;
    } else {
        if (port === "" || port < 0 || port > 65535) {
            $(errId).text(tip);
            return false;
        } else {
            $(errId).text("*");
            return true;
        }
    }

}

//判断数字和字母
function checkDigitAlpha(id, errId, tipRequire, tipRegx, min) {
    var str = $.trim($(id).val());
    if (str === "") {
        $(errId).text(tipRequire);
        return false;
    }

    var re = /^[A-Za-z0-9]*$/;
    if (re.test(str) == false) {
        $(errId).text(tipRegx);
        return false;
    } else {
        if (typeof min != "undefined") {
            if (str.length < min) {
                $(errId).text(tipRegx);
                return false;
            }
        }

        $(errId).text("");
        return true;
    }
}

//判断数字和字母
function checkInput(id, errId, minlength, maxlength, tipRequire, tipRegx) {
    var str = $.trim($(id).val());
    if (str === "") {
        $(errId).text(tipRequire);
        return false;
    }

    var length = str.replace(/[^\x00-\xff]/g, "**").length;
    if (length < minlength || length > maxlength) {
        $(errId).text(tipRegx);
        return false;
    } else {
        $(errId).text("");
        return true;
    }
}

//判断两个输入框信息是否一致
function checkInputNotEqual(id1, id2, errId, tipErr) {
    var str1 = $.trim($(id1).val());
    var str2 = $.trim($(id2).val());
    if (str1 == str2) {
        $(errId).text(tipErr);
        return false;
    } else {
        return true;
    }
}

//判断输入信息不超过指定的范围
function checkInputRange(id, errId, min, max, tipErr) {
    var str = $.trim($(id).val());
    if (str == "") {
        $(errId).text(tipErr);
        return false;
    }

    var value = parseIntDecimal(str);
    if (value < min || value > max) {
        $(errId).text(tipErr);
        return false;
    } else {
        $(errId).text("");
        return true;
    }
}

//判断邮件地址
function checkEmailValid(id, errId, errtip) {
    var mail = $.trim($(id).val());
    if (mail != "") {
        var sReg = /[_a-zA-Z\d\-\.]+@[_a-zA-Z\d\-]+(\.[_a-zA-Z\d\-]+)+$/;
        if (!sReg.test(mail)) {
            $(errId).text(errtip);
            return false;
        }
    }

    $(errId).text("");
    return true;
}

//判断网址
function checkUrlValid(id, errId, errtip) {
    var url = $.trim($(id).val());
    if (url != "") {
        var sReg = /^[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
        if (!sReg.test(url)) {
            $(errId).text(errtip);
            return false;
        }
    }

    $(errId).text("");
    return true;
}

//检查密码，允许密码为空白字符
function checkPasswordInput(id, errId, emptyTip) {
    var pwd = $(id).val();
    if (pwd != "") {
        $(errId).text("");
        return true;
    } else {
        $(errId).text(emptyTip);
        return false;
    }
}

function checkConfirmPassword(pwdId, confirmId, errId, errTip) {
    var pwd1 = $(pwdId).val();
    var pwd2 = $(confirmId).val();
    if (pwd1 != "") {
        if (pwd1 != pwd2) {
            $(errId).text(errTip);
            return false;
        } else {
            if ($.trim(pwd2) && ($.trim(pwd2).length < 4 || $.trim(pwd2).length > 16)) {
                $(errId).text(rootElement.lang.passwordLimit);
                return false;
            } else {
                $(errId).text("*");
                return true;
            }
        }
    } else {
        $(errId).text("*");
        return false;
    }
}

//存在特殊字符返回true，否则返回false
function checkSpecialCharacters(str) {
    //var myReg = "[@/'\"#$%&^*]+,<>";
//	var myReg = "#$@%^&\\/:*?\"<>|,";
//	var reg = new RegExp(myReg);
    //var reg = /^[^@\/\'\\\"#$%&\^\*]+$,/;
    //var reg = /^[A-Za-z0-9]*$/;
    var reg = /[@#,|?<>":*\\\/\$%\^&\*]+/g;
    if (reg.test(str)) {
        //if(!reg.test(str))  {
        return true;
    } else {
        return false;
    }
}

//禁用或者启用输入框
function diableInput(id, disable, gray) {
    if (disable) {
        if (gray) {
            $(id).css({'color': 'gray'});
        }
        $(id).attr("readonly", "readonly");
        //$(id).attr({"disabled":"disabled"});
    } else {
        if (gray) {
            $(id).css({'color': '#000'});
        }
        $(id).removeAttr("readonly");
        //$(id).removeAttr("disabled");
    }
}

function disableButton(id, disable) {
    if (disable) {
        $(id).attr({"disabled": "disabled"});
    } else {
        $(id).removeAttr("disabled");
    }
}

//动态调整IFrame的高度
function dynIframeHeight(obj) {
    var win = obj;
    var height = 30;
    if (document.getElementById && win) {
        if (window.opera) {
            //Opera
            if (win.contentWindow.document && win.contentWindow.document.body.scrollHeight) {
                win.height = win.contentWindow.document.body.scrollHeight + height;
            }
        } else {
            if (win.contentDocument && win.contentDocument.body.offsetHeight) {
                //IE8����FireFox��Chrome
                win.height = win.contentDocument.body.offsetHeight + height;
            } else if (win.Document && win.Document.body.scrollHeight) {
                //IE7
                win.height = win.Document.body.scrollHeight + height;
            }
        }
    }
}

function pageWidth() {
    if ($.browser && $.browser.msie) {
        return document.compatMode == "CSS1Compat" ? getWindowWidth() :
            getWindowWidth();
    } else {
        return self.innerWidth;
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
    if (rootElement.myUserRole && rootElement.myUserRole.isPolice() && rootElement.isPoliceStyle) {
        suffix = '';
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

function showErrorMessage(result, resultTip) {
    if (typeof (resultTip) != "undefined" && resultTip != "") {
        // 公司限制数超限
        if (result === 83109) {
            $.dialog.tipDanger(rootElement.lang.maxVehicleNumErrorCode10.replace('{}', resultTip));
            return;
        }
        $.dialog.tipDanger(resultTip);
        return;
    }
    switch (result) {
        case 1:		//系统出现异常
            $.dialog.tipDanger(rootElement.lang.errException);
            break;
        case 2:		//会话已过期
            $.dialog.tipDanger(rootElement.lang.errSessionUnvalid);
            break;
        case 3:		//请求出现超时
            $.dialog.tipDanger(rootElement.lang.errTimeout);
            break;
        case 4:		//请求出现异常
            $.dialog.tipDanger(rootElement.lang.errExceptionRequire);
            break;
        case 5:		//请求出现异常
            $.dialog.tipDanger(rootElement.lang.errExceptionNetwork);
            break;
        case 6:		//时间格式不正确
            $.dialog.tipDanger(rootElement.lang.errQueryTimeFormat);
            break;
        case 7:		//开始时间不得大于结束时间
            $.dialog.tipDanger(rootElement.lang.errQueryTimeRange);
            break;
        case 8:		//RET_REQUIRE_PARAM = 8;		//请求参数有误
            $.dialog.tipDanger(rootElement.lang.errRequireParam);
            break;
        case 9:		//RET_SERVER_NO_EXIST = 9;	//服务器信息不存在
            $.dialog.tipDanger(rootElement.lang.errServerNoExist);
            break;
        case 10:	//RET_SERVER_TYPE_ERR = 10;	//服务器类型信息不正确
            $.dialog.tipDanger(rootElement.lang.errServerTypeErr);
            break;
        case 11:	//RET_IDNO_EXIST = 11;	//编号已经被使用
            $.dialog.tipDanger(rootElement.lang.errIDNOExist);
            break;
        case 12:	//RET_DEVICE_NO_EXIST = 12;		//设备信息不存在
            $.dialog.tipDanger(rootElement.lang.errDeviceNoExist);
            break;
        case 13:	//RET_DEVICE_LIMIT_ERR = 13;
            $.dialog.tipDanger(rootElement.lang.errDeviceLimitErr);
            break;
        case 14:	//RET_DEVICE_BATCH_IDNO_ERR = 14;	//设备编号后3位必须为数字，并且递增后还保持有效
            $.dialog.tipDanger(rootElement.lang.errDeviceBatchIdnoErr);
            break;
        case 15:	//RET_ACCOUNT_EXIST = 15; 账号已经被使用
            $.dialog.tipDanger(rootElement.lang.errAccountExist);
            break;
        case 16:	//RET_CLIENT_NO_EXIST = 16; 客户信息不存在
            $.dialog.tipDanger(rootElement.lang.errClientNoExist);
            break;
        case 17:	//RET_CLIENT_HAS_DEVICE = 17;	//客户还有设备信息！无法删除！
            $.dialog.tipDanger(rootElement.lang.errClientHasDevice);
            break;
        case 18:	//RET_CLIENT_HAS_USER = 18;	//客户还有子用户信息！无法删除！
            $.dialog.tipDanger(rootElement.lang.errClientHasUser);
            break;
        case 19:	//RET_OLD_PWD_ERROR = 19;	//旧密码有误！
            $.dialog.tipDanger(rootElement.lang.errOldPwd);
            break;
        case 20:	//RET_USER_NO_EXIST = 20;	//用户信息不存在
            $.dialog.tipDanger(rootElement.lang.errUserNoExist);
            break;
        case 21:	//RET_ROLE_NO_EXIST = 21;	//角色信息已经存在
            $.dialog.tipDanger(rootElement.lang.errRoleNoExist);
            break;
        case 22:	//RET_ROLE_NAME_EXIST = 22;	//角色名称已经被使用
            $.dialog.tipDanger(rootElement.lang.errRoleNameExist);
            break;
        case 23:	//RET_ROLE_HAS_USER = 23;	//还有用户使用此角色信息！无法删除！
            $.dialog.tipDanger(rootElement.lang.errRoleHasUsed);
            break;
        case 24:	//RET_NO_PRIVILIGE = 24;	//用户无权限
            $.dialog.tipDanger(rootElement.lang.errNoPrivilige);
            break;
        case 25:	//RET_VEHICLE_NO_EXIST = 25;	//车辆信息不存在
            $.dialog.tipDanger(rootElement.lang.errVehicelNoExist);
            break;
        case 26:	//RET_GROUP_NO_EXIST = 26;	//车辆分组不存在
            $.dialog.tipDanger(rootElement.lang.errGroupNoExist);
            break;
        case 27:	//RET_GROUP_HAS_USED = 27;	//车辆分组信息还在被占用（还存储子分组或者下级车辆）
            $.dialog.tipDanger(rootElement.lang.errGroupHasUsed);
            break;
        case 28:	//RET_DB_CONN_ERR = 28;	//数据库连接出现异常
            $.dialog.tipDanger(rootElement.lang.errDbConnErr);
            break;
        case 29:	//RET_NAME_EXIST = 29;	//名称已经被使用
            $.dialog.tipDanger(rootElement.lang.errNameExist);
            break;
        case 30:	//RET_NO_EXIST = 30;		//信息不存在
            $.dialog.tipDanger(rootElement.lang.errNoExist);
            break;
        case 31:	//RET_DOWN_STATION_SSID_EXIST = 31;		//下载站点SSID已经被使用
            $.dialog.tipDanger(rootElement.lang.errDownStationSsidExist);
            break;
        case 32:	//RET_DOWN_STATION_USED = 32;	//下载站点还被使用（拥有下载服务器信息）
            $.dialog.tipDanger(rootElement.lang.errDownStationUsed);
            break;
        case 33:	//RET_DOWN_STATION_NO_EXIST = 33;	//下载站点信息不存在
            $.dialog.tipDanger(rootElement.lang.errDownStationNoExist);
            break;
        case 34:	//RET_GROUP_NAME_USED = 34;	//同一分组下不允许存在相同名称的分组信息
            $.dialog.tipDanger(rootElement.lang.errGroupNameUsed);
            break;
        case 35:	//RET_DEVICE_HAS_REGISTER = 35;	//设备信息已经登记到系统中
            $.dialog.tipDanger(rootElement.lang.errDeviceHasRegister);
            break;
        case 36:	//RET_SERVER_NO_SUPPORT = 36;	//服务器不支持此功能
            $.dialog.tipDanger(rootElement.lang.errServerNoSupport);
            break;
        case 39:	//RET_DEVICE_IDNO_USED = 39;	//设备编号已经被使用
            $.dialog.tipDanger(rootElement.lang.errDeviceIdnoExists);
            break;
        case 41:	//RET_IMAGE_SIZE_ERR = 41;	//文件大小超过1M
            $.dialog.tipDanger(rootElement.lang.errImageSize);
            break;
        case 42:	//RET_IMAGE_TYPE_ERR = 42;	//文件格式错误
            $.dialog.tipDanger(rootElement.lang.errSImageType);
            break;
        case 45:	//RET_COMPANY_HAS_COMPANY = 45;	//公司还有子公司信息！无法删除！
            if (rootElement.myUserRole && rootElement.myUserRole.isChemicals()) {//危化管理
                $.dialog.tipDanger(rootElement.lang.info_used_cant_delete);
            } else {
                $.dialog.tipDanger(rootElement.lang.errCompanyHasCompany);
            }
            break;
        case 46:	//RET_USER_DISABLED = 46; //用户已停用
            $.dialog.tipDanger(rootElement.lang.errUserDeactivated);
            break;
        case 47:	//RET_INSTALLED = 47; //设备已安装
            $.dialog.tipDanger(rootElement.lang.errDeviceInstalled);
            break;
        case 48:	//RET_JOBNUM_EXIST = 48; //工号已存在
            $.dialog.tipDanger(rootElement.lang.errJobNumberExists);
            break;
        case 49:	//RET_SIMCARD_EXIST = 49; //SIM卡号已存在
            $.dialog.tipDanger(rootElement.lang.errSIMCardExists);
            break;
        case 50:	//RET_VEHITEAM_NOT_MOVE = 50; //车队不能移动到父公司
            $.dialog.tipDanger(rootElement.lang.errVehiTeamNotMove);
            break;
        case 51:	//RET_RULE_EXIST = 51; //规则已存在
            $.dialog.tipDanger(rootElement.lang.errRuleExists);
            break;
        case 52:	//RET_TYPE_EXIST = 52; //类型已存在
            $.dialog.tipDanger(rootElement.lang.errTypeExists);
            break;
        case 53:	//RET_BRAND_EXIST = 52; //类型已存在
            $.dialog.tipDanger(rootElement.lang.errBrandExists);
            break;
        case 54:	//RET_DEVICE_USED = 54; //设备已被使用
            $.dialog.tipDanger(rootElement.lang.errDeviceUsed);
            break;
        case 55:	//RET_MARK_NAME_USED = 55; //标记名称已被使用
            $.dialog.tipDanger(rootElement.lang.errMarkNameUsed);
            break;
        case 56:	//RET_MARK_USED = 56; //标记已被使用
            $.dialog.tipDanger(rootElement.lang.errMarkUsed);
            break;
        case 57:	//RET_USER_RESPONSE_ERR = 57; //用户请求异常
            $.dialog.tipDanger(rootElement.lang.usersRequestFails);
            break;
        case 58:	//RET_DOWNLOADTASK_EXIST = 58; //下载任务已存在
            $.dialog.tipDanger(rootElement.lang.errDownloadTaskExists);
            break;
        case 59:	//RET_DEVICE_OFFLINE = 59;  //设备不在线
            $.dialog.tipDanger(rootElement.lang.video_not_online);
            break;
        case 60:	//RET_MEDIA_ADDRESS_ERR = 60;  //流媒体地址请求失败
            $.dialog.tipDanger(rootElement.lang.media_address_err);
            break;
        case 61:	//RET_SAFE_EXIST = 61;  //车辆已存在保险信息
            $.dialog.tipDanger(rootElement.lang.safe_excit_err);
            break;
        case 62:	//RET_LINE_NOT_EXIST = 62;  //线路信息不存在
            $.dialog.tipDanger(rootElement.lang.errLineInfoNotExists);
            break;
        case 63:	//RET_LINE_NAME_ERR = 63;  //导入线路错误
            $.dialog.tipDanger(rootElement.lang.errImportLineInfo);
            break;
        case 64:	//RET_LINE_HAS_VEHICLE = 64;  //线路下还有车辆，不能删除
            $.dialog.tipDanger(rootElement.lang.errLineHasVehicle);
            break;
        case 65:	//RET_ICCARDNUM_EXIST = 65; //IC卡已存在
            $.dialog.tipDanger(rootElement.lang.errIcCardExists);
            break;
        case 66:	//RET_PROGRAM_EXIST = 66; //方案已存在
            $.dialog.tipDanger(rootElement.lang.errProgramExists);
            break;
        case 67:	//RET_STAFFREST_EXIST = 67; //员工公休方案已存在
            $.dialog.tipDanger(rootElement.lang.errStaffRestExists);
            break;
        case 68:	//RET_BUSSCHEDULING_EXIST = 68; //公交排班信息已存在
            $.dialog.tipDanger(rootElement.lang.errBusSchedulingExists);
            break;
        case 69:	//RET_TEACHER_USED= 69;	//教师还在使用，不能删除
            $.dialog.tipDanger(rootElement.lang.errTeacherUsed);
            break;
        case 70:	//RET_TEACHER_EXIST= 70;	//此教师工号已存在
            $.dialog.tipDanger(rootElement.lang.errJobNumExists);
            break;
        case 71:	//RET_CLASS_USED= 71;	//班级还在使用，不能删除
            $.dialog.tipDanger(rootElement.lang.errClassUsed);
            break;
        case 72:	//RET_CLASS_EXIST= 72;	//此班级已存在
            $.dialog.tipDanger(rootElement.lang.errClassExists);
            break;
        case 73:	//RET_STUDENT_EXIST= 73;	//此学生学号已存在
            $.dialog.tipDanger(rootElement.lang.errStudentNumExists);
            break;
        case 74:	//RET_STUDENT_NUM= 74;	//超出车辆所能容纳学生数
            $.dialog.tipDanger(rootElement.lang.errMoreThanTheVehiSeats);
            break;
        case 75:	//RET_HANDING_EXIST= 75;	//装卸点已存在
            $.dialog.tipDanger(rootElement.lang.errPointsExists);
            break;
        case 76:	//RET_STUDENT_INFO_ERROR= 76;	//学生信息不正确
            $.dialog.tipDanger(rootElement.lang.errStudentInformation);
            break;
        case 77:	//RET_WECHATSTURELATION_EXIST= 77;	//账号已绑定学生
            $.dialog.tipDanger(rootElement.lang.errBoundStudent);
            break;
        case 78:	//RET_WECHATSTURELATION_NOTEXIST= 78;	//账号未绑定学生
            $.dialog.tipDanger(rootElement.lang.errUnboundStudent);
            break;
        case 79:	//RET_STUVEHIRELATION_NOTEXIST= 79;	//学生未分配车辆
            $.dialog.tipDanger(rootElement.lang.errStudentUnassigned);
            break;
        case 80:	//RET_SORT_USED= 80;	//类项已使用
            $.dialog.tipDanger(rootElement.lang.class_used);
            break;
        case 81:	//RET_USED= 81;	//信息还被使用
            $.dialog.tipDanger(rootElement.lang.Information_has_been_used);
            break;
        case 82:	//RET_EXIST= 82;	//信息已经存在
            $.dialog.tipDanger(rootElement.lang.info_exist);
            break;
        case 84:	//RET_VEHICLE_IN_LINE= 84;	//车辆已分配到线路下
            $.dialog.tipDanger(rootElement.lang.vehicle_been_to_line);
            break;
        case 86:	//RET_NOT_EDIT_DEVICETYPE = 86;	//车辆存在两个设备，不能修改设备类型
            $.dialog.tipDanger(rootElement.lang.errorEditDeviceType);
            break;
        case 88:	//Channel_Cannot_Modified= 88;	//无法修改通道信息
            $.dialog.tipDanger(rootElement.lang.channel_Cannot_Modified);
            break;
        case 89:
            $.dialog.tipDanger(rootElement.lang.department_exist);
            break;
        case 90:
            $.dialog.tipDanger(rootElement.lang.department_have_people);
            break;
        case 91:
            $.dialog.tipDanger(rootElement.lang.department_name_exist);
            break;
        case 93:	//RET_DISPACTH_ERROR 93;	//调度员账号相关操作数据库出现异常
            $.dialog.tipDanger(rootElement.lang.dispatch_user_error);
            break;
        case 94:	//RET_DISPACTH_ERROR 93;	//调度员账号相关操作数据库出现异常
            $.dialog.tipDanger(rootElement.lang.password_no_change);
            break;
        case 95:	//RET_DISPACTH_ERROR 95;	//旧密码错误
            $.dialog.tipDanger(rootElement.lang.old_password_err);
            break;
        case 96:	//RET_REGION_CODE_EXIST 96;	//行政区域编码已经被使用
            $.dialog.tipDanger(rootElement.lang.errRegionCodeExist);
            break;
        case 97:	//RET_REGION_TOP_EXIST 97;	//已存在顶级行政区域
            $.dialog.tipDanger(rootElement.lang.errRegionTopExist);
            break;
        case 98:	//ASSESSMENT_ITEMS_EXIST 98;	//考评项目已被使用,不能删除!
            $.dialog.tipDanger(rootElement.lang.ASSESSMENT_ITEMS_EXIST);
            break;
        case 99:	//CALL_STATION_NUM_EXIST = 99;  //电召站编号已存在!
            $.dialog.tipDanger(rootElement.lang.Call_station_number_already_exists);
            break;
        case 106:	//THE_PHONE_NUMBER_ALREADY_EXISTS = 106;  //电话号码已经存在!
            $.dialog.tipDanger(rootElement.lang.The_phone_number_already_exists);
            break;
        case 107:	//REGULATORY_AUTHORITIES_EXISS = 107;  //审批流程中存在该部门，不能删除!
            $.dialog.tipDanger(rootElement.lang.The_department_exists_in_the_approval_process);
            break;
        case 108:	//EXISTING_ABSORPTION_FIELD_IN_USE = 108;  //存在使用中的消纳场,无法删除!
            $.dialog.tipDanger(rootElement.lang.Existing_absorption_field_in_use);
            break;
        case 109:	//APPROVAL_INFORMATION_CHANGES = 109;  //审批信息发生改变，请重新操作!
            $.dialog.tipDanger(rootElement.lang.Approval_information_changes);
            break;
        case 110:	//DATA_DOES_NOT_MATCH_THE_PROTOCOL = 110;  //数据与协议不匹配!
            $.dialog.tipDanger(rootElement.lang.Data_does_not_match_the_protocol);
            break;
        case 111:	//THE_SCORE_INTERVAL_CANNOT_OVERLAP = 111;  //分值区间不能重叠!
            $.dialog.tipDanger(rootElement.lang.The_score_interval_cannot_overlap);
            break;
        case 115:	//NOT_FOUND_EVALUATION_RESULT = 115;  //NOT_FOUND_EVALUATION_RESULT!
            $.dialog.tipDanger(rootElement.lang.The_evaluation_result_was_not_found);
            break;
        case 114:	//编码已存在
            $.dialog.tipDanger(rootElement.lang.code_exist);
            break;
        case 100:	//RET_DISPACTH_ERROR 93;	//调度员账号相关操作数据库出现异常
            $.dialog.tipDanger(rootElement.lang.unable_recognize_face);
            break;
        case 101:	//RET_DISPACTH_ERROR 93;	//调度员账号相关操作数据库出现异常
            $.dialog.tipDanger(rootElement.lang.failed_enter_photo);
            break;
        case 102:	//密码强度较低
            $.dialog.tipDanger(rootElement.lang.password_simple);
            break;
        case 103:	//姓名已经存在
            $.dialog.tipDanger(rootElement.lang.name_existed);
            break;
        case 105:	//用户超过最大同时在线数
            $.dialog.tipDanger(rootElement.lang.userLoginUpperNumber);
            break;
        case 112:	//该报警已提交申诉，不能修改
            $.dialog.tipDanger(rootElement.lang.not_edit_appeal_alarm);
            break;
        case 117:	//一个学生最大只能绑定三个家长
            $.dialog.tipDanger(rootElement.lang.one_student_max_three_parent);
            break;
        case 118:	//家长姓名不能相同
            $.dialog.tipDanger(rootElement.lang.not_same_parent);
            break;
        case 500:	//RET_DISPACTH_ERROR 93;	//普通用户移动车队车队下有未授权的车辆
            $.dialog.tipDanger(rootElement.lang.normal_user_move_team);
            break;
        case 201:	//订制停运上报重复
            $.dialog.tipDanger(rootElement.lang.run_stop_repeat);
            break;
        case 202:	//停运撤销失败
            $.dialog.tipDanger(rootElement.lang.revokeError);
            break;
        case 203:	//车辆使用状态异常
            $.dialog.tipDanger(rootElement.lang.unStatus);
            break;
        case 204:	//车辆已过期
            $.dialog.tipDanger(rootElement.lang.service_period);
            break;
        case 205:	//围栏线路重复
            $.dialog.tipDanger(rootElement.lang.fence_line_repeat);
            break;
        case 206:	//围栏线路已使用
            $.dialog.tipDanger(rootElement.lang.fence_line_useing);
            break;
        case 207:	//协同小组成员只能为具有集群调度功能的设备
            $.dialog.tipDanger(rootElement.lang.groupNeedDispatch);
            break;
        case 208:	//平台id 唯一校验错误
            $.dialog.tipDanger(rootElement.lang.centerIdRepeat);
            break;
        case 209:	//不存在行政区域
            $.dialog.tipDanger(rootElement.lang.not_exist_region);
            break;
        case 210:	//非法访问HTML
            $.dialog.tipDanger(rootElement.lang.IllegalAccessToHTML);
            break;
        case 211:	//车牌号不允许登录
            $.dialog.tipDanger(rootElement.lang.license_plater_number_not_allow_login);
            break;
        case 212:	//用户信息已存在
            $.dialog.tipDanger(rootElement.lang.accountInfoExists);
            break;
        case 213:	//车辆状态异常
            $.dialog.tipDanger(rootElement.lang.vehicleStatusAbnormal);
            break;
        case 214:	//存在未执行的升级任务
            $.dialog.tipDanger(rootElement.lang.unexecutedupgradetask);
            break;
        case 215:	//短信发送失败
            $.dialog.tipDanger(rootElement.lang.smsCodeSendFail);
            break;
        case 216:	//短信验证码不匹配
            $.dialog.tipDanger(rootElement.lang.smsCodeNotMatch);
            break;
        case 217:
            // 没有选择规则
            $.dialog.tipDanger(rootElement.lang.rule_ruleNotSelected);
            break;
        case 218:
            //  运营商名称
            $.dialog.tipDanger(rootElement.lang.operatorName_error);
            break;
        case 219:
            //  不能同时拥有申诉和审核权限
            $.dialog.tipDanger(rootElement.lang.not_have_shensu_shenhe);
            break;

        case 83100:
            $.dialog.tipDanger(rootElement.lang.exceedMaxVehicleNum);
            break;
        case 831001:
            $.dialog.tipDanger(rootElement.lang.exceedMaxVehicleNumAdmin);
            break;
        case 83101:
            $.dialog.tipDanger(rootElement.lang.maxVehicleNumErrorCode1);
            break;
        case 83102:
            $.dialog.tipDanger(rootElement.lang.maxVehicleNumErrorCode2);
            break;
        case 83103:
            $.dialog.tipDanger(rootElement.lang.maxVehicleNumErrorCode3);
            break;
        case 83104:
            $.dialog.tipDanger(rootElement.lang.maxVehicleNumErrorCode4);
            break;
        case 83105:
            $.dialog.tipDanger(rootElement.lang.maxVehicleNumErrorCode5);
            break;
        case 83106:
            $.dialog.tipDanger(rootElement.lang.maxVehicleNumErrorCode6);
            break;
        case 61000:
            $.dialog.tipDanger(rootElement.lang.emailSubscriptionsAccountRepeat)
            break;
        case 100301:
            $.dialog.tipDanger(rootElement.lang.The_evaluation_result_already_exists)
            break;
        case 250001:
            $.dialog.tipDanger(rootElement.lang.plan_is_start_or_end)
            break;
        case 250002:
            $.dialog.tipDanger(rootElement.lang.revoke_publish_need_dismiss_bind)
            break;
        case 250021:
            $.dialog.tipDanger(rootElement.lang.course_time_big_plan)
            break;
        case 260001:
            $.dialog.tipDanger(rootElement.lang.duplicateName)
            break;
        case 270001:
            $.dialog.tipDanger(rootElement.lang.alarm_exceed_48hour)
            break;
        case 270002:
            $.dialog.tipDanger(rootElement.lang.appeal_exceed_24hour)
            break;
        case 270003:
            $.dialog.tipDanger(rootElement.lang.appeal_is_exist)
            break;
        case 270004:
            $.dialog.tipDanger(rootElement.lang.audit_is_exist)
            break;
        case 270005:
            $.dialog.tipDanger(rootElement.lang.alarm_is_handle)
            break;
        case 250019:
            $.dialog.tipDanger(rootElement.lang.plan_start_not_unbind_course)
            break;
        case 250020:
            $.dialog.tipDanger(rootElement.lang.plan_start_not_unbindorbind_course)
            break;
        case 280001:
            $.dialog.tipDanger(rootElement.lang.subdirectories_exist)
            break;
        case 280002:
            $.dialog.tipDanger(rootElement.lang.file_exists)
            break;
        case 215019:
            $.dialog.tipDanger(rootElement.lang.old_password_err)
            break;
        case 300001:
            $.dialog.tipDanger(rootElement.lang.push_interface_error)
            break;
        case 300002:
            $.dialog.tipDanger(rootElement.lang.query_interface_error)
            break;
        case 310001:
            $.dialog.tipDanger(rootElement.lang.hava_lower_level_region)
            break;
        case 310002:
            $.dialog.tipDanger(rootElement.lang.region_code_error)
            break;
        case 310003:
            $.dialog.tipDanger(rootElement.lang.region_name_repeat)
            break;
        case 320001:
            $.dialog.tipDanger(rootElement.lang.not_have_shensu_shenhe)
            break;
        case 113:	//RET_SIM_INSTALLED = 113; //sim卡已安装
            $.dialog.tipDanger(rootElement.lang.errSimInstalled);
            break;
        default:	//未知错误
            $.dialog.tipDanger(rootElement.lang.errUnkown);
            break;
    }
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

/**
 * 设置是否全选或者不选
 * @return {TypeName}
 */
function onSelectedAll(id, allId) {
    if ($("#" + allId).attr("checked")) {
        $("[name='" + id + "']").attr("checked", 'true');//全选
        $(".bDiv").find("table tr").addClass("trSelected");
    } else {
        $("[name='" + id + "']").removeAttr("checked");//取消全选
        $(".bDiv").find("table tr").removeClass("trSelected");
    }
}

//选中单个结点
function onSelectedItem(id, allId) {
    var checkAll = true;
    $("[name='" + id + "']").each(function () {
        if ($(this).val() != "" && !$(this).attr("checked")) {
            checkAll = false;
        }
    });

    if (checkAll) {
        $("#" + allId).attr("checked", true);
    } else {
        $("#" + allId).removeAttr("checked");
    }
}

//取得选中的结点信息，返回数据
function getSelectItem(id) {
    var select = [];
    $("[name='" + id + "']").each(function () {
        if ($(this).val() != "" && $(this).attr("checked")) {
            select.push($(this).val());
        }
    });
    return select;
}

function getPageSize() {
    var scrW, scrH;
    if (window.innerHeight && window.scrollMaxY) {
        // Mozilla
        scrW = window.innerWidth + window.scrollMaxX;
        scrH = window.innerHeight + window.scrollMaxY;
    } else if (document.body.scrollHeight > document.body.offsetHeight) {
        // all but IE Mac
        scrW = document.body.scrollWidth;
        scrH = document.body.scrollHeight;
    } else if (document.body) { // IE Mac
        scrW = document.body.offsetWidth;
        scrH = document.body.offsetHeight;
    }

    var winW, winH;
    if (window.innerHeight) { // all except IE
        winW = window.innerWidth;
        winH = window.innerHeight;
    } else if (document.documentElement && getWindowHeight()) {
        // IE 6 Strict Mode
        winW = getWindowWidth();
        winH = getWindowHeight();
    } else if (document.body) { // other
        winW = getWindowWidth();
        winH = getWindowHeight();
    }

    // for small pages with total size less then the viewport
    var pageW = (scrW < winW) ? winW : scrW;
    var pageH = (scrH < winH) ? winH : scrH;

    return {PageW: pageW, PageH: pageH, WinW: winW, WinH: winH};
}

function getPageScroll() {
    var x, y;
    if (window.pageYOffset) {
        // all except IE
        y = window.pageYOffset;
        x = window.pageXOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) {
        // IE 6 Strict
        y = document.documentElement.scrollTop;
        x = document.documentElement.scrollLeft;
    } else if (document.body) {
        // all other IE
        y = document.body.scrollTop;
        x = document.body.scrollLeft;
    }
    return {X: x, Y: y};
}

function append2Table(tableId, k, row) {
    var temp;
    if ((k % 2) == 1) {
        temp = "<tr id=\"tableTop_" + k + "\" class=\"tabdata\">" + row.html() + "</tr>";
    } else {
        temp = "<tr id=\"tableTop_" + k + "\" class=\"tabdata bluebg\">" + row.html() + "</tr>";
    }
    $(tableId).append(temp);
}

function append2TableEx(tableId, k, row, id) {
    var temp;
    if ((k % 2) == 1) {
        temp = "<tr id=\"tableTop_" + id + "\" class=\"tabdata\">" + row.html() + "</tr>";
    } else {
        temp = "<tr id=\"tableTop_" + id + "\" class=\"tabdata bluebg\">" + row.html() + "</tr>";
    }
    $(tableId).append(temp);
}

// hide flexigrid table col
function hideTableCol(col) {
    var colName = '.' + col;
    $('.hDiv ' + colName).hide();
    $('.bDiv ' + colName).hide();
}

function showTableCol() {
    var colName = '.' + col;
    $('.hDiv ' + colName).show();
    $('.bDiv ' + colName).show();
}

function hideTableColList(list) {
    setTimeout(function () {
        if (typeof list == 'object' && list.length > 0) {
            for (var i = 0; i < list.length; i++) {
                hideTableCol(list[i]);
            }
        }
    }, 500);
}

/**
 * 隐藏表格列
 * @param line
 */
function hideThLine(line) {
    setTimeout(function () {
        $('.th-' + line).hide();
        $('.td-' + line).hide();
    }, 256);
}

function hideThLineList(listObj) {
    setTimeout(function () {
        if (typeof listObj == 'object' && listObj.length > 0) {
            for (var i = 0; i < listObj.length; i++) {
                $('.th-' + listObj[i]).hide();
                $('.td-' + listObj[i]).hide();
            }
        }
    }, 256);
}

function getAlarmTypeString(armType) {
    var ret = "";
    switch (parseInt(armType)) {
        case 2:
            ret = rootElement.lang.alarm_type_ungency_button;
            break;
        case 3:
            ret = rootElement.lang.alarm_type_shake;
            break;
        case 4:
            ret = rootElement.lang.alarm_type_video_lost;
            break;
        case 6:
            ret = rootElement.lang.alarm_type_door_open_lawless;
            break;
        case 9:
            ret = rootElement.lang.alarm_type_temperator;
            break;
        case 10:
            ret = rootElement.lang.alarm_type_disk_error;
            break;
        case 11:
            ret = rootElement.lang.alarm_type_overspeed;
            break;
        case 14:
            ret = rootElement.lang.alarm_type_park_too_long;
            break;
        case 15:
            ret = rootElement.lang.alarm_type_motion;
            break;
        case 18:
            ret = rootElement.lang.alarm_type_gps_signal_loss;
            break;
        case 19:
            ret = rootElement.lang.alarm_type_io1;
            break;
        case 20:
            ret = rootElement.lang.alarm_type_io2;
            break;
        case 21:
            ret = rootElement.lang.alarm_type_io3;
            break;
        case 22:
            ret = rootElement.lang.alarm_type_io4;
            break;
        case 23:
            ret = rootElement.lang.alarm_type_io5;
            break;
        case 24:
            ret = rootElement.lang.alarm_type_io6;
            break;
        case 25:
            ret = rootElement.lang.alarm_type_io7;
            break;
        case 26:
            ret = rootElement.lang.alarm_type_io8;
            break;
        case 27:
            ret = rootElement.lang.alarm_type_fence_in;
            break;
        case 28:
            ret = rootElement.lang.alarm_type_fence_out;
            break;
        case 29:
            ret = rootElement.lang.alarm_type_fence_in_overspeed;
            break;
        case 30:
            ret = rootElement.lang.alarm_type_fence_out_overspeed;
            break;
        case 31:
            ret = rootElement.lang.alarm_type_fence_in_lowspeed;
            break;
        case 32:
            ret = rootElement.lang.alarm_type_fence_out_lowspeed;
            break;
        case 33:
            ret = rootElement.lang.alarm_type_fence_in_stop;
            break;
        case 34:
            ret = rootElement.lang.alarm_type_fence_out_stop;
            break;
        case 113:
            ret = rootElement.lang.alarm_type_custom;
            break;
        case 67:
            ret = rootElement.lang.alarm_type_offline;
            break;
        default:	//未知错误
            ret = rootElement.lang.alarm_type_unkown;
            break;
    }
    return ret;
}

function GetElementsByName(tag, name) {
    var elem = document.getElementsByTagName(tag);
    var arr = [];
    var index = 0;
    var l = elem.length;
    for (var i = 0; i < l; i++) {
        var att = elem[i].getAttribute("name");
        if (att == name) {
            arr[index++] = elem[i];
        }
    }
    return arr;
}

//js获取项目根路径，如： http://localhost:8083/xx
function getRootPath() {
//获取当前网址，如： http://localhost:8083/xx/xx/xx.jsp
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录，如： xx/xx/xx.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht = curWwwPath.substring(0, pos);
    //获取带"/"的项目名，如：/xx
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    return localhostPaht;
}

//设置null=''
function changeNull(param) {
    return param == null ? '' : param;
}

//设置null=0
function changeZero(param) {
    return !param ? 0 : param;
}

//设置null=''
function changeAllNull(param) {
    return param == null || isNaN(param) || param == undefined ? '' : param;
}

/**
 * 判断字符串str是否包含在本字符串中
 * @param str
 * @returns {Boolean}
 */
String.prototype.indexOfNotCase = function (str) {
    return this.toLowerCase().indexOf(str.toLowerCase());
}


//用于隔天查询提示   当天不能查询  日报表隔天查询
function cheackDate(beginTime, endTime) {
    if (dateIsValidDate(beginTime) && dateIsValidDate(endTime)) {//日报表需要提示隔天查询不能查询当天的记录
        var cur = dateCurrentDateString();//获取当天日期  2012-01-11
        if (dateCompareStrDate(cur, beginTime) != 1 || dateCompareStrDate(cur, endTime) != 1) {
            $.dialog.tips(rootElement.lang.tipDailyReport);//默认1.5秒
            return true;
        }
    }
    return false;
}

//用于隔天查询提示   当天不能查询  日报表隔天查询 不提示
function cheackDateEx(beginTime, endTime) {
    if (dateIsValidDate(beginTime) && dateIsValidDate(endTime)) {//日报表需要提示隔天查询不能查询当天的记录
        var cur = dateCurrentDateString();//获取当天日期  2012-01-11
        if (dateCompareStrDate(cur, beginTime) != 1 || dateCompareStrDate(cur, endTime) != 1) {
            return true;
        }
    }
    return false;
}

var marker_ = null;

//检查是否生产完成
function checkFileDownload(marker, callback) {
    if (marker) { // 如果marker存在，给内部变量赋值
        marker_ = marker;
    }
    $.myajax.jsonGet("StandardReportLiChengAction_checkFileDownload.action?marker=" + marker_, function (json, action, success) {
        if (success) {
            if (json.isLoadSuc) {
                if (typeof callback == 'function') {
                    callback(marker_);
                } else {
                    fileDownload(marker_);
                }
            } else {
                setTimeout(checkFileDownload, 10000);
            }
        } else {
            $('body').flexShowLoading(false);
        }
    }, null);
}

//下载文件
function fileDownload(_marker) {
    document.reportForm.action = "StandardReportLiChengAction_fileDownload.action?marker=" + _marker;
    document.reportForm.submit();
    $('body').flexShowLoading(false);
}


//动态加载js
function loadJS(id, url) {
    var xmlHttp = null;
    if (window.ActiveXObject)//IE
    {
        try {
            //IE6以及以后版本中可以使用
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            //IE5.5以及以后版本可以使用
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
    } else if (window.XMLHttpRequest)//Firefox，Opera 8.0+，Safari，Chrome
    {
        xmlHttp = new XMLHttpRequest();
    }
    //采用同步加载
    xmlHttp.open("GET", url, false);
    //发送同步请求，如果浏览器为Chrome或Opera，必须发布后才能运行，不然会报错
    xmlHttp.send(null);
    //4代表数据发送完毕
    if (xmlHttp.readyState == 4) {
        //0为访问的本地，200到300代表访问服务器成功，304代表没做修改访问的是缓存
        if ((xmlHttp.status >= 200 && xmlHttp.status < 300) || xmlHttp.status == 0 || xmlHttp.status == 304) {
            var myHead = document.getElementsByTagName("HEAD").item(0);
            var myScript = document.createElement("script");
            myScript.language = "javascript";
            myScript.type = "text/javascript";
            myScript.id = id;
            try {
                //IE8以及以下不支持这种方式，需要通过text属性来设置
                myScript.appendChild(document.createTextNode(xmlHttp.responseText));
            } catch (ex) {
                myScript.text = xmlHttp.responseText;
            }
            myHead.appendChild(myScript);
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

/**
 * 证据页面
 * @param guid
 * @param alarmType
 * @param armStartTime
 */
function detal(guid, alarmType, armStartTime) {
    if (guid && alarmType && armStartTime) {
//		var url = '../EvidenceManagement/index.html?guid='+guid+"&alarmType="+alarmType+"&armStartTime="+dateFormat2TimeString(new Date(armStartTime))+"&lang="+GetCookie("language")+"&mapType="+ rootElement.mapType;;
//		window.open(url);
        var url = 'EvidenceManagement/new.html?guid=' + guid + "&alarmType=" + alarmType + "&armStartTime=" + dateFormat2TimeString(new Date(armStartTime)) + "&lang=" + GetCookie("language") + "&mapType=" + rootElement.mapType;
        ;
        var dialog_ = $.dialog({
            id: 'evidenceManagement', title: rootElement.lang.subiao_safety, content: 'url:' + url,
            width: '1020px', height: '540px', min: false, max: false, lock: true
        });
        //dialog_.max();
    }
}

function doExitEvidenceManagement() {
    $.dialog({id: 'evidenceManagement'}).close();
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
        $.dialog.tipDanger('Your browser does not support WebStorage');
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
        $.dialog.tipDanger('Your browser does not support WebStorage');
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
 * 时间秒数转换为时分秒
 */
function getTimeDifference(second) {
    var difValue = "";
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
 * 对象数组排序
 * @param property
 * @returns {function(*, *): number}
 */
function compareObjArr(property) {
    return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
    }
}

function getVehiGroupId(treeGroupId) {
    var group = treeGroupId.split("_");
    return parseIntDecimal(group[1]);
};

function getTreeGroupId(vehiGroupId) {
    return "*_" + vehiGroupId;
};


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
    elementById = document.getElementById('ttx_flash_checker_a');

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

    if (elementById) {//如果存在了
//    	elementById.style.visibility ='hidden';
    } else {
        var elementById = document.createElement("a");
        elementById.style.height = '100%';
        elementById.style.width = '100%';
        elementById.style.position = 'fixed';
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

function isNotNull(str) {
    if (str != null && str != "" && str != undefined) {
        return true;
    }
    return false;
}

//废土类别
function getWastelandCategory() {
    var Category = [];
    Category.push({id: 1, name: rootElement.lang.silt});
    Category.push({id: 2, name: rootElement.lang.Secondary_decoration_garbage});
    Category.push({id: 3, name: rootElement.lang.construction_rubbish});
    Category.push({id: 4, name: rootElement.lang.Refillable_spoil});
    Category.push({id: 5, name: rootElement.lang.Sandstone});
    Category.push({id: 6, name: rootElement.lang.mud});
    Category.push({id: 7, name: rootElement.lang.Coal_mine});
    Category.push({id: 8, name: rootElement.lang.Mountain_soil});
    Category.push({id: 9, name: rootElement.lang.other});

    return Category;
}

/**
 * yes no
 */
function getYseNoArr() {
    var yesNo = [];
    yesNo.push({id: 0, name: rootElement.lang.no});
    yesNo.push({id: 1, name: rootElement.lang.yes});
    return yesNo;
}

/**
 * 校验邮箱
 * @param address
 * @returns {boolean}
 */
function checkMail(address) {
    if (!address) {
        return false;
    }
    var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return reg.test(address);
}

/**
 * 判断是否拥有此标示位
 * @param markBit
 * @param status
 * @returns {boolean}
 */
function isHaveBitMark(markBit, status) {
    if (!status) {
        return false;
    }
    return ((status >> markBit) & 1) > 0;
}

/**
 * 添加某个标示位
 * @param markBit
 * @param status
 * @returns {number}
 */
function addBitMark(markBit, status) {
    if (!markBit) {
        markBit = 0;
    }
    if (!status) {
        status = 0;
    }
    var power = 1 << markBit;
    return status | power;
}
/**
 * 判断是否拥有此标示位
 * @param markBitString
 * @param status
 * @returns {boolean}
 */
function isHaveBitStringMark(status, markBitString) {
    if (!status && status != 0) {
        return false;
    }
    if (markBitString.length <= status) {
        return false;
    }
    return markBitString.charAt(status) && markBitString.charAt(status) == "1";
}
/**
 * 删除某个标示位
 * @param markBit
 * @param status
 * @returns {number|*}
 */
function deleteBitMark(markBit, status) {
    if (!markBit) {
        markBit = 0;
    }
    if (!status) {
        status = 0;
    }
    var power = 1 << markBit;
    return status & (~power);
}


/**
 * String.substr() bug fix
 * @param start
 * @param len
 * @returns
 */
String.prototype.substr = function (start, len) {
    var str = this;
    var l = str.length;
    if (start >= l)
        return '';
    if (arguments.length == 1) {
        if (start >= 0 && start < l)
            return str.substring(start);
        if (start < -length)
            return str;
        if (start < 0 && start >= -l)
            return str.substring(l + start);
    }
    if (len <= 0)
        return '';
    if (start >= 0 && start < l) {
        if (len > l - start)
            len = l - start;
        return str.substring(start, start + len);
    }
    if (start < -l) {
        if (len >= l)
            return str;
        return str.substring(0, len);
    }
    if (start < 0 && start >= -l) {
        if (len >= -start)
            return str.substring(l + start);
        return str.substring(l + start, l + start + len);
    }
    return '';
};

function getInfoWinHeight() {
    var height = '420px';
    if (rootElement.screen.height > 800) {
        height = '620px';
    }
    return height;
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
    var width = $(window).width();
    if (!document.body) {
        return width;
    }
    var zoom = document.body.style.zoom;
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
