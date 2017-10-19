chrome.browserAction.onClicked.addListener(() => {
    //app icon on click+
    alert("chrome.browserAction.onClicked");
});

//background.js中的数据一直存在，直到关闭浏览器或者停止插件。
var doSearch = "false";
var ysName = "";
var ysType = 0;
var timeType = 0;
var tps = 1;
var selected = {};

var SCRIPT_STEP = 1;

$(document).ready(function() {
    //$("#remind").play();
});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.evt == "datachangeReq") {
        timeType = request.data.timeType;
        ysName = request.data.ysName;
        ysType = request.data.ysType;
        tps = request.data.tps;
        //window.console.log(
        alert(
            "[开始查询]" +
                "医师类型:" +
                ysType +
                "医师姓名:" +
                ysName +
                "时间类型:" +
                timeType +
                "每秒查询次数:" +
                tps
        );
    }
});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.evt == "searchReq") {
        window.console.log("background收到开始请求");
        doSearch = "true";
    }

    if (request.evt == "stopReq") {
        window.console.log("background收到停止请求");
        doSearch = "false";
    }

    if (request.evt == "dataReq") {
        var bSearch = doSearch;
        var msg = {
            evt: "dataRes123",
            data: {
                ysType: ysType,
                ysType: ysType,
                timeType: timeType,
                doSearch: bSearch
            }
        };
        sendResponse(msg);
    }

    if (request.evt == "selectSave") {
        selected = request.data.selected;
    }

    if (request.evt == "selectReq") {
        var msg = {
            evt: "selectReq",
            data: { selected: selected, doSearch: doSearch }
        };
        sendResponse(msg);
    }

    if (request.evt == "playSound") {
        var soundName = request.data.soundName;

        $("embed").remove();
        $("body").append(
            '<embed src="sound/remind.mp3" autostart="true" hidden="true" loop="false">'
        );
    }
});
