/**
 * 地点选择器
 * @date 2014/4/9
 */
define(function(require, exports, module){
	var html = '<!doctype html><html lang="en"><head><meta charset="UTF-8"><title>Area</title><link rel="stylesheet"href="{{base}}/../css/jqueryui/jquery-ui.css"><link rel="stylesheet"href="{{base}}/../css/form.css"><link rel="stylesheet"href="{{base}}/module/area-selector/area.css"><script src="{{base}}/jquery.min.js"></script></head><body><div id="tabs"><ul><li><a href="#china">中国</a></li><li><a href="#foreign">海外</a></li></ul><div id="china"><ul class="letter-select letter-select-1"><li data-c="A">省</li><li data-c="A">A</li><li data-c="B">B</li><li data-c="C">C</li><li data-c="D">D</li><li data-c="E">E</li><li data-c="F">F</li><li data-c="G">G</li><li data-c="H">H</li><li data-c="I">I</li><li data-c="J">J</li><li data-c="K">K</li><li data-c="L">L</li><li data-c="M">M</li><li data-c="N">N</li><li data-c="O">O</li><li data-c="P">P</li><li data-c="Q">Q</li><li data-c="R">R</li><li data-c="S">S</li><li data-c="T">T</li><li data-c="U">U</li><li data-c="V">V</li><li data-c="W">W</li><li data-c="X">X</li><li data-c="Y">Y</li><li data-c="Z">Z</li></ul><ul class="letter-select letter-select-2"><li data-c="A">城</li><li data-c="A">A</li><li data-c="B">B</li><li data-c="C">C</li><li data-c="D">D</li><li data-c="E">E</li><li data-c="F">F</li><li data-c="G">G</li><li data-c="H">H</li><li data-c="I">I</li><li data-c="J">J</li><li data-c="K">K</li><li data-c="L">L</li><li data-c="M">M</li><li data-c="N">N</li><li data-c="O">O</li><li data-c="P">P</li><li data-c="Q">Q</li><li data-c="R">R</li><li data-c="S">S</li><li data-c="T">T</li><li data-c="U">U</li><li data-c="V">V</li><li data-c="W">W</li><li data-c="X">X</li><li data-c="Y">Y</li><li data-c="Z">Z</li></ul><div class="pannel"></div></div><div id="foreign"><ul class="letter-select letter-select-1"><li data-c="A">国</li><li data-c="A">A</li><li data-c="B">B</li><li data-c="C">C</li><li data-c="D">D</li><li data-c="E">E</li><li data-c="F">F</li><li data-c="G">G</li><li data-c="H">H</li><li data-c="I">I</li><li data-c="J">J</li><li data-c="K">K</li><li data-c="L">L</li><li data-c="M">M</li><li data-c="N">N</li><li data-c="O">O</li><li data-c="P">P</li><li data-c="Q">Q</li><li data-c="R">R</li><li data-c="S">S</li><li data-c="T">T</li><li data-c="U">U</li><li data-c="V">V</li><li data-c="W">W</li><li data-c="X">X</li><li data-c="Y">Y</li><li data-c="Z">Z</li></ul><ul class="letter-select letter-select-2"><li data-c="A">州</li><li data-c="A">A</li><li data-c="B">B</li><li data-c="C">C</li><li data-c="D">D</li><li data-c="E">E</li><li data-c="F">F</li><li data-c="G">G</li><li data-c="H">H</li><li data-c="I">I</li><li data-c="J">J</li><li data-c="K">K</li><li data-c="L">L</li><li data-c="M">M</li><li data-c="N">N</li><li data-c="O">O</li><li data-c="P">P</li><li data-c="Q">Q</li><li data-c="R">R</li><li data-c="S">S</li><li data-c="T">T</li><li data-c="U">U</li><li data-c="V">V</li><li data-c="W">W</li><li data-c="X">X</li><li data-c="Y">Y</li><li data-c="Z">Z</li></ul><div class="pannel"></div></div></div><script type="html/template"id="tmp-item-list"><ul>{{#each groups}}<li><h3 class="href-{{prefix}}">{{prefix}}</h3><div class="item-list">{{#each list}}<a href="javascript:;"data-id="{{id}}"title="{{name}}">{{name}}</a>{{/each}}</div></li>{{/each}}</ul></script><script type="html/template"id="tmp-item-list-2"><ul>{{#each groups}}<li><h3 class="href-{{prefix}}">{{prefix}}</h3><div class="item-list-2">{{#each list}}<h4 data-id="{{id}}"{{#if children}}class="has-child"{{/if}}>{{name}}</h4><div class="item-list">{{#each children}}<a href="javascript:;"data-id="{{id}}"title="{{name}}">{{name}}</a>{{/each}}</div>{{/each}}</div></li>{{/each}}</ul></script><div id="loading"></div><script src="{{base}}/jqueryui/jquery.ui.core.min.js"></script><script src="{{base}}/jqueryui/jquery.ui.widget.min.js"></script><script src="{{base}}/jqueryui/jquery.ui.tabs.min.js"></script><script src="{{base}}/data/world.js"></script><script src="{{base}}/underscore/underscore.min.js"></script><script src="{{base}}/template/handlebars.min.js"></script><script src="{{base}}/module/area-selector/area.js"></script></body></html>';
	var current = null;
	var _default = {
		width:320,
		height:433,
		onData : function(node,isLeaf){
			//alert( "选中的ID:" + node.id + (isLeaf?" 是叶子节点":"") );
		},
		ready : function(factory){

		}
	};

	var AreaSelector = function(opt){
		var o = $.extend(_default,opt), el = $(o.el);
		var holder = $('<div id="area-selector-holder" style="position:absolute;z-index:9000;"></div>'), 
			frame = $('<iframe src="about:blank" frameborder="0" name="area_selector" id="area_selector" style="width:100%;height:100%;"></iframe>').appendTo(holder);

		if( !$('#area-selector-holder').length ){
			holder.css({
				width: o.width,
				height: o.height
			}).appendTo('body').hide();


			window.onAreaSelecter = function(node,isLeaf){
				if( false === o.onData.call(current,node,isLeaf) || isLeaf ){
					holder.hide();
				}
			};
			window.onAreaSelecter.ready = o.ready;
			window.frames["area_selector"].document.write( html.replace(/\{\{base\}\}/g, module.uri.replace(/\/module\/area\-selector\/index\.js.*?$/,'')));
		}
			
		el.on(o.event||'click',function(){
			var _this = $(this), off = _this.offset();
			current = _this;	// 标记当前聚焦的dom
			var left = off.left + _this.width() - o.width,
				top = off.top + _this.height();

			if(left < 0) left = off.left;
			if(top+o.height > $(document).height() )top = off.top - o.height;

			holder.css($.extend(o.style,{
				left: left,
				top: top
			})).show();
		});

	};

	return AreaSelector;

});