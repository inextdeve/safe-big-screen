var lang_local; //本地语言
var lang; //语言对象，通过调用lang.lable来获取语言信息
var rootElement;
var noCookie = false;
function loadStyle(src) {
  const style = document.createElement("link");
  $(style).attr("rel", "stylesheet").attr("href", src);
  $("head").append(style);
}
//初始化语言，跟据浏览器的语言
function langInitByBrowser() {
  //先从Cookie中获取语言参数
  var local = GetCookie("language");

  if (local == null) {
    //再跟据浏览器语言获取语言参数
    if (navigator.userAgent.indexOf("MSIE") >= 0) {
      local = navigator.browserLanguage;
    } else if (
      navigator.userAgent.indexOf("Firefox") >= 0 ||
      navigator.userAgent.indexOf("Chrome") >= 0 ||
      navigator.userAgent.indexOf("Opera") >= 0 ||
      navigator.userAgent.indexOf("Mozilla") >= 0
    ) {
      local = navigator.language;
    } else {
      local = navigator.language;
    }
  }

  if (local.indexOf("en") > -1) {
    local = "en";
  } else if (
    local.indexOf("TW") > -1 ||
    local.indexOf("tw") > -1 ||
    local.indexOf("HK") > -1 ||
    local.indexOf("hk") > -1
  ) {
    local = "tw";
  } else if (local.indexOf("TR") > -1 || local.indexOf("tr") > -1) {
    local = "tr";
  } else if (local.indexOf("TH") > -1 || local.indexOf("th") > -1) {
    local = "th";
  } else if (local.indexOf("AR") > -1 || local.indexOf("ar") > -1) {
    local = "ar";
  } else if (local.indexOf("es") > -1 || local.indexOf("es") > -1) {
    local = "es";
  } else if (local.indexOf("BG") > -1 || local.indexOf("bg") > -1) {
    local = "bg";
  } else if (local.indexOf("RU") > -1 || local.indexOf("ru") > -1) {
    local = "ru";
  } else if (local.indexOf("RO") > -1 || local.indexOf("ro") > -1) {
    local = "ro";
  } else if (local.indexOf("VI") > -1 || local.indexOf("vi") > -1) {
    local = "vi";
  } else if (
    local.indexOf("CN") > -1 ||
    local.indexOf("cn") > -1 ||
    local.indexOf("ZH") > -1 ||
    local.indexOf("zh") > -1
  ) {
    local = "zh";
  } else if (local.indexOf("PT") > -1 || local.indexOf("pt") > -1) {
    local = "pt";
  } else if (local.indexOf("HU") > -1 || local.indexOf("hu") > -1) {
    local = "hu";
  } else if (local.indexOf("ES") > -1 || local.indexOf("es") > -1) {
    local = "es";
  } else if (local.indexOf("FR") > -1 || local.indexOf("fr") > -1) {
    local = "fr";
  } else if (
    local.indexOf("IW") > -1 ||
    local.indexOf("iw") > -1 ||
    local.indexOf("HE") > -1 ||
    local.indexOf("he") > -1
  ) {
    local = "iw";
  } else {
    local = "en"; //默认为英文版本
  }

  langChange(local);
}

//初始化语言，跟据Url参数，在URL后面跟着  xxx.html?lang=zh
function langInitByUrl(noCookie) {
  if (noCookie) {
    noCookie = true;
  }
  var local = getUrlParameter("lang");
  var language = getUrlParameter("lang");
  if (!language) {
    language = local;
  }
  if (language === "english" || language === "en") {
    local = "en";
  }
  if (language === "chinese" || language === "zh") {
    local = "zh";
  }
  if (
    language === "chinese traditional" ||
    language === "chinese%20traditional" ||
    language === "tw"
  ) {
    local = "tw";
  }
  if (language === "spanish") {
    local = "es";
  }
  if (language === "arabic") {
    local = "ar";
  }
  if (language === "portugues") {
    local = "pt";
  }

  if (language === "iw" || language === "he") {
    local = "iw";
  }

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
  var heads = document.getElementsByTagName("head"); //追加到head标签内
  if (heads.length) {
    heads[0].appendChild(otherJScipt);
  } else {
    doc.documentElement.appendChild(otherJScipt);
  }
  //判断服务器
  if (typeof otherJScipt.onreadystatechange != "undefined") {
    otherJScipt.onreadystatechange = function () {
      //IE下的判断，判断是否加载完成
      if (
        otherJScipt &&
        (otherJScipt.readyState == "loaded" ||
          otherJScipt.readyState == "complete")
      ) {
        otherJScipt.onreadystatechange = null;
        if (callback != null) {
          callback();
        }
      }
    };
  } else if (typeof otherJScipt.onload != "undefined") {
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
    if (
      a != "velocityType_km" &&
      a != "velocityType_mile" &&
      a != "velocityType_nautical_mile" &&
      a != "KmPerHourParam_" &&
      a != "MilePerHourParam_" &&
      a != "NauticalPerHourParam_" &&
      a != "policeName" &&
      a != "enforcementName" &&
      a != "personName" &&
      !a.endsWith("_v9")
    ) {
      lang_[a] = lang_[a].replace(new RegExp(oldType, "g"), newType);
    }
  }
}

//替换英文 忽略大小写
function loadChangeWord(lang_, oldType, newType) {
  for (var a in lang_) {
    if (
      a != "velocityType_km" &&
      a != "velocityType_mile" &&
      a != "velocityType_nautical_mile" &&
      a != "KmPerHourParam_" &&
      a != "MilePerHourParam_" &&
      a != "NauticalPerHourParam_"
    ) {
      lang_[a] = lang_[a].replace(new RegExp(oldType, "g"), newType);
    }
  }
}

//加载语言
function langChange(local) {
  rootElement = _getRootFrameElement();
  if (!noCookie) {
    SetCookie("language", local);
  }
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
    var projectName = pathName.substring(
      0,
      pathName.substr(1).indexOf("/") + 1
    );
    return localhostPaht;
  };
  var rootPath = getRootPath() + "/808gps";
  lang_local = local;

  var velocityType = 0; //默认公里
  if (
    typeof GetCookie != "undefined" &&
    GetCookie != null &&
    typeof GetCookie == "function"
  ) {
    velocityType = GetCookie("velocityType");
  }
  var isPolice = false;
  if (
    typeof GetCookie != "undefined" &&
    GetCookie != null &&
    typeof GetCookie == "function"
  ) {
    if (GetCookie("isPolice") && GetCookie("isPolice") == 1) {
      isPolice = true;
    }
  }
  var policeOrPeople = false; //包含警员系统
  if (
    typeof GetCookie != "undefined" &&
    GetCookie != null &&
    typeof GetCookie == "function"
  ) {
    if (GetCookie("policeOrPeople") && GetCookie("policeOrPeople") == 1) {
      policeOrPeople = true;
    }
  }

  var configurationForName = 2; //命名
  if (
    typeof GetCookie != "undefined" &&
    GetCookie != null &&
    typeof GetCookie == "function" &&
    GetCookie("configurationForName")
  ) {
    configurationForName = GetCookie("configurationForName");
  }

  //目前只支持中、英、繁
  if (langIsChinese()) {
    loadScript(
      rootPath + "/js/lang.js?tv=" + rootElement.ttxWebVersion,
      function () {
        lang = new langChinese();
        // 是否宇航浩空定制
        if (
          rootElement.LS &&
          rootElement.LS.get("isEnableYuHangHaoKong") === "1"
        ) {
          handleHangHangHaoKongLang();
        }
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
          lang.alarm_type_mainSupplyUndervoltage =
            lang.alarm_low_battery_voltage;
          lang.alarm_name_205 = lang.alarm_low_battery_voltage;
          lang.report_mainSupplyUndervoltage = lang.alarm_low_battery_voltage;
          lang.protocol_8082019_alarm_bit7_1 = lang.alarm_low_battery_voltage;
        }
        if (policeOrPeople) {
          loadChangeVelocity(lang, "警员", "人员");
        }
      }
    );
  } else if (langIsTW()) {
    loadScript(
      rootPath + "/js/lang_tw.js?tv=" + rootElement.ttxWebVersion,
      function () {
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
          lang.alarm_type_mainSupplyUndervoltage =
            lang.alarm_low_battery_voltage;
          lang.alarm_name_205 = lang.alarm_low_battery_voltage;
          lang.report_mainSupplyUndervoltage = lang.alarm_low_battery_voltage;
          lang.protocol_8082019_alarm_bit7_1 = lang.alarm_low_battery_voltage;
        }

        if (policeOrPeople) {
          loadChangeVelocity(lang, "警員", "人員");
        }
      }
    );
    /*	} else if (langIsTurkey()) {
                lang = new langTurkey();
            } else if (langIsThai()) {
                lang = new langThai();
            } else if (langIsPt()) {
                lang = new langPortugues();
            } else if (langIsAr()) {
                lang = new langArabic();
            } else if (langIsEs()) {
                lang = new langSpanish();
            }else if (langIsBulgarian()) {
                lang = new langBulgarian();*/
  } else if (langIsRussian()) {
    loadScript(
      rootPath + "/js/lang_en.js?tv=" + rootElement.ttxWebVersion,
      function () {
        var langEn = new langEnglish();
        loadScript(
          rootPath + "/js/lang_ru.js?tv=" + rootElement.ttxWebVersion,
          function () {
            lang = new langRussian();
            //lang中没有的从langEn中找到并且追加到lang中
            for (var a in langEn) {
              if (typeof lang[a] == "undefined") {
                lang[a] = langEn[a];
              }
            }
          }
        );
      }
    );
  } else if (langIsEs()) {
    loadScript(
      rootPath + "/js/lang_en.js?tv=" + rootElement.ttxWebVersion,
      function () {
        var langEn = new langEnglish();
        loadScript(
          rootPath + "/js/lang_es.js?tv=" + rootElement.ttxWebVersion,
          function () {
            lang = new langSpanish();
            //lang中没有的从langEn中找到并且追加到lang中
            for (var a in langEn) {
              if (typeof lang[a] == "undefined") {
                lang[a] = langEn[a];
              }
            }
          }
        );
      }
    );
  } else if (langIsRomanian()) {
    loadScript(
      rootPath + "/js/lang_en.js?tv=" + rootElement.ttxWebVersion,
      function () {
        var langEn = new langEnglish();
        loadScript(
          rootPath + "/js/lang_ro.js?tv=" + rootElement.ttxWebVersion,
          function () {
            lang = new langRomanian();
            //lang中没有的从langEn中找到并且追加到lang中
            for (var a in langEn) {
              if (typeof lang[a] == "undefined") {
                lang[a] = langEn[a];
              }
            }
          }
        );
      }
    );
  } else if (langIsAr()) {
    loadStyle("./css/style.rtl.css");
    loadScript(
      rootPath + "/js/lang_en.js?tv=" + rootElement.ttxWebVersion,
      function () {
        var langEn = new langEnglish();
        loadScript(
          rootPath + "/js/lang_ar.js?tv=" + rootElement.ttxWebVersion,
          function () {
            lang = new langArabic();
            //lang中没有的从langEn中找到并且追加到lang中
            for (var a in langEn) {
              if (typeof lang[a] == "undefined") {
                lang[a] = langEn[a];
              }
            }
          }
        );
      }
    );
  } else if (langIsVi()) {
    loadScript(
      rootPath + "/js/lang_en.js?tv=" + rootElement.ttxWebVersion,
      function () {
        var langEn = new langEnglish();
        loadScript(
          rootPath + "/js/lang_vi.js?tv=" + rootElement.ttxWebVersion,
          function () {
            lang = new langVietnamese();
            //lang中没有的从langEn中找到并且追加到lang中
            for (var a in langEn) {
              if (typeof lang[a] == "undefined") {
                lang[a] = langEn[a];
              }
            }
          }
        );
      }
    );
  } else if (langIsPt()) {
    loadScript(
      rootPath + "/js/lang_en.js?tv=" + rootElement.ttxWebVersion,
      function () {
        var langEn = new langEnglish();
        loadScript(
          rootPath + "/js/lang_pt.js?tv=" + rootElement.ttxWebVersion,
          function () {
            lang = new langPortugues();
            //lang中没有的从langEn中找到并且追加到lang中
            for (var a in langEn) {
              if (typeof lang[a] == "undefined") {
                lang[a] = langEn[a];
              }
            }
          }
        );
      }
    );
  } else if (langIsHu()) {
    loadScript(
      rootPath + "/js/lang_en.js?tv=" + rootElement.ttxWebVersion,
      function () {
        var langEn = new langEnglish();
        loadScript(
          rootPath + "/js/lang_hu.js?tv=" + rootElement.ttxWebVersion,
          function () {
            lang = new langHungarian();
            //lang中没有的从langEn中找到并且追加到lang中
            for (var a in langEn) {
              if (typeof lang[a] == "undefined") {
                lang[a] = langEn[a];
              }
            }
          }
        );
      }
    );
  } else if (langIsFr()) {
    loadScript(
      rootPath + "/js/lang_en.js?tv=" + rootElement.ttxWebVersion,
      function () {
        var langEn = new langEnglish();
        loadScript(
          rootPath + "/js/lang_fr.js?tv=" + rootElement.ttxWebVersion,
          function () {
            lang = new langFRENch();
            //lang中没有的从langEn中找到并且追加到lang中
            for (var a in langEn) {
              if (typeof lang[a] == "undefined") {
                lang[a] = langEn[a];
              }
            }
          }
        );
      }
    );
  } else if (langIsIw()) {
    loadScript(
      rootPath + "/js/lang_en.js?tv=" + rootElement.ttxWebVersion,
      function () {
        var langEn = new langEnglish();
        loadScript(
          rootPath + "/js/lang_he.js?tv=" + rootElement.ttxWebVersion,
          function () {
            lang = new langHebrew();
            //lang中没有的从langEn中找到并且追加到lang中
            for (var a in langEn) {
              if (typeof lang[a] == "undefined") {
                lang[a] = langEn[a];
              }
            }
          }
        );
      }
    );
  } else {
    loadScript(
      rootPath + "/js/lang_en.js?tv=" + rootElement.ttxWebVersion,
      function () {
        lang = new langEnglish();
        if (velocityType == 1) {
          for (var a in lang) {
            if (
              a != "velocityType_km" &&
              a != "velocityType_mile" &&
              a != "velocityType_nautical_mile" &&
              a != "KmPerHourParam_" &&
              a != "MilePerHourParam_" &&
              a != "NauticalPerHourParam_"
            ) {
              //						lang[a] = lang[a].replace("Kilometer","Mile");//kilometers KM
              lang[a] = lang[a].replace("KM", "MI");
            }
          }
        } else if (velocityType == 2) {
          for (var a in lang) {
            if (
              a != "velocityType_km" &&
              a != "velocityType_mile" &&
              a != "velocityType_nautical_mile" &&
              a != "KmPerHourParam_" &&
              a != "MilePerHourParam_" &&
              a != "NauticalPerHourParam_"
            ) {
              //						lang[a] = lang[a].replace("Kilometer","Nautical Mile");
              lang[a] = lang[a].replace("KM", "NMI");
            }
          }
        }
        if (isPolice) {
          loadChangeVelocity(lang, "company", "organization");
          loadChangeVelocity(lang, "Vehicle", "Terminal");
          loadChangeVelocity(lang, "Plate No.", "Terminal");
          if (configurationForName == 1) {
            loadChangeVelocity(lang, "Police", "Instrument");
          } else if (configurationForName == 2) {
            loadChangeVelocity(lang, "Police", "Person");
          }
          lang.alarm_type_mainSupplyUndervoltage =
            lang.alarm_low_battery_voltage;
          lang.alarm_name_205 = lang.alarm_low_battery_voltage;
          lang.report_mainSupplyUndervoltage = lang.alarm_low_battery_voltage;
          lang.protocol_8082019_alarm_bit7_1 = lang.alarm_low_battery_voltage;
        }
        if (policeOrPeople) {
          loadChangeVelocity(lang, "police", "person");
          loadChangeVelocity(lang, "Police", "Person");
        }
      }
    );
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

function langIsHu() {
  if (lang_local == "hu") {
    return true;
  } else {
    return false;
  }
}

function langIsFr() {
  if (lang_local == "fr") {
    return true;
  } else {
    return false;
  }
}

function langIsIw() {
  if (lang_local == "iw") {
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

function langIsVi() {
  if (lang_local == "vi") {
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
    display: lang.lang_chinese,
    title: lang.lang_chinese,
    name: "lang-zh",
    pclass: "clearfix",
    preicon: true,
  });
  mod.push({
    display: lang.lang_english,
    title: lang.lang_english,
    name: "lang-en",
    pclass: "clearfix",
    preicon: true,
  });
  mod.push({
    display: lang.lang_chineseTW,
    title: lang.lang_chineseTW,
    name: "lang-tw",
    pclass: "clearfix",
    preicon: true,
  });
  mod.push({
    display: lang.lang_russian,
    title: lang.lang_russian,
    name: "lang-ru",
    pclass: "clearfix",
    preicon: true,
  });
  mod.push({
    display: lang.lang_romanian,
    title: lang.lang_romanian,
    name: "lang-ro",
    pclass: "clearfix",
    preicon: true,
  });
  mod.push({
    display: lang.lang_arabic,
    title: lang.lang_arabic,
    name: "lang-ar",
    pclass: "clearfix",
    preicon: true,
  });

  mod.push({
    display: lang.lang_spanish,
    title: lang.lang_spanish,
    name: "lang-es",
    pclass: "clearfix",
    preicon: true,
  });

  mod.push({
    display: lang.lang_vietnamese,
    title: lang.lang_vietnamese,
    name: "lang-vi",
    pclass: "clearfix",
    preicon: true,
  });

  mod.push({
    display: lang.lang_portugues,
    title: lang.lang_portugues,
    name: "lang-pt",
    pclass: "clearfix",
    preicon: true,
  });

  mod.push({
    display: lang.lang_hungarian,
    title: lang.lang_hungarian,
    name: "lang-hu",
    pclass: "clearfix",
    preicon: true,
  });

  mod.push({
    display: lang.lang_france,
    title: lang.lang_france,
    name: "lang-fr",
    pclass: "clearfix",
    preicon: true,
  });
  mod.push({
    display: lang.lang_hebrew,
    title: lang.lang_hebrew,
    name: "lang-iw",
    pclass: "clearfix",
    preicon: true,
  });
  $(".language").flexPanel({
    TabsModel: mod,
  });

  $(".language li").on("click", function () {
    $(this).addClass("current").siblings().removeClass("current");
    $(".language ul").removeClass("show");
    $(".wy-mod-lang .carat").removeClass("show");
    langChange($(this).attr("data-tab").split("-")[1]);
    SetCookie("language", $(this).attr("data-tab").split("-")[1]);
    document.location.reload();
  });

  $("body").click(function (event) {
    var obj = event.srcElement ? event.srcElement : event.target;
    if (
      obj != $(".wy-mod-lang .switch-span")[0] &&
      obj != $(".wy-mod-lang .carat")[0]
    ) {
      $(".language ul").removeClass("show");
      $(".wy-mod-lang .carat").removeClass("show");
    }
  });

  if (langCurLocal() == "zh") {
    $(".lang-zh").addClass("current");
    $(".wy-mod-lang .switch-span").addClass("chineseLang");
  } else if (langCurLocal() == "tw") {
    $(".lang-tw").addClass("current");
    $(".wy-mod-lang .switch-span").addClass("traditionalLang");
  } else if (langCurLocal() == "ru") {
    $(".lang-ru").addClass("current");
    $(".wy-mod-lang .switch-span").addClass("russianLang");
  } else if (langCurLocal() == "ro") {
    $(".lang-ro").addClass("current");
    $(".wy-mod-lang .switch-span").addClass("romanianLang");
  } else if (langCurLocal() == "ar") {
    $(".lang-ar").addClass("current");
    $(".wy-mod-lang .switch-span").addClass("arabicLang");
  } else if (langCurLocal() == "es") {
    $(".lang-es").addClass("current");
    $(".wy-mod-lang .switch-span").addClass("spanishLang");
  } else if (langCurLocal() == "vi") {
    $(".lang-vi").addClass("current");
    $(".wy-mod-lang .switch-span").addClass("vietnameseLang");
  } else if (langCurLocal() == "pt") {
    $(".lang-pt").addClass("current");
    $(".wy-mod-lang .switch-span").addClass("PortuguesLang");
  } else if (langCurLocal() == "hu") {
    $(".lang-pt").addClass("current");
    $(".wy-mod-lang .switch-span").addClass("hungarianLang");
  } else if (langCurLocal() == "fr") {
    $(".lang-fr").addClass("current");
    $(".wy-mod-lang .switch-span").addClass("franceLang");
  } else if (langCurLocal() == "iw") {
    $(".lang-iw").addClass("current");
    $(".wy-mod-lang .switch-span").addClass("hebrewLang");
  } else {
    $(".lang-en").addClass("current");
    $(".wy-mod-lang .switch-span").addClass("englishLang");
  }
  $(".hebrewLang").text(lang.lang_hebrew);
  $(".englishLang").text(lang.lang_english);
  $(".chineseLang").text(lang.lang_chinese);
  $(".traditionalLang").text(lang.lang_chineseTW);
  $(".romanianLang").text(lang.lang_romanian);
  $(".russianLang").text(lang.lang_russian);
  $(".arabicLang").text(lang.lang_arabic);
  $(".spanishLang").text(lang.lang_spanish);
  $(".vietnameseLang").text(lang.lang_vietnamese);
  $(".PortuguesLang").text(lang.lang_portugues);
  $(".hungarianLang").text(lang.lang_hungarian);
  $(".franceLang").text(lang.lang_france);

  //	$(".switch-span").text(lang.switching);
  //	$(".wy-mod-lang H2 .text").text(lang.currentLanguage);

  $(".wy-mod-lang .switch-div").on("click", function () {
    if ($(".carat", this).hasClass("show")) {
      $(".language ul").removeClass("show");
      $(".carat", this).removeClass("show");
    } else {
      $(".language ul").addClass("show");
      $(".carat", this).addClass("show");
    }
    var that = this;
    $(".language ul").mouseleave(function () {
      $(this).removeClass("show");
      $(".carat", that).removeClass("show");
    });
  });
}

//初始化华宝语言选择
function initHBSwitchLanguage() {
  var content_ = "";
  if (langCurLocal() == "zh") {
    $("#currentLang span").text(lang.lang_chinese);
    content_ =
      '<li data-tab="en"><a href="javascript:;" class="englishLang"><span></span></a></li>';
  } else {
    $("#currentLang span").text(lang.lang_english);
    content_ =
      '<li data-tab="zh"><a href="javascript:;" class="chineseLang"><span></span></a></li>';
  }
  $("#langBox").append(content_);

  $(".englishLang span").text(lang.lang_english);
  $(".chineseLang span").text(lang.lang_chinese);

  $("#langBox li").on("click", function () {
    langChange($(this).attr("data-tab"));
    SetCookie("language", $(this).attr("data-tab"));
    document.location.reload();
  });

  $(".fy_j")
    .on("mouseover hover", function () {
      $(this).find("ul").show();
    })
    .on("mouseout", function () {
      $(this).find("ul").hide();
    });
}

function handleHangHangHaoKongLang() {
  for (var langKey in lang) {
    if (lang.hasOwnProperty(langKey)) {
      lang[langKey] = lang[langKey].replace(/公司/g, "部门");
    }
  }
}
