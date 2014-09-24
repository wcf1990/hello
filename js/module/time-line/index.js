/**
 *  @version 1.0
 *  @author shiyangyang
 *  @date 2014/4/4
 *  @description 时间轴重写
 */
;(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    root.TimeLine = factory();
  }

}(this,function(require, exports, module){
	var template = ''+
		'<div class="time-line">' +
	    '    <div class="time-inner">' +
	    '     	<div class="time-region">' +
	    '        	<ul class="time-slider">' +
	    '        		{{#each timelineContent}}' +
		'              	<li class="time-ownner">' +
		'	                <h4 title="{{time}}">{{time}}<span class="del"></span></h4>' +
		'	                <a href="javascript:void(0);" class="pointer"></a>' +
		'	                <div class="show-box">' +
		'                  		<ul>' +
		'                  			{{#each data}}' +
		'		                    <li class="time-item" data-id="{{cid}}" data-date="{{date}}"><span class="title"><a href="{{url}}" target="_blank">{{title}}</a></span><span class="box-edit"></span><span class="box-del"></span></li>' +
		'                  			{{/each}}' +
		// '		                    <li><input type="text" placeholder="输入URL连接" /><a href="javascript:void(0);" class="btn-save">保存</a></li>' +
		'                  		</ul>' +
		'                  		<span class="arrow"></span>' +
		'                	</div>' +
		'              	</li>' +
		'              	{{/each}}' +
	    '        	</ul>' +
	    '      	</div>' +
	    '    </div>' +
	    '</div>';

	var compile = Handlebars.compile(template);
	var opt = {
		embed : 'body',
		current : 0,
		onBeforeDel: function(){},
		onDel: function(ids){}
	};

	/**
	 * 兼容性的confirm回调
	 * @param  {function} cbk       回调方法
	 * @param  {boolean} noConfirm 	是否调用confirm
	 * @return {undefined}           undefined
	 */
	var confirmHandle = function(msg,cbk,noConfirm){
		if( !noConfirm ){
			if( window.jConfirm ){	
				jConfirm(msg||'确定?',"提示",{
					okButton : "确定",
					cancelButton : "取消"
				},function(result){
					if(result){
						cbk();
					}
				});
			}else{
				if( window.confirm(msg||'确定?') ){
					cbk();
				}
			}
		}else{
			cbk();
		}
	};

	return function(options,data){
		var o = $.extend({},opt,options);
		var holder = $(o.embed).append( $(compile(data) ) );

		//计算所有宽度和
		holder.on('calculate',function(){	
			var slider = $('.time-slider',this), children = slider.children();
			slider.css({
				width : children.first().width() * children.length
			});
		}).trigger('calculate');	

		//修改聚焦, 重新计算slider位置
		holder.on('position',function(e){
			var slider = $('.time-slider',this),
				pannel = slider.parent(),
				current = $('.current',slider);

			slider.stop().animate({
				left: pannel.width()/2 - current.index() * current.width()
			},300, function() {

			});
		});

		//切换聚焦
		holder.on('click','.time-ownner',function(){
			$(this).addClass('current').siblings().removeClass('current');
			$(this).parents(o.embed).trigger('position');
		}).find('.time-ownner').eq( o.current ).trigger('click');

		//ownner删除
		holder.on('click','.del',function(e,noConfirm){
			var rm = $(this).parent().parent();
			var focus = rm.next().length ? rm.next() : rm.prev();
			confirmHandle('确认删除数据组?',function(){
				o.onBeforeDel.call(holder);
				rm.remove();
				o.onDel.call(holder);
				focus.trigger('click');
			},noConfirm);
			e.stopPropagation();
		});

		//单条记录删除
		holder.on('click','.box-del',function(){
			var _this = $(this).parent(), siblings = _this.siblings();

			confirmHandle('确认删除?',function(){
				( siblings.length ) 
					? _this.remove()
					: _this.parents('.time-ownner').find('.del').trigger('click',true) 
			});
			
		});
		
		$.extend(holder,{
			getAllIds : function(){
				var ids = [];
				$('.time-item', this).each(function(){
					ids.push( $(this).data('id') )
				});
				return ids;
			}
		});
		return holder;
	};

}));