// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function sprintf() {
    var arg = arguments,
        str = arg[0] || "",
        i,
        n;
    for (i = 1, n = arg.length; i < n; i++) {
        str = str.replace(/%s/, arg[i]);
    }
    return str;
}

function dataReq() {
    chrome.extension.sendMessage({ evt: "dataReq" }, function(response) {
        var selectorStr = sprintf(
            "input:radio[name='ysType'][value='%s']",
            response.data.ysType
        );
        $(selectorStr).attr("checked", "true");

        var selectorStr = sprintf(
            "input:radio[name='timeType'][value='%s']",
            response.data.timeType
        );
        $(selectorStr).attr("checked", "true");

        $("#start").attr("disabled", response.data.doSearch == "true");
        $("#stop").attr("disabled", response.data.doSearch == "false");
    });
}

window.onload = function() {
    dataReq();

    var btn1 = $("#start");
    btn1.click(function() {
        $("#start").attr("disabled", true);
        $("#stop").attr("disabled", false);

        var ysType = $("input:radio[name='ysType']:checked").val();
        var ysName = $("#ysName").val();
        var timeType = $("input:radio[name='timeType']:checked").val();
        var tps = $("#tps").val(); //times per second,每秒查询几次
        /*
        var msg1 = {
            evt: "datachangeReq",
            data: {
                ysType: ysType,
                timeType: timeType,
                ysName: ysName,
                tps: tps
            }
        };
        chrome.extension.sendMessage(msg1, function(response) {
            //console.log(response.farewell);
        });
*/

        var msg2 = { evt: "searchReq" };
        chrome.extension.sendMessage(msg2, function(response) {
            //console.log(response.farewell);
        });
    });

    var btnStop = $("#stop");
    btnStop.click(function() {
        $("#start").attr("disabled", false);
        $("#stop").attr("disabled", true);

        var msg1 = { evt: "stopReq" };
        chrome.extension.sendMessage(msg1, function(response) {
            //console.log(response.farewell);
        });
    });
};
