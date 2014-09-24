/**
 * @description 放大镜效果 (分别支持图片&文字等效果, 默认图片效果)
 * @author shiyangyang
 * @version 1.0.0
 * @return {[function]}   
 */
(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    root.Zoom = factory();
  }

}(this,function(require, exports, module) {
	var $ = jQuery;

	var defaults = {
		type:'img',
		scale: 2,
		el: null, //jQuery selector 
		src: null,
		style:{		//放大镜样式
			width:150,
			height:150
		},
		itemStyle:{} //内容样式
	};

	var handler = $('<div style="position:absolute;z-index:99999;border-radius:50%;border:1px solid #d2d2d2; box-shadow: 0px 0px 20px #333; overflow:hidden;display:none;"></div>').appendTo('body');
	var currentArea = null, currentOption = null;

	function withIn(off,area){
		var x = off.left, y = off.top;
		if(area){
			return x >= area.left-1 && x <= area.left+area.width && y >= area.top && y <= area.top+area.height  
		}else{
			return false;
		}
	}

	function Zoom(option){
		var o = $.extend(true,{},defaults,option);

		o.style.marginLeft = -o.style.width / 2;
		o.style.marginTop = -o.style.height / 2;

		$(document).on('mouseover',o.el,function(){
			if( currentArea ) return;
			var _t = $(this), src = o.src || _t.attr('src'), size = {width:_t.width()*o.scale,height:_t.height()*o.scale,position:'absolute'};
			
			currentArea = $.extend(_t.offset(),{
				width: _t.width(),
				height: _t.height()
			});
			currentOption = o;

			switch(o.type){
				case 'img':
					handler.html( $('<img src="'+src+'" />').css(size) ).css(o.style).show()
					break;
				default:
					handler.html( _t.clone().css(size).css(o.itemStyle) ).css(o.style).show(); 

			}
		})
		.on('mousemove',function(e){
			var off = {
				left: e.clientX + $(window).scrollLeft(),
				top : e.clientY + $(window).scrollTop()
			};
			if( withIn(off,currentArea) ){
				handler.css({
					left: off.left,
					top: off.top
				});
				handler.children().css({
					left: - currentOption.scale * (off.left-currentArea.left) + currentOption.style.width / 2 - 1,
					top : - currentOption.scale * (off.top -currentArea.top ) + currentOption.style.height / 2 - 1
				});
			}else{
				handler.hide();
				currentArea = null;
			}
		})
		return handler;
	}

	return Zoom;
}));
