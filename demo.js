/**
 * Created by Airma on 2016/12/12.
 */
var data = {
    "hoeng": {
        name: "测试", disable:true,children: {
            "01": {name: "小类1"},
            "02": {name: "小类2"},
            "03": {name: "小类1"},
            "04": {name: "小类2"},
            "05": {name: "小类1"},
            "06": {name: "小类2"},
            "07": {name: "小类1"},
            "08": {name: "小类2"},
            "09": {name: "小类1"},
            "10": {name: "小类2"},
            "11": {name: "小类1"},
            "12": {name: "小类2"}
        }
    },
    "2dfe": {
        name: "这里面有不可选", children: {
            "04": {
                name: "小类1", children: {
                    "xx": {name: "子类",children:{
                        "01": {name: "小类1"},
                        "02": {name: "小类2"},
                        "03": {name: "小类1"},
                        "04": {name: "小类2"},
                        "05": {name: "小类1"},
                        "06": {name: "不可选的",disable:true},
                        "07": {name: "小类1"},
                        "08": {name: "小类2"},
                        "09": {name: "小类1"},
                        "10": {name: "小类2"},
                        "11": {name: "小类1"},
                        "12": {name: "小类2"}
                    }}
                }
            },
            "05": {name: "小类2"},
            "06": {name: "好长好长的一段文字"},
            "07": {name: "默认选中的"}
        }
    },
    "3fev": {name: "大类3"},
    "4vr": {name: "大类4"},
    "fe5": {
        name: "大类1", children: {
            "01": {name: "小类1"},
            "02": {name: "小类2"}
        }
    },
    "haha": {
        name: "大类2", children: {
            "04": {
                name: "小类1", children: {
                    "xx": {name: "子类"}
                }
            },
            "05": {name: "小类2"},
            "06": {name: "好长好长的一段文字"},
            "07": {name: "小类2"}
        }
    },
    "haha2": {
        name: "大类2", children: {
            "04": {
                name: "小类1", children: {
                    "xx": {name: "子类"}
                }
            },
            "05": {name: "小类2"},
            "06": {name: "好长好长的一段文字"},
            "07": {name: "小类2"}
        }
    },
    "7": {name: "大类3"},
    "8": {name: "大类4"},
    "9": {
        name: "大类2", children: {
            "04": {
                name: "小类1", children: {
                    "xx": {name: "子类"}
                }
            },
            "05": {name: "小类2"},
            "06": {name: "好长好长的一段文字"},
            "07": {name: "小类2"},
            "all": {name: "默认选中的"}
        }
    },
    "10": {name: "大类3"},
    "11": {name: "大类4"},
    "12": {name: "大类3"},
    "13": {name: "默认选中的"},
    "14": {name: "大类3"},
    "15": {name: "大类4"},
    "16": {name: "大类3"},
    "17": {name: "大类4"},
    "18": {name: "写着玩",disable:true},
    "19": {name: "大类4"},
    "20": {name: "大类3"},
    "21": {name: "大类4"},
    "22": {name: "大类3"},
    "23": {name: "大类4"},
    "24": {name: "大类3"},
    "25": {name: "大类4"},
    "26": {name: "大类3"},
    "27": {name: "大类4"},
    "28": {name: "大类3"},
    "29": {name: "大类4"},
    "30": {name: "大类3"},
    "31": {name: "大类4"}
};

var dropDown = $("#dropDown").initCascadeDropDown({
    options:{
        "width":"150px",
        "height":"20px",
        // "size":"14px",
        "paging":7,
        "search":true,
        // "selected":"all",
        "direction":"right",
        "isCategoriesSelected":true,
        "clickCallback":function (data) {
            console.log("标题点击事件");
            console.log(data);
        },
        "selectCallback":function (data) {
            console.log("选中事件");
            console.log(data);
        },
        // "keyupCallback":function (data) {
        //     console.log("keyup事件");
        //     console.log(data);
        // },
        // "keydownCallback":function (data) {
        //     console.log("keydown事件");
        //     console.log(data);
        // }
    },
    data : data
});
dropDown.setCascadeData({"all":"所有维度"});
console.log("获取数据：");
console.log(dropDown.getCascadeData());
console.log("搜索数据："+dropDown.getNameOfValue(18));
