/**
 * 用户权限处理类
 */
function userRole() {
    this.isAdmin_ = false;  //是否管理员
    this.isMaster_ = false;  //是否是公司主账户
    this.isFirstCompany_ = false; //是否一级公司用户
    this.isSecondCompany_ = false; //是否二级公司用户
    this.isThreeCompany_ = false; //是否三级公司用户
    this.isAllowManage_ = false; //是否允许所有人管理车辆设备
    this.hasAddArea_ = false; //是否有添加行政区域
    this.hasLine_ = false;
    this.hasRoadRule_ = false; //是否有添加道路规则
    this.isManageLine_ = false; //是否有管理线路和线路报表的权限
    this.isChemicals_ = false; //是否危化品监管平台
    this.isSanitationTruck_ = false; //是否环卫车系统
    this.isGov_ = false; //是否第三方监管平台
    this.isOpenEnterprisesViolations_ = false; //是否企业违规上报
    this.isOpenRegion_ = false; //是否支持行政区域
    this.isOpenRunStop_ = false; //是否支持停运上报
    this.isPolice_ = false; //是否有警员管理
    this.privileges = [];   //权限列表
    this.companyLevel_ = null; //公司级别
    this.companyVerify_ = null; //公司审核状态
    this.isXinTianDi_ = false; //新天地
    this.isYunNanTransport_ = false; //云南省道路运政管理信息系统
    this.isSTY = false; // 生态眼项目
    this.isVehiInternet = false; // 政府平台项目

    this.chemicalPrivilege = 0; //危化权限

    this.isChangePsw_ = true;//账号禁用修改密码
    this.isFangHao_ = false;
    this.isPoliceOperation_ = false;//通用版本是否有警员管理

    this.baiDuWebAPIKey_ = null;
    this.googleWebAPIKey_ = null;
    this.gaoDeWebAPIKey_ = null;
    this.siWeiWebAPIKey_ = null;
    this.geocoderMapType_ = 0; //解析地理位置类型 0默认 1谷歌 2百度 3高德 4四维
    this.defaultGeocoderMapType_ = 0; //解析地理位置类型 0默认 1谷歌 2百度 3高德 4四维
    this.isZSYRoadList_ = false; //是否中石油运单
    this.longinName_ = null;//登录账号姓名
    this.isGeoAddress_ = false;//是否解析地理位置
    this.velocityType_ = 0; //速度单位 0公里 1英里 2海里  默认0;
    this.isDispatcher_ = false;//是否为调度员账号
    this.isMuck_ = false;//渣土车
    this.isXinJiang_ = false;//新疆平台
    this.isHaiJu_ = false;//海距平台
    this.isShieldReport_ = false;//科瑞通平台
    this.loadMapFence_ = false;//是否加载围栏到地图上

    this.realVedioGps_ = false;//是否有实时视频功能  和  实时定位功能
    this.realMap = false; //是否有地图功能
    this.backVedioGps_ = false;//是否有录像回放功能  和  轨迹回放功能
    this.alarmParam_ = 0;//报警配置 第一位启用  墨镜失效 报警
    this.enableParam_ = 0;//功能参数相关 具体参考登录返回 按位解析
    this.toFixed_ = 2;//里程转换设置 小数点位数默认2
    this.vehiAddDel = 0; //车辆添加/删除权限

    //安全回放
    this.enableSafetyTackPlayback = false;
    //是否有809业务菜单权限
    this.enable809 = false;
    this.enable809Data = false;
    this.enableDirtTruck = false;
    // 到期提醒
    this.enableOperationMaturity = false;

    this.enableHandOver = false;
    this.isVehiLogin_ = false; //是否车牌号登录
    this.isRegionUser_ = false;//是否行政区域用户
    /**
     * 网约车证功能
     */
    this.onlineCarLicenseManagement = true
    // 联网联控监管报表
    this.enableSupervisionReport = false;
    // 联网联控报表
    this.enableSupervisionReportChengWei = false;
    // 联网联控公司报警报表
    this.enableNetworkControlAlarmReport = false;
    // 安全报告
    this.enableActiveSafetyReport = false;
    // 广西第三方监管
    this.enableSupervisionReportGuangXi = 0;
    // 是否具有监控日志报表功能
    this.enableHasMonitoringLogsReport = 0;
    this.enableReportAlarmKeyAlarm = 0;
    // 是否启用安全监控
    this.enableSafetyMonitor = false;

    // 是否启用安全监控
    this.enableChuanBiao = false;

    // 是否允许到期监控
    this.enableAllowExpirationMonitor = false;

    //// 平台管理.运营商管理【目前是admin用户才有】
    this.enablePlatformManage = false;

    //是否校验姓名、身份证号登录
    this.checkIdCard = false;
    // 报警重复处理
    this.enableAlarmRepeatProcessing = false;
    // 运营线路
    this.enableOperationLine = false;
    // 客户ID
    this.customerId = "";
    //是否启动浙标安装证明
    this.enableInstallProve = false;
    this.isEnableDebug = false;
    //是否启动浙标安装证明
    this.enableCityPlatform = false;
    this.enableHeadMenuConfig = false;
    // 是否八方通达
    this.enableBaFang = false;
    // 是否上海警佳--被监督单位信息列表
    this.enableJiaJingSupervise = false;

    // 普通用户  选择公司， 司机的时候是否只能查询授权车辆对应公司以及公司下的司机
    this.enableNormalUser = false;
    // 公司线路级别
    this.enableCompanyLeaveLine = false;
    // 是否监管报表(黑标)
    this.enableNetworkControlAlarmReportBlackLabel = false;
}

//是否监管报表(黑标)
userRole.prototype.setEnableNetworkControlAlarmReportBlackLabel = function (val) {
    if (typeof val != 'undefined' && val != null && val == 1) {
        this.enableNetworkControlAlarmReportBlackLabel = true;
    }
}

userRole.prototype.isEnableNetworkControlAlarmReportBlackLabel = function () {
    return this.enableNetworkControlAlarmReportBlackLabel;
}

// 是否公司线路级别
userRole.prototype.isEnableCompanyLeaveLine = function () {
    return this.enableCompanyLeaveLine;
}

// 设置公司线路级别
userRole.prototype.setEnableCompanyLeaveLine = function (val) {
    if (typeof val != 'undefined' && val != null && val == 1) {
        this.enableCompanyLeaveLine = true;
    }
}

// 是否普通用户  选择公司， 司机的时候是否只能查询授权车辆对应公司以及公司下的司机
userRole.prototype.isEnableNormalUser = function () {
    return this.enableNormalUser;
}


// 设置普通用户  选择公司， 司机的时候是否只能查询授权车辆对应公司以及公司下的司机
userRole.prototype.setEnableNormalUser = function (val) {
    if (typeof val != 'undefined' && val != null && val == 1) {
        this.enableNormalUser = true;
    }
}


// 是否上海警佳--被监督单位信息列表
userRole.prototype.isEnableJiaJingSupervise = function () {
    return this.enableJiaJingSupervise;
}


// 设置是否上海警佳--被监督单位信息列表
userRole.prototype.setEnableJiaJingSupervise = function (val) {
    if (typeof val != 'undefined' && val != null && val == 1) {
        this.enableJiaJingSupervise = true;
    }
}

userRole.prototype.isEnableHeadMenuConfig = function () {
    return this.enableHeadMenuConfig;
}

//导航配置功能
userRole.prototype.setEnableHeadMenuConfig = function (val) {
    if (typeof val != 'undefined' && val != null && val == 1) {
        this.enableHeadMenuConfig = true;
    }
}

//是否启动市平台
userRole.prototype.setEnableCityPlatform = function (val) {
    if (typeof val != 'undefined' && val != null && val == 1) {
        this.enableCityPlatform = true;
    }
}

userRole.prototype.isEnableCityPlatform = function () {
    return this.enableCityPlatform;
}

//是否启动浙标安装证明
userRole.prototype.setEnableInstallProve = function (val) {
    if (typeof val != 'undefined' && val != null && val == 1) {
        this.enableInstallProve = true;
    }
}

userRole.prototype.isEnableInstallProve = function () {
    return this.enableInstallProve;
}

//是否八方通达
userRole.prototype.setEnableBaFang = function (val) {
    if (typeof val != 'undefined' && val != null && val == 1) {
        this.enableBaFang = true;
    }
}

userRole.prototype.isEnableBaFang = function () {
    return this.enableBaFang;
}

//是否寰旗
userRole.prototype.setEnableHuanQi = function (val) {
    if (typeof val != 'undefined' && val != null && val == 1) {
        this.enableHuanQi = true;
    }
}

userRole.prototype.isEnableHuanQi = function () {
    return this.enableHuanQi;
}

// 运营线路
userRole.prototype.setEnableOperationLine = function (val) {
    if (typeof val != 'undefined' && val != null && val == 1) {
        this.enableOperationLine = true;
    }
}

userRole.prototype.isEnableOperationLine = function () {
    return this.enableOperationLine;
}

// 报警重复处理
userRole.prototype.setEnableAlarmRepeatProcessing = function (val) {
    if (typeof val != 'undefined' && val != null && val == 1) {
        this.enableAlarmRepeatProcessing = true;
    }
}

userRole.prototype.isEnableAlarmRepeatProcessing = function () {
    return this.enableAlarmRepeatProcessing;
}


//是否平台管理
userRole.prototype.setEnablePlatformManage = function (val) {
    if (typeof val != 'undefined' && val != null && val == 1) {
        this.enablePlatformManage = true;
    }
}

userRole.prototype.isEnablePlatformManage = function () {
    return this.enablePlatformManage;
}


//是否启用安全监控
userRole.prototype.setEnableChuanBiao = function (val) {
    if (typeof val != 'undefined' && val != null && val == 1) {
        this.enableChuanBiao = true;
    }
}

userRole.prototype.isEnableChuanBiao = function () {
    return this.enableChuanBiao;
}

//是否启用安全监控
userRole.prototype.setEnableSafetyMonitor = function (val) {
    if (typeof val != 'undefined' && val != null && val == 1) {
        this.enableSafetyMonitor = true;
    }
}

userRole.prototype.isEnableSafetyMonitor = function () {
    return this.enableSafetyMonitor;
}

userRole.prototype.isOnlineCarLicenseManagement = function () {
    return this.onlineCarLicenseManagement;
}

userRole.prototype.setOnlineCarLicenseManagement = function (val) {
    if (val) {
        this.onlineCarLicenseManagement = true;
    } else {
        this.onlineCarLicenseManagement = false;
    }
}

//是否启用到期提醒
userRole.prototype.isEnableOperationMaturity = function () {
    return this.enableOperationMaturity;
}


//设置是否启用到期提醒
userRole.prototype.setEnableOperationMaturity = function (val) {
    if (typeof val != 'undefined' && val != null && val == 1) {
        this.enableOperationMaturity = true;
    }
}

// 是否启用智慧渣土
userRole.prototype.isEnableDirtTruck = function () {
    return this.enableDirtTruck;
}


// 设置是否启用智慧渣土
userRole.prototype.setEnableDirtTruck = function (val) {
    if (typeof val != 'undefined' && val != null && val == 1) {
        this.enableDirtTruck = true;
    }
}


// 是否启用安全回放
userRole.prototype.isEnableSafetyTackPlayback = function () {
    return this.enableSafetyTackPlayback;
}


// 设置是否启用安全回放
userRole.prototype.setEnableSafetyTackPlayback = function (val) {
    if (typeof val != 'undefined' && val != null && val == 1) {
        this.enableSafetyTackPlayback = true;
    }
}
// 是否有809业务菜单上报车辆定位数据权限
userRole.prototype.isEnable809PositionData = function () {
    return this.enable809Data;
}


// 是否有809业务菜单上报车辆定位数据权限
userRole.prototype.setEnable809PositionData = function (val) {
    if (typeof val != 'undefined' && val != null && val == 1) {
        this.enable809Data = true;
    }
}
// 是否有809业务菜单权限
userRole.prototype.isEnable809 = function () {
    return this.enable809;
}


// 设置是否有809业务菜单权限
userRole.prototype.setEnable809 = function (val) {
    if (typeof val != 'undefined' && val != null && val == 1) {
        this.enable809 = true;
    }
}

// 是否启用交接班功能
userRole.prototype.isEnableHandOver = function () {
    return this.enableHandOver;
}

// 设置是否启用交接班功能
userRole.prototype.setEnableHandOver = function (val) {
    if (typeof val != 'undefined' && val != null && val === '1') {
        this.enableHandOver = true;
    }
}

//是否显示车辆空载/半载/满载等状态
userRole.prototype.isEnableVehiStatus = function () {
    return this.isEnableRole(30);
}


//web登录是否启用安全云屏
userRole.prototype.isEnableSafeCloudScreen = function () {
    return this.isEnableRole(24);
}

//web登录是否启用智慧云屏
userRole.prototype.isEnableCloudScreen = function () {
    return this.isEnableRole(23);
}

//web登录是否启用监管云屏
userRole.prototype.isEnableSupervisionScreen = function () {
    return this.isEnableRole(32);
}

//web登录是否不区分大小写   统一小写转MD5入库，登录界面密码转小写
userRole.prototype.isIsIgnoreLetterCase = function () {
    return this.isEnableRole(22);
}


//判断功能是否启用
userRole.prototype.setEnableParam = function (val) {
    if (typeof val != 'undefined' && val != null) {
        this.enableParam_ = val;
    }
}

//判断功能是否启用
userRole.prototype.isEnableRole = function (index) {
    var enableParam_2 = Number(this.enableParam_).toString(2)
    var enableParam = this.enableParam_;
    if (enableParam_2.length > 31) {
        if (index < 31) {
            var enableParamlow = enableParam_2.substring(enableParam_2.length - 31)
            enableParam = parseInt(enableParamlow, 2).toString(10)
        } else {
            var enableParamhigh = enableParam_2.substring(0, enableParam_2.length - 31)
            enableParam = parseInt(enableParamhigh, 2).toString(10)
            index = index - 31
        }
    }
    var enableParam_3 = Number(enableParam).toString(2)
    if (index < enableParam_3.length && ((enableParam >> index) & 1) > 0) {
        return true;
    }
    return false;
}

userRole.prototype.setToFixed = function (val) {
    if (typeof val != 'undefined' && val != null) {
        this.toFixed_ = val;
    }
}

userRole.prototype.getToFixed = function () {
    return this.toFixed_;
}
//
//按位判断权限
//是否拥有某个报警（按位操作避免cookie 太多 浏览器异常）  第一位 墨镜失效;  第二位 安全处理报表（实时监控屏蔽ai历史处理）
// 第三位表示安全处理是独立还是报表界面       第四位  政府平台查岗  第五位  是否道路超速规则显示
/**
 * 第一位 墨镜失效;  第二位 安全处理报表（实时监控屏蔽ai历史处理）
 * 第三位表示安全处理是独立还是报表界面       第四位  政府平台查岗  第五位  是否道路超速规则显示 第六位 是否华宝报表前加入抬头(部分界面修改单选车辆)
 * 第七位 渣土车   第8位   定制过检GPS监控多个轨迹按钮警情查询多io报警
 * 第9位  主账号是否允许删除车辆   第10位  运营看板   第11位  安全看板  第12位  出租车看板  第13位  出租车云屏
 * 第14位  数据看板  第15位  监管看板 第16位  是否隐藏点线面全局共享 第17位  允许车辆到期监控 第18位 开启电子锁报表及冒泡菜单 19位智慧渣土 20位删除媒体文件
 * 第21位 统计所有轨迹超速报警  第22位 是否开启手机短信验证码 第23位 是否开启校车管理 第24位 是否开启IC卡信息 第25位 是否开启智慧约车 第26位  清楚已处理实时报警
 * index 从0开始
 */
userRole.prototype.isHaveRole = function (index) {
    if (((this.alarmParam_ >> index) & 1) > 0) {
        return true;
    }
    return false;
}

//第四位
userRole.prototype.isGovernmentHandle_ = function () {
    return ((this.alarmParam_ >> 3) & 1) > 0;
}

//ai安全处理报表  独立模块 2位
userRole.prototype.isAiAlarmHandleAlone = function () {
    return ((this.alarmParam_ >> 2) & 1) > 0;
}

//是否具备ai安全处理报表  1位
userRole.prototype.isAiAlarmHandle = function () {
    return ((this.alarmParam_ >> 1) & 1) > 0;
}

//是否启用 墨镜失效  报警  0位
userRole.prototype.isIsSunglassFailure = function () {
    return (this.alarmParam_ & 1) > 0;
}

/**
 * 是否显示V9大屏布控
 * @returns {boolean}
 */
userRole.prototype.isShowControlPeople = function () {
    return (this.alarmParam_ & 1) > 0;
}

/**
 * 是否显示V9大屏区域
 * @returns {boolean}
 */
userRole.prototype.showRegion = function () {
    return ((this.alarmParam_ >> 1) & 1) > 0;
}


/**
 * 账号是否拥有车辆(警员)添加/删除权限
 * @param type bit0添加权限  bit1删除权限 bit2 用户公司增加车辆权限
 * @returns {boolean}
 */
userRole.prototype.hasVehiAddDelAuth = function (type) {
    var auth = false;
    type = type ? type : 0;
    if (!!this.vehiAddDel && ((this.vehiAddDel >> type) & 1) > 0) {
        auth = true;
    }
    return auth;
}

/**
 * 账号是否拥有车辆(警员)添加/删除权限
 * @returns {boolean}
 */
userRole.prototype.setVehiAddDelAuth = function (val) {
    if (!!val) {
        this.vehiAddDel = val;
    }
}


userRole.prototype.setAlarmParam = function (val) {
    if (typeof val != 'undefined' && val != null) {
        this.alarmParam_ = val;
    }
}


userRole.prototype.setIsBackVedioGps = function (val) {
    if (typeof val != 'undefined' && val != null && val == 3) {
        this.backVedioGps_ = true;
    }
}

userRole.prototype.IsBackVedioGps = function (val) {
    return this.backVedioGps_
}

userRole.prototype.setIsRealVedioGps = function (val) {
    if (typeof val != 'undefined' && val != null && val == 3) {
        this.realVedioGps_ = true;
        this.realMap = true;
    }
    if (typeof val != 'undefined' && val != null && val == 1) {
        this.realMap = true;
    }

}

userRole.prototype.IsRealVedioGps = function (val) {
    return this.realVedioGps_
}

userRole.prototype.IsRealMap = function () {
    return this.realMap;
}

userRole.prototype.setIsLoadMapFence = function (val) {
    if (typeof val != 'undefined' && val != null && val == 1
        && this.isEnableRole(2)) {
        this.loadMapFence_ = true;
    }
}
//是否加载围栏到地图上
userRole.prototype.isIsLoadMapFence = function () {
    return this.loadMapFence_;
}

//是否开启智慧约车
userRole.prototype.isEnable905 = function () {
    return this.isHaveRole(24);
}

userRole.prototype.setIsDispatcher = function (val) {
    if (typeof val != 'undefined' && val != null && val == 1) {
        this.isDispatcher_ = true;
    }
}
//单兵平台下的警员
userRole.prototype.isDispatcher = function () {
    return this.isDispatcher_ && this.isPolice_;
}


userRole.prototype.setGeoAddress = function (val) {
    if (typeof val != 'undefined' && val != null && val == 1
        && this.isEnableRole(21)) {
        this.isGeoAddress_ = true;
    }
}

userRole.prototype.getGeoAddress = function () {
    return this.isGeoAddress_;
}

userRole.prototype.setSTY = function (val) {
    if (typeof val != 'undefined' && val != null && val == 1
        && this.isEnableRole(10)) {
        this.isSTY = true;
    }
}

userRole.prototype.getSTY = function () {
    return this.isSTY;
}


userRole.prototype.setLoginName = function (name) {
    if (typeof name != 'undefined' && name != null) {
        this.longinName_ = name;
    }
}

userRole.prototype.getLoginName = function () {
    return this.longinName_;
}


//设置通用用版本是否有警员管理
userRole.prototype.setIsPoliceOperation = function (policeOperation) {
    if (typeof policeOperation != 'undefined' && policeOperation != null && policeOperation == 1
        && this.isEnableRole(0)) {
        this.isPoliceOperation_ = true;
    }
}
//是否存在警员管理
userRole.prototype.isPoliceOperation = function () {
    return this.isPoliceOperation_;
}


//设置fanghao
userRole.prototype.setIsFangHao = function (fangHao) {
    if (typeof fangHao != 'undefined' && fangHao != null && fangHao == 1
        && this.isEnableRole(20)) {
        thisgetNavPage.isFangHao_ = true;
    }
}


//赋值权限
userRole.prototype.setPrivileges = function (privilege) {
    if (typeof privilege != 'undefined' && privilege != null) {
        this.privileges = privilege.split(',');
    }
}

//赋值管理员
userRole.prototype.setIsAdmin = function (isAdmin) {
    if (typeof isAdmin != 'undefined' && isAdmin != null && isAdmin == 0) {
        this.isAdmin_ = true;
    }
}

//赋值管理员
userRole.prototype.setIsMaster = function (isMaster) {
    if (typeof isMaster != 'undefined' && isMaster != null && isMaster == 0) {
        this.isMaster_ = true;
    }
}


userRole.prototype.setIsRegionUser = function (isRegionUser) {
    if (typeof isRegionUser != 'undefined' && isRegionUser != null && isRegionUser == 1) {
        this.isRegionUser_ = true;
    }
}

//赋值一级公司用户
userRole.prototype.setIsFirstCompany = function (isFirstCompany) {
    if (typeof isFirstCompany != 'undefined' && isFirstCompany != null && isFirstCompany == 0) {
        this.isFirstCompany_ = true;
    }
}

//赋值当前账号是否单点登录
userRole.prototype.setIsChangePsw = function (isChangePsw) {
    if (typeof isChangePsw != 'undefined' && isChangePsw != null && isChangePsw == 1) {
        this.isChangePsw_ = false;
    }
}


//赋值二级公司用户
userRole.prototype.setIsSecondCompany = function (isSecondCompany) {
    if (typeof isSecondCompany != 'undefined' && isSecondCompany != null && isSecondCompany == 0) {
        this.isSecondCompany_ = true;
    }
}

//赋值三级公司用户
userRole.prototype.setIsThreeCompany = function (isThreeCompany) {
    if (typeof isThreeCompany != 'undefined' && isThreeCompany != null && isThreeCompany == 0) {
        this.isThreeCompany_ = true;
    }
}

//赋值是否有添加行政区域
userRole.prototype.setHasAddArea = function (hasAddArea) {
    if (typeof hasAddArea != 'undefined' && hasAddArea != null && hasAddArea == 0
        && this.isEnableRole(4)) {
        this.hasAddArea_ = true;
    }
}

userRole.prototype.setHasLine = function (hasLine) {
    if (typeof hasLine != 'undefined' && hasLine != null && hasLine == 0
        && this.isEnableRole(5)) {
        this.hasLine_ = true;
    }
}

//赋值是否有添加道路规则
userRole.prototype.setHasRoadRule = function (hasRoadRule) {
    if (typeof hasRoadRule != 'undefined' && hasRoadRule != null && hasRoadRule == 0
        && this.isEnableRole(6)) {
        this.hasRoadRule_ = true;
    }
}

//赋值是否允许所有人管理车辆设备
userRole.prototype.setIsAllowManage = function (isAllowManage) {
    if (this.isEnableRole(3)) {
        this.isAllowManage_ = true;
    }
}

//赋值是否有管理线路和线路报表的权限
userRole.prototype.setIsManageLine = function (isManageLine) {
    if (typeof isManageLine != 'undefined' && isManageLine != null && isManageLine == 1
        && this.isEnableRole(7)) {
        this.isManageLine_ = true;
    }
}

//赋值是否危化品监管平台
userRole.prototype.setIsChemicals = function (isChemicals) {
    if (typeof isChemicals != 'undefined' && isChemicals != null && isChemicals == 1
        && this.isEnableRole(8)) {
        this.isChemicals_ = true;
    }
}

//赋值是否环卫车平台
userRole.prototype.setIsSanitationTruck = function (isSanitationTruck) {
    if (typeof isSanitationTruck != 'undefined' && isSanitationTruck != null
        && isSanitationTruck == 1 && this.isEnableRole(13)) {
        this.isSanitationTruck_ = true;
    }
}

//赋值是否第三方监管平台
userRole.prototype.setIsGov = function (isGov) {
    if (typeof isGov != 'undefined' && isGov != null
        && isGov == 1 && this.isEnableRole(19)) {
        this.isGov_ = true;
    }
}
//赋值是否企业违规上报
userRole.prototype.setIsOpenEnterprisesViolations = function (isOpenEnterprisesViolations) {
    if (typeof isOpenEnterprisesViolations != 'undefined' && isOpenEnterprisesViolations != null
        && isOpenEnterprisesViolations == 1 && this.isEnableRole(26)) {
        this.isOpenEnterprisesViolations_ = true;
    }
}
//赋值是否支持行政区域
userRole.prototype.setIsOpenRegion = function (isOpenRegion) {
    if (typeof isOpenRegion != 'undefined' && isOpenRegion != null
        && isOpenRegion == 1 && this.isEnableRole(27)) {
        this.isOpenRegion_ = true;
    }
}
//赋值是否支持停运上报
userRole.prototype.setIsOpenRunStop = function (isOpenRunStop) {
    if (typeof isOpenRunStop != 'undefined' && isOpenRunStop != null
        && isOpenRunStop == 1 && this.isEnableRole(28)) {
        this.isOpenRunStop_ = true;
    }
}

//赋值是否有警员管理
userRole.prototype.setIsPolice = function (isPolice_) {
    if (typeof isPolice_ != 'undefined' && isPolice_ != null
        && isPolice_ == 1 && this.isEnableRole(9)) {
        this.isPolice_ = true;
    }
}

//赋值是否有渣土车
userRole.prototype.setIsMuck = function (isMuck_) {
    if (typeof isMuck_ != 'undefined' && isMuck_ != null
        && isMuck_ == 1 && this.isEnableRole(12)) {
        this.isMuck_ = true;
    }
}
//赋值是否有新疆
userRole.prototype.setIsXinJiang = function (isXinJiang_) {
    if (typeof isXinJiang_ != 'undefined' && isXinJiang_ != null
        && isXinJiang_ == 1 && this.isEnableRole(17)) {
        this.isXinJiang_ = true;
    }
}

//赋值是否有海距
userRole.prototype.setIsHaiJu = function (isHaiJu_) {
    if (typeof isHaiJu_ != 'undefined' && isHaiJu_ != null
        && isHaiJu_ == 1 && this.isEnableRole(18)) {
        this.isHaiJu_ = true;
    }
}

//赋值是否有海距
userRole.prototype.setIsHaiJu = function (isCheckRule_) {
    if (typeof isCheckRule_ != 'undefined' && isCheckRule_ != null
        && isCheckRule_ == 1 && this.isEnableRole(18)) {
        this.isHaiJu_ = true;
    }
}

//赋值是否有屏蔽报警
userRole.prototype.setShieldReport = function (isShieldReport_) {
    if (typeof isShieldReport_ != 'undefined' && isShieldReport_ != null
        && isShieldReport_ == 1 && this.isEnableRole(1)) {
        this.isShieldReport_ = true;
    }
}


//赋值是否有新天地
userRole.prototype.setIsXinTianDi = function (isXinTianDi_) {
    if (typeof isXinTianDi_ != 'undefined' && isXinTianDi_ != null
        && isXinTianDi_ == 1 && this.isEnableRole(14)) {
        this.isXinTianDi_ = true;
    }
}

//赋值是否云南省道路运政管理信息系统
userRole.prototype.setIsYunNanTransport = function (isYunNanTransport_) {
    if (typeof isYunNanTransport_ != 'undefined' && isYunNanTransport_ != null
        && isYunNanTransport_ == 1 && this.isEnableRole(15)) {
        this.isYunNanTransport_ = true;
    }
}

// 是否政府平台项目
userRole.prototype.setIsVehiInternet = function (isVehiInternet_) {
    if (typeof isVehiInternet_ != 'undefined' && isVehiInternet_ != null
        && isVehiInternet_ == 1 && this.isEnableRole(11)) {
        this.isVehiInternet = true;
    }
}

//赋值是否中石油运单
userRole.prototype.setIsZSYRoadList = function (isZSYRoadList_) {
    if (typeof isZSYRoadList_ != 'undefined' && isZSYRoadList_ != null
        && isZSYRoadList_ == 1 && this.isEnableRole(16)) {
        this.isZSYRoadList_ = true;
    }
}

//赋值公司级别
userRole.prototype.setCompanyLevel = function (companyLevel) {
    this.companyLevel_ = companyLevel;
}

//赋值公司审核状态
userRole.prototype.setCompanyVerify = function (companyVerify) {
    this.companyVerify_ = companyVerify;
}

//设置百度地图api key
userRole.prototype.setBaiDuWebAPIKey = function (baiDuWebAPIKey) {
    this.baiDuWebAPIKey_ = baiDuWebAPIKey;
}

//设置谷歌地图api key
userRole.prototype.setGoogleWebAPIKey = function (googleWebAPIKey) {
    this.googleWebAPIKey_ = googleWebAPIKey;
}

//设置高德地图api key
userRole.prototype.setGaoDeWebAPIKey = function (gaoDeWebAPIKey) {
    this.gaoDeWebAPIKey_ = gaoDeWebAPIKey;
}

//设置四维地图api key
userRole.prototype.setSiWeiWebAPIKey = function (siWeiWebAPIKey) {
    this.siWeiWebAPIKey_ = siWeiWebAPIKey;
}

//设置解析地理位置类型
userRole.prototype.setGeocoderMapType = function (geocoderMapType) {
    this.geocoderMapType_ = geocoderMapType;
}

//设置默认解析地理位置类型
userRole.prototype.setDefaultGeocoderMapType = function (defaultGeocoderMapType) {
    this.defaultGeocoderMapType_ = defaultGeocoderMapType;
}

//赋值危化权限
userRole.prototype.setChemicalPrivileges = function (privilege) {
    if (typeof privilege != 'undefined' && privilege != null) {
        this.chemicalPrivilege = privilege;
    }
}

//设置速度单位
userRole.prototype.setVelocityType = function (velocityType) {
    if (typeof velocityType != 'undefined' && velocityType != null) {
        this.velocityType_ = velocityType;
    }
}

//是否管理员
userRole.prototype.isAdmin = function () {
    return this.isAdmin_;
}

//是否公司主账户
userRole.prototype.isMaster = function () {
    return this.isMaster_;
}

//是否普通用户
userRole.prototype.isNormal = function () {
    return !this.isAdmin_ && !this.isMaster_;
}

//是否行政区域用户
userRole.prototype.isRegionUser = function () {
    return this.isRegionUser_;
}

//是否一级公司用户
userRole.prototype.isFirstCompany = function () {
    return this.isFirstCompany_;
}

//当前登录账号是否可以修改密码
userRole.prototype.isChangePsw = function () {
    return this.isChangePsw_;
}


//是否二级公司用户
userRole.prototype.isSecondCompany = function () {
    return this.isSecondCompany_;
}

//是否三级公司用户
userRole.prototype.isThreeCompany = function () {
    return this.isThreeCompany_;
}

//是否有添加行政区域
userRole.prototype.hasAddArea = function () {
    return this.hasAddArea_;
}

userRole.prototype.hasLine = function () {
    return this.hasLine_;
}

//是否有添加道路规则
userRole.prototype.hasRoadRule = function () {
    return this.hasRoadRule_;
}

//是否允许所有人管理车辆设备
userRole.prototype.isAllowManage = function () {
    return this.isAllowManage_;
}

//是否有管理线路和线路报表的权限
userRole.prototype.isManageLine = function () {
    return this.isManageLine_;
}

//是否危化品监管平台
userRole.prototype.isChemicals = function () {
    return this.isChemicals_;
}

//是否环卫车平台
userRole.prototype.isSanitationTruck = function () {
    return this.isSanitationTruck_;
}
//是否第三方监管平台
userRole.prototype.isGov = function () {
    return this.isGov_;
}
//是否企业违规上报
userRole.prototype.isOpenEnterprisesViolations = function () {
    return this.isOpenEnterprisesViolations_;
}
//是否企业违规上报
userRole.prototype.isOpenEnterprisesViolationsEx = function () {
    return this.isOpenEnterprisesViolations_ && this.isPermit(46);
}
//是否支持行政区域
userRole.prototype.isOpenRegion = function () {
    return this.isOpenRegion_;
}
//是否支持停运上报
userRole.prototype.isOpenRunStop = function () {
    return this.isOpenRunStop_ && this.isPermit(900);
}
//是否支持围栏线路
userRole.prototype.isOpenFenceLine = function () {
    return this.isEnableRole(31);
}
//是否新天地
userRole.prototype.isXinTianDi = function () {
    return this.isXinTianDi_;
}

//是否云南省道路运政管理信息系统
userRole.prototype.isYunNanTransport = function () {
    return this.isYunNanTransport_;
}

// 是否政府平台项目
userRole.prototype.isVehiInternet = function () {
    return this.isVehiInternet;
}

//是否中石油运单
userRole.prototype.isZSYRoadList = function () {
    var showZsy = true;
    if (typeof LeftNav !== 'undefined') {
        showZsy = LeftNav && (LeftNav.vType === 'v0');
    }
    return this.isZSYRoadList_ && (showZsy);
}

//是否物流公司
userRole.prototype.isLogisticCompany = function () {
    if (!this.isAdmin_ && this.companyLevel_ && this.companyLevel_ == 1) {
        return true;
    }
    return false;
}

//是否生产仓储公司
userRole.prototype.isProduceCompany = function () {
    if (this.companyLevel_ && this.companyLevel_ == 5) {
        return true;
    }
    return false;
}

//是否交通部门
userRole.prototype.isTrafficCompany = function () {
    if (this.companyLevel_ && this.companyLevel_ == 6) {
        return true;
    }
    return false;
}

//是否交警部门
userRole.prototype.isTrafficPoliceCompany = function () {
    if (this.companyLevel_ && this.companyLevel_ == 7) {
        return true;
    }
    return false;
}

//是否安监部门
userRole.prototype.isSafetyCompany = function () {
    if (this.companyLevel_ && this.companyLevel_ == 8) {
        return true;
    }
    return false;
}

//是否环保部门
userRole.prototype.isEnvironmentallyCompany = function () {
    if (this.companyLevel_ && this.companyLevel_ == 9) {
        return true;
    }
    return false;
}

//是否应急救援中心
userRole.prototype.isRescueCompany = function () {
    if (this.companyLevel_ && this.companyLevel_ == 10) {
        return true;
    }
    return false;
}

//是否公安部门
userRole.prototype.isPublicPoliceCompany = function () {
    if (this.companyLevel_ && this.companyLevel_ == 13) {
        return true;
    }
    return false;
}

//是否监管部门用户
userRole.prototype.isSupervisionCompany = function () {
    if (this.companyLevel_ && this.companyLevel_ == 15) {
        return true;
    }
    return false;
}
//公司是否已审核
userRole.prototype.getCompanyVerify = function () {
    return this.companyVerify_;
}

//是否存在警员管理
userRole.prototype.isPolice = function () {
    return this.isPolice_;
}

//赋值是否有渣土车
userRole.prototype.isMuck = function () {
    return this.isMuck_;
}

//赋值是否新疆平台
userRole.prototype.isXinJiang = function () {
    return this.isXinJiang_;
}

//赋值是否新疆平台
userRole.prototype.isHaiJu = function () {
    return this.isHaiJu_;
}

//赋值是否屏蔽报警
userRole.prototype.isShieldReport = function () {
    return this.isShieldReport_;
}

//获取百度地图api key
userRole.prototype.getBaiDuWebAPIKey = function () {
    return this.baiDuWebAPIKey;
}

//获取谷歌地图api key
userRole.prototype.getGoogleWebAPIKey = function () {
    return this.googleWebAPIKey;
}

//获取高德地图api key
userRole.prototype.getGaoDeWebAPIKey = function () {
    return this.gaoDeWebAPIKey;
}

//获取四维地图api key
userRole.prototype.getSiWeiWebAPIKey = function () {
    return this.siWeiWebAPIKey;
}

//获取解析地理位置类型
userRole.prototype.getGeocoderMapType = function () {
    return this.geocoderMapType_;
}

//获取默认解析地理位置类型
userRole.prototype.getDefaultGeocoderMapType = function () {
    return this.defaultGeocoderMapType_;
}

//获取速度单位
userRole.prototype.getVelocityType = function () {
    return this.velocityType_;
}

//用户是否有规则的权限（电子围栏）
userRole.prototype.isMapFenceManageSupport = function () {
    return this.isPermit(5);
}

//用户是否有轨迹回放
userRole.prototype.isTrackPlaybackSupport = function () {
    return this.isPermit(6);
}

//用户是否有录像回放
userRole.prototype.isRecordPlaybackSupport = function () {
    return this.isPermit(641);
}
//用户是否有车辆修改权限
userRole.prototype.isHasVehiModify = function () {
    return this.isPermit(48) || this.isPermit(140);
}

//用户是否有查岗规则权限
userRole.prototype.isCheckRule = function () {
    return this.isPermit(650);
}

//用户是否有公司信息的权限
userRole.prototype.isCompanyManageSupport = function () {
    return this.isPermit(31);
}

//用户是否有角色管理的权限
userRole.prototype.isRoleManageSupport = function () {
    return this.isPermit(32) || this.isPermit(133);
}

//用户是否有用户信息的权限
userRole.prototype.isUserManageSupport = function () {
    return this.isPermit(33);
}

//用户是否有IC卡管理的权限
userRole.prototype.isICCardManageSupport = function () {
    return this.isPermit(313) && this.isHaveRole(23);
}

//用户是否有操作视频的权限
userRole.prototype.isVideoSupport = function () {
    return this.isPermit(621);
}

//用户是否有操作对讲的权限
userRole.prototype.isTalkbackSupport = function () {
    return this.isPermit(623);
}

//用户是否有操作监听的权限
userRole.prototype.isMonitorSupport = function () {
    return this.isPermit(624);
}

//用户是否有操作抓拍的权限
userRole.prototype.isCaptureSupport = function () {
    return this.isPermit(625);
}

//用户是否有操作下发文字信息的权限
userRole.prototype.isTTSSupport = function () {
    return this.isPermit(656);
}

//用户是否有操作设备信息查看的权限
userRole.prototype.isDevInfoSupport = function () {
    return this.isPermit(652);
}

//用户是否有操作参数配置的权限
userRole.prototype.isParamConfigSupport = function () {
    return this.isPermit(651);
}

//用户是否有 多媒体权限
userRole.prototype.isParamConfigVehicleMedia = function () {
    return this.isPermit(224);
}

//用户是否有操作电话回拨的权限  危化物流公司
userRole.prototype.isPhoneCallbackSupport = function () {
    return !this.isChemicals_ || (this.isChemicals_ && (this.isAdmin_ || this.isLogisticCompany()));
}

//用户是否有操作设备升级的权限
userRole.prototype.isDevUpgradeSupport = function () {
    return this.isPermit(653);
}

//用户是否有操作GPS上报间隔的权限
userRole.prototype.isGPSReportIntervalSupport = function () {
    return this.isPermit(659);
}

//用户是否有操作tpms 胎压监测的权限
userRole.prototype.isTpmsSupport = function () {
    return this.isPermit(659);
}

//用户是否有操作 WiFi配置诊断 的权限   657
userRole.prototype.isWifiApplication = function () {
    return this.isPermit(657);
}

//用户是否有下发车辆信息的权限（云南省道路运政管理信息系统）
userRole.prototype.isVehicleInfoIssued = function () {
    return this.isPermit(656) && this.isYunNanTransport_;
}

//用户是否有操作WIFI下载任务设置的权限 657
userRole.prototype.isWifiConfigSupport = function () {
    return this.isPermit(657);
}

//用户是否有操作车辆控制的权限
userRole.prototype.isVehicleControlSupport = function () {
    return this.isPermit(659);
}

//用户是否有操作油量配置的权限
userRole.prototype.isOilConfigSupport = function () {
    return this.isPermit(658) && (!this.isChemicals_ || (this.isChemicals_ && (this.isAdmin_ || this.isLogisticCompany())));
}

//用户是否有操作流量配置和统计的权限
userRole.prototype.is3GConfigSupport = function () {
    return this.isPermit(654);
}

//用户是否有操作划区域操作的权限
userRole.prototype.isDrawAreaSupport = function () {
    return !this.isChemicals_ || (this.isChemicals_ && (this.isAdmin_ || this.isLogisticCompany()));
}

//用户是否有操作运单信息的权限
userRole.prototype.isFindWaybillSupport = function () {
    return this.isChemicals_
        && (this.isLogisticCompany() || this.isAdmin_
            || this.isProduceCompany() || this.isChemicalPermit(0))
}

//用户是否有操作报警联动的权限
userRole.prototype.isAlarmLinkageSupport = function () {
    return this.isPermit(661);
}

//用户是否有操作报警屏蔽的权限
userRole.prototype.isAlarmMaskSupport = function () {
    return this.isPermit(662);
}

//用户是否有报警弹窗的权限
userRole.prototype.isAlarmDialogSupport = function () {
    return this.isPermit(681);
}

//用户是否有操作录像的权限
userRole.prototype.isRecordingSupport = function () {
    return this.isPermit(627);
}

//用户是否有操作移动侦测的权限
userRole.prototype.isMotionSupport = function () {
    return this.isPermit(655);
}

//用户是否有操作警员管理的权限
userRole.prototype.isPeopleSupport = function () {
    return this.isPermit(13);
}

//用户是否有操作报警屏蔽的权限
userRole.prototype.isAlarmScreen = function () {
    return !this.isPermit(662);
}

//用户是否有操作报警处理的权限
userRole.prototype.isAlarmHandle = function () {
    return this.isAdmin() || this.isMaster() || !this.isPermit(680);
}

//用户是否部门管理权限 用车申请
userRole.prototype.isZSYUseCar = function () {
    return !this.isPermit(665) && this.isPermit(667);
}
//用户是否部门管理权限审批管理
userRole.prototype.isZSYApprovalCar = function () {
    return !this.isPermit(668) && this.isPermit(667);
}
//用户是否部门管理权限派车管理
userRole.prototype.isZSYSendCar = function () {
    return !this.isPermit(666) && this.isPermit(667);
}

//用户是否有我的地图管理权限
userRole.prototype.isMyMapSupport = function () {
    return this.isPermit(611);
}

//用户是否有视频声音播放的权限
userRole.prototype.isVideoSoundSupport = function () {
    return this.isPermit(622);
}

//用户是否有云台控制的权限
userRole.prototype.isVideoPTZSupport = function () {
    return this.isPermit(626);
}

//用户是否有打开或者关闭云台灯光的权限
userRole.prototype.isVideoLightsSupport = function () {
    return this.isPermit(628);
}
//用户是否有广播权限
userRole.prototype.isVideoBroadcastSupport = function () {
    return this.isPermit(629);
}

//用户是否有视频轮询权限
userRole.prototype.isVideoPollSupport = function () {
    return this.isPermit(630);
}
//用户查看车辆定位 调度员
userRole.prototype.isMapPosition = function () {
    return this.isPermit(613);
}
//调度员换组
userRole.prototype.isChangeGroup = function () {
    return this.isPermit(700);
}
//强拉
userRole.prototype.isDispatchPush = function () {
    return this.isPermit(701);
}
//强拆
userRole.prototype.isDispatchPop = function () {
    return this.isPermit(702);
}
//群呼
userRole.prototype.isDispatchGroupCall = function () {
    return this.isPermit(703);
}
//主动安全监控
userRole.prototype.isSafetyMonitor = function () {
    return this.isPermit(18) && this.isEnableSafetyMonitor();
}
//智慧云屏
userRole.prototype.isWisdomScreen = function () {
    return this.isPermit(19) && this.isEnableCloudScreen();
}
//安全云屏
userRole.prototype.isSafeCloudScreen = function () {
    return this.isPermit(20) && this.isEnableSafeCloudScreen();
}

// 出租车云屏
userRole.prototype.isTaxiCloudScreen = function () {
    return this.isPermit(164) && this.isHaveRole(12);
}
// 运营看板
userRole.prototype.isOperationBoard = function () {
    return this.isPermit(161) && this.isHaveRole(9);
}
// 安全看板
userRole.prototype.isSafetyBoard = function () {
    return this.isPermit(162) && this.isHaveRole(10);
}

// 出租车看板
userRole.prototype.isTaxiBoard = function () {
    return this.isPermit(163) && this.isHaveRole(11);
}
//数据看板
userRole.prototype.isDataBoard = function () {
    var dataBoard = this.isPolice() ? this.isHaveRole(2) : this.isHaveRole(13);
    return this.isPermit(165) && dataBoard;
}

// 到期提醒
userRole.prototype.isExpirationReminder = function () {
    return this.isPermit(310) && this.isEnableOperationMaturity();
}

// 渣土看板
userRole.prototype.isDirtTruckBoard = function () {
    return this.isPermit(556);
}
// 监管看板
userRole.prototype.isSupervisionBoard = function () {
    return this.isPermit(166) && this.isHaveRole(14);
}
// 监管云屏
userRole.prototype.isSupervisionCloudScreen = function () {
    return this.isPermit(167) && this.isEnableSupervisionScreen();
}
// 渣土云屏
userRole.prototype.isMuckScreen = function () {
    return this.isPermit(168) && this.isEnableDirtTruck() && this.isEnableRole(33);
}

// 流向大屏
userRole.prototype.isDirectionScreen = function () {
    return this.isPermit(169) && this.isEnableDirtTruck() && this.isEnableRole(34);
}

//智慧渣土-工厂管理，收纳场管理
userRole.prototype.isDirtTruckSiteConsumption = function () {
    return this.isPermit(551) && this.isEnableDirtTruck();
}

// 水位配置
userRole.prototype.isWaterConfiguration = function () {
    return this.isPermit(660);
}

//809查岗， 非中文或者没有800权限都不具有功能
userRole.prototype.isGovernmentHandle = function () {
    //先从Cookie中获取语言参数
    var isChinese = false;
    var local;
    if (typeof lang === 'undefined') {
        local = GetCookie("language");
    } else {
        local = lang.langType;
    }
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

    if (local.indexOf('CN') > -1 || local.indexOf('cn') > -1
        || local.indexOf('ZH') > -1 || local.indexOf('zh') > -1) {
        isChinese = true;
    }
    return this.isPermit(800) && isChinese && this.isGovernmentHandle_();
}


//是否有权限
userRole.prototype.isPermit = function (role) {
    var s = String.fromCharCode(2);
    var reg = new RegExp(s + role + s);
    return (reg.test(s + this.privileges.join(s) + s));
}

//是否有权限
userRole.prototype.isChemicalPermit = function (role) {
    return (this.chemicalPrivilege >> role) & 1 > 0;
}

/**
 * 是否启用允许车辆到期监控
 */
userRole.prototype.enableAllowExpirationMonitoring = function () {
    // return (this.isPolice() && this.isHaveRole(4)) || (!this.isPolice() && this.isHaveRole(16)) || this.isAdmin();
    if(this.isAdmin() || (this.isPolice() && this.isHaveRole(4))){
        return true;
    }
    return this.enableAllowExpirationMonitor;
}

//是否启用允许车辆到期监控
userRole.prototype.setEnableAllowExpirationMonitor = function (val) {
    if (typeof val != 'undefined' && val != null && val == 1) {
        this.enableAllowExpirationMonitor = true;
    }
}

/**
 * 是否启用电子锁报表
 * @param index
 * @returns {boolean}
 */
userRole.prototype.enableEleLock = function (index) {
    return !this.isPolice() && this.isHaveRole(17) && this.isPermit(852);
}


/**
 * 是否启用删除媒体文件
 * @param index
 * @returns {boolean}
 */
userRole.prototype.enableMediaDel = function () {
    return (this.isPolice() && this.isHaveRole(5)) || (!this.isPolice() && this.isHaveRole(19));
}

/**
 * 是否启用统计所有轨迹超速报警
 * @param index
 * @returns {boolean}
 */
userRole.prototype.enableAllTrackSpeedingAlarms = function () {
    return this.isHaveRole(20);
}

userRole.prototype.setVehiLogin = function (vehiLogin) {
    this.isVehiLogin_ = vehiLogin;
}

/**
 * 是否车牌号登录
 * @returns {any}
 */
userRole.prototype.isVehiLogin = function () {
    return this.isVehiLogin_;
}

/**
 * 是否开启手机短信验证码
 */
userRole.prototype.isEnableLoginVerificationCode = function () {
    return this.isHaveRole(21);
}

/**
 * 是否开启校车管理
 */
userRole.prototype.isEnableHasSchoolBus = function () {
    return this.isHaveRole(22);
}

/**
 * 运营大屏
 * @returns {boolean}
 */
userRole.prototype.isOperateScreen = function () {
    return this.isPermit(170) && this.isEnableRole(36);
}

/**
 * 安全大屏
 * @returns {boolean}
 */
userRole.prototype.isSafetyScreen = function () {
    return this.isPermit(171) && this.isEnableRole(37);
}

/**
 * 运营大屏3D
 * @returns {boolean}
 */
userRole.prototype.isOperateScreen3D = function () {
    return this.isPermit(173) && this.isEnableRole(38);
}

/**
 * 安全大屏3D
 * @returns {boolean}
 */
userRole.prototype.isSafetyScreen3D = function () {
    return this.isPermit(174) && this.isEnableRole(39);
}

/**
 * 是否上海警佳
 * @returns {boolean}
 */
userRole.prototype.isEnableShanghaiLinJia = function () {
    return this.isPolice() && this.isHaveRole(6);
}

/**
 * 是否实赣
 * @returns {boolean}
 */
userRole.prototype.isEnableShiGan = function () {
    return !this.isPolice() && this.isHaveRole(26);
}

/**
 * 是否校验用户名、身份证
 * @param idCard
 */
userRole.prototype.setEnableCheckIdCard = function (idCard) {
    this.checkIdCard = idCard == 1;
}

userRole.prototype.isEnableCheckIdCard = function () {
    return this.checkIdCard;
}

/**
 * 设置客户ID
 * @param customerId 客户ID
 */
userRole.prototype.setCustomId = function (customerId) {
    this.customerId = customerId;
}

/**
 * 纳可
 * @returns {boolean}
 */
userRole.prototype.isCustomNake = function () {
    return this.customerId == 1;
}


userRole.prototype.setEnableGpsParsingLicheng = function (val) {
    if (typeof val != 'undefined' && val != null && val == 1) {
        this.enableGpsParsingLicheng = true;
    }
}

/**
 * 是否启用GPS解析里程
 */
userRole.prototype.isEnableGpsParsingLicheng = function () {
    return this.enableGpsParsingLicheng;
}

userRole.prototype.setIsEnableDebug = function (val) {
    if (typeof val != 'undefined' && val != null && val == 1) {
        this.isEnableDebug = true;
    }
}

userRole.prototype.isEnableDebugEx = function () {
    return this.isEnableDebug;
}


//用户是否支持普货车辆录入
userRole.prototype.isCargoAddSupport = function () {
    return this.isPermit(643) && this.hasVehiAddDelAuth(2);
}

//用户是否支持批量导入修改
userRole.prototype.isImportantEditSupport = function () {
    return this.isPermit(644);
}

//用户是否支持服务到期日修改
userRole.prototype.isServiceExpirationDateEditSupport = function () {
    return this.isPermit(646);
}

//是否支持疫情分析
userRole.prototype.isEpidemicSupport = function () {
    return this.isEnableRole(41);
}

//web登录是否启用疫情大屏
userRole.prototype.isEnableEpidemicScreen = function () {
    return this.isPermit(175) && this.isEnableRole(40);
}

//是否取消校验司机联系方式
userRole.prototype.isEnableCancelCheckDriverContact = function () {
    return this.isHaveRole(27);
}

//是否显示v9可视化大屏
userRole.prototype.isShowV9DataBigScreen = function () {
    return this.isHaveRole(7) && this.isPermit(17);
}

// 数据汇总看板
userRole.prototype.isDataSummaryBoard = function () {
    return this.isPermit(720) && this.isPolice();
}

// 启用规则绑定公司
userRole.prototype.isEnableRuleBindCompany = function () {
    return this.isHaveRole(28);
}

// 规则添加
userRole.prototype.isCanAddRule = function () {
    return this.isPermit(677);
}