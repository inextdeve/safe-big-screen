var rootElement = _getRootFrameElement();
var lang = rootElement.lang;
/**
 * 车辆风险排名
 */
(function (win) {
    var VehicleRiskScore = function () {
        this._initial();
    }
    VehicleRiskScore.prototype = {
        _initial: function () {
            var _this = this;
            _this.data = new HashMap();
            //风险值数据刷新间隔
            _this.riskScoreInfoInterval = 1000 * 10;
            _this.loadRiskScoreRefresh();
            $(document).on('click', '.riskTable', function (e) {
                var level = e.currentTarget.dataset.level;
                _this.level = level;
                _this.loadRiskScoreInfo();

                $('.analyse ul li.selectRiskVehi').removeClass("selectRiskVehi");
                $(this).addClass("selectRiskVehi");
                $('#vehicle-risk-modal').modal('show');
            });
            /*$('#vehicle-risk-modal').on('hide.bs.modal', function () {
                $('.analyse ul li.selectRiskVehi').removeClass("selectRiskVehi");
            })*/
        },
        /**
         * 定时刷新风险值
         */
        loadRiskScoreRefresh: function () {
            var _this = this;
            _this.loadRiskScoreInfo();
            setInterval(function () {
                if (!$('#vehicle-risk-modal').is(':hidden')) {
                    _this.loadRiskScoreInfo();
                }
            }, _this.riskScoreInfoInterval)
        },
        /**
         * 刷新风险值
         */
        loadRiskScoreInfo: function () {
            var _this = this;
            var data = {};
            $.myajax.jsonPost(ctxPath + '/808gps/StandardZHScreenAction_loadVehicleRiskScoreInfo.action', data, false, function (json, success) {
                if (success) {
                    //车辆风险Map
                    if (json.riskScoreList && json.riskScoreList.length > 0) {
                        _this.setRiskData(json.riskScoreList);
                        _this.createHtml();
                    }
                }
            });
        },
        setRiskData: function (riskScoreList) {
            for (var i = 0; i < riskScoreList.length; i++) {
                var riskScore = riskScoreList[i];
                this.data.put(riskScore.vehiID, riskScore);
            }
        },
        setRiskDataChange: function (alarm) {
            var _this = this;
            var vehiId = alarm.p1;
            if (!vehiId) {
                return;
            }
            var riskLevelCur = alarm.p2;
            var riskScoreCur = alarm.p3;
            var riskScore = _this.data.get(vehiId);
            if (!riskScore) {
                var vehiList = rootElement.vehicleManager.mapAllVehiList;
                var vehicle = {};
                vehiList.each(function (id, vehi) {
                    if (vehi.vid == vehiId) {
                        vehicle = vehi;
                    }
                });
                var pName = rootElement.vehicleManager.getTeam(vehicle.parentId).name;
                riskScore = {
                    riskLevelCur: riskLevelCur,
                    riskScoreCur: riskScoreCur,
                    riskLevelMax: riskLevelCur,
                    vehiID: vehiId,
                    vehiIdno: vehicle.idno,
                    companyName: pName,
                    lowRiskLevelCountCur: 0,
                    midRiskLevelCountCur: 0,
                    highRiskLevelCountCur: 0
                }
            }
            riskScore.riskLevelCur = riskLevelCur;
            riskScore.riskScoreCur = riskScoreCur;
            if (riskLevelCur > riskScore.riskLevelMax) {
                riskScore.riskLevelMax = riskLevelCur;
            }
            if (riskLevelCur === 1) {
                riskScore.lowRiskLevelCountCur += 1;
            }
            if (riskLevelCur === 2) {
                riskScore.midRiskLevelCountCur += 1;
            }
            if (riskLevelCur === 3) {
                riskScore.highRiskLevelCountCur += 1;
            }
            _this.data.put(riskScore.vehiID, riskScore);
            _this.createHtml();
        },
        createHtml: function () {
            $('#risk-vehicle-tbody').empty();
            var _this = this;
            var arr = _this.data.getValues();
            arr.sort(function (r1, r2) {
                return r2.riskScoreCur > r1.riskScoreCur ? 1 : -1;
            })
            var count = 1;
            var str = '';
            for (var i = 0; i < arr.length; i++) {
                if (count === 11) {
                    break;
                }
                var item = arr[i];
                if (_this.level != item.riskLevelCur) {
                    continue
                }
                str += _this.createTr(item, count);
                count++
            }
            if (!str) {
                str = '<tr><td colspan="5" class="text-center">' + lang.no_data + '</td></tr>';
            }
            $('#risk-vehicle-tbody').append(str);
        },
        createTr: function (item, count) {
            var _this = this;
            var tr =
                '<tr>' +
                '    <td>' + count + '</td>' +
                '    <td>' +
                _this.getRiskLevelLabel(item.riskLevelCur) +
                '    </td>' +
                '    <td>' + item.vehiIdno + '</td>' +
                '    <td>' + item.riskScoreCur + '</td>' +
                '    <td>' + item.companyName + '</td>' +
                '</tr>';
            return tr;
        },
        /**
         * 获取表格风险等级label
         * @param riskLevel
         */
        getRiskLevelLabel: function (riskLevel) {
            var riskStr = '';
            if (riskLevel === 3) {
                riskStr = '<span class="badge badge-danger p-1">' + lang.high_risk + '</span>';
            }
            if (riskLevel === 2) {
                riskStr = '<span class="badge badge-warning p-1">' + lang.medium_risk + '</span>';
            }
            if (riskLevel === 1) {
                riskStr = '<span class="badge badge-light p-1">' + lang.low_risk + '</span>';
            }
            if (riskLevel === 0) {
                riskStr = '<span class="badge badge-success p-1">' + lang.no_risk + '</span>';
            }
            return riskStr;
        }
    }
    win.VehicleRiskScore = VehicleRiskScore;
})(window)