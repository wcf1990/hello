(function($){
	$(document).on("click",function(e){
		$(".fm-select").each(function(){
			var holder = $(this);
			if( !holder[0].contains( e.target ) ){
				holder.removeClass("selecting")
			}
		});
	});

	$.fn.extend({
		toRadio : function(){
			return this.each(function(){
				var _this = $(this), holder = $('<i class="fm-item fm-radio"></i>');
				if( _this.data("radio-init") ) return;
				_this.after( holder );
				_this.on("click checked",function(){ 
					$("[name='"+this.name+"']").not(this).parent().removeClass("checked"); 
					_this.parent().addClass("checked") 
				});
				return _this.data("radio-init",true).appendTo(holder);	
			}).filter(":checked").trigger("checked");
		},
		toCheckbox : function(){
			return this.each(function(){
				var _this = $(this), holder = $('<i class="fm-item fm-checkbox"></i>');
				if( _this.data("checkbox-init") ) return;
				_this.after( holder );
				_this.on("click checked",function(){ 
					_this.parent()[this.checked?'addClass':'removeClass']("checked");
				});
				return _this.data("checkbox-init",true).appendTo(holder);	
			}).filter(":checked").trigger("checked");
		},
		toSwitch : function(){
			return this.each(function(){
				var _this = $(this), holder = $('<i class="fm-item fm-switch"></i>');
				if( _this.data("switch-init") ) return;
				_this.after( holder );
				_this.on("click checked",function(){ 
					_this.parent()[this.checked?'addClass':'removeClass']("checked") 
				});
				return _this.data("switch-init",true).appendTo(holder);	
			}).filter(":checked").trigger("checked");
		},
		toSelect : function(opt){
			opt = opt || {};

			return this.each(function(){
				var _this = $(this), v = _this.attr("value"), holder = $('<i class="fm-item fm-select"><span class="value-holder"></span><div class="option-holder"></div></i>');
				if( _this.data("select-init") ) return;
				_this.after( holder );
				if(v){_this.val( v );} //使用value参数赋值
				if( opt.colorful ){
					holder.addClass("colorful");
				}
				holder.css({
					width: opt.width || _this.width()
				});

				var vh = holder.children(".value-holder"),
					oh = holder.children(".option-holder"),
					selected = _this.children(":selected");

				vh.html( selected.html() );
				var list = _this.html().replace(/<option(.*?)>(.*?)<\/option>/gi,"<a$1>$2</a>") ;
				oh.html( list ).on('click','a',function(){
					var t = $(this);
					_this.val( t.attr("value") ).trigger("change");
					vh.html( t.html() );
				});
				holder.on("click",function(){
					$(this).toggleClass("selecting")
				});
				_this.on('selectVal',function(e,val){
					val && $(this).val(val);
					oh.find('a[value="'+(this.value)+'"]').trigger('click');
					holder.removeClass("selecting");
				});
				return _this.data("select-init",true).appendTo(holder);	
			});
		},
		toPager : function(opt,noToPage){
			return $(this).each(function(){
				var _this = $(this);
				var o = $.extend({
					el : _this,
					totalPage : 1,
					currentPage: 1,
					preposePagesCount : 1,
					postposePagesCount : 1,
					firstPagesCount : 2,
					lastPagesCount : 2,
					'switch': null
				},opt);

				var paginationInner = '',
	                totalPage = o.totalPage,
	                currPage = o.currentPage,
	                preposePagesCount = o.preposePagesCount,
	                postposePagesCount = o.postposePagesCount,
	                firstPagesCount = o.firstPagesCount,
	                lastPagesCount = o.lastPagesCount,
	                offset;



	            /**
		         * @brief 渲染可点击的页码
		         * @param index {Number} 页码索引
		         *
		         */
		        function _renderActivePage(index) {
		            return '<a class="pagination-spec" data-page="' + index + '">' + index + '</a>';
		        }

	            // currPage前的页码展示
	            paginationInner += currPage === 1 
	            	? '<span class="pagination-start"><span>上一页</span></span>' 
	            	: '<a class="pagination-prev"><span>上一页</span></a>';

	            if (currPage <= firstPagesCount + preposePagesCount + 1) {
	                for(var i=1; i<currPage; i++) {
	                    paginationInner += _renderActivePage(i);
	                }

	            } else {
	                for(var i=1; i<=firstPagesCount; i++) {
	                    paginationInner += _renderActivePage(i);
	                }
	                paginationInner += '<span class="pagination-break">...</span>';
	                for(var i=currPage-preposePagesCount; i<=currPage-1; i++) {
	                    paginationInner += _renderActivePage(i);
	                }
	            }

	            // currPage的页码展示
	            paginationInner += '<span class="pagination-curr">' + currPage + '</span>';

	            // currPage后的页码展示
	            if (currPage >= totalPage - lastPagesCount - postposePagesCount) {
	                offset = currPage + 1;
	                for(var i=currPage+1; i<=totalPage; i++) {
	                    paginationInner += _renderActivePage(i);
	                }

	            } else {
	                for(var i=currPage+1; i<=currPage+postposePagesCount; i++) {
	                    paginationInner += _renderActivePage(i);
	                }
	                paginationInner += '<span class="pagination-break">...</span>';
	                for(var i=totalPage-lastPagesCount+1; i<=totalPage; i++) {
	                    paginationInner += _renderActivePage(i);
	                }
	            }

	            paginationInner += currPage === totalPage 
	            	? '<span class="pagination-end"><span>下一页</span></span>' 
	            	: '<a class="pagination-next"><span>下一页</span></a>';

	            $(o.el).html(paginationInner);


	            function _switchToPage(page) {
		            o.currentPage = Number(page);
		            _this.toPager(o,true);	//不带初始化的分页加载
		            _this.trigger('switch', {
		                toPage: o.currentPage
		            });
		        }

	            if( !noToPage ){
	            	_this.on('switch',o["switch"]);
	            	$(o.el).on('click','.pagination-spec',function(e){
	            		_switchToPage( $(this).html() )
	            	}).on('click','.pagination-prev',function(e){
	            		_switchToPage( Number( $(this).siblings(".pagination-curr").html() ) - 1 )
	            	}).on('click','.pagination-next',function(e){
	            		_switchToPage( Number( $(this).siblings(".pagination-curr").html() ) + 1 )
	            	});
	            }
			});

		}
	});

})(jQuery);