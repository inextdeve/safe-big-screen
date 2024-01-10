var lang_local;	//本地语言
var lang;	//语言对象，通过调用lang.lable来获取语言信息
var rootElement;

//初始化语言，跟据浏览器的语言
function langInitByBrowser() {
    //先从Cookie中获取语言参数
    var local = GetCookie("language");

    if (local == null) {
        //再跟据浏览器语言获取语言参数
        if (navigator.userAgent.indexOf('MSIE') >= 0) {
            local = navigator.browserLanguage;
        } else if (navigator.userAgent.indexOf('Firefox') >= 0 || navigator.userAgent.indexOf('Chrome') >= 0
            || navigator.userAgent.indexOf('Opera') >= 0 || navigator.userAgent.indexOf('Mozilla') >= 0) {
            local = navigator.language;
        } else {
            local = navigator.language;
        }
    }

    if (local.indexOf('en') > -1) {
        local = "en";
    } else if (local.indexOf('TW') > -1 || local.indexOf('tw') > -1 ||
        local.indexOf('HK') > -1 || local.indexOf('hk') > -1) {
        local = "tw";
    } else if (local.indexOf('TR') > -1 || local.indexOf('tr') > -1) {
        local = "tr";
    } else if (local.indexOf('TH') > -1 || local.indexOf('th') > -1) {
        local = "th";
    } else if (local.indexOf('PT') > -1 || local.indexOf('pt') > -1) {
        local = "pt";
    } else if (local.indexOf('AR') > -1 || local.indexOf('ar') > -1) {
        local = "ar";
    } else if (local.indexOf('es') > -1 || local.indexOf('es') > -1) {
        local = "es";
    } else if (local.indexOf('BG') > -1 || local.indexOf('bg') > -1) {
        local = "bg";
    } else if (local.indexOf('RU') > -1 || local.indexOf('ru') > -1) {
        local = "ru";
    } else if (local.indexOf('RO') > -1 || local.indexOf('ro') > -1) {
        local = "ro";
    } else if (local.indexOf('CN') > -1 || local.indexOf('cn') > -1
        || local.indexOf('ZH') > -1 || local.indexOf('zh') > -1) {
        local = "zh";
    } else {
        local = "en";	//默认为英文版本
    }

    langChange(local);
}


//初始化语言，跟据Url参数，在URL后面跟着  xxx.html?lang=zh
function langInitByUrl() {
    var local = getUrlParameter("lang");
    if (local == "") {
        langInitByBrowser();
    } else {
        langChange(local);
    }
}

//追加js到head
function loadScript(src, callback) {
    var otherJScipt = document.createElement("script");
    otherJScipt.setAttribute("type", "text/javascript");
    otherJScipt.setAttribute("src", src);
    var heads = document.getElementsByTagName("head");//追加到head标签内
    if (heads.length) {
        heads[0].appendChild(otherJScipt);
    } else {
        doc.documentElement.appendChild(otherJScipt);
    }
    //判断服务器
    if (typeof otherJScipt.onreadystatechange != 'undefined') {
        otherJScipt.onreadystatechange = function () {
            //IE下的判断，判断是否加载完成
            if (otherJScipt && (otherJScipt.readyState == "loaded" || otherJScipt.readyState == "complete")) {
                otherJScipt.onreadystatechange = null;
                if (callback != null) {
                    callback();
                }
            }
        };
    } else if (typeof otherJScipt.onload != 'undefined') {
        otherJScipt.onload = function () {
            otherJScipt.onload = null;
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

//执行改变单位
function loadChangeVelocity(lang_, oldType, newType) {
    for (var a in lang_) {
        if (a != 'velocityType_km' && a != 'velocityType_mile' && a != 'velocityType_nautical_mile' && a != 'policeName' && a != 'enforcementName' && a != 'personName' && !a.endsWith('_v9')) {
            lang_[a] = lang_[a].replace(new RegExp(oldType, 'g'), newType);
        }
    }
}

function langChange(local) {
    rootElement = _getRootFrameElement();
    SetCookie("language", local);
    //js获取项目根路径，如： http://localhost:8083/xx
    var getRootPath = function () {
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
    var rootPath = getRootPath() + "/808gps";
    lang_local = local;

    var velocityType = 0;//默认公里
    if (typeof GetCookie != 'undefined' && GetCookie != null && typeof GetCookie == 'function') {
        velocityType = GetCookie('velocityType');
    }
    var isPolice = false;
    if (typeof GetCookie != 'undefined' && GetCookie != null && typeof GetCookie == 'function') {
        if (GetCookie('isPolice') && GetCookie('isPolice') == 1) {
            isPolice = true;
        }
    }
    var policeOrPeople = false;//包含警员系统
    if (typeof GetCookie != 'undefined' && GetCookie != null && typeof GetCookie == 'function') {
        if (GetCookie('policeOrPeople') && GetCookie('policeOrPeople') == 1) {
            policeOrPeople = true;
        }
    }

    var configurationForName = 2;//命名
    if (typeof GetCookie != 'undefined' && GetCookie != null && typeof GetCookie == 'function' && GetCookie('configurationForName')) {
        configurationForName = GetCookie('configurationForName');
    }

    //目前只支持中、英、繁
    if (langIsChinese()) {
        loadScript(rootPath + "/js/lang.js?tv=" + rootElement.ttxWebVersion, function () {
            lang = new langChinese();
            if (velocityType == 1) {
                loadChangeVelocity(lang, "公里", "英里");
            } else if (velocityType == 2) {
                loadChangeVelocity(lang, "公里", "海里");
            }
            if (isPolice) {
                loadChangeVelocity(lang, "公司", "组织");
                loadChangeVelocity(lang, "车辆", "终端");
                loadChangeVelocity(lang, "车牌号", "终端");
                if (configurationForName == 1) {
                    loadChangeVelocity(lang, "警员", "执法");
                    loadChangeVelocity(lang, "警号", "执法号");
                } else if (configurationForName == 2) {
                    loadChangeVelocity(lang, "警员", "人员");
                    loadChangeVelocity(lang, "警号", "人员号");
                }
                lang.alarm_type_mainSupplyUndervoltage = lang.alarm_low_battery_voltage;
                lang.alarm_name_205 = lang.alarm_low_battery_voltage;
                lang.report_mainSupplyUndervoltage = lang.alarm_low_battery_voltage;
                lang.protocol_8082019_alarm_bit7_1 = lang.alarm_low_battery_voltage;
            }
            if (policeOrPeople) {
                loadChangeVelocity(lang, "警员", "人员");
            }
        });
    } else if (langIsTW()) {
        loadScript(rootPath + "/js/lang_tw.js?tv=" + rootElement.ttxWebVersion, function () {
            lang = new langTW();
            if (velocityType == 1) {
                loadChangeVelocity(lang, "公里", "英里");
            } else if (velocityType == 2) {
                loadChangeVelocity(lang, "公里", "海里");
            }
            if (isPolice) {
                loadChangeVelocity(lang, "公司", "組織");
                loadChangeVelocity(lang, "車輛", "終端");
                loadChangeVelocity(lang, "車牌號", "終端");
                if (configurationForName == 1) {
                    loadChangeVelocity(lang, "警員", "執法");
                    loadChangeVelocity(lang, "警號", "執法號");
                } else if (configurationForName == 2) {
                    loadChangeVelocity(lang, "警員", "人員");
                    loadChangeVelocity(lang, "警號", "人員號");
                }
                lang.alarm_type_mainSupplyUndervoltage = lang.alarm_low_battery_voltage;
                lang.alarm_name_205 = lang.alarm_low_battery_voltage;
                lang.report_mainSupplyUndervoltage = lang.alarm_low_battery_voltage;
                lang.protocol_8082019_alarm_bit7_1 = lang.alarm_low_battery_voltage;
            }

            if (policeOrPeople) {
                loadChangeVelocity(lang, "警員", "人員");
            }
        });
    } else {
        loadScript(rootPath + "/js/lang_en.js?tv=" + rootElement.ttxWebVersion, function () {
            lang = new langEnglish();
            if (velocityType == 1) {
                for (var a in lang) {
                    if (a != 'velocityType_km' && a != 'velocityType_mile' && a != 'velocityType_nautical_mile') {
//						lang[a] = lang[a].replace("Kilometer","Mile");//kilometers KM
                        lang[a] = lang[a].replace("KM", "Mile");
                    }
                }
            } else if (velocityType == 2) {
                for (var a in lang) {
                    if (a != 'velocityType_km' && a != 'velocityType_mile' && a != 'velocityType_nautical_mile') {
//						lang[a] = lang[a].replace("Kilometer","Nautical Mile");
                        lang[a] = lang[a].replace("KM", "NM");
                    }
                }
            }
            if (isPolice) {
                loadChangeVelocity(lang, "Company", "Department");
                loadChangeVelocity(lang, "company", "department");
                loadChangeVelocity(lang, "Vehicle", "Terminal");
                loadChangeVelocity(lang, "Plate No.", "Terminal");
                if (configurationForName == 1) {
                    loadChangeVelocity(lang, "Police", "Instrument");
                } else if (configurationForName == 2) {
                    loadChangeVelocity(lang, "Police", "Person");
                }
                lang.alarm_type_mainSupplyUndervoltage = lang.alarm_low_battery_voltage;
                lang.alarm_name_205 = lang.alarm_low_battery_voltage;
                lang.report_mainSupplyUndervoltage = lang.alarm_low_battery_voltage;
                lang.protocol_8082019_alarm_bit7_1 = lang.alarm_low_battery_voltage;
            }
            if (policeOrPeople) {
                loadChangeVelocity(lang, "police", "person");
                loadChangeVelocity(lang, "Police", "Person");
            }
        });
    }
}

function langIsChinese() {

    if (lang_local == "zh") {
        return true;
    } else {
        return false;
    }
}

function langIsTW() {
    if (lang_local == "tw") {
        return true;
    } else {
        return false;
    }
}

function langIsTurkey() {
    if (lang_local == "tr") {
        return true;
    } else {
        return false;
    }
}

function langIsThai() {
    if (lang_local == "th") {
        return true;
    } else {
        return false;
    }
}

function langIsPt() {
    if (lang_local == "pt") {
        return true;
    } else {
        return false;
    }
}

function langIsAr() {
    if (lang_local == "ar") {
        return true;
    } else {
        return false;
    }
}

function langIsEs() {
    if (lang_local == "es") {
        return true;
    } else {
        return false;
    }
}

function langIsBulgarian() {
    if (lang_local == "bg") {
        return true;
    } else {
        return false;
    }
}

function langIsRussian() {
    if (lang_local == "ru") {
        return true;
    } else {
        return false;
    }
}

function langIsRomanian() {
    if (lang_local == "ro") {
        return true;
    } else {
        return false;
    }
}

function langCurLocal() {
    return lang_local;
}

function langWdatePickerCurLoacl() {
    if (lang_local == "zh") {
        return "zh-cn";
    } else if (lang_local == "tw") {
        return "zh-tw";
    } else if (lang_local == "ru") {
        return "ru";
    } else {
        return "en";
    }
}

//初始化默认语言选择
function initSwitchLanguage() {
    var mod = [];
    mod.push({
        display: "简体中文",
        title: "简体中文",
        name: 'lang-zh',
        pclass: 'clearfix',
        preicon: true
    });
    mod.push({
        display: "english",
        title: "english",
        name: 'lang-en',
        pclass: 'clearfix',
        preicon: true
    });
    mod.push({
        display: "繁体中文",
        title: "繁体中文",
        name: 'lang-tw',
        pclass: 'clearfix',
        preicon: true
    });
    mod.push({
        display: "Русский",
        title: "Русский",
        name: 'lang-ru',
        pclass: 'clearfix',
        preicon: true
    });
    mod.push({
        display: "română",
        title: "română",
        name: 'lang-ro',
        pclass: 'clearfix',
        preicon: true
    });
    mod.push({
        display: "العربية",
        title: "العربية",
        name: 'lang-ar',
        pclass: 'clearfix',
        preicon: true
    });


    $('.language').flexPanel({
        TabsModel: mod
    });


    var languageTypeList = [];
    languageTypeList.push("lang-zh");
    languageTypeList.push("lang-en");
    languageTypeList.push("lang-tw");
    languageTypeList.push("lang-ru");
    languageTypeList.push("lang-ro");
    languageTypeList.push("lang-ar");

    for (var i = 0; i < mod.length; i++) {
        var languageList = '<span id="' + languageTypeList[i] + '"  data-tab="' + languageTypeList[i] + '">' + '<span class="leftBracket">[</span>' + mod[i].title + '<span class="rightBracket">]</span>' + '</span>';
        $(".newLanguageLoading").append(languageList);
    }
    $(".switch-span").remove();
    $(".carat").remove();

    $(".newLanguageLoading span").mouseover(function () {
        $(this).find(".leftBracket").css("visibility", "visible");//visibility:visible
        $(this).find(".rightBracket").css("visibility", "visible");
        $(this).find(".leftBracket").css("opacity", "1");
        $(this).find(".rightBracket").css("opacity", "1");
    })
    $(".newLanguageLoading span").mouseout(function () {
        $(this).find(".leftBracket").css("visibility", "hidden");
        $(this).find(".rightBracket").css("visibility", "hidden");
    })


    $('.newLanguageLoading span').on('click', function () {
        $(this).addClass('current').siblings().removeClass("current");
        $('.language ul').removeClass('show');
        $('.wy-mod-lang .carat').removeClass('show');
        langChange($(this).attr('data-tab').split('-')[1]);
        SetCookie("language", $(this).attr('data-tab').split('-')[1]);
        document.location.reload();
    });

    $('body').click(function (event) {
        var obj = event.srcElement ? event.srcElement : event.target;
        if (obj != $('.wy-mod-lang .switch-span')[0] && obj != $('.wy-mod-lang .carat')[0]) {
            $('.language ul').removeClass('show');
            $('.wy-mod-lang .carat').removeClass('show');
        }
    });

    if (langCurLocal() == 'zh') {
        $('.lang-zh').addClass('current');
        $(".wy-mod-lang .switch-span").addClass('chineseLang');
    } else if (langCurLocal() == 'tw') {
        $('.lang-tw').addClass('current');
        $(".wy-mod-lang .switch-span").addClass('traditionalLang');
    } else if (langCurLocal() == 'ru') {
        $('.lang-ru').addClass('current');
        $(".wy-mod-lang .switch-span").addClass('russianLang');
    } else if (langCurLocal() == 'ro') {
        $('.lang-ro').addClass('current');
        $(".wy-mod-lang .switch-span").addClass('romanianLang');
    } else if (langCurLocal() == 'ar') {
        $('.lang-ar').addClass('current');
        $(".wy-mod-lang .switch-span").addClass('arabicLang');
    } else {
        $('.lang-en').addClass('current');
        $(".wy-mod-lang .switch-span").addClass('englishLang');
    }

    $(".englishLang").text(lang.lang_english);
    $(".chineseLang").text(lang.lang_chinese);
    $(".traditionalLang").text(lang.lang_chineseTW);
    $(".romanianLang").text(lang.lang_romanian);
    $(".russianLang").text(lang.lang_russian);
    $(".arabicLang").text(lang.lang_arabic);
//	$(".switch-span").text(lang.switching);
//	$(".wy-mod-lang H2 .text").text(lang.currentLanguage);

    $('.wy-mod-lang .switch-div').on('click', function () {
        if ($('.carat', this).hasClass('show')) {
            $('.language ul').removeClass('show');
            $('.carat', this).removeClass('show');
        } else {
            $('.language ul').addClass('show');
            $('.carat', this).addClass('show');
        }
        var that = this;
        $('.language ul').mouseleave(function () {
            $(this).removeClass('show');
            $('.carat', that).removeClass('show');
        });
    });
}

//初始化华宝语言选择
function initHBSwitchLanguage() {
    var content_ = '';
    if (langCurLocal() == 'zh') {
        $('#currentLang span').text(lang.lang_chinese);
        content_ = '<li data-tab="en"><a href="javascript:;" class="englishLang"><span></span></a></li>';
    } else {
        $('#currentLang span').text(lang.lang_english);
        content_ = '<li data-tab="zh"><a href="javascript:;" class="chineseLang"><span></span></a></li>';
    }
    $('#langBox').append(content_);

    $(".englishLang span").text(lang.lang_english);
    $(".chineseLang span").text(lang.lang_chinese);

    $('#langBox li').on('click', function () {
        langChange($(this).attr('data-tab'));
        SetCookie("language", $(this).attr('data-tab'));
        document.location.reload();
    });

    $(".fy_j").on('mouseover hover', function () {
        $(this).find("ul").show();
    }).on('mouseout', function () {
        $(this).find("ul").hide();
    });
}
