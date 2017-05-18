/**
 * @name jqueryCascadeDropDownJs
 * @author zhuhongwei
 * @version 1.0.0J
 * @lastUpdate 2016-12-13
 * @copyright hhdata
 **/

(function () {

    var dropDownData = null;

    /**
     * 鼠标滚轮时间兼容处理
     */
    var addEvent = (function(window, undefined) {
        var _eventCompat = function(event) {
            var type = event.type;
            if (type == 'DOMMouseScroll' || type == 'mousewheel') {
                event.delta = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
            }
            //alert(event.delta);
            if (event.srcElement && !event.target) {
                event.target = event.srcElement;
            }
            if (!event.preventDefault && event.returnValue !== undefined) {
                event.preventDefault = function() {
                    event.returnValue = false;
                };
            }
            /*
             ......其他一些兼容性处理 */
            return event;
        };
        if (window.addEventListener) {
            return function(el, type, fn, capture) {
                if (type === "mousewheel" && (navigator.userAgent.toUpperCase().indexOf("FIREFOX")!==-1?true:false)) {
                    type = "DOMMouseScroll";
                }
                el.addEventListener(type, function(event) {
                   if(!fn.call(this, _eventCompat(event))){
                       event.preventDefault();
                   }
                }, capture || false);
            }
        } else if (window.attachEvent) {
            return function(el, type, fn, capture) {
                el.attachEvent("on" + type, function(event) {
                    event = event || window.event;
                    if(!fn.call(el, _eventCompat(event))){
                        event.preventDefault();
                    }
                });
            }
        }
        return function() {};
    })(window);

    /**
     * 过滤数据树，用于搜索searchText字段
     * @param data
     * @param searchText
     */
    function filterTree(data, searchText) {
        searchText = searchText.toLowerCase();
        var obj = {};
        $.each(data,function (index, item) {
            if (item.name.toLowerCase().indexOf(searchText) !== -1) {
                obj[index] = item;
            } else if (item.children) {
                if(item.children = filterTree(item.children,searchText)){
                    obj[index] = item;
                }
            } else return true;
        });
        if(Object.keys(obj).length !== 0){
            return obj;
        } else return null;
    }

    /**
     * 将数据分组，用于下拉框分页
     * @param data
     * @param paging
     * @param searchText
     * @return {Array}
     */
    function tree(data,paging,searchText) {
        searchText = searchText || "";
        data = filterTree(data,searchText) || {};
        var length = Object.keys(data).length;
        var pagingObj = [];
        for (var i = 0; i < length/paging; i++){
            pagingObj[i] = {};
            $.each(data,function (index,item) {
                if(Object.keys(pagingObj[i]).length === paging)return false;
                if(item.children){
                    item.children = tree($.extend(true,{},item.children),paging);
                }
                item["id"] = Math.random()*10000;
                item["disable"] = item.disable;
                pagingObj[i][index] = item;
                delete data[index];
            })
        }
        return pagingObj;
    }

    /**
     * 根据数据中的id寻找对应的children数据
     * @param data
     * @param id
     * @return {*}
     */
    function getDataForId(data,id) {
        var result = null;
        for (var i =0 ;i < data.length ;i++){
            $.each(data[i],function (index,item) {
                if(item.id == id){
                    result =item.children;
                    return false;
                }
                else if(item.children){
                    result = getDataForId(item.children,id);
                    if(result) return false;
                }
            });
            if (result) break;
        }
        return result;
    }

    /**
     * 根据数据中的value寻找对应的name文本
     * @param value
     * @param data
     * @return {*}
     */
    function getNameOfValue(value,data) {
        var result = null;
        data = data || dropDownData;
            $.each(data,function (index,item) {
                if(index == value){
                    result =item.name;
                    return false;
                }
                else if(item.children){
                    result = getNameOfValue(value,item.children);
                    if(result) return false;
                }
            });
        return result;
    }

    /**
     * 选中样式
     * @param selectEle
     * @param first
     * @param $ele
     * @param $thisCascadeBody
     * @param $thisCascadeTitle
     * @return {boolean}
     */
    var selectedStyle = function(selectEle,first,$ele,$thisCascadeBody,$thisCascadeTitle) {
        if(first) $ele.find(".cascade-selected").removeClass("cascade-selected");
        if(!selectEle){
            var dom = $thisCascadeBody.find(".cascade-text");
            var titleValue = $thisCascadeTitle.find(".cascade-text").attr("value") || $thisCascadeTitle.find(".cascade-search").attr("value");
            if (titleValue) $.each(dom, function (index, item) {
                if ($(item).attr("value") == titleValue) {
                    selectEle = $(item);
                    return false;
                }
            });
        }
        if(!selectEle) return false;
        selectEle.addClass("cascade-selected");
        if(selectEle.attr("for")){
            selectedStyle(selectEle.parent().parent().parent().find(">.cascade-text"),false,$ele,$thisCascadeBody,$thisCascadeTitle);
        }
    };

    /**
     * 初始化搜索模块
     * @param OptionSearch
     * @param $dom
     * @param cascadeText
     * @param eventCallback
     * @param placeholder
     * @return {boolean}
     */
    function initSearch(OptionSearch,$dom,cascadeText,eventCallback,placeholder) {
        if(!OptionSearch) {
            $(cascadeText).appendTo($dom);
            return false;
        }
        var cascadeSearch = "<input type='text' placeholder='"+placeholder+"' class='cascade-search'>";
        var $cascadeSearch = $(cascadeSearch).appendTo($dom);
        eventCallback($cascadeSearch,6);
    }

    /**
     * 获取下拉框参数
     * @return {{}}
     */
    function getCascadeData() {
        var $ele = this;
        var $textEle = $ele.find(".cascade-title").find(".cascade-text");
        var $searchEle = $ele.find(".cascade-title").find(".cascade-search");
        var $selectEle = $textEle.length?$textEle:$searchEle;
        return {value:$selectEle.attr("value"),name:$selectEle.text() || $selectEle.val()};
    }

    /**
     * 设置选中数据
     * @param data
     */
    function setCascadeData(data) {
        var $ele =this;
        var $thisCascadeBody = $ele.find(".cascade-body");
        var $thisCascadeTitle = $ele.find(".cascade-title");
        if( typeof data !== "object" ){
            var newData={};
            newData[data]= getNameOfValue(data);
            data =newData;
        }
        var key = Object.keys(data)[0];
        var searchDom = $ele.find(".cascade-title").find(".cascade-search");
        if(searchDom.length){
            searchDom.val(data[key]).attr("value",key);
        }else $ele.find(".cascade-title").find(".cascade-text").text(data[key]).attr("value",key);
        selectedStyle(null,true,$ele,$thisCascadeBody,$thisCascadeTitle);
    }

    /**
     * 初始化下拉框方法
     * @param params
     */
    function initCascadeDropDown(params) {
        dropDownData = params.data;
        var options = {
            "width":"auto",
            "height":"20px",
            "search":true,
            "paging":20,
            "direction":"right",
            "placeholder":"Search...",
            "isCategoriesSelected":true,
            "clickCallback":null,
            "selectCallback":null,
            "keyupCallback":null,
            "keydownCallback":null
        };
        options = $.extend(true,options,params.options);
        var $ele = this.css({
            "width":options.width,
            "height":options.height,
            "font-size":options.size || options.height,
            "line-height":options.height,
            "position":"relative"
        }).text("");
        var data = tree($.extend(true,{},params.data),options.paging);
        var pagingNum = 0; //分页计数
        var inputFlag = true; //input状态
        var cascadeTitle = "<div class='cascade-title'></div>";
        var cascadeBody = "<div class='cascade-body cascade-body-"+options.direction+"'></div>";
        var cascadeItem = "<div class='cascade-item'></div>";
        var cascadeText = "<div class='cascade-text'></div>";
        var cascadeItemBox = "<div class='cascade-item-box cascade-"+options.direction+"'></div>";
        var $thisCascadeTitle = $(cascadeTitle).appendTo($ele);
        initSearch(options.search,$thisCascadeTitle,cascadeText,event,options.placeholder);
        var $thisCascadeBody = $(cascadeBody).appendTo($ele);
        event($ele,7);

        function event (eventEle,flag) { //事件
            switch (flag){
                case 0: //选中事件
                    eventEle.on("click",function () {
                        var name = eventEle.text();
                        var value = eventEle.attr("value");
                        if(options.search) {
                            $ele.find(".cascade-title").find(".cascade-search").val(name).attr("value",value);
                        } else $ele.find(".cascade-title").find(".cascade-text").text(name).attr("value",value);
                        $thisCascadeBody.hide();
                        selectedStyle(eventEle,true,$ele,$thisCascadeBody,$thisCascadeTitle);
                        inputFlag = true;
                        $thisCascadeTitle.addClass("cascade-title-open");
                        if(options.selectCallback){
                            var callbackData = {name:name,value:value};
                            options.selectCallback(callbackData);
                        }
                    });
                    break;
                case 1: //点击title弹出下拉框
                    eventEle.on("click",function () {
                        $thisCascadeBody.toggle();
                        eventEle.toggleClass("cascade-title-open");
                        if(options.clickCallback) {
                            var callbackData = {};
                            callbackData["name"] = eventEle.find(".cascade-text").text() || eventEle.find(".cascade-search").val();
                            callbackData["value"] = eventEle.find(".cascade-text").attr("value") || eventEle.find(".cascade-search").attr("value");
                            options.clickCallback(callbackData);
                        }
                    });
                    break;
                case 2: //鼠标移入子项事件
                    eventEle.on("mouseenter",function () {
                        var $box = eventEle.find("> .cascade-item-box").show();
                        if($box.length == 0) return ;
                        if($box.css("transform") !== "none") return;
                        var offsetTop = $box.offset().top;
                        var height = offsetTop + $box[0].offsetHeight;
                        var parentHeight = eventEle.parent().offset().top + eventEle.parent()[0].offsetHeight;
                        if (height>parentHeight){  //判断子类超出屏幕边界的问题
                            var transformValue = height-parentHeight;
                            transformValue = (offsetTop-transformValue)<0?transformValue-(transformValue-offsetTop):transformValue;
                            var cssText = "translateY(-"+(transformValue).toString()+"px)";
                            $box.css('transform',cssText);
                        }
                    });
                    break;
                case 3://鼠标移出子项事件
                    eventEle.on("mouseleave",function () {
                        eventEle.find("> .cascade-item-box").hide();
                    });
                    break;
                case 4://第一层滚轮事件
                    addEvent(eventEle[0], "mousewheel", function(event) {
                        if(event.delta<0){
                            if(pagingNum < data.length -1) {
                                pagingNum++;
                                initDom(data[pagingNum], true);
                                selectedStyle(null,true,$ele,$thisCascadeBody,$thisCascadeTitle);
                            }
                        } else {
                            if(pagingNum > 0){
                                pagingNum--;
                                initDom(data[pagingNum],true);
                                selectedStyle(null,true,$ele,$thisCascadeBody,$thisCascadeTitle);
                            }
                        }
                        return false;
                    });
                    break;
                case 5://子层滚轮事件
                    addEvent(eventEle[0], "mousewheel", function(event) {
                    var id = eventEle.attr("for");
                    var index = eventEle.attr("index");
                    var childrenData = getDataForId(data,id);
                        if(event.delta<0){
                            if(index < childrenData.length -1) {
                                index++;
                                InitChildren(childrenData[index],index,id,eventEle.parent().parent().parent(),true,true);
                                selectedStyle(null,true,$ele,$thisCascadeBody,$thisCascadeTitle);
                            }
                        } else {
                            if(index > 0){
                                index--;
                                InitChildren(childrenData[index],index,id,eventEle.parent().parent().parent(),true,true);
                                selectedStyle(null,true,$ele,$thisCascadeBody,$thisCascadeTitle);
                            }
                        }
                        return false;
                    });
                    break;
                case 6://搜索事件
                    eventEle.on("keyup", function () {
                        var searchText = $(this).val() || $(this).find(".cascade-search").val();
                        data = tree($.extend(true,{},params.data),options.paging,searchText);
                        var status = data.length>1?1:0;
                        initDom(data[0], status);
                        selectedStyle(null,true,$ele,$thisCascadeBody,$thisCascadeTitle);
                        $thisCascadeBody.show();
                        $thisCascadeTitle.addClass("cascade-title-open");
                        inputFlag = false;
                        if(options.keyupCallback)options.keyupCallback(data);
                    });
                    if(options.keydownCallback){
                        eventEle.on("keydown", function () {
                            var searchText = $(this).val() || $(this).find(".cascade-search").val();
                            data = tree($.extend(true,{},params.data),options.paging,searchText);
                            options.keydownCallback(data);
                        });
                    }
                    break;
                case 7: //鼠标移出菜单收回
                    var timer = null ; //用于误操作判断
                    eventEle.on("mouseleave",function () {
                        timer = window.setTimeout(function () {
                            $thisCascadeBody.hide();
                            $thisCascadeTitle.removeClass("cascade-title-open");
                            if(options.search && !inputFlag){  //如果存在搜索框的话需要将值重置
                                $thisCascadeTitle.find(".cascade-search").val("").attr("value","");
                                data = tree($.extend(true,{},params.data),options.paging,"");
                                var status = data.length>1?1:0;
                                initDom(data[0], status);
                                selectedStyle(null,true,$ele,$thisCascadeBody,$thisCascadeTitle);
                            }
                        },800);
                    });
                    eventEle.on("mouseenter",function () {
                        clearTimeout(timer);
                    });
                    break;
                default:break;
            }
        }

        /**
         * 渲染子类
         * @param children {object} 渲染需要数据
         * @param arrayIndex {number} 渲染数据的数组位置，数据的分组已根据翻页需要进行了格式化
         * @param id {number/string} 记录所渲染子类的位置 (记录深度的一个记号)
         * @param parentEle {object} 渲染的dom位置
         * @param status {Boolean} 是否需要翻页
         * @param eventStatus {Boolean} 是否是由事件触发渲染
         * @constructor
         */
        var InitChildren = function (children,arrayIndex,id,parentEle,status,eventStatus) {
            parentEle.find(".cascade-item-box").remove();
            var $itemBox = $(cascadeItemBox).appendTo(parentEle);
            var childrenEle;
            var textEle;
            $.each(children,function (index, item) {
                childrenEle = $(cascadeItem).appendTo($itemBox);
                textEle = $(cascadeText).appendTo(childrenEle).text(item.name).attr({"value":index,"for":id,"index":arrayIndex});
                event(childrenEle,2);
                event(childrenEle,3);
                if(item.disable){
                    textEle.addClass("cascade-disable");
                }else event(textEle,0);
                if(status) event(textEle,5);
                if (item.children) {
                    childrenEle.addClass('cascade-item-'+options.direction);
                    if(item.children.length && item.children.length>1){
                        InitChildren(item.children[0],0,item.id,childrenEle,true,false);
                    } else {
                        InitChildren(item.children[0],0,item.id,childrenEle,false,false);
                    }
                }
            });
            if(status){
                childrenEle = $(cascadeItem).appendTo($itemBox);
                textEle = $(cascadeText).appendTo(childrenEle).text("←滚动翻页→").addClass("cascade-paging");
                event(textEle,4);
            }
            if(eventStatus) $itemBox.mouseenter();
        };

        /**
         * 渲染第一层dom结构
         * @param data 渲染用的数据
         * @param status 是否需要翻页
         */
        function initDom(data,status) {
            var parentEle;
            var textEle;
            $thisCascadeBody.text("");
            $.each(data,function (index, item) {
                parentEle = $(cascadeItem).appendTo($thisCascadeBody);
                textEle = $(cascadeText).appendTo(parentEle).text(item.name).attr("value",index);
                event(parentEle,2);
                event(parentEle,3);
                if(item.disable){
                    textEle.addClass("cascade-disable");
                }else if(options.isCategoriesSelected) event(textEle,0);
                if(status) event(textEle,4);
                if(item.children){
                    parentEle.addClass('cascade-item-'+options.direction);
                    if(item.children.length && item.children.length>1){
                        InitChildren(item.children[0],0,item.id,parentEle,true,false);
                    } else {
                        InitChildren(item.children[0],0,item.id,parentEle,false,false);
                    }
                }
            });
            if(status){
                parentEle = $(cascadeItem).appendTo($thisCascadeBody);
                textEle = $(cascadeText).appendTo(parentEle).text("←滚动翻页→").addClass("cascade-paging");
                event(textEle,4);
            }
        }

        if(data.length && data.length>1){
            initDom(data[pagingNum],true);
        } else{
            initDom(data[pagingNum],false);
        }
        if (options.selected) $ele.setCascadeData(options.selected);
        selectedStyle(null,true,$ele,$thisCascadeBody,$thisCascadeTitle);
        event($thisCascadeTitle,1);

        // this.getCascadeData = getCascadeData; //获取当前选中的数据
        // this.setCascadeData = setCascadeData; //设置选中数据
        this.getNameOfValue = getNameOfValue; //根据value查找name
        return this
    }

    $.fn.extend({
        "initCascadeDropDown": initCascadeDropDown, //初始化下拉框
        "getCascadeData": getCascadeData, //获取选中的数据
        "setCascadeData": setCascadeData, //设置选中数据
    })
})();