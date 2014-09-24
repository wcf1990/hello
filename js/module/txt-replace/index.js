/**
 * @description 在浏览器中创建文本查找替换弹出框
 * @author shiyangyang
 * @beta 0.9
 * @date 2014/05/15
 */
;(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    root.TxtReplacer = factory();
  }

}(this,function(require, exports, module){
	var $ = jQuery,
		base = {
			reg: /^[\u4e00-\u9fa5\w\*\-]+/,
			htmlMode: true,
			baseNode: document.body,
			eventNode: document,
			combKey : 'shift+f',
			button 	: {
				el: '#show-txt-replace',
				option: 'click mouseover'
			},
			highlighter: '<i style="color:#c00;" class="txt-keyword-highlighter">$1</i>'
		},
		html = 	''+
				'<div style="position:fixed;width:100%;z-index:99999;background:#d2d2d2;line-height:40px;bottom:0;left:0;padding:0;">'+
				'	<form>'+
				'		<table style="width:95%;border-spacing:0;border-collapse:collapse;text-align:center;">'+
				'			<colgroup style="width:15%"></colgroup>'+
				'			<colgroup style="width:75%"></colgroup>'+
				'			<colgroup style="width:10%"></colgroup>'+
				'			<tr>'+
				'				<td style="text-align:right;"><strong>查询关键字</strong></td>'+
				'				<td><input type="text" style="width:98%;line-height:26px;padding:0;height:26px;" class="txt-keyword" tabindex="100"></td>'+
				'				<td style="text-align:left;"><input type="submit" value="查询" class="fm-button"/></td>'+
				'			</tr>'+
				'			<tr>'+
				'				<td style="text-align:right;"><strong>替换关键字</strong></td>'+
				'				<td><input type="text" style="width:98%;line-height:26px;padding:0;height:26px;" class="txt-replacer" tabindex="101"></td>'+
				'				<td style="text-align:left;"><a href="javascript:;" class="fm-button txt-replace">替换</a></td>'+
				'			</tr>'+
				'		</table>'+
				'	</form>'+
				'	<a href="javascript:;" class="fm-close" style="position:absolute;right:0;top:4px;width:14px;height:14px;font:bold 14px/14px Arial;">x</a>'+
				'</div>'+
				'';

	

	/**
	 * 获取所有纯文本结点
	 * @param  {NodeElement} baseNode 父标签[必需]
	 * @param  {String} keyword 查询关键字 [必需]
	 * @param  {String} highlighter 高亮替换字符串
	 * @param  {String} change      需要替换的字符串
	 * @return {Array<NodeElement>} 数组
	 */
	var getLeafNode = function(baseNode,keyword,highlighter,change){
		var result = [],sum=0;
		clearHighlighter(baseNode);
		var elements = $('*',baseNode); //重新获取标签
		keyword = keyword.replace(/\*+/g,'.*');
		keyword = new RegExp('('+keyword+')', 'g' ); 
		
		for (var i = 0; i < elements.length; i++) {
			(function(el){
				var m = el.innerHTML ? {attr:'innerHTML',value:el.innerHTML} : {attr:'value',value:el.value};
				if( !el.children.length && m.value && keyword.test(m.value) ){
					sum += m.value.match(keyword).length;
					if( change ){	//需要替换
						el[m.attr] = m.value.replace( keyword, change );
					}else if( highlighter ){	//需要高亮
						el[m.attr] = m.value.replace( keyword, highlighter );
					}else{				//只是获取匹配数目

					}
					result.push(el);
				}
			})(elements[i]);
		}

		return sum;
	}, clearHighlighter = function(baseNode){
		$('.txt-keyword-highlighter',baseNode).each(function(){
			$(this).replaceWith( $(this).html() );
		});	//清除高亮展示
	};

	var alert = function(info){
		window.jAlert ? window.jAlert(info) : window.alert( (""+info).replace(/<.*?>/g,'') );
	};

	return function(opt){
		var o = $.extend({},base,opt);
		var panel = $(html).appendTo('body').hide(),
			baseNode = o.baseNode,
			button = o.button,
			highlighter = o.htmlMode ? o.highlighter : null,
			keyword = panel.find('.txt-keyword'),
			replacer = panel.find('.txt-replacer'),
			replace = panel.find('.txt-replace');

		/**
		 * 关闭事件
		 */
		panel.on('click','.fm-close',function(){
			clearHighlighter(baseNode);
			panel.slideUp();
		});

		/**
		 * 打开事件
		 */
		var keys = o.combKey.split(/\W+/),
			fnKey = keys[0]+'Key',
			keyChar = keys[1],
			keyList = 'abcdefghijklmnopqrstuvwxyz';
		$(o.eventNode).on('keypress',function(e){
			var code = e.charCode || e.keyCode;
			// if(e[fnKey] && ( keyList.charAt( e.charCode-65) == keyChar || keyList.charAt( e.charCode-97) == keyChar ) ){
			if(e[fnKey] && ( keyList.charAt( code-65) == keyChar || keyList.charAt( code-97) == keyChar ) ){
				clearHighlighter(baseNode);
				panel.slideToggle();
			} 
		});
		if(button){
			$(button.el).on(button.option||'click',function(){
				clearHighlighter(baseNode);
				panel.slideToggle();
			});
		}

		/**
		 * 查询以及高亮
		 */
		panel.children().on('submit',function(e){
			e.preventDefault();

			var value = $.trim(keyword.val());
			if( o.reg.test(value) ){
				var sum = getLeafNode(baseNode,value,highlighter);
				alert('一共查询到<span style="color:red;">'+sum+'</span>条匹配结果！');
			}else{
				alert('输入字符有误!');
			}
			
		});
		
		replace.on('click',function(){
			var value = $.trim(keyword.val());
			if( o.reg.test(value) ){
				var sum = getLeafNode(baseNode,value,null,replacer.val());
				alert('一共替换了<span style="color:red;">'+sum+'</span>条匹配结果！');
			}else{
				alert('输入字符有误!');
			}
		});

	};

}));