/**
 *  @version 1.0
 *  @author shiyangyang
 *  @date 2013/11/11
 *  @description 弹出浏览器升级提示
 *	@worn 绑定了ie-alert-前缀的几个ID
 */
define(function(require, exports, module){
	var _options = {
		// 弹出提示的IE版本， 在该版本下面是否如下操作
		ie6 : {
			// 是否弹出遮罩层
			overlay : true,
			// 是否提供【继续访问】按钮
			allowContinue : false
		},
		ie7 : {
			// 是否弹出遮罩层
			overlay : true,
			// 是否提供【继续访问】按钮
			allowContinue : true
		},
		// 弹出浏览器升级提示以后执行方法
		alert : function(){},
		// 关闭浏览器升级提示以后执行方法
		close : function(){}
	};

	var version = null;
	if( "Microsoft Internet Explorer" == navigator.appName ){
		version = navigator.appVersion.split(";")[1].match(/[1-9]\d*/);
	}
	/**
	 *
	 *
	 *
	**/
	var IEAlert = function(options){
		if( document.getElementById("ie-alert-panel") ){
			return ; //已经初始化过的就不要再来了。 
		}
		var o = options || _options;

		var conf = o["ie"+version];
		if( conf ){
			var overlay = document.createElement('div'),
				panel = document.createElement('div');
			overlay.id = "ie-alert-overlay";
			panel.id = "ie-alert-panel";
			panel.innerHTML = '<span>你知道你的Internet Explorer是过时了吗?</span><p> 为了得到我们网站最好的体验效果,我们建议您升级到最新版本的Internet Explorer或选择另一个web浏览器.一个列表最流行的web浏览器在下面可以找到.<br><br></p>'+
						( conf.allowContinue ? '<h1 id="ie-alert-close" style="font-size:20px;cursor:pointer;">&gt;&gt;&gt;继续访问</h1>' : '' )+
						'<p></p><div class="browser"><ul><li><a class="chrome" href="https://www.google.com/chrome/" target="_blank"></a></li><li><a class="firefox" href="http://www.mozilla.org/en-US/firefox/new/" target="_blank"></a></li><li><a class="ie9" href="http://windows.microsoft.com/en-US/internet-explorer/downloads/ie/" target="_blank"></a></li><li><a class="safari" href="http://www.apple.com/safari/download/" target="_blank"></a></li><li><a class="opera" href="http://www.opera.com/download/" target="_blank"></a></li><ul></ul></ul></div>';

			document.body.appendChild( overlay );
			document.body.appendChild( panel );

			panel.onclick = function(e){
				e = e || window.event;
				var target = e.target || e.srcElement;
				if( target.id == "ie-alert-close" ){
					document.body.removeChild( overlay );
					document.body.removeChild( panel );
					callback("close");
				}
			}

			callback("alert");

		}

		function callback(fn){
			if( typeof o[fn] === 'function' ){
				o[fn].call({
					overlay: overlay,
					panel: panel
				})
			}
		}

	}
	IEAlert.version = version;
	return IEAlert;
});