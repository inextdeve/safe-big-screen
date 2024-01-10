var rootElement = _getRootFrameElement();

/**
 * 每个报警有一个开始事件和1个结束事件
 */
function standardArmInfo() {
    this.devIdno = null;	//设备编号
    this.guid = null;		//String 	GUID是唯一的
    this.armTime = null;		//Date String  "2015-06-03 11:00:00"
    this.armType = null;		//int		alarmType
    this.armIinfo = null;		//int		alarmInfo  公交管理为线路id, 危化区域为区域ID
    this.param1 = null;			//int		param1  公交管理为司机id
    this.param2 = null;			//int		param2  公交管理为前一个报站站点
    this.param3 = null;			//int		param3  公交管理为前一个报站时间  utc时间
    this.param4 = null;			//int		param4
    this.desc = null;		//string	szDesc  //禁行区域、线路等 车牌号;区域名称;运单号
    this.imgFile = null;		//string	szImgFile
    this.startType = null;	//int		startAlarmType
    this.handle = null;			//int		handle
    this.reserve = null;    //int (录像时长)秒
    this.srcAlarmType = null; //int (1是图片，2是录像)
    this.srcTime = null;     //Date String  "2015-06-03 11:00:00"s (录像开始时间)
    this.status = new standardStatus();
    this.baseAlarm = null;//文件报警来源
    this.cache = false;//是否缓存报警
}


standardArmInfo.prototype.setAlarm = function (alarm) {
    this.devIdno = alarm.DevIDNO;	//设备编号
    //guid去汉字和特殊字符
    var isNum = /[^\w\.\/]/ig;
    if (isNum.test(alarm.guid)) {
        alarm.guid = alarm.guid.replace(isNum, '');
    }
    this.guid = alarm.guid;		//String 	GUID是唯一的
    this.armTime = alarm.time;		//Date String  "2015-06-03 11:00:00"
    this.armType = alarm.type;		//int		alarmType
    this.armIinfo = alarm.info;		//int		alarmInfo
    this.param1 = alarm.p1;			//int		param1
    this.param2 = alarm.p2;			//int		param2
    this.param3 = alarm.p3;			//int		param3
    this.param4 = alarm.p4;			//int		param4
    this.desc = alarm.desc;		//string	szDesc
    this.imgFile = alarm.img;		//string	szImgFile
    this.startType = alarm.stType;	//int		startAlarmType
    this.handle = alarm.hd;			//int		handle
    this.reserve = alarm.rve;    //int (录像时长)
    this.srcAlarmType = alarm.srcAt; //int (1是图片，2是录像)
    this.srcTime = alarm.srcTm;     //Date String  "2015-06-03 11:00:00"s (录像开始时间)
    if (alarm.Gps) {
        this.status.setStatus(alarm.Gps);
    }
    if (alarm.startPos) {
        this.startPos = alarm.startPos;
    }
    /*	if(alarm.Gps && alarm.Gps.pk){// 文件上传时  改字段为报警来源  暂时屏蔽
		this.baseAlarm = alarm.Gps.pk;
	}*/
};

standardArmInfo.prototype.getDevIdno = function () {
    return this.devIdno;
};

standardArmInfo.prototype.getArmType = function () {
    return this.armType;
};

standardArmInfo.prototype.getArmTime = function () {
    return this.armTime;
};

standardArmInfo.prototype.getLngLat = function () {
    return this.status.getLngLat();
};

standardArmInfo.prototype.getLngLatStr = function () {
    return this.status.getLngLatStr();
};

standardArmInfo.prototype.getLastLngLatStr = function () {
    return this.status.getLastLngLatStr();
};

standardArmInfo.prototype.getMapLngLat = function () {
    return this.status.getMapLngLat();
};

standardArmInfo.prototype.getMapLngLatStr = function () {
    return this.status.getMapLngLatStr();
};

/*
 * 报警类型和开始类型不一样的时候，就是为结束报警
 */
standardArmInfo.prototype.isStart = function () {
    //中石油临时路单
    //param[0]:0位 时间超时 1位:距离超时 2位:表示报警结束
    if (this.armType == 149) {
        if ((this.param1 & 4) > 0) {
            return false;
        } else {
            return true;
        }
    } else {
        if (this.startType == this.armType || this.startType == 0) {
            return true;
        } else {
            return false;
        }
    }
};

/**
 * 每个报警有自己的guid
 */
function standardAlarm(guid, type) {
    this.guid = guid;	//报警guid
    this.type = type;	//报警类型，此类型为开始类型
    this.startAlarm = null;	//开始报警事件
    this.endAlarm = null;	//结束报警事件
}

/**
 * 更新报警信息
 */
standardAlarm.prototype.setAlarm = function (alarm) {
    if (alarm.isStart()) {
        this.startAlarm = alarm;
    } else {
        this.endAlarm = alarm;
    }
};

/**
 * 获取报警状态(默认都是开始报警)
 * @param alarm
 */
standardAlarm.prototype.getAlarmStatus = function () {
    if (this.startAlarm && this.startAlarm.status) {
       return  this.startAlarm.status;
    } else if (this.endAlarm && this.endAlarm.status) {
        return  this.endAlarm.status;
    }
    return null;
};


/**
 * 返回  报警类型，报警描述，开始时间，开始位置，结束时间，结束位置
 * isAnalStart 是否解析开始或者结束状态
 */
standardAlarm.prototype.parseAlarmInfo = function (isAnalStart) {


    var ret = {};
    //开始报警
    if (this.startAlarm != null) {
        // 临时

        ret.idno = this.startAlarm.getDevIdno();
        ret.startTime = this.startAlarm.getArmTime();
        var point = this.startAlarm.getMapLngLatStr();
        var pos = this.startAlarm.getLngLatStr();
        if (pos == "") {
            pos = this.startAlarm.getLastLngLatStr();
        }
        if (point == null || pos == '0,0' || pos == '0.000000,0.000000') {
            pos = rootElement.lang.monitor_gpsUnvalid;
            ret.isStartGpsValid = false;
        } else {
            ret.isStartGpsValid = true;
        }
        ret.startPos = pos;
        ret.startMapLngLat = point;
        ret.armType = this.startAlarm.getArmType();
    } else {
        if (this.endAlarm != null && this.cache) {
            ret.startTime = this.endAlarm.srcTime || '';
            ret.startPos = this.endAlarm.startPos || '';
        } else {
            ret.startTime = "";
            ret.startPos = '';
        }
        ret.startMapLngLat = "";
    }
    //结束报警
    if (this.endAlarm != null) {

        ret.idno = this.endAlarm.getDevIdno();
        ret.endTime = this.endAlarm.getArmTime();
        var point = this.endAlarm.getMapLngLatStr();
        var pos = this.endAlarm.getLngLatStr();
        if (point == null || pos == '0,0' || pos == '0.000000,0.000000') {
            pos = rootElement.lang.monitor_gpsUnvalid;
            ret.isEndGpsValid = false;
        } else {
            ret.isEndGpsValid = true;
        }
        ret.endPos = pos;
        ret.endMapLngLat = point;
        ret.armType = this.endAlarm.getArmType();
    } else {
        ret.endTime = "";
        ret.endPos = "";
        ret.endMapLngLat = "";
    }
    ret.cache = this.cache;
    //报警描述，具体问下邓工，让邓工把客户端解析代码给过来
    if (ret.armType) {
        var data = this.getFormatMDVRAlarmString(ret.armType);
        if (ret.armType == 149) {//中石油 临时路单
            ret.type = data.strType;
            ret.desc = data.strDesc;
            if (data.startTime) {
                ret.startTime = dateFormat2TimeString(new Date(data.startTime * 1000));
            }
        } else if (ret.armType == 130) {
            //如果是录像下载完成事件
            ret.time = data.endTime;  //下载完成时间
            if (data.srcAlarmType != 5) {//非音频文件
                ret.recType = data.param3; //表示报警，还是常规
            }
            ret.chn = data.param1;  //通道
            ret.size = data.param2; //文件大小
            ret.loc = data.param4;//存储位置 2存储服务器 4下载服务器
            ret.src = data.imgFile;  //路径
            ret.res = data.reserve;  //录像时长
            ret.srcType = data.srcAlarmType; //1是图片，2是录像   3音频
            ret.bgTime = data.srcTime;  //录像开始时间
            ret.svr = data.armIinfo;  //服务器ID
            ret.baseAlarm = data.baseAlarm;  //报警来源
            ret.server = data.server;

        } else if (ret.armType == 113) {
            if (data.armIinfo == 19) {
                //离线任务通知
                //param1 == 1 {//下发图片文件
                //2	//升级文件 设备升级
                //3	//下发设备参数配置文件
                //4  /wifi围栏开关
                if (data.param2 == 1) {//0:未执行 1.任务中 2.成功3.失败
                    ret.startTime = data.time;
                    ret.startPos = data.pos;
                    ret.startMapLngLat = data.point;
                    ret.isStartGpsValid = data.isGpsValid;
                } else {
                    ret.endTime = data.time;
                    ret.endPos = data.pos;
                    ret.endMapLngLat = data.point;
                    ret.isEndGpsValid = data.isGpsValid;
                }
                ret.time = data.time;
                ret.armIinfo = data.armIinfo;
                ret.type = data.strType;
                ret.status = data.strDesc;

                //49水位增加 和 水位减少50
            } else if (data.armIinfo == 49 || data.armIinfo == 50) {
                ret.startTime = data.time;
                ret.vehiIdno = data.vehiIdno;
                ret.armIinfo = data.armIinfo;
                ret.type = data.strType;
                ret.desc = data.strDesc;
            } else if (data.armIinfo == 44 || data.armIinfo == 45) {
                //上报实时视频（客户端做主动视频弹出）
                //停止上报实时视频（客户端把主动弹出的视频关闭掉）
                //param1  表示 通道号，param2表示码流类型
                ret.channel = data.param1;
                ret.stream = data.param2;
                ret.armIinfo = data.armIinfo;
                ret.type = data.strType;
                ret.desc = data.strDesc;
                ret.closeTime = data.param3;
            } else if (data.armIinfo == 62) {//
                //驾驶员身份库数据下载应答
//				param[0]:应答结果 0：成功，1：失败
//				param[1]:应答流水号
//				param[2]+高8位:需要下载总数 param[2]+低8位:当前下载到第几个文件
//				desc:人脸ID
                ret.type = data.strType;
                ret.desc = data.strDesc;
                ret.result = data.param2;
                ret.armIinfo = data.armIinfo;
            } else if (data.armIinfo == 66) {//
                ret.type = data.strType;
                ret.desc = data.strDesc;
                ret.armIinfo = data.armIinfo;
                ret.param1 = data.param1;
            } else if (data.armIinfo == 64 || data.armIinfo == 65) {
                // 渣土车驾驶员信息设置应答(64),驾驶员身份识别上报(65)
                ret.type = data.strType;
                ret.desc = data.strDesc;
                ret.armIinfo = data.armIinfo;
                ret.result = data.param2;
                if (data.armIinfo == 64) {
                    ret.result = 0;
                }
            } else if (data.armIinfo == 67) {//
                ret.type = data.strType;
                ret.desc = data.strDesc;
                ret.armIinfo = data.armIinfo;
                ret.param1 = data.param1;
                ret.result = data.param2;
            } else if (data.armIinfo == 53) {//
                ret.type = data.strType;
                ret.desc = data.strDesc;
                ret.result = data.param3;
                ret.armIinfo = data.armIinfo;
            } else if (data.armIinfo == 59) {//
                ret.type = data.strType;
                ret.desc = data.strDesc;
                ret.result = data.result;
                ret.armIinfo = data.armIinfo;
            }
        } else if (ret.armType == 232 || ret.armType == 233 || ret.armType == 234
            || ret.armType == 282 || ret.armType == 283 || ret.armType == 284) {
            //禁行区域 //禁行线路//异地车辆入境
            ret.type = data.strType;
            if (data.strMark) {
                ret.type += ' ' + data.strMark;
            }
            ret.desc = data.strDesc;
            ret.vehiIdno = data.vehiIdno;
            ret.waybillNum = data.waybillNum;
        }/*else if(ret.armType == 240 ) {
			ret.status = data.strType;
			ret.time = data.time;
			ret.position = data.pos;
			ret.mapLngLat = data.point;
			ret.desc = data.strDesc;
		}*/ else {
            ret.type = data.strType;
            ret.strType = data.strType;
            if (isAnalStart && data.strMark) {
                ret.type += ' ' + data.strMark;
            }

            ret.desc = data.strDesc;
        }
    } else {
        //报警类型
        var data = this.getFormatMDVRAlarmString(this.type);
        if (data) {
            ret.strType = data.strType;
            ret.type = data.strType;
        }
        ret.desc = '';
    }

    ret.color = document.documentElement.style.getPropertyValue('--color-red') || window.color_red;
    return ret;
};


/**
 * 获取油量字符串
 */
standardAlarm.prototype.getOilString = function (oil, devIdno) {
    if (devIdno) {
        if (rootElement.vehicleManager && typeof rootElement.vehicleManager.getDevice == 'function') {
            var dev = rootElement.vehicleManager.getDevice(devIdno);
            if (dev != null && dev.isWaterSense()) {
                return oil + ' ' + rootElement.lang.alarm_oil_unit;
            }
        }
    }
    return oil / 100.0 + ' ' + rootElement.lang.alarm_oil_unit;
}


/**
 * 判断是否川标2021
 */
standardAlarm.prototype.isChuanBiao2021ParamConfig = function (devIdno) {
    if (devIdno) {
        if (rootElement.vehicleManager && typeof rootElement.vehicleManager.getDevice == 'function') {
            var dev = rootElement.vehicleManager.getDevice(devIdno);
            if (dev != null && dev.isChuanBiao2021ParamConfig()) {
                return true;
            }
        }
    }
    return false;
}

/**
 * 获取水位字符串
 * @param water
 * @returns {string}
 */
standardAlarm.prototype.getWaterString = function (water) {
    return water + ' ' + rootElement.lang.alarm_oil_unit;
}

/**
 * 获取温度字符串
 */
standardAlarm.prototype.getTempString = function (temp) {
    return temp / 100.0 + ' ' + rootElement.lang.alarm_temperator_unit;
}

/**
 * 获取速度字符串
 */
standardAlarm.prototype.getSpeedString = function (speed) {
    return valueConversion(speed / 10.0) + ' ' + rootElement.lang.KmPerHour;
}

/**
 *  获取通道字符串(包含多个通道)
 *  @param chnInfo  通道
 *  @param single  单通道或者多通道
 */
standardAlarm.prototype.getChnString = function (devIdno, chnInfo, single) {
    var device = rootElement.vehicleManager.getDevice(devIdno);
    if (!device || !device.getChnName()) {
        return "";
    }
    var chnCount = device.getChnCount();
    var chnName = device.getChnName().split(',');
    chnInfo = Number(chnInfo);
    if (single) {
        if (chnInfo < chnName.length) {
            return chnName[chnInfo];
        } else {
            return 'CH' + (chnInfo + 1);
        }
    } else {
        var strName = [];
        for (var i = 0; i < chnCount; i++) {
            if ((chnInfo >> i) & 1 > 0) {
                strName.push(chnName[i]);
            }
        }
        return strName.toString();
    }
}

/**
 * 获取开始或者结束报警字符串
 */
standardAlarm.prototype.getAlarmStartEnd = function (type) {
    if (type == 1) {
        return rootElement.lang.alarm_start;
    } else {
        return rootElement.lang.alarm_end;
    }
}


//按照方浩的要求，每一个轮胎从组排列解析成几号轮胎
function analysisTireAlarmNumber(rawData, strDesc) {
//	var strDesc = [];
    var ssGroup = (rawData & 0x0FF) + "";						//组
    var ssRow = ((((rawData >> 8) & 0xFF) >> 4) & 0X0F) + "";			//排
    var ssColumn = (((rawData >> 8) & 0xFF) & 0X0F) + "";			//列
    var alarmTireNumber = ssGroup + ssRow + ssColumn;		//轮胎的编号
    var ATU = parseInt(alarmTireNumber);					//将解析好的轮胎的编号从字符串转换成数字

    if (ATU == 111) {
        strDesc += 1 + rootElement.lang.now_alarm_tire_number;
    } else if (ATU == 113) {
        strDesc += 2 + rootElement.lang.now_alarm_tire_number;
    } else if (ATU == 211) {
        strDesc += 3 + rootElement.lang.now_alarm_tire_number;
    } else if (ATU == 212) {
        strDesc += 4 + rootElement.lang.now_alarm_tire_number;
    } else if (ATU == 213) {
        strDesc += 5 + rootElement.lang.now_alarm_tire_number;
    } else if (ATU == 214) {
        strDesc += 6 + rootElement.lang.now_alarm_tire_number;
    } else if (ATU == 221) {
        strDesc += 7 + rootElement.lang.now_alarm_tire_number;
    } else if (ATU == 222) {
        strDesc += 8 + rootElement.lang.now_alarm_tire_number;
    } else if (ATU == 223) {
        strDesc += 9 + rootElement.lang.now_alarm_tire_number;
    } else if (ATU == 224) {
        strDesc += 10 + rootElement.lang.now_alarm_tire_number;
    } else if (ATU == 311) {
        strDesc += 11 + rootElement.lang.now_alarm_tire_number;
    } else if (ATU == 312) {
        strDesc += 12 + rootElement.lang.now_alarm_tire_number;
    } else if (ATU == 313) {
        strDesc += 13 + rootElement.lang.now_alarm_tire_number;
    } else if (ATU == 314) {
        strDesc += 14 + rootElement.lang.now_alarm_tire_number;
    } else if (ATU == 321) {
        strDesc += 15 + rootElement.lang.now_alarm_tire_number;
    } else if (ATU == 322) {
        strDesc += 16 + rootElement.lang.now_alarm_tire_number;
    } else if (ATU == 323) {
        strDesc += 17 + rootElement.lang.now_alarm_tire_number;
    } else if (ATU == 324) {
        strDesc += 18 + rootElement.lang.now_alarm_tire_number;
    } else if (ATU == 411) {
        strDesc += 19 + rootElement.lang.now_alarm_tire_number;
    } else if (ATU == 412) {
        strDesc += 20 + rootElement.lang.now_alarm_tire_number;
    } else if (ATU == 413) {
        strDesc += 21 + rootElement.lang.now_alarm_tire_number;
    } else if (ATU == 414) {
        strDesc += 22 + rootElement.lang.now_alarm_tire_number;
    } else if (ATU == 421) {
        strDesc += 23 + rootElement.lang.now_alarm_tire_number;
    } else if (ATU == 422) {
        strDesc += 24 + rootElement.lang.now_alarm_tire_number;
    } else if (ATU == 511) {
        strDesc += 25 + rootElement.lang.now_alarm_tire_number;
    } else if (ATU == 513) {
        strDesc += 26 + rootElement.lang.now_alarm_tire_number;
    } else {
        strDesc += "";
    }
    return strDesc;
}

/**
 * 获取GPS讯号丢失报警
 */
standardAlarm.prototype.getSignalLossAlarm = function (armType) {
    var strMark = '';
    if (armType == 18) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_gps_signal_loss;
    ret.strMark = strMark;
    return ret;
}

/**
 * 获取自定义报警
 */
standardAlarm.prototype.getUserDefineAlarm = function (armType) {
    var strMark = '';
    if (armType == 1) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_userDefine;
    ret.strMark = strMark;
    return ret;
}

/**
 * 获取IO报警
 */
standardAlarm.prototype.getIOAlarm = function (io, armType) {
    var alarm = null;
    var strMark = '';
    if (armType == 19 || armType == 20 || armType == 21 || armType == 22 || armType == 23 ||
        armType == 24 || armType == 25 || armType == 26 || armType == 41 || armType == 42 ||
        armType == 43 || armType == 44 ||
        armType == 1416 || armType == 1417 || armType == 1418 || armType == 1419 || armType == 1420 ||
        armType == 1421 || armType == 1422 || armType == 1423 || armType == 1424 || armType == 1425 ||
        armType == 1426 || armType == 1427
    ) {
        // strMark = this.getAlarmStartEnd(1);
        strMark = "";
        alarm = this.startAlarm;
    } else {
        // strMark = this.getAlarmStartEnd(0);
        strMark = "";
        alarm = this.endAlarm;
    }
    var ioName = '';


    var device;
    /*if(rootElement.myUserRole.isDispatcher()){
		device = rootElement.vehicleManager.getDispatchDevice(alarm.devIdno);
	}else{*/
    device = rootElement.vehicleManager.getDevice(alarm.devIdno);
    //}
    var ioInName = device.getIoInName();
    if (ioInName != null && ioInName != '') {
        var ioInNames = ioInName.split(',');
        if (ioInNames.length >= (Number(io) + 1)) {
            ioName = ioInNames[io];
        }
    }
    // 默认名称()
    if (ioName == '' && armType > 1400 && rootElement.lang["alarm_name_"+alarm.startType]) {
        ioName = rootElement.lang["alarm_name_"+alarm.startType];
    }
    if (ioName == '') {
        ioName = "IO_" + (Number(io) + 1);
    }
    var ret = {};
//	ret.strType =  rootElement.lang.alarm_type_io;
    ret.strType = ioName;
    ret.strMark = strMark;
    ret.strDesc = ioName;
    return ret;
}

/**
 * 获取紧急按钮报警
 */
standardAlarm.prototype.getUrgencyButtonAlarm = function (armType) {
    var strMark = '';
    var strDesc = '';
    if (armType == 2) {
        if (this.startAlarm.param1 == 1) {
            strDesc = ' 1 ' + rootElement.lang.second;
        } else if (this.startAlarm.param1 == 5) {
            strDesc = ' 5 ' + rootElement.lang.second;
        }
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_ungency_button;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}

/**
 * 获取振动报警(侧翻报警)
 */
standardAlarm.prototype.getShakeAlarm = function (armType) {
    var strMark = '';
    var strDesc = '';
    var alarm;
    if (armType == 3) {
        strMark = this.getAlarmStartEnd(1);
        alarm = this.startAlarm;
    } else {
        strMark = this.getAlarmStartEnd(0);
        alarm = this.endAlarm;
    }
    var ret = {};
    if (alarm.armIinfo != 0) {
        var direction = false;
        for (var i = 0; i <= 12; i++) {
            if ((alarm.armIinfo >> i) & 1 > 0) {
                switch (i) {
                    case 0:
                        strDesc += "X" + rootElement.lang.direction;
                        break;
                    case 1:
                        strDesc == "" ? strDesc += "Y" : strDesc += ",Y";
                        strDesc += rootElement.lang.direction;
                        break;
                    case 2:
                        strDesc == "" ? strDesc += "Z" : strDesc += ",Z";
                        strDesc += rootElement.lang.direction;
                        break;
                    case 3:
                        strDesc == "" ? strDesc += rootElement.lang.monitor_alarm_collision : strDesc += "," + rootElement.lang.monitor_alarm_collision;
                        break;
                    case 4:
                        strDesc == "" ? strDesc += rootElement.lang.monitor_alarm_rollover : strDesc += "," + rootElement.lang.monitor_alarm_rollover;
                        break;
                    case 5:
                        strDesc == "" ? strDesc += rootElement.lang.rollOver : strDesc += "," + rootElement.lang.rollOver;
                        break;
                    case 6:
                        strDesc == "" ? strDesc += rootElement.lang.headCollision : strDesc += "," + rootElement.lang.headCollision;
                        break;
                    case 7:
                        strDesc == "" ? strDesc += rootElement.lang.rearCollision : strDesc += "," + rootElement.lang.rearCollision;
                        break;
                    case 8:
                        strDesc == "" ? strDesc += rootElement.lang.leftSideCollision : strDesc += "," + rootElement.lang.leftSideCollision;
                        break;
                    case 9:
                        strDesc == "" ? strDesc += rootElement.lang.rightSideCollision : strDesc += "," + rootElement.lang.rightSideCollision;
                        break;
                    case 10:
                        strDesc == "" ? strDesc += rootElement.lang.alarm_type_rapidAcceleration : strDesc += "," + rootElement.lang.alarm_type_rapidAcceleration;
                        break;
                    case 11:
                        strDesc == "" ? strDesc += rootElement.lang.alarm_type_rapidDeceleration : strDesc += "," + rootElement.lang.alarm_type_rapidDeceleration;
                        break;
                    case 12:
                        strDesc == "" ? strDesc += rootElement.lang.sharpTurn : strDesc += "," + rootElement.lang.sharpTurn;
                        break;
                }
            }
        }
    }
    ret.strDesc = strDesc;
    ret.strType = rootElement.lang.alarm_type_shake;
    ret.strMark = strMark;
    return ret;
}

/**
 * 时间秒数转换为时分秒
 */
standardAlarm.prototype.getTimeDifference = function (second) {
    var difValue = "";
    var days = parseInt(second / (60 * 60 * 24), 10);
    var hours = parseInt(second / (60 * 60) - days * 24, 10);
    var minutes = parseInt(second / (60) - days * 24 * 60 - hours * 60, 10);
    var seconds = parseInt(second - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60, 10);
    if (days != 0) {
        difValue += days + ' ' + rootElement.lang.day;
    }
    if (hours != 0) {
        difValue += ' ' + hours + ' ' + rootElement.lang.hour;
    }
    if (minutes != 0) {
        difValue += ' ' + minutes + ' ' + rootElement.lang.minute;
    }
    if (seconds != 0) {
        difValue += ' ' + seconds + ' ' + rootElement.lang.second;
    }
    return difValue;
}

/**
 * 获取超时停车报警(支持解析结束)
 */
standardAlarm.prototype.getOvertimeParkAlarm = function (armType) {
    var alarm = null;
    var strKeepTime = '';
    var strSetTime = '';
    var strMark = '';
    if (armType == 14) {
        alarm = this.startAlarm;
        strMark = this.getAlarmStartEnd(1);
    } else {
        alarm = this.endAlarm;
        strMark = this.getAlarmStartEnd(0);
    }
    if (alarm.param2 != 0) {
        strKeepTime = rootElement.lang.alarm_park_labelParkTime + this.getTimeDifference(alarm.param2);
    } else if (alarm.armIinfo != 0) {
        strKeepTime = rootElement.lang.alarm_park_labelParkTime + this.getTimeDifference(alarm.armIinfo);
    }
    if (alarm.param1) {
        strSetTime = ', ' + rootElement.lang.alarm_park_labelSetTime + this.getTimeDifference(alarm.param1);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_overtimeParking;
    ret.strMark = strMark;
    ret.strDesc = strKeepTime + strSetTime;
    return ret;
}

/**
 * 获取视频丢失报警
 */
standardAlarm.prototype.getVideoLostAlarm = function (armType) {
    var alarm = null;
    var strMark = '';
    if (armType == 4) {
        alarm = this.startAlarm;
        strMark = this.getAlarmStartEnd(1);
    } else {
        alarm = this.endAlarm;
        strMark = this.getAlarmStartEnd(0);
    }

    var armInfo = alarm.armIinfo;
    var param1 = alarm.param1;
    if (!armInfo) {
        armInfo = 0;
    }
    if (!param1) {
        param1 = 0;
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_video_lost;
    ret.strMark = strMark;
    if (armInfo | param1) {
        ret.strDesc =  rootElement.lang.alarm_channel + ': ' + this.getChnString(alarm.getDevIdno(), armInfo | param1);
    }
    return ret;
}

/**
 * 获取摄像头遮挡报警
 */
standardAlarm.prototype.getVideoMaskAlarm = function (armType) {
    var strMark = '';
    if (armType == 5) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }

    var armInfo = alarm.armIinfo;
    var param1 = alarm.param1;
    if (!armInfo) {
        armInfo = 0;
    }
    if (!param1) {
        param1 = 0;
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_video_mask;
    ret.strMark = strMark;
    if (armInfo | param1) {
        ret.strDesc =  rootElement.lang.alarm_channel + ': ' + this.getChnString(alarm.getDevIdno(), armInfo | param1);
    }
    return ret;
}

/**
 * 获取非法开门报警
 */
standardAlarm.prototype.getDoorOpenLawlessAlarm = function (armType) {
    var strMark = '';
    if (armType == 6) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_door_open_lawless;
    ret.strMark = strMark;
    return ret;
}

/**
 * 获取密码错误三次报警
 */
standardAlarm.prototype.getWrongPwdAlarm = function (armType) {
    var strMark = '';
    if (armType == 7) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_erong_pwd;
    ret.strMark = strMark;
    return ret;
}

/**
 * 获取非法点火报警
 */
standardAlarm.prototype.getFireLowlessAlarm = function (armType) {
    var strMark = '';
    if (armType == 8) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_illegalIgnition;
    ret.strMark = strMark;
    return ret;
}

/**
 * 获取温度报警
 */
standardAlarm.prototype.getTemperatorAlarm = function (armType) {
    var strType = '';
    var strMark = '';
    var strDesc = '';
    if (armType == 9) {
        if (this.startAlarm.param1) {
            strType = rootElement.lang.report_low_temperature_alarm;
        } else {
            strType = rootElement.lang.report_high_temperature_alarm;
        }
        var device = rootElement.vehicleManager.getDevice(this.startAlarm.devIdno);
        var tempName = device != null ? device.getTempName() : '';
        var names = tempName.split(",");
        var name = '';
        if (names.length > this.startAlarm.armIinfo) {
            name = names[this.startAlarm.armIinfo];
        } else {
            name = "TEMP_" + Number(this.startAlarm.armIinfo + 1);
        }
        strMark = this.getAlarmStartEnd(1);
        strDesc = rootElement.lang.report_probe_no + ': ' + name + ";" + rootElement.lang.report_temp_current + ': ' + Number(this.startAlarm.param2 / 100.0);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
//	if(strType){
//		ret.strType = strType;
//	}else{
    ret.strType = rootElement.lang.alarm_type_temperator;
//	}
    if (strType) {
        strType += ";";
    }
    ret.strMark = strMark;
    ret.strDesc = strType + strDesc;
    return ret;
}

/**
 * 根据硬盘类型获取硬盘
 */
standardAlarm.prototype.getDiskType = function (type) {
    var strdisk = '';
    switch (type) {
        case 0:
        case 1:
            strdisk = rootElement.lang.alarm_hard_type + '(' + rootElement.lang.alarm_gps_sd + ')';
            break;
        case 2:
            strdisk = rootElement.lang.alarm_hard_type + '(' + rootElement.lang.alarm_gps_disk + ')';
            break;
        case 3:
            strdisk = rootElement.lang.alarm_hard_type + '(' + rootElement.lang.alarm_gps_ssd + ')';
            break;
    }
    return strdisk;
}

/**
 * 获取硬盘错误报警
 */
standardAlarm.prototype.getDiskErrAlarm = function (armType) {
    var alarm = null;
    var strMark = '';
    var strDesc = '';
    if (armType == 10) {
        alarm = this.startAlarm;
        strMark = this.getAlarmStartEnd(1);
    } else {
        alarm = this.endAlarm;
        strMark = this.getAlarmStartEnd(0);
    }
    //硬盘
    var ret = {};
    //参数 param[0] 存储器掩码 按位 BIT0-BIT11：1-12主存储器 BIT12-BIT15：1-4灾备存储， 相应为1表示故障
    if (alarm.param1) {
        var mNum = [];//主存储
        var sNum = [];//灾备
        for (var i = 0; i < 16; i++) {
            if (i < 12) {//第2位
                if ((alarm.param1 >> i) & 1 > 0) {
                    mNum.push((i + 1));
                }
            } else {
                if ((alarm.param1 >> i) & 1 > 0) {
                    sNum.push((i - 11));
                }
            }
        }
        if (mNum.length > 0) {
            strDesc += rootElement.lang.disk_primary_storage + "(" + mNum.toString() + ")";
        }
        if (sNum.length > 0) {
            if (strDesc != '') {
                strDesc += ",";
            }
            strDesc += rootElement.lang.disk_disaster_recovery + "(" + sNum.toString() + ")";
        }
    }

    // p[2]=6的时候,解析为存储单元故障报警
    var strType_ = rootElement.lang.alarm_type_disk_error;
    if (alarm.param3 && alarm.param3 == 6) {
        strType_ = rootElement.lang.alarm_type_memory_cell_fault;
    }
    var ret = {};
    ret.strType = strType_;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;

}


//
//	if(armType == 244) {
//		strMark =  this.getAlarmStartEnd(1);
//	}else {
//		strMark =  this.getAlarmStartEnd(0);
//	}
//	var ret = {};
//	ret.strType =  rootElement.lang.abnormal_drive;
//	ret.strMark = strMark;
//	ret.strDesc =  types.toString();
//	return ret;


/**
 * 获取超速报警
 */
standardAlarm.prototype.getOverSpeedAlarm = function (armType) {
    var alarm = null;
    var strMark = '';
    var strType = '';
    var strDesc = [];
    if (armType == 11) {
        alarm = this.startAlarm;
        strMark = this.getAlarmStartEnd(1);
    } else {
        alarm = this.endAlarm;
        strMark = this.getAlarmStartEnd(0);
    }
    // 808解析后面的参数
    // 判断设备类型是不是808
    if (alarm.param3 && alarm.param3 > 0) {
        if (alarm.armIinfo) {
            strDesc.push(rootElement.lang.superrate + ':' + alarm.armIinfo + "%");
        }
    }
    if (alarm.param2) {
        strDesc.push(rootElement.lang.alarm_speed + ': ' + this.getSpeedString(alarm.param2));
    }
    if (alarm.param3) {
        //速度阙值  使用车辆实体类对应的限速值 占时位解析
        strDesc.push(rootElement.lang.abnormal_speed + ': ' + this.getSpeedString(alarm.param3 * 10.0));
    }

    strType = rootElement.lang.alarm_type_overspeed;
    var ret = {};
    ret.strType = strType;
    ret.strMark = strMark;
    ret.strDesc = strDesc.join(";");
    return ret;
}

/**
 * 获取夜间行驶报警
 */
standardAlarm.prototype.getNightDrivingAlarm = function (armType) {
    var strMark = '';
    var alarm = null;
    var strDesc = "";
    if (armType == 151) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
//	 param[0]当前超速限速值
/*    if (alarm.param1) {
        strDesc += rootElement.lang.alarm_speed_threshold + ":" + this.getSpeedString(alarm.param1 * 10) + ";";
    }*/

    var status = this.getAlarmStatus();
    if (status && status.speed) {
        strDesc += rootElement.lang.alarm_current_speed + ":" + this.getSpeedString(status.speed);
    }

    var ret = {};
    ret.strType = rootElement.lang.alarm_type_nightdriving;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}

/**
 * 获取聚众报警
 */
standardAlarm.prototype.getGatheringAlarm = function (armType) {
    var strMark = '';
    var strDesc = '';
    if (armType == 153) {
        strMark = this.getAlarmStartEnd(1);
        if (this.startAlarm.param1 ) {
            if (this.startAlarm.param1 > 0) {
                strDesc += rootElement.lang.alarm_speed_time + '(' +  getTimeDifference4(this.startAlarm.param1, true)  + ')';
            }
            strDesc += ', ' + rootElement.lang.alarm_vehicle_number + '(' + this.startAlarm.param2 + ')';
        }
    } else {
        strMark = this.getAlarmStartEnd(0);
        if (this.endAlarm.param1 && this.endAlarm.param1 > 0) {
            strDesc += rootElement.lang.alarm_speed_time + '(' + getTimeDifference4(this.endAlarm.param1, true)  + ')';
        }
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_gathering;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}

/**
 * 获取UPS 剪线报警
 */
standardAlarm.prototype.getUSPCutAlarm = function (armType) {
    var strMark = '';
    if (armType == 155) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_upsCut;
    ret.strMark = strMark;
    return ret;
}

/**
 * 获取硬盘超温报警
 */
standardAlarm.prototype.getHddHighTempAlarm = function (armType) {
    var alarm = null;
    var strMark = '';
    var strDesc = '';
    if (armType == 157) {
        alarm = this.startAlarm;
        strMark = this.getAlarmStartEnd(1);
    } else {
        alarm = this.endAlarm;
        strMark = this.getAlarmStartEnd(0);
    }
    //硬盘号
    strDesc += rootElement.lang.alarm_gps_disk + (Number(alarm.armIinfo) + 1);
    //硬盘类型
    strDesc += ', ' + this.getDiskType(alarm.param1);
    //温度
    strDesc += ', ' + rootElement.lang.alarm_temperator + '(' + alarm.param2 + rootElement.lang.alarm_temperator_unit + ')';
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_highTemperature;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}

/**
 * 获取前面板被撬开报警
 */
standardAlarm.prototype.getBeBoOpenedAlarm = function (armType) {
    var strMark = '';
    if (armType == 159) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_before_board_opened;
    ret.strMark = strMark;
    return ret;
}

/**
 * 获取关机上报报警
 */
standardAlarm.prototype.getTurnOffAlarm = function (armType) {
    var strMark = '';
    if (armType == 161) {
        strMark = this.getAlarmStartEnd(1);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_turn_off;
    ret.strMark = strMark;
    return ret;
}

/**
 * 获取硬盘空间不足报警
 */
standardAlarm.prototype.getDiskSpaceAlarm = function (armType) {
    var strMark = '';
    var strDesc = '';
    var alarm = null;
    if (armType == 162) {
        strMark = this.getAlarmStartEnd(1);
        alarm = this.startAlarm;
    } else {
        strMark = this.getAlarmStartEnd(0);
        alarm = this.endAlarm;
    }
    //硬盘号
    strDesc += rootElement.lang.alarm_gps_disk + (Number(alarm.armIinfo) + 1);
    //硬盘类型
    strDesc += ', ' + this.getDiskType(alarm.param1);
    //总空间
    strDesc += ', ' + rootElement.lang.alarm_disk_all_capacity + '(' + alarm.param2 + rootElement.lang.alarm_disk_unit_mb + ')';
    //剩余容量
    strDesc += ', ' + rootElement.lang.alarm_disk_sur_capacity + '(' + alarm.param3 + rootElement.lang.alarm_disk_unit_mb + ')';

    var ret = {};
    ret.strType = rootElement.lang.alarm_type_defect_disk;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}

/**
 * 获取SIM卡丢失报警
 */
standardAlarm.prototype.getSimLostAlarm = function (armType) {
    var strMark = '';
    if (armType == 166) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_sim_lost;
    ret.strMark = strMark;
    return ret;
}

/**
 * 获取越界报警
 */
standardAlarm.prototype.getBeyondBoundsAlarm = function (armType) {
    var strMark = '';
    var strDesc = '';
    if (armType == 12) {
        strMark = this.getAlarmStartEnd(1);
        if (this.startAlarm.armIinfo == 0) {
            strDesc = rootElement.lang.alarm_beyond_bounds_into;
        } else {
            strDesc = rootElement.lang.alarm_beyond_bounds_out;
        }
        strDesc += ', ' + rootElement.lang.alarm_beyond_bounds_no + ': ' + this.startAlarm.param1;
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_beyond_bounds;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}

/**
 * 获取异常开关车门报警
 */
standardAlarm.prototype.getDoorAbnormalAlarm = function (armType) {
    var strMark = '';
    var strDesc = '';
    if (armType == 13) {
        strMark = this.getAlarmStartEnd(1);
        if (this.startAlarm != null) {
            if (this.startAlarm.armIinfo == 0) {
                strDesc = rootElement.lang.alarm_door_abnormal_1;
            } else if (this.startAlarm.armIinfo == 1) {
                strDesc = rootElement.lang.alarm_door_abnormal_2;
            } else if (this.startAlarm.armIinfo == 2) {
                strDesc = rootElement.lang.alarm_door_abnormal_3;
            }
        }
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_door_abnormal;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}

/**
 * 获取上下线报警
 */
standardAlarm.prototype.getOnlineAlarm = function (armType) {
    var strType = '';
    if (armType == 17) {
        strType = rootElement.lang.alarm_name_17;
    } else {
        strType = rootElement.lang.alarm_name_67;
    }
    var ret = {};
    ret.strType = strType;
    return ret;
}

/**
 * 获取ACC报警（支持解析结束）
 */
standardAlarm.prototype.getACCAlarm = function (armType) {
    var strMark = '';
    var strDesc = '';
    if (armType == 16) {
        strMark = this.getAlarmStartEnd(1);
        strDesc = rootElement.lang.monitor_accOpen;
    } else {
        strMark = this.getAlarmStartEnd(0);
        strDesc = rootElement.lang.monitor_accClose;
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_Acc;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}

/**
 * 获取移动侦测报警
 */
standardAlarm.prototype.getMotionAlarm = function (armType) {
    var strMark = '';
    var alarm = null;
    if (armType == 15) {
        strMark = this.getAlarmStartEnd(1);
        alarm = this.startAlarm;
    } else {
        strMark = this.getAlarmStartEnd(0);
        alarm = this.endAlarm;
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_motion;
    ret.strMark = strMark;
    if (alarm.armIinfo) {
        ret.strDesc = rootElement.lang.alarm_channel + ': ' + this.getChnString(alarm.getDevIdno(), alarm.armIinfo);
    }
    return ret;
}

/**
 * 获取油量报警
 */
standardAlarm.prototype.getOilAlarm = function (armType) {
    var strMark = '';
    var strType = '';
    var strDesc = '';
    var alarm = null;
    if (armType == 46 || armType == 86) {
        strType = rootElement.lang.alarm_type_add_oil;
        strDesc = rootElement.lang.alarm_oil_add;
        if (armType == 46) {
            strMark = this.getAlarmStartEnd(1);
            alarm = this.startAlarm;
        } else {
            strMark = this.getAlarmStartEnd(0);
            alarm = this.endAlarm;
        }
    } else {
        strType = rootElement.lang.alarm_type_dec_oil;
        strDesc = rootElement.lang.alarm_oil_dec;
        if (armType == 47) {
            strMark = this.getAlarmStartEnd(1);
            alarm = this.startAlarm;
        } else {
            strMark = this.getAlarmStartEnd(0);
            alarm = this.endAlarm;
        }
    }


    var strDescArray = [];
    strDescArray.push(rootElement.lang.alarm_type_oil_begin + ': ' + this.getOilString(alarm.param1, alarm.devIdno));
    //油箱类型
    // 判断设备是否支持主副油箱
    if (rootElement.vehicleManager && typeof rootElement.vehicleManager.getDevice == 'function') {
        var dev = rootElement.vehicleManager.getDevice(alarm.devIdno);
        if (dev.isAuxiliaryTankSupport() && dev.isOilSensorSupport()) {
            // 0-主油箱 1-副油箱
            if (alarm.param2) {
                strDescArray.push(rootElement.lang.Auxiliary_oil_tank);
            } else {
                strDescArray.push(rootElement.lang.Main_oil_tank);
            }
        }
    }
    strDescArray.push(strDesc + ': ' + this.getOilString(alarm.armIinfo + alarm.param3, alarm.devIdno));
    var ret = {};
    ret.strType = strType;
    ret.strMark = strMark;
    ret.strDesc = strDescArray.join(",");
    return ret;
}

/**
 *  获取水位报警 加油184 减油185
 * @param armInfo
 * @returns {String}
 */
standardAlarm.prototype.getWaterLevelAlarm = function (armType) {
    var strMark = '';
    var strType = '';
    var strDesc = '';
    var alarm = null;
    if (armType == 184) {
        strType = rootElement.lang.alarm_type_add_water;
        strDesc = rootElement.lang.alarm_water_add;
        if (armType == 184) {
            strMark = this.getAlarmStartEnd(1);
            alarm = this.startAlarm;
        } else {
            strMark = this.getAlarmStartEnd(0);
            alarm = this.endAlarm;
        }
    } else {
        strType = rootElement.lang.alarm_type_dec_water;
        strDesc = rootElement.lang.alarm_water_dec;
        if (armType == 185) {
            strMark = this.getAlarmStartEnd(1);
            alarm = this.startAlarm;
        } else {
            strMark = this.getAlarmStartEnd(0);
            alarm = this.endAlarm;
        }
    }
    strDesc = rootElement.lang.alarm_type_water_begin + ': ' + this.getWaterString(alarm.param1) + ', ' + strDesc + ': ' + this.getWaterString(alarm.armIinfo);
    var ret = {};
    ret.strType = strType;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}


//获取疲劳驾驶报警
standardAlarm.prototype.getFatigueAlarmString = function (armInfo) {
    var str = '';
    switch (armInfo) {
        case 0:
            break;
        case 1:
            str = rootElement.lang.alarm_fatigue_type1;
            break;
        case 2:
            str = rootElement.lang.alarm_fatigue_type2;
            break;
        case 3:
            str = rootElement.lang.alarm_fatigue_type3;
            break;
        case 4:
            str = rootElement.lang.alarm_fatigue_type4;
            break;
    }
    return str;
}

/**
 * 获取疲劳驾驶报警
 */
standardAlarm.prototype.getFatigueAlarm = function (armType) {
    var strMark = '';
    var alarm = null;
    if (armType == 49) {
        strMark = this.getAlarmStartEnd(1);
        alarm = this.startAlarm;
    } else {
        strMark = this.getAlarmStartEnd(0);
        alarm = this.endAlarm;
    }
    var types = [];
    if (alarm.armIinfo) {
        if (alarm.armIinfo == 1) {//一级报警
            types.push(rootElement.lang.alarm_fatigue_type1);
        } else if (alarm.armIinfo == 2) {//二级报警
            types.push(rootElement.lang.alarm_fatigue_type2);
        } else if (alarm.armIinfo == 3) {//三级报警
            types.push(rootElement.lang.alarm_fatigue_type3);
        } else if (alarm.armIinfo == 4) {//关注度报警
            types.push(rootElement.lang.alarm_fatigue_type4);
        }
    }
    if (alarm.param1) {
        types.push(rootElement.lang.fatigue_driving + "[" + alarm.param1 + "]");
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_fatigue;
    ret.strMark = strMark;
    ret.strDesc = types.toString();
    return ret;
}


/**
 * 获取面部疲劳报警
 */
standardAlarm.prototype.getFaceFatigueAlarm = function (armType) {
    var strMark = '';
    var alarm = null;
    if (armType == 249) {
        strMark = this.getAlarmStartEnd(1);
        alarm = this.startAlarm;
    } else {
        strMark = this.getAlarmStartEnd(0);
        alarm = this.endAlarm;
    }
    var types = [];
    if (alarm.param1) {
        types.push(rootElement.lang.fatigue_driving + "[" + alarm.param1 + "]");
    }
    var ret = {};
    ret.strType = rootElement.lang.face_fatigue;
    //报警类型显示
    ret.strMark = strMark;
    ret.strDesc = types.toString();
    return ret;
}

//获取区域或者线路名称
standardAlarm.prototype.getAreaName = function (id, alarm, isUseDesc) {
    //优先使用desc的规则名
    if (isUseDesc && alarm.desc) {
        return alarm.desc;
    }
    //使用数据库规则
    if (rootElement.mapMarkManager.mapMarkList && rootElement.mapMarkManager.mapMarkList.length > 0) {
        for (var i = 0; i < rootElement.mapMarkManager.mapMarkList.length; i++) {
            if (rootElement.mapMarkManager.mapMarkList[i].id == id) {
                return rootElement.mapMarkManager.mapMarkList[i].name;
            }
        }
    }
    //查询不到直接显示 id
    return "ID:" + id;
}


/**
 * 是否启用desc作为name传参
 */
standardAlarm.prototype.getAreaType = function (alarm, descName) {
    var str = '';
    switch (alarm.param1) {
        //1;点;2;矩形;3;多边形;4;路线;10;圆;
        //11禁行区域  危化管理使用
        case 0:
            str = rootElement.lang.alarm_post_type + '(' + rootElement.lang.alarm_undefine_pos + ')';
            break;
        case 1:
            str = rootElement.lang.rule_areaName + '(' + this.getAreaName(alarm.param2, alarm, descName) + '), ' + rootElement.lang.alarm_post_type + '(' + rootElement.lang.mark_point + ')'; //mark_point  报警解析成圆
            break;
        case 2:
            str = rootElement.lang.rule_areaName + '(' + this.getAreaName(alarm.param2, alarm, descName) + '), ' + rootElement.lang.alarm_post_type + '(' + rootElement.lang.alarm_rect_area + ')';
            break;
        case 3:
            str = rootElement.lang.rule_areaName + '(' + this.getAreaName(alarm.param2, alarm, descName) + '), ' + rootElement.lang.alarm_post_type + '(' + rootElement.lang.alarm_poligon_area + ')';
            break;
        case 4:
            str = rootElement.lang.alarm_route_name + '(' + this.getAreaName(alarm.param2, alarm, descName) + '), ' + rootElement.lang.alarm_post_type + '(' + rootElement.lang.mark_line + ')';
            break;
        case 10:
            str = rootElement.lang.rule_areaName + '(' + this.getAreaName(alarm.param2, alarm, descName) + '), ' + rootElement.lang.alarm_post_type + '(' + rootElement.lang.alarm_circle_area + ')';
            break;
    }
    return str;
}

/**
 * 获取区域/线路超速、低速报警(平台产生)
 */
standardAlarm.prototype.getCMSAreaOverSpeedAlarm = function (armType) {
    var alarm = null;
    var strMark = '';
    var strType = '';
    if (armType == 300 || armType == 350) {
        strType = rootElement.lang.alarm_type_areaOverSpeed_platform;
    } else if (armType == 301 || armType == 351) {
        strType = rootElement.lang.alarm_type_areaLowSpeed_platform;
    } else if (armType == 309 || armType == 359) {
        strType = rootElement.lang.alarm_type_lineOverSpeed_platform;
    } else if (armType == 310 || armType == 360) {
        strType = rootElement.lang.alarm_type_lineLowSpeed_platform;
    }
    var strDesc = '';
    if (armType == 300 || armType == 301 || armType == 309 || armType == 310) {
        alarm = this.startAlarm;
        strMark = this.getAlarmStartEnd(1);
    } else {
        alarm = this.endAlarm;
        strMark = this.getAlarmStartEnd(0);
    }
    if (alarm.param1 && alarm.param1 == 1) {
        alarm.param1 = 10;
    }
    // 超速相关的
    // //区域超速报警(平台)alarmInfo:超速率 param[0]-位置类型 param[1]-区域或者线路ID param[2]-速度阀值

    var status = this.getAlarmStatus();
    if (armType == 300 || armType == 350 || armType == 309 || armType == 359) {
        if (alarm.armIinfo) {
            strDesc += rootElement.lang.superrate + ':' + alarm.armIinfo + "%,";
        }
        strDesc += rootElement.lang.alarm_current_speed + '(' + this.getSpeedString(status.speed) + '),';
        // 速度阙值
        if (alarm.param3) {
            strDesc += rootElement.lang.abnormal_speed + '(' + this.getSpeedString(alarm.param3 * 10.0) + "),";
        }
        strDesc += this.getAreaType(alarm, true);
    } else {
        var strArea = rootElement.lang.alarm_current_speed + '(' + this.getSpeedString(status.speed) + ')';
        strDesc = strArea + ', ' + rootElement.lang.alarm_speed_threshold + '(' + this.getSpeedString(alarm.param3 * 10)
            + '), ' + this.getAreaType(alarm, true);
    }
    var ret = {};
    ret.strType = strType;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}

/**
 * 获取进出入区域、线路报警(平台产生)
 */
standardAlarm.prototype.getCMSAreaInOutAlarm = function (armType) {
    var alarm = null;
    var strMark = '';
    var strType = '';
    var isDescName = false;
    if (armType == 302 || armType == 352) {
        strType = rootElement.lang.alarm_type_areaInOut_platform;
        isDescName = true;
    } else if (armType == 303 || armType == 353) {
        strType = rootElement.lang.alarm_type_lineInOut_platform;
        isDescName = true;
    } else if (armType == 211 || armType == 261) {
        strType = rootElement.lang.alarm_type_outOfRegional;
    } else if (armType == 212 || armType == 262) {
        strType = rootElement.lang.alarm_type_outOfLine;
    }

    var strDesc = '';
    if (armType == 302 || armType == 303 || armType == 211 || armType == 212) {
        alarm = this.startAlarm;
        strMark = this.getAlarmStartEnd(1);
    } else {
        alarm = this.endAlarm;
        strMark = this.getAlarmStartEnd(0);
    }
    if (alarm.param1 && alarm.param1 == 1) {
        alarm.param1 = 10;
    }
    var strArea = this.getAreaType(alarm, isDescName);
    if (alarm.param3 == 0) {
        strDesc = strArea + ', ' + rootElement.lang.direction + '(' + rootElement.lang.into + ')';
    } else if (alarm.param3 == 1) {
        strDesc = strArea + ', ' + rootElement.lang.direction + '(' + rootElement.lang.out + ')';
    } else {
        strDesc = strArea;
    }

    var ret = {};
    ret.strType = strType;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}

/**
 * 获取时间段超速报警(平台产生)
 */
standardAlarm.prototype.getCMSTimeOverSpeedAlarm = function (armType) {
    var strMark = '';
    var strDesc = "";
    var alarm = null;
    if (armType == 304) {
        alarm = this.startAlarm;
        strMark = this.getAlarmStartEnd(1);
    } else {
        alarm = this.endAlarm;
        strMark = this.getAlarmStartEnd(0);
    }

    if (alarm.armIinfo) {
        strDesc += rootElement.lang.superrate + ':' + alarm.armIinfo + "%,";
    }
    var status = this.getAlarmStatus();
    if (status && status.speed) {
        strDesc += rootElement.lang.alarm_speed + '(' + this.getSpeedString(status.speed) + "),";
    }
    // 速度阙值
    if (alarm.param3) {
        strDesc += rootElement.lang.abnormal_speed + '(' + this.getSpeedString(alarm.param3 * 10.0) + ")";
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_overSpeed_platform;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}

/**
 * 获取时间段低速报警(平台产生)
 */
standardAlarm.prototype.getCMSTimeLowSpeedAlarm = function (armType) {
    var strMark = '';
    var alarm = null;
    var strDesc = "";
    if (armType == 305) {
        alarm = this.startAlarm;
        strMark = this.getAlarmStartEnd(1);
    } else {
        alarm = this.endAlarm;
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    if (alarm.param2) {
        strDesc += rootElement.lang.alarm_speed + '(' + this.getSpeedString(alarm.param2) + ");";
    }
    //速度阙值
    if (alarm.param3) {
        strDesc += rootElement.lang.abnormal_speed + '(' + this.getSpeedString(alarm.param3 * 10.0) + ");";
    }
    ret.strDesc = strDesc;
    ret.strType = rootElement.lang.alarm_type_lowSpeed_platform;
    ret.strMark = strMark;
    return ret;
}

/**
 * 获取疲劳驾驶报警(平台产生)
 */
standardAlarm.prototype.getCMSFatigueAlarm = function (armType) {
    var strMark = '';
    var strDesc = '';
    var alarm = null;
    if (armType == 306 || armType == 1109  || armType == 1126  || armType == 1127  || armType == 1121) {
        alarm = this.startAlarm;
        strMark = this.getAlarmStartEnd(1);
    } else {
        alarm = this.endAlarm;
        strMark = this.getAlarmStartEnd(0);
    }
    if (armType == 1121){
         strMark = '';
    }
    var ret = {};
    // 306 生理疲劳(平台)  param[0]:未用 param[1]连续驾驶时长 单位(秒)
    // 1109 疲劳预警(平台) param[0]:未用 param[1]连续驾驶时长 单位(秒)
    // 1121 累计疲劳
    // 1126 日间疲劳
    // 1127 夜间疲劳
    if (armType == 1121) {
        strDesc += rootElement.lang.Cumulative_driving_time + "(" + getTimeDifference4(alarm.param2, true)  + " )";
    }else if (alarm.param2 && alarm.param2 > 0) {
        strDesc += rootElement.lang.driver_time_last + "(" + getTimeDifference4(alarm.param2, true)  + " )";
    }
    ret.strType = rootElement.lang.alarm_name_306_default;
    if (armType == 1109) {
        ret.strType = rootElement.lang.alarm_name_1109;
    }
    if (armType == 1121) {
        ret.strType = rootElement.lang.alarm_name_1121;
    }
    if (armType == 1126 || armType == 1128) {
        ret.strType = rootElement.lang.alarm_name_1126;
    }
    if (armType == 1127 || armType == 1129) {
        ret.strType = rootElement.lang.alarm_name_1127;
    }
    ret.strDesc = strDesc;

    ret.strMark = strMark;
    return ret;
}

/**
 * 获取超时停车报警(平台产生)
 */
standardAlarm.prototype.getCMSParkTooLongAlarm = function (armType) {
    var strMark = '';
    if (armType == 307) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_parkTooLong_platform;
    ret.strMark = strMark;
    return ret;
}

/**
 * 获取关键点监控报警(平台产生)
 */
standardAlarm.prototype.getCMSAreaPointAlarm = function (armType) {
    var alarm = null;
    var strMark = '';
    var strDesc = '';
    if (armType == 308) {
        alarm = this.startAlarm;
        strMark = this.getAlarmStartEnd(1);
    } else {
        alarm = this.endAlarm;
        strMark = this.getAlarmStartEnd(0);
    }
    var strArea = this.getAreaType(alarm);
    if (alarm.param3 == 0) {
        strDesc = strArea + ', ' + rootElement.lang.alarm_not_arrive;
    } else if (alarm.param3 == 1) {
        strDesc = strArea + ', ' + rootElement.lang.alarm_not_leave;
    } else {
        strDesc = strArea;
    }

    var ret = {};
    ret.strType = rootElement.lang.alarm_type_areaPoint_platform;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}

/**
 * 解析道路等級
 */
standardAlarm.prototype.getRoadLevel = function (type) {
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

/**
 * 获取道路等級超速报警(平台产生)
 */
standardAlarm.prototype.getCMSRoadLevelOverSpeedAlarm = function (armType) {
    var alarm = null;
    var strMark = '';
    var strDesc = '';
    if (armType == 311) {
        alarm = this.startAlarm;
        strMark = this.getAlarmStartEnd(1);
    } else {
        alarm = this.endAlarm;
        strMark = this.getAlarmStartEnd(0);
    }
    var strDesc = "";
    if (alarm.armIinfo) {
        strDesc += rootElement.lang.superrate + ':' + alarm.armIinfo + "%,";
    }

    if (alarm.param1 && this.getRoadLevel(alarm.param1)) {
        strDesc += this.getRoadLevel(alarm.param1) + ",";
    }
    // 开始报警显示为：报警速度
    if (alarm.param2) {
        strDesc += rootElement.lang.alarm_speed + '(' + this.getSpeedString(alarm.param2) + "),";
    }
    if (alarm.param3) {
        strDesc += rootElement.lang.abnormal_speed + '(' + this.getSpeedString(alarm.param3 * 10.0) + ");";
    }
    var ret = {};
    ret.strType = rootElement.lang.report_roadLvlOverSpeed_platform;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}

//获取录像类型
standardAlarm.prototype.getRecordTypeStr = function (type) {
    if (type == 1) {
        return rootElement.lang.alarm_rectype_alarm;
    } else {
        return rootElement.lang.alarm_rectype_normal;
    }
}

//获取文件大小
standardAlarm.prototype.getFileSize = function (size) {
    var temp = (size * 1.0 / 1024 / 1024).toFixed(2);
    if (temp == "0.00") {
        temp = "0.01";
    }
    return temp + rootElement.lang.alarm_disk_unit_mb;
}

/**
 * 获取图片文件或者录像文件下载完成事件
 */
standardAlarm.prototype.getEventFileDownload = function (armType) {
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    var ret = {};
    ret.srcAlarmType = alarm.srcAlarmType; //1是图片，2是录像 3音频
    if (alarm.srcAlarmType != 5) {//非音频文件
        ret.param3 = alarm.param3; //表示报警，还是常规
    }
    ret.param1 = alarm.param1;  //通道
    ret.param2 = alarm.param2; //文件大小
    ret.param4 = alarm.param4;//存储位置 2存储服务器 4下载服务器

    ret.imgFile = alarm.imgFile;  //路径
    ret.reserve = alarm.reserve;  //录像时长

    ret.srcTime = alarm.srcTime;  //录像开始时间
    ret.endTime = alarm.armTime; //下载完成时间
    ret.armIinfo = alarm.armIinfo;  //服务器ID
    ret.baseAlarm = alarm.baseAlarm;  //报警来源
    ret.server = alarm.desc;//服务器id 对应的信息
    return ret;
}


/**
 * 获取图片文件或者录像文件上传
 */
standardAlarm.prototype.getEventFileUpload = function (armType) {
    var alarm = null;
    var strType = '';// rootElement.lang.unknown;
    var strDesc = '';
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    if (alarm.armIinfo == 2) {//图片上传成
        strType = rootElement.lang.alarm_type_record_upload;
    } else if (alarm.armIinfo == 1) {
        strType = rootElement.lang.alarm_type_image_upload;
    } else if (alarm.armIinfo == 5) {
        strType = rootElement.lang.alarm_type_audio_upload;
    }
    var recType = 0;
    var size = 0;
    var chn = 0;
    var desc = '';
    if (armType == 109) { // 普通
        recType = alarm.param2;
        size = alarm.param1;
        chn = alarm.param4;
        desc = alarm.desc;
    } else if (armType == 130) { //报警
        if (alarm.armIinfo != 5) {//非音频文件上传
            recType = alarm.param3; //文件类型
            chn = alarm.param1;//通道参数
        }
        size = alarm.param2;
        desc = alarm.imgFile;
    }
    if (alarm.armIinfo != 5) {
        strDesc = rootElement.lang.fileType + ': ' + this.getRecordTypeStr(recType) + ', ';
        strDesc += rootElement.lang.alarm_channel + ': ' + this.getChnString(alarm.getDevIdno(), chn) + ', ';
    }
    strDesc += rootElement.lang.alarm_record_size + ': ' + this.getFileSize(size) + ', ';
    strDesc += rootElement.lang.alarm_file_name + ': ' + desc;

    var ret = {};
    ret.strType = strType;
    ret.strDesc = strDesc;
    return ret;
}

/**
 * 驾驶员信息采集上报
 */
standardAlarm.prototype.getDriverInfo = function (armType) {
    //this.desc 线路名称;IC卡id;司机工号
    //this.param1  11 联合欣业
    //this.param4  0 签退 1签到
    var strType = rootElement.lang.alarm_name_116;
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }

    var desc = [];
    //签到签退(北斗协议才有效
    var strSignType = "";
    //北斗签退
    var bSignOff = false;
    // 私有协议刷卡
    var bProtocolTTX = false;
    //905出租车
    var bProtocolTaxi = false;
    var nICReadResult = 0;//nICReadResult
    if (alarm.param1 == 6) { //JT808协议
        if (alarm.param2 == 2) { //2013版北斗协议
            //0未知 1签到 2签退 （北斗协议有效）
            switch (alarm.param4) {
                case 1:
                    strSignType = rootElement.lang.alarm_signIn;
                    break;
                case 2:
                    bSignOff = true;
                    strSignType = rootElement.lang.alarm_signOut;
                    break;
            }
            strSignType += ';';
            nICReadResult = alarm.param3;
        } else if (alarm.param2 == 4 || alarm.param2 == 5 || alarm.param2 == 6) { 	// 是否为扩展协议(4,5=905出租车)
            bProtocolTaxi = true;
            if (alarm.armIinfo) { // AlarmInfo：1表示登录（签到），0表示退签（签退）
                strSignType = rootElement.lang.alarm_signIn;
            } else {
                strSignType = rootElement.lang.alarm_signOut;
            }
        }
    } else if (alarm.param1 == 1) { //WKP
        bProtocolTTX = true;
        if (alarm.armIinfo) { //0签退 1签到
            strSignType = rootElement.lang.alarm_signIn;
        } else {
            bSignOff = true;
            strSignType = rootElement.lang.alarm_signOut;
        }
    }

    if (nICReadResult != 0) {
        var strICReadResult = "";
        switch (nICReadResult) {
            case 0x01:
                strICReadResult = rootElement.lang.ICReadResult1;
                break;
            case 0x02:
                strICReadResult = rootElement.lang.ICReadResult2;
                break;
            case 0x03:
                strICReadResult = rootElement.lang.ICReadResult3;
                break;
            case 0x04:
                strICReadResult = rootElement.lang.ICReadResult4;
                break;
            default:
                strICReadResult = rootElement.lang.ICReadResult0;
                break;
        }
        desc.push(strSignType + strICReadResult);
    } else {
        //desc 司机名称;发证机关;身份证号;从业资格证编码;有效时间
        var nResult = 1;
        var strTel = "";
        var strName, strRegGet, strID, strReq, strCheckResult, strValidTime, extraTaxi;
        var descArray = alarm.desc.split(';');
        strName = descArray[0] || '';
        strRegGet = descArray[1] || '';
        strID = descArray[2] || '';
        strReq = descArray[3] || '';
        strValidTime = descArray[4] || '';
        extraTaxi = descArray[5] || '';
        if (alarm.imgFile[0]) {
            descArray = alarm.imgFile.split(';');
            if (descArray != null && descArray.length > 0) {
                nResult = Number(descArray[0]);
                if (descArray.length > 1) {
                    strTel = descArray[1];
                    if (strTel) {
                        strName += '(' + strTel + ')';
                    }
                }
            }
        }
        strCheckResult = nResult ? rootElement.lang.success : rootElement.lang.failure;
        if (bProtocolTTX || bProtocolTaxi) {
            if (bProtocolTTX) {
                desc.push(strSignType);
            } else {
                //识别结果
                desc.push(strSignType + rootElement.lang.recognitionResult + ':' + strCheckResult);
            }
            if (strName) {
                desc.push(rootElement.lang.alarm_driver_name + ':' + strName);
            }
            if (strID) {
                desc.push(rootElement.lang.alarm_driver_id + ':' + strID);
            }
            if (strRegGet) {
                desc.push(rootElement.lang.alarm_driver_require_get + ':' + strRegGet);
            }
            if (strReq) {
                desc.push(rootElement.lang.alarm_driver_require + ':' + strReq);
            }
            if (strValidTime) {
                desc.push(rootElement.lang.strValidTime + ':' + strValidTime);
            }
        } else if (bSignOff && !strName && !strRegGet && !strID && !strReq) {
            desc.push(strSignType + rootElement.lang.recognitionResult + ':' + strCheckResult);
        } else {
            desc.push(strSignType + rootElement.lang.alarm_driver_name + ':' + strName + ',' + rootElement.lang.alarm_driver_id + ':' + strID + ',' + rootElement.lang.alarm_driver_require_get + ':' + strRegGet + ',' + rootElement.lang.alarm_driver_require + ':' + strReq + ',' + rootElement.lang.strValidTime + ':' + strValidTime + ',' + rootElement.lang.recognitionResult + ':' + strCheckResult);
        }

        if (bProtocolTaxi && extraTaxi) {
            if (alarm.param3 == 1) { // 签到
                //企业经营许可证号(16),车牌号(9),开机时间(12),补传标记(1),联系电话(32)
                var extraTaxiArray = extraTaxi.split(',');
                if (extraTaxiArray && extraTaxiArray.length > 0) {
                    if (extraTaxiArray[0]) {
                        desc.push(rootElement.lang.taxi_driver_business_license + ':' + extraTaxiArray[0]);
                    }
                    if (extraTaxiArray[1]) {
                        desc.push(rootElement.lang.plate_number + ':' + extraTaxiArray[1]);
                    }
                    if (extraTaxiArray[2] && formatDateString(extraTaxiArray[2])) {
                        desc.push(rootElement.lang.taxi_driver_open_time + ':' + formatDateString(extraTaxiArray[2]));
                    }
                    if (extraTaxiArray[3] && extraTaxiArray[3] == 1) {
                        desc.push(rootElement.lang.taxi_driver_supplementary_data);
                    }
//					if(extraTaxiArray[4]){
//						 desc += ("联系电话"+':'+extraTaxiArray[4]);
//					}
                }
            } else if (alarm.param3 == 2) { // 签退
//				附加数据定义(英文逗号,分隔)=企业经营许可证号(16),车牌号(9),计程计价装置 K 值(4),
//				当班开机时间(12),当班关机时间(12),当班里程(6),当班营运里程(6),
//				车次(4),计时时间(6),总计金额(6),非现金收入(6),非现金收费次数(4),
//				夜间里程(4),总计里程(8),总营运里程(8),单价(4),总营运次数(10),签退方式(1),补传标记(1)
//				附加数据最大长度=16+9+4+12+12+6+6+4+6+6+6+4+4+8+8+4+10+1+1+19=146
                var extraTaxiArray = extraTaxi.split(',');
                if (extraTaxiArray && extraTaxiArray.length > 0) {
                    // 企业经营许可证号 BYTE [16] ASCII 字符，长度不足 16byte，右补 0x00
                    if (extraTaxiArray[0]) {
                        desc.push(rootElement.lang.taxi_driver_business_license + ':' + extraTaxiArray[0]);
                    }
                    // 车牌号 BYTE[9] 车牌号，ASCII 字符
                    if (extraTaxiArray[1]) {
                        desc.push(rootElement.lang.plate_number + ':' + extraTaxiArray[1]);
                    }
                    // 计程计价装置 K 值 BCD[2] 格式为 XXXX，最大 9999
                    if (extraTaxiArray[2]) {
                        desc.push(rootElement.lang.taxi_driver_metering_device_k_value + ':' + extraTaxiArray[2]);
                    }
                    // 当班开机时间 BCD[6] YYYYMMDDHHMM
                    if (extraTaxiArray[3] && formatDateString(extraTaxiArray[3])) {
                        desc.push(rootElement.lang.taxi_driver_work_open_time + ':' + formatDateString(extraTaxiArray[3]));
                    }
                    //当班关机时间 BCD[6] YYYYMMDDHHMM
                    if (extraTaxiArray[4] && formatDateString(extraTaxiArray[4])) {
                        desc.push(rootElement.lang.taxi_driver_work_close_time + ':' + formatDateString(extraTaxiArray[4]));
                    }
                    // 当班里程 BCD[3] 格式为 XXXXX.X，单位为千米（km）
//					mileageConversion

                    if (extraTaxiArray[5]) {
                        desc.push(rootElement.lang.taxi_driver_work_mileage + ':' + mileageConversion(extraTaxiArray[5] / 10));
                    }
                    // 当班营运里程 BCD[3] 格式为 XXXXX.X，单位为千米（km）
                    if (extraTaxiArray[6]) {
                        desc.push(rootElement.lang.taxi_driver_work_mileage_on_duty + ':' + mileageConversion(extraTaxiArray[6] / 10));
                    }
                    //车次 BCD[2] 格式为 XXXX，最大 9999
                    if (extraTaxiArray[7]) {
                        desc.push(rootElement.lang.taxi_driver_train_times + ':' + extraTaxiArray[7]);
                    }
                    // 计时时间 BCD[3] 格式为 hhmmss
                    if (extraTaxiArray[8]) {
                        var timeStr = "";
                        var length_ = extraTaxiArray[8].length;
                        var realNumber = "";
                        if (length < 6) {
                            for (var i = 0; i < 6 - length_; i++) {
                                realNumber += "0";
                            }
                            realNumber += extraTaxiArray[8];
                        } else {
                            realNumber = extraTaxiArray[8];
                        }


                        if (realNumber.length == 6) {
                            timeStr = Number(realNumber.substring(0, 2)) + rootElement.lang.hour + Number(realNumber.substring(2, 4)) + rootElement.lang.minute + Number(realNumber.substring(4, 6)) + rootElement.lang.second
                        }
                        if (timeStr) {
                            desc.push(rootElement.lang.taxi_driver_timing_time + ':' + timeStr);
                        }
                    }
                    // 总计金额 BCD[3] 格式为 XXXXX.X，单位为元
                    if (extraTaxiArray[9]) {
                        desc.push(rootElement.lang.taxi_driver_total_amount + ':' + extraTaxiArray[9] / 10 + rootElement.lang.RMB);
                    }
                    // 非现金收入 BCD[3] 格式为 XXXXX.X，单位为元
                    if (extraTaxiArray[10]) {
                        desc.push(rootElement.lang.taxi_driver_noncash_income + ':' + extraTaxiArray[10] / 10 + rootElement.lang.RMB);
                    }
                    // 非现金收费次数 BCD[2] 格式为 XXXX，最大 9999
                    if (extraTaxiArray[11]) {
                        desc.push(rootElement.lang.taxi_driver_noncash_income_times + ':' + extraTaxiArray[11]);
                    }
                    // 夜间里程 BCD[2] 格式为 XXX.X（上一班签退到本班签到的距离），单位为 千米（km）
                    if (extraTaxiArray[12]) {
                        desc.push(rootElement.lang.taxi_driver_night_work_mileage + ':' + mileageConversion(extraTaxiArray[12] / 10));
                    }
                    // 总计里程 BCD[4] 格式为 XXXXXXX.X（计程计价装置安装后累积的里程），单位为千米（km）
                    if (extraTaxiArray[13]) {
                        desc.push(rootElement.lang.taxi_driver_total_mileage + ':' + mileageConversion(extraTaxiArray[13] / 10));
                    }
                    // 总营运里程 BCD[4] 格式为 XXXXXXX.X（计程计价装置安装后累积的里程） 单位为千米（km）
                    if (extraTaxiArray[14]) {
                        desc.push(rootElement.lang.taxi_driver_total_mileage_on_duty + ':' + mileageConversion(extraTaxiArray[14] / 10));
                    }
                    // 单价 BCD[2] 格式 XX.XX，单位为元
                    if (extraTaxiArray[15]) {
                        desc.push(rootElement.lang.taxi_driver_unit_price + ':' + extraTaxiArray[15] / 100 + rootElement.lang.RMB);
                    }
                    // 总营运次数 UINT32 高位在前，低位在后
                    if (extraTaxiArray[16]) {
                        desc.push(rootElement.lang.taxi_driver_total_times_on_duty + ':' + extraTaxiArray[16]);
                    }
                    // 签退方式 BYTE 0x00：正常签退；0x01：强制签退
                    if (extraTaxiArray[17] && extraTaxiArray[17] == 1) {
                        desc.push(rootElement.lang.taxi_driver_forced_signoff);
                    } else {
                        desc.push(rootElement.lang.taxi_driver_normal_signoff);
                    }
                    // 补传标记 UINT8 0-实时数据，1-补传数据
                    if (extraTaxiArray[18] && extraTaxiArray[18] == 1) {
                        desc.push(rootElement.lang.taxi_driver_supplementary_data);
                    }
                }
            }
        }
    }

    if (alarm.param1 == 11) {// 联合欣业
        var descInfos = [];
        desc = [];
        if (alarm.desc) {
            descInfos = alarm.desc.split(";");
        }
        if (alarm.param4 == 1) {
            desc.push(rootElement.lang.alarm_signIn);
        } else {
            desc.push(rootElement.lang.alarm_signOut);
        }
        //线路名称
        if (descInfos.length > 0) {
            desc.push(rootElement.lang.alarm_route_name + " : " + descInfos[0]);
        }
        //司机工号
        if (descInfos.length > 2) {
            desc.push(rootElement.lang.alarm_driver_indo + " : " + descInfos[2]);
        }
    }

    var ret = {};
    ret.strType = strType;
    ret.strDesc = desc.toString();
    return ret;
}

//获取
standardAlarm.prototype.getRunDir = function (type) {
    if (type == 0) {
        return rootElement.lang.alarm_go;
    } else {
        return rootElement.lang.alarm_return;
    }
}

//获取
standardAlarm.prototype.getAutoStation = function (type) {
    if (type == 0) {
        return rootElement.lang.alarm_auto;
    } else {
        return rootElement.lang.alarm_manually;
    }
}

/**
 * 报站信息
 */
standardAlarm.prototype.getEventStationInfo = function (armType) {
    var alarm = null;
    var strType = '';
    var strDesc = '';
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    switch (alarm.param1) {
        case 1:
            strType = rootElement.lang.alarm_event_in_station;
            break;
        case 2:
            strType = rootElement.lang.alarm_event_out_station;
            break;
        case 3:
            strType = rootElement.lang.alarm_event_over_speed_start;
            break;
        case 4:
            strType = rootElement.lang.alarm_event_over_speed_end;
            break;
        case 5:
            strType = rootElement.lang.alarm_event_delay_start;
            break;
        case 6:
            strType = rootElement.lang.alarm_event_delay_end;
            break;
    }
    strDesc = rootElement.lang.alarm_station_name + '(' + alarm.imgFile + '), ';
    strDesc += rootElement.lang.alarm_route_name + '(' + alarm.desc + '), ';
    strDesc += 'BSM(' + alarm.param2 + '), ';
    strDesc += this.getRunDir(alarm.param3) + ', ';
    strDesc += rootElement.lang.alarm_auto_station + '(' + this.getAutoStation(alarm.param4) + '), ';
    strDesc += rootElement.lang.alarm_run_number + '(' + alarm.armIinfo + ')';

    var ret = {};
    ret.strType = strType;
    ret.strDesc = strDesc;
    return ret;
}

/**
 * 获取围栏报警
 */
standardAlarm.prototype.getFenceAlarm = function (armType) {
    var alarm = null;
    var strMark = '';
    var strType = '';
    var strDesc = '';
    switch (armType) {
        case 27:
        case 77:
            strType = rootElement.lang.alarm_type_fence_in;
            break;
        case 28:
        case 78:
            strType = rootElement.lang.alarm_type_fence_out;
            break;
        case 29:
        case 79:
            strType = rootElement.lang.alarm_type_fence_in_overspeed;
            break;
        case 30:
        case 80:
            strType = rootElement.lang.alarm_type_fence_out_overspeed;
            break;
        case 31:
        case 81:
            strType = rootElement.lang.alarm_type_fence_in_lowspeed;
            break;
        case 32:
        case 82:
            strType = rootElement.lang.alarm_type_fence_out_lowspeed;
            break;
        case 33:
        case 83:
            strType = rootElement.lang.alarm_type_fence_in_stop;
            break;
        case 34:
        case 84:
            strType = rootElement.lang.alarm_type_fence_out_stop;
            break;
    }

    switch (armType) {
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 83:
        case 84:
            alarm = this.endAlarm;
            strMark = this.getAlarmStartEnd(0);
            break;
        case 27:
        case 28:
        case 29:
        case 30:
        case 31:
        case 32:
        case 33:
        case 34:
            alarm = this.startAlarm;
            strMark = this.getAlarmStartEnd(1);
            break;
    }
    if (alarm.param1 && alarm.param1 == 1) {
        alarm.param1 = 10;
    }


    /* var strArea = "";
     if (alarm.param1 && alarm.param1 != 0) {
         strArea = this.getAreaType(alarm);
     }*/
    switch (armType) {
        case 29:  //区域内高速报警
        case 30:  //区域外高速报警
        case 31:  //区域内低速报警
        case 32:  //区域外低速报警
        case 79:  //区域内高速报警
        case 80:  //区域外高速报警
        case 81:  //区域内低速报警
        case 82:  //区域外低速报警
            var status = this.getAlarmStatus();
            strDesc = rootElement.lang.alarm_speed + ': ' + this.getSpeedString(status.speed);
            strDesc += ', ' + rootElement.lang.alarm_minSpeed + ': ' + this.getSpeedString(alarm.param2);
            strDesc += ', ' + rootElement.lang.alarm_maxSpeed + ': ' + this.getSpeedString(alarm.param3);
            break;
    }
    var ret = {};
    ret.strDesc = strDesc;
    ret.strType = strType;
    ret.strMark = strMark;
    return ret;
}

/**
 * 获取区域超速报警
 */
standardAlarm.prototype.getAreaOverSpeedAlarm = function (armType) {
    var strMark = '';
    var alarm = null;
    if (armType == 200) {
        strMark = this.getAlarmStartEnd(1);
        alarm = this.startAlarm;
    } else {
        strMark = this.getAlarmStartEnd(0);
        alarm = this.endAlarm;
    }
    if (alarm.param1 && alarm.param1 == 1) {
        alarm.param1 = 10;
    }
    var strArea = this.getAreaType(alarm);
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_regionalSpeedingAlarm;
    ret.strMark = strMark;
    ret.strDesc = strArea;
    return ret;
}

/**
 * 区域超时停车
 */
standardAlarm.prototype.getAreaOverTimeAlarm = function (armType) {
    var strMark = '';
    var alarm = null;
    if (armType == 1312) {
        strMark = this.getAlarmStartEnd(1);
        alarm = this.startAlarm;
    } else {
        strMark = this.getAlarmStartEnd(0);
        alarm = this.endAlarm;
    }
    if (alarm.param1 && alarm.param1 == 1) {
        alarm.param1 = 10;
    }
    //区域超时停车(平台)param[0]-位置类型 param[1]-区域或者线路ID param[2]-停车时长阈值(秒)
    var strArea = this.getAreaType(alarm);
    if (alarm.param3) {
        strDesc = strArea + ', ' + rootElement.lang.track_parkTime_threshold + ":" + alarm.param3;
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_name_1312;
    ret.strMark = strMark;
    ret.strDesc = strArea;
    return ret;
}


/**
 * 获取预警报警
 */
standardAlarm.prototype.getWarningAlarm = function (armType) {
    var strMark = '';
    if (armType == 201) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_earlyWarning;
    ret.strMark = strMark;
    return ret;
}

/**
 * 获取危险驾驶行为报警
 */
standardAlarm.prototype.getDangerousDrivingAlarm = function (armType) {
    var strMark = '';
    if (armType == 445) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.dangerous_driver_alarm;
    ret.strMark = strMark;
    return ret;
}

/**
 * 超员报警
 * @param armType
 */
standardAlarm.prototype.overMan = function (armType) {
    var ret = {};
    var strMark = '';
    if (armType == 148) {
        strMark = this.getAlarmStartEnd(1);
    }
    ret.strType = rootElement.lang.alarm_name_148;
    ret.strMark = strMark;
    return ret;
}

/**
 * 客车超员(平台)
 * @param armType
 */
standardAlarm.prototype.overManPlatform = function (armType) {
    var ret = {};
    var strMark = '';
    if (armType == 344) {
        strMark = this.getAlarmStartEnd(1);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_name_344;
    ret.strMark = strMark;
    return ret;
}

/**
 * 获取GNSS模块发生故障报警
 */
standardAlarm.prototype.getGNSSModuleFailureAlarm = function (armType) {
    var strMark = '';
    if (armType == 202) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_GNSSModuleFailure;
    ret.strMark = strMark;
    return ret;
}

/**
 * 获取GNSS天线未接或剪断
 */
standardAlarm.prototype.getGNSSAntennaMissedOrCutAlarm = function (armType) {
    var strMark = '';
    if (armType == 203) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_GNSSAntennaMissedOrCut;
    ret.strMark = strMark;
    return ret;
}

/**
 * 获取GNSS天线短路
 */
standardAlarm.prototype.getGNSSAntennaShortAlarm = function (armType) {
    var strMark = '';
    if (armType == 204) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_GNSSAntennaShort;
    ret.strMark = strMark;
    return ret;
}

/**
 * 获取主电源欠压
 */
standardAlarm.prototype.getSupplyUndervoltageAlarm = function (armType) {
    var strMark = '';
    if (armType == 205) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_mainSupplyUndervoltage;
    ret.strMark = strMark;
    return ret;
}

/**
 * 获取主电源掉电
 */
standardAlarm.prototype.getPowerFailureAlarm = function (armType) {
    var strMark = '';
    if (armType == 206) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_mainPowerFailure;
    ret.strMark = strMark;
    return ret;
}

/**
 * 获取终端LCD或者显示器故障
 */
standardAlarm.prototype.getLCDFailureAlarm = function (armType) {
    var strMark = '';
    if (armType == 207) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_LCDorDisplayFailure;
    ret.strMark = strMark;
    return ret;
}

/**
 * 获取TTS模块故障
 */
standardAlarm.prototype.getTTSModuleFailureAlarm = function (armType) {
    var strMark = '';
    if (armType == 208) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_TTSModuleFailure;
    ret.strMark = strMark;
    return ret;
}

/**
 * 获取摄像头故障
 */
standardAlarm.prototype.getCameraFailureAlarm = function (armType) {
    var strMark = '';
    if (armType == 209) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_cameraMalfunction;
    ret.strMark = strMark;
    return ret;
}

/**
 * 获取当天累计驾驶超时
 */
standardAlarm.prototype.getDrivingTimeoutAlarm = function (armType) {
    var strMark = '';
    if (armType == 210) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_cumulativeDayDrivingTimeout;
    ret.strMark = strMark;
    return ret;
}

/**
 * 获取路段行驶时间不足或过长
 */
standardAlarm.prototype.getRoadTravelTimeAlarm = function (armType) {
    var strMark = '';

    var alarm = null;
    var strDesc = '';
    if (armType == 213) {
        strMark = this.getAlarmStartEnd(1);
        alarm = this.startAlarm;
    } else {
        strMark = this.getAlarmStartEnd(0);
        alarm = this.endAlarm;
    }
    switch (alarm.param3) {
        case 0:
            strDesc = rootElement.lang.alarm_type_drive_time_less + ';';
            break;
        case 1:
            strDesc = rootElement.lang.alarm_type_drive_time_over + ';';
            break;
    }
    strDesc += rootElement.lang.alarm_route_name + '(' + this.getAreaName(alarm.param1, alarm) + '), ';
    strDesc += rootElement.lang.time + '(' + alarm.param2 + rootElement.lang.min_second + ')';

    var strType = rootElement.lang.report_InadequateOrTooLongRoadTravelTime;
    var ret = {};
    ret.strType = strType;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}

/**
 * 获取路线偏离报警
 */
standardAlarm.prototype.getRouteDeviationAlarm = function (armType) {
    var strMark = '';
    if (armType == 214) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_routeDeviation;
    ret.strMark = strMark;
    return ret;
}

/**
 * 获取车辆VSS故障
 */
standardAlarm.prototype.getVSSFailureAlarm = function (armType) {
    var strMark = '';
    if (armType == 215) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_VSSFailure;
    ret.strMark = strMark;
    return ret;
}

/**
 * 获取油量异常
 */
standardAlarm.prototype.getAbnormalFuelAlarm = function (armType) {
    var strMark = '';
    if (armType == 216) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_abnormalFuel;
    ret.strMark = strMark;
    return ret;
}

/**
 * 获取防盗器  车辆被盗报警
 */
standardAlarm.prototype.getAntitheftDeviceAlarm = function (armType) {
    var strMark = '';
    if (armType == 217) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_antitheftDevice;
    ret.strMark = strMark;
    return ret;
}

/**
 * 获取非法位移
 */
standardAlarm.prototype.getIllegalDisplacementAlarm = function (armType) {
    var strMark = '';
    if (armType == 218) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_illegalDisplacement;
    ret.strMark = strMark;
    return ret;
}

/**
 * 获取侧翻报警
 */
standardAlarm.prototype.getRolloverAlarm = function (armType) {
    var strMark = '';
    if (armType == 219) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_rollover;
    ret.strMark = strMark;
    return ret;
}


/**
 * 获取胎温报警
 */
standardAlarm.prototype.getTiretemperature = function (armType) {
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    var strMark = '';

    var strDesc = [];
    var ret = {};
    if (armType == 235) {
        strMark = this.getAlarmStartEnd(1);

        strDesc = rootElement.lang.sensor_number + ":";	//传感器编号
        if (alarm.param4 > 0) {
            strDesc = analysisTireAlarmNumber(alarm.param4, strDesc);
            strDesc += " , ";
            strDesc += rootElement.lang.sensorNowStatus + ":";	//传感器当前状态
            if ([(alarm.param4 >> 16) & 0xFF] == 4) {
                strDesc += rootElement.lang.alarm_temperture_too_high;
            }
//			strDesc += (alarm.param4>>16)&0xFF;		//传感器当前状态

            strDesc += ";";

        }
        strDesc += rootElement.lang.current_temperature + ":";//当前温度
        if (alarm.param1) {
            strDesc += alarm.param1 / 10.0 + rootElement.lang.alarm_temperator_unit + ";";	//摄氏度
        } else {
            strDesc += 0 + rootElement.lang.alarm_temperator_unit + ";";	//摄氏度
        }
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.net_alarm_type_tt_abnormal;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}


/**
 *  获取配置错误报警
 */
standardAlarm.prototype.getConfigurationErrorAlarm = function (armType) {
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    var strMark = '';
    if (armType == 236) {
        strMark = this.getAlarmStartEnd(1);

        strDesc = rootElement.lang.sensor_number + ":";	//传感器编号
        if (alarm.param4 > 0) {
            strDesc = analysisTireAlarmNumber(alarm.param4, strDesc);
            strDesc += " , ";
            strDesc += rootElement.lang.sensorNowStatus + ":";
            strDesc += (alarm.param4 >> 16) & 0xFF;		//传感器当前状态
            strDesc += ";";
        }
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.net_alarm_type_tc_abnormal;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}

/**
 *  获取传感器无信号报警
 */
standardAlarm.prototype.getSensorNoSignal = function (armType) {
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    var strMark = '';
    if (armType == 237) {
        strMark = this.getAlarmStartEnd(1);

        strDesc = rootElement.lang.sensor_number + ":";	//传感器编号
        if (alarm.param4 > 0) {
            strDesc = analysisTireAlarmNumber(alarm.param4, strDesc);
            strDesc += " , ";
            strDesc += rootElement.lang.sensorNowStatus + ":";
            strDesc += (alarm.param4 >> 16) & 0xFF;		//传感器当前状态
            strDesc += ";";

        }

    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.net_alarm_type_ts_nosignal; //传感器无信号这几个字
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}


/**
 *  获取低电压报警
 */
standardAlarm.prototype.getLowVoltageAlarm = function (armType) {
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    var strDesc = [];
    var strMark = '';
    if (armType == 238) {

        strMark = this.getAlarmStartEnd(1);

        strDesc = rootElement.lang.sensor_number + ":";	//传感器编号
        if (alarm.param4 > 0) {
            strDesc = analysisTireAlarmNumber(alarm.param4, strDesc);
            strDesc += " , ";
            strDesc += rootElement.lang.sensorNowStatus + ":";
            strDesc += (alarm.param4 >> 16) & 0xFF;		//传感器当前状态
            strDesc += ";";

        }
        strDesc += rootElement.lang.current_voltage + ":";	//当前电压
        if (alarm.param3) {
            strDesc += alarm.param3 / 10.0 + "V;";
        } else {
            strDesc += 0 + "V;";
        }

    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.net_alarm_type_ts_lowvoltage;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}


/**
 * 获取离线任务通知
 * @param param1
 * @param param2
 * @returns {String}
 */
standardAlarm.prototype.getOflTaskInfo = function (param1, param2) {
    var ret = '';
    switch (Number(param2)) {
        case 0://未执行
            ret = rootElement.lang.notPerformed;
            break;
        case 1://任务中
            if (param1 == 1) {
                ret = rootElement.lang.alarm_dev_img_ing;
            } else if (param1 == 2) {
                ret = rootElement.lang.alarm_file_task_ing;
            } else if (param1 == 3) {
                ret = rootElement.lang.alarm_dev_conf_ing;
            } else if (param1 == 4) {
                ret = rootElement.lang.alarm_wifi_conf_ing;
            }
            break;
        case 2://成功
            if (param1 == 1) {
                ret = rootElement.lang.alarm_dev_img_success;
            } else if (param1 == 2) {
                ret = rootElement.lang.alarm_file_task_success;
            } else if (param1 == 3) {
                ret = rootElement.lang.alarm_dev_conf_success;
            } else if (param1 == 4) {
                ret = rootElement.lang.alarm_wifi_conf_success;
            }
            break;
        case 3://失败
            if (param1 == 1) {
                ret = rootElement.lang.alarm_dev_img_fail;
            } else if (param1 == 2) {
                ret = rootElement.lang.alarm_file_task_fail;
            } else if (param1 == 3) {
                ret = rootElement.lang.alarm_dev_conf_fail;
            } else if (param1 == 4) {
                ret = rootElement.lang.alarm_wifi_conf_fail;
            }
            break;
        default:
            ret = rootElement.lang.notPerformed;
            break;
    }
    return ret;
}


/**
 *  获取上传视频报警
 */
standardAlarm.prototype.getCustomVedioAlarm = function (alarm) {
    var strMark = '';
    var strType = '';
    var strDesc = '';
    var armType = alarm.armIinfo;
    var dev = rootElement.vehicleManager.getDevice(alarm.devIdno);
    var chnName = dev.getSingleChnName(alarm.param1);
    if (armType == 44) {
        strMark = this.getAlarmStartEnd(1);//开始报警
        strType = rootElement.lang.report_realtime_video_alarm;
        strDesc = rootElement.lang.report_realtime_video + chnName;	//传感器编号
    } else {
        strMark = this.getAlarmStartEnd(0);//结束报警
        strType = rootElement.lang.stop_report_realtime_video_alarm;
        strDesc = rootElement.lang.stop_report_realtime_video + chnName;	//传感器编号
    }
    var ret = {};
    ret.strType = strType; //传感器无信号这几个字
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}
/**
 * 自定义报警
 * 离线任务通知
 */
standardAlarm.prototype.getCustomAlarmInfo = function (armType) {
    var strType = '';
    var strDesc = '';
    var alarm = null;
    var resultStr = '';
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    if (armType == 113) {
        //离线任务通知
        if (alarm.armIinfo == 19) {
            //this.startAlarm.param1 == 1 {
            //下发图片文件
            //2	//下发升级文件   升级文件 设备升级
            //3	//下发设备参数配置文件
            //4  /wifi围栏开关
            //strDesc = this.getOflTaskInfo(alarm.param1, alarm.param2);
            //任务类型
            switch (Number(alarm.param1)) {
                case 1:
                    strType = rootElement.lang.alarm_dev_iamge;
                    break;
                case 2:
                    strType = rootElement.lang.issue_upgrade_file;
                    break;
                case 3:
                    strType = rootElement.lang.deviceUpgrade;
                    break;
                case 4:
                    strType = rootElement.lang.alarm_wifi_config;
                    break;
            }
            //任务状态
            switch (Number(alarm.param2)) {
                case 0:
                    strDesc = rootElement.lang.notPerformed;
                    break;
                case 1:
                    strDesc = rootElement.lang.taskExecution;
                    break;
                case 2:
                    strDesc = rootElement.lang.taskCompletion;
                    break;
                case 3:
                    strDesc = rootElement.lang.taskFails;
                    break;
                default:
                    strDesc = rootElement.lang.notPerformed;
                    break;
            }
        }
        if (alarm.armIinfo == 44 || alarm.armIinfo == 45) {
            //上报实时视频（客户端做主动视频弹出）
            //param1  表示 通道号，param2表示码流类型
            var date = this.getCustomVedioAlarm(alarm);
            strType = date.strType; //传感器无信号这几个字
            strDesc = date.strDesc;
        }
        if (alarm.armIinfo == 53) {
            // http://192.168.1.192:8989/web/#/1?page_id=712
            //终端升级进度上报 param[0]:流水号 param[1]:升级类型 param[2]:升级状态 szDesc:升级进度 szImg:错误码
            strType = rootElement.lang.alarm_name_113_53;
            if (alarm.param1 != null) {
                strDesc += rootElement.lang.driver_down_response_number + ":" + alarm.param1;
            }
            var isZheJiangOrBeiJing = false;
            if (alarm.param3 != null) {
                isZheJiangOrBeiJing = alarm.param3 == 5 || alarm.param3 == 20;
            }
            var upgradeType = "";
            switch (Number(alarm.param2)) {

                case 0:// 0x00终端
                    upgradeType = rootElement.lang.terminal;
                    break;
                case 12:// 0x0c道路运输证IC卡读卡器
                    upgradeType = rootElement.lang.alarm_name_113_53_upgrade_type_12;
                    break;
                case 52:// 0x34北斗定位模块
                    upgradeType = rootElement.lang.alarm_name_113_53_upgrade_type_52;
                    break;
                case 100:// 0x64高级驾驶辅助
                case 113:// 0x71高级驾驶辅助 辽宁(4)的0x71-0x74对应苏标的0x64-0x67
                    upgradeType = rootElement.lang.autoUpgrade_type_adas;
                    break;
                case 101:// 0x65驾驶状态监控
                    upgradeType = rootElement.lang.autoUpgrade_type_dsm;
                    break;
                case 114:// 0x72驾驶状态监控
                    upgradeType = rootElement.lang.autoUpgrade_type_dsm;
                    if (this.isChuanBiao2021ParamConfig(alarm.devIdno)) {
                        upgradeType = rootElement.lang.load_monitoring;
                    }
                    break;
                case 102:// 0x66胎压监测
                case 115:// 0x73胎压监测
                    if (isZheJiangOrBeiJing) {
                        upgradeType = rootElement.lang.autoUpgrade_type_blind;
                    } else {
                        upgradeType = rootElement.lang.autoUpgrade_type_tire;
                    }
                    break;
                case 103:// 0x67盲点监测
                case 116:// 0x74盲点监测
                    upgradeType = rootElement.lang.autoUpgrade_type_blind;
                    break;
            }
            // 升级类型
            if (upgradeType) {
                if (strDesc) {
                    strDesc += ";";
                }
                strDesc += rootElement.lang.autoUpgrade_type + ":" + upgradeType;
            }
            var taskStatus = "";
            switch (Number(alarm.param3)) {
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                    taskStatus = rootElement.lang["alarm_name_113_53_status_" + Number(alarm.param3)];
                    break;
            }
            // 升级状态
            if (taskStatus) {
                if (strDesc) {
                    strDesc += ";";
                }
                strDesc += rootElement.lang.alarm_name_113_53_upgrade_status + ":" + taskStatus;
            }
            // param[1]:升级类型param[2]:升级状态 szDesc:升级进度szImg:错误码
            var szDesc = alarm.desc;
            if (szDesc != null) {
                if (strDesc) {
                    strDesc += ";";
                }
                strDesc += rootElement.lang.alarm_name_113_53_upgrade_progress + ":" + (parseInt(szDesc) || "0") + "%";
            }
            if (alarm.imgFile) {//
                if (strDesc) {
                    strDesc += ";";
                }
                strDesc += rootElement.lang.alarm_name_113_53_error_code + ":" + alarm.imgFile;
            }
        }
        if (alarm.armIinfo == 59) {
            /*
           新增param[2]存储地方协议类型,客户端和web根据类型解析
           #define NET_CUSTOM_ALARM_TYPE_UPDATE_RESULT  59 //终端升级结果通知
           //param[0]:升级类型(当值>=256,表示出租车参数,再减去256解析类型)
           //param[1]:升级结果
           //param[2]:(出租车时有效,24-31位表示厂商标识 16-23表示硬件版本号(BCD) 0-15表示软件版本号(BCD)
           //param[2]:(非出租车时表示主动安全地方协议,为0时按苏标解析)
           2.浙江(5)和北京(20),0x66表示盲点监测,也就是苏标(1)的0x67
           3.辽宁(4)的0x71-0x74对应苏标的0x64-0x67
           4.升级上报报警描述解析时,如果地方标准参数有效,解析下词条*/
            strType = rootElement.lang.alarm_name_113_59;
            // 是否出租车的
            var isTaxi = alarm.param1 != null && Number(alarm.param1) >= 256;
            var descArray = [];
            var isZheJiangOrBeiJing = false;
            if (alarm.param3 != null) {
                isZheJiangOrBeiJing = alarm.param3 == 5 || alarm.param3 == 20;
                // 判断协议类型
                if (!isTaxi) {
                    // 浙江
                    if (alarm.param3 == 5) {
                        descArray.push(rootElement.lang.standard1078ZheBiao);
                    }
                    // 北京
                    if (alarm.param3 == 20) {
                        descArray.push(rootElement.lang.standard1078BeiJing);
                    }
                    // 辽宁
                    if (alarm.param3 == 4) {
                        descArray.push(rootElement.lang.standard1078YingKou);
                    }
                } else {
                    // 出租车
                    //设备类型
                    var device_type = "";
                    if (alarm.param1 != null) {
                        switch (Number(alarm.param1)) {
                            case 256:
                                device_type = "ISU";
                                break;
                            case 257:
                                device_type = rootElement.lang.Communication_module;
                                break;
                            case 258:
                                device_type = rootElement.lang.Counting_and_timing_device;
                                break;
                            case 259:
                                device_type = rootElement.lang.Taxi_security_module;
                                break;
                            case 260:
                                device_type = rootElement.lang.LED_display;
                                break;
                            case 261:
                                device_type = rootElement.lang.Cruising_roof_light;
                                break;
                            case 263:
                                device_type = rootElement.lang.camera;
                                break;
                            case 264:
                                device_type = rootElement.lang.Satellite_positioning_equipment;
                                break;
                            case 272:
                                device_type = rootElement.lang.Terminal_interaction_equipment;
                                break;
                            case 274:
                                device_type = rootElement.lang.Invoice_printer;
                                break;
                        }
                    }
                    if (device_type) {
                        descArray.push(rootElement.lang.device_type + ":" + device_type);
                    }
                    //  24-31位表示厂商标识
                    descArray.push(rootElement.lang.Vendor_ID + ":" + (Number(alarm.param3 >> 24) & 0xFF));
                    //  16-23表示硬件版本号(BCD)
                    descArray.push(rootElement.lang.Hardware_version_number + ":" + (Number(alarm.param3 >> 16) & 0xFF).toString(16));
                    // 0-15表示软件版本号(BCD)
                    descArray.push(rootElement.lang.haiju_version_detail_soft + ":" + (Number(alarm.param3 >> 8) & 0xFF).toString(16)  + "." + (Number(alarm.param3) & 0xFF).toString(16));
                }
            }
            // 升级类型
            var upgradeType = "";
            if (alarm.param1 != null) {
                switch (Number(alarm.param1)) {
                    case 0:// 0x00终端
                        upgradeType = rootElement.lang.terminal;
                        break;
                    case 12:// 0x0c道路运输证IC卡读卡器
                        upgradeType = rootElement.lang.alarm_name_113_53_upgrade_type_12;
                        break;
                    case 52:// 0x34北斗定位模块
                        upgradeType = rootElement.lang.alarm_name_113_53_upgrade_type_52;
                        break;
                    case 100:// 0x64高级驾驶辅助
                    case 113:// 0x71高级驾驶辅助 辽宁(4)的0x71-0x74对应苏标的0x64-0x67
                        upgradeType = rootElement.lang.autoUpgrade_type_adas;
                        break;
                    case 101:// 0x65驾驶状态监控
                        upgradeType = rootElement.lang.autoUpgrade_type_dsm;
                        break;
                    case 114:// 0x72驾驶状态监控
                        upgradeType = rootElement.lang.autoUpgrade_type_dsm;
                        if (this.isChuanBiao2021ParamConfig(alarm.devIdno)) {
                            upgradeType = rootElement.lang.load_monitoring;
                        }
                        break;
                    case 102:// 0x66胎压监测
                    case 115:// 0x73胎压监测
                        if (isZheJiangOrBeiJing) {
                            upgradeType = rootElement.lang.autoUpgrade_type_blind;
                        } else {
                            upgradeType = rootElement.lang.autoUpgrade_type_tire;
                        }
                        break;
                    case 103:// 0x67盲点监测
                    case 116:// 0x74盲点监测
                        upgradeType = rootElement.lang.autoUpgrade_type_blind;
                        break;
                }
            }
            // 升级类型
            if (upgradeType) {
                descArray.push(rootElement.lang.autoUpgrade_type + ":" + upgradeType);
            }
            // this.success = "成功";
            // this.failure = "失败";
            // this.cancel = "取消";
            // this.no_target_dev = "未找到目标设备";
            // this.no_support_dev = "硬件型号不支持";
            // this.same_soft_dev = "软件版本相同";
            // this.no_support_soft = "软件版本不支持";
            var taskResult = "";
            if (alarm.param2 != null) {
                switch (Number(alarm.param2)) {
                    case 0:
                        taskResult = rootElement.lang.success;
                        break;
                    case 1:
                        taskResult = rootElement.lang.failure;
                        break;
                    case 2:
                        taskResult = rootElement.lang.cancel;
                        break;
                    case 16:
                        taskResult = rootElement.lang.no_target_dev;
                        break;
                    case 17:
                        taskResult = rootElement.lang.no_support_dev;
                        break;
                    case 18:
                        taskResult = rootElement.lang.same_soft_dev;
                        break;
                    case 19:
                        taskResult = rootElement.lang.no_support_soft;
                        break;

                    case 256:
                        taskResult = "软件版本号一致，无需升级";
                        break;
                    case 257:
                        taskResult = "升级成功";
                        break;
                    case 258:
                        taskResult = "升级失败";
                        break;
                    case 259:
                        taskResult = "厂商标识不一致";
                        break;
                    case 260:
                        taskResult = "硬件版本号不一致";
                        break;
                    case 261:
                        taskResult = "下载升级文件失败";
                        break;
                    case 262:
                        taskResult = "升级服务器主动取消升级";
                        break;
                    case 263:
                        taskResult = "设备主动放弃升级（非自身程序）";
                        break;
                    case 264:
                        taskResult = "服务器连接失败";
                        break;
                    case 265:
                        taskResult = "服务器登录失败";
                        break;
                }
            }
            // 升级结果
            if (taskResult) {
                resultStr = taskResult;
                descArray.push(rootElement.lang.autoUpgrade_result + ":" + taskResult);
            }
            if (descArray.length > 0) {
                strDesc = descArray.join(",");
            }
        }
        if (alarm.armIinfo == 62) {
            //62	//驾驶员身份库数据下载应答
            //	#define CUSTOM_ALARM_TYPE_DRIVER_IMAGE_DOWN
            //	param[0]:应答结果 0：成功，1：失败
            //	param[1]:应答流水号
            //	param[2]+高8位:需要下载总数 param[2]+低8位:当前下载到第几个文件
            //	desc:人脸ID
            strType = rootElement.lang.driver_down_response;
            if (alarm.param1) {
                strDesc += rootElement.lang.driver_down_response_number + ":" + alarm.param1;
            }
            if (alarm.param2 != null) {
                if (strDesc) {
                    strDesc += ",";
                }
                //  0：成功，1：失败
                var resultStr = rootElement.lang.failure;
                switch (alarm.param2) {
                    case 0:
                        resultStr = rootElement.lang.success;
                        break;
                }
                strDesc += rootElement.lang.response_result + ":" + resultStr;
            }

            if (alarm.param3) {
                var cur = alarm.param3 & 0xFF;
                var tale = (alarm.param3 >> 8) & 0xFF;
                if (strDesc) {
                    strDesc += ",";
                }
                strDesc += rootElement.lang.driver_down_response_file_number + ":" + tale + ","
                    + rootElement.lang.driver_down_response_file_number_mid + cur + rootElement.lang.driver_down_response_file_number_tail;
            }
            if (alarm.desc) {
                if (strDesc) {
                    strDesc += ",";
                }
                strDesc += rootElement.lang.driver_down_response_faceId + ":" + alarm.desc;
            }
        }
        if (alarm.armIinfo == 64) {
            // 64	//驾驶员身份信息设置应答
            //param[0]:应答流水号
            // param[1]:需要下载总数
            // param[2]:当前下载到第几个文件
            // desc:驾驶员ID;驾驶员姓名
            strType = rootElement.lang.alarm_name_113_64;
            if (alarm.param1) {
                strDesc += rootElement.lang.driver_down_response_number + ":" + alarm.param1;
            }
            if (alarm.param2 || alarm.param3) {
                var cur = alarm.param2 || "0";
                var tale = alarm.param3 || "0";
                if (strDesc) {
                    strDesc += ",";
                }
                strDesc += rootElement.lang.driver_down_response_file_number + ":" + tale + ","
                    + rootElement.lang.driver_down_response_file_number_mid + cur + rootElement.lang.driver_down_response_file_number_tail;
            }
            if (alarm.desc) {
                if (strDesc) {
                    strDesc += ",";
                }
                strDesc += alarm.desc;
            }
        }
        if (alarm.armIinfo == 65) {
            // 65	//驾驶员身份验证上报
            //param0:验证类型
            // param1:验证结果
            // param2:相似度
            // desc:驾驶员ID;驾驶员姓名
            // gps:验证地点
            // imgfile:身份信息类型;身份信息数据ID
            strType = rootElement.lang.alarm_name_113_65;
            var strDescArray = [];
            if (alarm.desc) {
                var split = alarm.desc.split(";");
                if (split) {
                    strDescArray.push(rootElement.lang.status_driver_id + ":" + split[0]);
                }
                if (split.length > 1) {
                    strDescArray.push(rootElement.lang.alarm_driver_name + ":" + split[1]);
                }
            }
            // 验证类型
            if (alarm.param1 != null) {
                var typeStr = "";
                switch (alarm.param1) {
                    case 0://
                        typeStr += rootElement.lang.status_drive_open;
                        break;
                    case 1:// 巡检验证
                        typeStr += rootElement.lang.status_drive_inspection;
                        break;
                }
                if (typeStr) {
                    strDescArray.push(rootElement.lang.authentication_type + ":" + typeStr);
                }
            }
            // 验证结果
            //  0：成功，1：失败
            if (alarm.param2 != null) {
                var resultStr = rootElement.lang.failure;
                switch (alarm.param2) {
                    case 0:// 成功
                        resultStr = rootElement.lang.success;
                        break;
                    case 2:// 驾驶员注册
                        resultStr = rootElement.lang.status_driver_register;
                        break;
                }
                strDescArray.push(rootElement.lang.authentication_result + ":" + resultStr);
            }
            // 相似度
            if (alarm.param3 != null) {
                strDescArray.push(rootElement.lang.similarity + ":" + alarm.param3 + "%");
            }
            // imgfile:身份信息类型;身份信息数据ID
            if (alarm.imgFile) {//
                // 1 图片 2 文本
                var idTypeStr = "";
                var idInfoStr = "";
                var type = parseInt(alarm.imgFile) || "0";
                switch (parseInt(type)) {
                    case 1:// 图片
                        idTypeStr = rootElement.lang.report_vehicle_photo;
                        if (alarm.imgFile.split(";").length > 1) {
                            idInfoStr = alarm.imgFile.split(";")[1];
                        }
                        break;
                    case 2:// 文本
                        idTypeStr = rootElement.lang.status_text;
                        break;
                }
                if (idTypeStr) {
                    strDescArray.push(rootElement.lang.status_id_info_type + ":" + idTypeStr);
                }
                if (idInfoStr) {
                    strDescArray.push(rootElement.lang.status_id_info_id + ":" + idInfoStr);
                }
            }
            if (strDescArray.length > 0) {
                strDesc = strDescArray.join(",");
            }
        }
        if (alarm.armIinfo == 66) {
            // 66    //设备上报维修信息
            // param[0]:故障类型
            // param[1]:扩展车辆信号状态位(对应值为LongGps中的uiExtraStatus)
            strType = rootElement.lang.alarm_name_113_66;
            if (alarm.param1 != null) {
                switch (alarm.param1) {
                    case 0:
                        strDesc += rootElement.lang.fault_type_0;
                        break;
                    case 1:
                        strDesc += rootElement.lang.fault_type_1;
                        break;
                    case 2:
                        strDesc += rootElement.lang.fault_type_2;
                        break;
                    case 3:
                        strDesc += rootElement.lang.fault_type_3;
                        break;
                    case 4:
                        strDesc += rootElement.lang.fault_type_4;
                        break;
                    case 5:
                        strDesc += rootElement.lang.fault_type_5;
                        break;
                    case 6:
                        strDesc += rootElement.lang.fault_type_6;
                        break;
                }
            }
        }
        if (alarm.armIinfo == 67) {
            // 67	//驾驶员身份库数据下载应答
            // param[0]:应答流水号
            // param[1]:应答结果
            // param[2]:设置类型
            // param[3]:高16:需要下载总数 (低16)当前下载到第几个文件
            // desc:人脸ID
            strType = rootElement.lang.alarm_name_113_67;
            if (alarm.param1) {
                strDesc += rootElement.lang.driver_down_response_number + ":" + alarm.param1;
            }
            if (alarm.param2 != null) {
                if (strDesc) {
                    strDesc += ",";
                }
                //  0：成功，1：失败
                var resultStr = rootElement.lang.failure;
                switch (alarm.param2) {
                    case 0:
                        resultStr = rootElement.lang.success;
                        break;
                }
                strDesc += rootElement.lang.response_result + ":" + resultStr;
            }
            // 0 增加(全替换) 1 删除(全删除) 2 删除指定条目 3 修改
            var typeStr = "";
            if (alarm.param3 != null) {
                switch (alarm.param3) {
                    case 0:
                        typeStr += rootElement.lang.add_replace_all;
                        break;
                    case 1:
                        typeStr += rootElement.lang.delete_all;
                        break;
                    case 2:
                        typeStr += rootElement.lang.delete_select;
                        break;
                    case 3:
                        typeStr += rootElement.lang.modify;
                        break;
                }
            }
            if (typeStr) {
                if (strDesc) {
                    strDesc += ",";
                }
                strDesc += rootElement.lang.Setting_type + ":" + typeStr;
            }
            if (alarm.param4) {
                var cur = alarm.param4 & 0xFFFF;
                var tale = (alarm.param4 >> 16) & 0xFF;
                if (strDesc) {
                    strDesc += ",";
                }
                strDesc += rootElement.lang.driver_down_response_file_number + ":" + tale + ","
                    + rootElement.lang.driver_down_response_file_number_mid + cur + rootElement.lang.driver_down_response_file_number_tail;
            }
            if (alarm.desc) {
                if (strDesc) {
                    strDesc += ",";
                }
                strDesc += rootElement.lang.driver_down_response_faceId + ":" + alarm.desc;
            }
        }
    }
    var ret = {};
    ret.strType = strType;
    ret.strDesc = strDesc;
    ret.result = resultStr;
    ret.armIinfo = alarm.armIinfo;
    ret.param1 = alarm.param1;
    ret.param2 = alarm.param2;
    ret.param3 = alarm.param3;
    ret.time = alarm.getArmTime();
    var point = alarm.getMapLngLatStr();
    var pos = alarm.getLngLatStr();
    if (point == null || pos == '0,0' || pos == '0.000000,0.000000') {
        pos = rootElement.lang.monitor_gpsUnvalid;
        ret.isGpsValid = false;
    } else {
        ret.isGpsValid = true;
    }
    ret.pos = pos;
    ret.point = point;
    return ret;
}

//获取司机信息
standardAlarm.prototype.getDriverInfoEx = function (driverId) {
    if (rootElement.vehicleManager) {
        return rootElement.vehicleManager.getDriverInfo(driverId);
    }
    return null;
}

//获取线路信息
standardAlarm.prototype.getLineInfo = function (lineId) {
    if (rootElement.vehicleManager) {
        return rootElement.vehicleManager.getLineInfo(lineId);
    }
    return null;
}

//获取站点信息
standardAlarm.prototype.getStationInfo = function (lineId, lineDirect, stationIndex) {
    if (rootElement.vehicleManager) {
        return rootElement.vehicleManager.getStationInfoEx(lineId + '-' + lineDirect + '-' + stationIndex);
    }
    return null;
}

/**
 * 报站信息
 */
standardAlarm.prototype.getBusArrivalStationInfo = function (armType) {
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    var strType = "";
    var strDesc = [];
    var status = this.getAlarmStatus();

    if (armType == 117) {
        var lineId = status.lineId; //线路id
        var lineDirect = status.lineDirect; //线路上下行 0 上行 1下行
        var stationId = status.stationFlag; //站点标识 0站点 1站场
        var stationIndex = status.stationIndex; //站点索引
        var stationStatus = status.stationStatus; //站点状态 0到站 1出站
        var driverId = alarm.param1;
        var lineInfo = this.getLineInfo(lineId);
        var stationIfo = this.getStationInfo(lineId, lineDirect, stationIndex);
        var nextStationInfo = this.getStationInfo(lineId, lineDirect, stationIndex + 1);
        var driverInfo = this.getDriverInfoEx(driverId);

        var stationName = '';
        if (stationIfo) {
            stationName = stationIfo.getName();
        }
        var nextStationName = '';
        if (nextStationInfo) {
            nextStationName = nextStationInfo.getName();
        }
        var lineName = '';
        if (lineInfo) {
            lineName = lineInfo.getName()
            if (lineDirect == 1) {
                lineName += '(' + rootElement.lang.line_down + ')';
            } else {
                lineName += '(' + rootElement.lang.line_up + ')';
            }
        }
        var driverName = '';
        if (driverInfo) {
            driverName = driverInfo.getName() + '(' + driverInfo.getJobNum() + ')';
        }
        if (stationName) {
            if (stationStatus == 0) {
                strDesc.push(rootElement.lang.monitor_cur_station_label + stationName);
                strType = rootElement.lang.monitor_vehicle_arrival_station;
            } else {
                strDesc.push(rootElement.lang.monitor_pre_station_label + stationName);
                strType = rootElement.lang.monitor_vehicle_out_station;
            }
        }
        if (nextStationName) {
            strDesc.push(rootElement.lang.monitor_next_station_label + nextStationName);
        }
        if (lineName) {
            strDesc.push(rootElement.lang.monitor_belong_line_label + lineName);
        }
        if (driverName) {
            strDesc.push(rootElement.lang.monitor_labelDriver + driverName);
        }
    }
    var ret = {};
    ret.strType = strType;
    ret.strDesc = strDesc.toString();
    ret.time = alarm.getArmTime();
    var point = alarm.getMapLngLatStr();
    var pos = alarm.getLngLatStr();
    if (point == null || pos == '0,0' || pos == '0.000000,0.000000') {
        pos = rootElement.lang.monitor_gpsUnvalid;
        ret.isGpsValid = false;
    } else {
        ret.isGpsValid = true;
    }
    ret.pos = pos;
    ret.point = point;
    return ret;
}

/**
 * 溜站报警
 */
standardAlarm.prototype.getBusSlipStationAlarm = function (armType) {
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    var strType = "";
    var strDesc = [];
    var status = this.getAlarmStatus();
    if (armType == 118) {
        var lineId = status.lineId; //线路id
        var lineDirect = status.lineDirect; //线路上下行 0 上行 1下行
        var stationId = status.stationFlag; //站点标识 0站点 1站场
        var stationIndex = status.stationIndex; //站点索引
        var stationStatus = status.stationStatus; //站点状态 0到站 1出站
        var driverId = alarm.param1;
        var lineInfo = this.getLineInfo(lineId);
        var stationIfo = this.getStationInfo(lineId, lineDirect, stationIndex);
        var nextStationInfo = this.getStationInfo(lineId, lineDirect, stationIndex + 1);
        var driverInfo = this.getDriverInfoEx(driverId);

        var stationName = '';
        if (stationIfo) {
            stationName = stationIfo.getName();
        }
        var nextStationName = '';
        if (nextStationInfo) {
            nextStationName = nextStationInfo.getName();
        }
        var lineName = '';
        if (lineInfo) {
            lineName = lineInfo.getName()
            if (lineDirect == 1) {
                lineName += '(' + rootElement.lang.line_down + ')';
            } else {
                lineName += '(' + rootElement.lang.line_up + ')';
            }
        }
        var driverName = '';
        if (driverInfo) {
            driverName = driverInfo.getName() + '(' + driverInfo.getJobNum() + ')';
        }
        if (stationName) {
            if (stationStatus == 0) {
                strDesc.push(rootElement.lang.monitor_cur_station_label + stationName);
                strType = rootElement.lang.monitor_vehicle_arrival_station;
            } else {
                strDesc.push(rootElement.lang.monitor_pre_station_label + stationName);
                strType = rootElement.lang.monitor_vehicle_out_station;
            }
        }
        if (nextStationName) {
            strDesc.push(rootElement.lang.monitor_next_station_label + nextStationName);
        }
        if (lineName) {
            strDesc.push(rootElement.lang.monitor_belong_line_label + lineName);
        }
        if (driverName) {
            strDesc.push(rootElement.lang.monitor_labelDriver + driverName);
        }
    }
    var ret = {};
    ret.strType = strType;
    ret.strDesc = strDesc.toString();
    return ret;
}

/**
 * 胎压报警
 */
standardAlarm.prototype.getTpmsAlarm = function (armType) {
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    var strType = "";
    var strDesc = [];
    var ret = {};
    if (armType == 239) {
        strMark = this.getAlarmStartEnd(1);
        if (alarm.armIinfo == 1) {
            ret.strType = rootElement.lang.battery_voltage_warning;	//当报警信息类型等于1时，为电池电压报警
        } else if (alarm.armIinfo == 2) {
            ret.strType = rootElement.lang.tire_pressure_abnormal_alarm;	//当armIinfo等于2时，为轮胎 压力异常报警
        } else if (alarm.armIinfo == 3) {
            ret.strType = rootElement.lang.temperature_anomalies;	//当armIinfo等于3时，为温度异常报警
        }

        var strDesc = rootElement.lang.sensor_number + ":";	//传感器编号
        if (alarm.param4 > 0) {
            strDesc = analysisTireAlarmNumber(alarm.param4, strDesc);
            strDesc += " , ";
            strDesc += rootElement.lang.sensorNowStatus + ":";
            strDesc += (alarm.param4 >> 16) & 0xFF;		//传感器当前状态
            strDesc += ";";
        }
        strDesc += rootElement.lang.current_temperature + ":";//当前温度
        if (alarm.param1) {
            strDesc += alarm.param1 / 10.0 + rootElement.lang.alarm_temperator_unit + ";";	//摄氏度
        } else {
            strDesc += 0 + rootElement.lang.alarm_temperator_unit + ";";	//摄氏度
        }

        strDesc += rootElement.lang.the_current_tire_pressure + ":";	//当前胎压
        if (alarm.param2) {
            strDesc += alarm.param2 / 10.0 + "P;";
        } else {
            strDesc += 0 + "P;";
        }
        strDesc += rootElement.lang.current_voltage + ":";	//当前电压
        if (alarm.param3) {
            strDesc += alarm.param3 / 10.0 + "V;";
        } else {
            strDesc += 0 + "V;";
        }
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.net_alarm_type_tpms;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;

}
/**
 * 设备开锁、设备上锁报警
 */
standardAlarm.prototype.getDeviceLockAlarm = function (armType) {
    var strMark = '';
    var strType = '';
    var alarm = null;
    var strDesc = '';
    if (armType == 182) {
        strType = rootElement.lang.alarm_type_device_unlock;
    } else {
        strType = rootElement.lang.alarm_type_device_lock;
    }
    var ret = {};
    ret.strType = strType;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}

/**
 * 危化区域报警
 * 禁行区域、禁行线路、异地车辆入境
 */
standardAlarm.prototype.getChemicalAreaAlarm = function (armType) {
    var strMark = '';
    var strType = '';
    var alarm = null;
    var strDesc = '';
    //禁行区域  //禁行线路  //异地车辆入境
    if (armType == 232 || armType == 233 || armType == 234) {
        strMark = this.getAlarmStartEnd(1);
        alarm = this.startAlarm;
    } else {
        strMark = this.getAlarmStartEnd(0);
        alarm = this.endAlarm;
    }
    //alarm.armIinfo 区域id
    switch (armType) {
        case 232:
        case 282:
            strType = rootElement.lang.forbiddenArea;
            break;
        case 233:
        case 283:
            strType = rootElement.lang.forbiddenLine;
            break;
        case 234:
        case 284:
            strType = rootElement.lang.remoteVehicleEntry;
            break;
    }
    var ret = {};
    if (alarm && alarm.desc) {
        var desc = alarm.desc.split(';');  //禁行区域、线路等 车牌号;区域名称;运单号
        if (desc.length > 0) {
            ret.vehiIdno = desc[0];
        }
        if (desc.length > 1) {
            strDesc += rootElement.lang.rule_areaName + '：' + desc[1];
        }
        if (desc.length > 2) {
            strDesc += '，' + rootElement.lang.waybillNumber + '：' + desc[2];
            ret.waybillNum = desc[2];
        }
    }
    ret.strType = strType;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}

/**
 *    面向警示
 */
standardAlarm.prototype.getFaceAlarm = function (armType) {
    var strMark = '';
    if (armType == 170) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_face;
    ret.strMark = strMark;
    return ret;
}

/**
 *    闭眼警示
 */
standardAlarm.prototype.getEyesClosedAlarm = function (armType) {
    var strMark = '';
    if (armType == 172) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_eyesClosed;
    ret.strMark = strMark;
    return ret;
}


/**
 *    手机警示
 */
standardAlarm.prototype.getPhoneAlarm = function (armType) {
    var strMark = '';
    if (armType == 174) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_phone;
    ret.strMark = strMark;
    return ret;
}

/**
 *    抽烟警示
 */
standardAlarm.prototype.getSmokeAlarm = function (armType) {
    var strMark = '';
    if (armType == 176) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_smoke;
    ret.strMark = strMark;
    return ret;
}

/**
 *    离岗警示
 */
standardAlarm.prototype.getLeaveJobAlarm = function (armType) {
    var strMark = '';
    if (armType == 186) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.adas_alarm_type_out_work;
    ret.strMark = strMark;
    return ret;
}

/**
 *    左顾右盼
 */
standardAlarm.prototype.getLookAroundAlarm = function (armType) {
    var strMark = '';
    if (armType == 188) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_lookAround;
    ret.strMark = strMark;
    return ret;
}

/**
 *    打哈欠
 */
standardAlarm.prototype.getYawnAlarm = function (armType) {
    var strMark = '';
    if (armType == 190) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_yawn;
    ret.strMark = strMark;
    return ret;
}

/**
 *    氧气浓度低
 */
standardAlarm.prototype.getLowOxygenAlarm = function (armType) {
    var strMark = '';
    if (armType == 192) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_lowOxygen;
    ret.strMark = strMark;
    return ret;
}

/**
 *    急加速
 */
standardAlarm.prototype.getRapidAccelerationAlarm = function (armType) {
    var strMark = '';
    if (armType == 246) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_rapidAcceleration;
    ret.strMark = strMark;
    return ret;
}

/**
 *    急减速
 */
standardAlarm.prototype.getRapidDecelerationAlarm = function (armType) {
    var strMark = '';
    if (armType == 247) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_rapidDeceleration;
    ret.strMark = strMark;
    return ret;
}

/**
 *    其他视频设备故障报警
 */
standardAlarm.prototype.getOtherDeviceError = function (armType) {
    var strMark = '';
    var strDesc = '';
    if (armType == 244) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.other_device_error;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}

/**
 *    特殊报警录像达到存储阈值报警
 */
standardAlarm.prototype.getRecordThreshold = function (armType) {
    var strMark = '';
    if (armType == 245) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.record_threshold;
    ret.strMark = strMark;
    return ret;
}

/**
 *    烟感报警
 */
standardAlarm.prototype.getSmokeInductionAlarm = function (armType) {
    var strMark = '';
    if (armType == 194) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.smoke_induction_alarm;
    ret.strMark = strMark;
    return ret;
}

/**
 *    超员
 */
standardAlarm.prototype.getOverLoad = function (armType) {
    var strMark = '';
    if (armType == 231) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.overload;
    ret.strMark = strMark;
    return ret;
}

/**
 *    驾驶员识别报警
 */
standardAlarm.prototype.getDriverIdentify = function (armType) {
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    var strDesc = [];
    var strMarkType = '';
    if (armType == 636 || armType == 686 || armType == 664) {
        if (armType == 636) {
            if (alarm.armIinfo === 1) {
                strMarkType = rootElement.lang.alarm_name_636 + " " + rootElement.lang.driver_identification_through;
            } else {
                strMarkType = rootElement.lang.alarm_name_636 + " " + rootElement.lang.driver_identification_notThrough;
            }
        } else if (armType == 664) {
            if (alarm.armIinfo === 1) {
                strMarkType = rootElement.lang.alarm_name_664 + " " + rootElement.lang.driver_identification_through;
            } else {
                strMarkType = rootElement.lang.alarm_name_664 + " " + rootElement.lang.driver_identification_notThrough;
            }
        } else {
            if (alarm.armIinfo === 1) {
                strMarkType = rootElement.lang.alarm_name_686 + " " + rootElement.lang.driver_identification_through;
            } else {
                strMarkType = rootElement.lang.alarm_name_686 + " " + rootElement.lang.driver_identification_notThrough;
            }
        }
    } else {
        switch (Number(armType)) {
            case 646:
                strMarkType = rootElement.lang.alarm_name_646;
                break;
            case 647:
                strMarkType = rootElement.lang.alarm_name_647;
                break;
            case 648:
                strMarkType = rootElement.lang.alarm_name_648;
                break;
            case 649:
                strMarkType = rootElement.lang.alarm_name_649;
                break;
            case 696:		//驾驶员识别事件
                strMarkType = rootElement.lang.net_alarm_type_sb_driver_identification;
                break;
            case 697: //刷脸签到身份识别上报事件
                strMarkType = rootElement.lang.alarm_name_697;
                break;
            case 698: //动态查岗身份识别上报事件
                strMarkType = rootElement.lang.alarm_name_698;
                break;
            default:
                break;
        }
    }

//	新版本的识别定义
//	#define GPS_EVENT_TYPE_SB_DRIVER_IDENTIFICATION         636 //驾驶员识别事件(平台)
//	AlarmInfo:0:识别失败 1:识别成功
//	param[0]:识别成功表示对比度,识别失败表示错误码 param[1]:低16位表示失败相似度,高16位表示通过相似度
//	param[2]:识别失败时表示失败类型 0:无效 1:识别失败 2:无法识别 3:比对失败 param[3]:识别司机ID
//	#define GPS_EVENT_TYPE_SB_DYNAMIC_IDENTIFICATION        686 //动态查岗(平台) AlarmInfo:0:识别失败 1:识别成功
//	param[0]:识别成功表示对比度,识别失败表示错误码 param[1]:低16位表示失败相似度,高16位表示通过相似度
//	param[2]:识别失败时表示失败类型 0:无效 1:识别失败 2:无法识别 3:比对失败 param[3]:识别司机ID

    // #define NET_EVENT_TYPE_HLJ_DRIVER_IDENTIFICATION_REPORT            699        //驾驶员身份比对结果上报
    //AlarmInfo:0:识别失败 1:识别成功 param[0]:识别对比度
    //param[1]:比对类型(注意:参数不一致)
    //param[2]:识别失败时表示失败类型 21：人证不符 22：比对超时 23：无指定人脸信息(提示:新增3种类型,用来区分原来的失败类型)
    //desc:主动安全报警标识号
    //szImgFile:从业资格证编码;驾驶员人脸信息ID(注意:参数不一致)

    // 优化解析：
    // 识别成功，相似度50%
    // 识别失败，相似度50%
    if (alarm.armIinfo != null) {
        if (alarm.armIinfo == 1) {
            strDesc.push(rootElement.lang.net_alarm_type_sb_driver_identification_through);
        } else {
            strDesc.push(rootElement.lang.net_alarm_type_sb_driver_identification_notThrough);
        }
        if (alarm.armIinfo != 1) {
            var param3 = alarm.param3;
            if (0 == param3) {
                strDesc.push(rootElement.lang.monitor_invalid);
            }
            if (2 == param3) {
                strDesc.push(rootElement.lang.net_alarm_type_sb_driver_identification_unknown);
            }
            if (3 == param3) {
                strDesc.push(rootElement.lang.net_alarm_type_sb_driver_identification_notCompare);
            }
            if (10 == param3) {
                strDesc.push(rootElement.lang.driver_identification_event_matching_success);
            }
            if (11 == param3) {
                strDesc.push(rootElement.lang.driver_identification_event_matching_fail);
            }
            if (12 == param3) {
                strDesc.push(rootElement.lang.driver_identification_event_time_out);
            }
            if (13 == param3) {
                strDesc.push(rootElement.lang.driver_identification_event_not_enabled);
            }
            if (14 == param3) {
                strDesc.push(rootElement.lang.driver_identification_event_connection_abnormality);
            }
            if (15 == param3) {
                strDesc.push(rootElement.lang.driver_identification_event_no_specified_face);
            }
            if (16 == param3) {
                strDesc.push(rootElement.lang.driver_identification_event_unmanned_face_library);
            }
            if (21 == param3) {
                strDesc.push(rootElement.lang.personal_identification);
            }
            if (22 == param3) {
                strDesc.push(rootElement.lang.match_timeout);
            }
            if (23 == param3) {
                strDesc.push(rootElement.lang.no_face_nformation);
            }
        }
        // 相似度
        if (alarm.armIinfo != -2 && alarm.armIinfo != -3 && alarm.param1 != null) {
            strDesc.push(rootElement.lang.similarity + "" + (alarm.param1 / 100).toFixed(2) + "%");
        }
    }
    var ret = {};
    ret.strType = strMarkType;
    ret.strDesc = strDesc.toString();
    return ret;
}


standardAlarm.prototype.getAlarm100 = function () {
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    var strDesc = '';

    if(alarm != null){
        strDesc = rootElement.lang.matching_degree + '：' + alarm.param2 + '%,' + rootElement.lang.matching_threshold + '：' + alarm.param3 + '%';
    }

    var ret = {};
    ret.strType = rootElement.lang.alarm_name_100;
    ret.strDesc = strDesc;
    return ret;
}

standardAlarm.prototype.getAlarm144 = function () {
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    var strDesc = '';

    if(alarm != null){
        strDesc = alarm.desc;
    }

    var ret = {};
    ret.strType = rootElement.lang.alarm_name_144;
    ret.strDesc = strDesc;
    return ret;
}

/**
 *    布控人脸识别报警
 */
standardAlarm.prototype.getControlIdentify = function (armType) {
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    var strDesc = [];

    if (alarm != null && alarm.armIinfo != null) {
        if (alarm.armIinfo == 0) {
            strDesc.push(rootElement.lang.net_alarm_type_sb_driver_identification_through);
        }
        if (alarm.param1 != null) {
            strDesc.push(rootElement.lang.similarity + (alarm.param1 / 100).toFixed(2) + "%;" + rootElement.lang.matchThreshold + ":" + alarm.param2 / 100 + "%");
        }
    }

    // param[0]:AlarmInfo=-2表示比对错误码,其他表示对比度(万分值) param[1](低16位):预设失败匹配度 param[1](高16位):预设成功匹配度
    /* if(alarm.param2  != null){
        var l = (alarm.param2 & 0xffff); //低16位
        var  h  = (alarm.param2 & 0xffffffff) >> 16 ; //高16为
        if(l > 0){
            strDesc.push( rootElement.lang.net_alarm_type_sb_driver_identification_fail+l+"%;");
        }
        if(h > 0){
            strDesc.push( rootElement.lang.net_alarm_type_sb_driver_identification_success+h+"%;");
        }
    }*/

    var ret = {};
    ret.strType = rootElement.lang.alarm_controlPerson;
    ret.strDesc = strDesc.join(';').toString();
    return ret;
}


/**
 * 布控车牌识别报警
 * @param armType
 */
standardAlarm.prototype.getControlVehiAlarm = function (armType) {
    var ret = {};
    ret.strType = rootElement.lang.alarm_name_144_default;
    return ret;
}


/**
 *    解析出租车相关报警
 */
standardAlarm.prototype.getTaxiAlarm = function (armType) {
    var strMark = '';
    var typeStr = '';//报警类型
    var strDesc = '';//报警信息
    switch (armType) {
        case 800://计程计价装置故障
        case 850:
            typeStr = rootElement.lang.taxi_alarm_valuation;
            if (armType == 800) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            break;
        case 801://服务评价器故障（前后排）
        case 851:
            typeStr = rootElement.lang.taxi_alarm_evaluator;
            if (armType == 801) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            break;
        case 802://LED 广告屏故障
        case 852:
            typeStr = rootElement.lang.taxi_alarm_led;
            if (armType == 802) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            break;
        case 803://液晶（LCD）显示屏故障
        case 853:
            typeStr = rootElement.lang.taxi_alarm_lcd;
            if (armType == 803) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            break;
        case 804://安全访问模块故障
        case 854:
            typeStr = rootElement.lang.taxi_alarm_secure;
            if (armType == 804) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            break;
        case 805://巡游车顶灯故障
        case 855:
            typeStr = rootElement.lang.taxi_alarm_roof_light;
            if (armType == 805) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            break;
        case 806://连续驾驶超时
        case 856:
            typeStr = rootElement.lang.taxi_alarm_driving_timeout;
            if (armType == 806) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            break;
        case 807://分神驾驶报警 2级
        case 857:     //分神驾驶报警 2级
            if (armType == 807) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.taxi_alarm_forbidden_road;
            break;
        case 808://LCD终端故障
        case 858:
            typeStr = rootElement.lang.taxi_alarm_lcd_error;
            if (armType == 808) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            break;
        case 809://录音设备故障
        case 859:
            typeStr = rootElement.lang.taxi_alarm_recording;
            if (armType == 809) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            break;
        case 810://计程计价装置实时时钟超过规定的误差范围
        case 860:
            typeStr = rootElement.lang.taxi_alarm_clock_error;
            if (armType == 810) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            break;
        case 811://紧急报警按钮故障
        case 861:
            if (armType == 811) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.taxi_alarm_emergency;
            break;
        case 812://巡游车不打表营运 / 网约车巡游带客
        case 862:
            if (armType == 812) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.taxi_alarm_violation;
            break;
        case 813://驾驶员人脸识别不匹配报警
        case 863:		//驾驶员人脸识别不匹配报警
            if (armType == 813) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.taxi_alarm_unrecognize;
            break;
        default:
            break;
    }

    var ret = {};
    ret.strType = typeStr;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}
/**
 *    解析苏标相关报警
 */
standardAlarm.prototype.getSuBiaoAlarm = function (armType) {
    var strMark = '';
    var typeStr = '';//报警类型
    var strDesc = '';//报警信息
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    switch (armType) {
        case 843://事件
        case 844://事件
        case 847://事件
        case 842://事件
        case 643://驾驶员身份识别事件
            typeStr = rootElement.lang["alarm_name_" + armType];
            break;
        case 845:      //低速前车碰撞预警1级
        case 895:
            typeStr = rootElement.lang.alarm_name_845 + rootElement.lang.alarm_name_11111;
            if (armType == 845) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            break;
        case 846:      //低速前车碰撞预警1级
        case 896:
            typeStr = rootElement.lang.alarm_name_845 + rootElement.lang.alarm_name_22222;
            if (armType == 846) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            break;
        case 840:      //低速前车碰撞预警1级
        case 890:
            typeStr = rootElement.lang.alarm_name_840 + rootElement.lang.alarm_name_11111;
            if (armType == 840) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            break;
        case 841:      //低速前车碰撞预警2级
        case 891:
            typeStr = rootElement.lang.alarm_name_840 + rootElement.lang.alarm_name_22222;
            if (armType == 841) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            break;
        case 642://驾驶员IC卡异常报警2级
        case 692:
            typeStr = rootElement.lang.alarm_name_641 + rootElement.lang.alarm_name_22222;
            if (armType == 642) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            break;
        case 641://驾驶员IC卡异常报警1级
        case 691:
            typeStr = rootElement.lang.alarm_name_641 + rootElement.lang.alarm_name_11111;
            if (armType == 641) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            break;
        case 635://右侧后方接近报警
        case 685:
            typeStr = rootElement.lang.alarm_name_635;
            if (armType == 635) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            break;
        case 634://左侧后方接近报警
        case 684:
            typeStr = rootElement.lang.alarm_name_634;
            if (armType == 634) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            break;
        case 633://后方接近报警
        case 683:
            typeStr = rootElement.lang.alarm_name_633;
            if (armType == 633) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            break;
        case 632://胎压报警
        case 682:		//胎压报警(苏标)
            typeStr = this.getTireAlarmTypeSB(632);
            if (armType == 632) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            strDesc = this.getTireAlarmTypeSB();
            break;
        case 631://驾驶员变更事件 2级
        case 681://驾驶员变更事件 2级
            typeStr = rootElement.lang.alarm_name_630 + rootElement.lang.alarm_name_22222;
            break;
        case 630://驾驶员变更事件 1级
        case 680://驾驶员变更事件 1级
            typeStr = rootElement.lang.alarm_name_630 + rootElement.lang.alarm_name_11111;
            break;
        case 629://自动抓拍事件 2级
        case 679://自动抓拍事件 2级
            typeStr = rootElement.lang.alarm_name_628 + rootElement.lang.alarm_name_22222;
            break;
        case 628://自动抓拍事件 1级
        case 678://自动抓拍事件 1级
            typeStr = rootElement.lang.alarm_name_628 + rootElement.lang.alarm_name_11111;
            break;

        case 1206://驾驶员异常报警 2级
        case 1256:    //驾驶员异常报警 2级
            typeStr = rootElement.lang.alarm_name_626 + rootElement.lang.alarm_name_33333;
            if (armType == 1206) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            break;
        case 627://驾驶员异常报警 2级
        case 677:    //驾驶员异常报警 2级
            typeStr = rootElement.lang.alarm_name_626 + rootElement.lang.alarm_name_22222;
            if (armType == 627) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            break;
        case 626://驾驶员异常报警 1级
        case 676:     //驾驶员异常报警 1级
            typeStr = rootElement.lang.alarm_name_626 + rootElement.lang.alarm_name_11111;
            if (armType == 626) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            break;
        case 1201://分神驾驶报警 3级
        case 1251:     //分神驾驶报警 3级
            if (armType == 1201) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_624 + rootElement.lang.alarm_name_33333;
            break;
        case 625:   //分神驾驶报警 2级
        case 675:   //分神驾驶报警 2级
            if (armType == 625) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_624 + rootElement.lang.alarm_name_22222;
            break;
        case 624://分神驾驶报警 1级
        case 674:     //分神驾驶报警 1级
            typeStr = rootElement.lang.alarm_name_624 + rootElement.lang.alarm_name_11111;
            if (armType == 624) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            break;
        case 1202://抽烟报警 3级
        case 1252:   //抽烟报警 3级
            typeStr = rootElement.lang.alarm_name_622 + rootElement.lang.alarm_name_33333;
            if (armType == 1202) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            break;
        case 623://抽烟报警 2级
        case 673:     //抽烟报警 2级
            typeStr = rootElement.lang.alarm_name_622 + rootElement.lang.alarm_name_22222;
            if (armType == 623) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            // 黑龙江主动安全 只有是否提醒驾驶员
            if (this.isHeiLongJiang(alarm.desc)) {
                strDesc = this.getDriverRemindHBAlarm();
            }
            break;
        case 622://抽烟报警 1级
        case 672:   //抽烟报警 1级
            typeStr = rootElement.lang.alarm_name_622 + rootElement.lang.alarm_name_11111;
            if (armType == 622) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            break;
        case 1203://接打电话报警 3级
        case 1253:		//接打电话报警 3级
            if (armType == 1203) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_620 + rootElement.lang.alarm_name_33333;
            break;
        case 621://接打电话报警 2级
        case 671:		//接打电话报警 2级
            if (armType == 621) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            if (this.isHeiLongJiang(alarm.desc)) {
                strDesc = this.getDriverRemindHBAlarm();
            }
            typeStr = rootElement.lang.alarm_name_620 + rootElement.lang.alarm_name_22222;
            break;
        case 620://接打电话报警  1级
        case 670:     //接打电话报警 1级
            if (armType == 620) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_620 + rootElement.lang.alarm_name_11111
            break;
        case 1200://疲劳驾驶报警 3级 (京标，没有报警描述)
        case 1250:		//疲劳驾驶报警 3级
            if (armType == 1200) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_618 + rootElement.lang.alarm_name_33333;
            break;
        case 619://疲劳驾驶报警 2级
        case 669:		//疲劳驾驶报警 2级
            if (armType == 619) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_618 + rootElement.lang.alarm_name_22222;
            strDesc = this.getDriverFatigueSBAlarm();
            break;
        case 618://疲劳驾驶报警  1级
        case 668:		//疲劳驾驶报警 1级
            if (armType == 618) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_618 + rootElement.lang.alarm_name_11111;
            strDesc = this.getDriverFatigueSBAlarm();
            break;
        case 617://主动抓拍事件 2级
        case 667://主动抓拍事件 2级
            typeStr = rootElement.lang.alarm_name_616 + rootElement.lang.alarm_name_22222;
            strDesc = this.getVehicleAutoSBAlarm();
            break;
        case 616://主动抓拍事件 1级
        case 666://主动抓拍事件 1级
            typeStr = rootElement.lang.alarm_name_616 + rootElement.lang.alarm_name_11111;
            strDesc = this.getVehicleAutoSBAlarm();
            break;
        case 615://道路标志识别事件 2级
        case 665://道路标志识别事件 2级
            typeStr = rootElement.lang.alarm_name_614 + rootElement.lang.alarm_name_22222;
            strDesc = this.getVehicleSignsSBAlarm();
            break;
        case 614://道路标志识别事件 1级
            typeStr = rootElement.lang.alarm_name_614 + rootElement.lang.alarm_name_11111;
            strDesc = this.getVehicleSignsSBAlarm();
            break;
        case 613://障碍物报警 2级
        case 663:     //障碍物报警 2级
            if (armType == 613) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_612 + rootElement.lang.alarm_name_22222;
            strDesc = this.getVehicleAutoSBAlarm();
            break;
        case 612://障碍物报警 1级
        case 662:     //障碍物报警 1级
            if (armType == 612) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_612 + rootElement.lang.alarm_name_11111;
            strDesc = this.getVehicleAutoSBAlarm();
            break;
        case 611://道路标识超限报警  2级
        case 661:     //道路标识超限报警 2级
            if (armType == 611) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_610 + rootElement.lang.alarm_name_22222;
            strDesc = this.getVehicleSignsSBAlarm();
            break;
        case 610://道路标识超限报警  1级
        case 660:     //道路标识超限报警 1级
            if (armType == 610) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_610 + rootElement.lang.alarm_name_11111;
            strDesc = this.getVehicleSignsSBAlarm();
            break;
        case 609://频繁变道  2级
        case 659:     //频繁变道 2级
            if (armType == 609) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_608 + rootElement.lang.alarm_name_22222;
            strDesc = this.getVehicleAutoSBAlarm();
            break;
        case 608://频繁变道  1级
        case 658:     //频繁变道 1级
            if (armType == 608) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_608 + rootElement.lang.alarm_name_11111;
            strDesc = this.getVehicleAutoSBAlarm();
            break;
        case 1210://行人碰撞报警  3级
        case 1260:		//行人碰撞报警 3级
            if (armType == 1210) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_606 + rootElement.lang.alarm_name_33333;
            break;
        case 607://行人碰撞报警  2级
        case 657:		//行人碰撞报警2级
            if (armType == 607) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_606 + rootElement.lang.alarm_name_22222;
            strDesc = this.getImpactingPedestriansSBAlarm();
            break;
        case 606://行人碰撞报警  1级
        case 656:		//行人碰撞报警1级
            if (armType == 606) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_606 + rootElement.lang.alarm_name_11111;
            strDesc = this.getImpactingPedestriansSBAlarm();
            break;
        case 1208://车距过近报警 3级
        case 1258:		//车距过近报警3级
            if (armType == 1208) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_604 + rootElement.lang.alarm_name_33333;
            strDesc = this.getVehicleAutoSBAlarm();
            break;
        case 605://车距过近报警 2级
        case 655:		//车距过近报警2级
            if (armType == 605) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_604 + rootElement.lang.alarm_name_22222;
            strDesc = this.getVehicleAutoSBAlarm();
            break;
        case 604://车距过近报警 1级
        case 654:		//车距过近报警1级
            if (armType == 604) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_604 + rootElement.lang.alarm_name_11111;
            strDesc = this.getVehicleAutoSBAlarm();
            break;
        case 1209://车道偏离报警 2级
        case 1259:		//车道偏离报警2级
            if (armType == 1209) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_602 + rootElement.lang.alarm_name_33333;
            break;
        case 603://车道偏离报警 2级
        case 653:		//车道偏离报警2级
            if (armType == 603) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_602 + rootElement.lang.alarm_name_22222;
            strDesc = this.getRoadDeviationSBAlarm(armType);
            break;
        case 602://车道偏离报警1级
        case 652:		//车道偏离报警1级
            if (armType == 602) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_602 + rootElement.lang.alarm_name_11111;
            strDesc = this.getRoadDeviationSBAlarm(armType);
            break;
        case 1207://前向碰撞报警2级
        case 1257:		//前向碰撞报警2级
            if (armType == 1207) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_600 + rootElement.lang.alarm_name_33333;
            break;
        case 601://前向碰撞报警2级
        case 651:		//前向碰撞报警2级
            if (armType == 601) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_600 + rootElement.lang.alarm_name_22222;
            strDesc = this.getVehicleCollisionSBAlarm();
            break;
        case 600://前向碰撞报警1级
        case 650:	//前向碰撞报警1级
            if (armType == 600) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_600 + rootElement.lang.alarm_name_11111;
            strDesc = this.getVehicleCollisionSBAlarm();
            break;
        case 639:		//墨镜失效一级报警
        case 689:
            if (armType == 639) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_639 + rootElement.lang.alarm_name_11111;
//			strDesc = this.getVehicleCollisionSBAlarm();
            break;
        case 640:		//墨镜失效二级报警
        case 690:
            if (armType == 640) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            // 黑龙江主动安全 只有是否提醒驾驶员
            if (this.isHeiLongJiang(alarm.desc)) {
                strDesc = this.getDriverRemindHBAlarm();
            }
            typeStr = rootElement.lang.alarm_name_639 + rootElement.lang.alarm_name_22222;
//			strDesc = this.getVehicleCollisionSBAlarm();
            break;
        case 745:		//单手脱离方向盘
        case 795:
            if (armType == 745) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_745 + rootElement.lang.alarm_name_11111;
            break;
        case 746:		//单手脱离方向盘
        case 796:
            if (armType == 746) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_745 + rootElement.lang.alarm_name_22222;
            break;
        case 637:		//驾驶员识别
        case 687:
            if (armType == 637) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_967 + rootElement.lang.alarm_name_22222;
            break;
        case 700:		//弯道车速预警1级
        case 750:
            if (armType == 700) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_700 + rootElement.lang.alarm_name_11111;
            break;
        case 701:		//弯道车速预警2级
        case 751:
            if (armType == 701) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_700 + rootElement.lang.alarm_name_22222;
            break;
        case 702:		//长时间不目视前方报警1级
        case 752:
            if (armType == 702) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_702 + rootElement.lang.alarm_name_11111;
            break;
        case 703:		//长时间不目视前方报警2级
        case 753:
            if (armType == 703) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            // 黑龙江主动安全 只有是否提醒驾驶员
            if (this.isHeiLongJiang(alarm.desc)) {
                strDesc = this.getDriverRemindHBAlarm();
            }
            typeStr = rootElement.lang.alarm_name_702 + rootElement.lang.alarm_name_22222;
            break;
        case 704:		//系统不能正常工作报警1级
        case 754:
            if (armType == 704) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_704 + rootElement.lang.alarm_name_11111;
            break;
        case 705:		//系统不能正常工作报警2级
        case 755:
            if (armType == 705) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_704 + rootElement.lang.alarm_name_22222;
            break;
        case 706:		//驾驶员未系安全带报警1级
        case 756:
            if (armType == 706) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_706 + rootElement.lang.alarm_name_11111;
            break;
        case 707:		//驾驶员未系安全带报警2级
        case 757:
            if (armType == 707) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_706 + rootElement.lang.alarm_name_22222;
            break;
        case 1205:		//驾驶员未系安全带报警3级
        case 1255:
            if (armType == 1205) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_706 + rootElement.lang.alarm_name_33333;
            break;
        case 708:		//驾驶员不在驾驶位报警1级
        case 758:
            if (armType == 708) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_708 + rootElement.lang.alarm_name_11111;
            break;
        case 709:		//驾驶员不在驾驶位报警2级
        case 759:
            if (armType == 709) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            // 黑龙江主动安全 只有是否提醒驾驶员
            if (this.isHeiLongJiang(alarm.desc)) {
                strDesc = this.getDriverRemindHBAlarm();
            }
            typeStr = rootElement.lang.alarm_name_708 + rootElement.lang.alarm_name_22222;
            break;
        case 710:		//驾驶员双手脱离方向盘报警1级
        case 760:
            if (armType == 710) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_710 + rootElement.lang.alarm_name_11111;
            break;
        case 711:		//驾驶员双手脱离方向盘报警2级
        case 761:
            if (armType == 711) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_710 + rootElement.lang.alarm_name_22222;
            break;
        case 1204:		//驾驶员双手脱离方向盘报警3级
        case 1254:
            if (armType == 1204) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_710 + rootElement.lang.alarm_name_33333;
            break;

        case 644:		//喝水报警1级
        case 694:
            if (armType == 644) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_644 + rootElement.lang.alarm_name_11111;
            break;
        case 645:		//喝水报警2级
        case 695:
            if (armType == 645) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_644 + rootElement.lang.alarm_name_22222;
            break;
        case 715:		//驾驶辅助功能失效报警1级
        case 765:
            if (armType == 715) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_715 + rootElement.lang.alarm_name_11111;
            break;
        case 716:		//驾驶辅助功能失效报警2级
        case 766:
            if (armType == 716) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_715 + rootElement.lang.alarm_name_22222;
            break;
        case 717:		//驾驶员行为监测功能失效报警1级
        case 767:
            if (armType == 717) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_717 + rootElement.lang.alarm_name_11111;
            break;
        case 718:		//驾驶员行为监测功能失效报警2级
        case 768:
            if (armType == 718) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_717 + rootElement.lang.alarm_name_22222;
            break;
        case 719:		//驾驶员身份异常
            if (armType == 719) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_719;
            break;
        case 720:		//急加速报警
        case 770:
            if (armType == 720) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_720;
            strDesc = this.getFierceDrivingAlarm(1);
            break;
        case 721:		//急减速报警
        case 771:
            if (armType == 721) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_721;
            strDesc = this.getFierceDrivingAlarm(2);
            break;
        case 722:		//急转弯报警
        case 772:
            if (armType == 722) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_722;
            strDesc = this.getFierceDrivingAlarm(4);
            break;
        case 723:		//怠速报警
        case 773:
            if (armType == 723) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_723;
            strDesc = this.getFierceDrivingAlarm(0);
            break;
        case 724:		//异常熄火报警
        case 774:
            if (armType == 724) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_724;
            strDesc = this.getFierceDrivingAlarm(0);
            break;
        case 725:		//空挡滑行报警
        case 775:
            if (armType == 725) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_725;
            strDesc = this.getFierceDrivingAlarm(0);
            break;
        case 726:		//发动机超转报警
        case 776:
            if (armType == 726) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_726;
            strDesc = this.getFierceDrivingAlarm(0);
            break;
        case 727:		//超速报警
        case 777:
        case 744:		//超过道路限速报警
        case 794:
        case 1406:		//超过阈值速度持续报警
        case 1456:
        case 1407:		//超过道路限速持续报警
        case 1457:
        case 1412:
        case 1413:
            if (armType == 727 || armType == 744 || armType == 1406 || armType == 1407 || armType == 1412 || armType == 1413) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_727;
            if (armType == 1406 || armType == 1456) {
                typeStr = rootElement.lang.alarm_name_1406;
            }
            var isRoad = false;
            if (armType == 744 || armType == 794) {
                isRoad = true;
                typeStr = rootElement.lang.alarm_name_744;
            }
            if (armType == 1407 || armType == 1457) {
                isRoad = true;
                typeStr = rootElement.lang.alarm_name_1407;
            }
            if (armType == 1412) {
                typeStr = rootElement.lang.alarm_name_1412;
            }
            if (armType == 1413) {
                typeStr = rootElement.lang.alarm_name_1413;
            }
            strDesc = this.getOverSpeedShuBiao(isRoad);
            break;
        case 728:		//路口快速通过报警1级
        case 778:
            if (armType == 728) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_728 + rootElement.lang.alarm_name_11111;
            break;
        case 729:		//路口快速通过报警2级
        case 779:
            if (armType == 729) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_728 + rootElement.lang.alarm_name_22222;
            break;
        case 730:		//实线变道报警1级
        case 780:
            if (armType == 730) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_730 + rootElement.lang.alarm_name_11111;
            // 粤标
            if (this.isGuangDong(alarm.desc)) {
                strDesc = this.getVehicleAutoSBAlarm();
            }
            break;
        case 731:		//实线变道报警2级
        case 781:
            if (armType == 731) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_730 + rootElement.lang.alarm_name_22222;
            // 粤标
            if (this.isGuangDong(alarm.desc)) {
                strDesc = this.getVehicleAutoSBAlarm();
            }
            break;
        case 732:		// 设备失效提醒报警1级
        case 782:
            if (armType == 732) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_732 + rootElement.lang.alarm_name_11111;
            // 湘标道理标识
            if (this.isHuNan(alarm.desc)) {
                strDesc = this.getVehicleAutoSBAlarm();
            }
            break;
        case 733:		// 设备失效提醒报警2级
        case 783:
            if (armType == 733) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_732 + rootElement.lang.alarm_name_22222;
            // 湘标道理标识
            if (this.isHuNan(alarm.desc)) {
                strDesc = this.getVehicleAutoSBAlarm();
            }
            break;
        case 734:		//探头遮挡报警1级
        case 784:
            if (armType == 734) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_734 + rootElement.lang.alarm_name_11111;
            break;
        case 735:		//探头遮挡报警2级
        case 785:
            if (armType == 735) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            // 黑龙江主动安全 只有是否提醒驾驶员
            if (this.isHeiLongJiang(alarm.desc)) {
                var strDescArray = [];
                strDescArray.push(this.getDriverRemindHBAlarm());
                // param[1]表遮挡类型
                // 0x01：驾驶员驾驶行为监测摄像头遮挡；
                // 0x02：车辆运行监测摄像头遮挡
                if (alarm.param2 != null) {
                    var tpStr = rootElement.lang.mask_type_0x01;
                    if (alarm.param2 == 2) {//1左侧偏离 2右侧偏离
                        tpStr = rootElement.lang.mask_type_0x02;
                    }
                    strDescArray.push(tpStr);
                }
                strDesc = strDescArray.join(";");
            }
            typeStr = rootElement.lang.alarm_name_734 + rootElement.lang.alarm_name_22222;
            break;
        case 736:		//换人驾驶报警1级
        case 786:
            if (armType == 736) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_736 + rootElement.lang.alarm_name_11111;
            break;
        case 737:		//换人驾驶报警2级
        case 787:
            if (armType == 737) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_736 + rootElement.lang.alarm_name_22222;
            break;
        case 738:		//超时驾驶报警1级
        case 788:
            if (armType == 738) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_738 + rootElement.lang.alarm_name_11111;
            break;
        case 739:		//超时驾驶报警2级
        case 789:
            if (armType == 739) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_738 + rootElement.lang.alarm_name_22222;
            break;
        case 1408:		//超时驾驶持续报警1级
        case 1458:
            if (armType == 1408) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_1408 + rootElement.lang.alarm_name_11111;
            break;
        case 1409:		//超时驾驶持续报警1级
        case 1459:
            if (armType == 1409) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_1408 + rootElement.lang.alarm_name_22222;
            break;
        case 740:		//车厢超载报警1级
        case 790:
            if (armType == 740) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_740 + rootElement.lang.alarm_name_11111;
            break;
        case 741:		//站外上客报警
        case 791:
            if (armType == 741) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_740 + rootElement.lang.alarm_name_22222;
            break;

        case 742:		//站外上客报警1级
        case 792:
            if (armType == 742) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_742 + rootElement.lang.alarm_name_11111;
            break;
        case 743:		//站外上客报警
        case 793:
            if (armType == 743) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            typeStr = rootElement.lang.alarm_name_742 + rootElement.lang.alarm_name_22222;
            break;

        // 黑车
        case 530:
        case 580:
            strMark = (armType === 530) ? this.getAlarmStartEnd(1) : this.getAlarmStartEnd(0);
            typeStr = rootElement.lang.alarm_name_530 + rootElement.lang.alarm_name_11111;
            break;
        case 531:
        case 581:
            strMark = (armType === 531) ? this.getAlarmStartEnd(1) : this.getAlarmStartEnd(0);
            typeStr = rootElement.lang.alarm_name_530 + rootElement.lang.alarm_name_22222;
            break;
        case 532:
        case 582:
            strMark = (armType === 532) ? this.getAlarmStartEnd(1) : this.getAlarmStartEnd(0);
            typeStr = rootElement.lang.alarm_name_532 + rootElement.lang.alarm_name_11111;
            break;
        case 533:
        case 583:
            strMark = (armType === 533) ? this.getAlarmStartEnd(1) : this.getAlarmStartEnd(0);
            typeStr = rootElement.lang.alarm_name_532 + rootElement.lang.alarm_name_22222;
            break;
        case 534:
        case 584:
            strMark = (armType === 534) ? this.getAlarmStartEnd(1) : this.getAlarmStartEnd(0);
            typeStr = rootElement.lang.alarm_name_534 + rootElement.lang.alarm_name_11111;
            break;
        case 535:
        case 585:
            strMark = (armType === 535) ? this.getAlarmStartEnd(1) : this.getAlarmStartEnd(0);
            typeStr = rootElement.lang.alarm_name_534 + rootElement.lang.alarm_name_22222;
            break;
        case 536:
        case 586:
            strMark = (armType === 536) ? this.getAlarmStartEnd(1) : this.getAlarmStartEnd(0);
            typeStr = rootElement.lang.alarm_name_536 + rootElement.lang.alarm_name_11111;
            break;
        case 537:
        case 587:
            strMark = (armType === 537) ? this.getAlarmStartEnd(1) : this.getAlarmStartEnd(0);
            typeStr = rootElement.lang.alarm_name_536 + rootElement.lang.alarm_name_22222;
            break;

        default:
            break;
    }

    var ret = {};
    ret.strType = typeStr;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}

/**
 * 卫星定位 超速解析
 */
standardAlarm.prototype.getOverSpeedShuBiao = function (isRoad) {
//	param1  超速报警类型  BYTE
//	为 1 表示该类型报警
//	Bit0：超过阈值速度报警
//	Bit1：超过道路限速报警
//	Bit2~Bit7：预留
//	param2  超速报警阈值  BYTE  单位 ，终端设定超速报警阈值
//	param3  道路限速阈值  BYTE  单位 ，车辆当前速度超出报警阈值的插值
    var strDesc = "";
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
//	当前速度:XXX
//	bit0有效,再加上
//	超过阈值速度报警,超速报警阈值:XXX
//	bit1有效,再加上
//	超过道路限速报警,道路限速阈值:XXX

    //当前速度
    var status = this.getAlarmStatus();
    if (status && status.speed) {
        strDesc += rootElement.lang.alarm_current_speed + ":" + this.getSpeedString(status.speed) + ",";
    }
    if (alarm.param1 != null) {
        if (isRoad) {
            if (alarm.param2 && this.getRoadLevel(alarm.param2)) {
                strDesc += this.getRoadLevel(alarm.param2) + ",";
            }
//			车辆当前速度超出报警阈值的插值
            strDesc += rootElement.lang.road_speed_limit_threshold + ":" + this.getSpeedString(alarm.param1 * 10)  + ";";
        } else {
            strDesc += rootElement.lang.overspeed_alarm_threshold + ":" + this.getSpeedString(alarm.param1 * 10)  + ";";
        }
    }
    return strDesc;
}


/**
 *激烈驾驶解析
 */
standardAlarm.prototype.getFierceDrivingAlarm = function (type) {
//	0x01：急加速报警  111
//	0x02：急减速报警
//	0x03：急转弯报警
//	0x04：怠速报警
//	0x05：异常熄火报警
//	0x06：空挡滑行报警
//	0x07：发动机超转报警
//	param1(p[0])  报警时间阈值  WORD  单位秒
//	param2(p[1])  报警阈值 1  WORD
//		当报警类型为 0x01~0x03 时，该位为报警重力加速度阈值，单位为 1/100g；
//		当报警类型为 0x04~0x07 时，该位为报警车速阈值，单位为 。
//	param3(p[2])  报警阈值 2  WORD
//		当报警类型为 0x01~0x03 时，该位预留；
//		当报警类型为 0x04~0x07 时，该位为报警发动机转速阈值，单位为 RPM。
    var strDesc = "";
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    if (alarm.param1 != null) {
        strDesc += rootElement.lang.alarm_time_threshold_tips + alarm.param1 + rootElement.lang.alarm_time_threshold_unit + ";";
    }
    if (alarm.param2 != null) {
        if ((type & 7) > 0) {//0x01~0x03
            strDesc += rootElement.lang.alarm_gravity_acceleration_threshold_tips + (alarm.param2 / 100) + "g";
        } else {//0x04~0x07
            strDesc += rootElement.lang.alarm_speed_threshold_tips +  this.getSpeedString(alarm.param2 * 10)  + ";";
        }
    }
    if (alarm.param3 != null) {
        if ((type & 7) > 0) {//0x01~0x03
        } else {//0x04~0x07
            strDesc += rootElement.lang.alarm_engine_speed_threshold_tips + alarm.param3 + 'RPM';
        }
    }
    return strDesc;
}

/**
 * 解析G-SenSor报警
 * @param armType
 */
standardAlarm.prototype.getGSenSorAlarm = function (armType) {
    var strMark = '';
    var typeStr = '';//报警类型
    var strDesc = '';//报警信息
    switch (armType) {
        case 444://急转弯
        case 494:
            typeStr = rootElement.lang.alarm_type_sharpTurn;
            if (armType == 444) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            break;
        case 439://GSensor启动
        case 489:
            typeStr = rootElement.lang.alarm_GSensorStart;
            if (armType == 439) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            break;
        case 440://GSensor停止
        case 490:
            typeStr = rootElement.lang.alarm_GSensorStop;
            if (armType == 440) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            break;
        case 441://GSensor侧翻
        case 491:
            typeStr = rootElement.lang.alarm_GSensorRollOver;
            if (armType == 441) {//开始报警
                strMark = this.getAlarmStartEnd(1);
            } else {
                strMark = this.getAlarmStartEnd(0);
            }
            break;
        default:
            break;
    }
    var ret = {};
    ret.strType = typeStr;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}


/**
 * 司机刷卡
 * @param armType
 */
standardAlarm.prototype.getDriverSwape = function (armType) {
    var strMark = '';
    var typeStr = rootElement.lang.driver_swipe;//报警类型 //司机刷卡
    var strDesc = '';//报警信息
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    //司机刷卡		szDesc: 司机名称;发证机关;身份证号;从业资格证编码
//    param4为司机id
    var szDesc = alarm.desc;
    if (szDesc != null) {
        if (szDesc) {
            var infos_ = szDesc.split(';')
            if (infos_ && infos_.length > 0) {
                for (var i = 0; i < infos_.length; i++) {
                    var value_ = infos_[i];
                    if (i == 0) {
                        strDesc += rootElement.lang.driver_name + ":" + value_ + ";";
                    } else if (i == 1) {
                        strDesc += rootElement.lang.driver_swipe_issue + ":" + value_ + ";";
                    } else if (i == 2) {
                        strDesc += rootElement.lang.ID_number + ":" + value_ + ";";
                    } else if (i == 3) {
                        strDesc += rootElement.lang.driver_swipe_number + ":" + value_ + ";";
                    }
                }
            }
        }
    }
    var ret = {};
    ret.strType = typeStr;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}


/**
 * 学生刷卡
 * @param armType
 */
standardAlarm.prototype.getStudentSwape = function (armType) {
    var strMark = '';
    var typeStr = rootElement.lang.student_swipe;//报警类型 //司机刷卡
    var strDesc = '';//报警信息
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    //司机刷卡		szDesc: 学生姓名;班级;学号
//    param4为司机id
    var szDesc = alarm.desc;
    if (szDesc != null) {
        if (szDesc) {
            var infos_ = szDesc.split(';')
            if (infos_ && infos_.length > 0) {
                for (var i = 0; i < infos_.length; i++) {
                    var value_ = infos_[i];
                    if (i == 0) {
                        strDesc += rootElement.lang.student_swipe_name + ":" + value_ + ";";
                    } else if (i == 1) {
                        strDesc += rootElement.lang.grade_belong + ":" + value_ + ";";
                    } else if (i == 2) {
                        strDesc += rootElement.lang.student_num + ":" + value_ + ";";
                    }
                }
            }
        }
    }
    var ret = {};
    ret.strType = typeStr;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}

// 附件上传[SBAC=] 苏标相关的才有
var regexHeiLongJiang = /^(HBAC=).*/ig;
standardAlarm.prototype.isHeiLongJiang = function (armDesc) {
    if (armDesc && regexHeiLongJiang.test(armDesc)) {
        regexHeiLongJiang.lastIndex = 0;
        return true;
    }
    return false;
}

// 附件上传[JBAC=] 北京相关的才有
var regexBeiJing = /^(JBAC=).*/ig;
standardAlarm.prototype.isBeiJing = function (armDesc) {
    if (armDesc && regexBeiJing.test(armDesc)) {
        regexBeiJing.lastIndex = 0;
        return true;
    }
    return false;
}

// 附件上传[YBAC=] 粤标相关的才有
var regexGuangDong = /^(YBAC=).*/ig;
standardAlarm.prototype.isGuangDong = function (armDesc) {
    if (armDesc && regexGuangDong.test(armDesc)) {
        regexGuangDong.lastIndex = 0;
        return true;
    }
    return false;
}

// 附件上传[SBAC=] 湘标相关的才有，按苏标
var regexHuNan = /^(SBAC=).*/ig;
standardAlarm.prototype.isHuNan = function (armDesc) {
    if (armDesc && regexHuNan.test(armDesc)) {
        regexHuNan.lastIndex = 0;
        return true;
    }
    return false;
}

// 获取提醒司机状态
standardAlarm.prototype.getDriverRemindHBAlarm = function () {
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    // 黑龙江主动安全 只有是否提醒驾驶员
    if (alarm.param1 && alarm.param1 == 1) {
        return rootElement.lang.remind_the_driver;
    }
    return rootElement.lang.unremind_the_driver;
}
/**
 *前向碰撞报警(苏标)
 */
standardAlarm.prototype.getVehicleCollisionSBAlarm = function (armType) {
    //Param[0]:道路标志识别数据,Param[1]:前车车速,Param[2]:前车/行人距离
    var strDesc = "";
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }

    if (this.isBeiJing(alarm.desc)) {
        return strDesc;
    }

    // 黑龙江主动安全 只有是否提醒驾驶员
    if (this.isHeiLongJiang(alarm.desc)) {
        return this.getDriverRemindHBAlarm();
    }
    if (alarm.param1 != null) {
        strDesc += rootElement.lang.reportInfo_roadSigns + alarm.param1 + ";"
    }
    if (alarm.param2 != null) {
        strDesc += rootElement.lang.reportInfo_vehicleSpeed +    this.getSpeedString(alarm.param2 * 10) + ";";
    }
    if (alarm.param3 != null) {
        strDesc += rootElement.lang.reportInfo_people + alarm.param3 * 100 + 'ms';
    }
    return strDesc;
}


/**
 *车道偏离报警(苏标)
 */
standardAlarm.prototype.getRoadDeviationSBAlarm = function (armType) {
    //Param[0]:道路标志识别数据,Param[1](低16位):前车车速,
    //Param[1](高16位):前车/行人距离,Param[2]:偏离类型
    var strDesc = [];
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    // 京标不解析报警描述
    if (this.isBeiJing(alarm.desc)) {
        return strDesc;
    }
    // 黑龙江主动安全 只有是否提醒驾驶员
    if (this.isHeiLongJiang(alarm.desc)) {
        strDesc.push(this.getDriverRemindHBAlarm());
        if (alarm.param3 != null) {
            var tpStr = rootElement.lang.deviation_left;
            if (alarm.param3 == 2) {//1左侧偏离 2右侧偏离 3左侧实线偏离 4左侧虚线偏离 5右侧实线偏离 6右侧虚线偏离
                tpStr = rootElement.lang.deviation_right;
            }
            // 20210526
            if (alarm.param3 == 3) {
                tpStr = rootElement.lang.left_solid_line_deviates;
            }
            if (alarm.param3 == 4) {
                tpStr = rootElement.lang.left_dotted_line_deviates;
            }
            if (alarm.param3 == 5) {
                tpStr = rootElement.lang.right_solid_line_deviates;
            }
            if (alarm.param3 == 6) {
                tpStr = rootElement.lang.right_dotted_line_deviates;
            }
            strDesc.push(rootElement.lang.reportInfo_deviate + tpStr);
        }
        return strDesc.join(";");
    }
    if (alarm.param1 != null) {
        strDesc.push(rootElement.lang.reportInfo_roadSigns + alarm.param1);
    }
    if (alarm.param2 != null) {
        var l = (alarm.param2 & 0xffff); //低16位
        var h = (alarm.param2 & 0xffffffff) >> 16; //高16为
        if (l > 0) {
            strDesc.push(rootElement.lang.reportInfo_vehicleSpeed + this.getSpeedString(l * 10));
        }
        if (h > 0) {
            strDesc.push(rootElement.lang.reportInfo_people + h * 100 + "ms");
        }
    }
    if (alarm.param3 != null) {
        var tpStr = rootElement.lang.deviation_left;
        if (alarm.param3 == 2) {//1左侧偏离 2右侧偏离 3左侧实线偏离 4左侧虚线偏离 5右侧实线偏离 6右侧虚线偏离
            tpStr = rootElement.lang.deviation_right;
        }
        // 20210526
        if (alarm.param3 == 3) {
            tpStr = rootElement.lang.left_solid_line_deviates;
        }
        if (alarm.param3 == 4) {
            tpStr = rootElement.lang.left_dotted_line_deviates;
        }
        if (alarm.param3 == 5) {
            tpStr = rootElement.lang.right_solid_line_deviates;
        }
        if (alarm.param3 == 6) {
            tpStr = rootElement.lang.right_dotted_line_deviates;
        }
        strDesc.push(rootElement.lang.reportInfo_deviate + tpStr);
    }
    return strDesc.join(";");
}

/**
 * 行人碰撞报警(苏标)
 */
standardAlarm.prototype.getImpactingPedestriansSBAlarm = function (armType) {
    var strDesc = "";
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    // 京标不解析报警描述
    if (this.isBeiJing(alarm.desc)) {
        return strDesc;
    }
    if (alarm.param1 != null) {
        strDesc += rootElement.lang.reportInfo_roadSigns + alarm.param1;
    }
    if (alarm.param2 != null) {
        strDesc += rootElement.lang.reportInfo_people + alarm.param2 * 100 + "ms";
    }
    return strDesc;
}

/**
 * 道路标志识别事件(苏标)
 */
standardAlarm.prototype.getVehicleSignsSBAlarm = function (armType) {
    var strDesc = [];
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    if (alarm.param1 != null) {
        strDesc.push(rootElement.lang.reportInfo_roadSigns + alarm.param1);
    }
    // 0x01:限速标志0x02:限高标志Ox03:限重标志0x04:禁行标志Ox05:禁停标志
    if (alarm.param2 != null) {
        var tpStr = rootElement.lang.signs_speed;
        if (alarm.param2 == 2) {//1左侧偏离 2右侧偏离
            tpStr = rootElement.lang.signs_height;
        } else if (alarm.param2 == 3) {
            tpStr = rootElement.lang.signs_weight;
        } else if (alarm.param2 == 4) {
            tpStr = rootElement.lang.signs_forbid;
        } else if (alarm.param2 == 5) {
            tpStr = rootElement.lang.signs_park;
        }
        strDesc.push(tpStr);
    }
    return strDesc.join(",");
}

/**
 * 主动抓拍(苏标)
 */
standardAlarm.prototype.getVehicleAutoSBAlarm = function () {
    var strDesc = "";
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    // 京标不解析报警描述
    if (this.isBeiJing(alarm.desc)) {
        return strDesc;
    }
    if (alarm.param1 != null) {
        strDesc += rootElement.lang.reportInfo_roadSigns + alarm.param1
    }
    return strDesc;
}

/**
 * 疲劳驾驶报警(苏标)
 */
standardAlarm.prototype.getDriverFatigueSBAlarm = function (armType) {
    var strDesc = "";
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    // 京标不解析报警描述
    if (this.isBeiJing(alarm.desc)) {
        return strDesc;
    }
    // 黑龙江主动安全 只有是否提醒驾驶员
    if (this.isHeiLongJiang(alarm.desc)) {
        return this.getDriverRemindHBAlarm();
    }

    if (alarm.param1 != null) {
        strDesc += rootElement.lang.fatigue_driving + ":" + alarm.param1
    }
    return strDesc;
}


/**
 * 胎压报警(苏标)
 */
standardAlarm.prototype.getTireAlarmTypeSB = function (armType) {
    var strDesc = "";
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }


    //胎压报警(苏标)
    //AlarmInfo:bit0：胎压（定时上报） bit1：胎压过高报警 bit2：胎压过低报警 bit3：胎温过高报警 bit4：传感器异常报警 bit5：胎压不平衡报警 bit6：慢漏气报警 bit7：电池电量低报警
    //bit8~bit15：自定义 Param[0]:胎压(单位 Kpa),
    //Param[1](低16位):胎温(单位 ℃),Param[1](高16位):电池电量(单位 %),
    //Param[2]:传感器编号（01表示TPMS左1，02表示TPMS左2，03表示TPMS左3，04表示TPMS左4，11表示TPMS右1，12表示TPMS右2，13表示TPMS右3，14表示TPMS右4）
    if (alarm.param3 != null && alarm.param3 != "") {
        strDesc += rootElement.lang.alarm_tire_position_number + alarm.param3 + ";";
    }
    var typeStr = rootElement.lang.alarm_name_632;
    if (alarm.armIinfo) {
        var armInfo = Number(alarm.armIinfo);
        var type = '';
        if ((armInfo & 1) > 0) {
            typeStr += ";" + rootElement.lang.tireReport_onTime;
            type += rootElement.lang.tireReport_onTime;
        }
        if ((armInfo >> 1 & 1) > 0) {
            if (type) {
                type += ",";
            }
            typeStr += ";" + rootElement.lang.tireReport_high;
            type += rootElement.lang.tireReport_high;
        }
        if ((armInfo >> 2 & 1) > 0) {
            if (type) {
                type += ",";
            }
            typeStr += ";" + rootElement.lang.tireReport_low;
            type += rootElement.lang.tireReport_low;
        }
        if ((armInfo >> 3 & 1) > 0) {
            if (type) {
                type += ",";
            }
            typeStr += ";" + rootElement.lang.tireReport_temperature;
            type += rootElement.lang.tireReport_temperature;
        }
        if ((armInfo >> 4 & 1) > 0) {
            if (type) {
                type += ",";
            }
            typeStr += ";" + rootElement.lang.tireReport_sensor;
            type += rootElement.lang.tireReport_sensor;
        }
        if ((armInfo >> 5 & 1) > 0) {
            if (type) {
                type += ",";
            }
            typeStr += ";" + rootElement.lang.tireReport_balance;
            type += rootElement.lang.tireReport_balance;
        }
        if ((armInfo >> 6 & 1) > 0) {
            if (type) {
                type += ",";
            }
            typeStr += ";" + rootElement.lang.tireReport_leak;
            type += rootElement.lang.tireReport_leak;
        }
        if ((armInfo >> 7 & 1) > 0) {
            if (type) {
                type += ",";
            }
            typeStr += ";" + rootElement.lang.tireReport_battery;
            type += rootElement.lang.tireReport_battery;
        }
        if (type) {
            strDesc += type + ";"
        }
    }
    if (armType && armType == 632) {
        return typeStr;
    }
    if (alarm.param1) {
        strDesc += rootElement.lang.reportInfo_tire + (alarm.param1) + "kpa" + ";"
    }

    if (alarm.param2) {
        var l = (alarm.param2 & 0xffff); //低16位 胎温(单位 ℃)
        var h = (alarm.param2 & 0xffffffff) >> 16; //高16位 电池电量(单位 %),
        if (l > 0) {
            strDesc += rootElement.lang.reportInfo_temperature + l + rootElement.lang.degree + ";"
        }
        if (h > 0) {
            strDesc += rootElement.lang.reportInfo_batteryLevel + (h) + "%" + ";";
        }
    }
    return strDesc;
}


/**
 * 异常定位
 * @returns
 */
standardAlarm.prototype.getAbnormalPositionAlarm = function (armType) {
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    var strDesc = "";
    strDesc += rootElement.lang.abnormalPosition_Tip.replace(/{second}/, alarm.param1).replace(/{distance}/, alarm.param2);

    var ret = {};
    ret.strType = rootElement.lang.report_abnormalPosition_platform;
    ret.strDesc = strDesc;
    return ret;
}

/**
 * 中石油无任务报警
 * @returns
 */
standardAlarm.prototype.getTaskAlarm = function (armType) {
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    var strDesc = "";
    var strType = '';
    var ret = {};
    ret.strType = rootElement.lang.alarm_name_48;
    ret.strDesc = strDesc;
    return ret;
}

/**
 * 前车碰撞预警
 * @returns
 */
standardAlarm.prototype.getFrontCarCollisionAlarm = function (armType) {
    var alarm = null;
    var strDesc = "";
    var strType = '';
    var strMark = '';
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    if (armType == 400) {//报警开始
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
//	AlarmInfo:报警级别
//	Param[0]:道路标志识别数据
//	Param[1]:前车车速
//	Param[2]:前车/行人距离
//	desc(非苏标为空):报警标识号
//	if(alarm.desc && alarm.desc != ""){//
//		if(alarm.armIinfo){
//			strDesc +=  rootElement.lang.reportInfo_grade+alarm.armIinfo+";"
//		}
//		if(alarm.param1){
//			strDesc +=   rootElement.lang.reportInfo_roadSigns+alarm.param1+";"
//		}
//		if(alarm.param2){
//			strDesc +=  rootElement.lang.reportInfo_vehicleSpeed+alarm.param2+";"
//		}
//		if(alarm.param3){
//			strDesc +=   rootElement.lang.reportInfo_people+alarm.param3+";"
//		}
//	}
    var ret = {};
    ret.strType = rootElement.lang.adas_front_car_collision;
    ret.strDesc = strDesc;
    ret.strMark = strMark;
    return ret;
}


/**
 * 道偏离预警
 * @returns
 */
standardAlarm.prototype.getLaneDeviationAlarm = function (armType) {
    var alarm = null;
    var strDesc = "";
    var strType = '';
    var strMark = '';
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    if (armType == 401) {//报警开始
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
//	AlarmInfo:报警级别
//	Param[0]:道路标志识别数据
//	Param[1]:前车车速
//	Param[2]:前车/行人距离
//	Param[3]:偏离类型
//	desc(非苏标为空):报警标识号
//	if(alarm.desc && alarm.desc != ""){//
//		if(alarm.armIinfo){
//			strDesc +=  rootElement.lang.reportInfo_grade + alarm.armIinfo+";"
//		}
//		if(alarm.param1){
//			strDesc +=  rootElement.lang.reportInfo_roadSigns + alarm.param1+";"
//		}
//		if(alarm.param2){
//			strDesc +=  rootElement.lang.reportInfo_vehicleSpeed + alarm.param2+";"
//		}
//		if(alarm.param3){
//			strDesc +=  rootElement.lang.reportInfo_people + alarm.param3+";"
//		}
//		if(alarm.param4){
//			strDesc +=  rootElement.lang.reportInfo_deviate + alarm.param4+";"
//		}
//	}
    var ret = {};
    ret.strType = rootElement.lang.adas_lane_deviation;
    ret.strDesc = strDesc;
    ret.strMark = strMark;
    return ret;

}

/**
 * 行人检测预警
 * @returns
 */
standardAlarm.prototype.getPedestrianDetectionAlarm = function (armType) {
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    var strDesc = "";
    var strType = '';
    var ret = {};
    ret.strType = rootElement.lang.adas_pedestrian_detection;
    ret.strDesc = strDesc;
    return ret;
}

/**
 * 驾驶员遮挡或镜头偏离位置
 * @returns
 */
standardAlarm.prototype.getLensDeviationAlarm = function (armType) {
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    var strDesc = "";
    var strType = '';
    var ret = {};
    ret.strType = rootElement.lang.adas_lens_deviation;
    ret.strDesc = strDesc;
    return ret;
}

/**
 *不系安全带
 * @returns
 */
standardAlarm.prototype.getNoSeatBeltsAlarm = function (armType) {
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    var strDesc = "";
    var strType = '';
    var ret = {};
    ret.strType = rootElement.lang.adas_no_seat_belts;
    ret.strDesc = strDesc;
    return ret;
}
/**
 * 设备故障
 * @returns
 */
standardAlarm.prototype.getEquipmentFailureAlarm = function (armType) {
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    var strDesc = "";
    var strType = '';
    var ret = {};
    ret.strType = rootElement.lang.adas_equipment_failure;
    ret.strDesc = strDesc;
    return ret;
}
/**
 * 车距近
 * @returns
 */
standardAlarm.prototype.getShortDistanceAlarm = function (armType) {
    var alarm = null;
    var strDesc = "";
    var strType = '';
    var strMark = '';
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    if (armType == 406) {//报警开始
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
//	AlarmInfo:报警级别
//	Param[0]:道路标志识别数据
//	desc(非苏标为空):报警标识号
//	if(alarm.desc && alarm.desc != ""){//
//		if(alarm.armIinfo){
//			strDesc +=   rootElement.lang.reportInfo_grade+alarm.armIinfo+";"
//		}
//		if(alarm.param1){
//			strDesc +=  rootElement.lang.reportInfo_roadSigns+alarm.param1+";"
//		}
//	}
    var ret = {};
    ret.strType = rootElement.lang.adas_short_distance;
    ret.strDesc = strDesc;
    ret.strMark = strMark;
    return ret;
}

/**
 *急刹车
 * @returns
 */
standardAlarm.prototype.getSlamBrakeAlarm = function (armType) {
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    var strDesc = "";
    var strType = '';
    var ret = {};
    ret.strType = rootElement.lang.adas_slam_brake;
    ret.strDesc = strDesc;
    return ret;
}

/**
 * 急左转弯
 * @returns
 */
standardAlarm.prototype.getTurnLeftAlarm = function (armType) {
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    var strDesc = "";
    var strType = '';
    var ret = {};
    ret.strType = rootElement.lang.alarm_rapid_turnleft;
    ret.strDesc = strDesc;
    return ret;
}

/**
 * 急右转弯
 * @returns
 */
standardAlarm.prototype.getTurnRightAlarm = function (armType) {
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    var strDesc = "";
    var strType = '';
    var ret = {};
    ret.strType = rootElement.lang.alarm_rapid_tturnright;
    ret.strDesc = strDesc;
    return ret;
}

/**
 * 低头
 */
standardAlarm.prototype.getbelowHeadAlarmType = function (armType) {
    var alarm = null;
    var strDesc = "";
    var strType = '';
    var strMark = '';
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    if (armType == 410) {//报警开始
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.adas_alarm_type_belowHead;
    ret.strDesc = strDesc;
    ret.strMark = strMark;
    return ret;
}
/**
 * 在途不在线
 */
standardAlarm.prototype.getOnWayOffLine = function (armType) {
    var alarm = null;
    var strDesc = "";
    var strType = '';
    var strMark = '';
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    if (alarm.imgFile && alarm.imgFile != "") {//
        var infos = alarm.imgFile.split(';')
        if (infos && infos.length > 0) {
            strDesc += rootElement.lang.monitor_labelVehicleIdno + infos[0] + ";";

        }
        if (infos && infos.length > 1) {
            strDesc += rootElement.lang.vehicle_type + "：" + infos[1] + ";";
        }
    }
    var ret = {};
    ret.strType = rootElement.lang.on_the_way_offline_alarm;
    ret.strDesc = strDesc;
    ret.strMark = strMark;
    return ret;
}

/**
 * 在途不在线
 */
standardAlarm.prototype.getUnknowVehicle = function (armType) {
    var alarm = null;
    var strDesc = "";
    var strType = '';
    var strMark = '';
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    if (alarm.imgFile && alarm.imgFile != "") {//
        var infos = alarm.imgFile.split(';')
        if (infos && infos.length > 0) {
            strDesc += rootElement.lang.monitor_labelVehicleIdno + infos[0] + ";";

        }
        if (infos && infos.length > 1) {
            strDesc += rootElement.lang.vehicle_type + "：" + infos[1] + ";";
        }
    }

    var ret = {};
    ret.strType = rootElement.lang.unknow_vehicle_alarm;
    ret.strDesc = strDesc;
    ret.strMark = strMark;
    return ret;
}

/**
 * 808客流统计
 *
 */
standardAlarm.prototype.getPeopleUpload = function (armType) {
    var alarm = null;
    var strDesc = null;
    var strType = '';
    var strMark = '';
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    //	param[0]上车人数, param[1]下车人数
    if (alarm.param1 != null) {//上车人数
        strDesc = rootElement.lang.people_up + "：" + alarm.param1;
    }
    if (alarm.param2 != null) {//下车人数
        if (strDesc == null) {
            strDesc = "";
        } else {
            strDesc += ";";
        }
        strDesc += rootElement.lang.people_down + "：" + alarm.param2;
    }
    var ret = {};
    ret.strType = rootElement.lang.people_flow;
    ret.strDesc = strDesc;
    ret.strMark = strMark;
    return ret;
}


/**
 *撞击行人
 * @returns
 */
standardAlarm.prototype.getImpactingPedestriansAlarm = function (armType) {
    var alarm = null;
    var strDesc = "";
    var strType = '';
    var strMark = '';
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    if (armType == 421) {//报警开始
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
//	AlarmInfo:报警级别
//	Param[0]:道路标志识别数据
//	Param[2]:前车/行人距离
//	desc(非苏标为空):报警标识号
//	if(alarm.desc && alarm.desc != ""){//
//		if(alarm.armIinfo){
//			strDesc +=  rootElement.lang.reportInfo_grade+alarm.armIinfo+";"
//		}
//		if(alarm.param1){
//			strDesc +=  rootElement.lang.reportInfo_roadSigns+alarm.param1+";"
//		}
//		if(alarm.param3){
//			strDesc +=  rootElement.lang.reportInfo_people+alarm.param3+";"
//		}
//	}
    var ret = {};
    ret.strType = rootElement.lang.impacting_pedestrians;
    ret.strDesc = strDesc;
    ret.strMark = strMark;
    return ret;
}

/**
 *超速预警
 * @returns
 */
standardAlarm.prototype.getVehicleFrequentAlarm = function (armType) {
    var alarm = null;
    var strDesc = "";
    var strType = '';
    var strMark = '';
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    if (armType == 428) {//报警开始
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    // 开始报警显示为：报警速度
    if (alarm.param2) {
        strDesc += rootElement.lang.alarm_speed + '(' + this.getSpeedString(alarm.param2) + "),";
    }
    if (alarm.param3) {
        strDesc += rootElement.lang.abnormal_speed + '(' + this.getSpeedString(alarm.param3 * 10.0) + ");";
    }
    var ret = {};
    ret.strType = rootElement.lang.over_speed_warning;
    ret.strDesc = strDesc;
    ret.strMark = strMark;
    return ret;
}


/**
 *疲劳驾驶预警
 * @returns
 */
standardAlarm.prototype.getOverspeedSignsAlarm = function (armType) {
    var alarm = null;
    var strDesc = "";
    var strType = '';
    var strMark = '';
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    if (armType == 429) {//报警开始
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.fatigue_warning;
    ret.strDesc = strDesc;
    ret.strMark = strMark;
    return ret;
}

/**
 *    case 430:  //前撞预警
 *    case 480:  //前撞预警
 * @returns
 */
standardAlarm.prototype.getVehicleObstacleAlarm = function (armType) {
    var alarm = null;
    var strDesc = "";
    var strType = '';
    var strMark = '';
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    if (armType == 430) {//报警开始
        strMark = this.getAlarmStartEnd(1);
    } else if (armType == 480) {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.forward_collosion_warning;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}


//standardAlarm.prototype.getDriverIdentificationEvent = function() {
////	#define GPS_EVENT_TYPE_DRIVER_IDENTIFICATION_REPORT  143
////驾驶员身份识别上报事件 alarminfo:比对结果 param[0](高16位):比对相似度阈值 param[0](低16位):比对相似度 param[1]:
////	比对类型 param[2]:图片格式 szDesc:比对人脸ID  szImgFile:图片路径
//	var ret = {};
//	ret.strType = "";
//	ret.strMark = "";
//	ret.strDesc = "";
//	return ret;
//}

/**
 case 168:  //胎压报警
 case 169:  //胎压报警
 */
standardAlarm.prototype.getTireAlarmType = function (armType) {
    var alarm = null;
    var strDesc = "";
    var strType = '';
    var strMark = '';
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    if (armType == 168) {//报警开始
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var extra = "";
//	if(alarm.desc && alarm.desc != ""){//
////		此处仅说明苏标部分  胎压报警, alarmInfo  TPMS报警类型（1胎压（定时上报），2胎压过高报警，3胎压过低报警,4胎温过高报警,5传感器异常报警,6胎压不平衡报警,7慢漏气报警,8电池电量低报警）
////		param[0] 当前温度 如: 200 = 20度
////		param[1] 当前胎压 如: 25 = 2.5P
////		param[2] 电池电量 如: 10 = 10%
////		param[3] 传感器编号
////		desc(非苏标为空):报警标识号
//		extra += "("+ rootElement.lang.standard1078ShuBiao+")";
//		if(alarm.armIinfo){
//			var key = Number(alarm.armIinfo);
//			var type = null;
//			switch (key) {
//				case 1:
//					type =   rootElement.lang.tireReport_onTime;
//					break;
//				case 2:
//					type =   rootElement.lang.tireReport_high;
//					break;
//				case 3:
//					type =   rootElement.lang.tireReport_low;
//					break;
//				case 4:
//					type =   rootElement.lang.tireReport_temperature;
//					break;
//				case 5:
//					type =   rootElement.lang.tireReport_sensor;
//					break;
//				case 6:
//					type =   rootElement.lang.tireReport_balance;
//					break;
//				case 7:
//					type =   rootElement.lang.tireReport_leak;
//					break;
//				case 8:
//					type =   rootElement.lang.tireReport_battery;
//					break;
//				default:
//					break;
//			}
//			if(type){
//				strDesc +=  rootElement.lang.reportInfo_tpmsType+type+";"
//			}
//		}
//		if(alarm.param1){
//			strDesc +=  rootElement.lang.reportInfo_temperature+(alarm.param1/10).toFixed(1)+ rootElement.lang.degree+";"
//		}
//		if(alarm.param2){
//			strDesc +=  rootElement.lang.reportInfo_tire+(alarm.param2/10).toFixed(1)+"P"+";"
//		}
//		if(alarm.param4){
//			strDesc +=  rootElement.lang.reportInfo_sensor+(alarm.param4)+";"
//		}
//	}else{
//		旧版本不变
//		#define GPS_ALARM_TYPE_TPMS                     168     //胎压报警//    胎压报警, alarmInfo  TPMS报警类型（1表示电池电压警告，2表示胎压异常报警，3表示温度异常）,
//      param[0] 当前温度 如: 200 = 20度
//      param[1] 当前胎压 如: 25 = 2.5P
//      param[2] 当前电压 如: 102=10.2V
//      param[3] 传感器编号（01表示TPMS左1，02表示TPMS左2，03表示TPMS左3，04表示TPMS左4，11表示TPMS右1，12表示TPMS右2，13表示TPMS右3，14表示TPMS右4）
    if (alarm.armIinfo) {
        var key = Number(alarm.armIinfo);
        var type = null;
        switch (key) {
            case 1:
                type = rootElement.lang.battery_voltage_warning;
                break;
            case 2:
                type = rootElement.lang.tire_pressure_abnormal_alarm;
                break;
            case 3:
                type = rootElement.lang.temperature_anomalies;
                break;
            default:
                break;
        }
        if (type) {
            strDesc += rootElement.lang.reportInfo_tpmsType + type + ";"
        }
    }
    if (alarm.param1) {
        strDesc += rootElement.lang.reportInfo_temperature + (alarm.param1 / 10).toFixed(1) + "度" + ";"
    }
    if (alarm.param2) {
        strDesc += rootElement.lang.reportInfo_tire + (alarm.param2 / 10).toFixed(1) + "P" + ";"
    }
    if (alarm.param3) {
        strDesc += rootElement.lang.reportInfo_power + (alarm.param3 / 10).toFixed(1) + "V" + ";"
    }
    if (alarm.param4) {
        var key = Number(alarm.param4);
        var type = null;
        switch (key) {
//			01表示TPMS左1，02表示TPMS左2，03表示TPMS左3，04表示TPMS左4，11表示TPMS右1，12表示TPMS右2，13表示TPMS右3，14表示TPMS右4
            case 1:
                type = "TPMS" + rootElement.lang.left + "1";
                break;
            case 2:
                type = "TPMS" + rootElement.lang.left + "2";
                break;
            case 3:
                type = "TPMS" + rootElement.lang.left + "3";
            case 4:
                type = "TPMS" + rootElement.lang.left + "4";
                break;
            case 11:
                type = "TPMS" + rootElement.lang.right + "1";
                break;
            case 12:
                type = "TPMS" + rootElement.lang.right + "2";
                break;
            case 13:
                type = "TPMS" + rootElement.lang.right + "3";
                break;
            case 14:
                type = "TPMS" + rootElement.lang.right + "4";
                break;
            default:
                break;
        }
        if (type) {
            strDesc += rootElement.lang.reportInfo_sensor + type + ";"
        }
//		}
    }
    var ret = {};
    ret.strType = rootElement.lang.tire_alarm + extra;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}

standardAlarm.prototype.getVehicleSignsAlarm = function (armType) {
    var strMark = '';
    var strDesc = "";
    var alarm = null;
    if (armType == 141) {
        alarm = this.startAlarm;
        strMark = this.getAlarmStartEnd(1);
    } else {
        alarm = this.endAlarm;
        strMark = this.getAlarmStartEnd(0);
    }
    if (alarm.param1) {
        strDesc += rootElement.lang.alarm_speed_threshold + ":" + this.getSpeedString(alarm.param1 * 10) + ";";
        var status = this.getAlarmStatus();
        if (status && status.speed) {
            strDesc += rootElement.lang.alarm_current_speed + ":" + this.getSpeedString(status.speed);
        }
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_nightdriving_zsy;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}

//只获取报警类型
standardAlarm.prototype.getOnlyAlarmType = function (armType) {
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    var strDesc = "";
    var strType = '';
    var strMark = '';
    if (armType == 431 || armType == 432 || armType == 433
        || armType == 712 || armType == 713 || armType == 714) {//报警开始
        strMark = this.getAlarmStartEnd(1);
    } else if (armType == 481 || armType == 482 || armType == 483
        || armType == 762 || armType == 763 || armType == 764) {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    switch (armType) {
        case 431:
        case 481:
            strType = rootElement.lang.lane_offset_warning;
            break;
        case 432:
        case 482:
            strType = rootElement.lang.tire_warning;
            break;
        case 433:
        case 483:
            strType = rootElement.lang.rollover_warning;
            break;
        case 712: //道路运输证IC卡模块故障
        case 762:
            strType = rootElement.lang.module_failure;
            break;
        case 713: //违规行驶
        case 763:
            strType = rootElement.lang.driving_violations;
            break;
        case 714: //右转盲区异常报警
        case 764:
            strType = rootElement.lang.turn_blind_zone;
            break;
        default:
            break;
    }
    ret.strMark = strMark;
    ret.strType = strType;
    ret.strDesc = strDesc;
    return ret;
}


/**
 *    异常驾驶
 */
standardAlarm.prototype.getAbnormalDrive = function (armType) {
    var strMark = '';
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    var types = [];
    if (alarm.param1) {
        if ((alarm.param1) & 1 > 0) {//疲劳驾驶
            var cd = 0;
            if (alarm.param2) {
                cd = alarm.param2;
            }
            types.push(rootElement.lang.fatigue_driving + '' + cd);
        }
        if ((alarm.param1 >> 1) & 1 > 0) {//打电话
            types.push(rootElement.lang.on_the_telephone);
        }
        if ((alarm.param1 >> 2) & 1 > 0) {//抽烟
            types.push(rootElement.lang.smoking);
        }
//		AlarmInfo:报警级别
//		param[0]:异常驾驶标志位 bit0：疲劳; bit1：打电话  bit2：抽烟  bit3:分神驾驶  bit4:驾驶员异常
//		param[1]: //疲劳程度 0-100
//		desc(非苏标为空):报警标识号
//		if(alarm.desc && alarm.desc != ""){
//			if((alarm.param1 >> 3) & 1 > 0){//抽烟
//				types.push( rootElement.lang.reportInfo_distraction);
//			}
//			if((alarm.param1 >> 4) & 1 > 0){//抽烟
//				types.push( rootElement.lang.reportInfo_abnormality);
//			}
//			if(alarm.armIinfo){
//				types.push( rootElement.lang.reportInfo_grade+alarm.armIinfo);
//			}
//		}
    }

    if (armType == 248) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.abnormal_drive;
    ret.strMark = strMark;
    ret.strDesc = types.join(';');
    return ret;
}

/**
 case 314:  //夜间超速报警(平台)
 case 364:  //夜间超速报警(平台)
 * @returns
 */
standardAlarm.prototype.getNigthOverSpeedType = function (armType) {
    var alarm = null;
    var strDesc = "";
    var strType = '';
    var strMark = '';
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    if (armType == 314) {//报警开始
        strMark = this.getAlarmStartEnd(1);
    } else if (armType == 364) {
        strMark = this.getAlarmStartEnd(0);
    }

    if (alarm.armIinfo) {
        strDesc += rootElement.lang.superrate + ':' + alarm.armIinfo + "%,";
    }
    var status = this.getAlarmStatus();

    if (status.speed) {
        strDesc += rootElement.lang.alarm_speed + '(' + this.getSpeedString(status.speed) + "),";
    }
    //	param[0]当前超速限速值
    if (alarm.param3) {
        //速度阙值  使用车辆实体类对应的限速值 占时位解析
        strDesc += rootElement.lang.abnormal_speed + '(' + this.getSpeedString(alarm.param3 * 10.0) + ")";
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_type_night_overSpeed_platform;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}

/**
 case 140:  //离线预警(平台产生)
 * @returns
 */
standardAlarm.prototype.getVehicleOffLineType = function (armType) {
    var alarm = null;
    var strDesc = "";
    var strType = '';
    var strMark = '';
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
//	 param[0]:0-预警 1-结束预警,当param[0]=1时,Param[1]有效:1-设备上线,2-预警已处理,当param[0]=0时,Param[2]表示判断阀值,单位:秒

//	#define GPS_EVENT_TYPE_OFFLINE_EARLYWARNING 140 //离线预警
//	Param0:0-预警 1-结束预警 2-预警(新) 3-结束预警(新)(设备上线) 4-结束预警(新)(预警已处理)
//	Param1:Param0=0时,参数无效; Param0=1时,1-设备上线,2-预警已处理; Param0=其他值时,表示离线时间
//	Param2:Param0=0时,表示判断阀值,单位:秒
//	增加解析
//	1-设备上线
//	2-预警已处理
//	3-结束预警(新)(设备上线)
//	4-结束预警(新)(预警已处理)
    if (alarm.param1 != null && (alarm.param1 == 0 || alarm.param1 == 1 || alarm.param1 == 2 || alarm.param1 == 3 || alarm.param1 == 4)) {
        if (alarm.param1 == 1) {
            if (alarm.param2) {
                if (alarm.param2 == 1) {
                    strDesc += rootElement.lang.alarm_type_device_online + ";";
                } else if (alarm.param2 == 2) {
                    strDesc += rootElement.lang.handle_vehicle_offline + ";";
                }
            }
        } else if (alarm.param1 == 0) {
            if (alarm.param3 && alarm.param3 > 0) {
                strDesc += rootElement.lang.judge_vehicle_oddline + ':' + getTimeDifference4(alarm.param3, true) + ";";
            }
        } else {//离线时间
            if (alarm.param1 == 3) {//结束预警(新)(设备上线)  - 设备上线
//				strDesc += rootElement.lang.vehicle_offline_online;
                strDesc += rootElement.lang.alarm_type_device_online;
            } else if (alarm.param1 == 4) {//结束预警(新)(预警已处理) - 预警已处理
//				strDesc += rootElement.lang.vehicle_offline_handle;
                strDesc += rootElement.lang.handle_vehicle_offline;
            } else if (alarm.param1 == 2) {//预警(新)
//				strDesc += rootElement.lang.vehicle_offline_new;
            }
            if (alarm.param2) {
                strDesc += rootElement.lang.report_last_time + ':' + dateFormat2TimeString(new Date((alarm.param2 * 1000)));
            }
        }
    }
    var ret = {};
    ret.strType = rootElement.lang.vehicle_offline;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}

/**
 case 145:  //司机工作超过八小时 (平台产生)
 * @returns
 */
standardAlarm.prototype.getDriverOverWorkType = function (armType) {
    var alarm = null;
    var strDesc = "";
    var strType = '';
    var strMark = '';
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    //超时驾驶事件 param[0]:司机ID param[1]:驾驶时长,单位:秒 param[2]:超时阀值,单位:秒
    if (alarm.param2 && alarm.param2 > 0) {
        strDesc += rootElement.lang.driver_times + ':' + getTimeDifference4(alarm.param2, true)  + ";";
    }
    if (alarm.param3 && alarm.param2 > 0) {
        strDesc += rootElement.lang.judge_driver_overTime + ':' + getTimeDifference4(alarm.param3, true) + ";";
    }
    var ret = {};
    ret.strType = rootElement.lang.report_haiju_driver;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}


/**
 * 解析报警类型
 */
standardAlarm.prototype.getFormatMDVRAlarmString = function (armType) {
    var ret = {};
    if (rootElement.myUserRole && rootElement.myUserRole.isShieldReport()) {
        var shieldAlarm = ",207,194,231,174,217,218,8,182,183,192,244,245,248,";
        if (shieldAlarm.indexOf(',' + armType + ",") >= 0) {
            ret.strType = rootElement.lang.unknown;
            return ret;
        }
    }
    switch (armType) {
        case 18:  //GPS讯号丢失开始
        case 68:  //GPS讯号丢失结束
            return this.getSignalLossAlarm(armType);
        case 1:  //自定义报警开始
        case 51:  //自定义报警结束
            return this.getUserDefineAlarm(armType);
        case 19:  //IO_1报警 开始
        case 69:  //  结束
        case 1416:  //IO_1报警 开始
        case 1466:  //  结束
            return this.getIOAlarm(0, armType);
        case 20:  //IO_2报警 开始
        case 70:  //结束
        case 1417:  //IO_2报警 开始
        case 1467:  //  结束
            return this.getIOAlarm(1, armType);
        case 21:  //IO_3报警 开始
        case 71:  //结束
        case 1418:  //IO_3报警 开始
        case 1468:  //结束
            return this.getIOAlarm(2, armType);
        case 22:  //IO_4报警 开始
        case 72:  //结束
        case 1419:  //IO_4报警 开始
        case 1469:  //结束
            return this.getIOAlarm(3, armType);
        case 23:  //IO_5报警 开始
        case 73:  //结束
        case 1420:  //IO_5报警 开始
        case 1470:  //结束
            return this.getIOAlarm(4, armType);
        case 24:  //IO_6报警 开始
        case 74:  //结束
        case 1421:  //IO_6报警 开始
        case 1471:  //结束
            return this.getIOAlarm(5, armType);
        case 25:  //IO_7报警 开始
        case 75:  //结束
        case 1422:  //IO_7报警 开始
        case 1472:  //结束
            return this.getIOAlarm(6, armType);
        case 26:  //IO_8报警 开始
        case 76:  //结束
        case 1423:  //IO_8报警 开始
        case 1473:  //结束
            return this.getIOAlarm(7, armType);
        case 41:  //IO_9报警 开始
        case 91:  //结束
        case 1424:  //IO_9报警 开始
        case 1474:  //结束
            return this.getIOAlarm(8, armType);
        case 42:  //IO_10报警 开始
        case 92:  //结束
        case 1425:  //IO_10报警 开始
        case 1475:  //结束
            return this.getIOAlarm(9, armType);
        case 43:  //IO_11报警 开始
        case 93:  //结束
        case 1426:  //IO_11报警 开始
        case 1476:  //结束
            return this.getIOAlarm(10, armType);
        case 44:  //IO_12报警 开始
        case 94:  //结束
        case 1427:  //IO_12报警 开始
        case 1477:  //结束
            return this.getIOAlarm(11, armType);
        case 2:  //紧急按钮报警 开始
        case 52:  //结束
            return this.getUrgencyButtonAlarm(armType);
        case 3:  //振动报警(侧翻报警) 开始
        case 53:  //结束
            return this.getShakeAlarm(armType);
        case 14:  //超时停车 开始
        case 64:  // 结束
            return this.getOvertimeParkAlarm(armType);
        case 4:  //视频丢失报警 开始
        case 54:  //结束
            return this.getVideoLostAlarm(armType);
        case 5:  //摄像头遮挡报警 开始
        case 55:  //结束
            return this.getVideoMaskAlarm(armType);
        case 6:  //非法开门报警 开始
        case 56:  //结束
            return this.getDoorOpenLawlessAlarm(armType);
        case 7:  //三次密码错误报警 开始
        case 57:  //结束
            return this.getWrongPwdAlarm(armType);
        case 8:  //车辆非法点火报警 开始
        case 58:  //结束
            return this.getFireLowlessAlarm(armType);
        case 9:  //温度报警 开始
        case 59:  //结束
            return this.getTemperatorAlarm(armType);
        case 10:  //硬盘错误报警 开始
        case 60:  //结束
            return this.getDiskErrAlarm(armType);
        case 11:  //超速报警 开始
        case 61:  //结束
            return this.getOverSpeedAlarm(armType);
        case 151:  //夜间行驶报警 开始
        case 152:  //结束
            return this.getNightDrivingAlarm(armType);
        case 153:  //聚众报警 开始
        case 154:  //结束
            return this.getGatheringAlarm(armType);
        case 155:  //UPS 剪线报警警 开始
        case 156:  //结束
            return this.getUSPCutAlarm(armType);
        case 157:  //硬盘超温报警 开始
        case 158:  //结束
            return this.getHddHighTempAlarm(armType);
        case 159:  //前面板被撬开报警 开始
        case 160:  //结束
            return this.getBeBoOpenedAlarm(armType);
        case 161:  //关机上报报警
            return this.getTurnOffAlarm(armType);
        case 162:  //硬盘空间不足报警 开始
        case 163:  //结束
            return this.getDiskSpaceAlarm(armType);
        case 166:  //SIM卡丢失报警 开始
        case 167:  //结束
            return this.getSimLostAlarm(armType);
        case 12:  //越界报警 开始
        case 62:  //结束
            return this.getBeyondBoundsAlarm(armType);
        case 13:  //异常开关车门报警 开始
        case 63:  //结束
            return this.getDoorAbnormalAlarm(armType);
        case 17:  //设备在线
        case 67:  //设备断线
            return this.getOnlineAlarm(armType);
        case 16:  //ACC开启报警
        case 66:  //ACC关闭报警
            return this.getACCAlarm(armType);
        case 15:  //移动侦测报警 开始
        case 65:  //结束
            return this.getMotionAlarm(armType);
        case 46:  //油量报警  加油 开始
        case 86:  //结束
        case 47:  //油量报警 减油 开始
        case 87:  //结束
            return this.getOilAlarm(armType);
        case 49:  //疲劳驾驶  开始
        case 99:  //结束
            return this.getFatigueAlarm(armType);
        //this.fillObject( rootElement.lang.face_fatigue,  rootElement.lang.monitor_alarm_adas, "249", "299", "adasAlarm",false,true);
        case 249:  //疲劳驾驶  开始
        case 299:  //结束
            return this.getFaceFatigueAlarm(armType);
        ////平台报警
        case 300:  //区域超速报警  开始
        case 350:  //结束
        case 301:  //区域低速报警  开始
        case 351:  //结束
            return this.getCMSAreaOverSpeedAlarm(armType);
        case 302:  //进出入区域报警  开始
        case 352:  //结束
        case 303:  //线路偏移报警  开始
        case 353:  //结束
            return this.getCMSAreaInOutAlarm(armType);
        case 304:  //时间段超速报警  开始
        case 354:  //结束
            return this.getCMSTimeOverSpeedAlarm(armType);
        case 305:  //时间段低速报警  开始
        case 355:  //结束
            return this.getCMSTimeLowSpeedAlarm(armType);
        case 306:  //疲劳驾驶报警  开始
        case 356:  //结束
        case 1109:// 疲劳驾驶预警(平台) 开始
        case 1110:
        case 1121:
        case 1126:
        case 1127:
        case 1128:
        case 1129:
            return this.getCMSFatigueAlarm(armType);
        case 307:  //超时停车报警  开始
        case 357:  //结束
            return this.getCMSParkTooLongAlarm(armType);
        case 308:  //关键点监控报警  开始
        case 358:  //结束
            return this.getCMSAreaPointAlarm(armType);
        case 309:  //线路超速报警  开始
        case 359:  //结束
        case 310:  //线路低速报警  开始
        case 360:  //结束
            return this.getCMSAreaOverSpeedAlarm(armType);
        case 311:  //道路等級限速  开始
        case 361:  //结束
            return this.getCMSRoadLevelOverSpeedAlarm(armType);
        //事件
        case 101:  //停车事件
            return '';
        case 102:  //停车未熄火事件
            return '';
        case 103:  //流量
            return '';
        case 104:  //加油
            return '';
        case 105:  //偷油
            return '';
        case 106:  //超速事件
            return '';
        case 107:  //进出区域事件
            return '';
        case 108:  //区域停车事件
            return '';
        case 109:  //图片文件或者录像文件上传   有问题
            return this.getEventFileUpload(armType);
        case 111:  //海船状态报警
            return '';
        case 114:  //超速预警
            return '';
        case 115:  //低速预警
            return '';
        case 116:  //驾驶员信息采集上报   有问题
            return this.getDriverInfo(armType);
        case 130:  //报警图片文件或者录像文件下载
            return this.getEventFileDownload(armType);
        case 148:
            return this.overMan(armType);
        case 344:
            return this.overManPlatform(armType);
        case 110:  //报站信息
            return this.getEventStationInfo(armType);
        case 113:  //自定义报警()
            return this.getCustomAlarmInfo(armType);
        case 132:  //透传数据
            return '';
        case 27:  //进入区域报警
        case 28:  //出区域报警
        case 33:  //区域内停车报警
        case 34:  //区域外停车报警
        case 77:  //进入区域报警
        case 78:  //出区域报警
        case 83:  //区域内停车报警
        case 84:  //区域外停车报警
        case 29:  //区域内高速报警
        case 30:  //区域外高速报警
        case 31:  //区域内低速报警
        case 32:  //区域外低速报警
        case 79:  //区域内高速报警
        case 80:  //区域外高速报警
        case 81:  //区域内低速报警
        case 82:  //区域外低速报警
            return this.getFenceAlarm(armType);
        //808部分报警
        case 200:  //区域超速报警 开始
        case 250:  //结束
            return this.getAreaOverSpeedAlarm(armType);

        case 1312:  //区域超时停车(平台) 开始
        case 1362:  //结束
            return this.getAreaOverTimeAlarm(armType);

        case 201:  //预警报警  开始
        case 251:  //结束
            return this.getWarningAlarm(armType);
        case 445:  //危险驾驶行为报警  开始
        case 495:  //结束
            return this.getDangerousDrivingAlarm(armType);
        case 202:  //GNSS模块发生故障报警  开始
        case 252:  //结束
            return this.getGNSSModuleFailureAlarm(armType);
        case 203:  //GNSS天线未接或剪断  开始
        case 253:  //结束
            return this.getGNSSAntennaMissedOrCutAlarm(armType);
        case 204:  //GNSS天线短路  开始
        case 254:  //结束
            return this.getGNSSAntennaShortAlarm(armType);
        case 205:  //主电源欠压  开始
        case 255:  //结束
            return this.getSupplyUndervoltageAlarm(armType);

        case 206:  //主电源掉电  开始
        case 256:  //结束
            return this.getPowerFailureAlarm(armType);
        case 207:  //终端LCD或者显示器故障  开始
        case 257:  //结束
            return this.getLCDFailureAlarm(armType);
        case 208:  //TTS模块故障  开始
        case 258:  //结束
            return this.getTTSModuleFailureAlarm(armType);
        case 209:  //摄像头故障  开始
        case 259:  //结束
            return this.getCameraFailureAlarm(armType);
        case 210:  //当天累计驾驶超时  开始
        case 260:  //结束
            return this.getDrivingTimeoutAlarm(armType);
        case 211:  //进出区域  开始
        case 261:  //结束
        case 212:  //进出路线报警  开始
        case 262:  //结束
            return this.getCMSAreaInOutAlarm(armType);
        case 213:  //路段行驶时间不足或过长  开始
        case 263:  //结束
            return this.getRoadTravelTimeAlarm(armType);

        case 214:  //路线偏离报警  开始
        case 264:  //结束
            return this.getRouteDeviationAlarm(armType);
        case 215:  //车辆VSS故障  开始
        case 265:  //结束
            return this.getVSSFailureAlarm(armType);
        case 216:  //车辆油量异常报警  开始
        case 266:  //结束
            return this.getAbnormalFuelAlarm(armType);
        case 217:  //防盗器  车辆被盗报警  开始
        case 267:  //结束
            return this.getAntitheftDeviceAlarm(armType);
        case 218:  //車輛非法位移報警  开始
        case 268:  //结束
            return this.getIllegalDisplacementAlarm(armType);
        case 219:  //侧翻报警  开始
        case 269:  //结束
            return this.getRolloverAlarm(armType);
        case 117: //报站信息开始
            return '';//this.getBusArrivalStationInfo(armType);
        case 118: //溜站报警开始
            return this.getBusSlipStationAlarm(armType);
        /****** 新增加的轮胎报警*******/

        case 235: 	//胎温报警
        case 285: 	//结束
            return this.getTiretemperature(armType);
        case 236: 	//配置错误报警
        case 286:	//结束
            return this.getConfigurationErrorAlarm(armType);
        case 237:	//传感器无信号
        case 287:	//结束
            return this.getSensorNoSignal(armType);
        case 238:	//低电压报警
        case 288:	//结束
            return this.getLowVoltageAlarm(armType);
        case 239:	//胎压报警开始
        case 289:
            return this.getTpmsAlarm(armType);
//	case 239: //胎压报警开始
//	case 289:
//		return this.getTpmsAlarm(armType);

        /** 设备上锁**/
        case 182: //设备开锁
        case 183: //设备上锁
            return this.getDeviceLockAlarm(armType);
        /******* 2017/2/10 添加 ********/
        case 184: //加水报警
        case 185: //水位减少报警
            return this.getWaterLevelAlarm(armType);
        /*******  危化  *******/
        case 232: //禁行区域
        case 282:
        case 233: //禁行线路
        case 283:
        case 234: //异地车辆入境
        case 284:
            return this.getChemicalAreaAlarm(armType);
        case 170: //面向警示
        case 171:
            return this.getFaceAlarm(armType);
        case 172: //闭眼警示
        case 173:
            return this.getEyesClosedAlarm(armType);
        case 174: //手机警示
        case 175:
            return this.getPhoneAlarm(armType);
        case 176: //抽烟警示
        case 177:
            return this.getSmokeAlarm(armType);
        case 186: //离岗警示
        case 187:
            return this.getLeaveJobAlarm(armType);
        case 188: //左顾右盼
        case 189:
            return this.getLookAroundAlarm(armType);
        case 190: //打哈欠
        case 191:
            return this.getYawnAlarm(armType);
        case 192: //氧气浓度低
        case 193:
            return this.getLowOxygenAlarm(armType);
        case 246: //急加速
        case 296:
            return this.getRapidAccelerationAlarm(armType);
        case 247: //急减速
        case 297:
            return this.getRapidDecelerationAlarm(armType);
        //2017年4月26日 11:13:03
        case 244://其他视频设备故障报警开始报警
        case 294://结束报警
            return this.getOtherDeviceError(armType);
        case 245://特殊报警录像达到存储阈值报警开始报警
        case 295://结束报警
            return this.getRecordThreshold(armType);
        case 248://异常驾驶开始报警
        case 298://结束报警
            return this.getAbnormalDrive(armType);
        case 194://烟感报警
        case 195:
            return this.getSmokeInductionAlarm(armType);
        case 136: //异常定位
            return this.getAbnormalPositionAlarm(armType);
        case 48: //无任务出车
            return this.getTaskAlarm(armType);
        case 400: //前车碰撞预警
        case 450:
            return this.getFrontCarCollisionAlarm(armType);
        case 401: //道偏离预警
        case 451:
            return this.getLaneDeviationAlarm(armType);
        case 402: //行人检测预警
        case 452:
            return this.getPedestrianDetectionAlarm(armType);
        case 403: //驾驶员遮挡或镜头偏离位置
        case 453:
            return this.getLensDeviationAlarm(armType);
        case 404: //不系安全带
        case 454:
            return this.getNoSeatBeltsAlarm(armType);
        case 405: //设备故障
        case 455:
            return this.getEquipmentFailureAlarm(armType);
        case 406: //车距近
        case 456:
            return this.getShortDistanceAlarm(armType);
        case 407: //急刹车
        case 457:
            return this.getSlamBrakeAlarm(armType);
        case 408: //急左转弯
        case 458:
            return this.getTurnLeftAlarm(armType);
        case 409: //急右转弯
        case 459:
            return this.getTurnRightAlarm(armType);
        case 421:  //撞击行人
        case 471:  //撞击行人
            return this.getImpactingPedestriansAlarm(armType);
        case 141:  //中石油 夜间无路单禁止行车(平台)
        case 142:
            return this.getVehicleSignsAlarm();
//	case 143:  ////驾驶员身份识别上报事件
//		return this.getDriverIdentificationEvent();
        case 168:  //胎压报警
        case 169:  //胎压报警
            return this.getTireAlarmType(armType);

        case 314:  //夜间超速报警(平台)
        case 364:  //夜间超速报警(平台)
            return this.getNigthOverSpeedType(armType);

        case 140:  //离线预警(平台产生)
            return this.getVehicleOffLineType(armType);
        case 145:  //司机工作超过八小时 (平台产生)
            return this.getDriverOverWorkType(armType);
        case 410:  //低头
        case 460:  //地头
            return this.getbelowHeadAlarmType(armType);

        case 146: //在途不在线
            return this.getOnWayOffLine(armType);
        case 147: //未知车辆
            return this.getUnknowVehicle(armType);
        case 135: //808客流统计
            return this.getPeopleUpload(armType);
        case 231: //超员
        case 281:
            return this.getOverLoad(armType);
        case 600://前向碰撞报警1级
        case 601://前向碰撞报警2级
        case 1207://前向碰撞报警3级
        case 1257://前向碰撞报警3级

        case 602://车道偏离报警1级
        case 603://车道偏离报警 2级
        case 1209://车道偏离报警 3级
        case 1259://车道偏离报警 3级


        case 604://车距过近报警 1级
        case 605://车距过近报警 2级
        case 1208://车距过近报警 3级
        case 1258://车距过近报警 3级

        case 606://行人碰撞报警  1级
        case 607://行人碰撞报警  2级
        case 1210://行人碰撞报警 3级
        case 1260://行人碰撞报警 3级


        case 608://频繁变道  1级
        case 609://频繁变道  2级
        case 610://道路标识超限报警  1级
        case 611://道路标识超限报警  2级
        case 612://障碍物报警 1级
        case 613://障碍物报警 2级
        case 614://道路标志识别事件 1级
        case 615://道路标志识别事件 2级
        case 665://道路标志识别事件 2级
        case 616://主动抓拍事件 1级
        case 666://主动抓拍事件 1级
        case 617://主动抓拍事件 2级
        case 667://主动抓拍事件 2级

        case 618://疲劳驾驶报警  1级
        case 619://疲劳驾驶报警 2级
        case 1200://疲劳驾驶报警 3级
        case 1250://疲劳驾驶报警 3级

        case 620://接打电话报警  1级
        case 621://接打电话报警 2级
        case 1203://接打电话报警 3级
        case 1253://接打电话报警 3级

        case 622://抽烟报警 1级
        case 623://抽烟报警 2级
        case 1202://抽烟报警 3级
        case 1252://抽烟报警 3级

        case 624://分神驾驶报警 1级
        case 625://分神驾驶报警 2级
        case 1201://分神驾驶报警 3级
        case 1251://分神驾驶报警 3级

        case 626://驾驶员异常报警 1级
        case 627://驾驶员异常报警 2级
        case 1206://驾驶员异常报警 3级
        case 1256://驾驶员异常报警 3级


        case 628://自动抓拍事件 1级
        case 678://自动抓拍事件 1级
        case 629://自动抓拍事件 2级
        case 679://自动抓拍事件 2级
        case 630://驾驶员变更事件 1级
        case 680://驾驶员变更事件 1级
        case 631://驾驶员变更事件 2级
        case 681://驾驶员变更事件 2级
        case 632://胎压报警
        case 633://后方接近报警
        case 634://左侧后方接近报警
        case 635://右侧后方接近报警
        //以上是开始
        case 650:	//前向碰撞报警1级
        case 651:		//前向碰撞报警2级
        case 652:		//车道偏离报警1级
        case 653:		//车道偏离报警2级
        case 654:		//车距过近报警1级
        case 655:		//车距过近报警2级
        case 656:		//行人碰撞报警1级
        case 657:		//行人碰撞报警2级
        case 658:     //频繁变道 1级
        case 659:     //频繁变道 2级
        case 660:     //道路标识超限报警 1级
        case 661:     //道路标识超限报警 2级
        case 662:     //障碍物报警 1级
        case 663:     //障碍物报警 2级
        // DSM
        case 668:		//疲劳驾驶报警 1级
        case 669:		//疲劳驾驶报警 2级
        case 670:     //接打电话报警 1级
        case 671:		//接打电话报警 2级
        case 672:     //抽烟报警 1级
        case 673:     //抽烟报警 2级
        case 674:     //分神驾驶报警 1级
        case 675:     //分神驾驶报警 2级
        case 676:     //驾驶员异常报警 1级
        case 677:    //驾驶员异常报警 2级
        // TPMS
        case 682:		//胎压报警(苏标)
        // BDS
        case 683:     //后方接近报警,desc(非苏标为空):报警标识号
        case 684:     //左侧后方接近报警,desc(非苏标为空):报警标识号
        case 685:     //右侧后方接近报警,desc(非苏标为空):报警标识号
        case 637:		//驾驶员识别
        case 687:
        case 639:		//墨镜失效一级报警
        case 689:
        case 640:		//墨镜失效二级报警
        case 690:
        case 641:		//驾驶员IC卡异常报警1级
        case 691:
        case 642:		//驾驶员IC卡异常报警2级
        case 692:
        case 643:		//驾驶员身份识别事件
        case 700:		//弯道车速预警1级
        case 750:
        case 701:		//弯道车速预警2级
        case 751:
        case 702:		//长时间不目视前方报警1级
        case 752:
        case 703:		//长时间不目视前方报警2级
        case 753:
        case 704:		//系统不能正常工作报警1级
        case 754:
        case 705:		//系统不能正常工作报警2级
        case 755:
        case 706:		//驾驶员未系安全带报警1级
        case 756:
        case 707:		//驾驶员未系安全带报警2级
        case 757:
        case 1205:		//驾驶员未系安全带报警3级
        case 1255:

        case 708:		//驾驶员不在驾驶位报警1级
        case 758:
        case 709:		//驾驶员不在驾驶位报警2级
        case 759:

        case 710:		//驾驶员双手脱离方向盘报警1级
        case 760:
        case 711:		//驾驶员双手脱离方向盘报警2级
        case 761:
        case 1204:		//驾驶员双手脱离方向盘报警3级
        case 1254:


        case 644:		//喝水报警1级
        case 694:
        case 645:		//喝水报警2级
        case 695:
        case 715:		//驾驶辅助功能失效报警1级
        case 765:
        case 716:		//驾驶辅助功能失效报警2级
        case 766:
        case 717:		//驾驶员行为监测功能失效报警1级
        case 767:
        case 718:		//驾驶员行为监测功能失效报警2级
        case 768:
        case 719:		//驾驶员身份异常
        case 720:		//急加速报警
        case 770:
        case 721:		//急减速报警
        case 771:
        case 722:		//急转弯报警
        case 772:
        case 723:		//怠速报警
        case 773:
        case 724:		//异常熄火报警
        case 774:
        case 725:		//空挡滑行报警
        case 775:
        case 726:		//发动机超转报警
        case 776:
        case 727:		//超速报警
        case 777:
        case 728:		//路口快速通过报警1级
        case 778:
        case 729:		//路口快速通过报警2级
        case 779:
        case 730:		//实线变道报警1级
        case 780:
        case 731:		//实线变道报警2级
        case 781:
        case 732:		//设备失效提醒报警1级
        case 782:
        case 733:		//设备失效提醒报警2级
        case 783:
        case 734:		//探头遮挡报警1级
        case 784:
        case 735:		//探头遮挡报警2级
        case 785:
        case 736:		//换人驾驶报警1级
        case 786:
        case 737:		//换人驾驶报警2级
        case 787:
        case 738:		//超时驾驶报警1级
        case 788:
        case 739:		//超时驾驶报警2级
        case 789:
        case 740:		//车厢超载报警1级
        case 790:
        case 741:		//车厢超载报警2级
        case 791:
        case 742:		//站外上客报警2级
        case 792:
        case 743:		//站外上客报警2级
        case 793:
        case 745:		//单手脱离方向盘1级
        case 795:
        case 746:		//单手脱离方向盘2级
        case 796:
        case 840:      //低速前车碰撞预警1级
        case 890:
        case 841:      //低速前车碰撞预警2级
        case 891:
        case 840:      //低速前车碰撞预警1级
        case 890:
        case 841:      //低速前车碰撞预警2级
        case 891:
        case 843:   //司机归来事件
        case 844:   //身份认证失败事件
        case 847:   //身份认证成功事件
        case 842:   //驾驶员正脸抓拍事件
        case 845:   //低速前车碰撞预警1级
        case 846:
        // 黑车开始
        case 530:
        case 531:
        case 532:
        case 533:
        case 534:
        case 535:
        case 536:
        case 537:
        // 黑车结束
        case 580:
        case 581:
        case 582:
        case 583:
        case 584:
        case 585:
        case 586:
        case 587:
        case 1406:
        case 1456:
        case 1407:
        case 1457:

        case 1408:		//超时驾驶报警1级
        case 1458:
        case 1409:		//超时驾驶报警2级
        case 1459:
            //其他
            return this.getSuBiaoAlarm(armType);
        case 636:		//驾驶员识别
        case 686:		//驾驶员识别
        case 646: //ret = getText("插卡比对身份识别上报事件"); //
        case 647: //ret = getText("巡检比对身份识别上报事件"); //
        case 648: //ret = getText("点火比对身份识别上报事件"); //
        case 649: //ret = getText("离开返回比对身份识别上报事件"); //
        case 696: //驾驶员识别事件
        case 697: //刷脸签到身份识别上报事件
        case 698: //动态查岗身份识别上报事件
            return this.getDriverIdentify(armType);
        case 439:
        case 489:
        case 440:
        case 490:
        case 441:
        case 491:
            return this.getGSenSorAlarm(armType);
        case 442://司机刷卡
        case 492://司机刷卡
            return this.getDriverSwape(armType);
        case 443://学生刷卡		443
        case 493://司机刷卡
            return this.getStudentSwape(armType);
        case 149://临时路单报警(中石油)
            return this.getTemporaryRoad(armType);
        case 100:
            return this.getAlarm100(armType);
        case 144:
            return this.getAlarm144(armType);
        case 150: //布控人脸识别
            return this.getControlIdentify(armType);
        case 125://	疲劳84220报警
            return this.getFatigue84220(armType);
        case 428: //超速预警
        case 478:
            return this.getVehicleFrequentAlarm(armType);
        case 429: //疲劳驾驶预警
        case 479:
            return this.getOverspeedSignsAlarm(armType);
        case 430: //前撞预警
        case 480:
            return this.getVehicleObstacleAlarm(armType);
        case 431: //车道偏移预警
        case 481:
            return this.getOnlyAlarmType(armType);
        case 432: //胎压预警
        case 482:
            return this.getOnlyAlarmType(armType);
        case 433: //侧翻预警
        case 483:
            return this.getOnlyAlarmType(armType);
        case 326: //ACC信号异常报警(平台)3
        case 376:
            return this.getAccSignal(armType);
        case 327: //位置信息异常报警(平台)
        case 377:
            return this.getAccSignal(armType);
        case 328: //车辆长时异常离线提醒(平台)
        case 378:
            return this.getAccSignal(armType);
        case 712: //道路运输证IC卡模块故障
        case 762:
            return this.getOnlyAlarmType(armType);
        case 713: //违规行驶
        case 763:
            return this.getOnlyAlarmType(armType);
        case 714: //右转盲区异常报警
        case 764:
            return this.getOnlyAlarmType(armType);
        case 333: //区域非法开盖(渣土车项目)
        case 383:
            return this.getMuckTruckAlarmType(armType);
        case 332: //载重超载(渣土车项目)
        case 382:
            return this.getMuckTruckOverload(armType);
        case 348: //区域非法举升(平台)
        case 398:
            return this.getMuckTruckLift(armType);
        case 335: //存储单元故障报警
        case 385:
            return this.getStorageUnitFailureAlarm(armType);
        //出租车新增的相关报警
        case 800: //0位:1：计程计价装置故障(报警800)
        case 850:
        case 801: //1位:1：服务评价器故障（前后排）(报警801)
        case 851:
        case 802: //2位:1：LED 广告屏故障(报警802)
        case 852:
        case 803: //3位:1：LCD显示屏故障(报警803)
        case 853:
        case 804: //4位:1：安全访问模块故障(报警804)
        case 854:
        case 805: //5位:1：巡游车顶灯故障(报警805)
        case 855:
        case 806: //6位:1：连续驾驶超时(报警806)
        case 856:
        case 807:  //7位:1：禁行路段行驶(报警807)
        case 857:
        case 808:  //8位:1：LCD终端故障(报警808)
        case 858:
        case 809:  //10位:1：录音设备故障(报警809)
        case 859:
        case 810:   //11位:1：计程计价装置实时时钟超过规定的误差范围(报警810)
        case 860:
        case 811:   //12位:1：紧急报警按钮故障(报警811)
        case 861:
        case 812:     //13位:1：巡游车不打表营运 / 网约车巡游带客(报警812)
        case 862:
        case 813:     //14位:1：驾驶员人脸识别不匹配报警(报警813)
        case 863:
            return this.getTaxiAlarm(armType);
        case 814:     //14位:1：出租车营运数据上传事件
            return this.getDataUploadEvent();
        case 1000: //正转
        case 1050:
            return this.getForwardAlarm(armType);
        case 1001: //反转
        case 1051:
            return this.getReverseAlarm(armType);
        case 340: //区域聚集报警(平台)
        case 390:
        case 341: //热点区域预警(平台)
        case 391:
        case 342: //热点区域报警(平台)
        case 392:
            return this.getTaxiAreaAlarm(armType);
        case 446:
        case 496:
            return this.getAlarm446(armType);
        case 447:
        case 497:
            return this.getAlarm447(armType);
        case 144://布控车牌识别报警
            return this.getControlVehiAlarm(armType);
        case 343:
            return this.getAlarm343(armType);
        case 820: //篷布状态异常报警
        case 870:
        case 821: //举升状态异常报警
        case 871:
        case 822: //重空载状态异常报警
        case 872:
        case 823: //进出电子围栏报警
        case 873:
        case 824: //举升作弊
        case 874:
        case 825: //篷布作弊
        case 875:
        case 826: //空重车作弊
        case 876:
        case 827: //GPS作弊
        case 877:
        case 828: //ECU作弊
        case 878:
        case 829: //车速线被剪报警
        case 879:
        case 830: //(重车)未密闭行驶报警
        case 880:
        case 831: //非法举升
        case 881:
        case 832: //无证
        case 882:
        case 833: //证件无效
        case 883:
        case 834: //偷运
        case 884:
        case 835: //越界
        case 885:
        case 836: //锁车限制状态
        case 886:
        case 837: //限速限制状态
        case 887:
        case 838: //限举限制状态
        case 888:
            return this.getMuckAreaAlarm(armType);
        case 510: // 人证不符报警
        case 560:
        case 511: // IC卡从业资格证读卡失败报警
        case 561:
        case 512: // 超速报警
        case 562:
        case 513: // 路线偏离报警
        case 563:
        case 514: // 禁行路段/区域报警
        case 564:
        case 515: // 事故报警
        case 565:
        case 516: // 主存储器异常报警
        case 566:
        case 517: // 备用存储器异常报警
        case 567:
        case 518: // 卫星信号异常报警
        case 568:
        case 519: // 通信信号异常报警
        case 569:
        case 520: // 备用电池欠压报警
        case 570:
        case 521: // 备用电池失效报警
        case 571:
        case 522: // IC卡从业资格证模块故障报警
        case 572:
        /* case 523: // 备用电池失效报警
         case 573:
         case 524: // IC卡从业资格证模块故障报警
         case 574:*/
        case 699: // 驾驶员身份比对结果上报
            return this.getHeiLongJiangAlarm(armType);
        case 1101: // GPS中断报警(平台) pamra[0]中断时长， 单位秒
        case 1102:
            return this.getGpsSuspend(armType);
        case 1107: // 途经点(平台) param[0]-位置类型 param[1]-关键点ID
        case 1108:
            return this.getPassPointAlarm(armType);

        case 544:  //到期禁运报警(平台) param[0]:到期类型
            return this.getExpiryAlarm(armType);

        case 1103: // 报警漏报
        case 1104:
        case 1105: // 报警误报
        case 1106:
            return this.getFalsePositiveAlarm(armType);
        case 525://玩手机1级
        case 575://玩手机1级
            ret.strType = rootElement.lang.alarm_name_525 + rootElement.lang.alarm_name_11111;
            return ret;
        case 541://玩手机2级
        case 591://玩手机2级
            ret.strType = rootElement.lang.alarm_name_525 + rootElement.lang.alarm_name_22222;
            return ret;

        case 1226://酒测正常
        case 1276://酒测正常
        case 1227://酒测正常
        case 1277://酒测正常
        case 1228://未完成酒测
        case 1278://未完成酒测
        case 1229://未完成酒测
        case 1279://未完成酒测
        case 1230://酒后驾驶
        case 1280://酒后驾驶
        case 1231://酒后驾驶
        case 1281://酒后驾驶
        case 1232://酒测正常
        case 1282://酒测正常
        case 1233://酒测正常
        case 1283://酒测正常
            return this.getWineTestAlarm(armType);
        case 542://车厢过道行人检测报警 1级
        case 592://车厢过道行人检测报警 1级
            ret.strType = rootElement.lang.alarm_name_542 + rootElement.lang.alarm_name_11111;
            ret.strDesc = this.getVehicleAutoSBAlarm();
            return ret;
        case 543://车厢过道行人检测报警 2级
        case 593://车厢过道行人检测报警 2级
            ret.strType = rootElement.lang.alarm_name_542 + rootElement.lang.alarm_name_22222;
            ret.strDesc = this.getVehicleAutoSBAlarm();
            return ret;

        case 1334:
        case 1384:
            ret.strType = rootElement.lang.alarm_name_1334 + rootElement.lang.alarm_name_11111;
            return ret;
        case 1335:
        case 1385:
            ret.strType = rootElement.lang.alarm_name_1334 + rootElement.lang.alarm_name_22222;
            return ret;
        case 1336:
        case 1386:
            ret.strType = rootElement.lang.alarm_name_1334 + rootElement.lang.alarm_name_33333;
            return ret;
        case 1337:
            ret.strType = rootElement.lang.alarm_name_1337 + rootElement.lang.alarm_name_11111;
            return ret;
        case 1338:
            ret.strType = rootElement.lang.alarm_name_1337 + rootElement.lang.alarm_name_22222;
            return ret;
        case 1339:
            ret.strType = rootElement.lang.alarm_name_1337 + rootElement.lang.alarm_name_33333;
            return ret;
        case 1340:
            ret.strType = rootElement.lang.alarm_name_1340 + rootElement.lang.alarm_name_11111;
            return ret;
        case 1341:
            ret.strType = rootElement.lang.alarm_name_1340 + rootElement.lang.alarm_name_22222;
            return ret;
        case 1342:
            ret.strType = rootElement.lang.alarm_name_1340 + rootElement.lang.alarm_name_33333;
            return ret;
        case 1343:
            ret.strType = rootElement.lang.alarm_name_1343 + rootElement.lang.alarm_name_11111;
            return ret;
        case 1344:
            ret.strType = rootElement.lang.alarm_name_1343 + rootElement.lang.alarm_name_22222;
            return ret;
        case 1345:
            ret.strType = rootElement.lang.alarm_name_1343 + rootElement.lang.alarm_name_33333;
            return ret;
        case 900:
            ret.strType = rootElement.lang.alarm_name_900 + rootElement.lang.alarm_name_11111;
            return ret;
        case 901:
            ret.strType = rootElement.lang.alarm_name_900 + rootElement.lang.alarm_name_22222;
            return ret;
        case 902:
            ret.strType = rootElement.lang.alarm_name_900 + rootElement.lang.alarm_name_33333;
            return ret;
        case 948:
            ret.strType = rootElement.lang.alarm_name_900 + rootElement.lang.alarm_name_44444;
            return ret;
        case 949:
            ret.strType = rootElement.lang.alarm_name_900 + rootElement.lang.alarm_name_55555;
            return ret;
        case 903:
            ret.strType = rootElement.lang.alarm_name_903 + rootElement.lang.alarm_name_11111;
            return ret;
        case 904:
            ret.strType = rootElement.lang.alarm_name_903 + rootElement.lang.alarm_name_22222;
            return ret;
        case 905:
            ret.strType = rootElement.lang.alarm_name_903 + rootElement.lang.alarm_name_33333;
            return ret;
        case 950:
            ret.strType = rootElement.lang.alarm_name_903 + rootElement.lang.alarm_name_44444;
            return ret;
        case 951:
            ret.strType = rootElement.lang.alarm_name_903 + rootElement.lang.alarm_name_55555;
            return ret;
        case 906:
            ret.strType = rootElement.lang.alarm_name_906 + rootElement.lang.alarm_name_11111;
            return ret;
        case 907:
            ret.strType = rootElement.lang.alarm_name_906 + rootElement.lang.alarm_name_22222;
            return ret;
        case 908:
            ret.strType = rootElement.lang.alarm_name_906 + rootElement.lang.alarm_name_33333;
            return ret;
        case 952:
            ret.strType = rootElement.lang.alarm_name_906 + rootElement.lang.alarm_name_44444;
            return ret;
        case 953:
            ret.strType = rootElement.lang.alarm_name_906 + rootElement.lang.alarm_name_55555;
            return ret;
        case 909:
            ret.strType = rootElement.lang.alarm_name_909 + rootElement.lang.alarm_name_11111;
            return ret;
        case 910:
            ret.strType = rootElement.lang.alarm_name_909 + rootElement.lang.alarm_name_22222;
            return ret;
        case 911:
            ret.strType = rootElement.lang.alarm_name_909 + rootElement.lang.alarm_name_33333;
            return ret;
        case 912:
            ret.strType = rootElement.lang.alarm_name_912 + rootElement.lang.alarm_name_11111;
            return ret;
        case 913:
            ret.strType = rootElement.lang.alarm_name_912 + rootElement.lang.alarm_name_22222;
            return ret;
        case 914:
            ret.strType = rootElement.lang.alarm_name_912 + rootElement.lang.alarm_name_33333;
            return ret;
        case 954:
            ret.strType = rootElement.lang.alarm_name_912 + rootElement.lang.alarm_name_44444;
            return ret;
        case 955:
            ret.strType = rootElement.lang.alarm_name_912 + rootElement.lang.alarm_name_55555;
            return ret;
        case 915:
            ret.strType = rootElement.lang.alarm_name_915 + rootElement.lang.alarm_name_11111;
            return ret;
        case 916:
            ret.strType = rootElement.lang.alarm_name_915 + rootElement.lang.alarm_name_22222;
            return ret;
        case 917:
            ret.strType = rootElement.lang.alarm_name_915 + rootElement.lang.alarm_name_33333;
            return ret;
        case 956:
            ret.strType = rootElement.lang.alarm_name_915 + rootElement.lang.alarm_name_44444;
            return ret;
        case 957:
            ret.strType = rootElement.lang.alarm_name_915 + rootElement.lang.alarm_name_55555;
            return ret;
        case 918:
            ret.strType = rootElement.lang.alarm_name_918 + rootElement.lang.alarm_name_11111;
            return ret;
        case 919:
            ret.strType = rootElement.lang.alarm_name_918 + rootElement.lang.alarm_name_22222;
            return ret;
        case 920:
            ret.strType = rootElement.lang.alarm_name_918 + rootElement.lang.alarm_name_33333;
            return ret;
        case 958:
            ret.strType = rootElement.lang.alarm_name_918 + rootElement.lang.alarm_name_44444;
            return ret;
        case 959:
            ret.strType = rootElement.lang.alarm_name_918 + rootElement.lang.alarm_name_55555;
            return ret;
        case 921:
            ret.strType = rootElement.lang.alarm_name_921 + rootElement.lang.alarm_name_11111;
            return ret;
        case 922:
            ret.strType = rootElement.lang.alarm_name_921 + rootElement.lang.alarm_name_22222;
            return ret;
        case 923:
            ret.strType = rootElement.lang.alarm_name_921 + rootElement.lang.alarm_name_33333;
            return ret;
        case 960:
            ret.strType = rootElement.lang.alarm_name_921 + rootElement.lang.alarm_name_55555;
            return ret;
        case 924:
            ret.strType = rootElement.lang.alarm_name_924 + rootElement.lang.alarm_name_11111;
            return ret;
        case 925:
            ret.strType = rootElement.lang.alarm_name_924 + rootElement.lang.alarm_name_22222;
            return ret;
        case 926:
            ret.strType = rootElement.lang.alarm_name_924 + rootElement.lang.alarm_name_33333;
            return ret;
        case 961:
            ret.strType = rootElement.lang.alarm_name_924 + rootElement.lang.alarm_name_44444;
            return ret;
        case 962:
            ret.strType = rootElement.lang.alarm_name_924 + rootElement.lang.alarm_name_55555;
            return ret;
        case 927:
            ret.strType = rootElement.lang.alarm_name_927 + rootElement.lang.alarm_name_11111;
            return ret;
        case 928:
            ret.strType = rootElement.lang.alarm_name_927 + rootElement.lang.alarm_name_22222;
            return ret;
        case 929:
            ret.strType = rootElement.lang.alarm_name_927 + rootElement.lang.alarm_name_33333;
            return ret;
        case 930:
            ret.strType = rootElement.lang.alarm_name_930 + rootElement.lang.alarm_name_11111;
            return ret;
        case 931:
            ret.strType = rootElement.lang.alarm_name_930 + rootElement.lang.alarm_name_22222;
            return ret;
        case 932:
            ret.strType = rootElement.lang.alarm_name_930 + rootElement.lang.alarm_name_33333;
            return ret;
        case 933:
            ret.strType = rootElement.lang.alarm_name_933 + rootElement.lang.alarm_name_11111;
            return ret;
        case 934:
            ret.strType = rootElement.lang.alarm_name_933 + rootElement.lang.alarm_name_22222;
            return ret;
        case 935:
            ret.strType = rootElement.lang.alarm_name_933 + rootElement.lang.alarm_name_33333;
            return ret;
        case 963:
            ret.strType = rootElement.lang.alarm_name_933 + rootElement.lang.alarm_name_44444;
            return ret;
        case 964:
            ret.strType = rootElement.lang.alarm_name_933 + rootElement.lang.alarm_name_55555;
            return ret;
        case 936:
            ret.strType = rootElement.lang.alarm_name_936 + rootElement.lang.alarm_name_11111;
            return ret;
        case 937:
            ret.strType = rootElement.lang.alarm_name_936 + rootElement.lang.alarm_name_22222;
            return ret;
        case 938:
            ret.strType = rootElement.lang.alarm_name_936 + rootElement.lang.alarm_name_33333;
            return ret;
        case 939:
            ret.strType = rootElement.lang.alarm_name_939 + rootElement.lang.alarm_name_11111;
            return ret;
        case 940:
            ret.strType = rootElement.lang.alarm_name_939 + rootElement.lang.alarm_name_22222;
            return ret;
        case 941:
            ret.strType = rootElement.lang.alarm_name_939 + rootElement.lang.alarm_name_33333;
            return ret;
        case 965:
            ret.strType = rootElement.lang.alarm_name_939 + rootElement.lang.alarm_name_44444;
            return ret;
        case 966:
            ret.strType = rootElement.lang.alarm_name_939 + rootElement.lang.alarm_name_55555;
            return ret;
        case 942:
            ret.strType = rootElement.lang.alarm_name_942 + rootElement.lang.alarm_name_11111;
            return ret;
        case 943:
            ret.strType = rootElement.lang.alarm_name_942 + rootElement.lang.alarm_name_22222;
            return ret;
        case 944:
            ret.strType = rootElement.lang.alarm_name_942 + rootElement.lang.alarm_name_33333;
            return ret;
        case 945:
            ret.strType = rootElement.lang.alarm_name_945 + rootElement.lang.alarm_name_11111;
            return ret;
        case 946:
            ret.strType = rootElement.lang.alarm_name_945 + rootElement.lang.alarm_name_22222;
            return ret;
        case 947:
            ret.strType = rootElement.lang.alarm_name_945 + rootElement.lang.alarm_name_33333;
            return ret;
        case 967:
            ret.strType = rootElement.lang.alarm_name_967 + rootElement.lang.alarm_name_11111;
            return ret;
        /*case 637:
            ret.strType = rootElement.lang.alarm_name_967 + rootElement.lang.alarm_name_22222;
            return ret;*/
        case 968:
            ret.strType = rootElement.lang.alarm_name_967 + rootElement.lang.alarm_name_33333;
            return ret;
        case 969:
            ret.strType = rootElement.lang.alarm_name_967 + rootElement.lang.alarm_name_44444;
            return ret;
        case 970:
            ret.strType = rootElement.lang.alarm_name_967 + rootElement.lang.alarm_name_55555;
            return ret;
        case 971:
        case 976:
            ret.strType = rootElement.lang.alarm_name_971 + rootElement.lang.alarm_name_11111;
            return ret;
        case 972:
        case 977:
            ret.strType = rootElement.lang.alarm_name_971 + rootElement.lang.alarm_name_22222;
            return ret;
        case 973:
        case 978:
            ret.strType = rootElement.lang.alarm_name_971 + rootElement.lang.alarm_name_33333;
            return ret;
        case 974:
            ret.strType = rootElement.lang.alarm_name_971 + rootElement.lang.alarm_name_44444;
            return ret;
        case 975:
            ret.strType = rootElement.lang.alarm_name_971 + rootElement.lang.alarm_name_55555;
            return ret;
        case 1211: //盲区监测报警 1级
        case 1212: //盲区监测报警 2级
        case 1213: //盲区监测报警 3级
        case 1214: //限速报警 1级
        case 1215://限速报警 2级
        case 1216://限速报警 3级
        case 1217://限高报警 1级
        case 1218://限高报警 2级
        case 1219://限高报警 3级
        case 1220://限宽报警 1级
        case 1221://限宽报警 2级
        case 1222://限宽报警 3级
        case 1223://限重报警 1级
        case 1224://限重报警 2级
        case 1225://限重报警 3级

        case 1261: //盲区监测报警 1级
        case 1262: //盲区监测报警 2级
        case 1263: //盲区监测报警 3级
        case 1264: //限速报警 1级
        case 1265://限速报警 2级
        case 1266://限速报警 3级
        case 1267://限高报警 1级
        case 1268://限高报警 2级
        case 1269://限高报警 3级
        case 1270://限宽报警 1级
        case 1271://限宽报警 2级
        case 1272://限宽报警 3级
        case 1273://限重报警 1级
        case 1274://限重报警 2级
        case 1275://限重报警 3级
            //其他
            return this.getBeiJingBiaoAlarm(armType);
        case 1234:// 前方盲区报警1级
        case 1284:
            ret.strType = rootElement.lang.alarm_name_1234 + rootElement.lang.alarm_name_11111;
            return ret;
        case 1235:// 前方盲区报警2级
        case 1285:
            ret.strType = rootElement.lang.alarm_name_1234 + rootElement.lang.alarm_name_22222;
            return ret;
        case 1414:// 右侧盲区报警
        case 1464:
            ret.strType = rootElement.lang.alarm_name_1414;
            return ret;
        case 1415:// 车前盲区
        case 1465:
            ret.strType = rootElement.lang.alarm_name_1415;
            return ret;
        case 1400:// 碰撞侧翻报警1级
        case 1450:
            ret.strType = rootElement.lang.alarm_name_1400 + rootElement.lang.alarm_name_11111;
            return ret;
        case 1401:// 碰撞侧翻报警2级
        case 1451:
            ret.strType = rootElement.lang.alarm_name_1400 + rootElement.lang.alarm_name_22222;
            return ret;


        case 1402:// 路口未礼让行人1级
        case 1452:
            ret.strType = rootElement.lang.alarm_name_1402 + rootElement.lang.alarm_name_11111;
            return ret;
        case 1403:// 路口未礼让行人2级
        case 1453:
            ret.strType = rootElement.lang.alarm_name_1402 + rootElement.lang.alarm_name_22222;
            return ret;
        case 1404://  27:IC 卡读卡失败报警
        case 1454:
            ret.strType = rootElement.lang.alarm_name_1404 + rootElement.lang.alarm_name_11111;
            return ret;
        case 1405://  27:IC 卡读卡失败报警
        case 1455:
            ret.strType = rootElement.lang.alarm_name_1404 + rootElement.lang.alarm_name_22222;
            return ret;
        case 545://超过道路承重报警
        case 549://超过车辆额定载重报警
        case 595://超过道路承重报警
        case 599://超过车辆额定载重报警
           /* Param[0] //车辆实际载重 单位10kg，范围0~20000
            Param[1] //额定/限定载重 单位10kg，范围0~20000*/
        case 1237://超过限定高度报警
        case 1287://超过限定高度报警
           /* Param[0] //车身高度 单位毫米，范围0~5000
            Param[1] //道路限高 单位毫米，范围0~5000*/
        case 1238://夜间禁行 1级
        case 1288://夜间禁行 1级
        case 1239://夜间禁行 2级
        case 1289://夜间禁行 2级

        case 1410://夜间禁行持续 1级
        case 1460://夜间禁行持续 1级
        case 1411://夜间禁行持续 2级
        case 1461://夜间禁行持续 2级

            return this.getChuanBiao2021Alarm(armType);

        case 1314:// 车辆异常离线提醒(平台)   param[0]离线时ACC状态 param[1]离线时速度
        case 1364://
            return this.getAbnormalOffline(armType);
        case 384: //报警超时未处理(平台)
            return this.getAlarmTimeoutUnhandled();

        case 1315://超速报警一级 1级
        case 1316://超速报警二级 1级
        case 1317://超速报警三级 2级
        case 1318://超速报警四级 2级
        case 1365://超速报警一级 1级
        case 1366://超速报警二级 1级
        case 1367://超速报警三级 2级
        case 1368://超速报警四级 2级
        case 1346://超速报警五级
        case 1396://超速报警五级
            return this.getOverSpeedAlarmClass(armType);
        case 1319://疲劳驾驶报警一级 1级  param[0]:未用 param[1]连续驾驶时长 单位(秒)
        case 1320://疲劳驾驶报警二级 1级
        case 1321://疲劳驾驶报警三级 2级
        case 1322://疲劳驾驶报警四级 2级
        case 1323://疲劳驾驶报警五级 2级
        case 1369://疲劳驾驶报警一级 1级  param[0]:未用 param[1]连续驾驶时长 单位(秒)
        case 1370://疲劳驾驶报警二级 1级
        case 1371://疲劳驾驶报警三级 2级
        case 1372://疲劳驾驶报警四级 2级
        case 1373://疲劳驾驶报警五级 2级
            return this.getCMSFatigueAlarmClass(armType);

        case 1324://重量增加报警 开始
        case 1374://重量增加报警结束
            return this.getLoadIncreaseAlarm(armType);
        case 1325://重量减少报警
        case 1375://重量减少报警
            return this.getLoadDecreaseAlarm(armType);
        case 1003://电子锁密封故障
        case 1053:
        case 1004://电子锁锁绳错误
        case 1054:
        case 1005://电子锁子锁连接超时
        case 1055:
        case 1006://电子锁封锁打开
        case 1056:
        case 1007://电子锁开盖报警
        case 1057:
        case 1008://电子锁锁链剪断报警
        case 1058:
        case 1009://电子锁开锁报警
        case 1059:
        case 1010://电子锁电量低
        case 1060:
        case 1012://电子锁使用非法卡刷卡
        case 1062:
            return this.getElectronicLocksAlarm(armType);
        case 1429://司机未佩戴口罩报警
        case 1479:
            ret.strType = rootElement.lang.alarm_name_1429;
            return ret;
        case 1430:
        case 1480://疫区进出报警(平台)
            return this.enteringLeavingEpidemicAreaAlarm(armType);
        case 1431:
        case 1481://疫区来车报警(平台)
            return this.carFromEpidemicAreaAlarm(armType);
        default:
            // 不解析 开始 或 结束
            var alarm = null;
            if (this.startAlarm != null) {
                alarm = this.startAlarm;
            }
            if (this.endAlarm != null) {
                alarm = this.endAlarm;
            }
            var ret = {};
            if (rootElement.lang.hasOwnProperty("alarm_name_" + alarm.startType)) {
                ret.strType = rootElement.lang["alarm_name_" + alarm.startType];
            } else {
                ret.strType = rootElement.lang.unknown;
            }
            return ret;
    }
}

/**
 * 获取疲劳驾驶报警(平台产生)
 */
standardAlarm.prototype.getCMSFatigueAlarmClass = function (armType) {
    var strMark = '';
    var strDesc = '';
    var alarm = null;
    if (armType == 1319 || armType == 1320 || armType == 1321 || armType == 1322  || armType == 1323) {
        alarm = this.startAlarm;
        strMark = this.getAlarmStartEnd(1);
    } else {
        alarm = this.endAlarm;
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    //疲劳驾驶报警二级(平台)  param[0]:未用 param[1]连续驾驶时长 单位(秒)
    if (alarm.param2 && alarm.param2 > 0) {
        strDesc += rootElement.lang.driver_time_last + "(" + getTimeDifference4(alarm.param2, true)  + " )";
    }
    ret.strDesc = strDesc;
    ret.strType = rootElement.lang["alarm_name_"+alarm.startType];
    ret.strMark = strMark;
    return ret;
}

/**
 * 重量增加报警
 */
standardAlarm.prototype.getLoadIncreaseAlarm = function (armType) {
    var strMark = '';
    var strDesc = '';
    var alarm = null;
    if (armType == 1324) {
        alarm = this.startAlarm;
        strMark = this.getAlarmStartEnd(1);
    } else {
        alarm = this.endAlarm;
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    //重量增加(平台判断) param[0]:报警前载重 23567=23.567吨, pamra[1]:为增加的重量
    if (alarm.param1 && alarm.param1 > 0) {
        strDesc += rootElement.lang.before_alarm_load_label + alarm.param1 / 1000 + rootElement.lang.muck_ton;
    }

    if (alarm.param2 && alarm.param2 > 0) {
        strDesc += rootElement.lang.weight_increase + alarm.param2 / 1000 + rootElement.lang.muck_ton;
    }
    ret.strType = rootElement.lang.alarm_name_1324;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}

/**
 * 重量增少报警
 */
standardAlarm.prototype.getLoadDecreaseAlarm = function (armType) {
    var strMark = '';
    var strDesc = '';
    var alarm = null;
    if (armType == 1325) {
        alarm = this.startAlarm;
        strMark = this.getAlarmStartEnd(1);
    } else {
        alarm = this.endAlarm;
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    //重量减少(平台判断) param[0]:报警前载重 23567=23.567吨, pamra[1]:为减少的重量
    if (alarm.param1 && alarm.param1 > 0) {
        strDesc += rootElement.lang.before_alarm_load_label + alarm.param1 / 1000 + rootElement.lang.muck_ton;
    }

    if (alarm.param2 && alarm.param2 > 0) {
        strDesc += rootElement.lang.weight_decrease + alarm.param2 / 1000 + rootElement.lang.muck_ton;
    }
    ret.strType = rootElement.lang.alarm_name_1325;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}

/**
 * 获取超速报警
 * alarmInfo:超速率 param[0]速度阀值 param[1]-报警速度 param[2]-速度阙值
 */
standardAlarm.prototype.getOverSpeedAlarmClass = function (armType) {
    var alarm = null;
    var strMark = '';
    var strDesc = [];
    if (armType == 1315 || armType == 1316 || armType == 1317 || armType == 1318 || armType == 1346) {
        alarm = this.startAlarm;
        strMark = this.getAlarmStartEnd(1);
    } else {
        alarm = this.endAlarm;
        strMark = this.getAlarmStartEnd(0);
    }
    // 808解析后面的参数
    // 判断设备类型是不是808
    if (alarm.armIinfo) {
        strDesc.push(rootElement.lang.superrate + ':' + alarm.armIinfo + "%");
    }
    var status = this.getAlarmStatus();
    if (status && status.speed) {
        strDesc.push(rootElement.lang.alarm_speed + '(' + this.getSpeedString(status.speed) + ")");
    }
  /*  if (alarm.param2) {
        strDesc.push(rootElement.lang.alarm_speed + ': ' + this.getSpeedString(alarm.param2));
    }*/

    // 速度阙值
    if (alarm.param3) {
        strDesc.push(rootElement.lang.abnormal_speed + '(' + this.getSpeedString(alarm.param3 * 10.0) + ")");
    }

    var ret = {};
    ret.strType = rootElement.lang["alarm_name_"+alarm.startType];
    ret.strMark = strMark;
    ret.strDesc = strDesc.join(";");
    return ret;
}



/**
 *  报警超时未处理(平台) desc:设备号;原报警guid param0:原报警类型 param1:原报警时间
 */
standardAlarm.prototype.getAlarmTimeoutUnhandled = function () {
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    var param1 = alarm.param1;//原报警类型
    var param2 = alarm.param2;//原报警时间
    var strArea = [];
    if (param1) {
        var ret = this.getFormatMDVRAlarmString(param1);
        strArea.push( ret.strType);
    }
    if (param2) {
        strArea.push(rootElement.lang.labelTime + dateTime2TimeString(param2*1000));
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_name_384;
    ret.strDesc = strArea.join(",");
    return ret;
}


/**
 *  车辆异常离线提醒(平台)   param[0]离线时ACC状态 param[1]离线时速度
 * @param armType
 * @return
 */
standardAlarm.prototype.getAbnormalOffline = function (armType) {
    var strDesc = "";
    var alarm = null;
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    // acc状态
    if (alarm.param1 != null) {
        if (alarm.param1 == 1) {
            strDesc += rootElement.lang.monitor_accOpen ;
        }
        if (alarm.param1 == 0) {
            strDesc += rootElement.lang.monitor_accClose;
        }
    }
    //当前速度
    if (alarm.param2 != null) {
        if (strDesc) {
            strDesc += ";";
        }
        strDesc += rootElement.lang.offline_speed + ":" + this.getSpeedString(alarm.param2);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_name_1314;
    ret.strDesc = strDesc;
    return ret;
}



/**
 * 川标2021协议新增的相关报警解析
 * @param armType
 * @returns {{}}
 */
standardAlarm.prototype.getChuanBiao2021Alarm = function (armType) {
    var strMark = '';
    var strDesc = "";
    var strType = '';
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }

    if (armType == 545 || armType == 549 ||
        armType == 1237 || armType == 1238 || armType == 1239 ||
        armType == 1410 || armType == 1411) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }

    // 超过道路承重报警  和 超过车辆额定载重报警  解析
    if (armType == 545 || armType == 549 ||
        armType == 595 || armType == 599) {
        /* Param[0] //车辆实际载重 单位10kg，范围0~20000
        Param[1] //额定/限定载重 单位10kg，范围0~20000*/
        strType = rootElement.lang.alarm_name_549;
        var paramDesc = rootElement.lang.rated_load;
        if (armType == 545 || armType == 595 ) {
            strType = rootElement.lang.alarm_name_545;
            paramDesc = rootElement.lang.limited_load;
        }
        var param1 = alarm.param1;//车辆实际载重 单位10kg，范围0~20000
        var param2 = alarm.param2;//额定/限定载重 单位10kg，范围0~20000
        var descArray = [];
        if (param1) {
            descArray.push(rootElement.lang.actual_vehicle_load+ param1*10 + "(kg)")
        }
        if (param2) {
            descArray.push(paramDesc+ param2*10 + "(kg)")
        }
        if (descArray.length > 0) {
            strDesc = descArray.join(",");
        }
    }


    if (armType == 1237 || armType == 1287) {
        /* Param[0] //车身高度 单位毫米，范围0~5000
       Param[1] //道路限高 单位毫米，范围0~5000*/
        strType = rootElement.lang.alarm_name_1237;
        var param1 = alarm.param1;//车身高度 单位毫米，范围0~5000
        var param2 = alarm.param2;//道路限高 单位毫米，范围0~5000
        var descArray = [];
        if (param1) {
            descArray.push(rootElement.lang.vehicle_height + param1 + "(mm)")
        }
        if (param2) {
            descArray.push(rootElement.lang.road_limit_height + param2 + "(mm)")
        }
        if (descArray.length > 0) {
            strDesc = descArray.join(",");
        }
    }
    if (armType == 1238 || armType == 1288) {
        strType = rootElement.lang.alarm_name_1238 + rootElement.lang.alarm_name_11111
    }
    if (armType == 1239 || armType == 1289) {
        strType =rootElement.lang.alarm_name_1238 + rootElement.lang.alarm_name_22222
    }
    if (armType == 1410 || armType == 1460) {
        strType = rootElement.lang.alarm_name_1410 + rootElement.lang.alarm_name_11111
    }
    if (armType == 1411 || armType == 1461) {
        strType =rootElement.lang.alarm_name_1410 + rootElement.lang.alarm_name_22222
    }
    var ret = {};
    ret.strType = strType;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}


/**
 * 北京标准新报警
 * @param armType
 * @returns {{}}
 */
standardAlarm.prototype.getBeiJingBiaoAlarm = function (armType) {
    var strMark = '';
    var typeStr = '';
    var isStart = false;
    switch (armType) {
        case 1211: //盲区监测报警 1级
        case 1261: //盲区监测报警 1级
            typeStr = rootElement.lang.alarm_name_1211 + rootElement.lang.alarm_name_11111;
            isStart = (armType == 1211);
            break;
        case 1212: //盲区监测报警 2级
        case 1262: //盲区监测报警 2级
            typeStr = rootElement.lang.alarm_name_1211 + rootElement.lang.alarm_name_22222;
            isStart = (armType == 1212);
            break;
        case 1213: //盲区监测报警 3级
        case 1263: //盲区监测报警 3级
            typeStr = rootElement.lang.alarm_name_1211 + rootElement.lang.alarm_name_33333;
            isStart = (armType == 1213);
            break;
        case 1214: //限速报警 1级
        case 1264: //限速报警 1级
            typeStr = rootElement.lang.alarm_name_1214 + rootElement.lang.alarm_name_11111;
            isStart = (armType == 1214);
            break;
        case 1215://限速报警 2级
        case 1265://限速报警 2级
            typeStr = rootElement.lang.alarm_name_1214 + rootElement.lang.alarm_name_22222;
            isStart = (armType == 1215);
            break;
        case 1216://限速报警 3级
        case 1266://限速报警 3级
            typeStr = rootElement.lang.alarm_name_1214 + rootElement.lang.alarm_name_33333;
            isStart = (armType == 1216);
            break;
        case 1217://限高报警 1级
        case 1267://限高报警 1级
            typeStr = rootElement.lang.alarm_name_1217 + rootElement.lang.alarm_name_11111;
            isStart = (armType == 1217);
            break;
        case 1218://限高报警 2级
        case 1268://限高报警 2级
            typeStr = rootElement.lang.alarm_name_1217 + rootElement.lang.alarm_name_22222;
            isStart = (armType == 1218);
            break;
        case 1219://限高报警 3级
        case 1269://限高报警 3级
            typeStr = rootElement.lang.alarm_name_1217 + rootElement.lang.alarm_name_33333;
            isStart = (armType == 1219);
            break;
        case 1220://限宽报警 1级
        case 1270://限宽报警 1级
            typeStr = rootElement.lang.alarm_name_1220 + rootElement.lang.alarm_name_11111;
            isStart = (armType == 1220);
            break;
        case 1221://限宽报警 2级
        case 1271://限宽报警 2级
            typeStr = rootElement.lang.alarm_name_1220 + rootElement.lang.alarm_name_22222;
            isStart = (armType == 1221);
            break;
        case 1222://限宽报警 3级
        case 1272://限宽报警 3级
            typeStr = rootElement.lang.alarm_name_1220 + rootElement.lang.alarm_name_33333;
            isStart = (armType == 1222);
            break;
        case 1223://限重报警 1级
        case 1273://限重报警 1级
            typeStr = rootElement.lang.alarm_name_1223 + rootElement.lang.alarm_name_11111;
            isStart = (armType == 1223);
            break;
        case 1224://限重报警 2级
        case 1274://限重报警 2级
            typeStr = rootElement.lang.alarm_name_1223 + rootElement.lang.alarm_name_22222;
            isStart = (armType == 1224);
            break;
        case 1225://限重报警 3级
        case 1275://限重报警 3级
            typeStr = rootElement.lang.alarm_name_1223 + rootElement.lang.alarm_name_33333;
            isStart = (armType == 1225);
            break;
    }

    if (isStart) {//开始报警
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = typeStr;
    ret.strMark = strMark;
    return ret;
}


/**
 *  漏报误报
 */
standardAlarm.prototype.getFalsePositiveAlarm = function (armType) {
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    var ret = {};
    if (rootElement.lang.hasOwnProperty("alarm_name_" + alarm.startType)) {
        ret.strType = rootElement.lang["alarm_name_" + alarm.startType];
    }
    // 主动安全开始报警不一样
    var strDesc = "";
    if (alarm.armIinfo != null) {
        if (rootElement.lang.hasOwnProperty("alarm_name_" + alarm.armIinfo)) {
            strDesc = rootElement.lang["alarm_name_" + alarm.armIinfo];
        } else {
            try {
                // 报警类型
                var data = this.getFormatMDVRAlarmString(alarm.armIinfo);
                if (data) {
                    strDesc = data.strType;
                }
            } catch (e) {
            }
        }
        if (strDesc) {
        } else {
            strDesc = rootElement.lang.unknown + "(" + alarm.armIinfo + ")";
        }
    }
    ret.strDesc = strDesc;
    return ret;
}

/**
 *  获取酒测报警
 */
standardAlarm.prototype.getWineTestAlarm = function (armType) {

    var strMark = '';
    var typeStr = '';
    var isStart = false;
    switch (armType) {
        case 1226://酒测正常
        case 1276://酒测正常
            typeStr = rootElement.lang.alarm_name_1226 + rootElement.lang.alarm_name_11111;
            isStart = (armType == 1226);
            break;
        case 1227://酒测正常
        case 1277://酒测正常
            typeStr = rootElement.lang.alarm_name_1226 + rootElement.lang.alarm_name_22222;
            isStart = (armType == 1227);
            break;
        case 1228://未完成酒测
        case 1278://未完成酒测
            typeStr = rootElement.lang.alarm_name_1228 + rootElement.lang.alarm_name_11111;
            isStart = (armType == 1228);
            break;
        case 1229://未完成酒测
        case 1279://未完成酒测
            typeStr = rootElement.lang.alarm_name_1228 + rootElement.lang.alarm_name_22222;
            isStart = (armType == 1229);
            break;
        case 1230://酒后驾驶
        case 1280://酒后驾驶
            typeStr = rootElement.lang.alarm_name_1230 + rootElement.lang.alarm_name_11111;
            isStart = (armType == 1230);
            break;
        case 1231://酒后驾驶
        case 1281://酒后驾驶
            typeStr = rootElement.lang.alarm_name_1230 + rootElement.lang.alarm_name_22222;
            isStart = (armType == 1231);
            break;
        case 1232://醉驾驾驶
        case 1282://醉驾驾驶
            typeStr = rootElement.lang.alarm_name_1232 + rootElement.lang.alarm_name_11111;
            isStart = (armType == 1232);
            break;
        case 1233://醉驾驾驶
        case 1283://醉驾驾驶
            typeStr = rootElement.lang.alarm_name_1232 + rootElement.lang.alarm_name_22222;
            isStart = (armType == 1233);
            break;
    }
    var alarm = null;
    var strDesc = [];
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }

    var param1 = alarm.param1;//酒精单位
    var param2 = alarm.param2;//测试模式
    var param3 = alarm.param3;//酒精含量,万分制,3456=34.56%
    var unitStr = "";
    if (param1 != null) {
        /*
        0；mg/100ml 1；mg/L 2；% 3；g/100mL 4；%. 5；ug/100mL 6；mg/mL 7；g/L 8；mcg/L
        */
        switch (param1) {
            case 0:
                unitStr = "mg/100ml";
                break;
            case 1:
                unitStr = "mg/L";
                break;
            case 2:
                unitStr = "%";
                break;
            case 3:
                unitStr = "g/100mL";
                break;
            case 4:
                unitStr = "%.";
                break;
            case 5:
                unitStr = "ug/100mL";
                break;
            case 6:
                unitStr = "mg/mL";
                break;
            case 7:
                unitStr = "g/L";
                break;
            case 8:
                unitStr = "mcg/L";
                break;
            default:
                break;
        }
        //  strDesc.push("酒精单位:"+unitStr);
    }
    if (param2) {
        /* 1：主动测试 2：被动测试 4：拒绝测试*/
        var type = "";
        switch (param2) {
            case 1:
                type = rootElement.lang.test_type_1;
                break;
            case 2:
                type = rootElement.lang.test_type_2;
                break;
            case 4:
                type = rootElement.lang.test_type_4;
                break;
            default:
                break;
        }
        strDesc.push(rootElement.lang.test_type_label + type);
    }
    if (param3) {
        strDesc.push(rootElement.lang.alcohol_content + (param3 / 10000).toFixed(2) + " " + unitStr);
    }
    if (isStart) {//开始报警
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strDesc = strDesc.join(",");
    ret.strType = typeStr;
    ret.strMark = strMark;
    return ret;
}


/**
 *  途经点(平台) param[0]-位置类型 param[1]-关键点ID
 */
standardAlarm.prototype.getPassPointAlarm = function (armType) {
    var strMark = '';
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    // 途经点(平台) param[0]-位置类型 param[1]-关键点ID param[0]-位置类型 param[1]-区域或者线路ID, desc:区域名称
    var strArea = this.getAreaType(alarm, false);
    var ret = {};
    ret.strType = rootElement.lang.alarm_name_1107;
    ret.strDesc = strArea;
    return ret;
}


/**
 *  到期禁运报警(平台) param[0]:到期类型
 */
standardAlarm.prototype.getExpiryAlarm = function (armType) {
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    var strArea = "";
    var param1 = alarm.param1;//
    if (param1) {
        // bit0 :保险到期 bit1: 行驶证到期 bit2:运输证到期 bit3:维修到期 bit4: 服务到期（预留） bit5:网约车证到期
        var param1Str = [];
        if (Number(param1) & 1 == 1) {
            param1Str.push(rootElement.lang.expiration_reminder_safe);
        }
        if ((Number(param1) >> 1) & 1 == 1) {
            param1Str.push(rootElement.lang.expiration_reminder_driving);
        }
        if ((Number(param1) >> 2) & 1 == 1) {
            param1Str.push(rootElement.lang.expiration_reminder_operation);
        }
        if ((Number(param1) >> 3) & 1 == 1) {
            param1Str.push(rootElement.lang.expiration_reminder_repair);
        }
        if ((Number(param1) >> 4) & 1 == 1) {
            param1Str.push(rootElement.lang.expiration_reminder_pay);
        }
        if ((Number(param1) >> 5) & 1 == 1) {
            param1Str.push(rootElement.lang.onlineCarHailingExpire);
        }

        if (param1Str.length > 0) {
            strArea = rootElement.lang.expiry_type + "(" + param1Str.join(",") + ")";
        }
    }

    var ret = {};
    ret.strType = rootElement.lang.alarm_name_544;
    ret.strDesc = strArea;
    return ret;
}

standardAlarm.prototype.getGpsSuspend = function (armType) {
    var strDesc = [];
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    //GPS中断报警(平台) pamra[0]中断时长， 单位秒
    var param1 = alarm.param1;//
    if (param1) {
        strDesc.push(rootElement.lang.duration_interruption + "(" + param1 + "s)");
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_name_1101;
    ret.strDesc = strDesc.toString();
    return ret;
}


//出租车营运数据上传事件
//报警事件只显示： 上车时间,下车时间,计程公里
standardAlarm.prototype.getDataUploadEvent = function () {
    var strDesc = [];
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    //szDesc:评价选项扩展;载客人数;终端估算里程;营运数据
    //营运数据:上车时间,下车时间,计程公里,空驶里程,燃油附加费,等待计时时间,交易金额,当前车次,区域附加费,价格浮动比例,交易类型,一卡通交易数据
    //报警事件只显示： 上车时间,下车时间,计程公里
    var armDesc = alarm.desc;//
    if (armDesc) {
        var armDescArray = armDesc.split(";");
        if (armDescArray.length > 0) {
            if (armDescArray.length > 3) {
                if (armDescArray[3]) {
                    var armDescsplit = armDescArray[3].split(",");
                    //开始时间 "2020-7-20 14:1"
                    var dateArray = armDescsplit[0];
                    if (dateArray) {
                        strDesc.push(rootElement.lang.tx_getincar_time + ":" + (dateArray + ":00"));
                    }
                    if (armDescsplit.length > 1 && armDescsplit[1]) {
                        // hh-mm
                        strDesc.push(rootElement.lang.tx_getoffcar_time + ":" + (armDescsplit[1] + ":00"));
                    }
                    // XXXXX.X
                    if (armDescsplit.length > 2) {
                        strDesc.push(rootElement.lang.tx_count_miles + ":" + valueConversion(armDescsplit[2] / 10.0));
                    }
                }
            }
        }
    }
    var ret = {};
    ret.strType = rootElement.lang.taxi_operational_data_upload_event;
    ret.strDesc = strDesc.toString();
    return ret;
}


/**
 *    存储单元故障报警
 */
standardAlarm.prototype.getStorageUnitFailureAlarm = function (armType) {
    var strMark = '';
    var strDesc = "";
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    if (armType == 335) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var param1 = alarm.param1;//
//	 param[0] 存储器掩码 按位 BIT0-BIT11：1-12主存储器 BIT12-BIT15：1-4灾备存储， 相应为1表示故障

    if (param1) {
        var main = [];
        var disaster = [];
        for (var i = 0; i < 16; i++) {
            if (i > 11) {
                if ((param1 >> i) & 1 == 1) {
                    disaster.push(i - 11)
                }
            } else {
                if ((param1 >> i) & 1 == 1) {
                    main.push(i + 1)
                }
            }
        }
        if (main.length > 0) {
            strDesc += rootElement.lang.disk_primary_storage + "(" + main.toString() + ")";
        }
        if (disaster.length > 0) {
            if (strDesc) {
                strDesc += ",";
            }
            strDesc += rootElement.lang.disk_disaster_recovery + "(" + disaster.toString() + ")";
        }
    }
    var ret = {};
    ret.strType = rootElement.lang.hardDiskErrorReport;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}

/**
 *    载重超载(平台)
 */
standardAlarm.prototype.getMuckTruckOverload = function (armType) {
    var strMark = '';
    var strDesc = [];
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    if (armType == 332) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var param1 = alarm.param1;//载重量阈值 23567=23.567吨
    var param2 = alarm.param2;//当前载重量
    if (param2) {
        strDesc.push(rootElement.lang.muck_weight_current + (param2 / 1000).toFixed(3) + rootElement.lang.muck_ton);
    }
    if (param1) {
        strDesc.push(rootElement.lang.muck_weight_limit + (param1 / 1000).toFixed(3) + rootElement.lang.muck_ton);
    }
    var ret = {};
    ret.strType = rootElement.lang.muck_truck_overload_alarm;
    ret.strMark = strMark;
    ret.strDesc = strDesc.join(",");
    return ret;
}


/**
 *    区域非法开盖(平台)
 */
standardAlarm.prototype.getMuckTruckAlarmType = function (armType) {
    var strMark = '';
    var strDesc = "";
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    if (armType == 333) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    //	param[0]-位置类型 param[1]-区域或者线路ID
    if (alarm.param1 && alarm.param1 == 1) {
        alarm.param1 = 10;
    }
    var strArea = this.getAreaType(alarm, true);
    var ret = {};
    ret.strType = rootElement.lang.muck_truck_cover_alarm;
    ret.strMark = strMark;
    ret.strDesc = strArea;
    return ret;
}

/**
 *   区域非法举升(平台)
 */
standardAlarm.prototype.getMuckTruckLift = function (armType) {
    var strMark = '';
    var strDesc = "";
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    if (armType == 348) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    // 348 区域非法举升(渣土车项目) param[0]-位置类型 param[1]-区域或者线路ID, desc:区域名称
    var strArea = this.getAreaType(alarm, true);
    var ret = {};
    ret.strType = rootElement.lang.muck_truck_lift_alarm;
    ret.strMark = strMark;
    ret.strDesc = strArea;
    return ret;
}

/**
 *    黑龙江新增报警解析
 */
standardAlarm.prototype.getHeiLongJiangAlarm = function (armType) {
    var strDesc = [];
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    // 报警名称和报警开始结束
    var strType_ = "";
    var strMark = '';
    strMark = this.getAlarmStartEnd(0);
    var type = alarm.startType;
    if (alarm.isStart()) {
        strMark = this.getAlarmStartEnd(1);
    }
    strType_ = rootElement.lang["alarm_name_" + type];
    //  黑标 510-522 param0:是否有效提醒驾驶员
    // 513 //路线偏离报警           param1:路线ID
    // 514 //禁行路段/区域报警       param1:路线ID param2:禁行类型
    // 510 //人证不符报警        szImgFile: 附件数量,从业资格证编码
    // 511 //IC 卡从业资格证读卡失败报警        szImgFile: 附件数量,从业资格证编码
    // 是否有效提醒驾驶员
    if (armType != 699) {
        if (this.isHeiLongJiang(alarm.desc)) {
            strDesc.push(this.getDriverRemindHBAlarm());
        }
    }
    switch (armType) {
        case 510:
        case 560:
        case 511:
        case 561:
            if (alarm.imgFile && alarm.imgFile != "") {//
                var infos = alarm.imgFile.split(',')
                /* if (infos && infos.length > 0) {
                      strDesc += rootElement.lang.number_of_attachments + "：" + infos[0] + ";";
                  }*/
                if (infos && infos.length > 1 && infos[1]) {
                    strDesc.push(rootElement.lang.qualificationCertificateCoding + infos[1]);
                }
            }
            break;
        case 513:
        case 563:
        case 514:
        case 564:
            var desc_ = "";
            if (armType == 514 || armType == 564) {
                if (alarm.param3 == 1) {
                    desc_ += rootElement.lang.alarm_forbidden_area;
                } else {
                    desc_ += rootElement.lang.alarm_forbidden_road;
                }
            } else {
                desc_ += rootElement.lang.alarm_route_name;
            }
            desc_ += '(' + this.getAreaName(alarm.param2, alarm) + ')';
            strDesc.push(desc_);
            break;
        case 699:
            //AlarmInfo:0:识别失败 1:识别成功 param[0]:识别对比度
            //param[1]:比对类型(注意:参数不一致)
            //param[2]:识别失败时表示失败类型 21：人证不符 22：比对超时 23：无指定人脸信息(提示:新增3种类型,用来区分原来的失败类型)
            //desc:主动安全报警标识号
            //szImgFile:从业资格证编码;驾驶员人脸信息ID(注意:参数不一致)
            var param2 = alarm.param2;
            if (param2 != null) {
                switch (Number(param2)) {
                    case 0:
                        strDesc.push(rootElement.lang.card_comparison);
                        break;
                    case 1:
                        strDesc.push(rootElement.lang.inspection_comparison);
                        break;
                    case 2:
                        strDesc.push(rootElement.lang.dynamic_comparison);
                        break;
                    default:
                        break;
                }
            }
            if (alarm.armIinfo != null) {
                if (alarm.armIinfo == 1) {
                    strDesc.push(rootElement.lang.net_alarm_type_sb_driver_identification_through);
                } else {
                    strDesc.push(rootElement.lang.net_alarm_type_sb_driver_identification_notThrough);
                }
                if (alarm.armIinfo != 1) {
                    var param3 = alarm.param3;
                    if (0 == param3) {
                        strDesc.push(rootElement.lang.monitor_invalid);
                    }
                    if (2 == param3) {
                        strDesc.push(rootElement.lang.net_alarm_type_sb_driver_identification_unknown);
                    }
                    if (3 == param3) {
                        strDesc.push(rootElement.lang.net_alarm_type_sb_driver_identification_notCompare);
                    }
                    if (10 == param3) {
                        strDesc.push(rootElement.lang.driver_identification_event_matching_success);
                    }
                    if (11 == param3) {
                        strDesc.push(rootElement.lang.driver_identification_event_matching_fail);
                    }
                    if (12 == param3) {
                        strDesc.push(rootElement.lang.driver_identification_event_time_out);
                    }
                    if (13 == param3) {
                        strDesc.push(rootElement.lang.driver_identification_event_not_enabled);
                    }
                    if (14 == param3) {
                        strDesc.push(rootElement.lang.driver_identification_event_connection_abnormality);
                    }
                    if (15 == param3) {
                        strDesc.push(rootElement.lang.driver_identification_event_no_specified_face);
                    }
                    if (16 == param3) {
                        strDesc.push(rootElement.lang.driver_identification_event_unmanned_face_library);
                    }
                    if (21 == param3) {
                        strDesc.push(rootElement.lang.personal_identification);
                    }
                    if (22 == param3) {
                        strDesc.push(rootElement.lang.match_timeout);
                    }
                    if (23 == param3) {
                        strDesc.push(rootElement.lang.no_face_nformation);
                    }
                }
                // 相似度
                if (alarm.armIinfo != -2 && alarm.armIinfo != -3 && alarm.param1 != null) {
                    strDesc.push(rootElement.lang.similarity + "" + (alarm.param1 / 100).toFixed(2) + "%");
                }
            }
            break;
        default:
            break;
    }
    var ret = {};
    ret.strType = strType_;
    ret.strMark = strMark;
    ret.strDesc = strDesc.join(";");
    return ret;
}

/**
 *    渣土车相关区域平台报警 (占时只解析区域名称)
 */
standardAlarm.prototype.getMuckAreaAlarm = function (armType) {
    var strMark = '';
    var strDesc = "";
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }

    switch (armType) {
        case 820: //篷布状态异常报警
        case 821: //举升状态异常报警
        case 822: //重空载状态异常报警
        case 823: //进出电子围栏报警
        case 824: //举升作弊
        case 825: //篷布作弊
        case 826: //空重车作弊
        case 827: //GPS作弊
        case 828: //ECU作弊
        case 829: //车速线被剪报警
        case 830: //(重车)未密闭行驶报警
        case 831: //非法举升
        case 832: //无证
        case 833: //证件无效
        case 834: //偷运
        case 835: //越界
        case 836: //锁车限制状态
        case 837: //限速限制状态
        case 838: //限举限制状态
            strMark = this.getAlarmStartEnd(1);
            break;
        default:
            strMark = this.getAlarmStartEnd(0);
            break;
    }


    var strType_ = "";
    switch (armType) {
        case 820: //篷布状态异常报警
        case 870:
            strType_ = rootElement.lang.alarm_name_820;
            break;
        case 821: //举升状态异常报警
        case 871:
            strType_ = rootElement.lang.alarm_name_821;
            break;
        case 822: //重空载状态异常报警
        case 872:
            strType_ = rootElement.lang.alarm_name_822;
            break;
        case 823: //进出电子围栏报警
        case 873:
            strType_ = rootElement.lang.alarm_name_823;
            break;
        case 824: //举升作弊
        case 874:
            strType_ = rootElement.lang.alarm_name_824;
            break;
        case 825: //篷布作弊
        case 875:
            strType_ = rootElement.lang.alarm_name_825;
            break;
        case 826: //空重车作弊
        case 876:
            strType_ = rootElement.lang.alarm_name_826;
            break;
        case 827: //GPS作弊
        case 877:
            strType_ = rootElement.lang.alarm_name_827;
            break;
        case 828: //ECU作弊
        case 878:
            strType_ = rootElement.lang.alarm_name_828;
            break;
        case 829: //车速线被剪报警
        case 879:
            strType_ = rootElement.lang.alarm_name_829;
            break;
        case 830: //(重车)未密闭行驶报警
        case 880:
            strType_ = rootElement.lang.alarm_name_830;
            break;
        case 831: //非法举升
        case 881:
            strType_ = rootElement.lang.alarm_name_831;
            break;
        case 832: //无证
        case 882:
            strType_ = rootElement.lang.alarm_name_832;
            break;
        case 833: //证件无效
        case 883:
            strType_ = rootElement.lang.alarm_name_833;
            break;
        case 834: //偷运
        case 884:
            strType_ = rootElement.lang.alarm_name_834;
            break;
        case 835: //越界
        case 885:
            strType_ = rootElement.lang.alarm_name_835;
            break;
        case 836: //锁车限制状态
        case 886:
            strType_ = rootElement.lang.alarm_name_836;
            break;
        case 837: //限速限制状态
        case 887:
            strType_ = rootElement.lang.alarm_name_837;
            break;
        case 838: //限举限制状态
        case 888:
            strType_ = rootElement.lang.alarm_name_838;
            break;
    }

    // 340      //区域聚集报警(平台)param[0]-位置类型 param[1]-区域或者线路ID param[2]-数量阀值 param[3]-报警车辆数量 desc:区域名称
    // 341      //热点区域预警(平台) 同报警参数
    // 342      //热点区域报警(平台)param[0]-位置类型 param[1]-区域或者线路ID
    //param[2]-(低16位)空车数量阀值/(高16位)停运数量阀值 param[3]-(低16位)报警空车数量/(高16位)报警停运数量 desc:区域名称  Gps.nJingDu:报警空车数量
    var alarmDesc = [];
    var param1 = alarm.param1;
    var param2 = alarm.param2;
    var param3 = alarm.param3;//秒
    switch (armType) {
        // 渣土车相关报警,报警结束类型在开始类型基础上加50,此处不增加报警结束定义
        // case StandardDeviceAlarm.NET_ALARM_TYPE_ZTC_IN_FENCE:
        // param[0]电子围栏类型 param[1]电子围栏ID param[2]方向(0=进,1=出)
        // case StandardDeviceAlarm.NET_ALARM_TYPE_ZTC_LOCK_CAR_LIMIT:
        // param0:锁车原因,参考GPS的uiZtcCarLockReason定义
        // 0：未锁车 1：平台下发锁车 8：身份验证未通过锁车
        // case StandardDeviceAlarm.NET_ALARM_TYPE_ZTC_SPEED_LIMIT:
        // param0:限速原因,参考GPS的uiZtcSpeedLimitReason定义
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
        // case StandardDeviceAlarm.NET_ALARM_TYPE_ZTC_LIFT_LIMIT:
        // param0:限举原因,参考GPS的uiZtcLiftLimitReason定义
        //0：未限举
        //1：平台下发限举
        //2：重车不在指定区域限举(在非指定区域限举)
        //3：无证进入工地限举
        //4：无证进入消纳场限举
        case 838:
        case 888:
            if (param1 != null) {
                var reason = "";
                switch (Number(param1)) {
                    case 0:
                        reason = rootElement.lang.unrestricted;
                        break;
                    case 1:
                        reason = rootElement.lang.platform_issued_restrictions;
                        break;
                    case 2:
                        reason = rootElement.lang.heavy_vehicles_restrictions;
                        break;
                    case 3:
                        reason = rootElement.lang.undocumented_entry_restrictions;
                        break;
                    case 4:
                        reason = rootElement.lang.undocumented_entry_consumer_restrictions;
                        break;
                    default:
                        break;
                }
                if (reason) {
                    alarmDesc.push(rootElement.lang.limit_lift_reason + ":" + reason);
                }
            }
            break;
        case 837:
        case 887:
            if (param1 != null) {
                var reason = "";
                switch (Number(param1)) {
                    case 0:
                        reason = rootElement.lang.unlimited_speed;
                        break;
                    case 1:
                        reason = rootElement.lang.platform_limited_speed;
                        break;
                    case 2:
                        reason = rootElement.lang.heavy_vehicles_limited_speed;
                        break;
                    case 3:
                        reason = rootElement.lang.heavy_vehicles_overspeed;
                        break;
                    case 4:
                        reason = rootElement.lang.satellite_signals_blocked;
                        break;
                    case 5:
                        reason = rootElement.lang.undocumented_entry_limited_speed;
                        break;
                    case 7:
                        reason = rootElement.lang.gnss_limited_speed;
                        break;
                    case 9:
                        reason = rootElement.lang.g_sensor_limited_speed;
                        break;
                    case 15:
                        reason = rootElement.lang.sim_limited_speed;
                        break;
                    case 16:
                        reason = rootElement.lang.camera_limited_speed;
                        break;
                    case 21:
                        reason = rootElement.lang.area_limited_speed;
                        break;
                    case 23:
                        reason = rootElement.lang.heavy_certificate_limited_speed;
                        break;
                    default:
                        break;
                }
                if (reason) {
                    alarmDesc.push(rootElement.lang.limit_speed_reason + ":" + reason);
                }
            }
            break;
        case 823:
        case 873:
            //   //param[0]电子围栏类型 param[1]电子围栏ID param[2]方向(0=进,1=出)
            // unsigned char ucZtcEleFenceType; //电子围栏类型 1：工地；2：禁区；3：消纳场；4：限速圈；5：停车场；6：路线
            var status = "";
            if (param1 != null) {
                switch (param1) {
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
            }
            if (status) {
                alarmDesc.push(rootElement.lang.electronic_fence_type + ":" + status);
            }
            if (param2 != null) {
                alarmDesc.push(rootElement.lang.electronic_fence_id + ":" + param2);
            }
            // normal.push("电子围栏类型:"+status);
            // unsigned char ucZtcEleFenceDirection; //电子围栏方向 (0：进；    1：出)
            var fenceDirection = "";
            switch (param3) {
                case 1:
                    fenceDirection = rootElement.lang.out;
                    break;
                case 0:
                    fenceDirection = rootElement.lang.into;
                    break;
                default:
                    break;
            }
            if (fenceDirection) {
                alarmDesc.push(rootElement.lang.direction + ":" + fenceDirection);
            }
            break;
        case 836:
        case 886:
            if (param1 != null) {
                var reason = "";
                switch (Number(param1)) {
                    case 0:
                        reason = rootElement.lang.unlock_vehicle;
                        break;
                    case 1:
                        reason = rootElement.lang.platform_issued_unlock_vehicle;
                        break;
                    case 8:
                        reason = rootElement.lang.authentication_unlock_vehicle;
                        break;
                    default:
                        break;
                }
                if (reason) {
                    alarmDesc.push(rootElement.lang.lock_vehicle_reason + ":" + reason);
                }
            }
            break;
        default:
            break;
    }
    var ret = {};
    ret.strType = strType_;
    ret.strMark = strMark;
    ret.strDesc = alarmDesc.toString();
    return ret;
}

/**
 *    出租车相关区域平台报警
 */
standardAlarm.prototype.getTaxiAreaAlarm = function (armType) {
    var strMark = '';
    var strDesc = "";
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    if (armType == 340 || armType == 341 || armType == 342) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }

    var strType_ = "";
    switch (armType) {
        case 340:
        case 390:
            strType_ = rootElement.lang.alarm_name_340;
            break;
        case 341:
        case 391:
            strType_ = rootElement.lang.alarm_name_341;
            break;
        case 342:
        case 392:
            strType_ = rootElement.lang.alarm_name_342;
            break;
    }

    // 340		//区域聚集报警(平台)param[0]-位置类型 param[1]-区域或者线路ID param[2]-数量阀值 param[3]-报警车辆数量 desc:区域名称
    // 341		//热点区域预警(平台) 同报警参数
    // 342		//热点区域报警(平台)param[0]-位置类型 param[1]-区域或者线路ID
    //param[2]-(低16位)空车数量阀值/(高16位)停运数量阀值 param[3]-(低16位)报警空车数量/(高16位)报警停运数量 desc:区域名称  Gps.nJingDu:报警空车数量
    var alarmDesc = [];
    if (alarm.param1 && alarm.param1 == 1) {
        alarm.param1 = 10;
    }
    var strArea = this.getAreaType(alarm, true);
    if (strArea) {
        alarmDesc.push(strArea);
    }
    switch (armType) {
        case 340:
        case 390:
            // 区域名称(广东深圳市),位置类型(多边形区域),车辆聚集数目:3,车辆数目阈值:3
            if (alarm.param4) {
                alarmDesc.push(rootElement.lang.gather_alarm_vehicle_number + ":" + alarm.param4);
                if (alarm.param3 != null) {
                    alarmDesc.push(rootElement.lang.gather_alarm_judge_vehicle_number + ":" + alarm.param3);
                }
            }
            break;
        case 341:
        case 391:
        case 342:
        case 392:
            //区域名称(广东深圳市),位置类型(多边形区域),空车数目:2,空车数目阈值:2,停运数目:0,停运数目阈值:2
            if (alarm.param3 != null && alarm.param4 != null) {
                var empty_ = alarm.param4 & 0xFFFF;
                if (empty_) {
                    alarmDesc.push(rootElement.lang.gather_alarm_empty_vehicle_number + ":" + empty_);
                    //param[2]-(低16位)空车数量阀值/(高16位)停运数量阀值
                    empty_ = alarm.param3 & 0xFFFF;
                    alarmDesc.push(rootElement.lang.gather_judge_empty_vehicle_number + ":" + empty_);
                }
                var stop_ = (alarm.param4 >> 16) & 0xFFFF;
                if (stop_) {
                    alarmDesc.push(rootElement.lang.gather_alarm_weigth_vehicle_number + ":" + stop_);
                    stop_ = (alarm.param3 >> 16) & 0xFFFF;
                    alarmDesc.push(rootElement.lang.gather_judge_weigth_vehicle_number + ":" + stop_);
                }
            }
            break;
    }
    //解析描述信息： 区域，3辆车，车辆1，车辆2，车辆3
    var ret = {};
    ret.strType = strType_;
    ret.strMark = strMark;
    ret.strDesc = alarmDesc.toString();
    return ret;
}


standardAlarm.prototype.getAccSignal = function (armType) {
    var alarm = null;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    var strDesc = "";
    var strType = '';
    var strMark = '';
    if (armType == 326 || armType == 327 || armType == 328) {//报警开始
        strMark = this.getAlarmStartEnd(1);
    } else if (armType == 376 || armType == 377 || armType == 378) {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    switch (armType) {
        case 326:
        case 376:
            strType = rootElement.lang.acc_signal_abnormal;
            break;
        case 327:
        case 377:
            strType = rootElement.lang.position_abnormal_alarm;
            break;
        case 328:
        case 378:
            strType = rootElement.lang.offline_abnormal_alarm;
            break;
        default:
            break;
    }
    var armInfo = alarm.param3;//秒 时间戳
    var param = alarm.param1;//持续时间阙值 秒
    if (armType == 326 || armType == 376) {
        if (armInfo != null) {
            strDesc += rootElement.lang.abnormal_start_time + ": " + dateFormat2TimeString(new Date((armInfo * 1000))) + ",";
        }
        if (param && param > 0) {
            strDesc += rootElement.lang.abnormal_last_time_threshold + ": " + getTimeDifference4(param * 60, true) + ";";
        }
    } else {
        if (param && param > 0) {
            strDesc += rootElement.lang.abnormal_last_time_threshold + ": " +  getTimeDifference4(param * 60, true) + ";";
        }
    }

    if (armType == 328 || armType == 378) {
        // #define GPS_ALARM_TYPE_CMS_ABNORMAL_OFFLINE 328 //车辆长时异常离线提醒(平台) param0持续时间阈值(分钟), Param1离线时长(分钟)param2最后在线时间UTC
        var param2 = alarm.param2;//Param1离线时长(分钟)
        if (param2 && param2 > 0) {
            strDesc += rootElement.lang.report_last_time + ": " +  getTimeDifference4(param2 * 60, true) + ";";
        }
        var param3 = alarm.param3;//Param1离线时长(分钟)
        if (param3 && param3 > 0) {
            strDesc += rootElement.lang.report_nocard_alarm_time + ": " +  dateTime2TimeString(param3 * 1000) + ";";
        }
    }

    if ((armType == 326 || armType == 376) && alarm.param2) {
        var status = this.getAlarmStatus();
        if (status && status.speed) {
            strDesc += rootElement.lang.alarm_current_speed + ":" + this.getSpeedString(status.speed) + ",";
        } else {
            strDesc += rootElement.lang.alarm_current_speed + ":" + this.getSpeedString(0) + ",";
        }
        //p2 速度阙值
        strDesc += rootElement.lang.alarm_speed_threshold + ":" + this.getSpeedString(alarm.param2 * 10) + ";";
    }


    ret.strMark = strMark;
    ret.strType = strType;
    ret.strDesc = strDesc;
    return ret;

}


standardAlarm.prototype.getFatigue84220 = function (armType) {
    var strMark = '';
    var typeStr = rootElement.lang.fatigue84220_alarm;//报警类型
    var strDesc = '';//报警信息
    var startTime = "";
    var isAlarmEnd = false;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
    //疲劳84220报警 AlarmInfo 1,累计行驶8小时 2,白天连续行驶4小时 3,夜晚连续行驶2小时
    var param = alarm.armIinfo;
    if (param) {
        if (param == 1) {
            strDesc = "累计行驶8小时";
        } else if (param == 2) {
            strDesc = "白天连续行驶4小时";
        } else if (param == 3) {
            strDesc = "夜晚连续行驶2小时";
        }
    }
    var ret = {};
    ret.strType = typeStr;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    return ret;
}


/**
 *    未复位行车
 */
standardAlarm.prototype.getTemporaryRoad = function (armType) {
    var strMark = '';
    var typeStr = rootElement.lang.alarm_name_149;//报警类型
    var strDesc = '';//报警信息
    var startTime = "";
    var isAlarmEnd = false;
    if (this.startAlarm != null) {
        alarm = this.startAlarm;
    }
    if (this.endAlarm != null) {
        alarm = this.endAlarm;
    }
//param[0]:0位 时间超时 1位:距离超时 2位:表示报警结束
//	szDesc:开始时间|规则名称|统计时间,时间阀值;里程,距离阀值
    var param = alarm.param1;
    if (param) {
        if ((param & 4) > 0) {
            isAlarmEnd = true;
        }
        var szDesc = alarm.desc;
        if (szDesc != null) {
            if (szDesc) {
                var szDesc_ = szDesc.split('|')
                startTime = szDesc_[0];//开始时间
                if (szDesc_.length > 1) {
                    typeStr = szDesc_[1];//规则名称
                }

                if (szDesc_.length > 2) {
                    var infos_ = szDesc_[2].split(';')//开始时间|规则名称|统计时间,时间阀值;里程,距离阀值
                    if (infos_ && infos_.length > 0) {
                        var realTime = "";
                        var ruleTime = "";
                        var realMile = "";
                        var ruleMile = "";
                        if ((param & 3) == 3) {
                            realTime = infos_[0].split(",")[0];
                            ruleTime = infos_[0].split(",")[1];
                            if (infos_.length > 1) {
                                realMile = infos_[1].split(",")[0];
                                ruleMile = infos_[1].split(",")[1];
                            }
                        } else if ((param & 2) == 2) {//行驶超距
                            if (infos_.length > 1) {
                                realMile = infos_[1].split(",")[0];
                                ruleMile = infos_[1].split(",")[1];
                            } else {
                                realMile = infos_[0].split(",")[0];
                                ruleMile = infos_[0].split(",")[1];
                            }
                        } else if ((param & 1) == 1) {//行驶超时
                            realTime = infos_[0].split(",")[0];
                            ruleTime = infos_[0].split(",")[1];
                        }
                        if (realTime && ruleTime) {
                            strDesc +=  rootElement.lang.driving_timeout + ": " + rootElement.lang.estimated_duration + "(" + ruleTime +
                                rootElement.lang.second +")," +  rootElement.lang.actual_timeconsuming  + "(" + realTime +rootElement.lang.second +")";
                        }
                        if (realMile && ruleMile) {
                            if (strDesc) {
                                strDesc += ";"
                            }
                            strDesc += rootElement.lang.driving_over_distance + ":" + rootElement.lang.expected_to_drive + "(" + ruleMile + rootElement.lang.mark_banJing
                                + ")," + rootElement.lang.actual_driving + "(" + realMile + rootElement.lang.mark_banJing + ")";
                        }
                    }
                }
            }
        }
    }


    var ret = {};
    ret.strType = typeStr;
    ret.strMark = strMark;
    ret.strDesc = strDesc;
    ret.isAlarmEnd = isAlarmEnd;//是否结束打卡
    ret.startTime = startTime;
    return ret;

}


/**
 *    未复位行车
 */
standardAlarm.prototype.getUnresetDriving = function (armType) {
    var strMark = '';
    if (armType == 413) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = "未复位行车";
    ret.strMark = strMark;
    return ret;
}

/**
 *    无法识别卡
 */
standardAlarm.prototype.getNotRecognized = function (armType) {
    var strMark = '';
    if (armType == 412) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = "无法识别卡";
    ret.strMark = strMark;
    return ret;
}

/**
 *    未插卡
 */
standardAlarm.prototype.getUnplugged = function (armType) {
    var strMark = '';
    if (armType == 411) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = "未插卡";
    ret.strMark = strMark;
    return ret;
}

/**
 *    GPS漂移(平台)
 */
standardAlarm.prototype.getGpsDrift = function (armType) {
    var strMark = '';
    if (armType == 312) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = "GPS漂移(平台)";
    ret.strMark = strMark;
    return ret;
}

/**
 *    轨迹不连续报警(平台)
 */
standardAlarm.prototype.getGpsDiscontinuous = function (armType) {
    var strMark = '';
    if (armType == 313) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = "轨迹不连续报警(平台)";
    ret.strMark = strMark;
    return ret;
}

/**
 * 正转
 * @param armType
 */
standardAlarm.prototype.getForwardAlarm = function (armType) {
    var strMark = '';
    if (armType == 1000) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_name_1000;
    ret.strMark = strMark;
    return ret;
}


/**
 * 反转
 * @param armType
 */
standardAlarm.prototype.getReverseAlarm = function (armType) {
    var strMark = '';
    if (armType == 1001) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_name_1001;
    ret.strMark = strMark;
    return ret;
}

/**
 * 急弯/S弯报警
 * @param armType
 */
standardAlarm.prototype.getAlarm446 = function (armType) {
    var strMark = '';
    if (armType == 446) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_name_446_default;
    ret.strMark = strMark;
    return ret;
}


/**
 * 激烈颠簸
 * @param armType
 */
standardAlarm.prototype.getAlarm447 = function (armType) {
    var strMark = '';
    if (armType == 447) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_name_447_default;
    ret.strMark = strMark;
    return ret;
}

/**
 * 非法驾驶员报警
 * @param armType
 */
standardAlarm.prototype.getAlarm343 = function (armType) {
    var strMark = '';
    if (armType == 343) {
        strMark = this.getAlarmStartEnd(1);
    } else {
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    ret.strType = rootElement.lang.alarm_name_343;
    ret.strMark = strMark;
    ret.strDesc = rootElement.lang.driverLicenseExpires;
    return ret;
}


/**
 * 电子锁
 */
standardAlarm.prototype.getElectronicLocksAlarm = function (armType) {
    var strMark = '';
    var alarm = null;
    if ([1003,1004,1005,1006,1007,1008,1009,1010,1012].contains(armType)) {
        alarm = this.startAlarm;
        strMark = this.getAlarmStartEnd(1);
    } else {
        alarm = this.endAlarm;
        strMark = this.getAlarmStartEnd(0);
        armType -= 50;
    }
    var ret = {};
    var desc = [];
    if(alarm.armIinfo){
        desc.push(rootElement.lang.child_lock + alarm.armIinfo);
    }else if(alarm.armIinfo === 0){
        desc.push(rootElement.lang.main_lock);
    }
    desc.push(rootElement.lang.lock_id + '：' + alarm.desc);
    desc.push(rootElement.lang.swipe_card_number + '：' + alarm.imgFile);

    ret.strType = rootElement.lang['alarm_name_' + armType];
    ret.strMark = strMark;
    ret.strDesc = desc.join(',');
    return ret;
}



/**
 * 疫区进出报警(平台)
 */
standardAlarm.prototype.enteringLeavingEpidemicAreaAlarm = function (armType) {
    var strMark = '';
    var strDesc = [];
    var alarm = null;
    if (armType == 1430) {
        alarm = this.startAlarm;
        strMark = this.getAlarmStartEnd(1);
    } else {
        alarm = this.endAlarm;
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    if (alarm.armIinfo > 0) {
        strDesc.push('风险等级：' + (alarm.armIinfo == 1 ? rootElement.lang.medium_risk : rootElement.lang.high_risk))
    }
    if(alarm.param1){
        var mapMark = rootElement.mapMarkManager.getMapMark(alarm.param1);
        if(mapMark){
            strDesc.push(' 区域名称：' + mapMark.name);
        }
    }
    ret.strType = rootElement.lang.alarm_name_1430;
    ret.strMark = strMark;
    ret.strDesc = strDesc.join(',');
    return ret;
}


/**
 * 疫区进出报警(平台)
 */
standardAlarm.prototype.carFromEpidemicAreaAlarm = function (armType) {
    var strMark = '';
    var strDesc = [];
    var alarm = null;
    if (armType == 1431) {
        alarm = this.startAlarm;
        strMark = this.getAlarmStartEnd(1);
    } else {
        alarm = this.endAlarm;
        strMark = this.getAlarmStartEnd(0);
    }
    var ret = {};
    if (alarm.armIinfo > 0) {
        strDesc.push('风险等级：' + (alarm.armIinfo == 1 ? rootElement.lang.medium_risk : rootElement.lang.high_risk))
    }
    if(alarm.param2){
        var highIds = alarm.desc;
        if(highIds){
            var ids = highIds.split(',');
            if(ids.length > 0){
                var len = ids.length > 3 ? 3 : ids.length;
                var city = [];
                for(var i = 0; i < len;i++){
                    var mapMark = rootElement.mapMarkManager.getMapMark(ids[i]);
                    if(!mapMark){
                        continue;
                    }
                    city.push(mapMark.name);
                }
                var sign = ids.length > 3 ? '...' : ''
                strDesc.push('经过'+alarm.param2+'个高风险区域('+city.join(',')+sign+')');
            }
        }
    }
    if(alarm.param3){
        var middleIds = alarm.imgFile;
        if(middleIds){
            var ids = middleIds.split(',');
            if(ids.length > 0){
                var len = ids.length > 3 ? 3 : ids.length;
                var city = [];
                for(var i = 0; i < len;i++){
                    var mapMark = rootElement.mapMarkManager.getMapMark(ids[i]);
                    if(!mapMark){
                        continue;
                    }
                    city.push(mapMark.name);
                }
                var sign = ids.length > 3 ? '...' : ''
                strDesc.push('经过'+alarm.param3+'个中风险区域('+city.join(',')+sign+')');
            }
        }
    }

    ret.strType = rootElement.lang.alarm_name_1431;
    ret.strMark = strMark;
    ret.strDesc = strDesc.join(',');
    return ret;
}
