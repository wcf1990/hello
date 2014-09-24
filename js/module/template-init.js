/**
 * @author SHY2850
 * @namespace template-init
 * @requires: template 
 * @version 2.0
 * @description 使用handlebars初始化数据,将结果填充到指定选择器的dom
 */
define(function(require, exports, module) {
    var $ = jQuery, base = {
        append: false,
        sourceMethod : "get",
        sourceData : function(){
            return {};
        },
        page:{size:'page.size',to:'page.pn'},
        nonResult : '<div class="no-content" style="padding-top: 150px;"><span class="nocon-bid"></span><span class="nocon-detail">暂无内容！</span></div>'
    };

    /**
     * 创建自定义操作标签。
    **/
    Handlebars.registerHelper('division', function(a, b) {
        return a / b;
    });

    
    /**
     * @name T
     */
    return {
        __simple__ : function(o,first){
            if( typeof o.begin === "function" ){
                o.begin.call(this,o,first);
            }

            var tpl = $(o.tmpl).html();
            var target = $(o.target);
            var html =  Handlebars.compile( tpl )(o.source),
                dom = $("<div>"+html+"</div>");
            var currentPage = dom.children(".currentPage").hide().html(),
                totalPage = Math.ceil( dom.children(".totalPage").hide().html() );
            
            $(o.pagination).hide(); //先隐藏分页组件
            if(totalPage === 0 ){
                dom.html( o.nonResult );
            }

            if(o.prepend){
                target.prepend( dom.html() );
            }else{
                o.append ? target.append( dom.html() ) : target.html( dom.html() );
            }

            var p = null;
            if( o.pagination ){
                require(['form-style'],function(){
                    if( totalPage != "0" ){
                        $(o.pagination).show();
                    }
                    o.url = location.href.replace( new RegExp('([?])?[&]?'+o.page.to+'=\\w*&?'),"$1");
                    p = $(o.pagination).toPager({
                        currentPage: Math.floor(currentPage) || 1,    // 默认选中的页码
                        totalPage: totalPage | 0      // 总页数
                    },!first);
                    
                    if( typeof o.callback === "function" ){
                        o.callback.call(this,o,p,first);
                    }else if(p && first){
                        p.on("switch",function(event,e){
                            location.href = o.url + ( o.url.indexOf("?") > -1 ? ("&"+o.page.to+"=" + e.toPage) : ("?"+o.page.to+"=" + e.toPage) );
                        });
                    }
                });
            }
                
        },
        __ajax__ : function(o,first){
            var tpl = $(o.tmpl).html();
            var target = $(o.target);
            var type = (o.sourceMethod == "post") ? "post" : "get";
            var _self = this;
            if( typeof o.before === "function" ){
                o.before.call(_self,o,first);
            }else{
                if( !o.prepend && !o.append ){
                    target.html("");
                    target.append( $('<div class="list-wait">等待中...</div>') );
                }
            }

            var _d = {};    //参数处理
            if("get" === type){
                _d.t = new Date().getTime()
            }
            if(o.pagination){
                _d[o.page.to] = o.toPage||"";
                _d[o.page.size] = 10
            }

            $[type](o.sourceUrl, $.extend(_d, o.sourceData() ),function(data){

                if(data.code && data.code != 200){
                    target.html( o.nonResult );
                    return ;
                }

                $(o.pagination).hide(); //先隐藏分页组件

                o.source = data;

                if( typeof o.begin === "function" ){
                    o.begin.call(_self,o,first);
                }

                var html = Handlebars.compile( tpl )(o.source),
                    dom = $("<div>"+html+"</div>");
               
                var currentPage = dom.children(".currentPage").hide().html(),
                    totalPage = Math.ceil( dom.children(".totalPage").hide().html() );
                if(totalPage === 0 ){
                    dom.html( o.nonResult );
                }

                dom.remove(".list-wait");

                if(o.prepend){
                    target.prepend( dom.html() );
                }else{
                    o.append ? target.append( dom.html() ) : target.html( dom.html() );
                }

                var p = null;
                if( o.pagination ){
                    require(['form-style'],function(){
                        p = $(o.pagination).toPager({
                            currentPage: Math.floor(currentPage) || 1,    // 默认选中的页码
                            totalPage: totalPage | 0,      // 总页数
                            "switch" :function(event,e){
                                o.toPage = e.toPage;
                                $(this).hide();
                                _self.__ajax__(o);
                            }
                        },!first);
                        if( totalPage != "0" ){
                            p.show();
                        }
                    });
                }
                if( typeof o.callback === "function" ){
                    o.callback.call(_self,o,p,first);
                }
            }, o.dataType || 'json');
        },
        __init__: function(options,first){
            var tpl = $(options.tmpl), _this = this;
            return tpl.each(function(){
                var _t = $(this),
                    o = $.extend($.extend({},base),{
                        sourceUrl: _t.attr("data-url"),
                        target : _t.attr("data-target"),
                        append : _t.attr("data-append"),
                        prepend: _t.attr("data-prepend"),
                        pagination : _t.attr("data-pagination"),
                        sourceMethod : _t.attr("data-method"),
                        dataType: _t.attr("data-type")
                    },options);

                if( o.sourceUrl ){
                    _this.__ajax__(o,first);
                }else{
                    _this.__simple__(o,first);
                }
            });
        },
        /**
         * @alias param options
         * @param {String} tmpl 模板标签或选择器[required]
         * @param {JSON}   source 用于渲染的元数据
         * @param {String} sourceUrl 用于渲染的元数据(ajax)，【如果定义了，将使用异步渲染和分页】 |data-url|
         * @param {String} sourceMethod 获取元数据的ajax的type   |data-method|
         * @param {String} dataType 获取元数据的ajax的dataType   |data-type| "jsonp"
         * @param {Function}  sourceData  获取元数据的ajax的data  返回值为普通json数据格式的function，确保动态调用
         * @param {String} target 目标填充标签或选择器[required]   |data-target|
         * @param {String} pagination 是否初始化分页,如果定义，将作为分页插件的选择器  |data-pagination|
         * @param {Boolean} append 是否以追加的模式填充目标标签       |data-append|
         * @param {Boolean} prepend  是否以追加的模式填充目标标签     |data-prepend| 优先于append
         * @param {Function} begin (o*数据源options*, data*渲染数据*,first*首次加载*) 数据准备完成，渲染开始前运行
         * @param {Function} callback (o*数据源options*, pager*分页对象*,first*首次加载*) 渲染结束以后运行
         * @param {String} nonResult 当totalPage为0时,  填充目标.
         * @param {Object} page  @default {size:'page.size',to:'page.pn'}.
         * @example
                <script type="html/template" id="temp_recycle_lists" data-target=".recycle_lists" data-pagination="#pager_recycle_lists" data-method="get">
                    {{#with page}}
                    <table class="table">
                    {{#each content}}
                        <tr class="">
                            <td class="checked_bt"><input type="checkbox" name="checkbox" class="checkbox" id="cb1-{{id}}" value="0"></td>
                            <td class="from_name">{{receiveUser/username}}</td>
                            <td>{{text/title}}</td>
                            <td>{{text/body}}</td>
                            <td class="send_time">{{{Date text/createDate}}}</td>
                        </tr>
                    {{/each}}
                    </table>
                    <span class="currentPage">{{currentPage}}</span>
                    <span class="totalPage">{{totalPages}}</span>
                    {{/with}}
                </script>
                <script>
                    require(['template-init'],function(T){
                        T.init({
                            tmpl:"#temp_recycle_lists",
                            sourceUrl:'json/recycle_lists.json',
                            sourceData: function(){
                                return {
                                    name:'name1',
                                    time: new Date().getTime()
                                }
                            },
                            callback:function(o){
                                o.source // 真实的ajax返回数据
                                $(".checkbox").toCheckbox();    
                            }
                        });
                    });
                </script>
         */
        init : function(options){
            return this.__init__(options,true);
        },
        refresh : function(options){
            return this.__init__(options,false);
        }
    };

});