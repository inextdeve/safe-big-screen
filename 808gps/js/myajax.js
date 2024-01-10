(function ($) {
    /**
     * 序列化表单
     */
    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    $.myajax = {
        /**
         * 初始化
         */
        init: function () {
            if (typeof rootElement === 'undefined') {
                rootElement = window
            }
            jQuery.ajaxSetup({
                cache: false,
                headers: {
                    'csrfToken': rootElement.csrfToken
                }
            });
        },

        /**
         * 发送请求重定向
         * 后台方法 ：StandardPlatformVehiCtrlAction_sendVehiCtrlCmdEx.action
         *
         * 详情见httpHandler.js
         *
         * @param data
         * @param httphandler
         * @param callback
         */
        sendHttpRedirect: function (data, httphandler, callback) {
            var _myajax = this; // 保留当前js 引用
            if (!httphandler) {
                return;
            }
            if (!data.httpHandler) {
                data.httpHandler = httphandler;
            }

            var _url = data.httpHandler.getUrl();
            if (_url == null) {
                return;
            }

            _myajax.jsonPost(_url, data, false, function (json, success) {
                if (typeof callback == 'function') {
                    callback(json, success);
                }
            });
        },
        getUrl: function (ip, port, cparam, params) {
            if (location.protocol === 'https:') {
                if(_getRootFrameElement().httpsMapHttpPortParamsMap){
                    var httpsPort = _getRootFrameElement().httpsMapHttpPortParamsMap[port];
                    httpsPort = httpsPort ? httpsPort : ('1' + port);
                    port = httpsPort;
                }else{
                    port = '1' + port;
                }
            }

            var url = location.protocol + '//' + ip + ':' + port + '/' + cparam;

            if ($.isEmptyObject(params)) {
                return url;
            }
            var first = true;
            for (var key in params) {
                url += (first ? '?' : '&');
                url += (key + '=' + params[key]);
                first = false;
            }
            return url;
        },
        /**
         * 向C++服务器发送请求
         * @param method GET POST请求
         * @param ip IP地址
         * @param port 端口
         * @param cparam 链接前缀
         * @param params GET参数
         * @param data POST参数
         * @param beforeHandler 请求前事件
         * @param callback 请求后事件(已处理错误)
         * @param customCallback 自定义请求后事件(未处理错误)
         */
        requestC:function(method,ip,port,cparam,params,data,beforeHandler,callback,customCallback){
            var httpRequest = new XMLHttpRequest();
            if (!ip || !port || !cparam) {
                console.error("请求地址错误");
                return;
            }
            var url = this.getUrl(ip, port, cparam, params);
            httpRequest.open(method, url, true);
            httpRequest.timeout = 60000;

            httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');

            if (data) {
                httpRequest.send(JSON.stringify(data));
            } else {
                httpRequest.send();
            }
            httpRequest.onload = function (XHR) {
                var json = httpRequest.responseText;//获取到json字符串，还需解析
                if (json) {
                    json = JSON.parse(json);
                }
                beforeHandler ? beforeHandler.call(this, json) : null;
                if (customCallback && typeof customCallback == 'function'){
                    customCallback.call(this,json,true,null,httpRequest);
                    return;
                }
                if (json && json.result == 0) {
                    callback ? callback.call(this, json, true) : null;
                } else {
 					if (json == null){
                        callback ? callback.call(this, json, false) : null;
                        return;
                    }
                    if(!json.resultTip && json.message){
                        json.resultTip = json.message;
                    }
                   
                    showDialogErrorMessage(json.result, json.cmsserver, json.resultTip);
                    callback ? callback.call(this, json, false) : null;
                }
            };
            httpRequest.onerror = function (XHR, textStatus, errorThrown) {
                if (customCallback && typeof customCallback == 'function'){
                    customCallback.call(this,null,false,errorThrown,httpRequest);
                    return;
                }
                callback ? callback.call(this,null,false,errorThrown) : null;
            };

            httpRequest.ontimeout = function (XHR, textStatus, errorThrown) {
                if (customCallback && typeof customCallback == 'function'){
                    customCallback.call(this,null,false,'timeout',httpRequest);
                    return;
                }
                callback ? callback.call(this,null,false,errorThrown) : null;
            };
            httpRequest.onabort = function () {
                if (customCallback && typeof customCallback == 'function'){
                    customCallback.call(this,null,false);
                    return;
                }
                callback ? callback.call(this,null,false) : null;
            }
            return httpRequest;
        },
        /**
         * 给C++服务器发送Get请求
         * @param ip
         * @param port
         * @param cparam
         * @param params
         * @param beforeHandler
         * @param callback
         */
        getC:function(ip,port,cparam,params,beforeHandler,callback,customCallback){
            return this.requestC("GET",ip,port,cparam,params,null,beforeHandler,callback,customCallback);
        },
        /**
         * 给C++服务器发送POST请求
         * @param ip
         * @param port
         * @param cparam
         * @param params
         * @param data
         * @param beforeHandler
         * @param callback
         */
        postC:function(ip,port,cparam,params,data,beforeHandler,callback,customCallback){
            return this.requestC("POST",ip,port,cparam,params,data,beforeHandler,callback,customCallback);
        },
        /**
         * 给C++服务器发送POST请求
         * @param url 请求链接
         * @param data 请求数据
         * @param beforeHandler 请求前事件
         * @param callback 请求后事件(已处理错误)
         */
        postCUrl: function (url, data, beforeHandler, callback) {
            var httpRequest = new XMLHttpRequest();
            if (!url) {
                console.error("请求地址错误");
                return;
            }
            httpRequest.open("POST", url, true);
            httpRequest.timeout = 60000;
            httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
            if (data) {
                httpRequest.send(JSON.stringify(data));
            } else {
                httpRequest.send();
            }
            httpRequest.onload = function () {
                var json = httpRequest.responseText;//获取到json字符串，还需解析
                if (json) {
                    json = JSON.parse(json);
                }
                beforeHandler ? beforeHandler.call(this, json) : null;
                if (json && json.result == 0) {
                    callback ? callback.call(this, json, true) : null;
                } else {
                    if (json == null){
                        callback ? callback.call(this, json, false) : null;
                        return;
                    }
                    if(!json.resultTip && json.message){
                        json.resultTip = json.message;
                    }
                    showDialogErrorMessage(json.result, json.cmsserver, json.resultTip);
                    callback ? callback.call(this, json, false) : null;
                }
            };
            httpRequest.onerror = function (XHR, textStatus, errorThrown) {
                callback ? callback.call(this, null, false, errorThrown) : null;
            };
            httpRequest.onabort = function () {
                callback ? callback.call(this,null,false) : null;
            }

            httpRequest.ontimeout = function (XHR, textStatus, errorThrown) {
                callback ? callback.call(this, null, false, 'timeout') : null;
            };
            return httpRequest;
        },
        /**
         * 提交数据 （example: $.cms.jsonPost('../user.do?method=addUser',"form1");）
         * @param action 提交路径
         * @param param 需要提交的数据
         * @param form false = 基本类型数据；true = 表单类型数据
         * @param dataType json or jsonp
         * @param callback 回调函数（可选）
         * @param isAPI 是否api调用插件 （可选）showDialogErrorMessage 语言异常
         */
        jsonPost: function (action, param, formType, callback, dataType, isAPI) {
            try {
                if (_getRootFrameAttributes('accountId').accountId && parseInt(_getRootFrameAttributes('accountId').accountId) < 0) {
                    action = $.myajax.handleVehicleAccountParams(action);
                }
            } catch (e) {
                // TODO: handle exception
            }
            $.myajax.init();
            var data = '';
            if (formType) {
                data = JSON.stringify(jQuery('#' + param).serializeObject());
            } else {
                data = JSON.stringify(param);
            }
            var jsonType = 'json';
            if (dataType != null && (typeof dataType) != "undefined") {
                jsonType = dataType;
            }
            this.checkNolessUpload();
            jQuery.post(action, {json: data}, function (json, textStatus, xhr) {
                var csrfToken = xhr.getResponseHeader("csrfToken");
                if (!!csrfToken) {
                    rootElement.csrfToken = csrfToken;
                }
                if (textStatus == 'timeout') {
                    if (isAPI != null && (typeof isAPI) != "undefined") {
                    } else {
                        showDialogErrorMessage(3);
                    }
                    //showErrorMessage(3);
                    callback.call(this, json, false);
                } else if (textStatus == 'error') {
                    if (isAPI != null && (typeof isAPI) != "undefined") {
                    } else {
                        showDialogErrorMessage(1);
                    }
                    callback.call(this, json, false);
                } else if (textStatus == "success") {
                    if (json) {
                        if (json.result == 0) {	//会话无效
                            callback.call(this, json, true);
                        } else {
                            if (isAPI != null && (typeof isAPI) != "undefined") {
                            } else {
                                if(!json.resultTip && json.message){
                                    json.resultTip = json.message;
                                }
                                showDialogErrorMessage(json.result, json.cmsserver, json.resultTip);
                            }
//							showErrorMessage(json.result);
                            callback.call(this, json, false);
                        }
                    } else {
                        callback.call(this, json, false);
                    }
                } else {
                    if (isAPI != null && (typeof isAPI) != "undefined") {
                    } else {
                        showDialogErrorMessage(4);
                    }
                    callback.call(this, json, false);
                }
            }, jsonType).error(
                function () {
                    if (isAPI != null && (typeof isAPI) != "undefined") {
                    } else {
                        showDialogErrorMessage(101, 1);
                    }
                    callback.call(this, "", false);
                }
            );
        },

        /**
         * 获取数据 （example: $.cms.jsonGet('../user.action?id='+_id,function(json){//方法体});）
         * @param action 提交路径
         * @param callback 回调函数
         * @param 需要提交的数据
         * @param form false = 基本类型数据；true = 表单类型数据
         */
        jsonGet: function (action, callback, param, formType) {
            try {
                if (_getRootFrameAttributes('accountId').accountId && parseInt(_getRootFrameAttributes('accountId').accountId) < 0) {
                    action = $.myajax.handleVehicleAccountParams(action);
                }
            } catch (e) {
                // TODO: handle exception
            }
            $.myajax.init();
            var data = '';
            if (formType) {
                data = encodeURIComponent(JSON.stringify(jQuery('#' + param).serializeObject()));
            } else {
                data = encodeURIComponent(JSON.stringify(param));
            }
            $.ajax({
                url: action,
                type: "post",
                data: {json: data},
                cache: false,/*禁用浏览器缓存*/
                dataType: "json",
                success: function (json, textStatus, xhr) {
                    var csrfToken = xhr.getResponseHeader("csrfToken");
                    if (!!csrfToken) {
                        rootElement.csrfToken = csrfToken;
                    }
                    if (json.result == 0) {
                        callback.call(this, json, action, true);
                    } else {
                        if(!json.resultTip && json.message){
                            json.resultTip = json.message;
                        }
                        showDialogErrorMessage(json.result, json.cmsserver, json.resultTip);
//						showErrorMessage(json.result);
                        callback.call(this, json, action, false);
                    }
                }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (textStatus != "error") {
                        //alert(parent.lang.errSendRequired + " errorThrown:" + errorThrown + ",textStatus:" + textStatus);
                    }
                    callback.call(this, null, action, false);
                }
            });
        },

        /**
         * 获取数据 （example: $.cms.jsonGet('../user.action?id='+_id,function(json){//方法体});）
         * @param action 提交路径
         * @param callback 回调函数
         * @param 需要提交的数据
         * @param form false = 基本类型数据；true = 表单类型数据
         */
        jsonGetEx: function (action, callback, pagin, parameter) {
            try {
                if (_getRootFrameAttributes('accountId').accountId && parseInt(_getRootFrameAttributes('accountId').accountId) < 0) {
                    action = $.myajax.handleVehicleAccountParams(action);
                }
            } catch (e) {
                // TODO: handle exception
            }
            $.myajax.init();
            var page = encodeURIComponent(JSON.stringify(pagin));
            var parm = encodeURIComponent(JSON.stringify(parameter));
            this.checkNolessUpload();
            $.ajax({
                url: action,
                type: "post",
                data: {pagin: page, json: parm},
                cache: false,/*禁用浏览器缓存*/
                dataType: "json",
                success: function (json) {
                    if (json.result == 0) {
                        callback.call(this, json, action, true);
                    } else {
                        if(!json.resultTip && json.message){
                            json.resultTip = json.message;
                        }
                        showDialogErrorMessage(json.result, json.cmsserver, json.resultTip);
//						showErrorMessage(json.result);
                        callback.call(this, json, action, false);
                    }
                }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (textStatus != "error") {
                        //alert(parent.lang.errSendRequired + " errorThrown:" + errorThrown + ",textStatus:" + textStatus);
                    }
                    callback.call(this, null, action, false);
                }
            });
        },

        /**
         * 获取数据 （example: $.cms.jsonGet('../user.action?id='+_id,function(json){//方法体});）
         * @param action 提交路径
         * @param callback 回调函数
         * @param 需要提交的数据
         */
        jsonPostEx: function (action, callback, pagin, parameter) {
            try {
                if (_getRootFrameAttributes('accountId').accountId && parseInt(_getRootFrameAttributes('accountId').accountId) < 0) {
                    action = $.myajax.handleVehicleAccountParams(action);
                }
            } catch (e) {
                // TODO: handle exception
            }
            $.myajax.init();
            if (pagin != null) {
                var page = encodeURIComponent(JSON.stringify(pagin));
                parameter.push({
                    name: 'pagin',
                    value: pagin
                });
            }
            this.checkNolessUpload();
            var object = $.ajax({
                type: 'post',
                url: action,
                data: parameter,
                dataType: 'json',
                success: function (json) {
                    if (json.result == 0) {
                        callback.call(this, json, action, true);
                    } else {
                        if(!json.resultTip && json.message){
                            json.resultTip = json.message;
                        }
                        showDialogErrorMessage(json.result, json.cmsserver, json.resultTip);
//						showErrorMessage(json.result);
                        callback.call(this, json, action, false, json.result);
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
            return object;
        },
        /**
         * ajax 请求
         */
        sendAjax: function (url, data, callback, contentType, type) {
            try {
                if (_getRootFrameAttributes('accountId').accountId && parseInt(_getRootFrameAttributes('accountId').accountId) < 0) {
                    url = $.myajax.handleVehicleAccountParams(url);
                }
            } catch (ignore) {

            }
            if (!contentType) {
                contentType = "application/x-www-form-urlencoded;charset=UTF-8";
            }
            if (!type) {
                type = "get";
            }
            $.myajax.init();
            $.ajax({
                url: url,
                type: type,
                data: data,
                cache: false,/*禁用浏览器缓存*/
                contentType: contentType,
                dataType: "json",
                success: function (json, textStatus, xhr) {
                    var csrfToken = xhr.getResponseHeader("csrfToken");
                    if (!!csrfToken) {
                        rootElement.csrfToken = csrfToken;
                    }
                    if (json.result == 0) {
                        callback ? callback.call(this, json, true) : null;
                    } else {
                        if(!json.resultTip && json.message){
                            json.resultTip = json.message;
                        }
                        showDialogErrorMessage(json.result, json.cmsserver, json.resultTip);
//						showErrorMessage(json.result);
                        callback ? callback.call(this, json, false) : null;
                    }
                }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (textStatus != "error") {
                        //alert(parent.lang.errSendRequired + " errorThrown:" + errorThrown + ",textStatus:" + textStatus);
                    }
                    callback ? callback.call(this, null, false) : null;
                }
            });
        },

        /**
         * ajax get 请求
         */
        get: function (url, data, callback) {
            this.sendAjax(url, data, callback, '', 'get');
        },

        /**
         * ajax post 请求
         * contentType: application/x-www-form-urlencoded;charset=UTF-8
         */
        post: function (url, data, callback) {
            this.sendAjax(url, data, callback, '', 'post');
        },

        /**
         * ajax post 请求
         * contentType: application/json
         */
        postBody: function (url, data, callback) {
            this.sendAjax(url, data, callback, 'application/json', 'post');
        },
        /**
         * JSONP
         * @param type
         * @param url
         * @param data
         * @param successCallback
         * @param errorCallback
         */
        sendJsonP:function (type,url,data, successCallback,errorCallback){
            $.ajax({
                type: type || "get",
                dataType: 'jsonp',
                data: data,
                // jsonp: "callback",
                // jsonpCallback: "QQmap",
                url: url,
                success: function(json) {
                    successCallback ? successCallback.call(this, json) : null;
                },
                error: function(err) {
                    //业务处理
                    errorCallback ? errorCallback.call(this, err) : null;
                }
            })
        },
        /**
         * 清空数据
         */
        cleanTableContent: function (id) {
            $(id + " tr").each(function () {
                if (/^(\w+)\_(\w+)/.test(this.id)) {
                    $(this).remove();
                }
            });
        },

        /**
         * 显示加载度条
         */
        showLoading: function (flag, msg, parentWnd) {
            if (flag) {
                //zindex  最顶层
                if (typeof msg === "undefined") {
                    if (typeof parentWnd === "undefined") {
                        $.dialog({id: 'loading', title: false, content: _getRootFrameAttributes('lang').lang.loading});
                    } else {
                        $.dialog({
                            id: 'loading',
                            title: false,
                            content: _getRootFrameAttributes('lang').lang.loading,
                            parent: parentWnd
                        });
                    }
                } else {
                    if (typeof parent === "undefined") {
                        $.dialog({id: 'loading', title: false, content: msg});
                    } else {
                        $.dialog({id: 'loading', title: false, content: msg, parent: parentWnd});
                    }
                }
                //$.dialog({id:'loading'}).zindex();
            } else {
                $.dialog({id: 'loading'}).close();
            }
        },

        /**
         * 显示顶层的loading
         */
        showTopLoading: function (flag, msg) {
            if (flag) {
                $.dialog({id: 'toploading', title: false, content: msg, lock: true});
            } else {
                $.dialog({id: 'toploading'}).close();
            }
        },

        /**
         * 显示分页组件
         * @param id
         */
        showPagination: function (id) {
            var pagination = new Array();
            pagination.push("			<a id=\"previousPage\" href=\"javascript::\">" + _getRootFrameAttributes('lang').lang.prevPage + "</a>");
            pagination.push("			&nbsp;&nbsp;");
            pagination.push("			<a id=\"nextPage\" href=\"javascript::\">" + _getRootFrameAttributes('lang').lang.nextPage + "</a>");
            pagination.push("			&nbsp;&nbsp;<label class=\"setdateinput\">" + _getRootFrameAttributes('lang').lang.total + " <span id=\"totalPages\">0</span> " + _getRootFrameAttributes('lang').lang.page + " &nbsp;&nbsp;<span id=\"totalRecords\">0</span> " + _getRootFrameAttributes('lang').lang.record + "");
            pagination.push("			&nbsp;&nbsp;" + _getRootFrameAttributes('lang').lang.current + " <input id=\"currentPage\" style=\"width:20px;\" name=\"currentPage\" value=\"0\" type=\"text\" onkeydown=\"return onKeyDownDigit(event);\" maxlength=\"4\" /> " + _getRootFrameAttributes('lang').lang.page + "");
            pagination.push("			&nbsp;<span id=\"hideCurrentPage\" style=\"display:none\"></span></label>");
            pagination.push("			<label class=\"setdateinput\"><button type=\"submit\" id=\"goPage\" name=\"goPage\">" + _getRootFrameAttributes('lang').lang.go + "</button></label>");
            $(id).html(pagination.join(''));
        },


        /**
         * 分页初始化组件
         * @param action 提交路径
         * @param pagination 分页信息
         * @param checkcallback 检测回调函数，如果返回false，则不会再发送ajax请求，函数参数isCheck，为true表示进行检查，为false，则需要配置查询的标志位为true，避免重复请求
         * @param param 请求参数
         * @param ajaxcallback ajax处理回调函数
         */
        initPagination: function (action, pagination, checkcallback, ajaxcallback, param) {
            $(pagination.id).find('#totalPages').text(pagination.totalPages);
            $(pagination.id).find('#totalRecords').text(pagination.totalRecords);
            $(pagination.id).find('#currentPage').val(pagination.currentPage);
            $(pagination.id).find('#hideCurrentPage').text(pagination.currentPage);

            // 上一页
            $(pagination.id).find('#previousPage').unbind('click').bind("click", pagination, function () {
                if (!checkcallback.call(null, true)) {
                    return;
                }

                if (pagination.hasPreviousPage) {
                    checkcallback.call(null, false);
                    $.myajax.cleanTableContent(pagination.tableId);
                    $.myajax.showLoading(true);
                    pagination.currentPage = pagination.previousPage;
                    if (typeof param != "undefined") {
                        $.myajax.jsonGetEx(action, ajaxcallback, pagination, param);
                    } else {
                        $.myajax.jsonGet(action, ajaxcallback, pagination);
                    }
                } else {
                    alert(_getRootFrameAttributes('lang').lang.hasReachedHome);
                }
            });

            // 下一页
            $(pagination.id).find('#nextPage').unbind('click').bind("click", pagination, function () {
                if (!checkcallback.call(null, true)) {
                    return;
                }

                if (pagination.hasNextPage) {
                    checkcallback.call(null, false);
                    $.myajax.cleanTableContent(pagination.tableId);
                    $.myajax.showLoading(true);
                    pagination.currentPage = pagination.nextPage;
                    if (typeof param != "undefined") {
                        $.myajax.jsonGetEx(action, ajaxcallback, pagination, param);
                    } else {
                        $.myajax.jsonGet(action, ajaxcallback, pagination);
                    }
                } else {
                    alert(_getRootFrameAttributes('lang').lang.hasReachedEnd);
                }
            });

            // 跳转页码事件
            $(pagination.id).find('#goPage').unbind('click').bind("click", pagination, function () {
                if (!checkcallback.call(this, true)) {
                    return;
                }

                var goPage = $(pagination.id).find('#currentPage').val();
                if (goPage <= 0) {
                    alert(_getRootFrameAttributes('lang').lang.pageZoneUnvalid);
                    return;
                }
                if (goPage > pagination.totalPages) {
                    alert(_getRootFrameAttributes('lang').lang.pageOverRange);
                    return;
                }

                checkcallback.call(this, false);
                $.myajax.cleanTableContent(pagination.tableId);
                $.myajax.showLoading(true);
                pagination.currentPage = Number(goPage);
                if (typeof param != "undefined") {
                    $.myajax.jsonGetEx(action, ajaxcallback, pagination, param);
                } else {
                    $.myajax.jsonGet(action, ajaxcallback, pagination);
                }
            });
        },
        /**
         * 统一处理车牌号登录后的url参数问题
         */
        handleVehicleAccountParams: function (url) {
            //处理查询车辆url
            if (url.indexOf('StandardLoginAction_loadCompanyList.action') > -1) {
                if (url.indexOf('own=1') == -1) {
                    url = url.replace('own=0', 'own=1')
                }
                if (url.indexOf('&own=') == -1 && url.indexOf('?own=') == -1) {
                    if (url.indexOf('?') > -1) {
                        url = url + '&own=1'
                    } else {
                        url = url + '?own=1'
                    }
                }
                if (url.indexOf('team=1') > -1) {
                    url = url.replace('team=1', 'team=0')
                }
            }

            return url;
        },
        /**
         * 校验是否存在上传的无用图片
         */
        checkNolessUpload:function () {
            if (typeof WebUploaderUtil === 'undefined') return;
            try {
                for(var key in window){
                    if (key === 'that'){
                        continue;
                    }
                    if(window[key] instanceof WebUploaderUtil){
                        window[key].clearUselessPictures();
                    }
                }
            }catch (e) {

            }
        },


    };
})(jQuery);