(function(){

var 
uiModule = "jqueryui/jquery.ui.{{module}}.min",		//jqueryUI相关,部分依赖不完善
paths = {
	/**
	 * 提供原生模态对话框替代品: jAlert/jConfirm/jPrompt
	 * 提供延时性的简单tip提示: jTip
	 * @see  demo/form.html
	 */
	alerts: "jqueryui/jquery.alerts",	
	/**
	 * SVG-VML兼容性矢量图工具库:
	 * @see  http://raphaeljs.com/
	 */
	raphael: "raphael.min",
	/**
	 * Handlebars js模板
	 * @see  http://handlebarsjs.com/
	 */
	template: "template/handlebars.min",
	
	/**
	 * 云谱图插件, 基于raphaeljs开发扩展的数据可视化插件
	 * @see demo/cloudMap.html
	 */
	cloudMap: "cloudspectrum/cloudspectrum.min",
	/**
	 * 时间轴 插件1： 美国西北大学研究室开发插件
	 * 根据业务对数据格式对应进行了适配
	 * @github https://github.com/NUKnightLab/TimelineJS
	 */
	timeline: "timeline/storyjs-embed.min",

	/**
	 * requirejs官方css加载模块
	 */
	css: "css.min",		
	/**
	 * 数据[集合/数组]操作工具方法集合
	 * @see http://underscorejs.org/
	 */
	underscore: "underscore/underscore.min",
	/**
	 * zTree 树形菜单组件
	 * @see http://www.ztree.me
	 */
	zTree: "zTree/jquery.ztree.all-3.5.min",
	/**
	 * My97DatePicker 流行时间最久的日历控件之一
	 * @see http://www.my97.net/
	 */
	WdatePicker: "My97DatePicker/WdatePicker",
	/**
	 * 基于raphaeljs 的简单数据图表插件
	 * @see http://www.oesmith.co.uk/morris.js
	 */
	morris:"morris/morris.min",
	
	/**
	 * 基于jQuery的表单元素美化插件 & 分页插件
	 * @see  demo/form.html
	 */
	"form-style": "jquery-form/form-style.min",
	/**
	 * 基于jQuery的表单验证插件
	 * @see  formValid.html
	 */
	formValid: "jquery-form/form-valid.min",
	/**
	 * formValid扩展插件, 更加精确的身份证信息验证插件
	 */
	"idCard-valid": "jquery-form/idcard-valid.min",
	/**
	 * 基于jQuery的多级下拉框联动插件, 炫空间有KISSY的修改版本.
	 */
	selectors: "jquery-form/selectors",
	/**
	 * 基于jQuery的图片裁剪插件
	 * @see demo/imageCrop.html
	 */
	imageAreaSelector: "jquery.imgareaselect/js/index.min",


	/**
	 * 针对IE的浏览器升级提示插件
	 * @see html/new-index.html
	 */
	iealert : "module/iealert/index",
	/**
	 * 基于HTML5-requestAnimationFrame的事件轮训插件
	 * @see demo/choudMap.html .etc
	 */
	requestAFrame : "module/requestAFrame",
	/**
	 * 基于jQuery-ajax & handlebars模板的可配置分页列表插件,KISSY改版
	 * @see demo/template-init.html
	 */
	"template-init": "module/template-init.min",
	/**
	 * location.search参数获取工具库
	 * @see html/new-index.html
	 */
	queryparam: "module/queryparam",
	/**
	 * Date操作工具类: 提供parse/format方法
	 * @see  demo/test-date-util.html
	 */
	dateUtil: "module/date-util",
	/**
	 * Number操作工具类: 提供RMB读数/数据存储单位/数字千进制表示 等方法
	 * @see  demo/test-number-util.html
	 */
	numberUtil: "module/number-util",
	/**
	 * 提供常用表单相关DOM操作, 主要针对form-style美化结果进行数据操作补充
	 * @see  demo/form.html
	 */
	formUtil: "module/form-util",
	/**
	 * 提供Cookie存取方法
	 */
	cookie: "module/cookie",
	/**
	 * 二维码转码插件
	 * @see demo/qrcode.html
	 */
	qrcode: "module/qrcode/qrcode.min",
	/**
	 * 基于iframe实现的文件上传
	 * @see demo/frame-upload.html
	 */
	frameUpload : "module/frame-upload/index",
	/**
	 * 基于jQuery的时间轴-自主开发版本
	 * @see  demo/timeline.html
	 */
	"time-line" : "module/time-line/index",
	/**
	 * 基于jQuery和handlebars的地区选择控件,
	 * @see demo/test-areaselector.html
	 */
	"area-selector" : "module/area-selector/index",
	/**
	 * 提供JSON的兼容性支持, 支持restful-json对于json对象引用$ref的解析
	 * @see  demo/test-json.html
	 */
	json : "module/json",
	/*
	 * 对密码进行加密设置
	 * @see  http://plugins.jquery.com/base64/
	*/
	base64:"jquery.base64.min",
	/*
	*弹框节点选择器
	*@see demo/node-choose.html
	*/
	"node-choose":"module/node-choose/node-choose"
},
ui = [
"accordion",
"autocomplete",
"button",
"core",
"datepicker",
"dialog",
"draggable",
"droppable",
"effect-blind",
"effect-bounce",
"effect-clip",
"effect-drop",
"effect-explode",
"effect-fade",
"effect-fold",
"effect-highlight",
"effect-pulsate",
"effect-scale",
"effect-shake",
"effect-slide",
"effect-transfer",
"effect",
"menu",
"mouse",
"position",
"progressbar",
"resizable",
"selectable",
"slider",
"sortable",
"spinner",
"tabs",
"tooltip", 
"widget"
];

for (var i = 0; i < ui.length; i++) {
	paths[ui[i]] = uiModule.replace( "{{module}}",ui[i] );
};
var scripts = document.getElementsByTagName('script') , _src = scripts[scripts.length-1].src;
require.baseUrl = _src.replace( /\/[^\/]*$/,"" )
require.config({
	baseUrl: require.baseUrl,
	urlArgs: 'v=1.3',
	paths: paths,
	shim :{
		widget:{
			deps:["core"]
		},
		dialog:{
			deps: ["widget"]
		},
		button:{
			deps: ["widget"]
		},
		tabs:{
			deps: ["widget"]
		},
		menu:{
			deps: ["widget"]
		},
		mouse:{
			deps: ["widget"]
		},
		position:{
			deps: ["widget"]
		},
		accordion:{
			deps: ["widget"]
		},
		datepicker:{
			deps: ["widget"]
		},

		draggable:{
			deps: ["mouse"]
		},
		sortable:{
			deps: ["draggable"]
		},
		alerts:{
			deps: ["dialog"]
		},
		autocomplete : {
			deps: ["menu","position"]
		},
		cloudMap:{
			deps: ["raphael"]
		},
		zTree:{
			deps: ["css!../js/zTree/zTreeStyle/zTreeStyle.css","css!../css/new-tree.css"]
		},
		iealert:{
			deps: ["css!module/iealert/css/style.css"]
		},
		"template-init":{
			deps: ["template"]
		},
		morris :{
			deps: ["raphael","css!../js/morris/morris.css"]
		},
		"idCard-valid":{
			deps: ["formValid"]
		},
		imageAreaSelector : {
			deps: ["css!jquery.imgareaselect/css/animated.css"]
		},
		"time-line" : {
			deps: ["template","css!module/time-line/time-line.css"]
		},
		"node-choose" : {
			deps: ["template","zTree","button","dialog","position","css!module/node-choose/node-choose.css"]
		}

	}
});

})();


/**



**/