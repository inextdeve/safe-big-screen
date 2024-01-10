/**
 * 登录
 */
var SessionLogin = {};
var myUserRole = new userRole();

SessionLogin.directLogin = function (callback) {
    var session = getUrlParameter("jsession") || getUrlParameter("userSession");
    var account_ = getUrlParameter("account");
    var password_ = getUrlParameter("password");
    var ctype = getUrlParameter("ctype");
    var lang = getUrlParameter("lang");

    if (session != "" || (account_ != '' && password_ != '')) {
        var action = "/StandardLoginAction_sessionLogin.action";
        if (session != '') {
            action += '?userSession=' + session;
        }else{
            if (account_ != '' && password_ != '') {
                action += '?account=' + account_ + '&password=' + password_;
            }
        }
        if (ctype != null && ctype != '') {
            action += "&ctype=" + ctype;
        }
        if (lang != null && lang != '') {
            action += "&language=" + lang;
        }
        SessionLogin.doLogin(action, false, ctype, lang,callback);
    }
}

SessionLogin.doLogin = function (action, sysLogin, ctype, lang,callback) {
    // var logintipdlg = $.dialog({id: 'logintip', title: false, content: lang.login_logining});
    $.ajax({
        url: action,
        cache: false,/*禁用浏览器缓存*/
        dataType: "json",
        success: function (json) {
            if (json) {
                var flag = json.result;
                if (flag != null) {
                   /* var urlOpen = ctxPath + "/808gps/zh-screen/zh-screen.html?ctype=" + ctype + "&lang=" + lang;
                    window.location = urlOpen;*/
                    SessionLogin.setMyUserRole(json);
                    if (callback && typeof callback == 'function'){
                        callback.call(this);
                    }
                } else {
                    alert(lang.errUnkown + ":  null");
                    // window.location.reload();
                }
            }
            // logintipdlg.close();
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(lang.errSendRequired);
            // logintipdlg.close();
            // window.location.reload();
        }
    });
}


SessionLogin.setMyUserRole = function (json) {
    myUserRole.setEnableParam(json.enableParam ? json.enableParam : 0);
    myUserRole.setPrivileges(json.privilege);
    myUserRole.setIsAdmin(json.isAdmin);
    myUserRole.setIsMaster(json.isMaster);
    myUserRole.setIsFirstCompany(json.isFirstCompany);
    myUserRole.setIsSecondCompany(json.isSecondCompany);
    myUserRole.setIsThreeCompany(json.isThreeCompany);
    myUserRole.setHasAddArea(json.hasAddArea);
    myUserRole.setHasLine(json.hasLine);
    myUserRole.setHasRoadRule(json.hasRoadRule);
    myUserRole.setIsAllowManage(json.isAllowManage);
    myUserRole.setIsManageLine(json.isManageLine);
    myUserRole.setIsSanitationTruck(json.isSanitationTruck);
    myUserRole.setIsGov(json.isGov ? json.isGov : 0);
    myUserRole.setIsOpenEnterprisesViolations(json.isOpenEnterprisesViolations ? json.isOpenEnterprisesViolations : 0);
    myUserRole.setIsOpenRegion(json.isOpenRegion ? json.isOpenRegion : 0);
    myUserRole.setIsOpenRunStop(json.isOpenRunStop ? json.isOpenRunStop : 0);
    myUserRole.setIsChemicals(json.isChemicals);
    myUserRole.setCompanyLevel(json.level);
    myUserRole.setCompanyVerify(json.verify);
    myUserRole.setIsPolice(json.isPolice ? 1 : 0);
    myUserRole.setBaiDuWebAPIKey(json.baiDuWebAPIKey);
    myUserRole.setGoogleWebAPIKey(json.googleWebAPIKey);
    myUserRole.setGaoDeWebAPIKey(json.gaoDeWebAPIKey);
    myUserRole.setSiWeiWebAPIKey(json.siWeiWebAPIKey);
    myUserRole.setGeocoderMapType(json.geocoderMapType);
    myUserRole.setDefaultGeocoderMapType(json.defaultGeocoderMapType);
    myUserRole.setIsChangePsw(json.allowPassword);
    myUserRole.setIsXinTianDi(json.isXinTianDi);
    myUserRole.setIsFangHao(json.isFangHao);
    myUserRole.setIsYunNanTransport(json.isYunNanTransport);
    myUserRole.setIsPoliceOperation(json.policeOperation);
    myUserRole.setGeoAddress(json.isGeoAddress);
    myUserRole.setIsZSYRoadList(json.isZSYRoadList);
    myUserRole.setIsDispatcher(json.isDispatcher);
    myUserRole.setVelocityType(json.velocityType);
    myUserRole.setIsMuck(json.isMuck);
    myUserRole.setIsXinJiang(json.isXinJiang);
    myUserRole.setSTY(json.isSTY);
    myUserRole.setIsVehiInternet(json.isVehiInternet);
    myUserRole.setIsHaiJu(json.isHaiJu);
    myUserRole.setShieldReport(json.shieldReport);
    myUserRole.setIsLoadMapFence(json.loadMapFence ? json.loadMapFence : 0);
    myUserRole.setIsRealVedioGps(json.realVideo);
    myUserRole.setIsBackVedioGps(json.backVideo);
    myUserRole.setAlarmParam(json.alarmParam ? json.alarmParam : 0);
    myUserRole.setToFixed(json.toFixed);
    myUserRole.setVehiAddDelAuth(json.vehiAddDel);
    myUserRole.setEnableDirtTruck(json.isEnableDirtTruck);
    myUserRole.setEnableOperationMaturity(json.isEnableOperationMaturity);
    myUserRole.setEnableOperationLine(json.enableOperationLine ? json.enableOperationLine : 0);
    myUserRole.setEnablePlatformManage(json.enablePlatformManage ? json.enablePlatformManage : 0);


}