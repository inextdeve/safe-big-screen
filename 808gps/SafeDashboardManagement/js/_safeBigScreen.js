/**
 * 大屏初始化
 */
import Camera from "./components/camera/camera.js";
import AddCamerasButton from "./components/camera/addCamerasButton.js";
import DevicesList from "./components/camera/DevicesList.js";

var bgScreen = {
  accountId: "",
  //报警数据刷新间隔
  alarmTimeInterval: 10000,
  //数据刷新间隔
  infoInterval: 1000 * 60 * 5,
  //字体
  w: 24,
  //当前风险级别数量Map
  currentRiskLevelMap: {
    1: 0,
    2: 0,
    3: 0,
  },
  //车辆风险数据Map ID为key
  riskScoreMap: new HashMap(),
  //车辆数据刷新间隔
  vehiclesRefreshInterval: 10 * 1000 * 60,
  //车辆ID和车牌号数据缓存
  vehiIdIdnoMap: new HashMap(),
  //车辆号和车牌ID数据缓存
  vehiIdnoIdMap: new HashMap(),
  //车辆Id数据缓存
  vehiIdArr: [],
  //设备编号对应车牌号映射
  deviceIdnoVehiIdnoMapping: new HashMap(),
  //车辆全部数据缓存
  vehiMap: new HashMap(),
  //是否初始化数据刷新
  loadInfoIsSuccess: false,
  //报警列表数据，以gui为key
  alarmMap: [],
  //状态数据刷新间隔
  deviceStatusInterval: 10000,
  //车辆状态数量
  vehicleStatusNum: {
    online: 0,
    offline: 0,
  },
  //主动安全车辆
  vehicleSafetyNum: 0,
  //风险车辆列表
  alarmRiskList: [],
  //全屏
  isFullScreen: false,
  //车辆风险排名弹出表格
  vehicleRiskScore: null,
};

/**
 * 获取固定日报表信息
 */
bgScreen.loadInfo = function () {
  //单个请求时间太长，分为3个请求
  var _this = this;
  $.myajax.jsonPost(
    ctxPath + "/808gps/StandardReportAlarmSuBiao_loadBigScreenInfo.action",
    null,
    false,
    function (json, success) {
      _this.loadVehiScoreRank(json.infos);
    }
  );
  $.myajax.jsonPost(
    ctxPath + "/808gps/StandardReportAlarmSuBiao_loadBigScreenInfoExx.action",
    null,
    false,
    function (json, success) {
      _this.near7DayData(json.daily);
    }
  );
  $.myajax.jsonPost(
    ctxPath + "/808gps/StandardReportAlarmSuBiao_loadBigScreenInfoEx.action",
    null,
    false,
    function (json, success) {
      _this.lineChart(".lineChart", json.interValDate, json.listAlarm);
    }
  );
};

/**
 * 获取风险信息
 */
bgScreen.loadRiskScore = function () {
  $.myajax.jsonPost(
    ctxPath + "/808gps/StandardZHScreenAction_loadVehicleRiskScoreInfo.action",
    null,
    false,
    function (json, success) {
      if (success) {
        //车辆风险Map
        if (json.riskScoreList && json.riskScoreList.length > 0) {
          bgScreen.setRiskData(json.riskScoreList);
          bgScreen.setPageRightNum();
        }
        bgScreen.loadInfoIsSuccess = true;
      }
    }
  );
};

/**
 * 设置车辆风险等级数据
 */
bgScreen.setRiskData = function (riskScoreList) {
  for (var i = 0; i < riskScoreList.length; i++) {
    var riskScore = riskScoreList[i];
    bgScreen.riskScoreMap.put(riskScore.vehiID, riskScore);
  }
  //计算车辆风险总数Map
  bgScreen.countRiskLevelMap();
};
/**
 * 计算车辆风险总数Map
 */
bgScreen.countRiskLevelMap = function () {
  bgScreen.currentRiskLevelMap = { 1: 0, 2: 0, 3: 0 };
  bgScreen.riskScoreMap.each(function (key, value) {
    var riskLevelCur = value.riskLevelCur;
    bgScreen.currentRiskLevelMap[riskLevelCur]++;
  });
};

/**
 * 处理风险等级变化通知
 * @param alarm
 */
bgScreen.setRiskLevelChange = function (alarm) {
  var vehiId = alarm.p1;
  var riskLevelCur = alarm.p2;
  var riskScore = bgScreen.riskScoreMap.get(vehiId);
  if (!riskScore) {
    riskScore = {
      riskLevelCur: riskLevelCur,
      riskLevelMax: riskLevelCur,
      vehiID: vehiId,
    };
  }
  riskScore.riskLevelCur = riskLevelCur;
  if (riskLevelCur > riskScore.riskLevelMax) {
    riskScore.riskLevelMax = riskLevelCur;
  }
  bgScreen.riskScoreMap.put(riskScore.vehiID, riskScore);
};

/**
 * 设置页面右侧数值
 */
// bgScreen.setPageRightNum = function () {
//     //重置右侧车辆数
//     $('#highRisk .riskVehiVal').text(bgScreen.currentRiskLevelMap[3]);
//     $('#middleRisk .riskVehiVal').text(bgScreen.currentRiskLevelMap[2]);
//     $('#lowRisk .riskVehiVal').text(bgScreen.currentRiskLevelMap[1]);
//     //中间风险比例
//     var highRisk = 0;
//     var middleRisk = 0;
//     var lowRisk = 0;
//     var noneRisk = 0;
//     var totalVehi = bgScreen.vehicleStatusNum.online + bgScreen.vehicleStatusNum.offline;
//     //没有产生风险的车辆数
//     var noneRiskVehicle = totalVehi - bgScreen.currentRiskLevelMap[3] - bgScreen.currentRiskLevelMap[2] - bgScreen.currentRiskLevelMap[1];
//     noneRiskVehicle = noneRiskVehicle < 0 ? 0 : noneRiskVehicle;
//     if (totalVehi) {
//         highRisk = (bgScreen.currentRiskLevelMap[3] / totalVehi);
//         middleRisk = (bgScreen.currentRiskLevelMap[2] / totalVehi);
//         lowRisk = (bgScreen.currentRiskLevelMap[1] / totalVehi);
//         noneRisk = (noneRiskVehicle / totalVehi);
//     }
//     highRisk = highRisk * 100 < 0 ? 0 : highRisk * 100;
//     highRisk = highRisk > 100 ? 100 : highRisk;
//     middleRisk = middleRisk * 100 < 0 ? 0 : middleRisk * 100;
//     middleRisk = middleRisk > 100 ? 100 : middleRisk;
//     lowRisk = lowRisk * 100 < 0 ? 0 : lowRisk * 100;
//     lowRisk = lowRisk > 100 ? 100 : lowRisk;
//     noneRisk = noneRisk * 100 < 0 ? 0 : noneRisk * 100;
//     noneRisk = noneRisk > 100 ? 100 : noneRisk;
//     $('.cicle8 span').text("Ho" + '%');
//     $('.cicle9 span').text((middleRisk).toFixed(2) + '%');
//     $('.cicle10 span').text((lowRisk).toFixed(2) + '%');
//     $('.cicle11 span').text((noneRisk).toFixed(2) + '%');

// }

/**
 * 加载车辆评分
 * @param data
 */
bgScreen.loadVehiScoreRank = function (data) {
  if (data) {
    if (data.length == 3) {
      $("#top1,#top2,#top3").show();
    } else if (data.length == 2) {
      $("#top1,#top2").show();
      $("#top3").hide();
    } else if (data.length == 1) {
      $("#top1").show();
      $("#top2,#top3").hide();
    } else {
      $("#top1,#top2,#top3").hide();
    }

    if (myUserRole && myUserRole.isEnableShiGan()) {
      for (var j = 0, lenj = data.length; j < lenj; j++) {
        data[j].vn = data[j].cnm;
      }
    }

    for (var i = 0, len = data.length; i < len; i++) {
      var vehiIdno = data[i].vn;
      if (vehiIdno && vehiIdno.length > 8) {
        vehiIdno = vehiIdno.substring(0, 8) + "...";
      }
      $("#top" + (i + 1) + " span:eq(0)").text(vehiIdno);
      $("#top" + (i + 1) + " span:eq(0)").attr("title", data[i].vn);
      $("#top" + (i + 1) + " span:eq(1)").text(data[i].ts || 0);
      this.draw(
        ".vehiScoreTop" + (i + 1) + "Chart",
        data[i].ts || 0,
        100,
        "#09c4ca"
      );
    }
  }
};

/**
 * 车辆评分
 * @param ele
 * @param val
 * @param con
 * @param max
 * @param color
 */
bgScreen.draw = function (ele, val, max, color) {
  var chart = echarts.init(document.querySelector(ele));
  var value = val;
  var option = {
    grid: {
      left: "10%",
      top: "0",
      right: "20%",
      bottom: "0",
    },
    xAxis: {
      type: "value",
      splitLine: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: [
      {
        type: "category",
        inverse: false,
        data: [],
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
      },
    ],
    series: [
      {
        type: "pictorialBar",
        data: [value],
        itemStyle: {
          normal: {
            color: color,
          },
        },
        symbolRepeat: "fixed",
        symbolClip: true,
        symbolSize: [0.5 * this.w, this.w],
        symbol: "roundRect",
        /*label: {
                    show: true,
                    position: 'left',
                    formatter: function () {
                        return con
                    },
                    color: '#fff',
                    fontSize: 0.7 * this.w,
                },*/
        z: 1000,
      },
      {
        type: "pictorialBar",
        itemStyle: {
          normal: {
            color: "#193040",
          },
        },
        data: [max],
        animationDuration: 0,
        symbolRepeat: "fixed",
        // symbolMargin: '20%',
        symbol: "roundRect",
        symbolSize: [0.5 * this.w, this.w],
        label: {
          show: true,
          position: "right",
          formatter: function () {
            return (val * 100) / max;
          },
          color: "#fff",
          fontSize: 0.7 * this.w,
        },
      },
    ],
  };
  chart.setOption(option);
};

/**
 * 折线图 近30天报警趋势
 * @param ele
 */

//THIS IS FOR CHART IN THE RIGHT
bgScreen.lineChart = function (ele, xd, yd) {
  var chart = echarts.init(document.querySelector(ele));
  var xdata = [];
  var dataArr = [];
  if (xd && xd.length > 0) {
    for (var i = 0, len = xd.length; i < len; i++) {
      xdata.push(dateTime2MonthDateString(xd[i]));
      if (yd && yd.length > 0) {
        for (var j = 0, lenj = yd.length; j < lenj; j++) {
          if (xd[i] / 1000 == yd[j].gpsDateI) {
            dataArr.push(yd[j].alarmCount || 0);
            break;
          }
          if (j == yd.length - 1) {
            dataArr.push(0);
          }
        }
      } else {
        dataArr.push(0);
      }
    }
  }
  var max = Math.max.apply(null, dataArr);
  var seriesName = "";
  var option = {
    title: {
      text: parent.lang.last30Days + " " + parent.lang.alarmTrend,
      textStyle: {
        fontWeight: "normal",
        fontSize: 14,
        color: "#0ac1c7",
      },
    },
    grid: {
      left: "5%",
      //   right: "2%",
      bottom: "5%",
      top: "15%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: xdata,
      axisLabel: {
        show: true,
        textStyle: {
          color: "#fff",
          fontSize: 0.5 * this.w,
        },
      },
      axisLine: {
        lineStyle: {
          color: "transparent",
          width: 2, //这里是为了突出显示加上的
        },
      },
    },
    tooltip: {
      show: true,
      trigger: "item",
    },
    yAxis: [
      {
        type: "value",
        min: 0,
        axisLabel: {
          formatter: "{value}",
          textStyle: {
            color: "#fff",
            fontSize: 0.5 * this.w,
          },
        },
        axisLine: {
          lineStyle: {
            color: "transparent",
            width: 2, //这里是为了突出显示加上的
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: seriesName,
        type: "line",
        stack: "总量",
        symbol: "none",
        smooth: false,
        symbol: "circle",
        itemStyle: {
          normal: {
            color: "#34a39a",
            lineStyle: {
              color: "#34a39a",
              width: 2,
            },
            areaStyle: {
              //color: '#94C9EC'
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#08808b",
                },
                {
                  offset: 1,
                  color: "rgba(0,0,0,0.2)",
                },
              ]),
            },
          },
        },
        data: dataArr,
      },
    ],
  };

  var index = 0; //播放所在下标
  var mTime = setInterval(function () {
    chart.dispatchAction({
      type: "showTip",
      seriesIndex: 0,
      dataIndex: index,
    });
    index++;
    if (index > xdata.length) {
      index = 0;
    }
  }, 1500);

  chart.setOption(option);
};

/**
 * 近7天数据
 * @param data
 */
bgScreen.near7DayData = function (data) {
  if (data) {
    $(".total .data1 p").text((data.licheng || 181).toFixed(2));
    $(".total .data5 p").text((data.workTime / 3600 || 0).toFixed(2));
  }
};

bgScreen.loadConstant = function () {
  document.title = parent.lang.securityCloudScreen;
  if (myUserRole && myUserRole.isEnableShiGan()) {
    $("#safeBigScreen").text("HHHHHH");
    $("#vehiScore").text(parent.lang.companyGrade);
  } else {
    $("#safeBigScreen").text(parent.lang.securityCloudScreen);
    $("#vehiScore").text(parent.lang.vehicleGrade);
  }
  $("#riskVehiList").text("KPI"); //Modified
  $(".total .data1 span:eq(0)").text(
    parent.lang.last7DaysEx + parent.lang.labelLiChengKM
  );
  $(".total .data1 span:eq(1)").text(parent.lang.safeLicheng);
  $(".total .data5 span:eq(0)").text(
    parent.lang.last7DaysEx + "(" + parent.lang.hour + ")"
  );
  $(".total .data5 span:eq(1)").text(parent.lang.safeWorkTime);
  $(".total .data2 span").text(parent.lang.vehicleTotalCount);
  $(".total .data3 span").text(parent.lang.realTimeVehicleCount);
  $(".total .data4 span").text(parent.lang.safeTyVehiNum);
  $("#onlineCondition").text(parent.lang.onlineCondition);
  $("#onlineRate").text(parent.lang.onlineRate);
  $("#offlineRate").text(parent.lang.offlineRate);
  $("#riskSituation").text("DVR Monitoring");
  $("#highRisk h5").text(parent.lang.high_risk_vehi);
  $("#middleRisk h5").text(parent.lang.middle_risk_vehi);
  $("#lowRisk h5").text(parent.lang.low_risk_vehi);
  $(".cicle8 p").text("Washing");
  $(".cicle9 p").text("Bins");
  $(".cicle10 p").text("Sweeping");
  $(".cicle11 p").text("Vehicle");
  $("#dataStatus").text(parent.lang.dataStatus);
  $("#fullScreen").attr("title", parent.lang.fullScreen1);
};

/**
 * 国际化HTML内的tag
 */
bgScreen.replaceTag = function () {
  $(".lll-i18n").each(function () {
    var obj = $(this);
    //直接替换内容
    var content = obj.data("i18n");
    if (content) {
      var str = lang[content];
      obj.html(str);
    }
    //title
    content = obj.data("i18n-title");
    if (content) {
      var str = lang[content];
      obj.prop("title", str);
    }
  });
};

/**
 * 定时刷新车辆
 */
bgScreen.loadVehiclesRefresh = function () {
  bgScreen.loadVehicles();
  setInterval(function () {
    bgScreen.loadVehicles();
  }, bgScreen.vehiclesRefreshInterval);
};

/**
 * 加载车辆
 */
bgScreen.loadVehicles = function () {
  $.myajax.jsonGet(
    "/808gps/StandardLoginAction_getUserVehicleEx.action?toMap=2",
    function (json, action, success) {
      if (success) {
        //还原被压缩数据
        var vehicles = json.vehicles;
        bgScreen.vehiIdArr = [];
        for (var i = 0; i < vehicles.length; i++) {
          var vehicle = vehicles[i];
          //缓存的信息
          var vehicleCache = {};
          //判断车辆状态
          var status = bgScreen.getGpsDevice(vehicle).st;
          //车牌号
          vehicleCache.idno = vehicle.nm;
          //车辆ID
          vehicleCache.id = vehicle.id;
          vehicleCache.isSafeTy = bgScreen.isSafeTyVehi(vehicle);
          if (status) {
            //gps设备的编号
            vehicleCache.deviceIdno = status.id;
            //解析设备状态
            var deviceStatus = new standardStatus(status.DevIDNO);
            deviceStatus.vehiIdno = vehicleCache.idno;
            deviceStatus.setStatus(status);
            vehicleCache.status = deviceStatus;
          } else {
            status = {};
            //解析设备状态
            var deviceStatus = new standardStatus();
            deviceStatus.vehiIdno = vehicleCache.idno;
            deviceStatus.setStatus(status);
            vehicleCache.status = deviceStatus;
          }
          //设备id对应车辆id映射
          var dls = vehicle.dl;
          for (var j = 0; j < dls.length; j++) {
            var dl = dls[j];
            bgScreen.deviceIdnoVehiIdnoMapping.put(dl.id, vehicle.nm);
          }
          if (bgScreen.vehiMap.containsKey(vehicleCache.idno)) {
            vehicleCache.alarmLevel = bgScreen.vehiMap.get(
              vehicleCache.idno
            ).alarmLevel;
          }
          bgScreen.vehiMap.put(vehicleCache.idno, vehicleCache);
          bgScreen.vehiIdIdnoMap.put(vehicle.id, vehicleCache.idno);
          bgScreen.vehiIdnoIdMap.put(vehicleCache.idno, vehicle.id);
          bgScreen.vehiIdArr.push(vehicle.id);
        }
        //计算车辆状态总数
        bgScreen.computeStatusNum();
        //车辆数据加载完成以后，加载看板信息
        if (bgScreen.vehiMap.size() > 0 && !bgScreen.loadInfoIsSuccess) {
          bgScreen.loadRiskScore();
        }
      }
    },
    null
  );
};

/**
 * 定时刷新报警
 */
bgScreen.alarmRefresh = function () {
  setInterval(function () {
    bgScreen.loadAlarm();
  }, bgScreen.alarmTimeInterval);
};

/**
 * 定时刷新报警
 */
bgScreen.loadAlarm = function () {
  var data = {
    devIdnos:
      bgScreen.deviceIdnoVehiIdnoMapping.getKeys().join(",") +
      ",@@NOTIFY_EVENT@@",
  };
  $.myajax.jsonPost(
    "/808gps/StandardPositionAction_alarm.action?isBigScreen=B&toMap=2",
    data,
    false,
    function (json, success) {
      var isMore = false;
      if (success) {
        if (
          typeof json.more != "undefined" &&
          json.more != null &&
          json.more > 0
        ) {
          isMore = true;
        }
        var alarmlist = json.alarmlist;
        if (!alarmlist) {
          return;
        }
        for (var i = 0; i < alarmlist.length; i++) {
          var alarm = alarmlist[i];
          //处理报警附件通知
          if (alarm.type == 638 || alarm.type == 688) {
            continue;
          }
          //处理风险等级变化通知
          if (alarm.type == 113 && alarm.info == 70) {
            // console.log("车辆等级变化通知")
            // console.log(alarm)
            var vehiIdno = bgScreen.vehiIdIdnoMap.get(alarm.p1);
            if (!vehiIdno) {
              continue;
            }
            bgScreen.setRiskLevelChange(alarm);
            bgScreen.countRiskLevelMap();
            bgScreen.setPageRightNum();
            bgScreen.vehicleRiskScore.setRiskDataChange(alarm);
            continue;
          }
          //只解析大于600 或者 定义的报警类型
          if (alarm.type < 600 || [1430, 1431].contains(alarm.type)) {
            continue;
          }
          var armInfo = new standardArmInfo();
          armInfo.setAlarm(alarm);
          if (!armInfo.isStart()) {
            continue;
          }
          //报警列表显示的报警数据，以gui为key
          var vehiAlarm = new standardAlarm(alarm.guid, alarm.stType);
          vehiAlarm.setAlarm(armInfo);
          vehiAlarm.time = alarm.time;
          bgScreen.alarmMap.push(vehiAlarm);
        }
        //刷新风险车辆列表
        bgScreen.showAlarmList();
        //设置页面右侧数值
        bgScreen.setPageRightNum();
        //是否还有需要加载的报警
        if (isMore) {
          bgScreen.loadAlarm();
        }
      }
      bgScreen.showAlarmList();
    }
  );
  bgScreen.showAlarmList();
};

/**
 * 刷新风险车辆列表
 */
bgScreen.showAlarmList = function () {
  for (var i = 0, len = bgScreen.alarmMap.length; i < len; i++) {
    var alarmInfo = bgScreen.alarmMap[i];
    var alarmInfoEx = alarmInfo.parseAlarmInfo(false);
    var vehicleIdno = bgScreen.deviceIdnoVehiIdnoMapping.get(alarmInfoEx.idno);
    if (bgScreen.alarmRiskList.length >= 5) {
      bgScreen.alarmRiskList.shift(); //删除数组第一个元素
    }
    var time = "";
    if (alarmInfoEx.startTime) {
      time = alarmInfoEx.startTime.substring(11, alarmInfoEx.startTime.length);
    }
    bgScreen.alarmRiskList.push({
      type: alarmInfoEx.type,
      time: time,
      vehi: vehicleIdno,
    });
  }

  const kpi = [
    {
      name: "Washing",
      rate: "25%",
      done: "989",
      undone: "1000",
    },
    {
      name: "Bins",
      rate: "25%",
      done: "989",
      undone: "1000",
    },
    {
      name: "Sweeping",
      rate: "25%",
      done: "989",
      undone: "1000",
    },
    {
      name: "Equipments",
      rate: "25%",
      done: "989",
      undone: "1000",
    },
  ];

  if (false) {
    $(".main .top5 .top5-content ul li .li-content span").animate(
      { opacity: 0 },
      2000
    );
    setTimeout(function () {
      // const response = await fetch("https://bins.rcj.care/api/?token=fb1329817e3ca2132d39134dd6d894b3&statistics&time_f=18:14&date_f=2023-02-14&time_t=18:14&date_t=2023-02-15");
      // const data = await response.json();
      // console.log(data);
      var index = 0;
      for (var j = kpi.length - 1; j >= 0; j--) {
        $(
          ".main .top5 .top5-content ul li:eq(" +
            index +
            ") .li-content span:eq(0)"
        ).text(kpi[j].name);
        $(
          ".main .top5 .top5-content ul li:eq(" +
            index +
            ") .li-content span:eq(1)"
        ).text(kpi[j].done + " of " + kpi[j].undone);
        $(
          ".main .top5 .top5-content ul li:eq(" +
            index +
            ") .li-content span:eq(2)"
        ).text(kpi[j].rate);
        index++;
      }
      $(".main .top5 .top5-content ul li .li-content span").animate(
        { opacity: 100 },
        3500
      );
    }, 1000);
  }
  bgScreen.alarmMap.splice(0, bgScreen.alarmMap.length);
};

/**
 * 计算车辆状态总数
 */
bgScreen.computeStatusNum = function () {
  //数量清0
  bgScreen.vehicleStatusNum.online = 0;
  bgScreen.vehicleStatusNum.offline = 0;
  bgScreen.vehicleSafetyNum = 0;
  //计算数量
  bgScreen.vehiMap.each(function (key, value) {
    var deviceStatus = value.status;
    //在线状态
    var isOnline = deviceStatus.isOnline();
    //离线数量
    if (isOnline) {
      bgScreen.vehicleStatusNum.online++;
    } else {
      bgScreen.vehicleStatusNum.offline++;
    }
    if (value.isSafeTy) {
      bgScreen.vehicleSafetyNum++;
    }
  });
  //设置页面数值
  bgScreen.setPageTopNum();
};

/**
 * 设置页面车辆在线数值
 */
bgScreen.setPageTopNum = function () {
  var vehiTotal =
    bgScreen.vehicleStatusNum.online + bgScreen.vehicleStatusNum.offline;
  $(".total .data2 p").text(vehiTotal);
  $(".total .data3 p").text(bgScreen.vehicleStatusNum.online);
  $(".total .data4 p").text(bgScreen.vehicleSafetyNum);
  var onlineRate = 0;
  var offlineRate = 0;
  if (vehiTotal) {
    onlineRate = (bgScreen.vehicleStatusNum.online / vehiTotal).toFixed(2);
    offlineRate = (bgScreen.vehicleStatusNum.offline / vehiTotal).toFixed(2);
  }
  bgScreen.waterChart(".waterChart1 .chart1", Number(onlineRate));
  bgScreen.waterChart(".waterChart2 .chart2", Number(offlineRate));
};

/**
 * 是否是主动安全车辆
 * 勾选了主动安全协议或者添加了车辆主动安全设备
 * @returns {boolean}
 */
bgScreen.isSafeTyVehi = function (vehicle) {
  //车辆是否是主动安全车辆
  var isSafeTy = false;
  if (vehicle && vehicle.dl && vehicle.dl.length > 0) {
    for (var i = 0, len = vehicle.dl.length; i < len; i++) {
      if (vehicle.dl[i].isb) {
        isSafeTy = true;
        break;
      }
    }
  }
  if (
    isSafeTy ||
    vehicle.ity ||
    vehicle.iad ||
    vehicle.ids ||
    vehicle.ibs ||
    vehicle.icd
  ) {
    return true;
  }
  return false;
};

/**
 * 判断是否超时
 */
bgScreen.checkSessionExpire = function () {
  if (!bgScreen.accountId) {
    $.dialog.tipDanger(lang.errSessionUnvalid);
    //直接跳转到登录界面
    toLoginPage();
  }
};

/**
 * 获取GPS设备  获取定位有效的设备   双设备 停用gps设备  视频设备继续更新 不更新地图问题
 * @returns {null|*}
 */
bgScreen.getGpsDevice = function (vehicle) {
  if (vehicle.dl && vehicle.dl.length > 0) {
    //如果有两个设备，则其中有1个是gps设备，1个是视频设备
    if (vehicle.dl.length == 1) {
      return vehicle.dl[0];
    } else {
      //	 1.双设备只有一个设备支持解析，使用支持解析设备
      //	 2.双设备都支持解析或者都不支持解析，使用gps设备
      //	 3.其他情况，使用第一个设备【顺序不保证，异常双视频设备出现，规避现象】
      var findIndex = [];
      for (var i = 0; i < vehicle.dl.length; i++) {
        // 如果设备解析gps,
        if (!bgScreen.isNotAnalyzeGps(vehicle.dl[i])) {
          findIndex.push(i);
        }
      }
      // 是否存在1个设备不解析gps的属性，如果是，则取另外一个设备
      if (findIndex && findIndex.length == 1) {
        return vehicle.dl[findIndex[0]];
      }
      // 双设备存在gps设备
      // 设备都不解析 或者 设备都解析
      for (var i = 0; i < vehicle.dl.length; i++) {
        if (bgScreen.isGpsDevice(vehicle.dl[i])) {
          return vehicle.dl[i];
        }
      }
      // 双设备不存在gps设备
      // 设备都不解析 或者 设备都解析
      return vehicle.dl[0];
    }
  }
  return null;
};

/**
 * 判断设备是否是GPS设备
 * @returns {boolean}
 */
bgScreen.isGpsDevice = function (device) {
  if (bgScreen.isVideoDevice(device)) {
    return false;
  } else {
    return true;
  }
};
/**
 * 判断设备是否是视频设备
 * @returns {boolean}
 */
bgScreen.isVideoDevice = function (device) {
  if (device.md) {
    //是否应该按位来判断  afu 150603
    var mod = Number(device.md); //.toString(2);
    if ((mod >> 0) & (1 > 0)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

/**
 * 判断设备是否在线
 * @param device
 * @returns {boolean}
 */
bgScreen.isOnline = function (device) {
  if (device.st && device.st.ol != null && device.st.ol > 0) {
    return true;
  } else {
    return false;
  }
};
bgScreen.isGpsValid = function (device) {
  if (device.st.s1 != null) {
    var valid = device.st.s1 & 0x01;
    if (valid == 1) {
      return true;
    }
  }
  return false;
};

/**
 * 判断设备是否配置不解析gps
 */
bgScreen.isNotAnalyzeGps = function (device) {
  if (device.gps != null && device.gps == 1) {
    return true;
  } else {
    return false;
  }
};

// 水波图
bgScreen.waterChart = function (ele, data) {
  var sca = (data * 100).toFixed(2);
  var myChart = echarts.init(document.querySelector(ele));
  var option = {
    series: [
      {
        color: ["#09828e", "#09c2c8"],
        type: "liquidFill",
        data: [data, data],
        radius: "90%",
        outline: {
          show: false,
        },
        backgroundStyle: {
          color: "transparent",
          borderColor: "#0ac1c7",
          borderWidth: 1,
          shadowColor: "rgba(0, 0, 0, 0.4)",
          shadowBlur: 20,
        },
        shape:
          'path://"M61.3,2c6.2,0,12.1,1.1,17.5,3.4C84.3,7.7,89,10.8,93,14.6c4.1,4,7.3,8.6,9.7,13.8c2.4,5.2,3.5,10.9,3.5,16.9c0,8.1-2.4,16.9-7.1,26.4c-4.7,9.4-9.9,18.2-15.5,26.2c-5.6,8-13.1,17.4-22.4,28.1c-9.3-10.7-16.8-20-22.4-28.1c-5.6-8-10.8-16.8-15.5-26.2c-4.7-9.4-7.1-18.2-7.1-26.4c0-6,1.2-11.6,3.5-16.9c2.4-5.2,5.6-9.8,9.7-13.8c4-3.9,8.8-7,14.2-9.2C49.2,3.1,55,2,61.3,2L61.3,2z"',
        label: {
          normal: {
            position: ["50%", "50%"],
            formatter: function () {
              return sca + "%";
            },
            textStyle: {
              fontSize: 0.5 * this.w,
              color: "#D94854",
            },
          },
        },
      },
    ],
  };
  myChart.setOption(option);
};

/**
 * 切换全屏
 */
bgScreen.switchFullScreen = function () {
  if (bgScreen.isFullScreen) {
    bgScreen.exitFullscreen();
    $("#fullScreen").attr("title", parent.lang.fullScreen1);
  } else {
    bgScreen.fullScreen();
    $("#fullScreen").attr("title", parent.lang.fullScreenExit);
  }
};
/**
 * 全屏
 */
bgScreen.fullScreen = function () {
  var el = document.documentElement;
  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else if (el.mozRequestFullScreen) {
    el.mozRequestFullScreen();
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen();
  } else if (el.msRequestFullscreen) {
    el.msRequestFullscreen();
  }
  bgScreen.isFullScreen = true;
};
/**
 * 退出全屏
 */
bgScreen.exitFullscreen = function () {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
  bgScreen.isFullScreen = false;
};

/**
 * 绑定事件
 */
bgScreen.bindEvent = function () {
  //切换全屏
  $("#fullScreen").click(function () {
    bgScreen.switchFullScreen();
  });
};

/**
 * 加载页面
 */
bgScreen.loadPage = function () {
  //车辆风险排名弹出表格
  bgScreen.vehicleRiskScore = new VehicleRiskScore();
  //语言化
  bgScreen.loadConstant();
  bgScreen.replaceTag();
  //绑定事件
  bgScreen.bindEvent();
  //加载车辆
  bgScreen.loadVehiclesRefresh();
  //获取信息
  bgScreen.loadInfo();
  //刷新报警数据
  bgScreen.alarmRefresh();
};

/**
 * 初始化样式 雨滴
 */
bgScreen.initStyle = function () {
  this.placeholderPic();
  this.topColor();
};

// 风险车辆列表颜色循环
bgScreen.topColor = function () {
  var ele = $(".top5-content ul").children();
  var length = ele.length;
  var i = 1;
  setInterval(function () {
    $(ele[i]).find(".cicle").css({
      background: "url(./images/orange.png) no-repeat center",
      backgroundSize: "100%",
    });
    $(ele[i]).find(".li-content").css({
      background: "url(./images/border2.png) no-repeat center",
      backgroundSize: "contain",
    });
    $(ele[i]).siblings().find(".cicle").css({
      background: "url(./images/green.png) no-repeat center",
      backgroundSize: "100%",
    });
    $(ele[i]).siblings().find(".li-content").css({
      background: "url(./images/border.png) no-repeat center",
      backgroundSize: "contain",
    });
    i++;
    if (i == length) {
      i = 0;
    }
  }, 3500);
};

// 定义字体大小
bgScreen.placeholderPic = function () {
  this.w = getWindowWidth() / 80;
  document.documentElement.style.fontSize = this.w + "px";
};

/**
 * 加载页面
 */
bgScreen.loadReadPage = function () {
  if (typeof lang == "undefined") {
    setTimeout(bgScreen.loadReadPage, 50);
  } else {
    //先判断session，再判断用户名和密码
    var session = getUrlParameter("userSession");
    var account_ = getUrlParameter("account");
    var password_ = getUrlParameter("password");
    if (session != "" || (account_ != "" && password_ != "")) {
      setTimeout(
        SessionLogin.directLogin(function () {
          handleScreen();
          bgScreen.loadPage();
        }),
        100
      );
    } else {
      //检测登录
      bgScreen.checkSessionExpire();
      // 解决pc端屏幕缩放比例对页面布局的影响
      handleScreen();
      bgScreen.loadPage();
    }
  }
};

$(function () {
  //初始化语言
  langInitByUrl();
  bgScreen.initStyle();
  bgScreen.loadReadPage();
});

function resizeHeight() {
  /* var height = getWindowHeight() < 700 ? 700 :getWindowHeight();
     $('body').css('height',height);
     $('body').css('width',getWindowWidth());*/
  /*   $(document).width(getWindowWidth());*/
  document.documentElement.clientWidth = getWindowWidth();
  console.log($(document).width());
}

async function GetKPIINFO(from) {
  try {
    const response = await fetch(
      `http://38.54.114.166:3003/api/statistics/kpi`,
      {
        headers: { Authorization: `Bearer fb329817e3ca2132d39134dd26d894b2` },
      }
    );
    const data = await response.json();
    const kpi = data[0];
    console.log(kpi);
    const selectKPI = (filter) => kpi.filter((kpi) => kpi.name === filter)[0];

    //TOP LEFT RESUME KPI
    var index = 0;
    for (var j = kpi.length - 1; j >= 0; j--) {
      $(
        ".main .top5 .top5-content ul li:eq(" +
          index +
          ") .li-content span:eq(0)"
      ).text(kpi[j].name);
      $(
        ".main .top5 .top5-content ul li:eq(" +
          index +
          ") .li-content span:eq(1)"
      ).text(
        `${
          kpi[j].done ? kpi[j].done : kpi[j].distance ? kpi[j].distance : "0"
        } of ${kpi[j].undone ? kpi[j].undone + kpi[j].done : kpi[j].Planlength}`
      );
      $(
        ".main .top5 .top5-content ul li:eq(" +
          index +
          ") .li-content span:eq(2)"
      ).text(kpi[j].rate);
      index++;
    }

    //Sphere circles
    $(".cicle8 span").text(
      parseInt(selectKPI("washing").rate).toFixed(2) + "%"
    ); //Washing
    $(".cicle9 span").text(parseInt(selectKPI("bins").rate).toFixed(2) + "%"); //Bins
    $(".cicle10 span").text(
      parseInt(selectKPI("swipping").rate).toFixed(2) + "%"
    ); //Sweeping
    $(".cicle11 span").text(
      parseInt(selectKPI("devices").rate).toFixed(2) + "%"
    ); //Equipments
  } catch (error) {
    console.log(error);
  }
}

const camerasFetching = () => {
  window.onload = () => {
    const Cameras = () => {
      const [camerasData, setCamerasData] = React.useState([]);

      const [listedCameras, setListedCameras] = React.useState([]);

      const [showDevicesList, setShowDevicesList] = React.useState(false);

      const deviceListVisibility = (state) => {
        setShowDevicesList(state);
      };

      const updateListedCameras = (list) => {
        setListedCameras(list.slice(0, 5));
      };

      // 2 Front
      // 0 Back
      // 1 Driver
      // 0,1,2 All

      React.useEffect(() => {
        fetch(
          "https://bins.rcj.care/api/?token=fb329817e3ca2132d39134dd26d894b2&mdvr"
        )
          .then((response) => response.json())
          .then((data) => {
            setCamerasData(data);
            updateListedCameras(data);
          })
          .catch((e) => {
            console.log(e);
          });
      }, []);

      return React.createElement(
        React.Fragment,
        null,
        ...listedCameras.map((camera, index) =>
          React.createElement(
            Camera,
            {
              name: camera.device_name,
              mdvrID: camera.mdvrID,
              index,
              updateListedCameras,
              listedCameras,
            },
            null
          )
        ),
        React.createElement(AddCamerasButton, { deviceListVisibility }, null),
        showDevicesList
          ? React.createElement(
              DevicesList,
              {
                devices: camerasData,
                selectedDevices: listedCameras,
                updateListedCameras,
                deviceListVisibility,
              },
              null
            )
          : null
      );
    };

    ReactDOM.render(
      React.createElement(Cameras, null, null),
      document.getElementById("camerasContainer")
    );
  };
};

//FREQUENTLY UPDATE FOR KPI INFO
let freq = setInterval(() => GetKPIINFO(), 60000);

const DATE_INPUT = document.getElementById("kpiDateInput");

DATE_INPUT.value = new Date().toISOString().split("T")[0] + "T00:00";

DATE_INPUT.addEventListener("change", (event) => {
  GetKPIINFO(event.target.value);
  clearInterval(freq);
  freq = setInterval(() => GetKPIINFO(event.target.value), 60000);
});

camerasFetching();
GetKPIINFO();
