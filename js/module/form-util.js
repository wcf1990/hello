;(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    root.FormUtil = factory();
  }

}(this,function(require, exports, module) {
	var $ = jQuery;

	$.fn.extend({
		checkVal : function(name,values){
			var result = [];
			$( ':checkbox[name="'+name+'"]', this ).each(function(){
				if(this.checked){
					result.push( this.value );
				}
				if(values){
					var checked = !!(values+"").match( new RegExp('\\b'+this.value+'\\b') );
					if(this.checked != checked){
						this.click();
					}
				}
			});
			return values ? this : result;
		},
		radioVal : function(name, value){
			return value ? $( ':radio[name="'+name+'"][value="'+value+'"]' ).attr({checked:true}) : $( ':radio[name="'+name+'"]:checked' ).val()
		},
		prepareFormData: function(data){
			for(var name in data){
				var el = $('[name="'+name+'"]',this);
				if(el[0]){
					switch( el[0].type ){
						case 'radio': this.radioVal(name,data[name]);break;
						case 'checkbox': this.checkVal(name,data[name]);break;
						default: el.val( data[name] ) 
					}
				}
			}
		}
	});

	return {
		selectAll : function(opt){
			var o = $.extend({
				handle : null,			//必须是页面已有标签
				checkList : null,		//可以使用预定义选择器,但是必须定义checkListHolder
				checkListHolder : null	//必须是页面已有标签
			},opt);
			var handle = $(o.handle), 
				_handle = handle[0], 
				checkList = $(o.checkList),
				checkListHolder = o.checkListHolder ? $(o.checkListHolder) : checkList.parent();
			handle.on('click',function(){ 
				var checked = this.checked;
				$(o.checkList).each(function(){
					if(this.checked != checked){
						this.click();
					}
				}); 
			});
			checkListHolder.on('click',function(e){
				if( !_handle.checked && !$(o.checkList).not(":checked").length){
					_handle.checked = true;
					handle.trigger('checked');
				}else if( _handle.checked && $(o.checkList).not(":checked").length){
					_handle.checked = false;
					handle.trigger('checked');
				}
			});
		}
	};

}));