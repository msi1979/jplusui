﻿

Demo.jsonp = function (path, data, onSuccess) {
    Ajax.send({
        url: Demo.Configs.serverRootUrl + path,
        dataType: "jsonp",
        data: data,
        success: onSuccess,
        error: function () {
            var r = 'startserver.bat';
            if (navigator.platform.indexOf("Win") === -1) {
                r = 'startserver.sh';
            }
            alert("无法连接到代理服务器\r\n请求地址: " + Demo.Configs.serverRootUrl + path + '\r\n请运行 [项目跟目录]/' + r);
        },
        timeout: 1000
    });
};

Demo.submit = function (path, data, target) {
    var form = Dom.create('form');
    form.setAttr('action', Demo.Configs.serverRootUrl + path);
    form.setAttr('method', 'post');
    form.setAttr('target', target || '_self');
    form.setHtml('<textarea name="data"></textarea>'); 
    form.find('textarea').setText(JSON.encode(data));
    form.hide().appendTo();
    form.submit();
};