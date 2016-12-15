# jquery.cascadeDropDown.js ---多级级联下拉框 #
依赖于jquery库

+ #### 插件版本 ####
  - V1.0.0

+ #### 组件特点 ####
  - 无限级联，主要用于展示包涵大类、小类，或者子类的数据。
  - 支持模糊搜索、鼠标滑轮滚动翻页、级联方向调整功能。
  - 支持通过API来控制组件
  - 支持事件回调自定义
  
+ #### 需求环境 ####
  - 测试jQuery版本：3.0.0，理论1.7.2以上
  - ie9及以上版本，及现主流浏览器（chrome，firefox等）

+ #### 下载地址 ####


+ #### DEMO: ####
````
HTML:
 <link rel="stylesheet" type="text/css" href="src/CascadeDropDown.css">
 <script src="src/jquery-3.1.1.min.js"></script>
 <script src="src/CascadeDropDown.js"></script>
JS:
$("#dropDown").initCascadeDropDown({  //尽量使用ID来初始化下拉框
    options:{
        "width":"150px", //插件宽度
        "height":"30px", //插件高度
        "size":"20px",   //插件缩放
        "paging":7,      //每页呈现多少条数据
        "search":true,   //是否开启搜索功能
        "selected":"001001",  //默认选中值
        "direction":"right",  //级联朝向（方向）
        "placeholder":"请选择", //搜索框占位符
        "isCategoriesSelected":true,  //第一大类是否可选
        "clickCallback":function (data) { //事件回调
            console.log("标题点击事件");
            console.log(data);
        },
        "selectCallback":function (data) {
            console.log("选中事件");
            console.log(data);
        }
    },
    data : data  //呈现的数据
});
````
![效果](http://i.imgur.com/orBgwW7.jpg)

+ #### data数据格式示范： ####
````
{
    "7": {name: "大类3"，disable:true},       
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
            "xba": {name: "xbox"},
            "001001": {name: "ps4"},
            "all": {name: "默认选中的"}
        }
    }
}
注意：属性名为当前项的value值，嵌套的子类放在children字段内，需要禁用的选项请设置disable:true
````

+ #### 配置参数 ####
|参数名称 |参数类型|默认值|描述|
| -------------|:-------------: |:-------------:|:-----|
| width |string| auto|组件的宽度，可以传css中width的所有值|
| height |string| 20px|组件的高度，可以传css中width的所有值|
| size |string| 根据height自适应|组件的缩放，包括字体和图形大小，最小设为12|
| paging |int| 15|每页所展示选项的数量|
| search |Boolean| true|是否开启搜索功能|
| selected |string| null|默认选中项，传入选项的value值|
| direction |string| right|级联朝向，可选择向左展开|
| placeholder |string| "Search..."|搜索框的占位符，不开启搜索功能时此值无效|
| isCategoriesSelected |Boolean|true |第一大类是否需要选中，不影响子类|
| clickCallback |function|null |点击组件标题的事件回调，返回当前选中的参数（data）|
| selectCallback |function|null |选中动作的事件回调，返回当前选中的参数（data）|
| keyupCallback |function|null |搜索时按键放开的事件回调，返回当前搜索到的数据（data）|
| keydownCallback |function|null |搜索时按键按下的事件回调，返回当前搜索到的数据（data）|

+ #### API ####
|接口名称 |参数|调用方式|描述|
| -------------|:-------------: |:-------------:|:-----|
| initCascadeDropDown |配置和数据| juqery实例调用|初始化组件|
| getCascadeData |无| juqery实例调用|获得当前组件选中的值|
| setCascadeData |string/int/object| juqery实例调用|设置组件选中值：1.传入string/int类型，组件会自动选中当前数据中存在的项。2.通过object（例：{"0x11":"选中"}）可强制选中当前数据中不存在的项|
| getNameOfValue |string/int| 只能通过initCascadeDropDown返回值调用|根据value值查找组件中的文本|