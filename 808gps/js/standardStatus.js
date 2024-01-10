var rootElement = _getRootFrameElement();

/**
 * 设备状态类，每个设备里面有对应一个状态，每个报警里对应一个开始状态和1个结束状态
 */
function standardStatus(devIdno) {
    this.devIdno = devIdno;		//设备编号
    this.online = null;			//在线状态
    this.youLiang = null;		//油量
    this.speed = null;			//速度/（人员设备时为电池电量）
    this.liCheng = null;			//里程
    this.huangXiang = null;    	//航向
    this.status1 = null;      	//车辆状态1
    this.status2 = null;       //车辆状态2  环卫车（平台产生）12位作业状态 1作业中 0空闲 13位高峰作业 1高峰作业 14,15,16表示作业次数
    this.status3 = null;       //车辆状态3
    this.status4 = null;       //车辆状态4
    this.tempSensor1 = null;      //设备温度
    this.tempSensor2 = null;       //车厢温度
    this.tempSensor3 = null;       //车厢温度
    this.tempSensor4 = null;       //车厢温度
    this.jingDu = null;			//经度
    this.weiDu = null; 			//纬度
    this.gaoDu = null;			//高度
    this.parkTime = null;		//停车时长
    this.mapJingDu = null;		//地图上显示的经度
    this.mapWeiDu = null; 		//地图上显示的纬度
    this.network = null;     //网络类型

    this.gpsTime = null;		//GPS时间
    this.gpsTimeStr = null;		//

    this.protocol = null;  //通信协议

    this.isDrowing = false;   //是否正在被画区域操作，画区域时不更新位置点
    this.isPeople = false; //是否是人员设备

    this.position = null; //地理位置
    this.diskType = null; ////硬盘类型
    this.index = null;   //车辆的序号
    this.vehiIdno = null; //车牌号

    //公交线路
    this.lineId = null; //线路id
    this.driverId = null; //司机id
    this.lineDirect = null; //线路方向 0上行 1下行
    this.stationFlag = null; //站点标识 0站点 1站场
    this.stationIndex = null; //站点索引
    this.stationStatus = null; //站点状态 0本站 1下站
    //obd
    this.obdRpm = null;//OBD采集发动机转速
    this.obdSpeed = null;//OBD采集发动机速度
    this.obdVotage = null;//OBD采集电池电压
    this.obdJQTemp = null;//OBD采集燃油进气温度
    this.obdStatus = null;//OBD采集状态
    this.obdJQMPos = null;//OBD采集节气门位置
    this.peopleUp = 0;//上车人数
    this.peopleDown = 0;//下车人数
    this.peopleCur = 0;//车上人数

    this.extraFlag = 0;//附加信息标志位 0-公交OBD 1-视频部标
    this.sensor1 = 0;
    this.sensor2 = 0;
    this.sensor3 = 0;
    this.sensor4 = 0;
    this.sensor5 = 0;
    this.sensor6 = 0;
    this.sensor7 = 0;
    this.sensor8 = 0;
    this.sensor9 = 0;
    this.sensor10 = 0;
    this.satellite = 0;//卫星数
    this.geoJingDu = null;//地理位置解析所用的经纬度信息
    this.geoWeiDu = null;

    //新增解析
    this.longGps = 0;//2时才解析后面的
    this.recvTime = null;////接收GPS的系统时间
    this.longStatus = 0;//状态位  0位:车厢温度  1位:IO状态位  2位:扩展车辆信号状态  3位:模拟量  4位:胎压
//	//		5位:主动安全ADAS  6位:主动安全DSM  7位:主动安全BSD
    this.compartmentTemp = 0;//车厢温度(0x06)
    this.ioStatus = 0;////IO状态位(0x2A)
    this.extraStatus = 0;//扩展车辆信号状态位(0x25)
    this.analogQuantity = 0;//模拟量(0x2B)
    this.adasAlarmL1 = 0;////主动安全adas报警状态位 一级
    this.adasAlarmL2 = 0;//主动安全adas报警状态位 二级
//	/* 	0：前向碰撞报警 	1：车道偏离报警 	2：车距过近报警 	3：行人碰撞报警 	4：频繁变道报警 	5：道路标识超限报警 	6：障碍物报警
//	7：弯道车速预警
//	*/
    this.dsmAlarmL1 = 0;//主动安全dsm报警状态位 一级
    this.dsmAlarmL2 = 0;//主动安全dsm报警状态位2级
//	/* 	0:疲劳驾驶报警 	1:接打电话报警 	2:抽烟报警 	3:长时间不目视前方报警 	4:系统不能正常工作报警  5:驾驶员未系安全带报警
//	6:驾驶员不在驾驶位报警 	7:驾驶员双手脱离方向盘报警  8:分神驾驶报警(苏) 9:驾驶员异常报警(苏)
//	*/
    this.bsdAlarmL1 = 0;//主动安全bsd报警状态位 一级
    this.bsdAlarmL2 = 0;//主动安全bsd报警状态位 2级
//	/* 	0：左侧盲区报警 	1：右侧盲区报警 	2：后方接近报警    //3：卫星定位--超过道路限速报警
//	*/
    // ADAS
    this.frontVehiSpeed = 0;//前车车速	单位 Km/h。范围 0~250，仅报警类型为 0x01 和 0x02 时	有效
    this.distinceTime = 0;//前车/行人距离	单位 100ms，范围 0~100仅报警类型为 0x01、0x02 和 0x04 时有效
    this.roadFlagData = 0;//道路标志识别数据
    this.deviationType = 0;//偏离类型(0:左侧 1:右侧)仅报警类型为 0x02 时有效
    this.roadFlagType = 0;//bit0-1 道路标志识别类型(0：限速标志 1：限高标志 2：限重标志)仅报警类型为 0x06 时有效    bit2: //分神驾驶报警 2级(平台)
    //bit3-bit6:智能检测(上海) bit3:车厢超载报警1级  bit4:车厢超载报警2级	bit5:站外上客报警1级  bit6:站外上客报警2级
    this.distractedDriving = 0;//分神驾驶报警 2级(平台)
    this.reserve = 0;	//预留
    // DSM
    this.fatigueLv = 0;//疲劳程度(1-10)
    this.yawningNum = 0;//打哈欠次数 范围1~10。报警结束上报 仅在报警类型为0x01时有效
    this.closedEyeTime = 0;//闭眼持续时长 单位100ms  报警结束上报 仅在报警类型为0x01时有效
    this.winkCount = 0;	//连续眨眼次数 范围1~100。报警结束上报 仅在报警类型为0x01时有效
    this.reserve2 = 0;//预留
    //16进制字符串
    this.tirePpressures = null;	//胎压(0x05)
//	private Short tirePpressure1;

    this.driveRecorderspeed = 0;

    this.driSw = null;//司机刷卡时间Date
    this.driverSwipeTimeStr = null;//司机刷卡时间Str
    this.driverJobNum = null;//司机从业资格证编号
    this.dinfo = null;//司机信息
    this.driverOperTime = null;//司机运营时间
    this.clockd = null; //打卡司机


    this.wayBill = null;// 电子路单
    this.viceYl = 0; //副油箱油量
    this.simulationYL = 0;// 模拟量
    this.water = 0; //水位
    this.initNumber();
}


/**
 * 后台与前台的属性映射，后台值为0的属性不会返回
 */
standardStatus.prototype.initNumber = function () {
    this.propertiesMap = {
        ol: {name: 'online', data: 0},//在线
        tsp: {name: 'driveRecorderspeed', data: 0},////行驶记录仪速度  	单位: km/h，使用中需先除以10。执法仪版本表示电量
        yl: {name: 'youLiang', data: 0},//油量
        sp: {name: 'speed', data: 0},//速度
        lc: {name: 'liCheng', data: 0},//里程
        hx: {name: 'huangXiang', data: 0},//航向
        s1: {name: 'status1', data: 0},	//车辆状态1
        s2: {name: 'status2', data: 0}, //车辆状态2   环卫车（平台产生）12位作业状态 1作业中 0空闲 13位高峰作业 1高峰作业14,15,16表示作业次数
        s3: {name: 'status3', data: 0}, //车辆状态3
        s4: {name: 'status4', data: 0},  //车辆状态4
        t1: {name: 'tempSensor1', data: 0}, //设备温度
        t2: {name: 'tempSensor2', data: 0}, //车厢温度
        t3: {name: 'tempSensor3', data: 0}, //车厢温度
        t4: {name: 'tempSensor4', data: 0}, //车厢温度
        gd: {name: 'gaoDu', data: 0}, //高度
        pk: {name: 'parkTime', data: 0}, //停车时长
        net: {name: 'network', data: null}, //网络类型
        lid: {name: 'lineId', data: 0},//线路id //公交线路
        drid: {name: 'driverId', data: 0}, //司机id
        dct: {name: 'lineDirect', data: 0}, //线路方向 0上行 1下行
        sfg: {name: 'stationFlag', data: 0}, //站点标识 0站点 1站场
        snm: {name: 'stationIndex', data: 0}, //站点索引
        sst: {name: 'stationStatus', data: 0},//站点状态 0到站 1出站
        or: {name: 'obdRpm', data: 0},//obd OBD采集发动机转速
        os: {name: 'obdSpeed', data: 0}, //OBD采集发动机速度
        ov: {name: 'obdVotage', data: 0}, //OBD采集电池电压
        ojt: {name: 'obdJQTemp', data: 0},//OBD采集燃油进气温度
        ost: {name: 'obdStatus', data: 0},//OBD采集状态
        ojm: {name: 'obdJQMPos', data: 0},//OBD采集节气门位置
        pu: {name: 'peopleUp', data: 0},//上车人数
        pd: {name: 'peopleDown', data: 0},//下车人数
        pc: {name: 'peopleCur', data: 0},//车上人数
        ef: {name: 'extraFlag', data: 0},//附加信息标志位 0-公交OBD 1-视频部标"
        p1: {name: 'sensor1', data: 0},
        p2: {name: 'sensor2', data: 0},
        p3: {name: 'sensor3', data: 0},
        p4: {name: 'sensor4', data: 0},
        p5: {name: 'sensor5', data: 0},
        p6: {name: 'sensor6', data: 0},
        p7: {name: 'sensor7', data: 0},
        p8: {name: 'sensor8', data: 0},
        p9: {name: 'sensor9', data: 0},
        p10: {name: 'sensor10', data: 0},
        sn: {name: 'satellite', data: 0}, //卫星数
        viceYl: {name: 'viceYl', data: 0},
        simulationYL: {name: 'simulationYL', data: 0},
        water: {name: 'water', data: 0},
    };

}


/**
 * 司机刷卡时间
 * @returns {null|*}
 */
standardStatus.prototype.getDriverSwipeTimeStr = function () {
    return this.driverSwipeTimeStr;
}

/**
 * 司机从业资格证编号
 * @returns {null|*}
 */
standardStatus.prototype.getDriverJobNum = function () {
    return this.driverJobNum;
}

/**
 * 司机信息
 * @returns {null|*}
 */
standardStatus.prototype.getDriverInfo = function () {
    return this.dinfo;
}


/**
 * 司机运营时间
 * @returns {null|*}
 */
standardStatus.prototype.getDriverOperTime = function () {
    return this.driverOperTime;
}

/**
 * 打卡司机
 * @returns {null}
 */
standardStatus.prototype.getClockdInfo = function () {
    return this.clockd;
}

function getStatusGpsTime(status) {
    var gpstime = "";
    if (status.gt != null && status.gt != "") {
        if (status.gt.length > 19) {
            gpstime = status.gt.substring(0, 19);
        } else {
            gpstime = status.gt;
        }
    }
    return gpstime;
}

function getStatusGpsTimeEx(status) {
    var gpstime = "";
    if (status.gpsTimeStr != null && status.gpsTimeStr != "") {
        if (status.gpsTimeStr.length > 19) {
            gpstime = status.gpsTimeStr.substring(0, 19);
        } else {
            gpstime = status.gpsTimeStr;
        }
    }
    return gpstime;
}

/**
 * 初次加载更新-实时定位更新-轨迹回放
 * @param status
 */
standardStatus.prototype.setStatus = function (status) {

    // 电子路单
    if (status.wayBill) {
        this.wayBill = status.wayBill;// 电子路单
    }

    if (status.online) {
        this.online = status.online;		//报警事件里面的状态，是没有在线标识
    }
//	(this.devIdno)

    this.isDrowing = status.isDrowing;
    if (!this.isDrowing) {
        this.jingDu = status.lng || 0;			//经度
        this.weiDu = status.lat || 0; 			//纬度
        this.mapJingDu = status.mlng;		//地图上显示的经度
        this.mapWeiDu = status.mlat; 		//地图上显示的纬度
        this.geoJingDu = status.glng;//地理位置解析所用的经纬度信息
        this.geoWeiDu = status.glat;
    }

    if (status.ps) {//后台解析的
        this.postionStr = status.ps;
        this.position = status.ps;
    }

    /*if(status.pstr){//后台解析的
		this.postionStr = status.pstr;
	}
	*/
    var gpstime = getStatusGpsTime(status);
    this.gpsTime = gpstime;			//GPS时间
    this.gpsTimeStr = gpstime;		//

    if (typeof status.pt != "undefined") {
        this.protocol = status.pt || 0;			//协议类型
        this.diskType = status.dt || 0;			//硬盘类型
        this.factoryType = status.ft || 0;			//厂家类型
        this.factoryDevType = status.fdt || 0;		//厂家设备类型
    }

    if (typeof status.index != "undefined") {
        this.index = status.index;
        this.vehiIdno = status.vehiIdno;
    }
    if (status.gd) {
        this.gaoDu = status.gd;//status.gaoDu;			//高度
    }
    this.driSw = status.driSw;
    this.driverSwipeTimeStr = status.driSwStr;//司机刷卡时间
    this.driverJobNum = status.driJn;//司机从业资格证编号
    this.dinfo = status.dinfo;//司机信息
    var gpsTimes = new Date(this.gpsTime.replace(/-/g, '/')).getTime();
    if (this.driSw != null && gpsTimes > this.driSw) { //司机运营时间
        this.driverOperTime = getTimeDifference((gpsTimes - this.driSw) / 1000);
    }
    this.clockd = status.clockd;//打卡司机


    //2019-5-5 10点14分 新增字段
//	private String pss;//经纬度的地理位置
    this.longGps = status.lg || 0;//2时才解析后面的
    if (status.lg && status.lg == 2) { //2时才解析后面的
        this.recvTime = status.rt;////接收GPS的系统时间
        this.longStatus = status.ls || 0;//状态位  0位:车厢温度  1位:IO状态位  2位:扩展车辆信号状态  3位:模拟量  4位:胎压
//	//		5位:主动安全ADAS  6位:主动安全DSM  7位:主动安全BSD
        this.compartmentTemp = status.ct || 0;//车厢温度(0x06)
        this.ioStatus = status.ios || 0;////IO状态位(0x2A)
        this.extraStatus = status.es || 0;//扩展车辆信号状态位(0x25)
        this.analogQuantity = status.aq || 0;//模拟量(0x2B)

        this.adasAlarmL1 = status.adas1 || 0;////主动安全adas报警状态位 一级
        this.adasAlarmL2 = status.adas2 || 0;//主动安全adas报警状态位 二级
//	/* 	0：前向碰撞报警 	1：车道偏离报警 	2：车距过近报警 	3：行人碰撞报警 	4：频繁变道报警 	5：道路标识超限报警 	6：障碍物报警
//	7：弯道车速预警
//	*/
        this.dsmAlarmL1 = status.dsm1 || 0;//主动安全dsm报警状态位 一级
        this.dsmAlarmL2 = status.dsm2 || 0;//主动安全dsm报警状态位2级
//	/* 	0:疲劳驾驶报警 	1:接打电话报警 	2:抽烟报警 	3:长时间不目视前方报警 	4:系统不能正常工作报警  5:驾驶员未系安全带报警
//	6:驾驶员不在驾驶位报警 	7:驾驶员双手脱离方向盘报警  8:分神驾驶报警(苏) 9:驾驶员异常报警(苏)
//	*/
        this.bsdAlarmL1 = status.bsd1 || 0;//主动安全bsd报警状态位 一级
        this.bsdAlarmL2 = status.bsd2 || 0;//主动安全bsd报警状态位 2级
//	/* 	0：左侧盲区报警 	1：右侧盲区报警 	2：后方接近报警
//	*/
        // ADAS
        this.frontVehiSpeed = status.fvs || 0;//前车车速	单位 Km/h。范围 0~250，仅报警类型为 0x01 和 0x02 时	有效
        this.distinceTime = status.dst || 0;//前车/行人距离	单位 100ms，范围 0~100仅报警类型为 0x01、0x02 和 0x04 时有效
        this.roadFlagData = status.rfd || 0;//道路标志识别数据
        this.deviationType = status.dvt || 0;//偏离类型(0:左侧 1:右侧)仅报警类型为 0x02 时有效
        this.roadFlagType = status.rft || 0;//道路标志识别类型(0：限速标志 1：限高标志 2：限重标志)仅报警类型为 0x06 时有效
//	this.distractedDriving = status.aq;//分神驾驶报警 2级(平台)  还未使用
// 	    this.reserve = status.aq || 0;	//预留
        // DSM
        this.fatigueLv = status.fl || 0;//疲劳程度(1-10)
        this.yawningNum = status.yn || 0;//打哈欠次数 范围1~10。报警结束上报 仅在报警类型为0x01时有效
        this.closedEyeTime = status.cet || 0;//闭眼持续时长 单位100ms  报警结束上报 仅在报警类型为0x01时有效
        this.winkCount = status.wc || 0;	//连续眨眼次数 范围1~100。报警结束上报 仅在报警类型为0x01时有效
        // this.reserve2 = status.aq;//预留
        //16进制字符串
        this.tirePpressures = status.tp;	//胎压(0x05)  FF000F  ->  tirePpressures[0]:FF, tirePpressures[1]:00,...
        //	private Short tirePpressure1;
    }

    for (var key in this.propertiesMap) {
        this[this.propertiesMap[key]['name']] = status[key] ? status[key] : this.propertiesMap[key]['data'];
    }
    this.network = status.net;//网络类型
};


/**
 * 这个方法已经没有使用了
 */
standardStatus.prototype.setStatusEx = function (status) {
//	this.online = status.online;		//报警事件里面的状态，是没有在线标识
    this.youLiang = status.youLiang;//status.youLiang;		//油量
    this.speed = status.speed;			//速度
    this.liCheng = status.liCheng;			//里程
    this.huangXiang = status.huangXiang;    	//航向
    this.status1 = status.status1;      	//车辆状态1
    this.status2 = status.status2;       //车辆状态2  环卫车（平台产生）12位作业状态 1作业中 0空闲 13位高峰作业 1高峰作业14,15,16表示作业次数
    this.status3 = status.status3;       //车辆状态3
    this.status4 = status.status4;       //车辆状态4
    this.tempSensor1 = status.tempSensor1;      //设备温度
    this.tempSensor2 = status.tempSensor2;       //车厢温度
    this.tempSensor3 = status.tempSensor3;       //车厢温度
    this.tempSensor4 = status.tempSensor4;       //车厢温度
    this.gaoDu = status.gd;//status.gaoDu;			//高度
    this.parkTime = status.parkTime;		//停车时长
    this.network = status.net;

    this.isDrowing = status.isDrowing;
    if (!this.isDrowing) {
        this.jingDu = status.jingDu;			//经度
        this.weiDu = status.weiDu; 			//纬度
        this.mapJingDu = status.mapJingDu;		//地图上显示的经度
        this.mapWeiDu = status.mapWeiDu; 		//地图上显示的纬度
        this.geoJingDu = status.geoJingDu;//地理位置解析所用的经纬度信息
        this.geoWeiDu = status.geoWeiDu;
    }

    var gpstime = getStatusGpsTimeEx(status);
    this.gpsTime = gpstime;			//GPS时间
    this.gpsTimeStr = gpstime;		//

    this.protocol = status.protocol;			//协议类型
    this.diskType = status.diskType;			//硬盘类型
    this.factoryType = status.factoryType;			//厂家类型
    this.factoryDevType = status.factoryDevType;		//厂家设备类型

    this.position = "";//status.position;
    if (typeof status.index != "undefined") {
        this.index = status.index;
        this.vehiIdno = status.vehiIdno;
    }

    //公交线路
    this.lineId = status.lineId; //线路id
    this.driverId = status.driverId; //司机id
    this.lineDirect = status.lineDirect; //线路方向 0上行 1下行
    this.stationFlag = status.stationFlag; //站点标识 0站点 1站场
    this.stationIndex = status.stationIndex; //站点索引
    this.stationStatus = status.stationStatus; //站点状态 0到站 1出站
    //obd
    this.obdRpm = status.obdRpm;//OBD采集发动机转速
    this.obdSpeed = status.obdSpeed;//OBD采集发动机速度
    this.obdVotage = status.obdVotage;//OBD采集电池电压
    this.obdJQTemp = status.obdJQTemp;//OBD采集燃油进气温度
    this.obdStatus = status.obdStatus;//OBD采集状态
    this.obdJQMPos = status.obdJQMPos;//OBD采集节气门位置
    this.peopleUp = status.pu;//上车人数
    this.peopleDown = status.pd;//下车人数
    this.peopleCur = status.pc;//车上人数
    this.extraFlag = status.extraFlag;//附加信息标志位 0-公交OBD 1-视频部标"
    this.sensor1 = status.sensor1;
    this.sensor2 = status.sensor2;
    this.sensor3 = status.sensor3;
    this.sensor4 = status.sensor4;
    this.sensor5 = status.sensor5;
    this.sensor6 = status.sensor6;
    this.sensor7 = status.sensor7;
    this.sensor8 = status.sensor8;
    this.sensor9 = status.sensor9;
    this.sensor10 = status.sensor10;
};

//是否环卫管理
standardStatus.prototype.isSanitationTruck = function () {
    if (rootElement.myUserRole && typeof rootElement.myUserRole.isSanitationTruck == 'function' &&
        rootElement.myUserRole.isSanitationTruck()) {
        return true;
    }
    return false;
};

//是否新天地，不显示司机
standardStatus.prototype.isXinTianDi = function () {
    if (rootElement.myUserRole && typeof rootElement.myUserRole.isXinTianDi == 'function' &&
        rootElement.myUserRole.isXinTianDi()) {
        return true;
    }
    return false;
};

//判断是否报警屏蔽
standardStatus.prototype.isAlarmShield = function (armType) {
    //判断报警类是否存在
    if (typeof rootElement.alarmClassNew != "undefined" && rootElement.alarmClassNew != null) {
        return rootElement.alarmClassNew.isAlarmShield(armType);
    }
    return false;
};

//判断是否V9版本所包含的报警类型
standardStatus.prototype.policeContainAlarm = function (armType) {
    //判断报警类是否存在
    if (typeof rootElement.alarmClassNew != "undefined" && rootElement.alarmClassNew != null
        && rootElement.myUserRole && rootElement.myUserRole.isPolice()) {
        return rootElement.alarmClassNew.policeContainAlarm(armType);
    }
    return true;
};

//判断是否WKP协议
standardStatus.prototype.isWKPProtocol = function () {
    if (this.protocol == null || Number(this.protocol) == 1) {
        return true;
    }
    return false;
}

//判断是否WKP协议 == TTX协议
standardStatus.prototype.isWKPProtocolEx = function () {
    if (this.protocol != null && Number(this.protocol) == 1) {
        return true;
    }
    return false;
}

//判断是否TTX协议
standardStatus.prototype.isTTXProtocol = function () {
    if (this.protocol != null && Number(this.protocol) == 2) {
        return true;
    }
    return false;
}

//判断是否JT808协议
standardStatus.prototype.isJT808Protocol = function () {
    if (this.protocol != null && Number(this.protocol) == 6) {
        return true;
    }
    return false;
}

//判断是否JT809协议
standardStatus.prototype.isJT809Protocol = function () {
    if (this.protocol != null && Number(this.protocol) == 14) {
        return true;
    }
    return false;
}

//判断协议是否易甲文
standardStatus.prototype.isRMProtocol = function () {
    if (this.protocol != null && Number(this.protocol) == 7) {
        return true;
    }
    return false;
}

//判断厂家是否WKP类型
standardStatus.prototype.isWKPFactoryType = function () {
    return this.isDynamicFactoryType(1);
}

//判断厂家是否奥多视
standardStatus.prototype.isAUDSFactoryType = function () {
    return this.isDynamicFactoryType(2);
}

//判断厂家是否被使用
standardStatus.prototype.isKXFactoryType = function () {
    return this.isDynamicFactoryType(3);
}

//判断厂家是否忆志
standardStatus.prototype.isESTFactoryType = function () {
    return this.isDynamicFactoryType(4);
}

//判断厂家是否银星华电
standardStatus.prototype.isYXHDFactoryType = function () {
    return this.isDynamicFactoryType(5);
}

//判断厂家是否合众智慧
standardStatus.prototype.isCOOINTFactoryType = function () {
    return this.isDynamicFactoryType(6);
}

//判断厂家是否易甲文
standardStatus.prototype.isYJWFactoryType = function () {
    return this.isDynamicFactoryType(7);
}

//判断厂家j808-2019类型
standardStatus.prototype.is8082019FactoryType = function () {
    if (this.factoryDevType != null && Number(this.factoryDevType) >= 256 && Number(this.factoryDevType) <= 65535) {
        return true;
    }
    return false;
}

//判断是否有905协议
standardStatus.prototype.is905FactoryType = function () {
    if (rootElement.myUserRole && rootElement.myUserRole.isPolice()) {
        return false;
    }
    if (this.factoryDevType != null && (Number(this.factoryDevType & 0xFF) == 5 || Number(this.factoryDevType & 0xFF) == 4 ||
        Number(this.factoryDevType & 0xFF) == 6 || Number(this.factoryDevType & 0xFF) == 7)) {
        return true;
    }
    return false;
}

//判断是否j905-2019协议
standardStatus.prototype.is9052019FactoryType = function () {
    if (rootElement.myUserRole && rootElement.myUserRole.isPolice()) {
        return false;
    }
    if (this.factoryDevType != null && (Number(this.factoryDevType & 0xFF) == 5 || Number(this.factoryDevType & 0xFF) == 6)) {
        return true;
    }
    return false;
}

//判断是否j905-2020
standardStatus.prototype.is9052020FactoryType = function () {
    if (rootElement.myUserRole && rootElement.myUserRole.isPolice()) {
        return false;
    }
    if (this.factoryDevType != null && Number(this.factoryDevType & 0xFF) == 6) {
        return true;
    }
    return false;
}

//判断是否j905-北京
standardStatus.prototype.is905BeiJingFactoryType = function () {
    if (rootElement.myUserRole && rootElement.myUserRole.isPolice()) {
        return false;
    }
    if (this.factoryDevType != null && Number(this.factoryDevType & 0xFF) == 7) {
        return true;
    }
    return false;
}


//判断厂家是否锐驰曼
standardStatus.prototype.isRCMFactoryType = function () {
    return this.isDynamicFactoryType(14);
}

//判断是否通立厂家
standardStatus.prototype.isTLFactoryType = function () {
    return this.isDynamicFactoryType(16);
}

//判断是否国脉厂家
standardStatus.prototype.isGMFactoryType = function () {
    return this.isDynamicFactoryType(17);
}

//判断是否宏电厂家
standardStatus.prototype.isHDFactoryType = function () {
    return this.isDynamicFactoryType(20);
}

//判断厂家是否福泽尔
standardStatus.prototype.isFZEFactoryType = function () {
    return this.isDynamicFactoryType(21);
}

//判断是否锐哲（武汉）厂家
standardStatus.prototype.isRZFactoryType = function () {
    return this.isDynamicFactoryType(22);
}

//判断厂家是否华宝
standardStatus.prototype.isHBFactoryType = function () {
    return this.isDynamicFactoryType(23);
}

//判断厂家是否TTX
standardStatus.prototype.isTTXFactoryType = function () {
    return this.isDynamicFactoryType(35);
}

//判断厂家是否后视镜
standardStatus.prototype.isRearviewMirrorType = function () {
    return this.isDynamicFactoryType(43);
}
//判断厂家是否34
standardStatus.prototype.is34FactoryType = function () {
    return this.isDynamicFactoryType(34);
}

//判断厂家是否41
standardStatus.prototype.is41FactoryType = function () {
    return this.isDynamicFactoryType(41);
}
//判断厂家是否44
standardStatus.prototype.is44FactoryType = function () {
    return this.isDynamicFactoryType(44);
}

//判断厂家是否66 TTX执法仪
standardStatus.prototype.is66FactoryType = function () {
    return this.isDynamicFactoryType(66);
}

//动态判断厂家类型
standardStatus.prototype.isDynamicFactoryType = function (type) {
    if (type) {
        if (this.factoryType != null && Number(this.factoryType) == Number(type)) {
            return true;
        }
    }
    return false;
}


//判断是否1078设备
standardStatus.prototype.is1078Device = function () {
    if (this.isJT808Protocol() && this.factoryDevType != null && Number(this.factoryDevType & 0xFF) == 3) {
        return true;
    }
    return false;
}

//获取卫星数
standardStatus.prototype.getSatellite = function () {
    return this.satellite
};


//设置设备在线状态
standardStatus.prototype.setOnline = function (online) {
    this.online = online;
};

//设置序号
standardStatus.prototype.setIndex = function (index) {
    this.index = index;
};

//设置车牌号
standardStatus.prototype.setVehiIdno = function (vehiIdno) {
    this.vehiIdno = vehiIdno;
};

//设置是否人员设备
standardStatus.prototype.setPeopleTerminal = function (isPeople) {
    this.isPeople = isPeople;
}

//是否是人员设备
standardStatus.prototype.isPeopleTerminal = function () {
    return this.isPeople;
}

//设备状态是否有效
standardStatus.prototype.isValid = function () {
    return this.status1 != null ? true : false;
};

//获取设备定位的gps时间
standardStatus.prototype.getGpsTime = function () {
    if (this.isValid()) {
        return this.gpsTime;
    }
    return '';
};

//获取设备定位的gps时间字符串
standardStatus.prototype.getGpsTimeString = function () {
    if (this.getGpsTime() != null && this.getGpsTime() != '') {
        return this.gpsTimeStr;
    }
    return '';
};

//获取设备定位的停车时长
standardStatus.prototype.getParkTime = function () {
    return this.parkTime;
};

//获取设备定位的停车时间字符串
standardStatus.prototype.getParkTimeString = function () {
    if (this.parkTime != null) {
        return this.getTimeDifference(this.parkTime);
    }
    return '';
};

//获取设备定位的地址
standardStatus.prototype.getPosition = function () {
    if (this.isValid() && this.position != null) {
        return this.position;
    }
    return "";
};

//判断设备是否在线
standardStatus.prototype.isOnline = function () {
    if (/*this.isValid() && */this.online != null && this.online > 0) {
        return true;
    } else {
        return false;
    }
};

//判断状态更新时间是否相同
standardStatus.prototype.isEqualStatus = function (status) {
    var oldGpsTimeStr = this.getGpsTimeString();
    var newGpsTimeStr = "";
    if (status != null) {
        newGpsTimeStr = getStatusGpsTime(status);
    }
    if (oldGpsTimeStr != null && newGpsTimeStr != null) {
        if (oldGpsTimeStr == newGpsTimeStr) {
            return true;
        } else {
            return false;
        }
    } else if (oldGpsTimeStr == null && newGpsTimeStr == null) {
        return true;
    } else {
        return false;
    }
};

//判断在线状态是否相同
standardStatus.prototype.isEqualOnline = function (online) {
    var oldOnline = this.online;
    if (oldOnline == null && online != null) {
        return false;
    } else if (oldOnline != null && online != null) {
        if (oldOnline == online) {
            return true;
        }
        return false;
    }
    return true;
}

//设备是否定位状态
standardStatus.prototype.isGpsValid = function () {
    /* if (this.geoJingDu == '0.000000' || this.geoWeiDu == '0.000000') {
        return false;
    } */
    if (this.status1 != null) {
        var valid = (this.status1 & 0x01);
        if (valid == 1) {
            return true;
        }
    }
    return false;
};


//为最后一个有效的GPS信息，状态显示成定位无效，但GPS可以在地图上定位
standardStatus.prototype.isDeviceStop = function () {
    if (this.status2 !== null) {
        var valid = ((this.status2 >> 18) & 0x01);
        if (valid == 1) {
            return true;
        }
    }
    return false;
};

//附加信息标志位 0-公交OBD 1-视频部标
//是否视频部标
standardStatus.prototype.isExtraFlagVideo = function () {
    if ((this.extraFlag & 0xFF) == 1) {
        return true;
    }
    return false;
};

standardStatus.prototype.isExtraFlagZero = function () {
    if ((this.extraFlag & 0xFF) == 0) {
        return true;
    }
    return false;
};

//是否UAE校车
standardStatus.prototype.isExtraFlagUAE = function () {
    if ((this.extraFlag & 0xFF) == 2) {
        return true;
    }
    return false;
};

//是否苏标
standardStatus.prototype.isExtraFlagSB = function () {
    if ((this.extraFlag & 0xFF) == 3) {
        return true;
    }
    return false;
};


//是否出租车
standardStatus.prototype.isTaxi905Protocol = function () {
    if ((this.extraFlag & 0xFF) == 4) {
        return true;
    }
    return false;
};

// 是否黑标
standardStatus.prototype.isHeiLongJiangProtocol = function () {
    if ((this.extraFlag & 0xFF) == 5) {
        return true;
    }
    return false;
};

// 当天运行信息统计
standardStatus.prototype.isDayRunningInfoProtocol = function () {
    if ((this.extraFlag & 0xFF) == 6) {
        return true;
    }
    return false;
};
// 当天运行信息统计
// http://192.168.1.192:8989/web/#/1?page_id=1231
standardStatus.prototype.isLongStatusDayRunningInfoProtocol = function () {
    if (this.isLongGps() && ((this.longStatus >> 23) & 1) > 0) {
        return true;
    }
    return false;
};

//是否有其他视频设备故障报警（视频部标）
standardStatus.prototype.isOtherDiskErrFlag = function () {
    if (this.status2 !== null) {
        var valid = ((this.status2 >> 3) & 0x01);
        if (valid == 1) {
            return true;
        }
    }
    return false;
};

//其他视频设备故障报警（视频部标）
standardStatus.prototype.getOtherDiskErrFlag = function () {
    var infos = '';
    var ret = {};
    if (this.isExtraFlagVideo() && this.isOtherDiskErrFlag()) {
        //还需要判断通道和设备通道是否匹配
        infos = rootElement.lang.other_device_error;
    }
    if (this.isAlarmShield('244,294')) {
        ret.normal = infos;
        ret.alarm = '';
    } else {
        ret.normal = '';
        ret.alarm = infos;
    }
    return ret;
}


//是否有特殊报警录像达到存储阈值报警 （视频部标）
standardStatus.prototype.isStorageAlarm = function () {
    if (this.status2 !== null) {
        var valid = ((this.status2 >> 5) & 0x01);
        if (valid == 1) {
            return true;
        }
    }
    return false;
};

/**
 * 是否主动安全报警新解析
 * @return
 */
standardStatus.prototype.isNewLong = function () {
    if (this.isLongGps() && ((this.longStatus >> 13) & 1) > 0) {
        return true;
    }
    return false;
}

/**
 * 是否解析副油箱
 * @returns {boolean}
 */
standardStatus.prototype.isAuxiliaryTankStatus = function () {
    if (this.isLongGps() && ((this.longStatus >> 14) & 1) > 0) {
        return true;
    }
    return false;
}

/**
 * 是否解析水位
 * @returns {boolean}
 */
standardStatus.prototype.isWaterLvel = function () {
    if (this.isLongGps() && ((this.longStatus >> 15) & 1) > 0) {
        return true;
    }
    return false;
}

/**
 * 是否解析今日里程
 * @returns {boolean}
 */
standardStatus.prototype.isTodayLicheng = function () {
    if ((!rootElement.myUserRole || (rootElement.myUserRole && !rootElement.myUserRole.isPolice())) && this.isLongGps() && ((this.longStatus >> 18) & 1) > 0) {
        return true;
    }
    return false;
}

/**
 * 新的长gps状态位解析【兼容旧数据】
 * @returns {___anonymous21215_21216}
 */
//adas相关报警解析
standardStatus.prototype.isAdasAlarmNew = function () {
    var ret = {};
    var normal = [];
    var alarm = [];
    //alarmType 轨迹回放使用
    var alarmType = [];
//		var diskErrFalg = this.sensor3 & parseInt("FFFF",16);//bit0～bit11分别表示第 1～12 个主存储 器， bit12～bit15分别表示 第 1～4个灾备存储装置
    var ADASAlarmL1 = this.adasAlarmL1;
    var ADASAlarmL2 = this.adasAlarmL2;
    /* 	0：前向碰撞报警 	1：车道偏离报警 	2：车距过近报警 	3：行人碰撞报警 	4：频繁变道报警 5：道路标识超限报警 	6：障碍物报警
               7：弯道车速预警8:驾驶辅助功能失效报警9:路口快速通过报警10:实线变道报警11:设备失效提醒报警12:低速前车碰撞预警报警1级
               13: 路面抛洒
           */
    if ((ADASAlarmL1 & 1) || (ADASAlarmL2 & 1)) {
        //一级报警
        if (ADASAlarmL1 & 1) {
            var info = rootElement.lang.alarm_name_600 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('600,650')) {
//					前向碰撞报警一级
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(600);
        }
        //二级报警
        if (ADASAlarmL2 & 1) {
            var info = rootElement.lang.alarm_name_600 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('601,651')) {
//					前向碰撞报警二级
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(601);
        }
    }
    if (((ADASAlarmL1 >> 1) & 1) || ((ADASAlarmL2 >> 1) & 1)) {
        if ((ADASAlarmL1 >> 1) & 1) {
            var info = rootElement.lang.alarm_name_602 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('602,652')) {
//					车道偏离报警
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(602);
        }
        if ((ADASAlarmL2 >> 1) & 1) {
            var info = rootElement.lang.alarm_name_602 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('603,653')) {
//					车道偏离报警
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(603);
        }
    }
    if (((ADASAlarmL1 >> 2) & 1) || ((ADASAlarmL2 >> 2) & 1)) {
        if ((ADASAlarmL1 >> 2) & 1) {
            var info = rootElement.lang.alarm_name_604 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('604,654')) {
//					车距过近报警
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(604);
        }
        if ((ADASAlarmL2 >> 2) & 1) {
            var info = rootElement.lang.alarm_name_604 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('605,655')) {
//					车距过近报警
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(605);
        }
    }
    if (((ADASAlarmL1 >> 3) & 1) || ((ADASAlarmL2 >> 3) & 1)) {
        if ((ADASAlarmL1 >> 3) & 1) {
            var info = rootElement.lang.alarm_name_606 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('606,656')) {
//				行人碰撞报警
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(606);
        }
        if ((ADASAlarmL2 >> 3) & 1) {
            var info = rootElement.lang.alarm_name_606 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('607,657')) {
//				行人碰撞报警
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(607);
        }
    }
    if (((ADASAlarmL1 >> 4) & 1) || ((ADASAlarmL2 >> 4) & 1)) {
        if ((ADASAlarmL1 >> 4) & 1) {
            var info = rootElement.lang.alarm_name_608 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('608,658')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(608);
        }
        if ((ADASAlarmL2 >> 4) & 1) {
            var info = rootElement.lang.alarm_name_608 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('609,659')) {
//				频繁变道报警
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(609);
        }
    }
    if (((ADASAlarmL1 >> 5) & 1) || ((ADASAlarmL2 >> 5) & 1)) {
        if ((ADASAlarmL1 >> 5) & 1) {
            var info = rootElement.lang.alarm_name_610 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('610,660')) {
//					道路标识超限报警
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(610);
        }
        if ((ADASAlarmL2 >> 5) & 1) {
            var info = rootElement.lang.alarm_name_610 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('611,661')) {
//					道路标识超限报警
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(611);
        }
    }
    if (((ADASAlarmL1 >> 6) & 1) || ((ADASAlarmL2 >> 6) & 1)) {
        if ((ADASAlarmL1 >> 6) & 1) {
            var info = rootElement.lang.alarm_name_612 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('612,662')) {
//					障碍物报警
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(612);
        }
        if ((ADASAlarmL2 >> 6) & 1) {
            var info = rootElement.lang.alarm_name_612 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('613,663')) {
//					障碍物报警
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(613);
        }
    }
    if (((ADASAlarmL1 >> 7) & 1) || ((ADASAlarmL2 >> 7) & 1)) {
        if ((ADASAlarmL1 >> 7) & 1) {
            var info = rootElement.lang.alarm_name_700 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('700,750')) {
//					障碍物报警
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(700);
        }
        if ((ADASAlarmL2 >> 7) & 1) {
            var info = rootElement.lang.alarm_name_700 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('701,751')) {
//					障碍物报警
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(701);
        }
    }
    if (((ADASAlarmL1 >> 8) & 1) || ((ADASAlarmL2 >> 8) & 1)) {
        if ((ADASAlarmL1 >> 8) & 1) {
            var info = rootElement.lang.alarm_name_715 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('715,765')) {
//					障碍物报警
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(715);
        }
        if ((ADASAlarmL2 >> 8) & 1) {
            var info = rootElement.lang.alarm_name_715 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('716,766')) {
//					障碍物报警
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(716);
        }
    }
    if (((ADASAlarmL1 >> 9) & 1) || ((ADASAlarmL2 >> 9) & 1)) {
        if ((ADASAlarmL1 >> 9) & 1) {
            var info = rootElement.lang.alarm_name_728 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('728,778')) {
//					障碍物报警
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(728);
        }
        if ((ADASAlarmL2 >> 9) & 1) {
            var info = rootElement.lang.alarm_name_728 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('729,779')) {
//					障碍物报警
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(729);
        }
    }
    if (((ADASAlarmL1 >> 10) & 1) || ((ADASAlarmL2 >> 10) & 1)) {
        if ((ADASAlarmL1 >> 10) & 1) {
            var info = rootElement.lang.alarm_name_730 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('730,780')) {
//					障碍物报警
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(730);
        }
        if ((ADASAlarmL2 >> 10) & 1) {
            var info = rootElement.lang.alarm_name_730 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('731,781')) {
//					障碍物报警
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(731);
        }
    }
    if (((ADASAlarmL1 >> 11) & 1) || ((ADASAlarmL2 >> 11) & 1)) {
        if ((ADASAlarmL1 >> 11) & 1) {
            var info = rootElement.lang.alarm_name_732 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('732,782')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(732);
        }
        if ((ADASAlarmL2 >> 11) & 1) {
            var info = rootElement.lang.alarm_name_732 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('733,783')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(733);
        }
    }
    if (((ADASAlarmL1 >> 12) & 1) || ((ADASAlarmL2 >> 12) & 1)) {
        if ((ADASAlarmL1 >> 12) & 1) {
            var info = rootElement.lang.alarm_name_840 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('840,890')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(840);
        }
        if ((ADASAlarmL2 >> 12) & 1) {
            var info = rootElement.lang.alarm_name_840 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('841,891')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(841);
        }
    }
    if (((ADASAlarmL1 >> 13) & 1)) {
        if ((ADASAlarmL1 >> 13) & 1) {
            var info = rootElement.lang.alarm_name_839;
            if (this.isAlarmShield('839,889')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(839);
        }
    }
    /**********状态信息报警参数屏蔽*************/
    /**********状态信息报警参数屏蔽*************/
    ret.normal = normal.toString();
    ret.alarm = alarm.toString();
    ret.alarmType = alarmType.toString();//轨迹回放用
    return ret;
}


/**
 * 新解析主动安全报警
 * @param type
 * @param normals
 * @param alarms
 */
standardStatus.prototype.getSafetyAlarmNew = function (normal, alarm, alarmType) {
    var safetyAlarm = this.adasAlarmL1;
    if (!safetyAlarm) {
        return null;
    }
    var shield = "";
    var info = "";
    var armType = "";
    switch (safetyAlarm) {
        // 主动安全报警 一级(+1000)
        // 主动安全报警 二级(+2000)
        // 主动安全报警 三级(+10000)
        /* 	0：前向碰撞报警 	1：车道偏离报警 	2：车距过近报警 	3：行人碰撞报警 	4：频繁变道报警 	5：道路标识超限报警 	6：障碍物报警
        7：弯道车速预警		8:驾驶辅助功能失效报警		9:路口快速通过报警		10:实线变道报警		11:设备失效提醒报警		12:低速前车碰撞预警报警1级
        13: 路面抛洒  14:黑名单车辆报警  15:白名单车辆报警  16:授权超期车辆报警  17:未授权车辆报警 18:车厢过道行人检测报警 19:盲区监测报警
        20:限速报警  21:限高报警  22:限宽报警  23:限重报警 24:碰撞侧翻报警 25:路口未礼让行人
        */
        case 1000:
            info = rootElement.lang.alarm_name_600 + rootElement.lang.alarm_name_11111;
            armType = 600;
            shield = "600,650";
            break;
        case 1001:
            info = rootElement.lang.alarm_name_602 + rootElement.lang.alarm_name_11111;
            armType = 602;
            shield = "602,652";
            break;
        case 1002:
            info = rootElement.lang.alarm_name_604 + rootElement.lang.alarm_name_11111;
            armType = 604;
            shield = "604,654";
            break;
        case 1003:
            info = rootElement.lang.alarm_name_606 + rootElement.lang.alarm_name_11111;
            armType = 606;
            shield = "606,656";
            break;
        case 1004:
            info = rootElement.lang.alarm_name_608 + rootElement.lang.alarm_name_11111;
            armType = 608;
            shield = "608,658";
            break;
        case 1005:
            info = rootElement.lang.alarm_name_610 + rootElement.lang.alarm_name_11111;
            armType = 610;
            shield = "610,660";
            break;
        case 1006:
            info = rootElement.lang.alarm_name_612 + rootElement.lang.alarm_name_11111;
            armType = 612;
            shield = "612,662";
            break;
        case 1007:
            info = rootElement.lang.alarm_name_700 + rootElement.lang.alarm_name_11111;
            armType = 700;
            shield = "700,750";
            break;
        case 1008:
            info = rootElement.lang.alarm_name_715 + rootElement.lang.alarm_name_11111;
            armType = 715;
            shield = "715,765";
            break;
        case 1009:
            info = rootElement.lang.alarm_name_728 + rootElement.lang.alarm_name_11111;
            armType = 728;
            shield = "728,778";
            break;
        case 1010:
            info = rootElement.lang.alarm_name_730 + rootElement.lang.alarm_name_11111;
            armType = 730;
            shield = "730,780";
            break;
        case 1011:
            info = rootElement.lang.alarm_name_732 + rootElement.lang.alarm_name_11111;
            armType = 732;
            shield = "732,782";
            break;
        case 1012:
            info = rootElement.lang.alarm_name_840 + rootElement.lang.alarm_name_11111;
            armType = 840;
            shield = "840,890";
            break;
        case 1013:
            info = rootElement.lang.alarm_name_839;
            armType = 839;
            shield = "839,889";
            break;
        case 1014:
            info = rootElement.lang.alarm_name_530 + rootElement.lang.alarm_name_11111;
            armType = 530;
            shield = "530,530";
            break;
        case 1015:
            info = rootElement.lang.alarm_name_532 + rootElement.lang.alarm_name_11111;
            armType = 532;
            shield = "532,532";
            break;
        case 1016:
            info = rootElement.lang.alarm_name_534 + rootElement.lang.alarm_name_11111;
            armType = 534;
            shield = "534,534";
            break;
        case 1017:
            info = rootElement.lang.alarm_name_536 + rootElement.lang.alarm_name_11111;
            armType = 536;
            shield = "536,536";
            break;
        case 1018:
            info = rootElement.lang.alarm_name_542 + rootElement.lang.alarm_name_11111;
            armType = 542;
            shield = "542,592";
            break;
        case 1019:
            info = rootElement.lang.alarm_name_1211 + rootElement.lang.alarm_name_11111;
            armType = 1211;
            shield = "1211,1261";
            break;
        case 1020:
            info = rootElement.lang.alarm_name_1214 + rootElement.lang.alarm_name_11111;
            armType = 1214;
            shield = "1214,1264";
            break;
        case 1021:
            info = rootElement.lang.alarm_name_1217 + rootElement.lang.alarm_name_11111;
            armType = 1217;
            shield = "1217,1267";
            break;
        case 1022:
            info = rootElement.lang.alarm_name_1220 + rootElement.lang.alarm_name_11111;
            armType = 1220;
            shield = "1220,1270";
            break;
        case 1023:
            info = rootElement.lang.alarm_name_1223 + rootElement.lang.alarm_name_11111;
            armType = 1223;
            shield = "1223,1273";
            break;
        case 1024:
            info = rootElement.lang.alarm_name_1400 + rootElement.lang.alarm_name_11111;
            armType = 1400;
            shield = "1400,1450";
            break;
        case 1025:
            info = rootElement.lang.alarm_name_1402 + rootElement.lang.alarm_name_11111;
            armType = 1402;
            shield = "1402,1452";
            break;
        case 2000:
            info = rootElement.lang.alarm_name_600 + rootElement.lang.alarm_name_22222;
            armType = 601;
            shield = "601,651";
            break;
        case 2001:
            info = rootElement.lang.alarm_name_602 + rootElement.lang.alarm_name_22222;
            armType = 603;
            shield = "603,653";
            break;
        case 2002:
            info = rootElement.lang.alarm_name_604 + rootElement.lang.alarm_name_22222;
            armType = 605;
            shield = "605,655";
            break;
        case 2003:
            info = rootElement.lang.alarm_name_606 + rootElement.lang.alarm_name_22222;
            armType = 607;
            shield = "607,657";
            break;
        case 2004:
            info = rootElement.lang.alarm_name_608 + rootElement.lang.alarm_name_22222;
            armType = 609;
            shield = "609,659";
            break;
        case 2005:
            info = rootElement.lang.alarm_name_610 + rootElement.lang.alarm_name_22222;
            armType = 611;
            shield = "611,661";
            break;
        case 2006:
            info = rootElement.lang.alarm_name_612 + rootElement.lang.alarm_name_22222;
            armType = 613;
            shield = "613,663";
            break;
        case 2007:
            info = rootElement.lang.alarm_name_700 + rootElement.lang.alarm_name_22222;
            armType = 701;
            shield = "701,751";
            break;
        case 2008:
            info = rootElement.lang.alarm_name_715 + rootElement.lang.alarm_name_22222;
            armType = 716;
            shield = "716,766";
            break;
        case 2009:
            info = rootElement.lang.alarm_name_728 + rootElement.lang.alarm_name_22222;
            armType = 729;
            shield = "729,779";
            break;
        case 2010:
            info = rootElement.lang.alarm_name_730 + rootElement.lang.alarm_name_22222;
            armType = 731;
            shield = "731,781";
            break;
        case 2011:
            info = rootElement.lang.alarm_name_732 + rootElement.lang.alarm_name_22222;
            armType = 733;
            shield = "733,783";
            break;
        case 2012:
            info = rootElement.lang.alarm_name_840 + rootElement.lang.alarm_name_22222;
            armType = 840;
            shield = "841,891";
            break;
        case 2014:
            info = rootElement.lang.alarm_name_530 + rootElement.lang.alarm_name_22222;
            armType = 531;
            shield = "531,531";
            break;
        case 2015:
            info = rootElement.lang.alarm_name_532 + rootElement.lang.alarm_name_22222;
            armType = 533;
            shield = "533,533";
            break;
        case 2016:
            info = rootElement.lang.alarm_name_534 + rootElement.lang.alarm_name_22222;
            armType = 535;
            shield = "535,535";
            break;
        case 2017:
            info = rootElement.lang.alarm_name_536 + rootElement.lang.alarm_name_22222;
            armType = 537;
            shield = "537,537";
            break;
        case 2018:
            info = rootElement.lang.alarm_name_542 + rootElement.lang.alarm_name_22222;
            armType = 543;
            shield = "543,593";
            break;

        case 2019:
            info = rootElement.lang.alarm_name_1211 + rootElement.lang.alarm_name_22222;
            armType = 1212;
            shield = "1212,1262";
            break;
        case 2020:
            info = rootElement.lang.alarm_name_1214 + rootElement.lang.alarm_name_22222;
            armType = 1215;
            shield = "1215,1265";
            break;
        case 2021:
            info = rootElement.lang.alarm_name_1217 + rootElement.lang.alarm_name_22222;
            armType = 1218;
            shield = "1218,1268";
            break;
        case 2022:
            info = rootElement.lang.alarm_name_1220 + rootElement.lang.alarm_name_22222;
            armType = 1221;
            shield = "1221,1271";
            break;
        case 2023:
            info = rootElement.lang.alarm_name_1223 + rootElement.lang.alarm_name_22222;
            armType = 1224;
            shield = "1224,1274";
            break;
        case 2024:
            info = rootElement.lang.alarm_name_1400 + rootElement.lang.alarm_name_22222;
            armType = 1401;
            shield = "1401,1451";
            break;
        case 2025:
            info = rootElement.lang.alarm_name_1402 + rootElement.lang.alarm_name_22222;
            armType = 1403;
            shield = "1403,1453";
            break;
        // 主动安全报警 三级(+10000)
        case 10000:
            info = rootElement.lang.alarm_name_600 + rootElement.lang.alarm_name_33333;
            armType = 1207;
            shield = "1207,1257";
            break;
        case 10001:
            info = rootElement.lang.alarm_name_602 + rootElement.lang.alarm_name_33333;
            armType = 1209;
            shield = "1209,1259";
            break;
        case 10002:
            info = rootElement.lang.alarm_name_604 + rootElement.lang.alarm_name_33333;
            armType = 1208;
            shield = "1208,1258";
            break;
        case 10003:
            info = rootElement.lang.alarm_name_606 + rootElement.lang.alarm_name_33333;
            armType = 1210;
            shield = "1210,1260";
            break;
        case 10019:
            info = rootElement.lang.alarm_name_1211 + rootElement.lang.alarm_name_33333;
            armType = 1213;
            shield = "1213,1263";
            break;
        case 10020:
            info = rootElement.lang.alarm_name_1214 + rootElement.lang.alarm_name_33333;
            armType = 1216;
            shield = "1216,1266";
            break;
        case 10021:
            info = rootElement.lang.alarm_name_1217 + rootElement.lang.alarm_name_33333;
            armType = 1219;
            shield = "1219,1269";
            break;
        case 10022:
            info = rootElement.lang.alarm_name_1220 + rootElement.lang.alarm_name_33333;
            armType = 1222;
            shield = "1222,1272";
            break;
        case 10023:
            info = rootElement.lang.alarm_name_1223 + rootElement.lang.alarm_name_33333;
            armType = 1225;
            shield = "1225,1275";
            break;
        //主动安全dsm报警状态位 一级(+3000)
        //主动安全dsm报警状态位 二级(+4000)
        //主动安全dsm报警状态位 三级(+11000)
        /* 	0:疲劳驾驶报警 	1:接打电话报警 	2:抽烟报警 	3:长时间不目视前方报警 	4:系统不能正常工作报警  5:未系安全带报警
        6:未检测到驾驶员报警 	7:双手同时脱离方向盘报警  8:分神驾驶报警(苏) 9:驾驶员异常报警(苏) 10:驾驶员IC卡异常报警(陕)
        11:墨镜失效		12:驾驶员行为监测功能失效报警		13:探头遮挡报警		14:换人驾驶报警		15:超时驾驶报警
        16:单手脱离方向盘报警	17:喝水报警  18:长时间驾驶  19:玩手机  20:巡检乘客安全带  21:夜间异动  22:酒测正常  23:未完成酒测  24:酒后驾驶  25:醉驾驾驶
         26:夜间禁行  27:IC 卡读卡失败报警
        */
        case 3000:
            info = rootElement.lang.alarm_name_618 + rootElement.lang.alarm_name_11111;
            armType = 618;
            shield = "618,668";
            break;
        case 3001:
            info = rootElement.lang.alarm_name_620 + rootElement.lang.alarm_name_11111;
            armType = 620;
            shield = "620,670";
            break;
        case 3002:
            info = rootElement.lang.alarm_name_622 + rootElement.lang.alarm_name_11111;
            armType = 622;
            shield = "622,672";
            break;
        case 3003:
            info = rootElement.lang.alarm_name_702 + rootElement.lang.alarm_name_11111;
            armType = 702;
            shield = "702,752";
            break;
        case 3004:
            info = rootElement.lang.alarm_name_704 + rootElement.lang.alarm_name_11111;
            armType = 704;
            shield = "704,754";
            break;
        case 3005:
            info = rootElement.lang.alarm_name_706 + rootElement.lang.alarm_name_11111;
            armType = 706;
            shield = "706,756";
            break;
        case 3006:
            info = rootElement.lang.alarm_name_708 + rootElement.lang.alarm_name_11111;
            armType = 708;
            shield = "708,758";
            break;
        case 3007:
            info = rootElement.lang.alarm_name_710 + rootElement.lang.alarm_name_11111;
            armType = 710;
            shield = "710,760";
            break;
        case 3008:
            info = rootElement.lang.alarm_name_624 + rootElement.lang.alarm_name_11111;
            armType = 624;
            shield = "624,674";
            break;
        case 3009:
            info = rootElement.lang.alarm_name_626 + rootElement.lang.alarm_name_11111;
            armType = 626;
            shield = "626,676";
            break;
        case 3010:
            info = rootElement.lang.alarm_name_641 + rootElement.lang.alarm_name_11111;
            armType = 641;
            shield = "641,691";
            break;
        case 3011:
            info = rootElement.lang.alarm_name_639 + rootElement.lang.alarm_name_11111;
            armType = 639;
            shield = "639,689";
            break;
        case 3012:
            info = rootElement.lang.alarm_name_717 + rootElement.lang.alarm_name_11111;
            armType = 717;
            shield = "717,767";
            break;
        case 3013:
            info = rootElement.lang.alarm_name_734 + rootElement.lang.alarm_name_11111;
            armType = 734;
            shield = "734,784";
            break;
        case 3014:
            info = rootElement.lang.alarm_name_736 + rootElement.lang.alarm_name_11111;
            armType = 736;
            shield = "736,786";
            break;
        case 3015:
            info = rootElement.lang.alarm_name_738 + rootElement.lang.alarm_name_11111;
            armType = 738;
            shield = "738,788";
            break;
        case 3016:
            info = rootElement.lang.alarm_name_745 + rootElement.lang.alarm_name_11111;
            armType = 745;
            shield = "745,795";
            break;
        case 3017:
            info = rootElement.lang.alarm_name_644 + rootElement.lang.alarm_name_11111;
            armType = 644;
            shield = "644,694";
            break;
        case 3018:
            info = rootElement.lang.alarm_name_845 + rootElement.lang.alarm_name_11111;
            armType = 845;
            shield = "845,895";
            break;
        case 3019:
            info = rootElement.lang.alarm_name_525 + rootElement.lang.alarm_name_11111;
            armType = 525;
            shield = "525,575";
            break;
        case 3020:
            info = rootElement.lang.alarm_name_528;
            armType = 528;
            shield = "528,578";
            break;
        case 3021:
            info = rootElement.lang.alarm_name_529;
            armType = 529;
            shield = "529,579";
            break;
        case 3022://酒测正常
            info = rootElement.lang.alarm_name_1226 + rootElement.lang.alarm_name_11111;
            armType = 1226;
            shield = "1226,1276";
            break;
        case 3023://未完成酒测
            info = rootElement.lang.alarm_name_1228 + rootElement.lang.alarm_name_11111;
            armType = 1228;
            shield = "1228,1278";
            break;
        case 3024: //酒后驾驶
            info = rootElement.lang.alarm_name_1230 + rootElement.lang.alarm_name_11111;
            armType = 1230;
            shield = "1230,1280";
            break;
        case 3025: //醉驾驾驶
            info = rootElement.lang.alarm_name_1232 + rootElement.lang.alarm_name_11111;
            armType = 1232;
            shield = "1232,1282";
            break;
        case 3026: //夜间禁行
            info = rootElement.lang.alarm_name_1238 + rootElement.lang.alarm_name_11111;
            armType = 1238;
            shield = "1238,1288";
            break;
        case 3027: // IC 卡读卡失败报警
            info = rootElement.lang.alarm_name_1404 + rootElement.lang.alarm_name_11111;
            armType = 1404;
            shield = "1404,1454";
            break;
        case 3028: // 司机未佩戴口罩报警
            info = rootElement.lang.alarm_name_1429;
            armType = 1429;
            shield = "1429,1479";
            break;


        case 4000:
            info = rootElement.lang.alarm_name_618 + rootElement.lang.alarm_name_22222;
            armType = 619;
            shield = "619,669";
            break;
        case 4001:
            info = rootElement.lang.alarm_name_620 + rootElement.lang.alarm_name_22222;
            armType = 621;
            shield = "621,671";
            break;
        case 4002:
            info = rootElement.lang.alarm_name_622 + rootElement.lang.alarm_name_22222;
            armType = 623;
            shield = "623,673";
            break;
        case 4003:
            info = rootElement.lang.alarm_name_702 + rootElement.lang.alarm_name_22222;
            armType = 703;
            shield = "703,753";
            break;
        case 4004:
            info = rootElement.lang.alarm_name_704 + rootElement.lang.alarm_name_22222;
            armType = 705;
            shield = "705,755";
            break;
        case 4005:
            info = rootElement.lang.alarm_name_706 + rootElement.lang.alarm_name_22222;
            armType = 707;
            shield = "707,757";
            break;
        case 4006:
            info = rootElement.lang.alarm_name_708 + rootElement.lang.alarm_name_22222;
            armType = 709;
            shield = "709,759";
            break;
        case 4007:
            info = rootElement.lang.alarm_name_710 + rootElement.lang.alarm_name_22222;
            armType = 711;
            shield = "711,761";
            break;
        case 4008:
            info = rootElement.lang.alarm_name_624 + rootElement.lang.alarm_name_22222;
            armType = 625;
            shield = "625,675";
            break;
        case 4009:
            info = rootElement.lang.alarm_name_626 + rootElement.lang.alarm_name_22222;
            armType = 627;
            shield = "627,677";
            break;
        case 4010:
            info = rootElement.lang.alarm_name_641 + rootElement.lang.alarm_name_22222;
            armType = 642;
            shield = "642,692";
            break;
        case 4011:
            info = rootElement.lang.alarm_name_639 + rootElement.lang.alarm_name_22222;
            armType = 640;
            shield = "640,690";
            break;
        case 4012:
            info = rootElement.lang.alarm_name_717 + rootElement.lang.alarm_name_22222;
            armType = 718;
            shield = "718,768";
            break;
        case 4013:
            info = rootElement.lang.alarm_name_734 + rootElement.lang.alarm_name_22222;
            armType = 735;
            shield = "735,785";
            break;
        case 4014:
            info = rootElement.lang.alarm_name_736 + rootElement.lang.alarm_name_22222;
            armType = 737;
            shield = "737,787";
            break;
        case 4015:
            info = rootElement.lang.alarm_name_738 + rootElement.lang.alarm_name_22222;
            armType = 739;
            shield = "739,789";
            break;
        case 4016:
            info = rootElement.lang.alarm_name_745 + rootElement.lang.alarm_name_22222;
            armType = 746;
            shield = "746,796";
            break;
        case 4017:
            info = rootElement.lang.alarm_name_644 + rootElement.lang.alarm_name_22222;
            armType = 645;
            shield = "645,695";
            break;
        case 4018:
            info = rootElement.lang.alarm_name_845 + rootElement.lang.alarm_name_22222;
            armType = 846;
            shield = "846,896";
            break;
        case 4019:
            info = rootElement.lang.alarm_name_525 + rootElement.lang.alarm_name_22222;
            armType = 541;
            shield = "541,591";
            break;
        case 4022://酒测正常
            info = rootElement.lang.alarm_name_1226 + rootElement.lang.alarm_name_22222;
            armType = 1227;
            shield = "1227,1277";
            break;
        case 4023://未完成酒测
            info = rootElement.lang.alarm_name_1228 + rootElement.lang.alarm_name_22222;
            armType = 1229;
            shield = "1229,1279";
            break;
        case 4024: //酒后驾驶
            info = rootElement.lang.alarm_name_1230 + rootElement.lang.alarm_name_22222;
            armType = 1231;
            shield = "1231,1281";
            break;
        case 4025: //醉驾驾驶
            info = rootElement.lang.alarm_name_1232 + rootElement.lang.alarm_name_22222;
            armType = 1233;
            shield = "1233,1283";
            break;
        case 4026: //夜间禁行
            info = rootElement.lang.alarm_name_1238 + rootElement.lang.alarm_name_22222;
            armType = 1239;
            shield = "1239,1289";
            break;
        case 4027: // IC卡读卡失败报警
            info = rootElement.lang.alarm_name_1404 + rootElement.lang.alarm_name_22222;
            armType = 1405;
            shield = "1405,1455";
            break;
        case 4028: // 司机未佩戴口罩报警
            info = rootElement.lang.alarm_name_1429;
            armType = 1429;
            shield = "1429,1479";
            break;

        case 11000:
            info = rootElement.lang.alarm_name_618 + rootElement.lang.alarm_name_33333;
            armType = 1200;
            shield = "1200,1250";
            break;
        case 11001:
            info = rootElement.lang.alarm_name_620 + rootElement.lang.alarm_name_33333;
            armType = 1203;
            shield = "1203,1253";
            break;
        case 11002:
            info = rootElement.lang.alarm_name_622 + rootElement.lang.alarm_name_33333;
            armType = 1202;
            shield = "1202,1252";
            break;
        case 11005:
            info = rootElement.lang.alarm_name_706 + rootElement.lang.alarm_name_33333;
            armType = 1205;
            shield = "1205,1255";
            break;
        case 11007:
            info = rootElement.lang.alarm_name_710 + rootElement.lang.alarm_name_33333;
            armType = 1204;
            shield = "1204,1254";
            break;
        case 11008:
            info = rootElement.lang.alarm_name_624 + rootElement.lang.alarm_name_33333;
            armType = 1201;
            shield = "1201,1251";
            break;
        case 11009:
            info = rootElement.lang.alarm_name_626 + rootElement.lang.alarm_name_33333;
            armType = 1206;
            shield = "1206,1256";
            break;
        case 11028: // 司机未佩戴口罩报警
            info = rootElement.lang.alarm_name_1429;
            armType = 1429;
            shield = "1429,1479";
            break;

        //主动安全bsd报警状态位(+5000)
        /* 	0：左侧盲区报警 	1：右侧盲区报警 	2：后方接近报警  3:右侧盲区一级报警  4:右侧盲区二级报警  5:右侧盲区三级报警
            6:前向盲区报警 1级  7:前向盲区报警 2级  8:右侧盲区报警  9:车前盲区 10:右侧前方接近报警
        */

        case 5000:
            info = rootElement.lang.alarm_name_633;
            armType = 633;
            shield = "633,683";
            break;
        case 5001:
            info = rootElement.lang.alarm_name_634;
            armType = 634;
            shield = "634,684";
            break;
        case 5002:
            info = rootElement.lang.alarm_name_635;
            armType = 635;
            shield = "635,685";
            break;
        case 5003:
            info = rootElement.lang.alarm_name_747;
            armType = 747;
            shield = "747,797";
            break;
        case 5004:
            info = rootElement.lang.alarm_name_748;
            armType = 748;
            shield = "748,798";
            break;
        case 5005:
            info = rootElement.lang.alarm_name_749;
            armType = 749;
            shield = "749,799";
            break;
        case 5006:
            info = rootElement.lang.alarm_name_1234 + rootElement.lang.alarm_name_11111;
            armType = 1234;
            shield = "1234,1284";
            break;
        case 5007:
            info = rootElement.lang.alarm_name_1234 + rootElement.lang.alarm_name_22222;
            armType = 1235;
            shield = "1235,1285";
            break;
        case 5008:
            info = rootElement.lang.alarm_name_1414;
            armType = 1414;
            shield = "1414,1464";
            break;
        case 5009:
            info = rootElement.lang.alarm_name_1415;
            armType = 1415;
            shield = "1415,1465";
            break;
        case 5010:
            info = rootElement.lang.alarm_name_1432;
            armType = 1432;
            shield = "1432,1482";
            break;
        //激烈驾驶报警(+6000)
        /*	0:急加速报警	1:急减速报警	2:急转弯报警	3:怠速报警	4:异常熄火报警	5:空挡滑行报警	6:发动机超转报警
             7:侧翻报警  8:碰撞报警  9:启动  10:停止   11:IO_1  12:IO_2  ....  22:IO_12
        */
        case 6000:
            info = rootElement.lang.alarm_name_720;
            armType = 720;
            shield = "720,770";
            break;
        case 6001:
            info = rootElement.lang.alarm_name_721;
            armType = 721;
            shield = "721,771";
            break;
        case 6002:
            info = rootElement.lang.alarm_name_722;
            armType = 722;
            shield = "722,772";
            break;
        case 6003:
            info = rootElement.lang.alarm_name_723;
            armType = 723;
            shield = "723,773";
            break;
        case 6004:
            info = rootElement.lang.alarm_name_724;
            armType = 724;
            shield = "724,774";
            break;
        case 6005:
            info = rootElement.lang.alarm_name_725;
            armType = 725;
            shield = "725,775";
            break;
        case 6006:
            info = rootElement.lang.alarm_name_726;
            armType = 726;
            shield = "726,776";
            break;
        case 6007:
            info = rootElement.lang.alarm_name_1236;
            armType = 1236;
            shield = "1236,1286";
            break;
        case 6008:
            info = rootElement.lang.alarm_name_1242;
            armType = 1242;
            shield = "1242,1292";
            break;
        case 6009:
            info = rootElement.lang.alarm_name_1243;
            armType = 1243;
            shield = "1243,1293";
            break;
        case 6010:
            info = rootElement.lang.alarm_name_1244;
            armType = 1244;
            shield = "1244,1294";
            break;
        // 11:IO_1  12:IO_2  ....  22:IO_12
        case 6011:
        case 6012:
        case 6013:
        case 6014:
        case 6015:
        case 6016:
        case 6017:
        case 6018:
        case 6019:
        case 6020:
        case 6021:
        case 6022:
            var ioName = "";
            var io = safetyAlarm - 6011;
            var startType = io + 1416;
            if (rootElement.vehicleManager) {
                var device = rootElement.vehicleManager.getDevice(this.devIdno);
                var ioInName = device.getIoInName();
                if (ioInName != null && ioInName != '') {
                    var ioInNames = ioInName.split(',');
                    if (ioInNames.length >= (Number(io) + 1)) {
                        ioName = ioInNames[io];
                    }
                }
                // 默认名称()
                if (ioName == '' && rootElement.lang["alarm_name_" + startType]) {
                    ioName = rootElement.lang["alarm_name_" + startType];
                }
            }

            info = ioName;
            armType = startType;
            shield = startType + "," + (startType + 50);
            break;
        //智能检测(上海) 一级(+7000)
        //智能检测(上海) 二级(+8000)
        /*	0:车厢超载报警	1:站外上客报警
        */
        case 7000:
            info = rootElement.lang.alarm_name_740 + rootElement.lang.alarm_name_11111;
            armType = 740;
            shield = "740,790";
            break;
        case 7001:
            info = rootElement.lang.alarm_name_742 + rootElement.lang.alarm_name_11111;
            armType = 742;
            shield = "742,792";
            break;
        case 8000:
            info = rootElement.lang.alarm_name_740 + rootElement.lang.alarm_name_22222;
            armType = 741;
            shield = "741,791";
            break;
        case 8001:
            info = rootElement.lang.alarm_name_742 + rootElement.lang.alarm_name_22222;
            armType = 743;
            shield = "743,793";
            break;
        //黑标相关报警 (+9000)
        /*  0:人证不符报警  1:IC 卡从业资格证读卡失败报警  2:事故报警  3:主存储器异常报警  4:备用存储器异常报警  5:卫星信号异常报警
        6:通信信号异常报警  7:备用电池欠压报警  8:备用电池失效报警  9:IC 卡从业资格证模块故障报警
        */
        case 9000:
            info = rootElement.lang.alarm_name_510;
            armType = 510;
            shield = "510,560";
            break;
        case 9001:
            info = rootElement.lang.alarm_name_511;
            armType = 511;
            shield = "511,561";
            break;
        case 9002:
            info = rootElement.lang.alarm_name_515;
            armType = 515;
            shield = "515,565";
            break;
        case 9003:
            info = rootElement.lang.alarm_name_516;
            armType = 516;
            shield = "516,566";
            break;
        case 9004:
            info = rootElement.lang.alarm_name_517;
            armType = 517;
            shield = "517,567";
            break;
        case 9005:
            info = rootElement.lang.alarm_name_518;
            armType = 518;
            shield = "518,568";
            break;
        case 9006:
            info = rootElement.lang.alarm_name_519;
            armType = 519;
            shield = "519,569";
            break;
        case 9007:
            info = rootElement.lang.alarm_name_520;
            armType = 520;
            shield = "520,570";
            break;
        case 9008:
            info = rootElement.lang.alarm_name_521;
            armType = 521;
            shield = "521,571";
            break;
        case 9009:
            info = rootElement.lang.alarm_name_522;
            armType = 522;
            shield = "522,572";
            break;
    }

    if (this.isAlarmShield(shield)) {
        normal.push(info);
    } else {
        alarm.push(info);
    }
    alarmType.push(armType);

}


//adas相关报警解析
standardStatus.prototype.isAdasAlarm = function () {
    var ret = {};
    var normal = [];
    var alarm = [];
    //alarmType 轨迹回放使用
    var alarmType = [];
    if (this.sensor3) {
//		var diskErrFalg = this.sensor3 & parseInt("FFFF",16);//bit0～bit11分别表示第 1～12 个主存储 器， bit12～bit15分别表示 第 1～4个灾备存储装置
        var ADASAlarmL1 = (this.sensor3 >> 16) & parseInt("7F", 16);
        var ADASAlarmL2 = (this.sensor3 >> 23) & parseInt("7F", 16);
        var roadFlagType = (this.sensor3 >> 30) & 3;//道路标识
        /* 	0：前向碰撞报警 	1：车道偏离报警 	2：车距过近报警 	3：行人碰撞报警 	4：频繁变道报警 5：道路标识超限报警 6：障碍物报警
        */
        if ((ADASAlarmL1 & 1) || (ADASAlarmL2 & 1)) {
            //一级报警
            if (ADASAlarmL1 & 1) {
                var info = rootElement.lang.alarm_name_600 + rootElement.lang.alarm_name_11111;
                if (this.isAlarmShield('600,650')) {
//					前向碰撞报警一级
                    normal.push(info);
                } else {
                    alarm.push(info);
                }
                alarmType.push(600);
            }
            //二级报警
            if (ADASAlarmL2 & 1) {
                var info = rootElement.lang.alarm_name_600 + rootElement.lang.alarm_name_22222;
                if (this.isAlarmShield('601,651')) {
//					前向碰撞报警二级
                    normal.push(info);
                } else {
                    alarm.push(info);
                }
                alarmType.push(601);
            }
        }
        if (((ADASAlarmL1 >> 1) & 1) || ((ADASAlarmL2 >> 1) & 1)) {
            if ((ADASAlarmL1 >> 1) & 1) {
                var info = rootElement.lang.alarm_name_602 + rootElement.lang.alarm_name_11111;
                if (this.isAlarmShield('602,652')) {
//					车道偏离报警
                    normal.push(info);
                } else {
                    alarm.push(info);
                }
                alarmType.push(602);
            }
            if ((ADASAlarmL2 >> 1) & 1) {
                var info = rootElement.lang.alarm_name_602 + rootElement.lang.alarm_name_22222;
                if (this.isAlarmShield('603,653')) {
//					车道偏离报警
                    normal.push(info);
                } else {
                    alarm.push(info);
                }
                alarmType.push(603);
            }
        }
        //车距过近报警
        if (((ADASAlarmL1 >> 2) & 1) || ((ADASAlarmL2 >> 2) & 1)) {
            if ((ADASAlarmL1 >> 2) & 1) {
                var info = rootElement.lang.alarm_name_604 + rootElement.lang.alarm_name_11111;
                if (this.isAlarmShield('604,654')) {
//					车距过近报警
                    normal.push(info);
                } else {
                    alarm.push(info);
                }
                alarmType.push(604);
            }
            if ((ADASAlarmL2 >> 2) & 1) {
                var info = rootElement.lang.alarm_name_604 + rootElement.lang.alarm_name_22222;
                if (this.isAlarmShield('605,655')) {
//					车距过近报警
                    normal.push(info);
                } else {
                    alarm.push(info);
                }
                alarmType.push(605);
            }
        }
        //行人碰撞报警
        if (((ADASAlarmL1 >> 3) & 1) || ((ADASAlarmL2 >> 3) & 1)) {
            if ((ADASAlarmL1 >> 3) & 1) {
                var info = rootElement.lang.alarm_name_606 + rootElement.lang.alarm_name_11111;
                if (this.isAlarmShield('606,656')) {
//				行人碰撞报警
                    normal.push(info);
                } else {
                    alarm.push(info);
                }
                alarmType.push(606);
            }
            if ((ADASAlarmL2 >> 3) & 1) {
                var info = rootElement.lang.alarm_name_606 + rootElement.lang.alarm_name_22222;
                if (this.isAlarmShield('607,657')) {
//				行人碰撞报警
                    normal.push(info);
                } else {
                    alarm.push(info);
                }
                alarmType.push(607);
            }
        }
        if (((ADASAlarmL1 >> 4) & 1) || ((ADASAlarmL2 >> 4) & 1)) {
            if ((ADASAlarmL1 >> 4) & 1) {
                var info = rootElement.lang.alarm_name_608 + rootElement.lang.alarm_name_11111;
                if (this.isAlarmShield('608,658')) {
                    //				频繁变道报警
                    normal.push(info);
                } else {
                    alarm.push(info);
                }
                alarmType.push(608);
            }
            if ((ADASAlarmL2 >> 4) & 1) {
                var info = rootElement.lang.alarm_name_608 + rootElement.lang.alarm_name_22222;
                if (this.isAlarmShield('609,659')) {
                    //				频繁变道报警
                    normal.push(info);
                } else {
                    alarm.push(info);
                }
                alarmType.push(609);
            }
        }
        if (((ADASAlarmL1 >> 5) & 1) || ((ADASAlarmL2 >> 5) & 1)) {
            if ((ADASAlarmL1 >> 5) & 1) {
                var info = rootElement.lang.alarm_name_610 + rootElement.lang.alarm_name_11111;
                if (this.isAlarmShield('610,660')) {
//					道路标识超限报警
                    normal.push(info);
                } else {
                    alarm.push(info);
                }
                alarmType.push(610);
            }
            if ((ADASAlarmL2 >> 5) & 1) {
                var info = rootElement.lang.alarm_name_610 + rootElement.lang.alarm_name_22222;
                if (this.isAlarmShield('611,661')) {
//					道路标识超限报警
                    normal.push(info);
                } else {
                    alarm.push(info);
                }
                alarmType.push(611);
            }
        }
        if (((ADASAlarmL1 >> 6) & 1) || ((ADASAlarmL2 >> 6) & 1)) {
            if ((ADASAlarmL1 >> 6) & 1) {
                var info = rootElement.lang.alarm_name_612 + rootElement.lang.alarm_name_11111;
                if (this.isAlarmShield('612,662')) {
//					障碍物报警
                    normal.push(info);
                } else {
                    alarm.push(info);
                }
                alarmType.push(612);
            }
            if ((ADASAlarmL2 >> 6) & 1) {
                var info = rootElement.lang.alarm_name_612 + rootElement.lang.alarm_name_22222;
                if (this.isAlarmShield('613,663')) {
//					障碍物报警
                    normal.push(info);
                } else {
                    alarm.push(info);
                }
                alarmType.push(613);
            }
        }
        //只加一遍道路标识等
        var roadFlagDataStr = "";
        //道路标志识别数据
        if (this.sensor2) {
            var roadFlagData = (this.sensor2 >> 16) & parseInt("FF", 16);
            if (roadFlagData) {
                roadFlagDataStr = rootElement.lang.reportInfo_roadSigns + roadFlagData;
            }
        }
        //获取道路标识类型   0x06
//		var roadFlagType2 = this.getRoadFlagType(roadFlagType);
        var roadFlagType2 = "";
        if (((ADASAlarmL1 >> 5) & 1) || ((ADASAlarmL2 >> 5) & 1)) {
            roadFlagType2 = this.getRoadFlagType(roadFlagType);
        }
        //前车车速    0x01 和 0x02 时	有效
//		var frontVehiSpeed = this.getFrontVehiSpeed();
        var frontVehiSpeed = "";
        if (((ADASAlarmL1) & 1) || ((ADASAlarmL2) & 1)
            || ((ADASAlarmL1 >> 1) & 1) || ((ADASAlarmL2 >> 1) & 1)) {
            frontVehiSpeed = this.getFrontVehiSpeed();
        }
        // 前车/行人距离    0x01 、0x02 和 0x04 时有效
//		var distinceTime =  this.getDistinceTime();
        var distinceTime = "";
        if (((ADASAlarmL1) & 1) || ((ADASAlarmL2) & 1)
            || ((ADASAlarmL1 >> 1) & 1) || ((ADASAlarmL2 >> 1) & 1)
            || ((ADASAlarmL1 >> 3) & 1) || ((ADASAlarmL2 >> 3) & 1)) {
            distinceTime = this.getDistinceTime();
        }
        //偏离类型(0:左侧 1:右侧)  //0x02
        var deviationType = "";
        if (((ADASAlarmL1 >> 1) & 1) || ((ADASAlarmL2 >> 1) & 1)) {
            deviationType = this.getDeviationType();
        }
        var isNeedPush = true;
        if (normal.length > 0) {
            isNeedPush = false;
            if (roadFlagDataStr) {
                normal.push(roadFlagDataStr);
            }
            if (roadFlagType2) {
                normal.push(roadFlagType2);
            }
            if (frontVehiSpeed) {
                normal.push(frontVehiSpeed);
            }
            if (distinceTime) {
                normal.push(distinceTime);
            }
            if (deviationType) {
                normal.push(deviationType);
            }
        }
        if (alarm.length > 0 && isNeedPush) {
            alarm.push("|");
            if (roadFlagDataStr) {
                alarm.push(roadFlagDataStr);
            }
            if (roadFlagType2) {
                alarm.push(roadFlagType2);
            }
            if (frontVehiSpeed) {
                alarm.push(frontVehiSpeed);
            }
            if (distinceTime) {
                alarm.push(distinceTime);
            }
            if (deviationType) {
                alarm.push(deviationType);
            }
        }
    }
    ret.normal = normal.toString();
    ret.alarm = alarm.toString();
    ret.alarmType = alarmType.toString();//轨迹回放用
    return ret;
}

//longGps新解析
standardStatus.prototype.isDsmAlarmNew = function () {
    var ret = {};
    var normal = [];
    var alarm = [];
    var alarmType = [];

    var DSMAlarmL1 = this.dsmAlarmL1;//苏标DSM报警位(一级)
    var DSMAlarmL2 = this.dsmAlarmL2;//苏标DSM报警位(二级)
//	this.roadFlagType = 0;//bit0-1 道路标志识别类型(0：限速标志 1：限高标志 2：限重标志)仅报警类型为 0x06 时有效    bit2: //分神驾驶报警 2级(平台)
    //bit3-bit6:智能检测(上海) bit3:车厢超载报警1级  bit4:车厢超载报警2级	bit5:站外上客报警1级  bit6:站外上客报警2级
    var distractedDriving = Number(this.roadFlagType) & 4; //分神驾驶报警 2级(平台)  占时未传
//	var ucAlarmEx = this.extraStatus; //苏标报警扩展状态位  ==? //扩展车辆信号状态位(0x25)
    var ucAlarmEx = 0;
    if (distractedDriving) {
        var info = rootElement.lang.alarm_name_637;
        if (this.isAlarmShield('637,687')) {
//				疲劳驾驶报警
            normal.push(info);
        } else {
            alarm.push(info);
        }
        alarmType.push(637);
    }
    //0:疲劳驾驶报警
    var tailStr_ = null;

    /* 	0:疲劳驾驶报警 1:接打电话报警 2:抽烟报警 	3:长时间不目视前方报警 	4:系统不能正常工作报警  5:未系安全带报警
        6:未检测到驾驶员报警 	7:双手同时脱离方向盘报警  8:分神驾驶报警(苏) 9:驾驶员异常报警(苏) 10:驾驶员IC卡异常报警(陕)
        11:墨镜失效	12:驾驶员行为监测功能失效报警	13:探头遮挡报警	14:换人驾驶报警	15:超时驾驶报警
        16:单手脱离方向盘报警	17:喝水报警  18:长时间驾驶  19:玩手机  20:巡检乘客安全带  21:夜间异动
*/
    if ((DSMAlarmL1 & 1) || (DSMAlarmL2 & 1)) {
        var fatigueLv = this.fatigueLv;//苏标DSM报警位(二级)
        if (fatigueLv) {
            tailStr_ += ";" + rootElement.lang.fatigue_driving + ":" + fatigueLv;
        }
        if (this.yawningNum) {
            tailStr_ += ";" + rootElement.lang.yawning_number + ":" + this.yawningNum;
        }
        if (this.closedEyeTime) {
            tailStr_ += ";" + rootElement.lang.closed_eye_time + ":" + this.closedEyeTime * 100 + "ms";
        }
        if (this.winkCount) {
            tailStr_ += ";" + rootElement.lang.wink_count + ":" + this.winkCount;
        }
        if (DSMAlarmL1 & 1) {
            var info = rootElement.lang.alarm_name_618 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('618,668')) {
//					疲劳驾驶报警
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(618);
        }
        if (DSMAlarmL2 & 1) {
            var info = rootElement.lang.alarm_name_618 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('619,669')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(619);
        }
    }
    if (((DSMAlarmL1 >> 1) & 1) || ((DSMAlarmL2 >> 1) & 1)) {
        if ((DSMAlarmL1 >> 1) & 1) {
            var info = rootElement.lang.alarm_name_620 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('620,670')) {
//					接打电话报警
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(620);
        }
        if ((DSMAlarmL2 >> 1) & 1) {
            var info = rootElement.lang.alarm_name_620 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('621,671')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(621);
        }
    }
    if (((DSMAlarmL1 >> 2) & 1) || ((DSMAlarmL2 >> 2) & 1)) {
        if ((DSMAlarmL1 >> 2) & 1) {
            var info = rootElement.lang.alarm_name_622 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('622,672')) {
//					抽烟报警
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(622);
        }
        if ((DSMAlarmL2 >> 2) & 1) {
            var info = rootElement.lang.alarm_name_622 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('623,673')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(623);
        }
    }
    if (((DSMAlarmL1 >> 3) & 1) || ((DSMAlarmL2 >> 3) & 1)) {
        if ((DSMAlarmL1 >> 3) & 1) {
            var info = rootElement.lang.alarm_name_702 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('702,752')) {
//					分神驾驶报警
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(702);
        }
        if ((DSMAlarmL2 >> 3) & 1) {
            var info = rootElement.lang.alarm_name_702 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('703,753')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(703);
        }
    }
    if (((DSMAlarmL1 >> 4) & 1) || ((DSMAlarmL2 >> 4) & 1)) {
        if ((DSMAlarmL1 >> 4) & 1) {
            var info = rootElement.lang.alarm_name_704 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('704,754')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(704);
        }
        if ((DSMAlarmL2 >> 4) & 1) {
            var info = rootElement.lang.alarm_name_704 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('705,755')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(705);
        }
    }
    if (((DSMAlarmL1 >> 5) & 1) || ((DSMAlarmL2 >> 5) & 1)) {
        if ((DSMAlarmL1 >> 5) & 1) {
            var info = rootElement.lang.alarm_name_706 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('706,756')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(706);
        }
        if ((DSMAlarmL2 >> 5) & 1) {
            var info = rootElement.lang.alarm_name_706 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('707,757')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(707);
        }
    }
    if (((DSMAlarmL1 >> 6) & 1) || ((DSMAlarmL2 >> 6) & 1)) {
        if ((DSMAlarmL1 >> 6) & 1) {
            var info = rootElement.lang.alarm_name_708 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('708,758')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(708);
        }
        if ((DSMAlarmL2 >> 6) & 1) {
            var info = rootElement.lang.alarm_name_708 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('709,759')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(709);
        }
    }
    if (((DSMAlarmL1 >> 7) & 1) || ((DSMAlarmL2 >> 7) & 1)) {
        if ((DSMAlarmL1 >> 7) & 1) {
            var info = rootElement.lang.alarm_name_710 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('710,760')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(710);
        }
        if ((DSMAlarmL2 >> 7) & 1) {
            var info = rootElement.lang.alarm_name_710 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('711,761')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(711);
        }
    }
    if (((DSMAlarmL1 >> 8) & 1) || ((DSMAlarmL2 >> 8) & 1)) {
        if ((DSMAlarmL1 >> 8) & 1) {
            var info = rootElement.lang.alarm_name_624 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('624,674')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(624);
        }
        if ((DSMAlarmL2 >> 8) & 1) {
            var info = rootElement.lang.alarm_name_624 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('625,675')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(625);
        }
    }
    if (((DSMAlarmL1 >> 9) & 1) || ((DSMAlarmL2 >> 9) & 1)) {
        if ((DSMAlarmL1 >> 9) & 1) {
            var info = rootElement.lang.alarm_name_626 + rootElement.lang.alarm_name_11111
            if (this.isAlarmShield('626,676')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(626);
        }
        if ((DSMAlarmL2 >> 9) & 1) {
            var info = rootElement.lang.alarm_name_626 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('627,677')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(627);
        }
    }
    if (((DSMAlarmL1 >> 10) & 1) || ((DSMAlarmL2 >> 10) & 1)) {
        if ((DSMAlarmL1 >> 10) & 1) {
            var info = rootElement.lang.alarm_name_641 + rootElement.lang.alarm_name_11111
            if (this.isAlarmShield('641,691')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(641);
        }
        if ((DSMAlarmL2 >> 10) & 1) {
            var info = rootElement.lang.alarm_name_641 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('642,692')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(642);
        }
    }
    if (((DSMAlarmL1 >> 11) & 1) || ((DSMAlarmL2 >> 11) & 1)) {
        if ((DSMAlarmL1 >> 11) & 1) {
            var info = rootElement.lang.alarm_name_639 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('639,689')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(639);
        }
        if ((DSMAlarmL2 >> 11) & 1) {
            var info = rootElement.lang.alarm_name_639 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('640,690')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(640);
        }
    }
    if (((DSMAlarmL1 >> 12) & 1) || ((DSMAlarmL2 >> 12) & 1)) {
        if ((DSMAlarmL1 >> 12) & 1) {
            var info = rootElement.lang.alarm_name_717 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('717,767')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(717);
        }
        if ((DSMAlarmL2 >> 12) & 1) {
            var info = rootElement.lang.alarm_name_717 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('718,768')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(718);
        }
    }
    if (((DSMAlarmL1 >> 13) & 1) || ((DSMAlarmL2 >> 13) & 1)) {
        if ((DSMAlarmL1 >> 13) & 1) {
            var info = rootElement.lang.alarm_name_734 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('734,784')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(734);
        }
        if ((DSMAlarmL2 >> 13) & 1) {
            var info = rootElement.lang.alarm_name_734 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('735,785')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(735);
        }
    }
    if (((DSMAlarmL1 >> 14) & 1) || ((DSMAlarmL2 >> 14) & 1)) {
        if ((DSMAlarmL1 >> 14) & 1) {
            var info = rootElement.lang.alarm_name_736 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('736,786')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(736);
        }
        if ((DSMAlarmL2 >> 14) & 1) {
            var info = rootElement.lang.alarm_name_736 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('737,787')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(737);
        }
    }
    if (((DSMAlarmL1 >> 15) & 1) || ((DSMAlarmL2 >> 15) & 1)) {
        if ((DSMAlarmL1 >> 15) & 1) {
            var info = rootElement.lang.alarm_name_738 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('738,788')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(738);
        }
        if ((DSMAlarmL2 >> 15) & 1) {
            var info = rootElement.lang.alarm_name_738 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('739,789')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(739);
        }
    }
    if (((DSMAlarmL1 >> 16) & 1) || ((DSMAlarmL2 >> 16) & 1)) {
        if ((DSMAlarmL1 >> 16) & 1) {
            var info = rootElement.lang.alarm_name_745 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('745,795')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(745);
        }
        if ((DSMAlarmL2 >> 16) & 1) {
            var info = rootElement.lang.alarm_name_745 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('746,796')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(746);
        }
    }
    if (((DSMAlarmL1 >> 17) & 1) || ((DSMAlarmL2 >> 17) & 1)) {
        if ((DSMAlarmL1 >> 17) & 1) {
            var info = rootElement.lang.alarm_name_644 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('644,694')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(644);
        }
        if ((DSMAlarmL2 >> 17) & 1) {
            var info = rootElement.lang.alarm_name_644 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('645,695')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(645);
        }
    }
    if (((DSMAlarmL1 >> 18) & 1) || ((DSMAlarmL2 >> 18) & 1)) {
        if ((DSMAlarmL1 >> 18) & 1) {
            var info = rootElement.lang.alarm_name_845 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('845,895')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(845);
        }
        if ((DSMAlarmL2 >> 18) & 1) {
            var info = rootElement.lang.alarm_name_845 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('846,896')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(846);
        }
    }
    if (((DSMAlarmL1 >> 19) & 1)) {
        var info = rootElement.lang.alarm_name_525 + rootElement.lang.alarm_name_11111;
        if (this.isAlarmShield('525,575')) {
            normal.push(info);
        } else {
            alarm.push(info);
        }
        alarmType.push(525);
    }
    if (((DSMAlarmL1 >> 20) & 1)) {
        var info = rootElement.lang.alarm_name_528;
        if (this.isAlarmShield('528,578')) {
            normal.push(info);
        } else {
            alarm.push(info);
        }
        alarmType.push(528);
    }
    if (((DSMAlarmL1 >> 21) & 1)) {
        var info = rootElement.lang.alarm_name_529;
        if (this.isAlarmShield('529,579')) {
            normal.push(info);
        } else {
            alarm.push(info);
        }
        alarmType.push(529);
    }
    if (((DSMAlarmL1 >> 22) & 1) || ((DSMAlarmL2 >> 22) & 1)) {
        if ((DSMAlarmL1 >> 22) & 1) {
            var info = rootElement.lang.alarm_name_1226 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('1226,1276')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(1226);
        }
        if ((DSMAlarmL2 >> 22) & 1) {
            var info = rootElement.lang.alarm_name_1226 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('1227,1277')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(1227);
        }
    }
    if (((DSMAlarmL1 >> 23) & 1) || ((DSMAlarmL2 >> 23) & 1)) {
        if ((DSMAlarmL1 >> 23) & 1) {
            var info = rootElement.lang.alarm_name_1228 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('1228,1278')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(1228);
        }
        if ((DSMAlarmL2 >> 23) & 1) {
            var info = rootElement.lang.alarm_name_1228 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('1229,1279')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(1229);
        }
    }
    if (((DSMAlarmL1 >> 24) & 1) || ((DSMAlarmL2 >> 24) & 1)) {
        if ((DSMAlarmL1 >> 24) & 1) {
            var info = rootElement.lang.alarm_name_1230 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('1230,1280')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(1230);
        }
        if ((DSMAlarmL2 >> 24) & 1) {
            var info = rootElement.lang.alarm_name_1230 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('1231,1281')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(1231);
        }
    }
    if (((DSMAlarmL1 >> 25) & 1) || ((DSMAlarmL2 >> 25) & 1)) {
        if ((DSMAlarmL1 >> 25) & 1) {
            var info = rootElement.lang.alarm_name_1232 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('1232,1282')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(1232);
        }
        if ((DSMAlarmL2 >> 25) & 1) {
            var info = rootElement.lang.alarm_name_1232 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('1233,1283')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(1233);
        }
    }
    if (((DSMAlarmL1 >> 26) & 1) || ((DSMAlarmL2 >> 26) & 1)) {
        if ((DSMAlarmL1 >> 26) & 1) {
            var info = rootElement.lang.alarm_name_1238 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('1238,1288')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(1238);
        }
        if ((DSMAlarmL2 >> 26) & 1) {
            var info = rootElement.lang.alarm_name_1238 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('1239,1289')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(1239);
        }
    }
    if (((DSMAlarmL1 >> 27) & 1) || ((DSMAlarmL2 >> 27) & 1)) {
        if ((DSMAlarmL1 >> 27) & 1) {
            var info = rootElement.lang.alarm_name_1404 + rootElement.lang.alarm_name_11111;
            if (this.isAlarmShield('1404,1454')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(1404);
        }
        if ((DSMAlarmL2 >> 27) & 1) {
            var info = rootElement.lang.alarm_name_1404 + rootElement.lang.alarm_name_22222;
            if (this.isAlarmShield('1405,1455')) {
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(1405);
        }
    }
    if (((DSMAlarmL1 >> 28) & 1)) {
        var info = rootElement.lang.alarm_name_1429;
        if (this.isAlarmShield('1429,1479')) {
            normal.push(info);
        } else {
            alarm.push(info);
        }
        alarmType.push(1429);
    }


    /************信息描述屏蔽****************/
    /*	var isNeedPush = true;
	if(normal.length > 0){
		isNeedPush = false;
		if(tailStr_){
			normal.push(tailStr_);
		}
	}
	if(alarm.length > 0 && isNeedPush && tailStr_){
        alarm.push("|");
		if(tailStr_){
			alarm.push(tailStr_);
		}
	}*/


    ret.normal = normal.toString();
    ret.alarm = alarm.toString();
    ret.alarmType = alarmType.toString();
    return ret;
}

//dsm相关报警解析
standardStatus.prototype.isDsmAlarm = function () {
    var ret = {};
    var normal = [];
    var alarm = [];
    var alarmType = [];
    if (this.sensor4) {
        var DSMAlarmL1 = (this.sensor4) & parseInt("1F", 16);//苏标DSM报警位(一级)
        var DSMAlarmL2 = (this.sensor4 >> 5) & parseInt("1F", 16);//苏标DSM报警位(二级)
        var distractedDriving = (this.sensor4 >> 10) & 1;//分神驾驶报警 2级(平台)
        var ucAlarmEx = (this.sensor4 >> 16) & parseInt("1F", 16); //苏标报警扩展状态位

        if (distractedDriving) {
            var info = rootElement.lang.alarm_name_637;
            if (this.isAlarmShield('637,687')) {
//				疲劳驾驶报警
                normal.push(info);
            } else {
                alarm.push(info);
            }
            alarmType.push(637);
        }
        if ((DSMAlarmL1 & 1) || (DSMAlarmL2 & 1)) {
            var fatigueLv = (this.sensor4 >> 11) & parseInt("F", 16);//苏标DSM报警位(二级)
            var tailStr = "";
            if (fatigueLv) {
                tailStr += ";" + rootElement.lang.fatigue_driving + ":" + fatigueLv;
            }
            if (DSMAlarmL1 & 1) {
                var info = rootElement.lang.alarm_name_618 + rootElement.lang.alarm_name_11111 + tailStr;
                if (this.isAlarmShield('618,668')) {
//					疲劳驾驶报警
                    normal.push(info);
                } else {
                    alarm.push(info);
                }
                alarmType.push(618);
            }
            if (DSMAlarmL2 & 1) {
                var info = rootElement.lang.alarm_name_618 + rootElement.lang.alarm_name_22222 + tailStr;
                if (this.isAlarmShield('619,669')) {
                    normal.push(info);
                } else {
                    alarm.push(info);
                }
                alarmType.push(619);
            }
        }

        if (((DSMAlarmL1 >> 1) & 1) || ((DSMAlarmL2 >> 1) & 1)) {
            if ((DSMAlarmL1 >> 1) & 1) {
                var info = rootElement.lang.alarm_name_620 + rootElement.lang.alarm_name_11111;
                if (this.isAlarmShield('620,670')) {
//					接打电话报警
                    normal.push(info);
                } else {
                    alarm.push(info);
                }
                alarmType.push(620);
            }
            if ((DSMAlarmL2 >> 1) & 1) {
                var info = rootElement.lang.alarm_name_620 + rootElement.lang.alarm_name_22222;
                if (this.isAlarmShield('621,671')) {
                    normal.push(info);
                } else {
                    alarm.push(info);
                }
                alarmType.push(621);
            }
        }
        if (((DSMAlarmL1 >> 2) & 1) || ((DSMAlarmL2 >> 2) & 1)) {
            if ((DSMAlarmL1 >> 2) & 1) {
                var info = rootElement.lang.alarm_name_622 + rootElement.lang.alarm_name_11111;
                if (this.isAlarmShield('622,672')) {
//					抽烟报警
                    normal.push(info);
                } else {
                    alarm.push(info);
                }
                alarmType.push(622);
            }
            if ((DSMAlarmL2 >> 2) & 1) {
                var info = rootElement.lang.alarm_name_622 + rootElement.lang.alarm_name_22222;
                if (this.isAlarmShield('623,673')) {
                    normal.push(info);
                } else {
                    alarm.push(info);
                }
                alarmType.push(623);
            }
        }
        if (((DSMAlarmL1 >> 3) & 1) || ((DSMAlarmL2 >> 3) & 1)) {
            if ((DSMAlarmL1 >> 3) & 1) {
                var info = rootElement.lang.alarm_name_624 + rootElement.lang.alarm_name_11111;
                if (this.isAlarmShield('624,674')) {
//					分神驾驶报警
                    normal.push(info);
                } else {
                    alarm.push(info);
                }
                alarmType.push(624);
            }
            if ((DSMAlarmL2 >> 3) & 1) {
                var info = rootElement.lang.alarm_name_624 + rootElement.lang.alarm_name_22222;
                if (this.isAlarmShield('625,675')) {
                    normal.push(info);
                } else {
                    alarm.push(info);
                }
                alarmType.push(625);
            }
        }
        if (((DSMAlarmL1 >> 4) & 1) || ((DSMAlarmL2 >> 4) & 1)) {
            if ((DSMAlarmL1 >> 4) & 1) {
                var info = rootElement.lang.alarm_name_626 + rootElement.lang.alarm_name_11111
                if (this.isAlarmShield('626,676')) {
                    normal.push(info);
                } else {
                    alarm.push(info);
                }
                alarmType.push(626);
            }
            if ((DSMAlarmL2 >> 4) & 1) {
                var info = rootElement.lang.alarm_name_626 + rootElement.lang.alarm_name_22222;
                if (this.isAlarmShield('627,677')) {
                    normal.push(info);
                } else {
                    alarm.push(info);
                }
                alarmType.push(627);
            }
        }
        if (!enableSubiao()) {
            if (ucAlarmEx & 1) {
                var info = rootElement.lang.alarm_name_641 + rootElement.lang.alarm_name_11111;
                if (this.isAlarmShield('641,691')) {
                    normal.push(info);
                } else {
                    alarm.push(info);
                }
                alarmType.push(641);
            }
            if ((ucAlarmEx >> 1) & 1) {
                var info = rootElement.lang.alarm_name_641 + rootElement.lang.alarm_name_22222;
                if (this.isAlarmShield('642,692')) {
                    normal.push(info);
                } else {
                    alarm.push(info);
                }
                alarmType.push(642);
            }
        }


    }
    ret.normal = normal.toString();
    ret.alarm = alarm.toString();
    ret.alarmType = alarmType.toString();
    return ret;
}


/**
 *偏离类型(0:左侧 1:右侧)仅报警类型为 0x02 时有效
 */
standardStatus.prototype.getDeviationType = function (isLongGPS) {
    var deviation = "";
    if (isLongGPS) {
        var tpStr = rootElement.lang.deviation_left;
        if (this.deviationType && (this.deviationType & 1)) {
            tpStr = rootElement.lang.deviation_right;
        }
        deviation = rootElement.lang.reportInfo_deviate + tpStr;
    } else {
        if (this.sensor1 != null) {
            var deviationVal = this.sensor1 & 1;
            var tpStr = rootElement.lang.deviation_left;
            if (deviationVal) {
                tpStr = rootElement.lang.deviation_right;
            }
            deviation = rootElement.lang.reportInfo_deviate + tpStr;
        }
    }
    return deviation;
}

/**
 * 前车/行人距离    单位 100ms，范围 0~100仅报警类型为 0x01、0x02 和 0x04 时有效
 */
standardStatus.prototype.getDistinceTime = function (isLongGPS) {
    var distince = "";
    if (isLongGPS) {
        if (this.distinceTime) {
            var distinceVal = this.distinceTime;
            if (distinceVal) {
                distince = rootElement.lang.reportInfo_people + distinceVal * 100 + 'ms';
            }
        }
    } else {
        if (this.sensor1) {
            var distinceVal = (this.sensor1 >> 24) & parseInt("7F", 16);
            if (distinceVal) {
                distince = rootElement.lang.reportInfo_people + distinceVal * 100 + 'ms';
            }
        }
    }

    return distince;
}

/**
 * 前车车速    单位 Km/h。范围 0~250，仅报警类型为 0x01 和 0x02 时    有效
 */
standardStatus.prototype.getFrontVehiSpeed = function (isLongGPS) {
    var speed = "";
    if (isLongGPS) {
        if (this.frontVehiSpeed) {
            var speedVal = this.frontVehiSpeed;
            if (speedVal) {
                speed = rootElement.lang.reportInfo_vehicleSpeed + speedVal + "Km/h";
            }
        }
    } else {
        if (this.sensor1) {
            var speedVal = (this.sensor1 >> 16) & parseInt("FF", 16);
            if (speedVal) {
                speed = rootElement.lang.reportInfo_vehicleSpeed + speedVal + "Km/h";
            }
        }
    }
    return speed;
}

/**
 * 获取道路标识类型(0：限速标志 1：限高标志 2：限重标志)
 */
standardStatus.prototype.getRoadFlagType = function (type) {
//	this.roadFlagType = 0;//bit0-1 道路标志识别类型(0：限速标志 1：限高标志 2：限重标志)仅报警类型为 0x06 时有效    bit2: //分神驾驶报警 2级(平台)
    //bit3-bit6:智能检测(上海) bit3:车厢超载报警1级  bit4:车厢超载报警2级	bit5:站外上客报警1级  bit6:站外上客报警2级
    if (type) {
        type = Number(type) & 3;
    }
    switch (type) {
        case 0:
            return rootElement.lang.signs_speed;
        case 1:
            return rootElement.lang.signs_height;
        case 2:
            return rootElement.lang.signs_weight;
        default:
            return "";
    }
    return "";
}

//是否长GPS
standardStatus.prototype.isLongGps = function () {
    if (this.longGps && this.longGps == 2) {
        return true;
    }
    return false;
}


standardStatus.prototype.analyTaxiCameraStatus = function (number, status, normal) {
    //0x00-正常；0x01-通信断开；0x02-视频丢失；0x03-摄像头遮挡
    //正常状态不解析
    if (status != null) {
        var cameraStatus = "";
        //正常状态不解析
        if (status == 0) { // 0x00-正常
            cameraStatus += rootElement.lang.normal;
        }
        if (status == 1) { //0x01-通信断开
            cameraStatus += rootElement.lang.taxi_camera_status_disconnect;
        }
        if (status == 2) { // 0x02-视频丢失
            if (cameraStatus) {
                cameraStatus += ",";
            }
            cameraStatus += rootElement.lang.taxi_camera_status_lost;
        }
        if (status == 3) { // 0x03-摄像头遮挡
            if (cameraStatus) {
                cameraStatus += ",";
            }
            cameraStatus += rootElement.lang.taxi_camera_status_occlusion;
        }
        if (cameraStatus) {
            //CH1
            normal.push("CH" + number + rootElement.lang.taxi_camera_status + cameraStatus);
        }
    }
}

// 插槽状态
standardStatus.prototype.analyTaxiStorageStatus = function (number, storage, normal) {
//    unsigned int uiDiskStatus;
    //存储设备状态（表示存储设备卡槽 1-4）
    //高 4 位表示存储设备类型： 0-硬盘；1-固态盘；2-SD 卡；
    //低 4 位作为一个整形故障类型： 0：存储正常；1：存储未格式化；2：存储读写错误；
    //3：存储无法识别；4：无存储设备；5-存储已满，无法覆盖
    if (storage != null) {
        var storageError = storage & 0x0F;
        var storageType = (storage >> 4) & 0x0F;
        var storageTypeName = "";
        var storageErrorName = "";
        switch (Number(storageType)) {
            case 0:
                storageTypeName = rootElement.lang.taxi_storage_type_hard_disk;
                break;
            case 1:
                storageTypeName = rootElement.lang.taxi_storage_type_SSD;
                break;
            case 2:
                storageTypeName = rootElement.lang.taxi_storage_type_SD_card;
                break;
            default:
                break;
        }
        switch (Number(storageError)) {
            case 0:
                storageErrorName = rootElement.lang.normal;
                break;
            case 1:
                storageErrorName = rootElement.lang.taxi_storage_error_unformatted;
                break;
            case 2:
                storageErrorName = rootElement.lang.taxi_storage_error_read_write;
                break;
            case 3:
                storageErrorName = rootElement.lang.taxi_storage_error_unrecognize;
                break;
            case 4:
                storageErrorName = rootElement.lang.taxi_storage_error_none;
                break;
            case 5:
                storageErrorName = rootElement.lang.taxi_storage_error_full;
                break;
            default:
                break;
        }
        if (storageTypeName) {
            normal.push(rootElement.lang.taxi_storage_device_card_slot + "" + number + "=" + storageTypeName + ":" + storageErrorName);
        }
    }
}

//出租车状态信息
standardStatus.prototype.analyTaxiStatus = function () {
    var ret = {};
    var normal = [];
    if (this.isTaxi905Protocol()) {
        var isCamera = false;
        var isStorage = false;
        var isCan = false;
        if (this.sensor4 != null) {
            var taxiStatus = this.sensor4 & 0x0FFFFFF;
            //20位:为1表示can数据有效
            //21位:为1表示当前车内人数有效
            //22位:为1表示存储设备状态有效
            //23位:为1表示摄像头状态有效
            if ((taxiStatus >> 20 & 1) == 1) {
                isCan = true;
            }
            if ((taxiStatus >> 22 & 1) == 1) {
                isStorage = true;
            }
            if ((taxiStatus >> 23 & 1) == 1) {
                isCamera = true;
            }
        }
        if (isCan) {
            // http://192.168.1.192:8989/web/#/1?page_id=1473
            // unsigned char ucTirePressure[30];    //胎压(0x05)
            // 新的结构
            // 获取胎压大小
            /*设备状态表TirePressure字段值
            000019000C0040E201000100000000000000000000000000000000000000
            数据分段
            0000 1900 0C00 40E20100 01 00000000000000000000000000000000000000
            解析
            0000 ucTaxiReserved1   0-1
            1900 usTaxiInstantFuel =0x0019=25  2-3
            0C00 usTaxi100KmFuel =0x000C=12 4-5
            40E20100 uiTaxiLiCheng =0x0001E240=123456  6-9
            01 ucTaxiSensorStatus =1  10
            00000000000000000000000000000000000000 ucTaxiReserved2[19]*/
            // unsigned short usTaxiNotUse;        //不要使用,有效数据,占位的
            // unsigned short ucTaxiReserved1;     //预留
            // uiTaxiStatus 20位:为1表示can数据有效
            // unsigned short usTaxiInstantFuel;   //瞬时燃料消耗 单位kWh/100km
            // unsigned short usTaxi100KmFuel;     //百公里燃料消耗 单位kWh/100km
            // unsigned int uiTaxiLiCheng;         //里程 单位0.1km
            // unsigned char ucTaxiSensorStatus;   //传感器状态
            // unsigned char ucTaxiReserved2[19];  //预留
            var size_ = parseInt(this.tirePpressures.length / 2);
            if (size_ > 0) {
                var tire_ = [];
                for (var int = 0; int < size_; int++) {
                    // 从左往右截取的
                    tire_.push(this.tirePpressures.slice(int * 2, int * 2 + 2));
                }
                // 不足30追加
                while (tire_.length < 30) {
                    tire_.push("00");
                }
                if (tire_.length > 0) {
                    var strCanInfo = [];
                    // 瞬时燃料消耗 单位kWh/100km
                    var usTaxiInstantFuel = ("0x" + tire_[3] + "" + tire_[2]) >> 0;
                    strCanInfo.push(rootElement.lang.taxi_can_instant_fuel + usTaxiInstantFuel + " kWh/100km");
                    // 百公里燃料消耗 单位kWh/100km
                    var usTaxi100KmFuel = ("0x" + tire_[5] + "" + tire_[4]) >> 0;
                    strCanInfo.push(rootElement.lang.taxi_can_100km_fuel + usTaxi100KmFuel + " kWh/100km");
                    // 里程 单位0.1km
                    var uiTaxiLiCheng = ("0x" + tire_[9] + "" + tire_[8] + "" + tire_[7] + "" + tire_[6]) >> 0;
                    strCanInfo.push(rootElement.lang.monitor_labelLiCheng + mileageConversion(uiTaxiLiCheng / 10));
                    // 传感器状态
                    var ucTaxiSensorStatus = ("0x" + tire_[10]) >> 0;
                    if ((ucTaxiSensorStatus & 0x7) == 0) {
                        strCanInfo.push(rootElement.lang.taxi_can_sensor_status_normal);
                    } else {
                        if ((ucTaxiSensorStatus & 1) == 1) {
                            strCanInfo.push(rootElement.lang.taxi_can_sensor_status_bit0);
                        }
                        if ((ucTaxiSensorStatus >> 1 & 1) == 1) {
                            strCanInfo.push(rootElement.lang.taxi_can_sensor_status_bit1);
                        }
                        if ((ucTaxiSensorStatus >> 2 & 1) == 1) {
                            strCanInfo.push(rootElement.lang.taxi_can_sensor_status_bit2);
                        }
                    }
                    if (strCanInfo.length > 0) {
                        normal.push(rootElement.lang.taxi_can_status + "(" + strCanInfo.join(",") + ")");
                    }
                }
            }
        }

//		15-8 出租车的摄像头状态
//		sensor1
//		   unsigned int uiCameraStatus;    //摄像头状态
        //Bit0-bit3：逻辑通道 1 摄像头状态； Bit4-bit7：逻辑通道 2 摄像头状态；
        //Bit8-bit11：逻辑通道 3 摄像头状态； Bit12-bit15：逻辑通道 4 摄像头状态； Bit16-bit31：保留；
        //0x00-正常；0x01-通信断开；0x02-视频丢失；0x03-摄像头遮挡
        if (this.sensor1 != null && isCamera) {
            var ch1 = this.sensor1 & 0x0F;
            var ch2 = (this.sensor1 >> 4) & 0x0F;
            var ch3 = (this.sensor1 >> 8) & 0x0F;
            var ch4 = (this.sensor1 >> 12) & 0x0F;
            var normal_ = [];
            this.analyTaxiCameraStatus(1, ch1, normal_);
            this.analyTaxiCameraStatus(2, ch2, normal_);
            this.analyTaxiCameraStatus(3, ch3, normal_);
            this.analyTaxiCameraStatus(4, ch4, normal_);
            if (normal_.length > 0) {
                normal.push(normal_.toString());
            }
        }
//	    15-9 出租车的存储状态
//	        unsigned int uiDiskStatus;
        //存储设备状态（表示存储设备卡槽 1-4）
        //高 4 位表示存储设备类型： 0-硬盘；1-固态盘；2-SD 卡；
        //低 4 位作为一个整形故障类型： 0：存储正常；1：存储未格式化；2：存储读写错误；
        //3：存储无法识别；4：无存储设备；5-存储已满，无法覆盖
//			sensor2
        if (this.sensor2 != null && isStorage) {
//	        unsigned int uiDiskFaultType1 : 4;    //存储设备类型               高
//	    	unsigned int uiDiskDevType1 : 4;    //整形故障类型
//	    	unsigned int uiDiskFaultType2 : 4;
//	    	unsigned int uiDiskDevType2 : 4;
//	    	unsigned int uiDiskFaultType3 : 4;
//	    	unsigned int uiDiskDevType3 : 4;
//	    	unsigned int uiDiskFaultType5 : 4;
//	    	unsigned int uiDiskDevType4 : 4;                          低
            var storage4 = this.sensor2 & 0x0FF;
            var storage3 = (this.sensor2 >> 8) & 0x0FF;
            var storage2 = (this.sensor2 >> 16) & 0x0FF;
            var storage1 = (this.sensor2 >> 24) & 0x0FF;
            var normal_ = [];
            this.analyTaxiStorageStatus(1, storage1, normal_);
            this.analyTaxiStorageStatus(2, storage2, normal_);
            this.analyTaxiStorageStatus(3, storage3, normal_);
            this.analyTaxiStorageStatus(4, storage4, normal_);
            if (normal_.length > 0) {
                normal.push(normal_.toString());
            }
        }
//	    15-10 出租车的相关状态位
        //  unsigned int uiTaxiStatus : 24;    //状态位
        //0位:0：未预约；1：预约(任务车)
        //1位:0：默认；1：空转重
        //2位:0：默认；1：重转空
        //3位:0：空车；1：重车
        //4位:0：车辆未锁定；1：车辆锁定
        //5位:0：未到达限制营运次数/时间；1：已达到限制营运次数/时间
        //6位:0 计程计价装置未锁；1：计程计价装置被锁定

        //8位(北京905) 电召状态 0：未电召  1：电召
        //9位(北京905) 调度状态 0：未调度  1：调度
        //10位(北京905) 0：计价器未锁定  1：计价器锁定
        //11位(北京905) 出城留台标志 0：正常  1：出城留台
        //12位(北京905) 0：OBD正常  1：OBD故障对应故障码功能

        //21位:为1表示当前车内人数有效
        //22位:为1表示存储设备状态有效
        //23位:为1表示摄像头状态有效
        //unsigned int uiPeopleCur : 8;        //当前车内人数
//			sensor4
        if (this.sensor4 != null) {
            var taxiStatus = this.sensor4 & 0x0FFFFFF;
            if ((taxiStatus & 1) == 1) {
                normal.push(rootElement.lang.taxi_status_task);
            }/* else {
	    		normal.push(rootElement.lang.taxi_status_no_task);
	    	} */
            if ((taxiStatus >> 1 & 1) == 1) {
                normal.push(rootElement.lang.taxi_status_empty2weight);
            }
            if ((taxiStatus >> 2 & 1) == 1) {
                normal.push(rootElement.lang.taxi_status_weight2empty);
            }
            /*            if ((taxiStatus >> 3 & 1) == 1) {
                            normal.push(rootElement.lang.taxi_status_weight);
                        } else {
                            normal.push(rootElement.lang.taxi_status_empty);
                        }*/
            if ((taxiStatus >> 4 & 1) == 1) {
                normal.push(rootElement.lang.taxi_status_vehicle_lock);
            } /*else {
	    		normal.push(rootElement.lang.taxi_status_vehicle_unlock);
	    	}*/
            if ((taxiStatus >> 5 & 1) == 1) {
                normal.push(rootElement.lang.taxi_status_vehicle_limit);
            }/* else {
	    		normal.push(rootElement.lang.taxi_status_vehicle_no_limit);
	    	}*/
            if ((taxiStatus >> 6 & 1) == 1) {
                normal.push(rootElement.lang.taxi_status_valuation_lock);
            }/* else {
	    		normal.push(rootElement.lang.taxi_status_valuation_no_lock);
	    	}*/

            if ((taxiStatus >> 8 & 1) == 1) {
                normal.push(rootElement.lang.taxi_call);
            }
            if ((taxiStatus >> 9 & 1) == 1) {
                normal.push(rootElement.lang.taxi_scheduling);
            }
            if ((taxiStatus >> 10 & 1) == 1) {
                normal.push(rootElement.lang.taxi_meter_lock);
            }
            if ((taxiStatus >> 11 & 1) == 1) {
                normal.push(rootElement.lang.taxi_out_city);
            }
            if ((taxiStatus >> 12 & 1) == 1) {
                normal.push(rootElement.lang.taxi_obd_fault);
            }

        }
    }
    ret.normal = normal.toString();
    return ret;
}


// 解析报警相关(不解析io)
standardStatus.prototype.analyLongGpsAlarms = function () {
    var ret = {};
    var normal = [];
    var alarm = [];
    if (this.isLongGps()) {
        // 获取胎压大小
        if (this.deviationType) {
            var ucStatus5 = (this.deviationType >> 8);
            if (ucStatus5) {
                //*  0:危险驾驶行为报警    1:IO7  2:IO8  3:备用电池欠压报警  4:备用电池失效报警  5:备用存储器故障报警*/
                if ((ucStatus5 >> 0) & 1) {
                    var info = rootElement.lang.alarm_name_445;
                    if (this.isAlarmShield('445,495')) {
                        normal.push(info);
                    } else {
                        alarm.push(info);
                    }
                }
                /*if ((ucStatus5 >> 1) & 1) {
                    var info = rootElement.lang.alarm_type_io7;
                    if (this.isAlarmShield('25,75')) {
                        normal.push(info);
                    } else {
                        alarm.push(info);
                    }
                }
                if ((ucStatus5 >> 2) & 1) {
                    var info = rootElement.lang.alarm_type_io8;
                    if (this.isAlarmShield('26,76')) {
                        normal.push(info);
                    } else {
                        alarm.push(info);
                    }
                }*/
                if ((ucStatus5 >> 3) & 1) {
                    var info = rootElement.lang.alarm_name_538;
                    if (this.isAlarmShield('538,588')) {
                        normal.push(info);
                    } else {
                        alarm.push(info);
                    }
                }
                if ((ucStatus5 >> 4) & 1) {
                    var info = rootElement.lang.alarm_name_539;
                    if (this.isAlarmShield('539,589')) {
                        normal.push(info);
                    } else {
                        alarm.push(info);
                    }
                }
                if ((ucStatus5 >> 5) & 1) {
                    var info = rootElement.lang.alarm_name_540;
                    if (this.isAlarmShield('540,590')) {
                        normal.push(info);
                    } else {
                        alarm.push(info);
                    }
                }
            }
        }
    }
    ret.alarm = alarm.toString();
    ret.normal = normal.toString();
    return ret;
}
// 解析报警相关(解析io)
standardStatus.prototype.analyLongGpsIOAlarms = function (device) {
    var ret = {};
    var normal = [];
    var alarm = [];
    if (this.isLongGps()) {
        // 获取胎压大小
        if (this.deviationType) {
            if (device == null) {
                return;
            }
            var ioInCount = device.getIoInCount();
            var ioInName = device.getIoInName();
            if (ioInName != null) {
                ioInName = ioInName.split(",");
            }
            var ucStatus5 = (this.deviationType >> 8);
            if (ucStatus5) {
                //*  0:危险驾驶行为报警    1:IO7  2:IO8  3:备用电池欠压报警  4:备用电池失效报警  5:备用存储器故障报警*/
                if (((ucStatus5 >> 1) & 1) && (ioInCount && ioInCount > 6)) {
                    // var info = rootElement.lang.alarm_type_io7;
                    var ioName = ioInName[6];
                    var isNormal = false;
                    if (ioName.split(";").length > 1 && (ioName.split(";")[0] == 'N' || ioName.split(";")[0] == 'n')) {
                        isNormal = true;
                        ioName = ioName.split(";")[1];
                    }
                    if (this.isAlarmShield('25,75')) {
                        normal.push(ioName);
                    } else {
                        if (isNormal) {
                            normal.push(ioName);
                        } else {
                            alarm.push(ioName);
                        }
                    }
                }
                if (((ucStatus5 >> 2) & 1) && (ioInCount && ioInCount > 7)) {
                    // var info = rootElement.lang.alarm_type_io8;
                    var ioName = ioInName[7];
                    var isNormal = false;
                    if (ioName.split(";").length > 1 && (ioName.split(";")[0] == 'N' || ioName.split(";")[0] == 'n')) {
                        isNormal = true;
                        ioName = ioName.split(";")[1];
                    }
                    if (this.isAlarmShield('26,76')) {
                        normal.push(ioName);
                    } else {
                        if (isNormal) {
                            normal.push(ioName);
                        } else {
                            alarm.push(ioName);
                        }
                    }
                }
            }
        }
    }
    ret.alarm = alarm.toString();
    ret.normal = normal.toString();
    return ret;
}

//黑龙江状态信息
standardStatus.prototype.analyHeiLongJiangStatus = function () {
    var ret = {};
    var normal = [];
    if (this.isHeiLongJiangProtocol()) {
//		sensor1
        /*int nAccelerationX : 11;        //加速度,有符号 0:X  1:Y  2:Z  单位:0.01g 范围:-10.24~10.23g
             int nAngularVelocityX : 13;     //角速度 0:X  1:Y  2:Z  单位:0.1°/s 范围:409.6~409.5°/s
             unsigned int uiAccelPedalStroke : 7;        //加速踏板行程值 范围 1~100，单位%
             int nReserve1 : 1;*/
        // sensor2
        /*int nAccelerationY : 11;        //加速度,有符号 0:X  1:Y  2:Z  单位:0.01g 范围:-10.24~10.23g
        int nAngularVelocityY : 13;     //角速度 0:X  1:Y  2:Z  单位:0.1°/s 范围:409.6~409.5°/s
        unsigned int uiBrakePedalStroke : 7;    //制动踏板行程值 范围 1~100，单位%
        int nReserve2 : 1;*/
        //         sensor3
        /*
       int nAccelerationZ : 11;        //加速度,有符号 0:X  1:Y  2:Z  单位:0.01g 范围:-10.24~10.23g
       int nAngularVelocityZ : 13;     //角速度 0:X  1:Y  2:Z  单位:0.1°/s 范围:409.6~409.5°/s
       unsigned int uiODBSpeedH : 8;   //ODB速度值(低位) KM/S    9999 = 999.9     范围(0-2048)*/
        //			sensor4
        /*unsigned int uiODBRpm : 14;     //发动机转速 单位 RPM  0~16384
        int uiODBAngle : 11;            //方向盘角度 方向盘转过的角度，顺时针为正，逆时针为负  单位 -1024~1023
        unsigned int uiODBGear : 4;     //档位状态 0:空挡  0x01~09:档位  0x10:倒挡  0x11:驻车档
        unsigned int uiODBSpeedL : 3;   //ODB速度值(高位)*/
        // 加速度
        var acceleration_x = 0;
        // 角速度
        var angularVelocity_x = 0;
        var accelPedalStroke = 0;
        if (this.sensor1 != null) {
            // 111_1111_1111
            acceleration_x = (this.sensor1 & 0x7FF) >= 1024 ? (this.sensor1 & 0x7FF) - 2048 : (this.sensor1 & 0x7FF);
            // 1_1111_1111_1111
            angularVelocity_x = ((this.sensor1 >> 11) & 0x1FFF) >= 4096 ? ((this.sensor1 >> 11) & 0x1FFF) - 8192 : ((this.sensor1 >> 11) & 0x1FFF);
            // 111_1111
            accelPedalStroke = (this.sensor1 >> 24) & 0x7F;
        }
        var acceleration_y = 0;
        var angularVelocity_y = 0;
        var brakePedalStroke = 0;
        if (this.sensor2 != null) {
            // 111_1111_1111
            acceleration_y = (this.sensor2 & 0x7FF) >= 1024 ? (this.sensor2 & 0x7FF) - 2048 : (this.sensor2 & 0x7FF);
            // 1_1111_1111_1111
            angularVelocity_y = ((this.sensor2 >> 11) & 0x1FFF) >= 4096 ? ((this.sensor2 >> 11) & 0x1FFF) - 8192 : ((this.sensor2 >> 11) & 0x1FFF);
            // 111_1111
            brakePedalStroke = (this.sensor2 >> 24) & 0x7F;
        }
        var acceleration_z = 0;
        var angularVelocity_z = 0;
        var obdSpeedL = 0;
        if (this.sensor3 != null) {
            // 111_1111_1111
            acceleration_z = (this.sensor3 & 0x7FF) >= 1024 ? (this.sensor3 & 0x7FF) - 2048 : (this.sensor3 & 0x7FF);
            // 1_1111_1111_1111
            angularVelocity_z = ((this.sensor3 >> 11) & 0x1FFF) >= 4096 ? ((this.sensor3 >> 11) & 0x1FFF) - 8192 : ((this.sensor3 >> 11) & 0x1FFF);
            // 111_1111
            obdSpeedL = (this.sensor3 >> 24) & 0xFF;
        }

        var obdRpm = 0;
        var obdAngle = 0;
        var obdGear = 0;
        var obdSpeedH = 0;
        if (this.sensor4 != null) {
            // 11_1111_1111_1111
            obdRpm = (this.sensor4 & 0x3FFF);
            // 111_1111_1111
            // obdAngle = (this.sensor4 >> 14) & 0x7FF;
            obdAngle = ((this.sensor4 >> 14) & 0x7FF) >= 1024 ? ((this.sensor4 >> 14) & 0x7FF) - 2048 : ((this.sensor4 >> 14) & 0x7FF);
            // 111_1111
            obdGear = (this.sensor4 >> 25) & 0xF;
            // 111
            obdSpeedH = (this.sensor4 >> 29) & 0x7;
        }
        // 加速度
        if (acceleration_x || acceleration_y || acceleration_z) {
            normal.push(rootElement.lang.sensor_g + "(X:" + (acceleration_x / 100).toFixed(2) +
                "g,Y:" + (acceleration_y / 100).toFixed(2) + "g,Z:" + (acceleration_z / 100).toFixed(2) + "g)");
        }
        // 角速度
        if (angularVelocity_x || angularVelocity_y || angularVelocity_z) {
            normal.push(rootElement.lang.angularVelocity +
                "(X:" + (angularVelocity_x / 10).toFixed(2) + rootElement.lang.degree_sec +
                ",Y:" + (angularVelocity_y / 10).toFixed(2) + rootElement.lang.degree_sec +
                ",Z:" + (angularVelocity_z / 10).toFixed(2) + rootElement.lang.degree_sec + ")");
        }
        // OBD速度
        if (obdSpeedH || obdSpeedL) {
            var obdSpeed = (obdSpeedH << 3) + obdSpeedL;
            var speedStr = (obdSpeed / 10).toFixed(2) + "KM/h";
            if (typeof speedConversion == 'function') {
                speedStr = speedConversion((obdSpeed / 10).toFixed(2));
            }
            normal.push(rootElement.lang.OBDSpeed + ":" + speedStr);
        }

        var obdGearStr = "";
        switch (obdGear) {
            case 0:
                obdGearStr = rootElement.lang.neutral;
                break;
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
                obdGearStr = rootElement.lang.gear + obdGear;
                break;
            case 10:
                obdGearStr = rootElement.lang.reverse_gear;
                break;
            case 11:
                obdGearStr = rootElement.lang.parking_gear;
                break;
            default:
                break;
        }
        if (obdGearStr) {
            normal.push(rootElement.lang.gearStatus + ":" + obdGearStr);
        }

        // 加速踏板行程值
        if (accelPedalStroke) {
            normal.push(rootElement.lang.accel_pedal_stroke + ":" + accelPedalStroke + "%");
        }
        // 制动踏板行程值
        if (brakePedalStroke) {
            normal.push(rootElement.lang.brake_pedal_stroke + ":" + brakePedalStroke + "%");
        }

        // 发动机转速
        if (obdRpm) {
            normal.push(rootElement.lang.rotating_speed_none + ":" + obdRpm + " RPM");
        }
        // 方向盘角度
        if (obdAngle) {
            normal.push(rootElement.lang.steeringWheelAngle + ":" + obdAngle + rootElement.lang.degree);
        }
    }

    ret.normal = normal.toString();
    return ret;
}

//黑龙江状态信息（主动安全相关的）
standardStatus.prototype.analyHeiLongJiangStatusNew = function () {
    var ret = {};
    if (!this.isLongGps()) {
        return ret;
    }
    if (!this.longStatus) {
        return ret;
    }
    // 状态位 19位:渣土车状态位有效
    if (((this.longStatus >> 19) & 1) != 1) {
        return ret;
    }
    if (!this.tirePpressures) {
        return ret;
    }

    var size_ = parseInt(this.tirePpressures.length / 2);
    var tire_ = [];
    if (size_ > 0) {
        for (var int = 0; int < size_; int++) {
            // 从左往右截取的
            tire_.push(this.tirePpressures.slice(int * 2, int * 2 + 2));
        }
        // 不足30追加
        while (tire_.length < 30) {
            tire_.push("00");
        }
    }
    var normal = [];
    if (tire_.length > 20) {
        /* 6400 C800 2C01 F6FF ECFF E2FF 0B 16 8200 2100 2C00 05 000000000000000000
         6400[加速度X]=0x0064=100=1g
         C800[加速度Y]=0x00C8=200=2g
         2C01[加速度Y]=0x012C=300=3g
         F6FF[角速度X]=0xFFF6=-10=-1度/秒
         ECFF[角速度X]=0xFFEC=-20=-2度/秒
         E2FF[角速度X]=0xFFE2=-30=-3度/秒
         0B[加速踏板行程值]=0x0B=11=11%
         16[制动踏板行程值]=0x16=22=22%
         8200[OBD速度]=0x0082=110=11km/h
         2100[发动机转速]=0x0021=33=33RMP
         2C00[方向盘角度]=0x002C=44=44度
         05[档位状态]=0x05=5=档位5*/
        // 加速度X
        var acceleration_x = ("0x" + tire_[1] + "" + tire_[0]) >> 0;
        // 加速度Y
        var acceleration_y = ("0x" + tire_[3] + "" + tire_[2]) >> 0;
        // 加速度Z
        var acceleration_z = ("0x" + tire_[5] + "" + tire_[4]) >> 0;
        // 角速度X
        var angularVelocity_x = ("0x" + tire_[7] + "" + tire_[6]) >> 0;
        // 角速度Y
        var angularVelocity_y = ("0x" + tire_[9] + "" + tire_[8]) >> 0;
        // 角速度Z
        var angularVelocity_z = ("0x" + tire_[11] + "" + tire_[10]) >> 0;
        // 加速踏板行程值
        var accelPedalStroke = ("0x" + tire_[12]) >> 0;
        // 制动踏板行程值
        var brakePedalStroke = ("0x" + tire_[13]) >> 0;
        var obdSpeed = ("0x" + tire_[15] + "" + tire_[14]) >> 0;
        var obdRpm = ("0x" + tire_[17] + "" + tire_[16]) >> 0;
        var obdAngle = ("0x" + tire_[19] + "" + tire_[18]) >> 0;
        var obdGear = ("0x" + tire_[20]) >> 0;
        // 加速度
        if (acceleration_x || acceleration_y || acceleration_z) {
            normal.push(rootElement.lang.sensor_g + "(X:" + (acceleration_x / 100).toFixed(2) +
                "g,Y:" + (acceleration_y / 100).toFixed(2) + "g,Z:" + (acceleration_z / 100).toFixed(2) + "g)");
        }
        // 角速度
        if (angularVelocity_x || angularVelocity_y || angularVelocity_z) {
            normal.push(rootElement.lang.angularVelocity +
                "(X:" + (angularVelocity_x / 10).toFixed(2) + rootElement.lang.degree_sec +
                ",Y:" + (angularVelocity_y / 10).toFixed(2) + rootElement.lang.degree_sec +
                ",Z:" + (angularVelocity_z / 10).toFixed(2) + rootElement.lang.degree_sec + ")");
        }
        // OBD速度
        if (obdSpeed) {
            var speedStr = (obdSpeed / 10).toFixed(2) + "KM/h";
            if (typeof speedConversion == 'function') {
                speedStr = speedConversion((obdSpeed / 10).toFixed(2));
            }
            normal.push(rootElement.lang.OBDSpeed + ":" + speedStr);
        }

        var obdGearStr = "";
        switch (obdGear) {
            case 0:
                obdGearStr = rootElement.lang.neutral;
                break;
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
                obdGearStr = rootElement.lang.gear + obdGear;
                break;
            case 10:
                obdGearStr = rootElement.lang.reverse_gear;
                break;
            case 11:
                obdGearStr = rootElement.lang.parking_gear;
                break;
            default:
                break;
        }
        if (obdGearStr) {
            normal.push(rootElement.lang.gearStatus + ":" + obdGearStr);
        }

        // 加速踏板行程值
        if (accelPedalStroke) {
            normal.push(rootElement.lang.accel_pedal_stroke + ":" + accelPedalStroke + "%");
        }
        // 制动踏板行程值
        if (brakePedalStroke) {
            normal.push(rootElement.lang.brake_pedal_stroke + ":" + brakePedalStroke + "%");
        }

        // 发动机转速
        if (obdRpm) {
            normal.push(rootElement.lang.rotating_speed_none + ":" + obdRpm + " RPM");
        }
        // 方向盘角度
        if (obdAngle) {
            normal.push(rootElement.lang.steeringWheelAngle + ":" + obdAngle + rootElement.lang.degree);
        }
    }
    ret.normal = normal.toString();
    return ret;
}

/**
 * 判断是否锐明渣土车
 * @constructor
 */
standardStatus.prototype.isRuiMingMuck = function () {
    if (!this.isLongGps()) {
        return false;
    }
    if (!this.longStatus) {
        return false;
    }
    // 状态位 17位:渣土车状态位有效
    if (((this.longStatus >> 17) & 1) != 1) {
        return false;
    }
    if (!this.tirePpressures) {
        return false;
    }
    var size_ = parseInt(this.tirePpressures.length / 2);
    if (size_ > 0) {
        var tire_ = [];
        for (var int = 0; int < size_; int++) {
            // 从左往右截取的
            tire_.push(this.tirePpressures.slice(int * 2, int * 2 + 2));
        }
        // 不足30追加
        while (tire_.length < 30) {
            tire_.push("00");
        }
        if (tire_.length > 0) {
            var uiZtcPlatformStatus = ("0x" + tire_[5] + "" + tire_[4] + "" + tire_[3] + "" + tire_[2]) >> 0;
            if (((uiZtcPlatformStatus >> 6) & 1) > 0) {
                return true;
            }
        }
    }
    return false;
}

// 渣土车相关状态信息
standardStatus.prototype.getLongMuckStatus = function () {
    var ret = {};
    var normal = [];
    var alarm = [];
    if (this.isLongGps()) {
        if (this.longStatus) {
            // 状态位 17位:渣土车状态位有效 
            if ((this.longStatus >> 17) & 1) {
                // 先后顺序
                // unsigned char ucTirePressure[30];    //胎压(0x05)
                // 新的结构
                // 获取胎压大小
                var size_ = parseInt(this.tirePpressures.length / 2);
                if (size_ > 0) {
                    var tire_ = [];
                    for (var int = 0; int < size_; int++) {
                        // 从左往右截取的
                        tire_.push(this.tirePpressures.slice(int * 2, int * 2 + 2));
                    }
                    // 不足30追加
                    while (tire_.length < 30) {
                        tire_.push("00");
                    }
                    if (tire_.length > 0) {
                        //unsigned char ucZtcTarpStatus; //渣土车 篷布状态
                        //0：无效 1：关闭 2：打开 3：异常 4：开启未完全 5：关闭未完全
                        var ZtcTarpStatus = parseInt(tire_[0]);
                        var status = "";
                        switch (ZtcTarpStatus) {
                            case 1:
                                status = rootElement.lang.tarp_status_close;
                                break;
                            case 2:
                                status = rootElement.lang.tarp_status_open;
                                break;
                            case 4:
                                status = rootElement.lang.tarp_status_unall_open;
                                break;
                            case 5:
                                status = rootElement.lang.tarp_status_unall_close;
                                break;
                            default:
                                break;
                        }
                        if (status) {
                            normal.push(status);
                        }

                        // unsigned char ucZtcLiftStatus; //渣土车 举升状态
                        //0：无效 1：平放 2：举升 3：异常
                        // 20210701新增
                        // 0xF3：完全举升 0xFA：故障
                        var ucZtcLiftStatus = parseInt(tire_[1]);
                        status = "";
                        switch (ucZtcLiftStatus) {
                            case 1:
                                status = rootElement.lang.lay_flat;
                                break;
                            case 2:
                                status = rootElement.lang.muck_lift;
                                break;
                            case 243:// 0xF3
                                status = rootElement.lang.full_lift;
                                break;
                            case 250:// 0xFA
                                status = rootElement.lang.malfunction_lift;
                                break;
                            default:
                                break;
                        }
                        if (status) {
                            normal.push(status);
                        }
                        // unsigned int uiZtcPlatformStatus; //渣土车(平台使用)
                        //bit0:篷布状态异常报警  bit1:举升状态异常报警  bit2:重空载状态异常报警
                        //bit3:进出电子围栏报警  bit4:违规区域卸载  bit5:重车行驶厢盖未关闭

                        // 20210701新增
                        //bit6:锐明渣土车协议  bit7~8:车厢状态  bit9:空重状态(故障)  bit10:违规状态
                        var uiZtcPlatformStatus = ("0x" + tire_[5] + "" + tire_[4] + "" + tire_[3] + "" + tire_[2]) >> 0;
                        if ((uiZtcPlatformStatus & 1) > 0) {
                            if (this.isAlarmShield("820,870")) {
                                normal.push(rootElement.lang.alarm_name_820);
                            } else {
                                alarm.push(rootElement.lang.alarm_name_820);
                            }
                        }
                        if (((uiZtcPlatformStatus >> 1) & 1) > 0) {
                            if (this.isAlarmShield("821,871")) {
                                normal.push(rootElement.lang.alarm_name_821);
                            } else {
                                alarm.push(rootElement.lang.alarm_name_821);
                            }
                        }
                        if (((uiZtcPlatformStatus >> 2) & 1) > 0) {
                            if (this.isAlarmShield("822,872")) {
                                normal.push(rootElement.lang.alarm_name_822);
                            } else {
                                alarm.push(rootElement.lang.alarm_name_822);
                            }
                        }
                        if (((uiZtcPlatformStatus >> 3) & 1) > 0) {
                            // unsigned char ucZtcEleFenceType; //电子围栏类型 1：工地；2：禁区；3：消纳场；4：限速圈；5：停车场；6：路线
                            var ucZtcEleFenceType = parseInt(tire_[15]);
                            status = "";
                            switch (ucZtcEleFenceType) {
                                case 1:
                                    status = rootElement.lang.fence_construction_site;
                                    break;
                                case 2:
                                    status = rootElement.lang.fence_restricted_area;
                                    break;
                                case 3:
                                    status = rootElement.lang.fence_elimination_field;
                                    break;
                                case 4:
                                    status = rootElement.lang.fence_speed_limit_circle;
                                    break;
                                case 5:
                                    status = rootElement.lang.fence_parking_lot;
                                    break;
                                case 6:
                                    status = rootElement.lang.fence_line;
                                    break;
                                default:
                                    break;
                            }
                            // normal.push("电子围栏类型:"+status);
                            // unsigned char ucZtcEleFenceDirection; //电子围栏方向 (0：进；    1：出)
                            var ucZtcEleFenceDirection = parseInt(tire_[16]);
                            var fenceDirection = "";
                            switch (ucZtcEleFenceDirection) {
                                case 1:
                                    fenceDirection = rootElement.lang.out;
                                    break;
                                case 0:
                                    fenceDirection = rootElement.lang.into;
                                    break;
                                default:
                                    break;
                            }
                            var alarm_desc = "";
                            if (fenceDirection && status) {
                                alarm_desc = "(" + rootElement.lang.electronic_fence_type + ":" + status;
                                alarm_desc += "," + rootElement.lang.direction + ":" + fenceDirection + ")";
                            }
                            if (this.isAlarmShield("823,873")) {
                                normal.push(rootElement.lang.alarm_name_823 + alarm_desc);
                            } else {
                                alarm.push(rootElement.lang.alarm_name_823 + alarm_desc);
                            }
                        }
                        if (((uiZtcPlatformStatus >> 4) & 1) > 0) {
                            if (this.isAlarmShield("448,498")) {
                                normal.push(rootElement.lang.alarm_name_448);
                            } else {
                                alarm.push(rootElement.lang.alarm_name_448);
                            }
                        }
                        if (((uiZtcPlatformStatus >> 5) & 1) > 0) {
                            if (this.isAlarmShield("449,499")) {
                                normal.push(rootElement.lang.alarm_name_449);
                            } else {
                                alarm.push(rootElement.lang.alarm_name_449);
                            }
                        }
                        // 20210701新增
                        if (((uiZtcPlatformStatus >> 7) & 3) > 0) {
                            // 车厢状态 BYTE 1：关闭；2：打开; 3: 故障
                            var car_state = "";
                            switch ((uiZtcPlatformStatus >> 7) & 3) {
                                case 1:
                                    car_state = rootElement.lang.car_state_close;
                                    break;
                                case 2:
                                    car_state = rootElement.lang.car_state_open;
                                    break;
                                case 3:
                                    car_state = rootElement.lang.car_state_error;
                                    break;
                                default:
                                    break;
                            }
                            normal.push(car_state);
                        }
                        if (((uiZtcPlatformStatus >> 9) & 1) > 0) {
                            normal.push(rootElement.lang.empty_state_fault);
                        }
                        if (((uiZtcPlatformStatus >> 10) & 1) > 0) {
                            normal.push(rootElement.lang.violation_status);
                        }


                        // 得到16进制的
                        // unsigned int uiZtcDeviceLinkStatus;//渣土车 设备连接状态
                        /*
                        0   1：连接，0：未连接  篷布检测装置
                        1   1：连接，0：未连接  举升检测装置
                        2   1：连接，0：未连接  重空载检测装置
                        3(锐明)    1：连接，0：未连接    ECU通信
                        4(锐明)    1：连接，0：未连接    声光报警器
                        5(锐明)    1：连接，0：未连接    厢门闭合监测
                        6   1：连接，0：未连接  身份验证装置
                        7   1：连接，0：未连接  显示外屏
                        8   1：连接，0：未连接  显示内屏
                        9   1：连接，0：未连接  DSM
                        10  1：连接，0：未连接  BSD
                        11  1：连接，0：未连接  ADAS
                        12  1：连接，0：未连接  第一路摄像头
                        13  1：连接，0：未连接  第二路摄像头
                        14  1：连接，0：未连接  第三路摄像头
                        15  1：连接，0：未连接  第四路摄像头
                        16  1：连接，0：未连接  第五路摄像头
                        17  1：连接，0：未连接  第六路摄像头
                        18  1：连接，0：未连接  第七路摄像头
                        19  1：连接，0：未连接  继电器输入状态 1：高电平 0：低电平
                        20  1：连接，0：未连接  继电器输出状态 1：高电平 0：低电平
                        21~31    保留
                        28(锐明) 1：管控模式
                        30(锐明) 1：证件有效
                        31(锐明) 1：有证
                        */
                        var uiZtcDeviceLinkStatus = ("0x" + tire_[9] + "" + tire_[8] + "" + tire_[7] + "" + tire_[6]) >> 0;
                        var deviceLinkStatus = [];
                        if (((uiZtcDeviceLinkStatus >> 0) & 1) > 0) {
                            deviceLinkStatus.push(rootElement.lang.detection_device_tarpaulin);
                        }
                        if (((uiZtcDeviceLinkStatus >> 1) & 1) > 0) {
                            deviceLinkStatus.push(rootElement.lang.detection_device_lift);
                        }
                        if (((uiZtcDeviceLinkStatus >> 2) & 1) > 0) {
                            deviceLinkStatus.push(rootElement.lang.detection_device_heavy);
                        }
                        if (this.isRuiMingMuck()) {
                            if (((uiZtcDeviceLinkStatus >> 3) & 1) > 0) {
                                deviceLinkStatus.push(rootElement.lang.ecu_communication);
                            }
                            if (((uiZtcDeviceLinkStatus >> 4) & 1) > 0) {
                                deviceLinkStatus.push(rootElement.lang.audible_alarm);
                            }
                            if (((uiZtcDeviceLinkStatus >> 5) & 1) > 0) {
                                deviceLinkStatus.push(rootElement.lang.car_door_closed_monitoring);
                            }
                        }
                        if (((uiZtcDeviceLinkStatus >> 6) & 1) > 0) {
                            deviceLinkStatus.push(rootElement.lang.detection_device_authentication);
                        }
                        if (((uiZtcDeviceLinkStatus >> 7) & 1) > 0) {
                            deviceLinkStatus.push(rootElement.lang.detection_device_out_screen);
                        }
                        if (((uiZtcDeviceLinkStatus >> 8) & 1) > 0) {
                            deviceLinkStatus.push(rootElement.lang.detection_device_in_screen);
                        }
                        if (((uiZtcDeviceLinkStatus >> 9) & 1) > 0) {
                            deviceLinkStatus.push("DSM");
                        }
                        if (((uiZtcDeviceLinkStatus >> 10) & 1) > 0) {
                            deviceLinkStatus.push("BSD");
                        }
                        if (((uiZtcDeviceLinkStatus >> 11) & 1) > 0) {
                            deviceLinkStatus.push("ADAS");
                        }
                        if (((uiZtcDeviceLinkStatus >> 12) & 1) > 0) {
                            deviceLinkStatus.push(rootElement.lang.detection_device_camera_1);
                        }
                        if (((uiZtcDeviceLinkStatus >> 13) & 1) > 0) {
                            deviceLinkStatus.push(rootElement.lang.detection_device_camera_2);
                        }
                        if (((uiZtcDeviceLinkStatus >> 14) & 1) > 0) {
                            deviceLinkStatus.push(rootElement.lang.detection_device_camera_3);
                        }
                        if (((uiZtcDeviceLinkStatus >> 15) & 1) > 0) {
                            deviceLinkStatus.push(rootElement.lang.detection_device_camera_4);
                        }
                        if (((uiZtcDeviceLinkStatus >> 16) & 1) > 0) {
                            deviceLinkStatus.push(rootElement.lang.detection_device_camera_5);
                        }
                        if (((uiZtcDeviceLinkStatus >> 17) & 1) > 0) {
                            deviceLinkStatus.push(rootElement.lang.detection_device_camera_6);
                        }
                        if (((uiZtcDeviceLinkStatus >> 18) & 1) > 0) {
                            deviceLinkStatus.push(rootElement.lang.detection_device_camera_7);
                        }
                        if (((uiZtcDeviceLinkStatus >> 19) & 1) > 0) {
                            deviceLinkStatus.push(rootElement.lang.detection_device_relay_input);
                        }
                        if (((uiZtcDeviceLinkStatus >> 20) & 1) > 0) {
                            deviceLinkStatus.push(rootElement.lang.detection_device_relay_output);
                        }
                        if (this.isRuiMingMuck()) {
                            if (((uiZtcDeviceLinkStatus >> 28) & 1) > 0) {
                                deviceLinkStatus.push(rootElement.lang.control_mode);
                            }
                            if (((uiZtcDeviceLinkStatus >> 30) & 1) > 0) {
                                deviceLinkStatus.push(rootElement.lang.valid_documents);
                            }
                            if (((uiZtcDeviceLinkStatus >> 31) & 1) > 0) {
                                deviceLinkStatus.push(rootElement.lang.certified);
                            }
                        }

                        if (deviceLinkStatus.length > 0) {
                            normal.push(rootElement.lang.detection_device_connect + "(" + deviceLinkStatus.toString() + ")");
                        }

                        var uiZtcAlarmStatus = ("0x" + tire_[13] + "" + tire_[12] + "" + tire_[11] + "" + tire_[10]) >> 0;
                        // unsigned int uiZtcAlarmStatus;    //渣土车 违规报警状态
                        /*
                        0   举升作弊，标志维持至解除
                        1   篷布作弊，标志维持至解除
                        2   空重车作弊，标志维持至解除
                        3   GPS作弊，标志维持至解除
                        4   ECU作弊，标志维持至解除
                        5(锐明)  速度作弊
                        6(锐明)  开关箱作弊
                        7(锐明)  GPS 长时间不定位
                        8~15    保留
                        16  车速线被剪报警，标志维持至解除
                        17  （重车）未密闭行驶报警，标志维持至解除
                        18  非法举升，标志维持至解除
                        19  无证，标志维持至解除
                        20  证件无效，标志维持至解除
                        21  偷运，标志维持至解除
                        22  越界，标志维持至解除
                        // 20210701新增
                        23(福州扩展) 闯禁
                        24(福州扩展) ACC点火
                        25(福州扩展) 重车核准证无效
                        26~31    保留
                        */
                        if ((uiZtcAlarmStatus & 1) > 0) {
                            if (this.isAlarmShield("824,874")) {
                                normal.push(rootElement.lang.alarm_name_824);
                            } else {
                                alarm.push(rootElement.lang.alarm_name_824);
                            }
                        }
                        if (((uiZtcAlarmStatus >> 1) & 1) > 0) {
                            if (this.isAlarmShield("825,875")) {
                                normal.push(rootElement.lang.alarm_name_825);
                            } else {
                                alarm.push(rootElement.lang.alarm_name_825);
                            }
                        }
                        if (((uiZtcAlarmStatus >> 2) & 1) > 0) {
                            if (this.isAlarmShield("826,876")) {
                                normal.push(rootElement.lang.alarm_name_826);
                            } else {
                                alarm.push(rootElement.lang.alarm_name_826);
                            }
                        }
                        if (((uiZtcAlarmStatus >> 3) & 1) > 0) {
                            if (this.isAlarmShield("827,877")) {
                                normal.push(rootElement.lang.alarm_name_827);
                            } else {
                                alarm.push(rootElement.lang.alarm_name_827);
                            }
                        }
                        if (((uiZtcAlarmStatus >> 4) & 1) > 0) {
                            if (this.isAlarmShield("828,878")) {
                                normal.push(rootElement.lang.alarm_name_828);
                            } else {
                                alarm.push(rootElement.lang.alarm_name_828);
                            }
                        }
                        if (this.isRuiMingMuck()) {
                            if (((uiZtcAlarmStatus >> 5) & 1) > 0) {
                                if (this.isAlarmShield("817,867")) {
                                    normal.push(rootElement.lang.alarm_name_817);
                                } else {
                                    alarm.push(rootElement.lang.alarm_name_817);
                                }
                            }
                            if (((uiZtcAlarmStatus >> 6) & 1) > 0) {
                                if (this.isAlarmShield("818,868")) {
                                    normal.push(rootElement.lang.alarm_name_818);
                                } else {
                                    alarm.push(rootElement.lang.alarm_name_818);
                                }
                            }
                            if (((uiZtcAlarmStatus >> 7) & 1) > 0) {
                                if (this.isAlarmShield("819,869")) {
                                    normal.push(rootElement.lang.alarm_name_819);
                                } else {
                                    alarm.push(rootElement.lang.alarm_name_819);
                                }
                            }
                        }
                        if (((uiZtcAlarmStatus >> 16) & 1) > 0) {
                            if (this.isAlarmShield("829,879")) {
                                normal.push(rootElement.lang.alarm_name_829);
                            } else {
                                alarm.push(rootElement.lang.alarm_name_829);
                            }
                        }
                        if (((uiZtcAlarmStatus >> 17) & 1) > 0) {
                            if (this.isAlarmShield("830,880")) {
                                normal.push(rootElement.lang.alarm_name_830);
                            } else {
                                alarm.push(rootElement.lang.alarm_name_830);
                            }
                        }
                        if (((uiZtcAlarmStatus >> 18) & 1) > 0) {
                            if (this.isAlarmShield("831,881")) {
                                normal.push(rootElement.lang.alarm_name_831);
                            } else {
                                alarm.push(rootElement.lang.alarm_name_831);
                            }
                        }
                        if (((uiZtcAlarmStatus >> 19) & 1) > 0) {
                            if (this.isAlarmShield("832,882")) {
                                normal.push(rootElement.lang.alarm_name_832);
                            } else {
                                alarm.push(rootElement.lang.alarm_name_832);
                            }
                        }
                        if (((uiZtcAlarmStatus >> 20) & 1) > 0) {
                            if (this.isAlarmShield("833,883")) {
                                normal.push(rootElement.lang.alarm_name_833);
                            } else {
                                alarm.push(rootElement.lang.alarm_name_833);
                            }
                        }
                        if (((uiZtcAlarmStatus >> 21) & 1) > 0) {
                            if (this.isAlarmShield("834,884")) {
                                normal.push(rootElement.lang.alarm_name_834);
                            } else {
                                alarm.push(rootElement.lang.alarm_name_834);
                            }
                        }
                        if (((uiZtcAlarmStatus >> 22) & 1) > 0) {
                            if (this.isAlarmShield("835,885")) {
                                normal.push(rootElement.lang.alarm_name_835);
                            } else {
                                alarm.push(rootElement.lang.alarm_name_835);
                            }
                        }
                        // 20210701新增
                        if (((uiZtcAlarmStatus >> 23) & 1) > 0) {
                            if (this.isAlarmShield("546,596")) {
                                normal.push(rootElement.lang.alarm_name_546);
                            } else {
                                alarm.push(rootElement.lang.alarm_name_546);
                            }
                        }
                        if (((uiZtcAlarmStatus >> 24) & 1) > 0) {
                            if (this.isAlarmShield("547,597")) {
                                normal.push(rootElement.lang.alarm_name_547);
                            } else {
                                alarm.push(rootElement.lang.alarm_name_547);
                            }
                        }
                        if (((uiZtcAlarmStatus >> 25) & 1) > 0) {
                            if (this.isAlarmShield("548,598")) {
                                normal.push(rootElement.lang.alarm_name_548);
                            } else {
                                alarm.push(rootElement.lang.alarm_name_548);
                            }
                        }
                        // this.tirePpressures[13] 
                        // unsigned char ucZtcLimitStatus; //渣土车 限制状态 Bit0：锁车 Bit1：限速 Bit2：限举
                        // 20210701新增
                        // Bit3：载重 Bit4：限举(新)
                        var ucZtcLimitStatus = parseInt(tire_[14]);
                        if (((ucZtcLimitStatus >> 0) & 1) > 0) {
                            // unsigned int uiZtcCarLockReason; //渣土车 锁车原因
                            //0：未锁车 1：平台下发锁车 8：身份验证未通过锁车
                            var uiZtcCarLockReason = "0x" + tire_[21] + "" + tire_[20] + "" + tire_[19] + "" + tire_[18];
                            status = "";
                            switch ((uiZtcCarLockReason >> 0)) {
                                case 0:
                                    status = rootElement.lang.unlock_vehicle;
                                    break;
                                case 1:
                                    status = rootElement.lang.platform_issued_unlock_vehicle;
                                    break;
                                case 8:
                                    status = rootElement.lang.authentication_unlock_vehicle;
                                    break;
                                default:
                                    break;
                            }
                            if (status) {
                                status = "(" + status + ")";
                            }

                            if (this.isAlarmShield("836,886")) {
                                normal.push(rootElement.lang.alarm_name_836 + status);
                            } else {
                                alarm.push(rootElement.lang.alarm_name_836 + status);
                            }
                        }
                        if (((ucZtcLimitStatus >> 1) & 1) > 0) {
                            // unsigned int uiZtcSpeedLimitReason; //渣土车 限速原因
                            //0：未限速(最大车速)
                            //1：平台下发限速
                            //2：（重车）顶盖未密闭行驶限速
                            //3：重车越界限速
                            //4：卫星信号被恶意屏蔽限速
                            //5：无证进入工地限速
                            //7：GNSS异常限速
                            //9：举升传感器故障或未连接限速
                            //15：SIM卡故障限速
                            //16：货箱摄像头故障或未连接限速
                            //21：区域限速
                            //23：重车无核准证限速
                            var uiZtcSpeedLimitReason = "0x" + tire_[25] + "" + tire_[24] + "" + tire_[23] + "" + tire_[22];
                            status = "";
                            switch ((uiZtcSpeedLimitReason >> 0)) {
                                case 0:
                                    status = rootElement.lang.unlimited_speed;
                                    break;
                                case 1:
                                    status = rootElement.lang.platform_limited_speed;
                                    break;
                                case 2:
                                    status = rootElement.lang.heavy_vehicles_limited_speed;
                                    break;
                                case 3:
                                    status = rootElement.lang.heavy_vehicles_overspeed;
                                    break;
                                case 4:
                                    status = rootElement.lang.satellite_signals_blocked;
                                    break;
                                case 5:
                                    status = rootElement.lang.undocumented_entry_limited_speed;
                                    break;
                                case 7:
                                    status = rootElement.lang.gnss_limited_speed;
                                    break;
                                case 9:
                                    status = rootElement.lang.g_sensor_limited_speed;
                                    break;
                                case 15:
                                    status = rootElement.lang.sim_limited_speed;
                                    break;
                                case 16:
                                    status = rootElement.lang.camera_limited_speed;
                                    break;
                                case 21:
                                    status = rootElement.lang.area_limited_speed;
                                    break;
                                case 23:
                                    status = rootElement.lang.heavy_certificate_limited_speed;
                                    break;
                                default:
                                    break;
                            }
                            if (status) {
                                status = "(" + status + ")";
                            }
                            if (this.isAlarmShield("837,887")) {
                                normal.push(rootElement.lang.alarm_name_837 + status);
                            } else {
                                alarm.push(rootElement.lang.alarm_name_837 + status);
                            }
                        }
                        if (((ucZtcLimitStatus >> 2) & 1) > 0) {
                            // unsigned int uiZtcLiftLimitReason;  //渣土车 限举原因
                            //0：未限举
                            //1：平台下发限举
                            //2：重车不在指定区域限举(在非指定区域限举)
                            //3：无证进入工地限举
                            //4：无证进入消纳场限举
                            var uiZtcLiftLimitReason = "0x" + tire_[29] + "" + tire_[28] + "" + tire_[27] + "" + tire_[26];
                            status = "";
                            switch ((uiZtcLiftLimitReason >> 0)) {
                                case 0:
                                    status = rootElement.lang.unrestricted;
                                    break;
                                case 1:
                                    status = rootElement.lang.platform_issued_restrictions;
                                    break;
                                case 2:
                                    status = rootElement.lang.heavy_vehicles_restrictions;
                                    break;
                                case 3:
                                    status = rootElement.lang.undocumented_entry_restrictions;
                                    break;
                                case 4:
                                    status = rootElement.lang.undocumented_entry_consumer_restrictions;
                                    break;
                                default:
                                    break;
                            }
                            if (status) {
                                status = "(" + status + ")";
                            }
                            if (this.isAlarmShield("838,888")) {
                                normal.push(rootElement.lang.alarm_name_838 + status);
                            } else {
                                alarm.push(rootElement.lang.alarm_name_838 + status);
                            }
                        }
                        // 20210701新增
                        if (((ucZtcLimitStatus >> 3) & 1) > 0) {
                            // unsigned int uiZtcLiftLimitReason;  //渣土车 限举原因
                            //>=16的部分表示车辆载重(单位Kg)  实际载重右移4位,如值=1600表示100kg
                            var uiZtcLiftLimitReason = "0x" + tire_[29] + "" + tire_[28] + "" + tire_[27] + "" + tire_[26];
                            var weight = uiZtcLiftLimitReason >> 4;
                            if (weight > 0) {
                                normal.push(rootElement.lang.muck_weight + (weight / 1000).toFixed(3) + rootElement.lang.muck_ton);
                            }
                        }
                        if (((ucZtcLimitStatus >> 4) & 1) > 0) {
                            // 和载重共用
                            // unsigned int uiZtcLiftLimitReason;  //渣土车 限举原因
                            //0：未限举
                            //1：平台下发限举
                            //2：重车不在指定区域限举(在非指定区域限举)
                            //3：无证进入工地限举
                            //4：无证进入消纳场限举
                            var uiZtcLiftLimitReason = "0x" + tire_[29] + "" + tire_[28] + "" + tire_[27] + "" + tire_[26];
                            status = "";
                            switch ((uiZtcLiftLimitReason & 0xFF)) {
                                case 0:
                                    status = rootElement.lang.unrestricted;
                                    break;
                                case 1:
                                    status = rootElement.lang.platform_issued_restrictions;
                                    break;
                                case 2:
                                    status = rootElement.lang.heavy_vehicles_restrictions;
                                    break;
                                case 3:
                                    status = rootElement.lang.undocumented_entry_restrictions;
                                    break;
                                case 4:
                                    status = rootElement.lang.undocumented_entry_consumer_restrictions;
                                    break;
                                default:
                                    break;
                            }
                            if (status) {
                                status = "(" + status + ")";
                            }
                            if (this.isAlarmShield("838,888")) {
                                normal.push(rootElement.lang.alarm_name_838 + status);
                            } else {
                                alarm.push(rootElement.lang.alarm_name_838 + status);
                            }
                        }


                        // unsigned char ucZtcMuckType; //(锐明)渣土类型
                        if (this.isRuiMingMuck()) {
                            //    1：普通渣土 2：砂石 3：建筑废料 4：盾构土
                            var ucZtcMuckType = parseInt(tire_[17]);
                            status = "";
                            switch (ucZtcMuckType) {
                                case 1:
                                    status = rootElement.lang.muck_type_normal;
                                    break;
                                case 2:
                                    status = rootElement.lang.muck_type_gravel;
                                    break;
                                case 3:
                                    status = rootElement.lang.muck_type_waste;
                                    break;
                                case 4:
                                    status = rootElement.lang.muck_type_soil;
                                    break;
                                default:
                                    break;
                            }
                            if (status) {
                                normal.push(rootElement.lang.muck_type + ":" + status);
                            }
                        }
                    }
                }
            }
        }
        ;
    }
    ret.normal = normal.toString();
    ret.alarm = alarm.toString();
    return ret;
}

//长gps状态信息
standardStatus.prototype.getLongGpsStatus = function () {
    var ret = {};
    var normal = [];
    if (this.isLongGps()) {
        if (this.longStatus) {
//          0位:车厢温度  1位:IO状态位  2位:扩展车辆信号状态  3位:模拟量  4位:胎压
//          //      5位:主动安全ADAS  6位:主动安全DSM  7位:主动安全BSD
            if (this.longStatus & 1) {
                if (this.compartmentTemp != null) {//单位摄氏度
                    var compartmentTemp_ = this.compartmentTemp;
//                  if((this.compartmentTemp >> 15) & 1){
//                      compartmentTemp_ = -(this.compartmentTemp & 0x7FFF);
//                  }
                    normal.push(rootElement.lang.alarm_temperator_coach + "：" + compartmentTemp_ + rootElement.lang.alarm_temperator_unit);
                }
            }
            if ((this.longStatus >> 1) & 1) {
                if (this.ioStatus != null) {
                    var ioStatus_ = [];
                    if ((this.ioStatus >> 0) & 1) {
                        ioStatus_.push(rootElement.lang.io_status_deep_sleep);
                    }
                    if ((this.ioStatus >> 1) & 1) {
                        ioStatus_.push(rootElement.lang.io_status_sleep);
                    }
                    if (ioStatus_ && ioStatus_.length > 0) {
                        normal.push(rootElement.lang.io_status + "：" + ioStatus_.join(','));
                    }
                }
            }
            if ((this.longStatus >> 2) & 1) {
                if (this.extraStatus != null) {
                    var extraStatus_ = [];
                    //参考jtt 808-2019.pdf 表31  占时只考虑前15位
                    //0 近光灯信号
                    if ((this.extraStatus >> 0) & 1) {
                        extraStatus_.push(rootElement.lang.vehicle_extra_status_1);
                    }
                    //1 远光灯信号
                    if ((this.extraStatus >> 1) & 1) {
                        extraStatus_.push(rootElement.lang.vehicle_extra_status_2);
                    }
                    //2 右转向灯信号
                    if ((this.extraStatus >> 2) & 1) {
                        extraStatus_.push(rootElement.lang.vehicle_extra_status_3);
                    }
                    //3 左转向灯信号
                    if ((this.extraStatus >> 3) & 1) {
                        extraStatus_.push(rootElement.lang.vehicle_extra_status_4);
                    }
                    //4 制动信号
                    if ((this.extraStatus >> 4) & 1) {
                        extraStatus_.push(rootElement.lang.vehicle_extra_status_5);
                    }
                    //5 倒挡信号
                    if ((this.extraStatus >> 5) & 1) {
                        extraStatus_.push(rootElement.lang.vehicle_extra_status_6);
                    }
                    //6 雾灯信号
                    if ((this.extraStatus >> 6) & 1) {
                        extraStatus_.push(rootElement.lang.vehicle_extra_status_7);
                    }
                    //7 示廓灯
                    if ((this.extraStatus >> 7) & 1) {
                        extraStatus_.push(rootElement.lang.vehicle_extra_status_8);
                    }
                    //8 喇叭信号
                    if ((this.extraStatus >> 8) & 1) {
                        extraStatus_.push(rootElement.lang.vehicle_extra_status_9);
                    }
                    //9 空调状态
                    if ((this.extraStatus >> 9) & 1) {
                        extraStatus_.push(rootElement.lang.vehicle_extra_status_10_1);
                    }
                    //10 空挡信息
                    if ((this.extraStatus >> 10) & 1) {
                        extraStatus_.push(rootElement.lang.vehicle_extra_status_11);
                    }
                    //11 缓速器工作
                    if ((this.extraStatus >> 11) & 1) {
                        extraStatus_.push(rootElement.lang.vehicle_extra_status_12);
                    }
                    //12 ABS工作
                    if ((this.extraStatus >> 12) & 1) {
                        extraStatus_.push(rootElement.lang.vehicle_extra_status_13);
                    }
                    //13 加热器工作
                    if ((this.extraStatus >> 13) & 1) {
                        extraStatus_.push(rootElement.lang.vehicle_extra_status_14);
                    }
                    //14 离合器状态
                    if ((this.extraStatus >> 14) & 1) {
                        extraStatus_.push(rootElement.lang.vehicle_extra_status_15);
                    }
                    if (extraStatus_ && extraStatus_.length > 0) {
                        normal.push(extraStatus_.join(","));
                    }
                }
            }
            /***信号模拟量web端不解析***/
            var showAnalogQuantity_ = standardVehicle.isShowMapPopItem("analogQuantity");
            if (showAnalogQuantity_ &&
                (this.longStatus >> 3) & 1) {
                if (this.analogQuantity != null) {
                    var analogQuantity_ = "";
                    var ad0 = [];
                    var ad1 = [];
                    for (var i = 0; i < 32; i++) {
                        if ((this.analogQuantity >> i) & 1) {
                            if (parseInt(i / 16) == 1) {
                                ad1.push(i);
                            } else {
                                ad0.push(i);
                            }
                        }
                    }
                    if (ad0 && ad0.length > 0) {
                        analogQuantity_ += "AD0:bit(" + ad0.join(",") + ")"
                    }
                    if (ad1 && ad1.length > 0) {
                        if (analogQuantity_) {
                            analogQuantity_ += ",";
                        }
                        analogQuantity_ += "AD1:bit(" + ad1.join(",") + ")"
                    }
                    normal.push(rootElement.lang.analog_quantity + "：" + analogQuantity_);
                }
            }

            if ((this.longStatus >> 4) & 1) {
                if (this.tirePpressures != null) {
                    //获取胎压大小
                    var size_ = parseInt(this.tirePpressures.length / 2);
                    if (size_ > 0) {
                        var tire_ = [];
                        for (var int = 0; int < size_; int++) {
                            //从左往右截取的
                            tire_.push(this.tirePpressures.slice(int * 2, int * 2 + 2));
                        }
                        //
                        if (tire_.length > 0) {
                            var tireResult_ = [];
                            this.getTirePressure(tire_, 0, 2, rootElement.lang.front_left, tireResult_);
                            this.getTirePressure(tire_, 2, 2, rootElement.lang.front_right, tireResult_);
                            this.getTirePressure(tire_, 4, 3, rootElement.lang.middle_left, tireResult_);
                            this.getTirePressure(tire_, 7, 3, rootElement.lang.middle_right, tireResult_);
                            this.getTirePressure(tire_, 10, 3, rootElement.lang.rear_left, tireResult_);
                            this.getTirePressure(tire_, 13, 3, rootElement.lang.rear_right, tireResult_);
                            this.getTirePressure(tire_, 16, 3, rootElement.lang.rear_2_left, tireResult_);
                            this.getTirePressure(tire_, 19, 3, rootElement.lang.rear_2_right, tireResult_);
                            this.getTirePressure(tire_, 22, 3, rootElement.lang.rear_3_left, tireResult_);
                            this.getTirePressure(tire_, 25, 3, rootElement.lang.rear_3_right, tireResult_);
                            if (tireResult_.length > 0) {
                                normal.push(rootElement.lang.long_gps_tire + "：" + tireResult_.join(","));
                            }
                        }
                    }

                }
            }
            //11位:路网附加信息(车辆当前限速值)
            if ((this.longStatus >> 11) & 1) {
//              this.frontVehiSpeed = 0;//前车车速   低8位     单位 Km/h。范围 0~250，仅报警类型为 0x01 和 0x02 时  有效
                //路网附加信息位(11)有效时,车辆当前限速值：单位：km/h

//              this.distinceTime = 0;//前车/行人距离   高8位   单位 100ms，范围 0~100仅报警类型为 0x01、0x02 和 0x04 时有效
                //路网附加信息位(11)有效时,车辆当前限速值：单位：km/h
                var speed = (this.distinceTime << 8) + this.frontVehiSpeed;
                normal.push(rootElement.lang.vehicle_current_speed_limit_value + "：" + speedConversion((speed).toFixed(2)));
                // 当前限速值
                ret.limitSpeed = valueConversion((speed).toFixed(2));
            }
            //12位:路网附加信息(当前道路信息)
            if ((this.longStatus >> 12) & 1) {
                //路网附加信息位(12)有效时,表示当前道路类型
                var Str_ = "";
//              this.closedEyeTime = 0;//闭眼持续时长 单位100ms  报警结束上报 仅在报警类型为0x01时有效
                if (this.getRoadLevel(Number(this.closedEyeTime))) {
                    Str_ += this.getRoadLevel(Number(this.closedEyeTime)) + ",";
                }
                //路网附加信息位(12)有效时,表示当前道路限速值
//              this.winkCount = 0; //连续眨眼次数 范围1~100。报警结束上报 仅在报警类型为0x01时有效
//              if(typeof speedConversion == 'function') {
//                  recordSpeed_ = speedConversion((ret.driveRecorderspeed/10).toFixed(2));
//              }else{
//                  recordSpeed_ = (ret.driveRecorderspeed/10).toFixed(2) +" KM/H";
//              }
                Str_ += rootElement.lang.current_road_speed_limit + "：" + speedConversion((this.winkCount).toFixed(2));
                normal.push(Str_);
            }
        }
        ;
    }
    ret.normal = normal.toString();
    return ret;
}
/**
 * 解析道路等級
 */
standardStatus.prototype.getRoadLevel = function (type) {
    var ret = "";
    if (!type) {
        return ret;
    }
    switch (type) {
        case 1:
            ret += rootElement.lang.alarm_road_highway;
            break;
        case 2:
            ret += rootElement.lang.alarm_road_city_highway;
            break;
        case 3:
            ret += rootElement.lang.alarm_road_state;
            break;
        case 4:
            ret += rootElement.lang.alarm_road_provincial;
            break;
        case 5:
            ret += rootElement.lang.alarm_road_county;
            break;
        case 6:
            ret += rootElement.lang.alarm_road_township;
            break;
        case 7:
            ret += rootElement.lang.alarm_road_other;
            break;
        case 8:
            ret += rootElement.lang.alarm_road_nine;
            break;
        case 9:
            ret += rootElement.lang.alarm_road_ferry;
            break;
        case 10:
            ret += rootElement.lang.alarm_road_pedestrian;
            break;
    }
    if (ret) {
        return rootElement.lang.alarm_road_level_lab + ret;
    }
    return rootElement.lang.unknow + type;
}

//新加字段解析
standardStatus.prototype.getStorageAlarmSBNew = function (noramOnly) {
    var ret = {};
    var normal = [];
    var alarm = [];
    var alarmType = [];
    if (this.isLongGps()) {
        if (this.longStatus) {
            if ((this.longStatus >> 13) & 1) {
                this.getSafetyAlarmNew(normal, alarm, alarmType);
                /*  0:超过阈值速度报警    1:超过道路限速报警  2.(黑标)超速报警  3.(黑标)路线偏离报警  4.(黑标)禁行路段/区域报警
                （新）5:超过车辆额定载重报警  （新）6:超过道路承重报警  （新）7.超过限定高度报警
                */
                if (this.roadFlagData != null) {
                    if ((this.roadFlagData & 1) > 0) {
                        if (this.isAlarmShield("727,777")) {
                            normal.push(rootElement.lang.alarm_name_727);
                        } else {
                            alarm.push(rootElement.lang.alarm_name_727);
                        }
                        alarmType.push(727);
                    }
                    if (((this.roadFlagData >> 1) & 1) > 0) {
                        if (this.isAlarmShield("744,794")) {
                            normal.push(rootElement.lang.alarm_name_744);
                        } else {
                            alarm.push(rootElement.lang.alarm_name_744);
                        }
                        alarmType.push(744);
                    }
                    //   bit2.(黑标)超速报警  bit3.(黑标)路线偏离报警  bit4.(黑标)禁行路段/区域报警
                    if (((this.roadFlagData >> 2) & 1) > 0) {
                        if (this.isAlarmShield("512,562")) {
                            normal.push(rootElement.lang.alarm_name_512);
                        } else {
                            alarm.push(rootElement.lang.alarm_name_512);
                        }
                        alarmType.push(512);
                    }
                    if (((this.roadFlagData >> 3) & 1) > 0) {
                        if (this.isAlarmShield("513,563")) {
                            normal.push(rootElement.lang.alarm_name_513);
                        } else {
                            alarm.push(rootElement.lang.alarm_name_513);
                        }
                        alarmType.push(513);
                    }
                    if (((this.roadFlagData >> 4) & 1) > 0) {
                        if (this.isAlarmShield("514,564")) {
                            normal.push(rootElement.lang.alarm_name_514);
                        } else {
                            alarm.push(rootElement.lang.alarm_name_514);
                        }
                        alarmType.push(514);
                    }

                    if (((this.roadFlagData >> 5) & 1) > 0) {
                        if (this.isAlarmShield("549,599")) {
                            normal.push(rootElement.lang.alarm_name_549);
                        } else {
                            alarm.push(rootElement.lang.alarm_name_549);
                        }
                        alarmType.push(549);
                    }
                    if (((this.roadFlagData >> 6) & 1) > 0) {
                        if (this.isAlarmShield("545,595")) {
                            normal.push(rootElement.lang.alarm_name_545);
                        } else {
                            alarm.push(rootElement.lang.alarm_name_545);
                        }
                        alarmType.push(545);
                    }
                    if (((this.roadFlagData >> 7) & 1) > 0) {
                        if (this.isAlarmShield("1237,1287")) {
                            normal.push(rootElement.lang.alarm_name_1237);
                        } else {
                            alarm.push(rootElement.lang.alarm_name_1237);
                        }
                        alarmType.push(1237);
                    }
                }
                if (this.distractedDriving != null) {
                    if ((this.distractedDriving & 1) > 0) {
                        var info = rootElement.lang.alarm_name_637;
                        if (this.isAlarmShield('637,687')) {
                            //分神驾驶2级平台
                            normal.push(info);
                        } else {
                            alarm.push(info);
                        }
                        alarmType.push(637);
                    }
                }
            } else {
                if ((this.longStatus >> 5) & 1) {
                    //ADAS报警位
                    var adasAlarm = this.isAdasAlarmNew();
                    if (adasAlarm) {
                        if (adasAlarm.normal) {
                            normal.push(adasAlarm.normal);
                        }
                        if (adasAlarm.alarm) {
                            alarm.push(adasAlarm.alarm);
                        }
                        alarmType.push(adasAlarm.alarmType);
                    }
                }
                if ((this.longStatus >> 6) & 1) {
                    //dsm相关报警
                    var dsmAlarm = this.isDsmAlarmNew();
                    if (dsmAlarm) {
                        if (dsmAlarm.normal) {
                            normal.push(dsmAlarm.normal);
                        }
                        if (dsmAlarm.alarm) {
                            alarm.push(dsmAlarm.alarm);
                        }
                        alarmType.push(dsmAlarm.alarmType);
                    }
                }
                if ((this.longStatus >> 7) & 1) {
                    //盲点监测系统报警信息
                    var bsdAlarm = this.isBsdAlarmNew();
                    if (bsdAlarm) {
                        if (bsdAlarm.normal) {
                            normal.push(bsdAlarm.normal);
                        }
                        if (bsdAlarm.alarm) {
                            alarm.push(bsdAlarm.alarm);
                        }
                        alarmType.push(bsdAlarm.alarmType);
                    }
                }
                if ((this.longStatus >> 8) & 1) {
                    //8位:激烈驾驶参数
                    var fierceDrivingAlarm = this.isFierceDrivingAlarm();
                    if (fierceDrivingAlarm) {
                        if (fierceDrivingAlarm.normal) {
                            normal.push(fierceDrivingAlarm.normal);
                        }
                        if (fierceDrivingAlarm.alarm) {
                            alarm.push(fierceDrivingAlarm.alarm);
                        }
                        alarmType.push(fierceDrivingAlarm.alarmType);
                    }
                }
                if ((this.longStatus >> 9) & 1) {
                    //	9位:智能检测(上海)
                    var detectionAlarm = this.isIntelligentDetection();
                    if (detectionAlarm) {
                        if (detectionAlarm.normal) {
                            normal.push(detectionAlarm.normal);
                        }
                        if (detectionAlarm.alarm) {
                            alarm.push(detectionAlarm.alarm);
                        }
                        alarmType.push(detectionAlarm.alarmType);
                    }
                }
                if ((this.longStatus >> 10) & 1) {
                    //	10位:卫星定位(上海)
                    var detectionAlarm = this.isSatellitepositioning();
                    if (detectionAlarm) {
                        if (detectionAlarm.normal) {
                            normal.push(detectionAlarm.normal);
                        }
                        if (detectionAlarm.alarm) {
                            alarm.push(detectionAlarm.alarm);
                        }
                        alarmType.push(detectionAlarm.alarmType);
                    }
                }
            }

        }
    }
    ret.normal = normal.toString();
    ret.alarm = alarm.toString();
    ret.alarmType = alarmType.toString();
    return ret;
}


//出租车报警位解析
standardStatus.prototype.analyTaxiAlarms = function () {
    var ret = {};
    var normal = [];
    var alarm = [];
    if (this.isTaxi905Protocol()) {
        //0位:1：计程计价装置故障(报警800)
        //1位:1：服务评价器故障（前后排）(报警801)
        //2位:1：LED 广告屏故障(报警802)
        //3位:1：LCD显示屏故障(报警803)
        //4位:1：安全访问模块故障(报警804)
        //5位:1：巡游车顶灯故障(报警805)
        //6位:1：连续驾驶超时(报警806)
        //7位:1：禁行路段行驶(报警807)
        //8位:1：LCD终端故障(报警808)
        //9位:保留
        //10位:1：录音设备故障(报警809)
        //11位:1：计程计价装置实时时钟超过规定的误差范围(报警810)
        //12位:1：紧急报警按钮故障(报警811)
        //13位:1：巡游车不打表营运 / 网约车巡游带客(报警812)
        //14位:1：驾驶员人脸识别不匹配报警(报警813)
        //15位:1：生理疲劳报警(报警618)---   //疲劳驾驶报警1级
        //16位:1：分心驾驶报警(报警624)---   //分神驾驶报警1级
        //17位:1：开车抽烟报警(报警622)---   //抽烟报警1级
        //18位:1：开车打电话报警(报警620)--- //接打电话报警1级
        // 905(北京)
        //19位:1：非法开门报警(报警6)
        //20位:1：探测报警(报警815)"新"
        //21位:1：未戴口罩报警(报警816)"新"
        //22位:1：有客不打表营运报警(报警848)"新"
        //23位:1：无客打表报警(报警849)"新"
        //24位:1：体温异常报警(1002)
        //17-2.出租车的相关报警状态位
        if (this.sensor3) {
            if (((this.sensor3 >> 0) & 1)) {
                //计程计价装置故障
                if (this.isAlarmShield('800,850')) {
                    normal.push(rootElement.lang.taxi_alarm_valuation);
                } else {
                    alarm.push(rootElement.lang.taxi_alarm_valuation);
                }
            }
            if (((this.sensor3 >> 1) & 1)) {
                //服务评价器故障（前后排）
                if (this.isAlarmShield('801,851')) {
                    normal.push(rootElement.lang.taxi_alarm_evaluator);
                } else {
                    alarm.push(rootElement.lang.taxi_alarm_evaluator);
                }
            }
            if (((this.sensor3 >> 2) & 1)) {
                //LED 广告屏故障
                if (this.isAlarmShield('802,852')) {
                    normal.push(rootElement.lang.taxi_alarm_led);
                } else {
                    alarm.push(rootElement.lang.taxi_alarm_led);
                }
            }
            if (((this.sensor3 >> 3) & 1)) {
                //液晶（LCD）显示屏故障
                if (this.isAlarmShield('803,853')) {
                    normal.push(rootElement.lang.taxi_alarm_lcd);
                } else {
                    alarm.push(rootElement.lang.taxi_alarm_lcd);
                }
            }
            if (((this.sensor3 >> 4) & 1)) {
                //安全访问模块故障
                if (this.isAlarmShield('804,854')) {
                    normal.push(rootElement.lang.taxi_alarm_secure);
                } else {
                    alarm.push(rootElement.lang.taxi_alarm_secure);
                }
            }
            if (((this.sensor3 >> 5) & 1)) {
                //巡游车顶灯故障
                if (this.isAlarmShield('805,855')) {
                    normal.push(rootElement.lang.taxi_alarm_roof_light);
                } else {
                    alarm.push(rootElement.lang.taxi_alarm_roof_light);
                }
            }
            if (((this.sensor3 >> 6) & 1)) {
                //连续驾驶超时
                if (this.isAlarmShield('806,856')) {
                    normal.push(rootElement.lang.taxi_alarm_driving_timeout);
                } else {
                    alarm.push(rootElement.lang.taxi_alarm_driving_timeout);
                }
            }
            if (((this.sensor3 >> 7) & 1)) {
                //禁行路段行驶
                if (this.isAlarmShield('807,857')) {
                    normal.push(rootElement.lang.taxi_alarm_forbidden_road);
                } else {
                    alarm.push(rootElement.lang.taxi_alarm_forbidden_road);
                }
            }
            if (((this.sensor3 >> 8) & 1)) {
                //LCD终端故障
                if (this.isAlarmShield('808,858')) {
                    normal.push(rootElement.lang.taxi_alarm_lcd_error);
                } else {
                    alarm.push(rootElement.lang.taxi_alarm_lcd_error);
                }
            }
            if (((this.sensor3 >> 10) & 1)) {
                //录音设备故障
                if (this.isAlarmShield('809,859')) {
                    normal.push(rootElement.lang.taxi_alarm_recording);
                } else {
                    alarm.push(rootElement.lang.taxi_alarm_recording);
                }
            }
            if (((this.sensor3 >> 11) & 1)) {
                //计程计价装置实时时钟超过规定的误差范围
                if (this.isAlarmShield('810,860')) {
                    normal.push(rootElement.lang.taxi_alarm_clock_error);
                } else {
                    alarm.push(rootElement.lang.taxi_alarm_clock_error);
                }
            }
            if (((this.sensor3 >> 12) & 1)) {
                //紧急报警按钮故障
                if (this.isAlarmShield('811,861')) {
                    normal.push(rootElement.lang.taxi_alarm_emergency);
                } else {
                    alarm.push(rootElement.lang.taxi_alarm_emergency);
                }
            }
            if (((this.sensor3 >> 13) & 1)) {
                //巡游车不打表营运 / 网约车巡游带客
                if (this.isAlarmShield('812,862')) {
                    normal.push(rootElement.lang.taxi_alarm_violation);
                } else {
                    alarm.push(rootElement.lang.taxi_alarm_violation);
                }
            }
            if (((this.sensor3 >> 14) & 1)) {
                //驾驶员人脸识别不匹配报警
                if (this.isAlarmShield('813,863')) {
                    normal.push(rootElement.lang.taxi_alarm_unrecognize);
                } else {
                    alarm.push(rootElement.lang.taxi_alarm_unrecognize);
                }
            }
            if (((this.sensor3 >> 15) & 1)) {
                //疲劳驾驶报警1级
                if (this.isAlarmShield('618,668')) {
                    normal.push(rootElement.lang.alarm_name_618 + rootElement.lang.alarm_name_11111);
                } else {
                    alarm.push(rootElement.lang.alarm_name_618 + rootElement.lang.alarm_name_11111);
                }
            }
            if (((this.sensor3 >> 16) & 1)) {
                //分神驾驶报警1级
                if (this.isAlarmShield('624,674')) {
                    normal.push(rootElement.lang.alarm_name_624 + rootElement.lang.alarm_name_11111);
                } else {
                    alarm.push(rootElement.lang.alarm_name_624 + rootElement.lang.alarm_name_11111);
                }
            }
            if (((this.sensor3 >> 17) & 1)) {
                //抽烟报警1级
                if (this.isAlarmShield("622,672")) {
                    normal.push(rootElement.lang.alarm_name_622 + rootElement.lang.alarm_name_11111);
                } else {
                    alarm.push(rootElement.lang.alarm_name_622 + rootElement.lang.alarm_name_11111);
                }
            }
            if (((this.sensor3 >> 18) & 1)) {
                //接打电话报警1级
                if (this.isAlarmShield("620,670")) {
                    normal.push(rootElement.lang.alarm_name_620 + rootElement.lang.alarm_name_11111);
                } else {
                    alarm.push(rootElement.lang.alarm_name_620 + rootElement.lang.alarm_name_11111);
                }
            }

            if (((this.sensor3 >> 19) & 1)) {
                //非法开门报警
                if (this.isAlarmShield("6,56")) {
                    normal.push(rootElement.lang.alarm_name_6);
                } else {
                    alarm.push(rootElement.lang.alarm_name_6);
                }
            }
            if (((this.sensor3 >> 20) & 1)) {
                //探测报警
                if (this.isAlarmShield("815,865")) {
                    normal.push(rootElement.lang.alarm_name_815);
                } else {
                    alarm.push(rootElement.lang.alarm_name_815);
                }
            }
            if (((this.sensor3 >> 21) & 1)) {
                //未戴口罩报警
                if (this.isAlarmShield("816,866")) {
                    normal.push(rootElement.lang.alarm_name_816);
                } else {
                    alarm.push(rootElement.lang.alarm_name_816);
                }
            }
            if (((this.sensor3 >> 22) & 1)) {
                //有客不打表营运报警
                if (this.isAlarmShield("848,898")) {
                    normal.push(rootElement.lang.alarm_name_848);
                } else {
                    alarm.push(rootElement.lang.alarm_name_848);
                }
            }
            if (((this.sensor3 >> 23) & 1)) {
                //无客打表报警
                if (this.isAlarmShield("849,899")) {
                    normal.push(rootElement.lang.alarm_name_849);
                } else {
                    alarm.push(rootElement.lang.alarm_name_849);
                }
            }
            if (((this.sensor3 >> 24) & 1)) {
                //未戴口罩报警
                if (this.isAlarmShield("1002")) {
                    normal.push(rootElement.lang.alarm_name_1002);
                } else {
                    alarm.push(rootElement.lang.alarm_name_1002);
                }
            }
        }
    }
    ret.normal = normal.toString();
    ret.alarm = alarm.toString();
    return ret;
}


//解析胎压   tireStr参数  index 第几组胎压   count 胎压个数
standardStatus.prototype.getTirePressure = function (tireArry, index, count, name, tireResult) {
    var str_ = [];
    if (tireArry && tireArry.length >= (index + count)) {
        /*var validCount = 0;
        // 统计有效的胎压
        for (var i = 0; i < count; i++) {
            var hex_ = '0x' + tireArry[index + i];
            if (~hex_ != -256) {
                validCount++;
            }
        }*/
        // 不根据有效个数来
        var validCount = count;
        //加入数据
        if (validCount > 0) {
            //统计有效的胎压
            for (var i = 0; i < count; i++) {
                var hex_ = '0x' + tireArry[index + i];
                if (~hex_ != -256) {
                    var name_ = "";
                    if (validCount == 1) {
                        name_ = name;
                    } else {
                        name_ = name + "" + (i + 1);
                    }
                    str_.push(name_ + ": " + parseInt(hex_, 16) + "Pa");
                }
            }
        }
    }

    if (str_.length > 0) {
        if (tireResult) {
            tireResult.push(str_.join(","));
        }
        return str_.join(",");
    }
    return "";
}


//苏标报警 解析
standardStatus.prototype.getStorageAlarmSB = function () {
    var ret = {};
    var normal = [];
    var alarm = [];
    var alarmType = [];
    if (this.isExtraFlagSB()) {
        //解析苏标ADAS报警位
        var adasAlarm = this.isAdasAlarm();
        if (adasAlarm) {
            if (adasAlarm.normal) {
                normal.push(adasAlarm.normal);
            }
            if (adasAlarm.alarm) {
                alarm.push(adasAlarm.alarm);
            }
            alarmType.push(adasAlarm.alarmType);
        }
        //dsm相关报警
        var dsmAlarm = this.isDsmAlarm();
        if (dsmAlarm) {
            if (dsmAlarm.normal) {
                normal.push(dsmAlarm.normal);
            }
            if (dsmAlarm.alarm) {
                alarm.push(dsmAlarm.alarm);
            }
            alarmType.push(dsmAlarm.alarmType);
        }
        //盲点监测系统报警信息
        var bsdAlarm = this.isBsdAlarm();
        if (bsdAlarm) {
            if (bsdAlarm.normal) {
                normal.push(bsdAlarm.normal);
            }
            if (bsdAlarm.alarm) {
                alarm.push(bsdAlarm.alarm);
            }
            alarmType.push(bsdAlarm.alarmType);
        }
    }

    ret.normal = normal.toString();
    ret.alarm = alarm.toString();
    ret.alarmType = alarmType.toString();
    return ret;
}

//longGps解析
standardStatus.prototype.isBsdAlarmNew = function () {
    var ret = {};
    var normal = [];
    var alarm = [];
    var alarmType = [];

    var BSDAlarm = this.bsdAlarmL1;
    if (BSDAlarm) {
        /* 	0：左侧盲区报警 1：右侧盲区报警 2：后方接近报警  3:右侧盲区一级报警  4:右侧盲区二级报警  5:右侧盲区三级报警*/
        if ((BSDAlarm & 1)) {
            //后方接近报警
            if (this.isAlarmShield('633,683')) {
                normal.push(rootElement.lang.alarm_name_633);
            } else {
                alarm.push(rootElement.lang.alarm_name_633);
            }
            alarmType.push(633);
        }
        if (((BSDAlarm >> 1) & 1)) {
            //左侧后方接近报警
            if (this.isAlarmShield('634,684')) {
                normal.push(rootElement.lang.alarm_name_634);
            } else {
                alarm.push(rootElement.lang.alarm_name_634);
            }
            alarmType.push(634);
        }
        if (((BSDAlarm >> 2) & 1)) {
            //右侧后方接近报警
            if (this.isAlarmShield('635,685')) {
                normal.push(rootElement.lang.alarm_name_635);
            } else {
                alarm.push(rootElement.lang.alarm_name_635);
            }
            alarmType.push(635);
        }
        if (((BSDAlarm >> 3) & 1)) {
            //右侧盲区一级报警
            if (this.isAlarmShield('747,797')) {
                normal.push(rootElement.lang.alarm_name_747);
            } else {
                alarm.push(rootElement.lang.alarm_name_747);
            }
            alarmType.push(747);
        }
        if (((BSDAlarm >> 4) & 1)) {
            //右侧盲区二级报警
            if (this.isAlarmShield('748,798')) {
                normal.push(rootElement.lang.alarm_name_748);
            } else {
                alarm.push(rootElement.lang.alarm_name_748);
            }
            alarmType.push(748);
        }
        if (((BSDAlarm >> 5) & 1)) {
            //右侧盲区三级报警
            if (this.isAlarmShield('749,799')) {
                normal.push(rootElement.lang.alarm_name_749);
            } else {
                alarm.push(rootElement.lang.alarm_name_749);
            }
            alarmType.push(749);
        }
    }
    ret.normal = normal.toString();
    ret.alarm = alarm.toString();
    ret.alarmType = alarmType.toString();
    return ret;
};

//盲点监测系统报警信息
standardStatus.prototype.isBsdAlarm = function () {
    var ret = {};
    var normal = [];
    var alarm = [];
    var alarmType = [];
    if (this.sensor4) {
        var BSDAlarm = (this.sensor4 >> 24) & 7;
        if ((BSDAlarm & 1)) {
            //后方接近报警
            if (this.isAlarmShield('633,683')) {
                normal.push(rootElement.lang.alarm_name_633);
            } else {
                alarm.push(rootElement.lang.alarm_name_633);
            }
            alarmType.push(633);
        }
        if (((BSDAlarm >> 1) & 1)) {
            //左侧后方接近报警
            if (this.isAlarmShield('634,684')) {
                normal.push(rootElement.lang.alarm_name_634);
            } else {
                alarm.push(rootElement.lang.alarm_name_634);
            }
            alarmType.push(634);
        }
        if (((BSDAlarm >> 2) & 1)) {
            //右侧后方接近报警
            if (this.isAlarmShield('635,685')) {
                normal.push(rootElement.lang.alarm_name_635);
            } else {
                alarm.push(rootElement.lang.alarm_name_635);
            }
            alarmType.push(635);
        }
    }
    ret.normal = normal.toString();
    ret.alarm = alarm.toString();
    ret.alarmType = alarmType.toString();
    return ret;
};

//智能检测
standardStatus.prototype.isIntelligentDetection = function () {
    var ret = {};
    var normal = [];
    var alarm = [];
    var alarmType = [];
    var BSDAlarm = this.roadFlagType;
//	this.roadFlagType = 0;//bit0-1 道路标志识别类型(0：限速标志 1：限高标志 2：限重标志)仅报警类型为 0x06 时有效    bit2: //分神驾驶报警 2级(平台)
    //bit3-bit6:智能检测(上海) bit3:车厢超载报警1级  bit4:车厢超载报警2级	bit5:站外上客报警1级  bit6:站外上客报警2级
    if (BSDAlarm) {
        if (((BSDAlarm >> 3) & 1)) {
            //车厢超载报警1级
            if (this.isAlarmShield('740,790')) {
                normal.push(rootElement.lang.alarm_name_740 + rootElement.lang.alarm_name_11111);
            } else {
                alarm.push(rootElement.lang.alarm_name_740 + rootElement.lang.alarm_name_11111);
            }
            alarmType.push(740);
        }
        if (((BSDAlarm >> 4) & 1)) {
            //车厢超载报警2级
            if (this.isAlarmShield('741,791')) {
                normal.push(rootElement.lang.alarm_name_740 + rootElement.lang.alarm_name_22222);
            } else {
                alarm.push(rootElement.lang.alarm_name_740 + rootElement.lang.alarm_name_22222);
                alarmType.push(741);
            }
        }
        if (((BSDAlarm >> 5) & 1)) {
            //站外上客报警1级
            if (this.isAlarmShield('742,792')) {
                normal.push(rootElement.lang.alarm_name_742 + rootElement.lang.alarm_name_11111);
            } else {
                alarm.push(rootElement.lang.alarm_name_742 + rootElement.lang.alarm_name_11111);
            }
            alarmType.push(742);
        }
        if (((BSDAlarm >> 6) & 1)) {
            //站外上客报警2级
            if (this.isAlarmShield('743,793')) {
                normal.push(rootElement.lang.alarm_name_742 + rootElement.lang.alarm_name_22222);
            } else {
                alarm.push(rootElement.lang.alarm_name_742 + rootElement.lang.alarm_name_22222);
            }
            alarmType.push(743);
        }
    }
    ret.normal = normal.toString();
    ret.alarm = alarm.toString();
    ret.alarmType = alarmType.toString();
    return ret;
};


//卫星定位报警信息
standardStatus.prototype.isSatellitepositioning = function () {
    var ret = {};
    var normal = [];
    var alarm = [];
    var alarmType = [];
    var BSDAlarm = this.bsdAlarmL2;
    /*	0:急加速报警	1:急减速报警	2:急转弯报警	3:怠速报警	4:异常熄火报警	5:空挡滑行报警	6:发动机超转报警  7 超速报警(卫星定位)
	*/
    if (BSDAlarm) {
        if (((BSDAlarm >> 7) & 1)) {
            //卫星定位 超速报警
            if (this.isAlarmShield('727,777')) {
                normal.push(rootElement.lang.alarm_name_727);
            } else {
                alarm.push(rootElement.lang.alarm_name_727);
            }
            alarmType.push(727);
        }
    }
    //	0：左侧盲区报警 	1：右侧盲区报警 	2：后方接近报警    //3：卫星定位--超过道路限速报警
    var BSDAlarm0 = this.bsdAlarmL1;
    if (((BSDAlarm0 >> 3) & 1)) {
        //卫星定位 超速报警
        if (this.isAlarmShield('744,794')) {
            normal.push(rootElement.lang.alarm_name_744);
        } else {
            alarm.push(rootElement.lang.alarm_name_744);
        }
        alarmType.push(744);
    }
    ret.normal = normal.toString();
    ret.alarm = alarm.toString();
    ret.alarmType = alarmType.toString();
    return ret;
}

//激烈驾驶报警信息
standardStatus.prototype.isFierceDrivingAlarm = function () {
    var ret = {};
    var normal = [];
    var alarm = [];
    var alarmType = [];
    var BSDAlarm = this.bsdAlarmL2;
    /*	0:急加速报警1:急减速报警2:急转弯报警3:怠速报警4:异常熄火报警5:空挡滑行报警6:发动机超转报警
	*/
    if (BSDAlarm) {
        if ((BSDAlarm & 1)) {
            //急加速报警
            if (this.isAlarmShield("720,770")) {
                normal.push(rootElement.lang.alarm_name_720);
            } else {
                alarm.push(rootElement.lang.alarm_name_720);
            }
            alarmType.push(720);
        }
        if (((BSDAlarm >> 1) & 1)) {
            //急减速报警
            if (this.isAlarmShield("721,771")) {
                normal.push(rootElement.lang.alarm_name_721);
            } else {
                alarm.push(rootElement.lang.alarm_name_721);
            }
            alarmType.push(721);
        }
        if (((BSDAlarm >> 2) & 1)) {
            //急转弯报警
            if (this.isAlarmShield('722,772')) {
                normal.push(rootElement.lang.alarm_name_722);
            } else {
                alarm.push(rootElement.lang.alarm_name_722);
            }
            alarmType.push(722);
        }

        if (((BSDAlarm >> 3) & 1)) {
            //怠速报警
            if (this.isAlarmShield('723,773')) {
                normal.push(rootElement.lang.alarm_name_723);
            } else {
                alarm.push(rootElement.lang.alarm_name_723);
            }
            alarmType.push(723);
        }
        if (((BSDAlarm >> 4) & 1)) {
            //异常熄火报警
            if (this.isAlarmShield('724,774')) {
                normal.push(rootElement.lang.alarm_name_724);
            } else {
                alarm.push(rootElement.lang.alarm_name_724);
            }
            alarmType.push(724);
        }
        if (((BSDAlarm >> 5) & 1)) {
            //空挡滑行报警
            if (this.isAlarmShield('725,775')) {
                normal.push(rootElement.lang.alarm_name_725);
            } else {
                alarm.push(rootElement.lang.alarm_name_725);
            }
            alarmType.push(725);
        }
        if (((BSDAlarm >> 6) & 1)) {
            //发动机超转报警
            if (this.isAlarmShield('726,776')) {
                normal.push(rootElement.lang.alarm_name_726);
            } else {
                alarm.push(rootElement.lang.alarm_name_726);
            }
            alarmType.push(726);
        }
    }
    ret.normal = normal.toString();
    ret.alarm = alarm.toString();
    ret.alarmType = alarmType.toString();
    return ret;
};


//是否有急加速: 1-急加速
standardStatus.prototype.isRapidAcceleration = function () {
    if (this.status2 !== null) {
        var valid = ((this.status2 >> 6) & 0x01);
        if (valid == 1) {
            return true;
        }
    }
    return false;
};

//急加速: 1-急加速
standardStatus.prototype.getRapidAcceleration = function () {
    var infos = '';
    if (this.isRapidAcceleration()) {
        infos = rootElement.lang.alarm_type_rapidAcceleration;
    }
    var ret = {};
    if (this.isAlarmShield('246,296')) {
        ret.normal = infos;
        ret.alarm = '';
    } else {
        ret.normal = '';
        ret.alarm = infos;
    }

    return ret;

}

//第7位：急减速  1-急减速
standardStatus.prototype.isRapidDeceleration = function () {
    if (this.status2 !== null) {
        var valid = ((this.status2 >> 7) & 0x01);
        if (valid == 1) {
            return true;
        }
    }
    return false;
};

//急减速  1-急减速
standardStatus.prototype.getRapidDeceleration = function () {
    var infos = '';
    if (this.isRapidDeceleration()) {
        infos = rootElement.lang.alarm_type_rapidDeceleration;
    }
    var ret = {};
    if (this.isAlarmShield('247,297')) {
        ret.normal = infos;
        ret.alarm = '';
    } else {
        ret.normal = '';
        ret.alarm = infos;
    }
    return ret;
}

//设备ACC是否开启
standardStatus.prototype.isAccOpen = function () {
    if (this.status1 != null) {
        //0表示ACC关闭1表示ACC开启
        var temp = (this.status1 >> 1) & 1;
        if (temp > 0) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};


//获取设备转动状态
standardStatus.prototype.getDevTurnStatusEx = function () {
    var normal = [];
    var alarm = [];
    if (this.status1 != null) {
        //5位表示正转
        temp = (this.status1 >> 5) & 1;
        if (temp > 0) {
            normal.push(rootElement.lang.monitor_turnPositive);
        }
        //6位表示反转状态，1反转0无效
        temp = (this.status1 >> 6) & 1;
        if (temp > 0) {
            normal.push(rootElement.lang.monitor_turnReserve);
        }
    }
    var ret = {};
    ret.normal = normal.toString();
    ret.alarm = alarm.toString();

    return ret;
}

//获取设备转动状态
standardStatus.prototype.getDevTurnStatus = function () {
    var normal = [];
    var alarm = [];
    if (this.status1 != null) {
        //2位ACC信号异常报警(平台)(326)
        var temp = (this.status1 >> 2) & 1;
        if (temp > 0) {
            if (this.isAlarmShield('326,376')) {
                normal.push(rootElement.lang.acc_signal_abnormal);
            } else {
                alarm.push(rootElement.lang.acc_signal_abnormal);
            }
        }
        ////3位位置信息上报异常报警(平台)(327)
        temp = (this.status1 >> 3) & 1;
        if (temp > 0) {
            if (this.isAlarmShield('327,377')) {
                normal.push(rootElement.lang.position_abnormal_alarm);
            } else {
                alarm.push(rootElement.lang.position_abnormal_alarm);
            }
        }

        temp = (this.status1 >> 4) & 1;
        if (temp > 0) {
            if (this.isAlarmShield('1109,1110')) {
                normal.push(rootElement.lang.alarm_name_1109);
            } else {
                alarm.push(rootElement.lang.alarm_name_1109);
            }
        }
    }
    var ret = {};
    ret.normal = normal.toString();
    ret.alarm = alarm.toString();

    return ret;
}


//获取设备gps补传
standardStatus.prototype.getGPSSupplements = function () {
    var normal = [];
    if (this.status1 != null) {
        //gps补传
        var temp = (this.status1 >> 15) & 1;
        if (temp > 0) {
            normal.push(rootElement.lang.gps_supplements);
        }
    }
    return normal.toString();
}

//设备gps天线状态是否正常
standardStatus.prototype.isAntennaNormal = function () {
    if (this.status1 != null) {
        //7位GPS天线状态:存在  不存在
        var temp = (this.status1 >> 7) & 1;
        if (temp > 0) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

//设备是否处于静止状态
standardStatus.prototype.isStillEvent = function () {
    if (this.status1 != null) {
        //13处于静止状态
        var temp = (this.status1 >> 13) & 1;
        if (temp > 0) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

//设备是否停车超时  大于180s
standardStatus.prototype.isParkOverTime = function () {
    if (this.parkTime != null && this.parkTime >= 180) {
        return true;
    } else {
        return false;
    }
}

//设备是否处于静止状态
standardStatus.prototype.isParkEvent = function () {
    //13处于静止状态
    var temp = (this.status1 >> 13) & 1;
    if (temp > 0 && this.isParkOverTime()) {
        return true;
    } else {
        return false;
    }
};

//判断设备是否停车未熄火
standardStatus.prototype.isParking = function () {
    if (this.isStillEvent() && this.isAccOpen() && !this.isParkOverTime()) {//} && !this.isParkOverTime()) {
        return true;
    }
    return false;
}

//判断车辆是否停车熄火
standardStatus.prototype.isParked = function () {
    //停车  判断：     以前      1.禁止状态+acc熄火 2. 停车时长超过180秒
    //         现在      1.停车时长超过180秒
    if (this.isParkOverTime()) {
//	if((this.isStillEvent() && !this.isAccOpen()) || this.isParkOverTime()){//} || this.isParkOverTime())) {
        return true;
    }
    return false;
}

//判断车辆是否停车熄火
standardStatus.prototype.isParkedNew = function () {
    //停车  判断：         1.车辆静止状态+acc熄火
    if ((this.isStillEvent() && !this.isAccOpen())) {
        return true;
    }
    return false;
}

//判断车辆是否怠速
standardStatus.prototype.isIdling = function () {
    //怠速   判断：     以前      1.acc开启   2.车辆静止状态
    if ((this.isStillEvent() && this.isAccOpen())) {
        return true;
    }
    return false;
}


//时间秒数转换为时分秒
standardStatus.prototype.getTimeDifference = function (second) {
    // 默认0秒
    if (!second && second == 0) {
        return  second + ' ' + rootElement.lang.min_second;
    }
    var difValue = "";
    var days = parseInt(second / (60 * 60 * 24));
    var hours = parseInt(second % (60 * 60 * 24) / (60 * 60));
    var minutes = parseInt(second % (60 * 60) / 60);
    var seconds = parseInt(second % 60);
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


standardStatus.prototype.getDiskType = function () {
    return this.diskType == null ? 1 : this.diskType;
};

standardStatus.prototype.getDiskTypeStr = function () {
    switch (this.getDiskType()) {
        case 0:
        case 1:
            return rootElement.lang.alarm_gps_sd;
        case 2:
            return rootElement.lang.alarm_gps_disk;
        case 3:
            return rootElement.lang.alarm_gps_ssd;
    }
};

//获取硬盘类型
standardStatus.prototype.getDiskTypeString = function (diskType) {
    switch (diskType) {
        case 0:
        case 1:
            return rootElement.lang.alarm_gps_sd;
        case 2:
            return rootElement.lang.alarm_gps_disk;
        case 3:
            return rootElement.lang.alarm_gps_ssd;
    }
};

//判断硬盘状态
standardStatus.prototype.gpsGetDiskStatus = function (status, disk, isAlarm) {
    var data = {};
    data.isAlarm = false;
    if (status === 0) {
        if (isAlarm) {
            data.info = disk + "(" + rootElement.lang.monitor_diskNoExist + ")";
            data.isAlarm = true;
        } else {
            data.info = disk + "(" + rootElement.lang.monitor_diskNoExist + ")";
        }
    } else if (status == 2) {
        //只要断电就放入报警状态
        //if (isAlarm) {
        data.info = disk + "(" + rootElement.lang.monitor_diskAbnormal + ")";
        data.isAlarm = true;
        /*} else {
			data.info = disk + "("+  rootElement.lang.monitor_diskAbnormal+")";
		}*/
    } else {
//		data.info = disk + "("+ rootElement.lang.monitor_diskNormal+")";//存在
        data.info = disk + "(" + rootElement.lang.monitor_diskNormal + ")";
    }
    return data;
}

//判断GPS设备硬盘状态
standardStatus.prototype.isDiskStatus = function () {
    //31位硬盘状态（GPS设备时使用）1、无效	0、有效，要再判断1，2的状态
    var temp = (this.status1 >> 31) & 1;
    if (temp > 0) {
        return false;
    } else {
        return true;
    }
}

//判断UAE硬盘状态
standardStatus.prototype.gpsGetUAEDiskStatus = function (status, disk, isAlarm) {
    var data = {};
    data.isAlarm = false;
    if (status === 2) {
        if (isAlarm) {
            data.info = disk + "(" + rootElement.lang.monitor_diskNoExist + ")";
            data.isAlarm = true;
        } else {
            data.info = disk + "(" + rootElement.lang.monitor_diskNoExist + ")";
        }
    } else if (status == 1) {
        data.info = disk + "(" + rootElement.lang.monitor_diskNormal + ")";
    }
    return data;
}

//解析UAE硬盘3和硬盘4的状态
/*--  sensor1  = Disk3Status 硬盘3状态 0无效，1存在，2不存在
--  sensor2  = Disk3Type 硬盘3类型 1sd，2hd, 3ssd
--  sensor3  = Disk4Status 硬盘4状态 0无效，1存在，2不存在
--  sensor4  = Disk4Type 硬盘4类型 1sd，2hd, 3ssd
*/
standardStatus.prototype.getUAEDiskStatus = function () {
    var ret = {};
    var alarm = [];
    var normal = [];
    //硬盘3
    if (this.sensor1 != 0) {//硬盘3有效才判断
        var diskName = this.getDiskTypeString(this.sensor2) + '3';
        var diskInfo = this.gpsGetUAEDiskStatus(this.sensor1, diskName, true);
        if (diskInfo.isAlarm) {
            alarm.push(diskInfo.info);
        } else {
            normal.push(diskInfo.info);
        }
    }
    //硬盘4
    if (this.sensor3 != 0) {//硬盘4有效才判断
        var diskName = this.getDiskTypeString(this.sensor4) + '4';
        var diskInfo = this.gpsGetUAEDiskStatus(this.sensor3, diskName, true);
        if (diskInfo.isAlarm) {
            alarm.push(diskInfo.info);
        } else {
            normal.push(diskInfo.info);
        }
    }
    ret.alarm = alarm.toString();
    ret.normal = normal.toString();
    return ret;
}

//获取硬盘状态
//科瑞通定制 全是sd卡
standardStatus.prototype.getDiskStatus = function () {
    var ret = {};
    var alarm = [];
    var normal = [];
    if (this.status1 != null && (((this.status1 >> 31) & 1) == 0)) {
        var diskName = this.getDiskTypeStr();
        //8、9位表示硬盘状态
        var disk1Status = (this.status1 >> 8) & 3;// bDisk1Normal 正常
        //28位表示盘符2状态	1表示有效
        //29、30位表示，硬盘2的状态		0不存在，1存在，2断电
        var diskAlarm = false;
        var disk2Valid = (this.status1 >> 28) & 1;
        if (disk2Valid > 0) {//硬盘2有效
            var disk2Status = (this.status1 >> 29) & 3;//bDisk2Normal 1 正常
            //如果是硬盘机，只要硬盘不存在就报警
            if (this.getDiskType() == 2) {
                if (disk1Status != 1) {
                    if (this.isAlarmShield('39') && this.isAlarmShield('40')) {
                        diskAlarm = false;
                    } else {
                        diskAlarm = true;
                    }
                }
            }
            //如果是卡机，两个sd卡
//			if(dev.getDiskType() == 1) {
//				if (disk1Status != 1 || disk2Status != 1) {
//					//如果硬盘状态有效，两个硬盘的卡，只要一个卡不存在就报警
//					diskAlarm = true;
//				}
//			}
            if (!diskAlarm) {
                if (disk1Status != 1 && disk2Status != 1) {
                    //如果硬盘状态有效，两个硬盘的卡，只要一个卡有效，则表示为正常状态
                    if (this.isAlarmShield('39') && this.isAlarmShield('40')) {
                        diskAlarm = false;
                    } else {
                        diskAlarm = true;
                    }
                }
            }
            var disk1Name = rootElement.lang.monitor_disk1;
            if (this.getDiskType() == 2) {
                disk1Name = rootElement.lang.alarm_gps_disk;
            }
            if (this.getDiskType() != 2) {
                //科瑞通固定两个硬盘 硬盘1 SD
                if (rootElement.myUserRole && rootElement.myUserRole.isShieldReport()) {
                    disk1Name = "SD ";
                } else {
                    disk1Name = diskName + '1 ';
                }
            }
            var diskInfo = this.gpsGetDiskStatus(disk1Status, disk1Name, diskAlarm);
            if (diskInfo.isAlarm && !this.isAlarmShield('39')) {
                alarm.push(diskInfo.info);
            } else {
                normal.push(diskInfo.info);
            }

            var disk2Name = rootElement.lang.monitor_disk2;
            //硬盘机的硬盘2状态为SD卡状态
            if (this.getDiskType() == 2) {
                disk2Name = rootElement.lang.alarm_gps_sd;
            }
            if (this.getDiskType() != 2) {
                //科瑞通固定两个硬盘 硬盘1 SD
                if (rootElement.myUserRole && rootElement.myUserRole.isShieldReport()) {
                    disk2Name = "HDD ";
                } else {
                    disk2Name = diskName + '2 ';
                }
            }
            diskInfo = this.gpsGetDiskStatus(disk2Status, disk2Name, diskAlarm);
            if (diskInfo.isAlarm && !this.isAlarmShield('40')) {
                alarm.push(diskInfo.info);
            } else {
                normal.push(diskInfo.info);
            }
        } else {
            if (this.isAlarmShield('39')) {
                diskAlarm = false;
            } else {
                diskAlarm = true;
            }
            var diskInfo = this.gpsGetDiskStatus(disk1Status, diskName, diskAlarm);
            if (diskInfo.isAlarm) {
                alarm.push(diskInfo.info);
            } else {
                normal.push(diskInfo.info);
            }
        }
        //解析硬盘3和硬盘4的状态
        if (this.isExtraFlagUAE()) {//UAE校车版本
            var diskInfo = this.getUAEDiskStatus();
            if (diskInfo.alarm && diskInfo.alarm != '') {
                alarm.push(diskInfo.alarm);
            }
            if (diskInfo.normal && diskInfo.normal != '') {
                normal.push(diskInfo.normal);
            }
        }
    }

    ret.alarm = alarm.toString();
    ret.normal = normal.toString();
    return ret;
}

//获取3G模块状态
standardStatus.prototype.get3GStatus = function () {
    var ret = {};
    ret.alarm = '';
    ret.normal = '';
    if (this.status1 != null) {
        //10、11、12位表示3G模块状态
        var temp = (this.status1 >> 10) & 7;
        if (temp === 0) {
//			if(this.isAlarmShield('166,167')) {
//				ret.normal =  rootElement.lang.monitor_3gSimNoExist;	//SIM卡不存在
//			}else {
//				ret.alarm =  rootElement.lang.monitor_3gSimNoExist;	//SIM卡不存在
//			}
        } else if (temp == 1) {
            ret.normal = rootElement.lang.monitor_3gWeak;		//3G信号弱
        } else if (temp == 2) {
            ret.normal = rootElement.lang.monitor_3gPoor;		//3G信号差
        } else if (temp == 3) {
            ret.normal = rootElement.lang.monitor_3gNormal;	//3G信号一般
        } else if (temp == 4) {
            ret.normal = rootElement.lang.monitor_3gGood;		//3G信号好
        } else if (temp == 5) {
            ret.normal = rootElement.lang.monitor_3gExcellent;	//3G信号优
        } else if (temp == 6) {// 101
            ret.normal = rootElement.lang.monitor_3gNoExist;	//3g模块不存在
        } else if (temp == 7) {
            ret.normal = rootElement.lang.monitor_3gClose;	//3G模块关闭
        }
    }
    return ret;
};


//设备是否超速
standardStatus.prototype.isOverSpeed = function () {
    //14处于超速状态
    if (this.status1 != null) {
        var temp = (this.status1 >> 14) & 1;
        if (temp > 0) {
            return true;
        }
    }
    return false;
};

//设备是否低速
standardStatus.prototype.isLowSpeed = function () {
    //16处于低速状态
    if (this.status1 != null) {
        var temp = (this.status1 >> 16) & 1;
        if (temp > 0) {
            return true;
        }
    }
    return false;
};

//设备本日流量是否受限  1
standardStatus.prototype.isFlowDayLimit = function () {
    //17位表示本日流量已经受限		1表示受限
    //var temp = (this.status1>>17)&1;
    //status2 9 位表示日流量超过
    var temp = (this.status2 >> 9) & 1;
    if (temp > 0) {
        return true;
    } else {
        return false;
    }
};

////设备本月流量已经超过90%警界  1
//standardStatus.prototype.isFlowMonthAlarm = function(){
//	//18位表示本月流量已经超过90%警界	1表示报警
//	var temp = (this.status1>>18)&1;
//	if(temp > 0) {
//		return true;
//	} else {
//		return false;
//	}
//};


//设备本月流量已经用完  1
standardStatus.prototype.isFlowMonthLimit = function () {
    //19位表示本月流量已经用完		1表示用完
    //var temp = (this.status1>>19)&1;
    //status2 11 位表示月流量超过
    var temp = (this.status2 >> 11) & 1;
    if (temp > 0) {
        return true;
    } else {
        return false;
    }
};
/**
 * 获取报警通道 并根据通道和设备匹配才显示
 * @param device
 * @param params
 * @returns {Array}
 */
standardStatus.prototype.getExtraAlarmChn = function (device, params) {
    var chnNames = [];
    var isCheckedVersion = enable808CheckVesion instanceof Function && enable808CheckVesion();
    var chnCount = null;
    var chnName = null;
    if (isCheckedVersion) {
        chnCount = 32;
        var chnNames = [];
        for (var i = 0; i < 32; i++) {
            chnNames.push("CH" + (i + 1));
        }
        chnName = chnNames.join(",");
    } else {
        if (device) {
            chnCount = device.getChnCount();
            chnName = device.getChnName();
        }
    }
    if (params) {
        if (chnName != null) {
            chnName = chnName.split(",");
            for (var i = 0; i < chnCount; i++) {
                if ((params >> i) & 1 > 0) {
                    chnNames.push(chnName[i]);
                }
            }
        }
    }
    return chnNames;
}
/**
 * 存储器异常的位置
 * @param device
 * @param params
 * @returns {Array}
 */
//存储器掩码 按位 BIT0-BIT11：1-12主存储器 BIT12-BIT15：1-4灾备存储， 相应为1表示故障
standardStatus.prototype.getExtraAlarmStorage = function (params) {
    var mNum = [];//主存储
    var sNum = [];//灾备
    if (params) {
        for (var i = 0; i < 16; i++) {
            if (i < 12) {//第2位
                if ((params >> i) & 1 > 0) {
                    mNum.push((i + 1));
                }
            } else {
                if ((params >> i) & 1 > 0) {
                    sNum.push((i + 1 - 12));
                }
            }
        }
    }
    return {ps: mNum, drs: sNum}
}

//异常驾驶行为信息
standardStatus.prototype.getAbnormalDrivingInfo = function (alarm) {
    var types = [];
    if (alarm.param1) {
        if ((alarm.param1) & 1 > 0) {//疲劳驾驶
            var cd = 0;
            if (alarm.param2) {
                cd = alarm.param2;
            }
            types.push(rootElement.lang.fatigue_driving + ':' + cd);
        }
        if ((alarm.param1 >> 1) & 1 > 0) {//打电话
            types.push(rootElement.lang.on_the_telephone);
        }
        if ((alarm.param1 >> 2) & 1 > 0) {//抽烟
            types.push(rootElement.lang.smoking);
        }
        if ((alarm.param1 >> 10) & 1 > 0) {//车道偏移预警431
            types.push(rootElement.lang.lane_offset_warning);
        }
    }
    if (alarm.param3) {
        if ((alarm.param3 >> 3) & 1 > 0) {
            types.push(rootElement.lang.adas_slam_brake);
        }
        if ((alarm.param3 >> 10) & 1 > 0) {
            types.push(rootElement.lang.alarm_type_motion);
        }
        if ((alarm.param3 >> 11) & 1 > 0) {
            types.push(rootElement.lang.alarm_name_446_default);
        }
        if ((alarm.param3 >> 12) & 1 > 0) {
            types.push(rootElement.lang.alarm_name_447_default);
        }
    }
    return types;
}

// 存储单元故障报警
standardStatus.prototype.getStorageAlarmExtra = function (device) {
    var ret = {};
    var normal = [];
    var alarm = [];
    if (this.status2 != null) {
        //存储单元故障报警
        if ((this.status2 >> 2) & 1 > 0) {
            var strDesc = "";
            if (this.isExtraFlagVideo() || this.isExtraFlagSB()) {
                var info_ = this.getExtraAlarmStorage(this.sensor3);
                var mNum = info_.ps;
                if (mNum.length > 0) {
                    strDesc += "(";
                    strDesc += rootElement.lang.disk_primary_storage + mNum.toString();
                }
                var sNum = info_.drs;
                if (sNum.length > 0) {
                    if (strDesc != '') {
                        strDesc += ",";
                    } else {
                        strDesc += "(";
                    }
                    strDesc += rootElement.lang.disk_disaster_recovery + sNum.toString();
                }
                if (strDesc != '') {
                    strDesc += ")";
                }

            }
            if (this.isAlarmShield('10,60')) {
                normal.push(rootElement.lang.alarm_type_memory_cell_fault + strDesc);
            } else {
                alarm.push(rootElement.lang.alarm_type_memory_cell_fault + strDesc);
            }
        }
    }
    ret.alarm = alarm.toString();
    ret.normal = normal.toString();
    return ret;
}

//获取设备区域报警(电子围栏)
standardStatus.prototype.getMapFenceStatus = function (device) {
    var ret = {};
    var normal = [];
    var alarm = [];
    if (this.status2 != null) {
        //视频信号丢失报警
        if (this.status2 & 0x01 > 0) {
            //如果是1078传了通道的需要判断通道和设备是否能对上
            var str_ = rootElement.lang.alarm_type_video_signal_loss;
            if (this.isExtraFlagVideo() || this.isExtraFlagSB()) {
                var chns = [];
                var chnCount = device.getChnCount();
                for (var i = 0; i < chnCount; i++) {
                    if ((this.sensor1 >> i) & 1 > 0) {
                        chns.push(rootElement.lang.chnName + (i + 1));
                    }
                }
                if (chns && chns.length > 0) {
                    str_ += "(" + chns.join(",") + ")";
                }
            }
            if (str_) {
                if (this.isAlarmShield('4,54')) {
                    normal.push(str_);
                } else {
                    alarm.push(str_);
                }
            }
        }
        ;
        //视频信号遮挡报警
        if ((this.status2 >> 1) & 1 > 0) {
            var str_ = rootElement.lang.alarm_type_video_signal_blocking;
            if (this.isExtraFlagVideo() || this.isExtraFlagSB()) {
                var chns = this.getExtraAlarmChn(device, this.sensor2);
                if (chns && chns.length > 0) {
                    str_ += "(" + chns.join(",") + ")";
                }
            }
            if (str_) {
                if (this.isAlarmShield('5,55')) {
                    normal.push(str_);
                } else {
                    alarm.push(str_);
                }
            }
        }
        ;
        //存储单元故障报警
        if ((this.status2 >> 2) & 1 > 0) {
            var strDesc = "";
            if (this.isExtraFlagVideo() || this.isExtraFlagSB()) {
                var info_ = this.getExtraAlarmStorage(this.sensor3);
                var mNum = info_.ps;
                if (mNum.length > 0) {
                    strDesc += "(";
                    strDesc += rootElement.lang.disk_primary_storage + mNum.toString();
                }
                var sNum = info_.drs;
                if (sNum.length > 0) {
                    if (strDesc != '') {
                        strDesc += ",";
                    } else {
                        strDesc += "(";
                    }
                    strDesc += rootElement.lang.disk_disaster_recovery + sNum.toString();
                }
                if (strDesc != '') {
                    strDesc += ")";
                }

            }
            if (this.isAlarmShield('10,60')) {
                normal.push(rootElement.lang.alarm_type_memory_cell_fault + strDesc);
            } else {
                alarm.push(rootElement.lang.alarm_type_memory_cell_fault + strDesc);
            }
        }
        ;
        //其他视频设备故障报警
        if (((this.status2 >> 3) & 1 > 0)) {
            if (this.isAlarmShield("244,294")) {
                normal.push(rootElement.lang.alarm_type_other_video_device_fault);
            } else {
                alarm.push(rootElement.lang.alarm_type_other_video_device_fault);
            }
        }
        ;
        //异常驾驶行为报警
        if ((this.status2 >> 4) & 1 > 0) {
            var tired_ = "";
            if (this.isExtraFlagVideo()) {
                var abnormalDrivingInfo = this.getAbnormalDrivingInfo({
                    param1: this.sensor4,
                    param2: this.sensor5,
                    param3: this.sensor6
                })
                if (abnormalDrivingInfo && abnormalDrivingInfo.length > 0) {
                    tired_ = "(" + abnormalDrivingInfo.join(",") + ")";
                }
            }
            if (this.isAlarmShield("248,298")) {
                normal.push(rootElement.lang.alarm_type_abnormal_driving_behavior + tired_);
            } else {
                alarm.push(rootElement.lang.alarm_type_abnormal_driving_behavior + tired_);
            }
        }
        ;
        //特殊报警，录像达到存阈值报警
        if (((this.status2 >> 5) & 1 > 0)) {
            if (this.isAlarmShield("245,295")) {
                normal.push(rootElement.lang.special_alarm_type_video_to_storage_threshold);
            } else {
                alarm.push(rootElement.lang.special_alarm_type_video_to_storage_threshold);
            }
        }
        ;
    }
    ret.alarm = alarm.toString();
    ret.normal = normal.toString();
    return ret;
}

//获取设备使用流量状态
standardStatus.prototype.getFormatFlowStatus = function () {
    var ret = {};
    var normal = [];
    var alarm = [];

    if (this.status2 != null) {
//		alert(this.network);//if(this.network == 0 || this.network == 3){
//3G状态 /4G状态 才限制视频查看等功能
        //日流量预警
        if ((this.status2 >> 8) & 1 > 0) {
            normal.push(rootElement.lang.alarm_type_flowDay_remind);
        }
        ;
        //日流量超过
        if ((this.status2 >> 9) & 1 > 0) {
            alarm.push(rootElement.lang.alarm_type_flowDay_over);
        }
        ;
        //月流量预警
        if ((this.status2 >> 10) & 1 > 0) {
            normal.push(rootElement.lang.alarm_type_flowMonth_remind);
        }
        ;
        //月流量超过
        if ((this.status2 >> 11) & 1 > 0) {
            alarm.push(rootElement.lang.alarm_type_flowMonth_over);
        }
        ;
    }
    ret.alarm = alarm.toString();
    ret.normal = normal.toString();
    return ret;
};

//环卫车（平台产生）12位作业状态 1作业中 0空闲
standardStatus.prototype.getSanitationWorkStatus = function () {
    if (this.status2 != null) {
        return (this.status2 >> 12) & 1;
    }
    return 0;
};

//环卫车（平台产生）14,15,16位已作业次数
standardStatus.prototype.getSanitationWorkNumber = function () {
    if (this.status2 != null) {
        var x1 = (this.status2 >> 14) & 1;
        var x2 = (this.status2 >> 15) & 1;
        var x3 = (this.status2 >> 16) & 1;
        var work = parseInt(x3.toString() + x2.toString() + x1.toString(), 2);
        return work;
    }
    return 0;
};

//环卫车（平台产生）12位作业状态 1作业中 0空闲
standardStatus.prototype.getSanitationWorkStatusStr = function () {
    /*var number = this.getSanitationWorkNumber(); //已作业次数
	if(this.getSanitationWorkStatus()) { //作业中
		return "执行第"+number+'遍';
	}else {//空闲
		if(number) {
			return "完成第"+ number +'遍';
		}else {
			return '未执行';
		}
	}*/
    if (this.getSanitationWorkStatus()) {
        return '执行中';
    } else {
        return '未执行';
    }
};


//环卫车（平台产生）13位高峰作业 1高峰作业
standardStatus.prototype.getPeakWorkStatus = function () {
    if (this.status2 != null) {
        if ((this.status2 >> 13) & 1 > 0) {
            return '高峰作业';
        }
        ;
    }
    return '';
};


//电池状态
standardStatus.prototype.getCarBatteryStatus = function () {
    //15 电池电压过低     16电池坏
    return "";
    //2019-07-16 ldc不解析电池状态
//	if(this.status2 != null) {
//		if((this.status2>>15)&1 > 0) {
//			if(this.isPeopleTerminal()){ //人员设备
//				return  rootElement.lang.alarm_low_battery_voltage;
//			}else{
//                return  rootElement.lang.alarm_type_low_battery_voltage;
//			}
//		}else if((this.status2>>16)&1 > 0) {
//			return  rootElement.lang.alarm_type_battery_bad;
//		};
//	}
//	return '';
};


//运营状态（808）
standardStatus.prototype.getRunStatus = function (isCheckedVersion) {
    if (this.status2 != null && this.isJT808Protocol()) {
        if (((this.status2 >> 20) & 1 > 0)) {
            return rootElement.lang.alarm_type_stop_status;//停运
        } else {
            if (isCheckedVersion) {
                return rootElement.lang.alarm_type_run_status;//运营
            }
        }
    }
    return '';
}

//经纬度未加密；1：已加密(808)
standardStatus.prototype.getEncipherStatus = function (isCheckedVersion) {
    if (this.status2 != null && this.isJT808Protocol()) {
        if (((this.status2 >> 21) & 1 > 0)) {
            return rootElement.lang.alarm_type_encipher;
        } else {
            if (isCheckedVersion) {
                return rootElement.lang.alarm_type_not_encipher;
            }
        }
    }
    return '';
}

//22：油路正常，1：油路断开(808)
standardStatus.prototype.getOilStatus = function (isCheckedVersion) {
    if (this.status2 != null && this.isJT808Protocol()) {
        if (((this.status2 >> 22) & 1 > 0)) {
            return rootElement.lang.alarm_type_oil_off;
        } else {
            if (isCheckedVersion) {
                return rootElement.lang.alarm_type_oil_normal;
            }
        }
    }
    return '';
}

standardStatus.prototype.getObdStatus = function () {
    var str = '';
    // 地图冒泡信息都不显示obd的状态
    return str;


    /************遗弃代码**************/
    var isAnalysis = false;
    if (this.isExtraFlagZero() || this.isExtraFlagUAE()) {
        isAnalysis = true;
    }
    if (!isAnalysis) {
        return str;
    }
//	str.Format(_T("%s(%0.2f V), %s(%d %s), %s(%0.2f rpm), %s(%s), %s(%0.2f%%)")
//	电池电压   //燃油进气温度 //发动机转速 //速度 //节气门位置
    if (this.obdVotage != null) {
        str += rootElement.lang.battery_voltage_none + "(" + (this.obdVotage / 10.0).toFixed(2) + ' V)';
    }
    if (this.obdJQTemp != null) {
        str += "," + rootElement.lang.intake_air_temperature_none + "(" + this.obdJQTemp + ' ℃)';
    }
    if (this.obdRpm != null) {
        str += "," + rootElement.lang.rotating_speed_none + "(" + this.obdRpm.toFixed(2) + ' rpm)';
    }
    if (this.obdSpeed != null) {
        str += "," + rootElement.lang.report_speed + "(" + (this.obdSpeed).toFixed(2) + " Km/h)";
    }
    if (this.obdJQMPos != null) {
        str += "," + rootElement.lang.valve_position_none + "(" + (this.obdJQMPos / 10.0).toFixed(2) + ' %)';
    }

    if (this.obdStatus & 1 > 0) {
        str += ", ACC:" + rootElement.lang.open;
    } else {
        str += ", ACC:" + rootElement.lang.report_close;
    }
    //离合器
    if ((this.obdStatus >> 1) & 1 > 0) {
        str += ", " + rootElement.lang.clutch + ":" + rootElement.lang.open;
    } else {
        str += ", " + rootElement.lang.clutch + ":" + rootElement.lang.report_close;
    }
    if ((this.obdStatus >> 2) & 1 > 0) {
        str += ", " + rootElement.lang.brake + ":" + rootElement.lang.open;
    } else {
        str += ", " + rootElement.lang.brake + ":" + rootElement.lang.report_close;
    }
    if ((this.obdStatus >> 3) & 1 > 0) {
        str += ", PTO:" + rootElement.lang.open;
    } else {
        str += ", PTO:" + rootElement.lang.report_close;
    }
    if ((this.obdStatus >> 4) & 1 > 0) {
        str += ", " + rootElement.lang.emergency_brake;
    }
    return str;
}

standardStatus.prototype.getCountPeopele = function () {
    var peopleCur = null;
    if (this.isExtraFlagZero() || this.isExtraFlagUAE()) {
        peopleCur = this.peopleCur;
    } else if (this.isTaxi905Protocol()) {
        //  unsigned int uiTaxiStatus : 24;    //状态位
        //0位:0：未预约；1：预约(任务车)
        //1位:0：默认；1：空转重
        //2位:0：默认；1：重转空
        //3位:0：空车；1：重车
        //4位:0：车辆未锁定；1：车辆锁定
        //5位:0：未到达限制营运次数/时间；1：已达到限制营运次数/时间
        //6位:0 计程计价装置未锁；1：计程计价装置被锁定
        //unsigned int uiPeopleCur : 8;        //当前车内人数
//		track.setSensor4(temp);
        //21位:为1表示当前车内人数有效
        //22位:为1表示存储设备状态有效
        //23位:为1表示摄像头状态有效
        if (this.sensor4 && Number(this.sensor4)) {
            if ((Number(this.sensor4) >> 21 & 1) == 1) {
                peopleCur = (Number(this.sensor4) >> 24) & 0xFF;
            }
        }
    }

    if (this.isExtraFlagVideo()) {
        if ((this.sensor6 >> 14) & 1 > 0) {
            peopleCur = this.sensor7;
        }
    }
    return peopleCur;
}


/**
 * 当天运行信息统计
 * @param type  1 累计超速次数 2 累计停车次数 3  累计停车时长 4 行车时长  5累计当天驾驶时长
 */
standardStatus.prototype.getDayRunningInfo = function (type) {
    if (this.isDayRunningInfoProtocol()) {
        // Sensor1=1028(0-9位表示累计超速次数,10-19表示累计停车次数)
        // Sensor2=891(0-16位表示累计停车时长)
        // Sensor3=70(0-16位表示行车时长)
        // Sensor4=1179(0-16位表示累计当天驾驶时长)
        if (type == 1) {
            return (this.sensor1 >> 0) & 0x3FF;
        }
        if (type == 2) {
            return (this.sensor1 >> 10) & 0x3FF;
        }
        if (type == 3) {
            return (this.sensor2 >> 0) & 0x1FFFF;
        }
        if (type == 4) {
            return (this.sensor3 >> 0) & 0x1FFFF;
        }
        if (type == 5) {
            return (this.sensor4 >> 0) & 0x1FFFF;
        }
    }
    if (this.isLongStatusDayRunningInfoProtocol()) {
        /* `00 00 [05 08 00 00][68 01 00 00][A4 01 00 00][A4 01 00 00] 00000000 00000000 00000000
         数据小端序,如[12 34 56 78] 等于 0x 78 56 34 12 [05 08 00 00]等于0x 00 00 08 05
         [05 08 00 00] 数据1 0-9位表示累计超速次数(=5) 10-19表示累计停车次数(=2) 20-31预留
         [68 01 00 00] 数据2 0-17位表示累计停车时长(=360秒) 18-31预留
         [A4 01 00 00] 数据3 0-17位表示行车时长(=420秒) 18-31预留
         [A4 01 00 00] 数据4 0-17位表示累计当天驾驶时长(=420秒) 18-31预留*/
        var tireSize = parseInt(this.tirePpressures.length / 2);
        var tire_ = [];
        if (tireSize > 0) {
            for (var int = 0; int < tireSize; int++) {
                // 从左往右截取的
                tire_.push(this.tirePpressures.slice(int * 2, int * 2 + 2));
            }
            // 不足30追加
            while (tire_.length < 30) {
                tire_.push("00");
            }
        }
        if (tire_.length > 18) {
            // 累计超速次数
            if (type == 1) {
                var number = ("0x" + tire_[5] + "" + tire_[4] + "" + tire_[3] + "" + tire_[2]) >> 0;
                return (number >> 0) & 0x3FF;
            }
            // 累计停车次数
            if (type == 2) {
                var number = ("0x" + tire_[5] + "" + tire_[4] + "" + tire_[3] + "" + tire_[2]) >> 0;
                return (number >> 10) & 0x3FF;
            }
            // 累计停车时长
            if (type == 3) {
                var number = ("0x" + tire_[9] + "" + tire_[8] + "" + tire_[7] + "" + tire_[6]) >> 0;
                return (number >> 0) & 0x1FFFF;
            }
            // 行车时长
            if (type == 4) {
                var number = ("0x" + tire_[13] + "" + tire_[12] + "" + tire_[11] + "" + tire_[10]) >> 0;
                return (number >> 0) & 0x1FFFF;
            }
            // 累计当天驾驶时长
            if (type == 5) {
                var number = ("0x" + tire_[17] + "" + tire_[16] + "" + tire_[15] + "" + tire_[14]) >> 0;
                return (number >> 0) & 0x1FFFF;
            }
        }
    }
    return "0";
}


//23：电路正常，1：电路断开(808)
standardStatus.prototype.getElectricStatus = function (isCheckedVersion) {
    if (this.status2 != null && this.isJT808Protocol()) {
        if (((this.status2 >> 23) & 1 > 0)) {
            return rootElement.lang.alarm_type_electric_off;
        } else {
            if (isCheckedVersion) {
                return rootElement.lang.alarm_type_electric_normal;
            }
        }
    }
    return '';
}
//24：车门解锁，1：车门加锁(808)
standardStatus.prototype.getDoorStatus = function (isCheckedVersion) {
    // 门开关状态
    // 过检版本显示门开和门关
    // 通用版本只显示门开
    if (this.status2 != null && this.isJT808Protocol()) {
        //车门解锁才显示
        if ((((this.status2 >> 24) & 1) == 0)) {
            return rootElement.lang.alarm_type_unlock;
        } else {
            if (isCheckedVersion) {
                return rootElement.lang.alarm_type_lock;
            }
        }
    }
    return '';
}

// 车门状态
standardStatus.prototype.getDoorOpenStatus = function () {
    // 门开关状态
    // 过检版本显示门开和门关
    // 通用版本只显示门开
    if (this.status2 != null && this.isJT808Protocol()) {
        //车门解锁才显示
        if ((((this.status2 >> 24) & 1) == 0)) {
            var content = [];
            if (((this.status3 >> 21) & 1 > 0)) {
                content.push(rootElement.lang.open_door_front);
            }
            if (((this.status3 >> 22) & 1 > 0)) {
                content.push(rootElement.lang.open_door_middle);
            }
            if (((this.status3 >> 23) & 1 > 0)) {
                content.push(rootElement.lang.open_door_back);
            }
            if (((this.status3 >> 24) & 1 > 0)) {
                content.push(rootElement.lang.open_door_driver);
            }
            if (((this.status3 >> 25) & 1 > 0)) {
                content.push(rootElement.lang.open_door_customize);
            }
            if (content.length > 0) {
                return content.join(",");
            }
        }
    }
    return '';
}


//获取报警的IO名称
//uiStatus[0]
//20位表示IO1状态    1表示报警
//21位表示IO2状态    1表示报警
//22位表示IO3状态    1表示报警
//23位表示IO4状态    1表示报警
//24位表示IO5状态    1表示报警
//25位表示IO6状态    1表示报警
//26位表示IO7状态    1表示报警
//27位表示IO8状态    1表示报警
//uiStatus[2]
//16-23表示IO输入9-16 状态
//24-27表示IO输出1-4 状态

standardStatus.prototype.getIOAlarmName = function (device) {
    if (device == null) {
        return;
    }
    var ioInCount = device.getIoInCount();
    var ioInName = device.getIoInName();
    if (ioInName != null) {
        ioInName = ioInName.split(",");
    }
    // 2020年8月11日10:49:40
    // io名称：命名规则：1. N;xxx (普通)  或者  2. xxx (报警)
    // 解析：报警屏蔽 (普通)  > 命名规则
    var ret = {};
    var normal = [];
    var alarm = [];
    for (var i = 0; i < ioInCount; i++) {

        var ioName = ioInName[i];
        var isNormal = false;
        if (ioName.split(";").length > 1 && (ioName.split(";")[0] == 'N' || ioName.split(";")[0] == 'n')) {
            isNormal = true;
            ioName = ioName.split(";")[1];
        }
        if (i < 8) {//0-7   20-27
            var sk = 19 + i, ek = 69 + i;
            if ((this.status1 >> (20 + i)) & 1 > 0) {
                //国标需要重新定义解析 26 27
                if (this.isGuoBiao()
                    && ((20 + i) == 26 || (20 + i) == 27)) {
                } else {
                    if (this.isAlarmShield('' + sk + ',' + ek + '')) {
                        normal.push(ioName);
                    } else {
                        if (isNormal) {
                            normal.push(ioName);
                        } else {
                            alarm.push(ioName);
                        }
                    }
                }
            }
        } else if (i < 16) {//8-15    20-27
            var sk = 33 + i, ek = 83 + i;
            if ((this.status3 >> (20 + i - 8)) & 1 > 0) {
                if (this.isGuoBiao()) {

                } else {
                    if (this.isAlarmShield('' + sk + ',' + ek + '')) {
                        normal.push(ioName);
                    } else {
                        if (isNormal) {
                            normal.push(ioName);
                        } else {
                            alarm.push(ioName);
                        }
                    }
                }
            }
        }
    }
    ret.normal = normal.toString();
    ret.alarm = alarm.toString();
    return ret;
}

//获取IO的状态
standardStatus.prototype.getIOStatus = function (device) {
    var ret = {};
    var normal = '', alarm = '';
    if (device == null) {
        return;
    }
    var ioStatus = this.getIOAlarmName(device);
    if (ioStatus.normal != '') {
        normal = /* rootElement.lang.alarm_type_io_high + '：' + */ioStatus.normal;
    }
    if (ioStatus.alarm != '') {
        alarm = /* getRootFrameElement().lang.alarm_type_io_high + '：' + */ ioStatus.alarm;
    }
    //4个输出 24-27保留
    ret.normal = normal;
    ret.alarm = alarm;
    return ret;
};

//获取视频丢失状态 0-7
standardStatus.prototype.getVideoLostStatus = function (device) {
    var chnCount = device.getChnCount() > 8 ? 8 : device.getChnCount();
    var chnName = device.getChnName();
    var ret = {};
    ret.normal = '';
    ret.alarm = '';
    var alarm = [];
    for (var i = 0; i < chnCount; i++) {
        if ((this.status3 >> i) & 1 > 0) {
            alarm.push(device.getSingleChnName(i));
        }
    }
    var str = '';
    if (alarm.length > 0) {
        str = /*'<span class="b">' +  rootElement.lang.alarm_type_video_lost_status + '：</span>' + */alarm.toString();
    }
//	if(this.isAlarmShield('4,54')) {
    ret.normal = str;
//	}else {
//		ret.alarm = str;
//	}
    return ret;
}

//uiStatus[1]
//14,通道是否判断录像状态
//uiStatus[2]
//8-15表示通道录像状态
standardStatus.prototype.getRecordStatus = function (device) {
    var chnCount = device.getChnCount() > 8 ? 8 : device.getChnCount();
    var chnName = device.getChnName();
    var ret = {};
    ret.normal = '';
    ret.alarm = '';
    var alarm = [];
    var normal = [];
    for (var i = 0; i < chnCount; i++) {
        if (((this.status2 >> 14) & 1) > 0) {
            if (((this.status3 >> (8 + i)) & 1) > 0) {
                normal.push(device.getSingleChnName(i));
            } else {
                alarm.push(device.getSingleChnName(i));
            }
        }
    }
    if (alarm.length > 0) {
        ret.alarm = alarm.toString();
    }
    if (normal.length > 0) {
        ret.normal = normal.toString();
    }
    return ret;
}

//解析报警状态
standardStatus.prototype.getAlarmStatus = function () {
    var ret = {};
    var normal = [];
    var alarm = [];
    var alarmType = [];
    if (this.isGuoBiao() && !this.isPeopleTerminal()) {
        if (this.status1 != null) {
            if ((this.status1 >> 26) & 1 > 0) {//车道偏移预警(431)
                if (this.isAlarmShield('431,481')) {
                    normal.push(rootElement.lang.lane_offset_warning);
                } else {
                    alarm.push(rootElement.lang.lane_offset_warning);
                }
            }
            if ((this.status1 >> 27) & 1 > 0) {//胎压预警(432)
                if (this.isAlarmShield('432,482')) {
                    normal.push(rootElement.lang.tire_warning);
                } else {
                    alarm.push(rootElement.lang.tire_warning);
                }
            }
        }
    }
    if (!this.isPeopleTerminal()) {
        //急加速: 1-急加速
        var rapidAcceleration_ = this.getRapidAcceleration();
        if (rapidAcceleration_.normal != '') {
            normal.push(rapidAcceleration_.normal);
        }
        if (rapidAcceleration_.alarm != '') {
            alarm.push(rapidAcceleration_.alarm);
        }
        //急减速  1-急减速
        var rapidDeceleration_ = this.getRapidDeceleration();
        if (rapidDeceleration_.normal != '') {
            normal.push(rapidDeceleration_.normal);
        }
        if (rapidDeceleration_.alarm != '') {
            alarm.push(rapidDeceleration_.alarm);
        }
    }

    if (this.status2 != null) {
        //15位--电池电压过低 (808电池欠压)(205)
        //ttx协议: 为人员时，解析为  电池低压报警(无屏蔽报警)
        if ((this.status2 >> 15) & 1 > 0) {
            if (rootElement.myUserRole && rootElement.myUserRole.isPolice()) {
                if (this.isAlarmShield('205,255')) {
                    normal.push(rootElement.lang.alarm_low_battery_voltage);
                } else {
                    alarm.push(rootElement.lang.alarm_low_battery_voltage);
                }
            } else {
                if (this.isAlarmShield('205,255')) {
                    normal.push(rootElement.lang.alarm_type_mainSupplyUndervoltage);
                } else {
                    alarm.push(rootElement.lang.alarm_type_mainSupplyUndervoltage);
                }
            }
        }
        if (!this.isPeopleTerminal()) {
            //终端主电源掉电//16位--电池坏
            if ((this.status2 >> 16) & 1 > 0) {
                if (this.isAlarmShield('206,256')) {
                    normal.push(rootElement.lang.alarm_type_mainPowerFailure);
                } else {
                    alarm.push(rootElement.lang.alarm_type_mainPowerFailure);
                }
            }
            //25：区域超速报警(平台产生)
            if ((this.status2 >> 25) & 1 > 0) {
                if (this.isAlarmShield('300,350')) {
                    normal.push(rootElement.lang.alarm_type_areaOverSpeed_platform);
                } else {
                    alarm.push(rootElement.lang.alarm_type_areaOverSpeed_platform);
                }
            }
            //26：区域低速报警(平台产生)
            if ((this.status2 >> 26) & 1 > 0) {
                if (this.isAlarmShield('301,351')) {
                    normal.push(rootElement.lang.alarm_type_areaLowSpeed_platform);
                } else {
                    alarm.push(rootElement.lang.alarm_type_areaLowSpeed_platform);
                }
            }
            //27：进区域报警(平台产生)
            if ((this.status2 >> 27) & 1 > 0) {
                // s1+27：进区域报警(平台)
                if (this.isAlarmShield('302,352')) {
                    normal.push(rootElement.lang.alarm_type_areaIn_platform);
                } else {
                    alarm.push(rootElement.lang.alarm_type_areaIn_platform);
                }
            }
            //28：线路偏移(平台产生)
            if ((this.status2 >> 28) & 1 > 0) {
                if (this.isAlarmShield('303,353')) {
                    normal.push(rootElement.lang.alarm_type_lineInOut_platform);
                } else {
                    alarm.push(rootElement.lang.alarm_type_lineInOut_platform);
                }
            }
            //29：时间段超速报警(平台产生)
            if ((this.status2 >> 29) & 1 > 0) {
//            if(!(this.status1>>17)&1 >0){  //日间才报时间段
                //29：时间段超速报警(平台产生) (非夜间:304 夜间:314)
                if (this.status1 && ((this.status1 >> 17) & 1) > 0) {
                    if (this.isAlarmShield('314,364')) {
                        normal.push(rootElement.lang.alarm_type_night_overSpeed_platform);
                    } else {
                        alarm.push(rootElement.lang.alarm_type_night_overSpeed_platform);
                    }
                } else {
                    if (this.isAlarmShield('304,354')) {
                        normal.push(rootElement.lang.alarm_type_overSpeed_platform);
                    } else {
                        alarm.push(rootElement.lang.alarm_type_overSpeed_platform);
                    }
                }
            }
            //30：时间段低速报警(平台产生)
            if ((this.status2 >> 30) & 1 > 0) {
                if (this.isAlarmShield('305,355')) {
                    normal.push(rootElement.lang.alarm_type_lowSpeed_platform);
                } else {
                    alarm.push(rootElement.lang.alarm_type_lowSpeed_platform);
                }
            }
            //31：疲劳驾驶(平台产生)
            if ((this.status2 >> 31) & 1 > 0) {
                if (this.isAlarmShield('306,356')) {
                    normal.push(rootElement.lang.alarm_name_306_default);
                } else {
                    alarm.push(rootElement.lang.alarm_name_306_default);
                }
            }
        } else {
            //27：进区域报警(平台产生)
            if ((this.status2 >> 27) & 1 > 0) {
                // s1+27：进区域报警(平台)
                if (this.isAlarmShield('302,352')) {
                    normal.push(rootElement.lang.alarm_type_areaIn_platform);
                } else {
                    alarm.push(rootElement.lang.alarm_type_areaIn_platform);
                }
            }
        }

    }

    //国标协议
    if (this.isGuoBiao() && !this.isPeopleTerminal()) {
        if (this.status3 != null) {
            if ((this.status3 >> 16) & 1 > 0) {//侧翻预警(433)
                if (this.isAlarmShield('433,483')) {
                    normal.push(rootElement.lang.rollover_warning);
                } else {
                    alarm.push(rootElement.lang.rollover_warning);
                }
            }
            if ((this.status3 >> 17) & 1 > 0) {//道路运输证IC卡模块故障(712)
                if (this.isAlarmShield('712,762')) {
                    normal.push(rootElement.lang.module_failure);
                } else {
                    alarm.push(rootElement.lang.module_failure);
                }
            }
            if ((this.status3 >> 18) & 1 > 0) {//违规行驶(713)
                if (this.isAlarmShield('713,763')) {
                    normal.push(rootElement.lang.driving_violations);
                } else {
                    alarm.push(rootElement.lang.driving_violations);
                }
            }
            if ((this.status3 >> 19) & 1 > 0) {//右转盲区异常报警(714)
                if (this.isAlarmShield('714,764')) {
                    normal.push(rootElement.lang.turn_blind_zone);
                } else {
                    alarm.push(rootElement.lang.turn_blind_zone);
                }
            }
        }
        if (this.status4 != null) {
            if ((this.status4) & 1 > 0) {//超速预警(428)
                if (this.isAlarmShield('428,478')) {
                    normal.push(rootElement.lang.over_speed_warning);
                } else {
                    alarm.push(rootElement.lang.over_speed_warning);
                }
                alarmType.push(428);
            }
            if ((this.status4 >> 1) & 1 > 0) {//疲劳驾驶预警(429)
                if (this.isAlarmShield('429,479')) {
                    normal.push(rootElement.lang.fatigue_warning);
                } else {
                    alarm.push(rootElement.lang.fatigue_warning);
                }
                alarmType.push(429);
            }
            if ((this.status4 >> 2) & 1 > 0) {//前撞预警(430)
                if (this.isAlarmShield('430,480')) {
                    normal.push(rootElement.lang.forward_collosion_warning);
                } else {
                    alarm.push(rootElement.lang.forward_collosion_warning);
                }
            }
        }
    }

    if (this.status4 != null) {
        //0-2表示定位类型	0表示WSG_84（标准的GPS坐标体系），1表示GCJ-02（火星坐标），2表示BD09（百度坐标）
        if ((this.status4 >> 3) & 1 > 0) {//3：紧急报警
            if (this.isAlarmShield('2,52')) {
                normal.push(rootElement.lang.alarm_type_emergency_alarm);
            } else {
                alarm.push(rootElement.lang.alarm_type_emergency_alarm);
            }
        }
        if (!this.isPeopleTerminal()) {
            if ((this.status4 >> 4) & 1 > 0) {  //区域超速报警
                if (this.isAlarmShield('200,250')) {
                    normal.push(rootElement.lang.alarm_type_regionalSpeedingAlarm);
                } else {
                    alarm.push(rootElement.lang.alarm_type_regionalSpeedingAlarm);
                }
            }
            if ((this.status4 >> 5) & 1 > 0) {	//5：疲劳驾驶报警
                if (this.isAlarmShield('49,99')) {
                    normal.push(rootElement.lang.alarm_type_fatigue);
                } else {
                    alarm.push(rootElement.lang.alarm_type_fatigue);
                }
                alarmType.push(49);
            }
            if ((this.status4 >> 6) & 1 > 0) {//6：预警
                if (this.isAlarmShield('201,251')) {
                    normal.push(rootElement.lang.alarm_type_earlyWarning);
                } else {
                    alarm.push(rootElement.lang.alarm_type_earlyWarning);
                }
            }
            //this.status4>>7   this.status4>>12
            var alarmInfo_ = this.getVideoAlarmStatus();
            if (alarmInfo_.normal != '') {
                normal.push(alarmInfo_.normal);
            }
            if (alarmInfo_.alarm != '') {
                alarm.push(alarmInfo_.alarm);
            }
            if ((this.status4 >> 13) & 1 > 0) {	//13：当天累计驾驶超时
                if (this.isAlarmShield('210,260')) { //当天累计驾驶超时
                    normal.push(rootElement.lang.alarm_type_cumulativeDayDrivingTimeout);
                } else {
                    alarm.push(rootElement.lang.alarm_type_cumulativeDayDrivingTimeout);
                }
            }
            if ((this.status4 >> 14) & 1 > 0) {//14：超时停车
                if (this.isAlarmShield('14,64')) {
                    normal.push(rootElement.lang.alarm_type_overtimeParking);
                } else {
                    alarm.push(rootElement.lang.alarm_type_overtimeParking);
                }
            }
        }

        if ((this.status4 >> 15) & 1 > 0) {	//15：进出区域
            if (this.isAlarmShield('211,261')) {
                normal.push(rootElement.lang.alarm_type_outOfRegional);
            } else {
                alarm.push(rootElement.lang.alarm_type_outOfRegional);
            }
            alarmType.push(211);
        }
        if (!this.isPeopleTerminal()) {
            //16：进出路线
            if ((this.status4 >> 16) & 1 > 0) {
                if (this.isAlarmShield('212,262')) {
                    normal.push(rootElement.lang.alarm_type_outOfLine);
                } else {
                    alarm.push(rootElement.lang.alarm_type_outOfLine);
                }
            }
            //17：路段行驶时间不足或过长
            if ((this.status4 >> 17) & 1 > 0) {
                if (this.isAlarmShield('213,263')) {
                    normal.push(rootElement.lang.alarm_type_InadequateOrTooLongRoadTravelTime);
                } else {
                    alarm.push(rootElement.lang.alarm_type_InadequateOrTooLongRoadTravelTime);
                }
            }
            //18：路线偏离报警
            if ((this.status4 >> 18) & 1 > 0) {
                if (this.isAlarmShield('214,264')) {
                    normal.push(rootElement.lang.alarm_type_routeDeviation);
                } else {
                    alarm.push(rootElement.lang.alarm_type_routeDeviation);
                }
            }
            //19：车辆VSS故障
            if ((this.status4 >> 19) & 1 > 0) {
                if (this.isAlarmShield('215,265')) {
                    normal.push(rootElement.lang.alarm_type_VSSFailure);
                } else {
                    alarm.push(rootElement.lang.alarm_type_VSSFailure);
                }
            }
            //20：车辆油量异常  未判断设备是否支持油量传感器
            var fuelAlarmStatus_ = this.getFuelAlarmStatus();
            if (fuelAlarmStatus_.normal != '') {
                normal.push(fuelAlarmStatus_.normal);
            }
            if (fuelAlarmStatus_.alarm != '') {
                alarm.push(fuelAlarmStatus_.alarm);
            }
            //21：车辆被盗
            if ((this.status4 >> 21) & 1 > 0) {
                if (this.isAlarmShield('217,267')) {
                    normal.push(rootElement.lang.alarm_type_antitheftDevice);
                } else {
                    alarm.push(rootElement.lang.alarm_type_antitheftDevice);
                }
            }
            //22：车辆非法点火/非法位移
            if ((this.status4 >> 22) & 1 > 0) {
                if (this.isAlarmShield('8,58')) {
                    normal.push(rootElement.lang.alarm_type_illegalIgnition);
                } else {
                    alarm.push(rootElement.lang.alarm_type_illegalIgnition);
                }
            }
            //23：车辆非法位移
            if ((this.status4 >> 23) & 1 > 0) {
                if (this.isAlarmShield('218,268')) {
                    normal.push(rootElement.lang.alarm_type_illegalDisplacement);
                } else {
                    alarm.push(rootElement.lang.alarm_type_illegalDisplacement);
                }
            }
            //出租车
            //24：碰撞侧翻报警
            if ((this.status4 >> 24) & 1 > 0) {
                if (this.isAlarmShield('219,269')) {
                    normal.push(rootElement.lang.alarm_type_rollover);
                } else {
                    alarm.push(rootElement.lang.alarm_type_rollover);
                }
            }
            //25：超时停车(平台)
            if ((this.status4 >> 25) & 1 > 0) {
                if (this.isAlarmShield('307,357')) {
                    normal.push(rootElement.lang.alarm_type_parkTooLong_platform);
                } else {
                    alarm.push(rootElement.lang.alarm_type_parkTooLong_platform);
                }
            }
            //26：关键点未到达报警
            if ((this.status4 >> 26) & 1 > 0) {
                // s3+26：关键点未到达报警(平台)
                if (this.isAlarmShield('308,358')) {
                    normal.push(rootElement.lang.report_pointNoArrive_platform);
                } else {
                    alarm.push(rootElement.lang.report_pointNoArrive_platform);
                }
            }
            //27：线路超速报警(平台产生)
            if ((this.status4 >> 27) & 1 > 0) {
                if (this.isAlarmShield('309,359')) {
                    normal.push(rootElement.lang.alarm_type_lineOverSpeed_platform);
                } else {
                    alarm.push(rootElement.lang.alarm_type_lineOverSpeed_platform);
                }
            }
            //28：线路低速报警(平台产生)
            if ((this.status4 >> 28) & 1 > 0) {
                if (this.isAlarmShield('310,360')) {
                    normal.push(rootElement.lang.alarm_type_lineLowSpeed_platform);
                } else {
                    alarm.push(rootElement.lang.alarm_type_lineLowSpeed_platform);
                }
            }
            //29：道路超速报警(平台产生)
            if ((this.status4 >> 29) & 1 > 0) {
                if (this.isAlarmShield('311,361')) {
                    normal.push(rootElement.lang.report_roadLvlOverSpeed_platform);
                } else {
                    alarm.push(rootElement.lang.report_roadLvlOverSpeed_platform);
                }
            }
            //30: 表示出区域报警	 （平台产生）
            if ((this.status4 >> 30) & 1 > 0) {
                // s3+30：出区域报警(平台)
                if (this.isAlarmShield('302,352')) {
                    normal.push(rootElement.lang.report_areaType_platform);
                } else {
                    alarm.push(rootElement.lang.report_areaType_platform);
                }
            }
            //31: 表示关键点未离开报警	  （平台产生）
            if ((this.status4 >> 31) & 1 > 0) {
                // s3+31：关键点未离开报警(平台)
                if (this.isAlarmShield('308,358')) {
                    normal.push(rootElement.lang.report_pointNoLeave_platform);
                } else {
                    alarm.push(rootElement.lang.report_pointNoLeave_platform);
                }
            }
        } else {
            //30: 表示出区域报警	 （平台产生）
            if ((this.status4 >> 30) & 1 > 0) {
                // s3+30：出区域报警(平台)
                if (this.isAlarmShield('302,352')) {
                    normal.push(rootElement.lang.report_areaType_platform);
                } else {
                    alarm.push(rootElement.lang.report_areaType_platform);
                }
            }
        }
    }
    //Acc相关位
    var devTurnStatus_ = this.getDevTurnStatus();
    if (devTurnStatus_.normal != '') {
        normal.push(devTurnStatus_.normal);
    }
    if (devTurnStatus_.alarm != '') {
        alarm.push(devTurnStatus_.alarm);
    }
    //解析报警状态位
    ret.normal = normal.toString();
    ret.alarm = alarm.toString();
    ret.alarmType = alarmType.toString();
    return ret;
}

/**
 * 是否国标
 * @returns {boolean}
 */
standardStatus.prototype.isGuoBiao = function () {
    if (this.status2 &&
        ((this.status2 >> 12 & 1) == 1)
        && ((this.status2 >> 13 & 1) == 0)) {
        return true;
    }
    return false;
}


//解析视频报警状态
standardStatus.prototype.getVideoAlarmStatus = function () {
    var ret = {};
    var normal = [];
    var alarm = [];
    if (this.status4 != null) {
        if ((this.status4 >> 7) & 1 > 0) {//7：GNSS模块故障
            if (this.isAlarmShield('202,252')) {
                normal.push(rootElement.lang.alarm_type_GNSSModuleFailure);
            } else {
                alarm.push(rootElement.lang.alarm_type_GNSSModuleFailure);
            }
        }
        if ((this.status4 >> 8) & 1 > 0) {//8：GNSS天线未接或者剪断
            if (this.isAlarmShield('203,253')) {
                normal.push(rootElement.lang.alarm_type_GNSSAntennaMissedOrCut);
            } else {
                alarm.push(rootElement.lang.alarm_type_GNSSAntennaMissedOrCut);
            }
        }
        if ((this.status4 >> 9) & 1 > 0) {	//9：GNSS天线短路
            if (this.isAlarmShield('204,254')) {
                normal.push(rootElement.lang.alarm_type_GNSSAntennaShort);
            } else {
                alarm.push(rootElement.lang.alarm_type_GNSSAntennaShort);
            }
        }
        if ((this.status4 >> 10) & 1 > 0) {	//10：终端LCD或者显示器故障
            if (this.isAlarmShield('207,257')) {
                normal.push(rootElement.lang.alarm_type_LCDorDisplayFailure);
            } else {
                alarm.push(rootElement.lang.alarm_type_LCDorDisplayFailure);
            }
        }
        if ((this.status4 >> 11) & 1 > 0) {	//11：TTS模块故障
            if (this.isAlarmShield('208,258')) {
                normal.push(rootElement.lang.alarm_type_TTSModuleFailure);
            } else {
                alarm.push(rootElement.lang.alarm_type_TTSModuleFailure);
            }
        }
        if ((this.status4 >> 12) & 1 > 0) {	//12：摄像头故障
            if (this.isAlarmShield('209,259')) {
                normal.push(rootElement.lang.alarm_type_cameraMalfunction);
            } else {
                alarm.push(rootElement.lang.alarm_type_cameraMalfunction);
            }
        }
    }
    ret.normal = normal.toString();
    ret.alarm = alarm.toString();
    return ret;
}

//解析油量异常报警状态
standardStatus.prototype.getFuelAlarmStatus = function () {
    var ret = {};
    ret.normal = '';
    ret.alarm = '';
    if (this.status4 != null) {
        if ((this.status4 >> 20) & 1 > 0) {
            if (this.isAlarmShield('216,266')) {
                ret.normal = rootElement.lang.alarm_type_abnormalFuel;
            } else {
                ret.alarm = rootElement.lang.alarm_type_abnormalFuel;
            }
        }
    }
    return ret;
}

//获取温度传感器信息
standardStatus.prototype.getTemperature = function (tempCount, tempName, sensorType, type) {
    if (tempCount != null && tempCount > 0 && tempName != null) {
        var tempName = tempName.split(",");
        var sensorType = sensorType.split(",");
        var tempSensor = [];
        tempSensor.push(this.tempSensor1);
        tempSensor.push(this.tempSensor2);
        tempSensor.push(this.tempSensor3);
        //UAE校车
        if (this.isExtraFlagUAE()) {
            tempSensor.push(this.sensor5);
            tempSensor.push(this.sensor6);
            tempSensor.push(this.sensor7);
        } else {
            tempSensor.push(this.tempSensor4);
        }
        var str = '';
        if (type == 1 || type == 2) {//氧气
            str = "%";
        } else if (type == 3) { // 油量
            str = rootElement.lang.alarm_oil_unit;
        } else {//温度
            str = rootElement.lang.alarm_temperator_unit;
            str = "℃";
        }


        var tempInfo = [];
        for (var i = 0; i < tempCount && i < tempSensor.length; i += 1) {
            if (sensorType[i] == type) {
                if (type == 4) {
//					tempInfo.push(mileageConversion(this.gpsGetTemperature(tempSensor[i])));
                    tempInfo.push({
                        name: rootElement.lang.mileage_today,
                        value: mileageConversion(this.gpsGetTemperature(tempSensor[i]))
                    });
                } else if (type == 5) {
                    // 电压传感器
                    tempInfo.push({
                        name: tempName[i],
                        value: this.gpsGetTemperature(tempSensor[i]) + " V"
                    });
                } else if (type == 6) {
                    // 酒精传感器
                    tempInfo.push({
                        name: tempName[i],
                        value: this.gpsGetAlcohol(tempSensor[i]) + " mg/m3"
                    });
                } else {
                    var gpsGetTemperature = this.gpsGetTemperature(tempSensor[i]);
                    if (type == 0 && gpsGetTemperature < -320) {
                        // 当温度值 小于 -320 的时候，就显示为 异常(-555℃)
                        tempInfo.push({name: tempName[i], value: rootElement.lang.monitor_diskAbnormal + "(" + gpsGetTemperature + str + ")"});
                    } else {
                        tempInfo.push({name: tempName[i], value: gpsGetTemperature + str});
                    }
                }
            }
        }
        return tempInfo;
    } else {
        return null;
    }
}

//设备温度传感转换
standardStatus.prototype.gpsGetAlcohol = function (temp) {
    if (temp !== null) {
        return temp / 10000;
    } else {
        return 0;
    }
}


standardStatus.prototype.hasMileage = function (tempCount, tempName, sensorType, type) {
    if (tempCount != null && tempCount > 0 && tempName != null) {
        var tempName = tempName.split(",");
        var sensorType = sensorType.split(",");
        var tempSensor = [];
        tempSensor.push(this.tempSensor1);
        tempSensor.push(this.tempSensor2);
        tempSensor.push(this.tempSensor3);
        //UAE校车
        if (this.isExtraFlagUAE()) {
            tempSensor.push(this.sensor5);
            tempSensor.push(this.sensor6);
            tempSensor.push(this.sensor7);
        } else {
            tempSensor.push(this.tempSensor4);
        }

        for (var i = 0; i < tempCount && i < tempSensor.length; i += 1) {
            if (sensorType[i] == type) {
                if (type == 4) {
                    return true;
                }
            }
        }
        return false;
    } else {
        return false;
    }
    return false;
}


//获取设备视频状态+报警
standardStatus.prototype.getVideoStatus = function (device) {
    var ret = {};
    var normal = []; //list;
    var alarm = []; //list
    //以下媒体信息
    if (!this.isPeopleTerminal()) {
        var disk = this.getDiskStatus();
        if (disk.normal != '') {
            normal.push(disk.normal);
        }
        if (disk.alarm != '') {
            alarm.push(disk.alarm);
        }
    }
    /*    if (standardVehicle.isShowMapPopItem("heavy")) {
            var taxiStatus_ = this.getEmptyTaxiStatus();
            if (taxiStatus_.hasOwnProperty("isTaxi")) {
                var emptyOrHeavy = rootElement.lang.taxi_status_empty;// 空车
                if (taxiStatus_.hasOwnProperty("isWeigthStatus")) {
                    emptyOrHeavy = rootElement.lang.taxi_status_weight;// 重车
                }
                normal.push(emptyOrHeavy);
            }
        }*/
    var gps3G = this.get3GStatus();
    if (gps3G.normal != '') {
        normal.push(gps3G.normal);
    }
    var IOStatus_ = this.getIOStatus(device);
    if (IOStatus_ != undefined && IOStatus_.normal != '') {
        normal.push(IOStatus_.normal);
    }
    if (IOStatus_ != undefined && IOStatus_.alarm != '') {
        alarm.push(IOStatus_.alarm);
    }
    // 解析报警相关(解析io)
    var longIOStatus_ = this.analyLongGpsIOAlarms(device);
    if (longIOStatus_ != undefined && longIOStatus_.normal != '') {
        normal.push(longIOStatus_.normal);
    }
    if (longIOStatus_ != undefined && longIOStatus_.alarm != '') {
        alarm.push(longIOStatus_.alarm);
    }
    if (device != null && device.isVideoDevice()) {
        var videoLost = this.getVideoLostStatus(device);
        if (videoLost.normal != '') {
            normal.push(rootElement.lang.alarm_type_video_lost_status + ": " + videoLost.normal);
        }

        var record = this.getRecordStatus(device);
        // http://192.168.1.192/redmine/issues/16129
        if (record.normal != '') {
            normal.push(rootElement.lang.alarm_type_record_state + ": " + record.normal);
        }
        if (record.alarm != '') {
            // 不录像屏蔽
            // 7.28 修改不录像 为 录像状态  http://192.168.1.192/redmine/issues/16129
            // 根据需求11 修改为全部显示正常，不再显示报警 http://192.168.1.192:8989/web/#/1?page_id=1235
            if (this.isAlarmShield('-100')) {
                normal.push(rootElement.lang.alarm_type_no_record + ": " + record.alarm);
            } else {
                alarm.push(rootElement.lang.alarm_type_no_record + ": " + record.alarm);
            }
        }
    }
    //流量预警或者超标
    var formatFlow = this.getFormatFlowStatus();
    if (formatFlow) {
        if (formatFlow.normal) {
            normal.push(formatFlow.normal);
        }
        if (formatFlow.alarm) {
            alarm.push(formatFlow.alarm);
        }
    }

    /*    if (standardVehicle.isShowMapPopItem("heavyLoad")) {
            var muckTruckStatus_ = this.getMuckTruckStatus();
            var emptyOrHeavyLoad = "";
            if (muckTruckStatus_.hasOwnProperty("weigthStatus")) {
                emptyOrHeavyLoad = muckTruckStatus_.weigthStatus;// 空载
                normal.push(emptyOrHeavyLoad);
            }
        }*/
    ret.normal = normal.toString();
    ret.alarm = alarm.toString();
    return ret;
}


//获取设备GPS状态+报警
standardStatus.prototype.getGpsStatus = function (device, isBackPlay) {
    var ret = {};
    var normal = []; //list;
    var alarm = []; //list
    var alarmType = [];
//	if(this.status1 != null) {
    //网络类型
    //--非轨迹回放  this.network 0 //3G  1//Wifi 2//有线  3//4G  4//5G 其他情况 unknow net type
    //媒体信息
    /*if (!isBackPlay) {*/
    if (this.network != null) {
        var str = "";
        switch (Number(this.network)) {
            case 0:
                str = rootElement.lang.wLan_3G;
                break;
            case 1:
                str = rootElement.lang.wLan_wifi;
                break;
            case 2:
                str = rootElement.lang.wired_network;
                break;
            case 3:
                str = rootElement.lang.wLan_4G;
                break;
            case 4:
                str = "5G";
                break;
            default:
                str = "unknow net type";
                break;
        }
        normal.push(str);
    }
    /* }*/
    //优先解析acc状态   基本信息
    if (!this.isPeopleTerminal()) {
        if (this.isAccOpen()) {
            //ACC开启
            normal.push(rootElement.lang.monitor_accOpen);
        } else {
            //ACC关闭
            normal.push(rootElement.lang.monitor_accClose);
        }
    }
    //解析gps定位状态   基本信息
    var isEmpty = true;
    var gpsStatus_ = "";
    if (this.isGpsValid(isBackPlay)) {//定位有效
        //未定位
        if (this.isDeviceStop()) {
            isEmpty = false;
            gpsStatus_ = rootElement.lang.monitor_vehicle_invalid;
        }
    } else {
        isEmpty = false;
        //未定位
        gpsStatus_ = rootElement.lang.monitor_vehicle_invalid;
    }
    // 补传GPS
    // this.getGPSSupplements();
    if (this.status1 != null) {
        var temp = (this.status1 >> 15) & 1;
        if (temp > 0) {
            var gps_supplements_ = "(" + rootElement.lang.supplement + ")"
            if (isEmpty) {
                gps_supplements_ = rootElement.lang.supplement
            }
            gpsStatus_ += gps_supplements_;
        }
    }
    if (gpsStatus_) {
        normal.push(gpsStatus_);
    }

    //解析速度信息   基本信息
    if (this.isGpsValid() && this.jingDu && this.weiDu
        && this.jingDu != 0 && this.weiDu != 0) {//定位有效
        if (this.isGuoBiao()) {
            if (!this.isStillEvent()) {
                normal.push(rootElement.lang.travel);//行驶
            }
        }
    }
    var isAnalySpeed = true;//是否解析速度
    //保存在ExtraFlag的8-15位    0-7
    if (((this.extraFlag >> 13) & 1) == 1 || ((this.extraFlag >> 14) & 1) == 1 || ((this.extraFlag >> 15) & 1) == 1) {
    } else if (((this.extraFlag >> 11) & 1) == 1) {//工作时长
        if (this.parkTime) {
            normal.push(rootElement.lang.work_time + "(" + this.getTimeDifference(this.parkTime) + ')');
        }
    } else if (this.isStillEvent()) {  //静止
        // isAnalySpeed = false;
        var still_ = "";
        if (!this.isPeopleTerminal()) {//v6  怠速/停车
            if (((this.status1 >> 1) & 1) == 1) {//怠速	//停车未熄火
                still_ = rootElement.lang.monitor_vehicle_parking;
            } else {//v9 停车
                still_ = rootElement.lang.monitor_vehicle_parked;
            }
        } else {//静止
            still_ = rootElement.lang.monitor_still;
        }
        if (this.parkTime) {
            still_ += "(" + this.getTimeDifference(this.parkTime) + ')';
        }
        if (still_) {
            normal.push(still_);
        }
    }


    if (!this.isPeopleTerminal() && isAnalySpeed) {
        if (this.isOverSpeed()) {//超速
            var isNight = (this.status1 >> 17) & 1 > 0;
            var alarmTypeStr = "";
            var isEnableChuanBiao = rootElement.myUserRole && rootElement.myUserRole.isEnableChuanBiao();
            // 持续超速（川标）
            if (this.parkTime && isEnableChuanBiao) {
                //夜间持续超速
                //持续超速
                if (isNight) {
                    alarmTypeStr = rootElement.lang.last_start_speeding_night;
                } else {
                    alarmTypeStr = rootElement.lang.last_start_speeding;
                }
                alarmTypeStr += "(" + this.getTimeDifference(this.parkTime) + ')';
            } else {
                //夜间开始超速
                //开始超速
                if (isNight) {
                    alarmTypeStr = rootElement.lang.start_speeding_night;
                } else {
                    alarmTypeStr = rootElement.lang.start_speeding;
                }
            }
            //超速报警
            if (this.isAlarmShield('11,61')) {
                normal.push(alarmTypeStr);
            } else {
                alarm.push(alarmTypeStr);
            }
            alarmType.push(11);
        } else if (this.isLowSpeed()) {//低速
            ////低速
            if (this.isAlarmShield('11,61')) {
                normal.push(rootElement.lang.monitor_lowSpeed);
            } else {
                alarm.push(rootElement.lang.monitor_lowSpeed);
            }
        }
    }
    if (!this.isPeopleTerminal()) {
        //基本信息
        /*var trun = this.getDevTurnStatusEx();
        if (trun) {
            if (trun.normal) {
                normal.push(trun.normal);
            }
            if (trun.alarm) {
                alarm.push(trun.alarm);
            }
        }*/
        //流量预警或者超标 TODO 在视频设备中解析
        // var formatFlow = this.getFormatFlowStatus();
        // if(formatFlow) {
        // 	if(formatFlow.normal){
        // 		normal.push(formatFlow.normal);
        // 	}
        // 	if(formatFlow.alarm){
        // 		alarm.push(formatFlow.alarm);
        // 	}
        // }
        //温度 /表格内展示 追加到末尾
//			var temperature_ = device.getTemperature();
//			if(temperature_) {
//				normal.push(temperature_);
//			}
        //状态里面显示温度信息

        //客车超员报警
        if (this.status1 && ((this.status1 >> 18) & 1 > 0)) {//18位表示超载状态        0-正常 1-超载
            if (this.isAlarmShield('231,281')) {
                normal.push(rootElement.lang.alarm_name_231);
            } else {
                alarm.push(rootElement.lang.alarm_name_231);
            }
        }
        //定制费用的 看不懂

    } else {
        //电池电量
        /*   if ((this.driveRecorderspeed > 0 && this.driveRecorderspeed <= 100)
               //电池电量: 10%
               normal.push(rootElement.lang.reportInfo_batteryLevel + "" + this.driveRecorderspeed + "%");
           } */
    }

    if (!this.isPeopleTerminal()) {
        if (this.isJT808Protocol()) {
            //var isCheckedVersion  = enable808CheckVesion instanceof Function && enable808CheckVesion();
            var isCheckedVersion = true;
            //20：运营状态；1：停运状态(808)
            if (standardVehicle.isShowMapPopItem("runStatus")) {
                var runStatus = this.getRunStatus(isCheckedVersion);
                if (runStatus != '') {
                    normal.push(runStatus);
                }
            }

            //21：经纬度未加密；1：已加密(808)
            if (standardVehicle.isShowMapPopItem("encipher")) {
                var encipher = this.getEncipherStatus(isCheckedVersion);
                if (encipher != '') {
                    normal.push(encipher);
                }
            }

            //22：油路正常，1：油路断开(808)
            if (standardVehicle.isShowMapPopItem("oilStatus")) {
                if (device != null && device.isOilControlSupport()) {
                    var oilStatus_ = this.getOilStatus(isCheckedVersion);
                    if (oilStatus_ != '') {
                        normal.push(oilStatus_);
                    }
                }
            }

            //23：电路正常，1：电路断开(808)
            if (standardVehicle.isShowMapPopItem("electricStatus")) {
                if (device != null && device.isElecControlSupport()) {
                    var electricStatus_ = this.getElectricStatus(isCheckedVersion);
                    if (electricStatus_ != '') {
                        normal.push(electricStatus_);
                    }
                }
            }

            //24：车门解锁，1：车门加锁(808)
            if (standardVehicle.isShowMapPopItem("doorLock")) {
                var doorStatus = this.getDoorStatus(isCheckedVersion);
                if (doorStatus != '') {
                    normal.push(doorStatus);
                }
            }
            if (standardVehicle.isShowMapPopItem("door")) {
                var doorStatus = this.getDoorOpenStatus(isCheckedVersion);
                if (doorStatus != '') {
                    normal.push(doorStatus);
                }
            }
        }
    }

    //国标协议
    if (this.isGuoBiao() && rootElement.myUserRole && rootElement.myUserRole.isEnableVehiStatus()) {
//			2,20=需要和1,19合并判断   1,19:0表示空载 1表示满载  2,20:1表示半载
        if (this.status3 != null) {
            // 空重载，单独解析一行
            /*if ((this.status3 >> 20) & 1 > 0 && (this.status2 >> 19) & 1 > 0) {
             } else if ((this.status3 >> 20) & 1 > 0) {
                 normal.push(rootElement.lang.half_load);
             } else if ((this.status2 >> 19) & 1 > 0) {
                 normal.push(rootElement.lang.loaded);
             } else {
                 normal.push(rootElement.lang.load);
             }*/

            if ((this.status3 >> 26) & 1 > 0) {
                normal.push(rootElement.lang.use_gps_satellite);
            }
            if ((this.status3 >> 27) & 1 > 0) {
                normal.push(rootElement.lang.use_Beidou_satellite);
            }

            if ((this.status3 >> 28) & 1 > 0) {
                normal.push(rootElement.lang.use_GLONASS_satellite);
            }
            if ((this.status3 >> 29) & 1 > 0) {
                normal.push(rootElement.lang.use_Galileo_satellite);
            }
        }
    }

    //长gps的状态信息
    var longGpsStatus = this.getLongGpsStatus();
    if (longGpsStatus && longGpsStatus.normal) {
        normal.push(longGpsStatus.normal);
    }
    // 已经是转换了单位的速度!!!!
    if (longGpsStatus &&  typeof longGpsStatus.limitSpeed != 'undefined') {
        ret.limitSpeed = longGpsStatus.limitSpeed;
    }

    //解析出租车状态
    var analyTaxiStatus_ = this.analyTaxiStatus();
    if (analyTaxiStatus_ && analyTaxiStatus_.normal) {
        normal.push(analyTaxiStatus_.normal);
    }
    //解析渣土车状态
    var longMuckStatus = this.getLongMuckStatus();
    if (longMuckStatus && longMuckStatus.normal) {
        normal.push(longMuckStatus.normal);
    }
    if (longMuckStatus && longMuckStatus.alarm) {
        alarm.push(longMuckStatus.alarm);
    }


    var laongGpsAlarms = this.analyLongGpsAlarms();
    if (laongGpsAlarms && laongGpsAlarms.alarm) {
        alarm.push(laongGpsAlarms.alarm);
    }
    if (laongGpsAlarms.normal != '') {
        normal.push(laongGpsAlarms.normal);
    }

    // 解析黑标状态
    var heiLongJiangStatus = this.analyHeiLongJiangStatus();
    if (heiLongJiangStatus.normal != '') {
        normal.push(heiLongJiangStatus.normal);
    }
    // 主动安全状态位的解析黑龙江
    var heiLongJiangStatusNew = this.analyHeiLongJiangStatusNew();
    if (heiLongJiangStatusNew.normal && heiLongJiangStatusNew.normal != '') {
        normal.push(heiLongJiangStatusNew.normal);
    }


    //这个和
    var mapFence = this.getMapFenceStatus(device);
    if (mapFence.normal != '') {
        normal.push(mapFence.normal);
    }
    if (mapFence.alarm != '') {
        alarm.push(mapFence.alarm);
    }

    var storageAlarmSBNew_ = this.getStorageAlarmSBNew();
    if (storageAlarmSBNew_.normal != '') {
        normal.push(storageAlarmSBNew_.normal);
    }
    if (storageAlarmSBNew_.alarm != '') {
        alarm.push(storageAlarmSBNew_.alarm);
    }
    if (isBackPlay && storageAlarmSBNew_.alarmType) {
        alarmType.push(storageAlarmSBNew_.alarmType);
    }
    //解析出租车报警
    var analyTaxiAlarms_ = this.analyTaxiAlarms();
    if (analyTaxiAlarms_.normal != '') {
        normal.push(analyTaxiAlarms_.normal);
    }
    if (analyTaxiAlarms_.alarm != '') {
        alarm.push(analyTaxiAlarms_.alarm);
    }

    var storageAlarmSB_ = this.getStorageAlarmSB();
    if (storageAlarmSB_) {
        if (storageAlarmSB_.normal) {
            normal.push(storageAlarmSB_.normal);
        }
        if (storageAlarmSB_.alarm) {
            alarm.push(storageAlarmSB_.alarm);
        }
        if (isBackPlay && storageAlarmSB_.alarmType) {
            alarmType.push(storageAlarmSB_.alarmType);
        }
    }


    //if (CSvrVer::GetInstance()->IsSvrVerV7())
    if (this.status3 != null) {  //30位 异常行驶状态  客运车禁止行驶
        if ((this.status3 >> 30) & 1 > 0) {    //凌晨营运
            if (this.isAlarmShield('151,152')) {// 客户端词条： 禁止行驶
                normal.push(rootElement.lang.alarm_type_nightdriving);
            } else {
                alarm.push(rootElement.lang.alarm_type_nightdriving);
            }
        }

        if ((this.status3 >> 31) & 1 > 0) {    ////山区公路禁行
            alarm.push(rootElement.lang.mountain_road_ban);
        }
    }

    //是否解析电子锁
    if (this.isCanParseElectronicLock() && this.isElectronicLockSupport(device)) {
        this.parseElectronicLockStatus(normal, alarm);
    }

    // 报警状态位解析
    var alarmStatus_ = this.getAlarmStatus();
    if (alarmStatus_.normal != '') {
        normal.push(alarmStatus_.normal);
    }
    if (alarmStatus_.alarm != '') {
        alarm.push(alarmStatus_.alarm);
    }
    if (isBackPlay && alarmStatus_.alarmType) {
        alarmType.push(alarmStatus_.alarmType);
    }

    // 升级状态和进度
    //AddStringStatus(strNormalStatus, GetExternDataForUpgradeInfo(pVehicle));

    // 通立定制,质量和开合盖状态
//		if(((this.extraFlag >> 15) & 1)  == 1){
//			if(this.parkTime){
//				var usQuality = this.parkTime >>
//				var usStatus = this.parkTime;
//				//质量: usQuality/10.0  (T)
//				normal
//				if((usStatus & 1) == 1){
//					//开盖 报警类型 198
//				}else{
//					//合盖
//				}
//				if(((usStatus >> 1 ) & 1) == 1){
//					//举升  报警类型  199
//				}
//			}
//		}
    this.getExtraInfo(normal, alarm);
    //渣土车相关
    if (this.isMuckTruck(device)) {
        this.getMuckTruckInfo(normal, alarm);
    }

    this.getMuckTruckAlarmInfo(normal, alarm);
    // 渣土车项目(华宝定制)
    // 新疆项目
    //6位：新疆项目 超长待机设备状态，  使用sTempSensor[4]去表示

    //以上基本信息
    // 解卫星数目
    if (this.satellite) {
        normal.push(rootElement.lang.satellite_number + "：" + this.satellite);
    }


//		if(record.alarm != '') {//-100
//			normal.push("不录像:"+record.alarm);
//		}
//	}
    ret.normal = normal.toString();
    ret.alarm = alarm.toString();
    ret.alarmType = alarmType.toString();
    return ret;
}


standardStatus.prototype.getMuckTruckAlarmInfo = function (normal, alarm) {
    // 数据列: RoadFlagType
    // 定义跟gps相差一位,可参考原分神驾驶报警(如GPS中是6,入库就是3)
    // #define NET_ALARM_TYPE_UNLOADING_ALARM    1240 //卸货报警
    // #define NET_ALARM_TYPE_LOADING_ALARM      1241 //装货报警
    /*0:不使用 1:卸货报警(1240) 2:装货报警(1241) 3:分神驾驶报警 2级(平台) 4:超载报警(1245) 5疫区来车报警(平台)
         */
    var normalStr_ = [];
    var alarmStr_ = [];

    var overload = Number(this.roadFlagType) & 8;
    if (overload) {
        if (this.isAlarmShield('1245,1295')) {
            normalStr_.push(rootElement.lang.alarm_name_1245);
        } else {
            alarmStr_.push(rootElement.lang.alarm_name_1245);
        }
    }

    var unloading = Number(this.roadFlagType) & 1;
    if (unloading) {
        if (this.isAlarmShield('1240,1290')) {
            normalStr_.push(rootElement.lang.alarm_name_1240);
        } else {
            alarmStr_.push(rootElement.lang.alarm_name_1240);
        }
    }

    var loading = Number(this.roadFlagType) & 2;
    if (loading) {
        if (this.isAlarmShield('1241,1291')) {
            normalStr_.push(rootElement.lang.alarm_name_1241);
        } else {
            alarmStr_.push(rootElement.lang.alarm_name_1241);
        }
    }

    if (Number(this.roadFlagType) & 32) {
        if (this.isAlarmShield('1430,1480')) {
            normalStr_.push(rootElement.lang.alarm_name_1430);
        } else {
            alarmStr_.push(rootElement.lang.alarm_name_1430);
        }
    }

    if (Number(this.roadFlagType) & 16) {
        if (this.isAlarmShield('1431,1481')) {
            normalStr_.push(rootElement.lang.alarm_name_1431);
        } else {
            alarmStr_.push(rootElement.lang.alarm_name_1431);
        }
    }


    if (normalStr_.length > 0) {
        normal.push(normalStr_.join(","));
    }
    if (alarmStr_.length > 0) {
        alarm.push(alarmStr_.join(","));
    }
}


//解析渣土车信息
//装载百分比（0时为不显示）,
//举升(1显示为举升，0不显示）, 开盖或合盖，重量:xxx.xxx吨
standardStatus.prototype.getMuckTruckInfo = function (normal, alarm) {
    var lineId_ = null;
    //高16位
    if (this.tempSensor4) {
        lineId_ = (this.tempSensor4 & 0xFFFF) << 16;
    }
    //低16位
    if (this.tempSensor3) {
        lineId_ += this.tempSensor3 & 0xFFFF;
    }
    if (lineId_ != null) {
        var normalStr_ = [];
        var alarmStr_ = [];
        if (((lineId_ >> 22) & 0x7F)) {
            normalStr_.push(rootElement.lang.muck_load_percent + ((lineId_ >> 22) & 0x7F) + "%");
        }
        if (((lineId_ >> 21) & 1) == 1) {
            normalStr_.push(rootElement.lang.muck_lift);
        } else {
            normalStr_.push(rootElement.lang.lay_flat);
        }
        if (((lineId_ >> 20) & 1) == 1) {
            normalStr_.push(rootElement.lang.muck_open);
        } else {
            normalStr_.push(rootElement.lang.muck_cover);
        }
        if (((lineId_ >> 19) & 1) == 1) {
            if (this.isAlarmShield('332,382')) {
                normalStr_.push(rootElement.lang.muck_truck_overload);//muck_truck_overload
            } else {
                alarmStr_.push(rootElement.lang.muck_truck_overload);//muck_truck_overload
            }
        }
        if (((lineId_ >> 18) & 1) == 1) {
            if (this.isAlarmShield('333,383')) {
                normalStr_.push(rootElement.lang.muck_truck_cover);//muck_truck_cover_alarm
            } else {
                alarmStr_.push(rootElement.lang.muck_truck_cover);//muck_truck_cover_alarm
            }
        }
        // 非法举升(平台)
        if (((lineId_ >> 29) & 1) == 1) {
            if (this.isAlarmShield('348,398')) {
                normalStr_.push(rootElement.lang.muck_truck_lift_alarm);//muck_truck_cover_alarm
            } else {
                alarmStr_.push(rootElement.lang.muck_truck_lift_alarm);//muck_truck_cover_alarm
            }
        }
        normalStr_.push(rootElement.lang.muck_weight + ((lineId_ & 0x3FFFF) / 1000).toFixed(3) + rootElement.lang.muck_ton);
        if (normalStr_.length > 0) {
            normal.push(normalStr_.join(","));
        }
        if (alarmStr_.length > 0) {
            alarm.push(alarmStr_.join(","));
        }
    }
    return "";
}


//4位:渣土车项目
//判断是否渣土车
//客户端是根据车辆重量传感器解析的
standardStatus.prototype.isMuckTruck = function (device) {
    // 支持重量传感器
    if (device && typeof device.isWeightSensorSupport == 'function' &&
        device.isWeightSensorSupport()) {
        if (((this.extraFlag >> 12) & 1) == 1) {
            return true;
        }
    }
    return false;
}

// 新渣土车状态位
standardStatus.prototype.isMuckTruckNew = function () {
    // 新渣土车
    if (this.isLongGps() && this.longStatus && (this.longStatus >> 17) & 1) {
        return true;
    }
    return false;
}

//判断是否处于工作状态
standardStatus.prototype.getExtraInfo = function (normal, alarm) {
    //0:司机卡未插卡,
    //1:司机识别错误,
    //2:未复位行车报警,
    //3:是否处于工作状态，如果为1，此时nParkTime表示工作时长
    //4位:渣土车项目
    //5位:新疆项目  此时nParkTime 低位为状态位， 高位为报警位
    //6位:新疆项目 超长待机设备状态，  使用sTempSensor[4]去表示

    //3:是否处于工作状态，如果为1，此时nParkTime表示工作时长
//	if(((this.extraFlag >> 11) & 1)  == 1){
//		if(this.parkTime){
//			normal.push(rootElement.lang.work_time+":"+this.getTimeDifference(this.parkTime));
//		}
//	}
    //2:未复位行车报警,
    if (((this.extraFlag >> 10) & 1) == 1) {
        //413
        if (this.isAlarmShield('413,463')) {
            normal.push(rootElement.lang.unreset_travel_alarm);
        } else {
            alarm.push(rootElement.lang.unreset_travel_alarm);
        }
    }
    //1:司机识别错误,
    if (((this.extraFlag >> 9) & 1) == 1) {
        //412
        if (this.isAlarmShield('412,462')) {
            normal.push(rootElement.lang.driver_identification_error);
        } else {
            alarm.push(rootElement.lang.driver_identification_error);
        }
    }
    //0:司机卡未插卡,
    if (((this.extraFlag >> 8) & 1) == 1) {
        //411
        if (this.isAlarmShield('411,461')) {
            normal.push(rootElement.lang.driver_card_not_inserted);
        } else {
            alarm.push(rootElement.lang.driver_card_not_inserted);
        }
    }
}


//获取设备经度
standardStatus.prototype.getJingDu = function () {
    if (this.jingDu != null) {
        return (this.jingDu / 1000000).toFixed(6);
    } else {
        return 0;
    }
}

//获取设备纬度
standardStatus.prototype.getWeiDu = function () {
    if (this.weiDu != null) {
        return (this.weiDu / 1000000).toFixed(6);
    } else {
        return 0;
    }
}

//获取设备里程
standardStatus.prototype.getLiCheng = function () {
    if (this.liCheng !== null && this.liCheng >= 0) {
        return this.liCheng / 1000;
    } else {
        return "0";
    }
}

//获取设备里程字符串
standardStatus.prototype.getLiChengString = function (isBackPlay) {
//	return this.getLiCheng() + ' ' +  rootElement.lang.km;
    if (typeof speedConversion == 'function') {
        return mileageConversion(this.getLiCheng(), isBackPlay);
    }
    return this.getLiCheng() + ' ' + rootElement.lang.km;
}

//获取设备里程字符串
standardStatus.prototype.getLiChengNum = function (isBackPlay) {
    if (typeof speedConversion == 'function') {
        return mileageNumConversion(this.getLiCheng(), isBackPlay);
    }
    return this.getLiCheng();
}

//获取今日里程
standardStatus.prototype.getTodayLiCheng = function () {
    if (this.isTodayLicheng() && this.bsdAlarmL1 !== null && this.bsdAlarmL1 >= 0) {
        return this.bsdAlarmL1 / 10;
    } else {
        return 0;
    }
}

standardStatus.prototype.getTodayLiChengStr = function (isBackPlay) {
    if (typeof speedConversion == 'function') {
        return mileageConversion(this.getTodayLiCheng(), isBackPlay);
    }
    return this.getTodayLiCheng() + ' ' + rootElement.lang.km;
}


standardStatus.prototype.getTempSensor4 = function (isBackPlay) {
    return this.tempSensor4;
}

//获取今日里程
standardStatus.prototype.getTodayLichengEx = function (isBackPlay) {
    if (typeof valueConversion == 'function') {
        return valueConversion(this.getTodayLiCheng(), isBackPlay);
    }
    return this.getTodayLiCheng();
}


//获取设备总油量（包含主副油量）
standardStatus.prototype.getTotalYouLiang = function () {
    return this.getYouLiang() + this.getauxiliaryTank();
}

//获取设备总油量字符串（包含主副油量）
standardStatus.prototype.getTotalYouLiangStr = function () {
    return this.getTotalYouLiang() + " " + rootElement.lang.alarm_oil_unit;
}

//获取设备主油量
standardStatus.prototype.getYouLiang = function () {
    if (this.youLiang != null) {
        if (rootElement.vehicleManager && typeof rootElement.vehicleManager.getDevice == 'function') {
            var dev = rootElement.vehicleManager.getDevice(this.devIdno);
            if (dev && dev.isWaterSense()) {
                return this.youLiang;
            }
        }
        return this.youLiang / 100;
    } else {
        return 0;
    }
}


//获取设备主油量字符串
standardStatus.prototype.getYouLiangStr = function () {
    return this.getYouLiang().toFixed(2) + " " + rootElement.lang.alarm_oil_unit;
};

//获取设备副油箱油量
standardStatus.prototype.getauxiliaryTank = function () {
    if (this.viceYl != null) {
        if (rootElement.vehicleManager && typeof rootElement.vehicleManager.getDevice == 'function') {
            var dev = rootElement.vehicleManager.getDevice(this.devIdno);
            if (dev && dev.isWaterSense()) {
                return this.viceYl;
            }
        }
        return this.viceYl / 100;
    } else {
        return 0;
    }
}

//获取设备副油箱油量字符串
standardStatus.prototype.getauxiliaryTankStr = function () {
    return this.getauxiliaryTank().toFixed(2) + " " + rootElement.lang.alarm_oil_unit;
};

//获取设备水位
standardStatus.prototype.getWaterLevel = function () {
    if (this.water != null) {
        return this.water;
    } else {
        return 0;
    }
}

//获取设备水位字符串
standardStatus.prototype.getWaterLevelStr = function () {
    return this.getWaterLevel() + " " + rootElement.lang.alarm_oil_unit;
};

//获取设备水深字符串
standardStatus.prototype.getWaterDepthStr = function () {
    return this.getWaterLevel() + " " + rootElement.lang.cmUnit;
}


//设备温度传感转换
standardStatus.prototype.gpsGetTemperature = function (temp) {
    if (temp !== null) {
        return temp / 10;
    } else {
        return 0;
    }
}

//获取设备速度
standardStatus.prototype.getSpeed = function () {
//	if (this.isGpsValid()) {
    if (this.speed != null) {
        if (!isNaN(this.speed / 10)) {
            return (this.speed / 10).toFixed(2);
        }
        return this.speed / 10;
    } else {
        return "0.00";
    }
//	} else {
//		return "0";
//	}
}

//获取设备速度字符串
standardStatus.prototype.getSpeedString = function (isBackPlay) {
    //离线设备显示为0
    if (typeof speedConversion == 'function') {
        return speedConversion(this.getSpeed());
    }
    var isCheckedVersion = enable808CheckVesion instanceof Function && enable808CheckVesion();
    // 过检版本返回单位的0 公里/小时
    if (isCheckedVersion) {
        return speedConversion(0);
    }
    return this.getSpeed();
//	}else{
//		if(typeof speedConversion == 'function') {
//			return	speedConversion(0);
//		}
//		return 0;
//	}
}

//获取设备速度num
standardStatus.prototype.getSpeedNum = function () {
//	if (this.isGpsValid()) {
    //设备在线
    if (this.speed != null) {
        return this.speed;
    } else {
        return "0";
    }
//	} else {
//		return "0";
//	}
}

standardStatus.prototype.getGaoDu = function () {
    //设备在线
    if (this.gaoDu) {
        return this.gaoDu;
    }
    return null;
}

standardStatus.prototype.getDriveRecorderspeed = function () {
    //设备在线
    if (this.driveRecorderspeed) {
        return this.driveRecorderspeed;
    } else {
        return "0";
    }
}

//设备获取方向
standardStatus.prototype.getDirection = function () {
    if (this.huangXiang != null) {
        return ((this.huangXiang + 22) / 45) & 0x7;
    } else {
        return 0;
    }
}

//获取设备方向字符串
standardStatus.prototype.getHuangXiangString = function () {
    //显示为未定位
    if (!this.isGpsValid()) {
        return rootElement.lang.monitor_vehicle_invalid;
        ;
    }
    var direction = this.getDirection();
    var str = "";
    switch (direction) {
        case 0:
            str = rootElement.lang.north;
            break;
        case 1:
            str = rootElement.lang.northEast;
            break;
        case 2:
            str = rootElement.lang.east;
            break;
        case 3:
            str = rootElement.lang.southEast;
            break;
        case 4:
            str = rootElement.lang.south;
            break;
        case 5:
            str = rootElement.lang.southWest;
            break;
        case 6:
            str = rootElement.lang.west;
            break;
        case 7:
            str = rootElement.lang.northWest;
            break;
        default:
            break;
    }
    return str;
};

//获取设备速度+方向字符串
standardStatus.prototype.getSpeedFangXiangString = function () {
    var ret = [];
    ret.push(this.getSpeedString() + '(' + this.getHuangXiangString() + ')');
    if (this.status1 != null) {
        if (this.isAlarmShield('11,61') && this.isOverSpeed() && !this.isParkedNew() && !this.isIdling()) {
            ret.push(rootElement.lang.monitor_overSpeed);
        }
        if (this.isAlarmShield('11,61') && this.isLowSpeed()) {
            ret.push(rootElement.lang.monitor_lowSpeed);
        }
    }
    return ret.toString();
}

//获取设备速度+方向字符串
standardStatus.prototype.getSpeedDirection = function () {
    var ret = [];
    var speedNum = 0;
    //离线设备显示为0
    if (typeof speedConversion == 'function') {
        speedNum = this.getSpeed();
    } else {
        var isCheckedVersion = enable808CheckVesion instanceof Function && enable808CheckVesion();
        // 过检版本返回单位的0 公里/小时
        if (isCheckedVersion) {
            speedNum = 0;
        } else {
            speedNum = this.getSpeed();
        }
    }
    speedNum = valueConversion(speedNum);
    ret.push(speedNum + '(' + this.getHuangXiangString() + ')');
    if (this.status1 != null) {
        if (this.isAlarmShield('11,61') && this.isOverSpeed() && !this.isParkedNew() && !this.isIdling()) {
            ret.push(rootElement.lang.monitor_overSpeed);
        }
        if (this.isAlarmShield('11,61') && this.isLowSpeed()) {
            ret.push(rootElement.lang.monitor_lowSpeed);
        }
    }
    return ret.toString();
}

//获取车辆地图经纬度信息
standardStatus.prototype.getMapLngLat = function (isBackPlay) {
    var point = null;
    if (this.isGpsValid() || isBackPlay) {
        point = {};
        point.lng = this.mapJingDu;
        point.lat = this.mapWeiDu;
    }
    return point;
};

//获取最后一个有效车辆地图经纬度信息
standardStatus.prototype.getLastMapLngLat = function () {
    var point = null;
    if (this.mapWeiDu != null && this.mapJingDu != null) {
        point = {};
        point.lng = this.mapJingDu;
        point.lat = this.mapWeiDu;
    }
    return point;
};

//获取车辆地图经纬度信息
standardStatus.prototype.getMapLngLatStr = function () {
    if (this.isGpsValid() && this.isDeviceStop()) {
        return this.mapWeiDu + "," + this.mapJingDu;
    } else {
        return "";
    }
};

//获取车辆经纬度信息
standardStatus.prototype.getLngLat = function () {
    var point = null;
    if (this.isGpsValid() || this.isDeviceStop()) {
        point = {};
        point.lng = (this.jingDu / 1000000).toFixed(6);
        point.lat = (this.weiDu / 1000000).toFixed(6);
    }
    return point;
};

//获取车辆经纬度信息
standardStatus.prototype.getLngLatStr = function (isBackPlay) {
    if (this.isGpsValid() || this.isDeviceStop() || isBackPlay) {
        return (this.weiDu / 1000000).toFixed(6) + "," + (this.jingDu / 1000000).toFixed(6);
    } else {
        return "";
    }
};

//获取最后一个有效经纬度信息字符串
standardStatus.prototype.getLastLngLatStr = function () {
    if (this.weiDu != null && this.jingDu != null) {
        return (this.weiDu / 1000000).toFixed(6) + "," + (this.jingDu / 1000000).toFixed(6);
//		return this.weiDu / 1000000 + "," + this.jingDu / 1000000;
    } else {
        return "";
    }
};

//获取最后一个有效经纬度信息
standardStatus.prototype.getLastLngLat = function () {
    var point = null;
    if (this.weiDu != null && this.jingDu != null) {
        point = {};
        point.lng = (this.jingDu / 1000000).toFixed(6);
        point.lat = (this.weiDu / 1000000).toFixed(6);
    }
    return point;
};

//获取最后一个有效解析地理位置经纬度信息
standardStatus.prototype.getLastGeocoderLngLat = function () {
    var point = null;
    if (this.geoWeiDu != null && this.geoJingDu != null) {
        point = {};
        point.lng = this.geoJingDu;
        point.lat = this.geoWeiDu;
    }
    return point;
};

//获取线路id
standardStatus.prototype.getLineId = function () {
    return this.lineId;
}

//获取司机id
standardStatus.prototype.getDriverId = function () {
    return this.driverId;
}

//获取车辆电子运单
standardStatus.prototype.getWayBill = function () {
    return this.wayBill;
}


//获取线路方向 0上行 1下行
standardStatus.prototype.getLineDirect = function () {
    return this.lineDirect;
}

//获取线路方向 0上行 1下行
standardStatus.prototype.getLineDirectStr = function () {
    if (this.lineDirect == 1) {
        return rootElement.lang.line_down;
    } else {
        return rootElement.lang.line_up;
    }
}

//获取站点标识 0站点 1站场
standardStatus.prototype.getStationFlag = function () {
    return this.stationFlag;
}

//获取站点索引
standardStatus.prototype.getStationIndex = function () {
    return this.stationIndex;
}

//获取站点状态 1本站 0下站
standardStatus.prototype.getStationStatus = function () {
    return this.stationStatus;
}
//车辆实时数据流
standardStatus.prototype.getRealDataStreamInfo = function () {
    if (this.realDataStream) {
        var split = this.realDataStream.split(',');
        if (split.length == 16) {
            return this.realDataStream;
        }
    }
    return null;
}

//车辆实时数据流
standardStatus.prototype.getRealDataStreamInfoStr = function () {
    var obj = null;
//	this.realDataStream = status.tran;//tran   车辆实时数据流
    if (this.realDataStream) {
        //	  0	$OBD-RT,
        //	  1	28.3, 电瓶电压
        //	  2 629,  发动机转速
        //	  3 20,		行驶车速
        //	  4 0.00,  节气门开度
        //	  5 23.00,  发动机负荷
        //	  6 74,    冷却液温度
        //	  7 0.00,  瞬时油耗
        //	  8 99.99, 平均油耗 L/100km
        //	  9  15.58, 本次行驶里程 km
        //	  10 15, 总里程 km
        //	  11 4.50, 本次耗油量 L
        //	  12 5534.00, 累计耗油量 L
        //	  13 0,  当前故障码数量
        //	  14 0,本次急加速次数 Times
        //	  15 0本次急减速次数 Times
        var split = this.realDataStream.split(',');
        if (split.length == 16) {
            var desc = "";
            desc += "电瓶电压" + "(" + split[1] + " V),";
            desc += "发动机转速" + "(" + split[2] + " rpm),";
            desc += "行驶车速" + "(" + split[3] + " Km/h),";
            desc += "节气门开度" + "(" + split[4] + " %),";
            desc += "发动机负荷" + "(" + split[5] + " %),";
            desc += "冷却液温度" + "(" + split[6] + " ℃),";
            var unit = " L/h";
            if (split[3] > 0) {
                unit = " L/100km";
            }
            desc += "瞬时油耗" + "(" + split[7] + unit + "),";
            desc += "平均油耗" + "(" + split[8] + " L/100km),";
            desc += "本次行驶里程" + "(" + split[9] + " km),";
            desc += "总里程" + "(" + split[10] + " km),";
            desc += "本次耗油量" + "(" + split[11] + " L),";
            desc += "累计耗油量" + "(" + split[12] + " L),";
            desc += "当前故障码数量" + "(" + split[13] + "),";
            desc += "本次急加速次数" + "(" + split[14] + "  Times),";
            desc += "本次急减速次数" + "(" + split[15] + "  Times)";
            obj = {name: split[0], desc: desc};
        }
    }
    return obj;
}

//解析实时车辆状态  isBackPlay 回放界面 速度不判断在线,
standardStatus.prototype.parseStatusInfo = function (isBackPlay, startOrEnd) {
    var ret = {};
    // 取定位设备的速度
    ret.speed = this.getSpeedString(isBackPlay) + '(' + this.getHuangXiangString() + ')';

    // 速度的值 km/h
    ret.speedValue = this.getSpeed();


    // 当前gps时间
    ret.gpsTime = this.getGpsTimeString();
    ret.parkTime = this.getParkTimeString();
    ret.endTime = dateTime2TimeString(dateStrLongTime2Date(this.getGpsTime()).getTime() + this.parkTime * 1000);
    // 开始停车时间
    ret.startParkTime = dateTime2TimeString(dateStrLongTime2Date(this.getGpsTime()).getTime() - this.parkTime * 1000);
    ret.parkTimeSecond = this.parkTime;

    ret.direction = this.getDirection();
    // 取定位设备的里程
    ret.liCheng = this.getLiChengString();
    ret.rliCheng = this.getLiChengString(isBackPlay);
    if (isBackPlay) {
        //单位m用于判断是否漂移
        ret.mliCheng = this.liCheng != null && this.liCheng > 0 ? this.liCheng : 0;
    }
    ret.nliCheng = valueConversion(this.getLiCheng());
    ret.position = this.getLngLatStr(isBackPlay);
    ret.positionRaw = this.getLngLatStr();
    var point = this.getMapLngLat(isBackPlay);
    if (point != null) {
        ret.mapJingDu = point.lng;
        ret.mapWeiDu = point.lat;
        if (ret.position == '0,0' || ret.position == '0.000000,0.000000') {
            ret.isGpsValid = false;
        } else {
            ret.isGpsValid = true;
        }
    } else {
        ret.mapJingDu = "";
        ret.mapWeiDu = "";
        ret.isGpsValid = false;
    }
    //获取有效解析地理位置的经纬度
    var geocoderLngLat = this.getLastLngLat();
    if (geocoderLngLat != null) {
        ret.geocoderLng = geocoderLngLat.lng;
        ret.geocoderLat = geocoderLngLat.lat;
    } else {
        ret.geocoderLng = "";
        ret.geocoderLat = "";
    }
    //解析车辆状态
    var vehicle = rootElement.vehicleManager.getVehicle(this.vehiIdno);
    this.setPeopleTerminal(vehicle.isPeopleTerminal());//人员设备

    //行驶记录仪速度  	单位: km/h，使用中需先除以10。执法仪版本表示电量
    ret.driveRecorderspeed = this.getDriveRecorderspeed();

    var html = [];
    html.push('<font>');
    var device = rootElement.vehicleManager.getDevice(this.devIdno);
    if (!device) {
        device = vehicle.getValidDevice();
    }
    if (isBackPlay && startOrEnd) {
        var suffix = this.getForwardStatus('');
        if (suffix) {
            suffix = '[' + suffix;
            suffix += ']';
        }
        html.push('<span class="b">' + this.vehiIdno + suffix + '</span><br/>');
    }
    var team;
    if (vehicle.parentId) {
        if (rootElement.myUserRole && rootElement.myUserRole.isDispatcher()) {// 当前登录为调度用户
            team = rootElement.vehicleManager.getAllTeam(vehicle.parentId);
        } else {
            team = rootElement.vehicleManager.getTeam(vehicle.parentId);
        }
    }
    if (team && team.name) {
        // 公司
        var company = rootElement.lang.ic_co_id
        // 车队
        if (team.level == 2) {
            company = rootElement.lang.motorcade
        }
        // 组织
        if (team.level == 12) {
            company = rootElement.lang.department;
        }
        if (standardVehicle.isShowMapPopItem("company")) {
            html.push('<span class="b">' + company + '：</span>' + team.name + '<br/>');
        }
    }
    // 是否下一个需要换行操作
    var isWrap = true;
    //如果是人员设备
    if (vehicle.isPeopleTerminal()) {
        //解析顺序：
        //时间
        //高程
        //公司
        //司机        xxx(电话:1333)
        //设备号
        //SIM
        //经度纬度
        //状态
        //报警
        //人员名称
        if (vehicle.getPeopleName()) {
            if (standardVehicle.isShowMapPopItem("police_name")) {
                html.push('<span class="b">' + rootElement.lang.track_labelName + '</span>' + vehicle.getPeopleName() + '<br/>');
            }
        }
        if (rootElement.myUserRole && rootElement.myUserRole.isPolice() && vehicle.getName()) {
            if (standardVehicle.isShowMapPopItem("police_id") && !vehicle.isDispatcher) {
                html.push('<span class="b">' + rootElement.lang.policeId + '：</span>' + vehicle.getName() + '<br/>');
            }
        }
        if (vehicle.getTelePhone()) {
            //电话
            if (standardVehicle.isShowMapPopItem("phone")) {
                html.push('<span class="b">' + rootElement.lang.track_labelTelPhone + '</span>' + vehicle.getTelePhone() + '<br/>');
            }
        }
        //时间
        if (standardVehicle.isShowMapPopItem("time")) {
            html.push('<span class="b">' + rootElement.lang.labelTime + '</span>' + ret.gpsTime + '<br/>');
        }
        if (standardVehicle.isShowMapPopItem("battery") && ret.driveRecorderspeed > 0 && ret.driveRecorderspeed <= 100) {
            html.push('<span class="b">' + rootElement.lang.reportInfo_batteryLevel + '</span>' + ret.driveRecorderspeed + '%' + '<br/>');
        }

        //位置
        //轨迹回放页面
        if (this.address && isBackPlay) {
            ret.position = this.address;
        }
        if (standardVehicle.isShowMapPopItem("position")) {
            html.push('<span class="b">' + rootElement.lang.monitor_labelPosition + '</span><span id="position">' + ret.position + '</span><br/>');
        }
    } else {
        //解析顺序：
        //时间
        if (standardVehicle.isShowMapPopItem("time")) {
            html.push('<span class="b">' + rootElement.lang.labelTime + '</span>' + ret.gpsTime);
            isWrap = false;
        }
        //速度
        if (standardVehicle.isShowMapPopItem("speed")) {
            if (!isWrap) {
                html.push('&nbsp;&nbsp;&nbsp;&nbsp;');
            }
            html.push('<span class="b">' + rootElement.lang.labelSpeed + '</span>' + ret.speed + '<br/>');
            isWrap = true;
        }
        if (!isWrap) {
            html.push('<br/>');
            isWrap = true;
        }
        //高程   xxx(m)  (客户端过检版本才显示) web端出租车
//			if (this.isTaxi905Protocol()) {
        //  高程不为0 就显示
        if (standardVehicle.isShowMapPopItem("height")) {
            if (this.gaoDu) {
                html.push('<span class="b">' + rootElement.lang.gaodu + '</span>' + this.gaoDu + '(m)<br/>');
            }
        }
//			}
        //808协议才是行驶记录仪速度   非出租车
        if (standardVehicle.isShowMapPopItem("record_speed")) {
            if (device && device.isJT808Protocol() && !device.isTaxi905Protocol() && ret.driveRecorderspeed > 0) {
                var recordSpeed_ = "";
                if (typeof speedConversion == 'function') {
                    recordSpeed_ = speedConversion((ret.driveRecorderspeed / 10).toFixed(2));
                } else {
                    recordSpeed_ = (ret.driveRecorderspeed / 10).toFixed(2) + " KM/H";
                }
                html.push('<span class="b">' + rootElement.lang.drive_recorder_speed + '</span>' + recordSpeed_ + '<br/>');
            }
        }


        //里程
        if (standardVehicle.isShowMapPopItem("mile")) {
            /* // 里程
             html.push('<span class="b">' + rootElement.lang.monitor_labelLiCheng + '</span>&nbsp;' + ret.liCheng);
             // 轨迹回放行驶里程
             html.push('&nbsp;&nbsp;&nbsp;&nbsp;<span class="b">' + rootElement.lang.track_licheng+": " + '</span><span id="runLiCheng">' + 0 + '</span><br/>');
              */
            // 轨迹回放行驶里程
            html.push('<span class="b">' + rootElement.lang.monitor_labelLiCheng + '</span><span id="runLiCheng">' + ret.liCheng + '</span>');
            isWrap = false;
        }

        // 具有水位传感器
        ret.isWaterLevelSupport = device != null && device.isWaterLevelSupport();
        // 水位/水深的值
        ret.waterLevel = this.getWaterLevel();
        //水位 设备有水位传感器并且能解析水位
        if (standardVehicle.isShowMapPopItem("water") && ret.isWaterLevelSupport && this.getWaterLevel() != 0 && this.getWaterLevel() != null) {
            if (!isWrap) {
                html.push('&nbsp;&nbsp;&nbsp;&nbsp;');
            } else {
                html.push('<br/>');
            }
            if (device.isWaterDepthSupport()) { //同时有水位和水深传感器 显示水深
                // 水深
                ret.waterLevelUnit = rootElement.lang.cmUnit;
                html.push('<span class="b">' + rootElement.lang.waterDepthLabel + ':' + '</span>&nbsp;' + this.getWaterDepthStr() + '<br/>'); //低16位
            } else {
                // 水位
                ret.waterLevelUnit = rootElement.lang.alarm_oil_unit;
                html.push('<span class="b">' + rootElement.lang.waterLevelLabel + ':' + '</span>&nbsp;' + this.getWaterLevelStr() + '<br/>'); //低16位
            }
            isWrap = true;
        }

        if (!isWrap) {
            html.push('<br/>');
            isWrap = true;
        }

        // 具有油量传感器
        ret.isOilSensorSupport = device != null && device.isOilSensorSupport();
        // 具有副油箱
        ret.isAuxiliaryTankSupport = device != null && device.isAuxiliaryTankSupport();
        // 模拟量油量
        if  (this.isParseSimulationSupport()) {
            ret.simulationOil = this.simulationYL;
        } else {
            ret.simulationOil = null;
        }
        // 主油箱
        ret.mainOil = this.getYouLiang();
        // 副油箱
        ret.subOil = this.getauxiliaryTank();
        //油量
        if (standardVehicle.isShowMapPopItem("oil") && ret.isOilSensorSupport && this.getYouLiang() != 0 && this.getYouLiang() != null) {
            ret.youLiang = '';
            //主副油箱都配置了并且能解析副油箱
            if (device.isAuxiliaryTankSupport()) {
                html.push('<span class="b">' + rootElement.lang.moduleOilSensor + ':' + '</span>&nbsp;' + this.getYouLiangStr());
                ret.youLiang += rootElement.lang.moduleOilSensor + ':' + this.getYouLiangStr();
                if (this.getauxiliaryTank() != null && this.getauxiliaryTank() != 0) {
                    html.push('&nbsp;&nbsp;&nbsp;&nbsp;<span class="b">' + rootElement.lang.auxiliaryTank + ':' + '</span>&nbsp;' + this.getauxiliaryTankStr() + '<br/>');
                    ret.youLiang += ',' + rootElement.lang.auxiliaryTank + ':' + this.getauxiliaryTankStr();
                } else {
                    html.push('<br/>');
                }
            } else {
                ret.youLiang += rootElement.lang.labelFuel + this.getYouLiangStr();
                //油量信息
                html.push('<span class="b">' + rootElement.lang.labelFuel + '</span>&nbsp;' + this.getYouLiangStr() + '<br/>');
            }
        }


        if (device != null) {
            //OBD外设
            if (standardVehicle.isShowMapPopItem("obd")) {
                var obdStatus_ = device.getObdStatus();
                if (obdStatus_ != '') {
                    //obd状态信息 外设
                    html.push('<span class="b">OBD' + rootElement.lang.peripheral + '：</span>&nbsp;' + obdStatus_ + '<br/>');
                }
            }
            //人数
            if (standardVehicle.isShowMapPopItem("people")) {
                if (device.isPeopleSupport()) {
                    var countPeopele = this.getCountPeopele();
                    if (countPeopele != null) {
                        html.push('<span class="b">' + rootElement.lang.people_number + '</span>&nbsp;' + countPeopele + '<br/>');
                    }
                }
            }

            // 当天运行信息统计
            if (standardVehicle.isShowMapPopItem("dayRunningInfo")/* && rootElement.enableVietnam*/) {
                var dayOverspeed = this.getDayRunningInfo(1);
                // if (dayOverspeed) {
                html.push('<span class="b">' + rootElement.lang.day_running_info_overspeed + ': </span>&nbsp;' + dayOverspeed + '<br/>');
                // }
                var dayPark = this.getDayRunningInfo(2);
                // if (dayPark) {
                html.push('<span class="b">' + rootElement.lang.day_running_info_park + ': </span>&nbsp;' + dayPark + '<br/>');
                // }
                var dayParkTime = this.getDayRunningInfo(3);
                // if (dayParkTime) {
                html.push('<span class="b">' + rootElement.lang.day_running_info_parkTime + ': </span>&nbsp;' + getTimeDifference4(dayParkTime, true) + '<br/>');
                // }
                var dayRunTime = this.getDayRunningInfo(4);
                // if (dayRunTime) {
                html.push('<span class="b">' + rootElement.lang.day_running_info_runTime + ': </span>&nbsp;' + getTimeDifference4(dayRunTime, true) + '<br/>');
                // }
                var dayDriverTime = this.getDayRunningInfo(5);
                // if (dayDriverTime) {
                html.push('<span class="b">' + rootElement.lang.day_running_info_driverTime + ': </span>&nbsp;' + getTimeDifference4(dayDriverTime, true) + '<br/>');
                // }
                //获取司机显示信息
                if (rootElement.vehicleManager) {
                    var driver = rootElement.vehicleManager.getDriverInfo(this.getDriverId());
                    var driverName = "";
                    // 司机
                    if (driver && driver.getName()) {
                        driverName = driver.getName();
                    }
                    html.push('<span class="b">' + rootElement.lang.monitor_labelDriver + '</span>&nbsp;' + driverName + '<br/>');

                    var jobNum = "";
                    // 从业资格证编号
                    if (driver && driver.getJobNum()) {
                        jobNum = driver.getJobNum();
                    }
                    html.push('<span class="b">' + rootElement.lang.driverJobNum + ': </span>&nbsp;' + jobNum + '<br/>');
                }
            }

            if (standardVehicle.isShowMapPopItem("device")) {
                //显示设备号和sim卡
                html.push('<span class="b">' + rootElement.lang.monitor_device_idno + '</span>&nbsp;' + this.devIdno);

                // SIM
                var simInfo = device.getSimCard();
                //sim卡
                if (simInfo) {
                    html.push('&nbsp;&nbsp;&nbsp;&nbsp;<span class="b">' + rootElement.lang.monitor_sim_idno + '</span>&nbsp;' + simInfo + '<br/>');
                } else {
                    html.push('<br/>');
                }

                // 序列号
                if (device.getSerial()) {
                    html.push('<span class="b">' + rootElement.lang.device_serial + ':</span>&nbsp;' + device.getSerial() + '<br/>');
                }
            }
            // 车架号 (和车辆判断显示一致)
            if (vehicle.getFrameNumber()) {
                if (standardVehicle.isShowMapPopItem("frame")) {
                    html.push('<span class="b">' + rootElement.lang.vehicle_frameNumber + ':</span>&nbsp;' + vehicle.getFrameNumber() + '<br/>');
                }
            }

            //经度纬度
            //轨迹回放页面
            if (this.address && isBackPlay) {
                ret.position = this.address;
            }
            if (standardVehicle.isShowMapPopItem("position")) {
                html.push('<span class="b">' + rootElement.lang.monitor_labelPosition + '</span><span id="position">' + ret.position + '</span><br/>');
            }


        }
    }

    var alarm = [];
    var normal = [];
    var alarmType = []; //报警类型
    //解析状态报警  与客户端保持一致
    //取得GPS状态 基本信息
    var gpsStatus_ = this.getGpsStatus(device, isBackPlay);

    //取得视频状态  媒体信息
    var vedioStatus_ = this.getVideoStatus(device);


    //在线/离线
    //网络类型
    //--非轨迹回放  this.network 0 //3G  1//Wifi 2//有线  3//4G  其他情况 unknow net type
    if (gpsStatus_.normal != '') {
        normal.push(gpsStatus_.normal);
    }
    if (gpsStatus_.alarm != '') {
        alarm.push(gpsStatus_.alarm);
    }
    // 限速值（已经转换单位）
    if (typeof gpsStatus_.limitSpeed != 'undefined' ) {
        ret.limitSpeed = gpsStatus_.limitSpeed;
    }
    if (isBackPlay && gpsStatus_.alarmType) {
        alarmType.push(gpsStatus_.alarmType);
    }
    if (vedioStatus_.normal != '') {
        normal.push(vedioStatus_.normal);
    }
    if (vedioStatus_.alarm != '') {
        alarm.push(vedioStatus_.alarm);
    }


    //非轨迹回放界面
    if (vehicle.getIsDisable() && !isBackPlay) {//车辆处于停用，维护 ，欠费 或者设备停用
        // alarm = [];
        // normal = [];
        //  alarm.push(vehicle.getUseString());
        alarm.unshift(vehicle.getUseString());
    }

    // 开启允许服务到期监控也要显示服务过期
    if (!vehicle.isServicePeriod() && !isBackPlay) {
        //  alarm = [];
        // normal = [];
        alarm.unshift(rootElement.lang.service_period);
    }
    if (vehicle.isServicePeriod() && !vehicle.isServicePeriodEx() && !isBackPlay) {
        alarm.unshift(rootElement.lang.service_period);
    }
    //正常状态
    if (standardVehicle.isShowMapPopItem("normal")) {
        html.push('<span class="b">' + rootElement.lang.monitor_labelNormal + '</span><span style="word-wrap: break-word;">' + normal.toString() + '</span><br/>');
    }

    //传感器
    var sensorCount = 0;
    if (standardVehicle.isShowMapPopItem("sensor") && device != null && device.getTempCount() != null && device.getTempCount() > 0) {
        //温度传感器
        // var temperature_ = device.getTemperature();
        var temperature_ = this.getTemperature(device.tempCount, device.tempName, device.sensorType, device.SENSORTYPE_TEMP);
        if (temperature_ && temperature_.length > 0) {
            for (var i = 0; i < temperature_.length; i++) {
                if (sensorCount != 0 && sensorCount % 2 != 0) {
                    html.push('&nbsp;&nbsp;&nbsp;&nbsp;');
                }
                html.push('<span class="b">' + temperature_[i].name + ":" + '</span>' + temperature_[i].value);
                normal.push(temperature_[i].name + ":" + temperature_[i].value);
                sensorCount++;
                if (sensorCount != 0 && sensorCount % 2 == 0) {
                    html.push('<br/>');
                }
            }
        }

        //氧气传感器
        // var oxygen_ = device.getOxygen();
        var oxygen_ = this.getTemperature(device.tempCount, device.tempName, device.sensorType, device.SENSORTYPE_OXYGEN);
        if (oxygen_ && oxygen_.length > 0) {
            for (var i = 0; i < oxygen_.length; i++) {
                if (sensorCount != 0 && sensorCount % 2 != 0) {
                    html.push('&nbsp;&nbsp;&nbsp;&nbsp;');
                }
                html.push('<span class="b">' + oxygen_[i].name + ":" + '</span>' + oxygen_[i].value);
                normal.push(oxygen_[i].name + ":" + oxygen_[i].value);
                sensorCount++;
                if (sensorCount != 0 && sensorCount % 2 == 0) {
                    html.push('<br/>');
                }
            }
        }

        //湿度传感器
        // var humidity_ = device.getHumidity();
        var humidity_ = this.getTemperature(device.tempCount, device.tempName, device.sensorType, device.SENSORTYPE_HUMIDITY);
        if (humidity_ && humidity_.length > 0) {
            for (var i = 0; i < humidity_.length; i++) {
                if (sensorCount != 0 && sensorCount % 2 != 0) {
                    html.push('&nbsp;&nbsp;&nbsp;&nbsp;');
                }
                html.push('<span class="b">' + humidity_[i].name + ":" + '</span>' + humidity_[i].value);
                normal.push(humidity_[i].name + ":" + humidity_[i].value);
                sensorCount++;
                if (sensorCount != 0 && sensorCount % 2 == 0) {
                    html.push('<br/>');
                }
            }
        }

        // 油量传感器
        // var oil_ = device.getOil();
        var oil_ = this.getTemperature(device.tempCount, device.tempName, device.sensorType, device.SENSORTYPE_OIL);
        if (oil_ && oil_.length > 0) {
            for (var i = 0; i < oil_.length; i++) {
                if (sensorCount != 0 && sensorCount % 2 != 0) {
                    html.push('&nbsp;&nbsp;&nbsp;&nbsp;');
                }
                html.push('<span class="b">' + oil_[i].name + ":" + '</span>' + oil_[i].value);
                normal.push(oil_[i].name + ":" + oil_[i].value);
                sensorCount++;
                if (sensorCount != 0 && sensorCount % 2 == 0) {
                    html.push('<br/>');
                }
            }
        }

        // 今日里程
        // var mile_ = device.getMileage();
        var mile_ = this.getTemperature(device.tempCount, device.tempName, device.sensorType, device.SENSORTYPE_MILEAGE);
        mile_ = null;
        if (mile_ && mile_.length > 0) {
            for (var i = 0; i < mile_.length; i++) {
                if (sensorCount != 0 && sensorCount % 2 != 0) {
                    html.push('&nbsp;&nbsp;&nbsp;&nbsp;');
                }
                html.push('<span class="b">' + mile_[i].name + ":" + '</span>' + mile_[i].value);
                normal.push(mile_[i].name + ":" + mile_[i].value);
                sensorCount++;
                if (sensorCount != 0 && sensorCount % 2 == 0) {
                    html.push('<br/>');
                }
            }
        }
        // 电压传感器
        // var voltage = device.getVoltage();
        var voltage = this.getTemperature(device.tempCount, device.tempName, device.sensorType, device.SENSORTYPE_VOLTAGE);
        if (voltage && voltage.length > 0) {
            for (var i = 0; i < voltage.length; i++) {
                if (sensorCount != 0 && sensorCount % 2 != 0) {
                    html.push('&nbsp;&nbsp;&nbsp;&nbsp;');
                }
                html.push('<span class="b">' + voltage[i].name + ":" + '</span>' + voltage[i].value);
                normal.push(voltage[i].name + ":" + voltage[i].value);
                sensorCount++;
                if (sensorCount != 0 && sensorCount % 2 == 0) {
                    html.push('<br/>');
                }
            }
        }
        // 酒精传感器
        // var alcohol_ = device.getAlcohol();
        var alcohol_ = this.getTemperature(device.tempCount, device.tempName, device.sensorType, device.SENSORTYPE_ALCOHOL);
        if (alcohol_ && alcohol_.length > 0) {
            for (var i = 0; i < alcohol_.length; i++) {
                if (sensorCount != 0 && sensorCount % 2 != 0) {
                    html.push('&nbsp;&nbsp;&nbsp;&nbsp;');
                }
                html.push('<span class="b">' + alcohol_[i].name + ":" + '</span>' + alcohol_[i].value);
                normal.push(alcohol_[i].name + ":" + alcohol_[i].value);
                sensorCount++;
                if (sensorCount != 0 && sensorCount % 2 == 0) {
                    html.push('<br/>');
                }
            }
        }
        if (sensorCount % 2 != 0) {
            html.push('<br/>');
        }
    }
    //司机 //新天地不显示司机
    if (standardVehicle.isShowMapPopItem("driver")) {
        if (!vehicle.isPeopleTerminal()) {
            if (!this.isXinTianDi()) {
                ret.driverId = this.getDriverId();
                if (ret.driverId) {
                    if (this.getDriverInfo()) { //司机信息
                        ret.driver = this.getDriverInfo();
                    } else {
                        // ret.driver = "ID_" + ret.driverId;
                    }
                }
                if (ret.driver && ret.driver != " ") {
                    //司机
                    html.push('<span class="b">' + rootElement.lang.monitor_labelDriver + '</span>&nbsp;' + ret.driver + '<br/>');
                }
            }
        }
    }
    // 正反转判断
    if (standardVehicle.isShowMapPopItem("reverse")) {
        var devTurnStatusEx = this.getDevTurnStatusEx();
        var forwardOrReverse = "";//正反转
        if (devTurnStatusEx.normal) {
            forwardOrReverse += devTurnStatusEx.normal;
        }
        if (devTurnStatusEx.alarm) {
            if (forwardOrReverse) {
                forwardOrReverse += ",";
            }
            forwardOrReverse += devTurnStatusEx.alarm;
        }
        if (forwardOrReverse) {
            ret.forwardOrReverse = forwardOrReverse;
            normal.push(forwardOrReverse);
            html.push('<span class="b">' + rootElement.lang.forwardOrReverse + ":" + '</span>&nbsp;' + forwardOrReverse + '<br/>');
        }
    }
    // 车辆具备905协议 空车/重车
    if (standardVehicle.isShowMapPopItem("heavy")) {
        var taxiStatus_ = this.getEmptyTaxiStatus();
        if (taxiStatus_.hasOwnProperty("isTaxi")) {
            var emptyOrHeavy = rootElement.lang.taxi_status_empty;// 空车
            if (taxiStatus_.hasOwnProperty("isWeigthStatus")) {
                emptyOrHeavy = rootElement.lang.taxi_status_weight;// 重车
            }
            ret.emptyOrHeavy = emptyOrHeavy;
            normal.push(emptyOrHeavy);
            html.push('<span class="b">' + rootElement.lang.emptyOrHeavy + ":" + '</span>&nbsp;' + emptyOrHeavy + '<br/>');
        }
    }
    // 车辆具备渣土车  空载 /重载
    if (standardVehicle.isShowMapPopItem("heavyLoad")) {
        var muckTruckStatus_ = this.getMuckTruckStatus();
        var emptyOrHeavyLoad = "";
        if (muckTruckStatus_.hasOwnProperty("weigthStatus")) {
            emptyOrHeavyLoad = muckTruckStatus_.weigthStatus;// 空载
            ret.emptyOrHeavyLoad = emptyOrHeavyLoad;
            normal.push(emptyOrHeavyLoad);
            html.push('<span class="b">' + rootElement.lang.emptyOrHeavyLoad + ":" + '</span>&nbsp;' + emptyOrHeavyLoad + '<br/>');
        }
    }

    //电子路单
//	电子运单在jt808_report_dirve_status表有一份,实时报警也能收到
    if (standardVehicle.isShowMapPopItem("wayBill")) {
        if (this.wayBill) {
            //电子路单
            html.push('<span class="b red">' + rootElement.lang.wayBill_map_tips + '</span>&nbsp;<span>' +
                +'' + this.wayBill + '</span><br/>');
        }
    }

//	数据压缩只有实时报警能收到
    var alarmString = alarm.toString();
    var normalString = normal.toString();
    //报警
    //if (!vehicle.isPeopleTerminal()) {
    //有报警才显示
    if (alarmString != '') {
        //报警
        if (standardVehicle.isShowMapPopItem("alarm")) {
            html.push('<span class="b red">' + rootElement.lang.monitor_labelAlarm + '</span>&nbsp;<span class="red">' + alarmString + '</span><br/>');
        }
    }
    //}
    //非人员设备
    html.push('</font>');

    //判断报警状态，这边写死
    ret.normal = normalString;
    //油量
    if (ret.youLiang) {
        if (ret.normal != '') {//状态
            ret.normal += ",";
        }
        ret.normal += ret.youLiang;
    }
    ret.alarm = alarmString;
    ret.alarmType = alarmType.toString();
    ret.image = 0;	//正常状态

    var vehiIconColor = getVehiIconColor();
    ret.color = vehiIconColor.online;
    ret.parked = false;
    // 轨迹回放的：报警(3) > 未定位(2)>停车(4) > 怠速(10)>在线(0)
    if ((this.isValid() && this.isGpsValid()) && !this.isDeviceStop()) {
        //是否停车
        //  ret.isWeigthStatus = false;
        var taxiStatus = this.getEmptyTaxiStatus();
        // ret.isWeigthStatus = true;
        var muckTruckStatus = this.getMuckTruckStatus();
        // 判断车辆地图设备是否渣土车或出租车
        /* if (taxiStatus.hasOwnProperty("isWeigthStatus") || muckTruckStatus.hasOwnProperty("isWeigthStatus")) {
            // 待处理！李德超
            ret.image = 9; 
            ret.color = "#000080";
        } else*/
        if (this.isParkedNew()) {
            ret.parked = true;
            ret.isParked = true;//轨迹回放使用，停车过滤，怠速按停车处理
            ret.image = 4;	//停车
            ret.color = vehiIconColor.stopaccoff;
        } else {//判断是否为静止，并且ACC开启
            if (this.isIdling()) {
                ret.image = 9;	//停车未熄火， 怠速
                ret.isParked = true;//轨迹回放使用，停车过滤，怠速按停车处理
                ret.color = vehiIconColor.stopaccon;
                // 轨迹回放中，怠速点也判断为停车点(只改图标不改颜色)
                if (isBackPlay) {
                    ret.image = 4;
                }
            }
        }
    } else {//定位无效
        ret.image = 2;	//无效
        ret.color = vehiIconColor.parkaccon;
    }
    if (isBackPlay) {
        ret.isParked = this.isParkedNew() || this.isIdling();
    }

    // 离线>未定位(2)>报警(3) >停车(4)/怠速(10)>在线(0)
    // 额外判断
    // 1.车辆离线不判断其它状态直接显示为离线 【目前就是离线图标优先级最高】
    // 2.车辆在线需要判断GPS是否有效，GPS无效直接显示为GPS无效状态
    // 3.GPS有效，需要判断是否有报警，有报警直接显示为报警状态
    // 4.没有报警需要判断速度，速度大于0的时候车辆是在线状态
    // 5.速度为0的时候需要判断ACC状态，ACC开怠速，ACC关是停车
    if ($.trim(alarmString) != '') {
        ret.image = 3;	//报警状态
        ret.color = document.documentElement.style.getPropertyValue('--color-red') || window.color_red;
    }
    // 轨迹回放判断是否有效gps
    if (!ret.isGpsValid || !this.isGpsValid()) {
        //定位无效
        ret.image = 2;
        ret.color = vehiIconColor.parkaccon;
    }


    ret.statusString = html.join("");
    return ret;
}

//判断出租车是否空车/重车
standardStatus.prototype.getEmptyTaxiStatus = function () {
    var ret = {};
    if (this.isTaxi905Protocol()) {
        //0位:0：未预约；1：预约(任务车)
        //1位:0：默认；1：空转重
        //2位:0：默认；1：重转空
        //3位:0：空车；1：重车
        //4位:0：车辆未锁定；1：车辆锁定
        //5位:0：未到达限制营运次数/时间；1：已达到限制营运次数/时间
        //6位:0 计程计价装置未锁；1：计程计价装置被锁定
        //21位:为1表示当前车内人数有效
        //22位:为1表示存储设备状态有效
        //23位:为1表示摄像头状态有效
        //unsigned int uiPeopleCur : 8;        //当前车内人数
        //  sensor4
        if (this.sensor4 != null) {
            var taxiStatus = this.sensor4 & 0x0FFFFFF;
            if ((taxiStatus >> 3 & 1) == 1) {
                ret.isWeigthStatus = true;
            }
        }
        // 用于判断是
        ret.isTaxi = true;
    }
    return ret;
}
//解析渣土车信息
//装载百分比（0时为不显示）,
//举升(1显示为举升，0不显示）, 开盖或合盖，重量:xxx.xxx吨
standardStatus.prototype.getMuckTruckStatus = function () {
    var ret = {};
    //国标协议
    if (this.isGuoBiao()) {
        // 2,20=需要和1,19合并判断   1,19:0表示空载 1表示满载  2,20:1表示半载
        if (this.status3 != null) {
            if ((this.status3 >> 20) & 1 > 0 && (this.status2 >> 19) & 1 > 0) {
            } else if ((this.status3 >> 20) & 1 > 0) {
                ret.weigthStatus = rootElement.lang.half_load;
                ret.isWeigthStatus = true;
            } else if ((this.status2 >> 19) & 1 > 0) {
                ret.weigthStatus = rootElement.lang.loaded;
                ret.isWeigthStatus = true;
            } else {
                ret.weigthStatus = rootElement.lang.load;
            }
        }
    }
    return ret;
}

/**
 * 是否能解析电子锁
 * 使用胎压数据
 * @returns {boolean}
 */
standardStatus.prototype.isCanParseElectronicLock = function () {
    if (this.isLongGps() && ((this.longStatus >> 24) & 1) > 0) {
        return true;
    }
    return false;
};

/**
 * 模拟量
 * @returns {boolean}
 */
standardStatus.prototype.isParseSimulationSupport = function () {
    if (this.isLongGps() && ((this.longStatus >> 25) & 1) > 0) {
        return true;
    }
    return false;
};

/**
 * 设备是否支持电子锁
 * @param device
 * @returns {boolean}
 */
standardStatus.prototype.isElectronicLockSupport = function (device) {
    if (device && typeof device.isElectronicLockSupport == 'function' &&
        device.isElectronicLockSupport()) {
        return true;
    }
    return false;
}

/**
 * 解析电子锁状态
 * @returns {number}
 */
standardStatus.prototype.parseElectronicLockStatus = function (normal, alarm) {
    var normalStr = [];
    var alarmStr = [];
    var tireSize = parseInt(this.tirePpressures.length / 2);
    var tire_ = [];
    if (tireSize > 0) {
        for (var int = 0; int < tireSize; int++) {
            // 从左往右截取的
            tire_.push(this.tirePpressures.slice(int * 2, int * 2 + 2));
        }
        // 不足30追加
        while (tire_.length < 30) {
            tire_.push("00");
        }
    }
    if (tire_.length >= 12) {
        //锁ID
        var szLockDevID = '';
        for (var i = 0; i < 10; i++) {
            //ASCII码
            szLockDevID += String.fromCharCode('0x' + tire_[i]);
        }
        normalStr.push(rootElement.lang.lock_id + ':' + szLockDevID);
    }
    if (tire_.length >= 27) {
        //卡号
        var szLockCardID = '';
        for (var i = 12; i < 22; i++) {
            //ASCII码
            szLockCardID += String.fromCharCode('0x' + tire_[i]);
        }
        if ((parseInt("0x" + tire_[27] + tire_[26]) >> 5) & 1) {
            if (!szLockCardID.startWith('FFFFFFFFFF')) {
                normalStr.push(rootElement.lang.unlock + '(' + rootElement.lang.driver_swipe_number + ":" + szLockCardID + ")");
            } else {
                normalStr.push(rootElement.lang.unlock);
            }
        } else {
            normalStr.push(rootElement.lang.lock);
        }

    }

    //电池电量
    if (tire_.length >= 25) {
        normalStr.push(rootElement.lang.electric + ":" + parseInt('0x' + tire_[24]) + '%');
    }
    //锁状态和告警信息
    if (tire_.length >= 28) {
        var str = parseInt('0x' + tire_[26] + tire_[27]);
        if (str & 1) {
            alarmStr.push(rootElement.lang.alarm_name_1003);
        }
        if ((str >> 1) & 1) {
            alarmStr.push(rootElement.lang.alarm_name_1004);
        }
        if ((str >> 2) & 1) {
            alarmStr.push(rootElement.lang.alarm_name_1005);
        }
        if ((str >> 3) & 1) {
            alarmStr.push(rootElement.lang.alarm_name_1006);
        }
        if ((str >> 4) & 1) {
            alarmStr.push(rootElement.lang.alarm_name_1007);
        }
        if ((str >> 6) & 1) {
            alarmStr.push(rootElement.lang.alarm_name_1008);
        }
        if ((str >> 7) & 1) {
            alarmStr.push(rootElement.lang.alarm_name_1009);
        }
        if ((str >> 8) & 1) {
            alarmStr.push(rootElement.lang.alarm_name_1010);
        }
        if ((str >> 9) & 1) {
            alarmStr.push(rootElement.lang.alarm_name_1012);
        }
    }

    normal.push(normalStr.join(','));
    alarm.push(alarmStr.join(","))
}

/**
 * 日流量預警
 * @returns {boolean}
 */
standardStatus.prototype.isDayRestricted = function () {
    var temp = (this.status2 >> 8) & 1;
    if (temp > 0) {
        return true;
    } else {
        return false;
    }
};

/**
 * 月流量預警
 * @returns {boolean}
 */
standardStatus.prototype.isMonthRestricted = function () {
    var temp = (this.status2 >> 10) & 1;
    if (temp > 0) {
        return true;
    } else {
        return false;
    }
};

standardStatus.prototype.getForwardStatus = function (text) {
    var array = [];
    var forwardOrReverse = '';
    if (rootElement.enableShowForwardReverseStatus) {
        forwardOrReverse = this.getDevTurnStatusEx().normal;
        if (forwardOrReverse) {
            array.push(forwardOrReverse);
        }
    }

    if (!forwardOrReverse && rootElement.enableShowParkStatus && this.isParkedNew()) {
        if (text.indexOf(rootElement.lang.monitor_vehicle_parked) == -1) {
            array.push(rootElement.lang.monitor_vehicle_parked);
        }
    }
    return array.join(',');
}