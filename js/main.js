(function($){

	require(["iealert"],function(IEAlert){
		new IEAlert();
	});

	require(["style-switch","cookie","alerts"],function(SW,CK){
		$('<style id="css-style-switch"></style>').appendTo( $('body') );

		$.ajax({
			url: "../css/style-switch.css?v=1.0.1",
			dataType:"html",
			success:function(cssTxt){
			    window.themeId = CK.get('themeId') || '默认';
				var theme = SW[window.themeId], radios = "";
				var css = $('<style id="css-style-switch">'+ ( cssTxt.replace(/\{\{(\w+)\}\}/g,function(match,key){
					return theme[key];
				})) + '</style>');

				$('#css-style-switch').replaceWith(css);

				for(var k in SW){
					radios += '<input type="radio" name="color" id="theme-'+k+'" value="'+k+'" onclick="window.themeId=\''+k+'\'"/><label for="theme-'+k+'">'+k+'</label>'
				}

				$(".skin_peeler").on('click',function(e){
					jAlert('<div id="color-select">'+radios+'</div>',"选择主题",function(){
								CK.set('themeId',window.themeId,365);
								var theme = SW[window.themeId];
								var css = $('<style id="css-style-switch">'+ ( cssTxt.replace(/\{\{(\w+)\}\}/g,function(match,key){
									return theme[key];
								})) + '</style>');
								$('#css-style-switch').replaceWith(css);

								var cs = window.frames[0].cssSwitch;
								typeof cs === 'function' ? cs() : ""; // 修改样式表刷新子页面
							});
					e.preventDefault(); //点击切换主题:IE9一下浏览器居然会触发iframe的onbeforeunload事件,很奇葩,先阻止默认事件
				});	
			}
		});
			
	});

	var tree = $("#tree-nav"), treeHolder = $("#tree-module"), rightTarget = $("#tree-target");

	$(".head_top").on('click',function(e){
		var hidden = $('.head_nav').is(":hidden");
		if( hidden && !window.autoHeight){
			$("#targetFrame, #tree-target").css({ height : $(window).height()-320 });
		}
		
		$('.head_nav').stop().slideToggle(function(){
			$(".t-handle").html( hidden ? "-" : "+" );
			if( !hidden && !window.autoHeight ){
				$("#targetFrame, #tree-target").css({ height : $(window).height()-150 });
			}
		});
	}).on('click','a',function(e){
		e.stopPropagation();
	});

	window.reHeight = function(){
		if(window.autoHeight)return;
		var hidden = $('.head_nav').is(":hidden");
		$("#targetFrame, #tree-target").css({ height : $(window).height()-( hidden ? 150 : 320 ) });
	};

	window.reHeight();

	
	require(["requestAFrame","dateUtil"],function(r,DateUtil){

		//当前日期和时间
		r.addTimeout("now-time",function(){
			$("#now-time").html( DateUtil.format(new Date(), "现在时间： yy年MM月dd日 hh:mm:ss $$") );	
		},1000);

		r.addTimeout("close-tree",function(){	//检测关闭二级选框
			var handle = tree.find(".tree-link");
				
			if( treeHolder.width() ){
				if( !handle.length || !handle.hasClass('selected')){
					treeHolder.animate({
						width: "0%",
						opacity: 0
					},'fast',function(){
						treeHolder.hide();
						handle.removeClass('expended')
					});
					rightTarget.animate({
						width: "42%"
					},'fast');
				}
			}
				
		});

		r.addTimeout("load-chat",function(){
			$('<script src="http://tmisc.home.news.cn/chat/js/jbud.js" data-config="http://tmisc.home.news.cn/chat/js/config.js" data-main="./message/index" data-cache="true" data-params="callback=doListener&init=true&needShow=true"></script>').appendTo('body');
			return false;
		},1000);

	});
		
	require(["form-style"],function(){
		$("#site-select").toSelect({
			// width: 136,
			colorful: true
		}).on('change',function(){
			// 执行 切换站点
		}).trigger("change");
	});
	
	//含左边菜单的布局，额外添加事件
	if( tree.length ){
		

		require(["requestAFrame"],function(r){
			// 判断 $("#tree-target") 的实时高度，如果发生变化，触发重新修改高度 [相当于模拟resize]
			var tar_height = null; //使用null，确保至少触发一遍。
			r.addTimeout("resize",function(){
				if( tar_height != rightTarget.height() ){
					tar_height = rightTarget.height();
					$("#tree-nav, #tree-module>ul").css({"height": tar_height-40});				
				}	
			},100);

		});
			
		tree.on("click","a",function(e){
			$("#tree-nav .selected").not(this).removeClass('selected');
			$(this).addClass('selected');
		});
		tree.on('click','dt',function(e){
			$(this).toggleClass('dt-open').next().slideToggle("fast");
			if( !$(this).hasClass('link') )e.preventDefault();
		});

		
		require(["zTree"],function(){

			// 二级树形菜单选择
			tree.on("click _click",".tree-link",function(e){
				top.treeLevel=1000;
				var _this = $(this);
				if( _this.hasClass('expended') ){
					treeHolder.animate({
						width: "0%",
						opacity: 0
					},'fast',function(){
						treeHolder.hide();
						_this.removeClass('expended');
					});
					rightTarget.animate({
						width: "42%"
					},'fast');

				}else{
					treeHolder.hide();
					$(".tree-link").removeClass('expended');

					rightTarget.animate({
						width: "34%"
					},'fast');

					var v_href = _this.parent().attr("href"); //存儲展示的url,
					var e_href = _this.attr("data-href");  //存储修改的url
					
					//加载zTree菜单
					var zt = $.fn.zTree.init($("#ztree-inner"), {
						async: {
							type:'get',
							enable: true,
							url:_this.attr("href"),
							autoParam:["id", "name=n", "level=lv"],
							dataFilter:function(id, parent, data){
								if( !parent ){
									data.splice(0,0,{
										id: "",
										isParent: true,
										name: "新华新闻主站",
										leveltop:1000
									});
								}
								if(!_this.hasClass("branch-tree-link")){
									for (var i = 0; i < data.length; i++) {
										(function(d){
											d.target = "targetFrame";
											d.url = d.isParent ? v_href+"?root="+d.id : "../../xhadmin"+e_href+"?id="+d.id;
										})(data[i]);
									};
								}else{
									for (var i = 0; i < data.length; i++) {
										(function(d){
											d.target = "targetFrame";
											d.url = d.isParent ? v_href+"?root="+d.id : e_href+"?id="+d.id;
										})(data[i]);
									};
								}
								return data;
							}
						},
						callback:{
							onClick:function(event, treeId, treeNode, clickFlag){
								$("#ztree-inner a").each(function(){
									// if(this.href.replace(/[\S]*=/g,"")==treeNode.id){
									// 	var parent=$(this).parent().parent().parent();
									// 	parent.children("a").length?top.treeParentId=parent.children("a").attr("href").replace(/[\S]*=/g,""):top.treeParentId=0
									// }
								})
								//console.log(treeNode.html())
								top.treeLevel=treeNode.leveltop?treeNode.leveltop:treeNode.level;
								top.treeName=treeNode.name;
								top.treeId=treeNode.id;
							}
						}
					});


					//绑定栏目节点树的更新事件
					$("#ztree-inner").off('refresh').on('refresh',function(){
						$(this).html("");
						zt.reAsyncChildNodes();
					});

					treeHolder.show().animate({
						width: "8%",
						opacity: 1
					},'fast',function(){
						_this.addClass('expended');
					});

				}
				e.preventDefault();
			});

			
		});
	}

})(jQuery);