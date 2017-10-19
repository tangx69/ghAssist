window.console.log("script脚本被加载");

var HTML_SELECTED_LI = ".";

var ysNmae = "张三";
var doSearch = "false";
var ysName = "";
var ysType = 0;
var timeType = 0;
var tps = 0;
var timer = null;
var searchTimes = 0;
var htmlLoaded = false;
var selected = {};

var SCRIPT_STEP = 1;

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

$(document).ready(function() {
    //加载完成之后，请求数据
    var URL = window.location.href;
    window.console.log(URL);

    htmlLoaded = true;
    if (URL.indexOf("guahao.zjol.com.cn/pb/") > 0) {
        SCRIPT_STEP = 1;
        initHtml();
        //selectReq();
    }

    if (URL.indexOf("guahao.zjol.com.cn/getHyInfo/") > 0) {
        SCRIPT_STEP = 2;
        window.console.log("时间选择页面");
    }
});

function initHtml() {
    var uls = $("#pbxx ul.clearfix");
    var index = 1;
    uls.each(function() {
        $(this)
            .children("li")
            .each(function() {
                this.id = index++;
                //window.console.log( this.id+ this.textContent)

                //单元格点击变色
                $(this).click(function() {
                    //alert(this.id + "clicked");
                    if (this.id % 8 == 1) {
                        if ($(this).html() == HTML_SELECTED_LI) {
                            //$(this).css({"color":"red"});
                            $(this).html("");
                            $(this).css("background", "white");
                            $(this).css("align", "center");
                            selected[this.id] = null;
                        } else {
                            $(this).html(HTML_SELECTED_LI);
                            $(this).css("background", "green");
                            $(this).css("align", "center");
                            selected[this.id] = HTML_SELECTED_LI;
                        }

                        selectSave();
                    }
                });
            });
    });
}

function handleSelected() {
    for (var id in selected) {
        var idStr = sprintf("#%s", id);
        if (selected[id] == HTML_SELECTED_LI) {
            $(idStr).html(HTML_SELECTED_LI);
            $(idStr).css("background", "green");
            $(idStr).css("align", "center");
        } else {
            $(idStr).html("");
            $(idStr).css("background", "white");
            $(idStr).css("align", "center");
        }
    }
}

function selectSave() {
    var msg1 = {
        evt: "selectSave",
        data: {
            selected: {}
        }
    };
    msg1.data.selected = selected;
    chrome.extension.sendMessage(msg1, function(response) {
        //console.log(response.farewell);
    });
}

function selectReq() {
    chrome.extension.sendMessage({ evt: "selectReq" }, function(response) {
        selected = response.data.selected;
        handleSelected();

        if (response.data.doSearch != doSearch) {
            doSearch = response.data.doSearch;
            if (doSearch == "true") {
                window.console.log("数据查询结束,开启定时器");
                doSearch = response.data.doSearch;
                startSearchInterval(tps);
            } else {
                stopSearchInterval();
            }
        }
    });
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.evt == "searchReq") {
        //收到查询请求，请求数据
        window.console.log("script收到查询请求，请求数据");
        alert("script收到查询请求，请求数据");
        selectReq();
    }
});

function startSearchInterval(_tps) {
    stopSearchInterval();
    window.console.log("新的查询定时器已开启");
    intervel = Math.max(500, 1000 / _tps);
    timer = window.setInterval(function() {
        onSearchInterval();
    }, 1000 / 1);
}

function stopSearchInterval() {
    if (timer != null) {
        clearInterval(timer);
        timer = null;
        window.console.log("旧的查询定时器已停止");
    }

    searchTimes = 0;
}

function onSearchInterval() {
    if (doSearch == "true" && htmlLoaded == true) {
        search();
    } else {
        if (doSearch != "true") {
            window.console.log("查询关闭");
        }
        if (htmlLoaded != "true") {
            window.console.log("页面还未加载完成");
        }
    }
}

window.setInterval(function() {
    if (SCRIPT_STEP == 1) {
        selectReq();
    }

    if (SCRIPT_STEP == 2) {
        chooseTime();
    }

    if (SCRIPT_STEP == 3) {
        confirm();
    }
}, 1000 / 1);

function chooseTime() {
    var lis = $("input[type=radio][name='hyGroup']");
    var selected = false;
    lis.each(function() {
        if (
            $(this).attr("qhsj") >= "1340" &&
            $(this).attr("qhsj") <= "1540" &&
            !selected
        ) {
            SCRIPT_STEP = 3;
            selected = true;
            //$(this).attr('checked','true');
            $(this).click();
            $("#next").click();
        }
    });
}

function confirm() {
    var msg = {
        evt: "playSound",
        data: {
            soundName: "remind"
        }
    };
    chrome.extension.sendMessage(msg, function(response) {
        //console.log(response.farewell);
    });
}

function search() {
    searchTimes = searchTimes + 1;
    window.console.log("开始第" + searchTimes + "次查询");

    var hasFind = false;
    for (var id in selected) {
        var idStr = sprintf("#%s", parseInt(id) + 7);
        if (selected[id] == HTML_SELECTED_LI) {
            if ($(idStr).attr("class") == "kyy") {
                stopSearchInterval();
                hasFind = true;
                $(idStr).click();
            } else {
                window.console.log(idStr + "不能预约");
            }
        }
    }
    if (hasFind) {
    } else {
        //window.location.reload();
        window.console.log("刷新界面");
    }
}
