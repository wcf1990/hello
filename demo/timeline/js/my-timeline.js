//1.搜索新闻页面
require(["alerts"],function(){
	//弹框、日历、select美化
	require(["WdatePicker","draggable","form-style"],function(){
	  //新闻标题编辑
	  	$("#load_left").on("click",".editing",function(){
	    	var _this=$(this);
	        jConfirm('<div class="edit_url"><label>&nbsp;稿件Url：</label><input type="text" id="url" name="url" style="border:none;" value="" readonly="readonly" onfocus="this.blur()" /></div> <div class="edit_title"><label>稿件标题：</label><input type="text" value="" /></div> <div class="edit_time"><label>发生时间：</label><input type="text" class="Wdate" id="d412" value="2013-12-30 13：34：43" onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd HH:mm:ss\'});" /></div> <div class="edit_digest"><label>稿件摘要：</label><textarea>继京津冀、长三角、珠三角等区域饱受雾霾困受雾霾扰扰之后，10月21日，东北三省也深陷雾霾，航受雾霾扰空、铁路、道路交通等受其影响严重受阻。重受雾霾扰度雾霾笼罩下的哈尔滨市民惊呼，这是一场“受雾霾扰史上最重雾霾”。</textarea></div>',"编辑稿件",{
	            okButton : "确定",
	            cancelButton : "取消"
	        },function(result){
	            if(result){
	              _this.parent().parent().find("i").html( $(".edit_title>input").val() );    //编辑标题内容
	              _this.siblings(".time0").html( $(".edit_time>input").val() );
	            }
	            
	        });
		    $(".edit_url>input").val( $(this).parent("a").attr("data-href") );     //把稿件url显示到弹框里
	        $(".edit_title>input").val( $(this).parent().parent().find("i").html() );   //把网页标题的内容对应的显示到弹框里
	        $(".Wdate").val( $(this).siblings(".time0").html() );             //把时间对应的显示到弹框里
	    });

	    //手动添加稿件
	    $("#addnews").click(function(){
	    	var canAdd = false, doc = null;
	        jConfirm('<div class="add_id"><label>&nbsp;&nbsp;稿件ID：</label><input type="text" value="" name="ids" /></div><div class="add_title"><label>稿件标题：</label><input type="text" id="url" name="url" style="border:none;" value="[ 输入稿件ID显示相应标题 ]" readonly="readonly" onfocus="this.blur()" /></div><div class="add_time"><label>发生时间：</label><input type="text" id="url" name="url" style="border:none;" value="[ 输入稿件ID显示相应时间 ]" readonly="readonly" onfocus="this.blur()" /></div>',"手动添加稿件",{
	            okButton : "确定",
	            cancelButton : "取消"
	        },function(result){
	            if(result){
	            	renderList([doc],true);
	            	//$("#sou").trigger("click");    //可以使手动添加的稿件置到未选中新闻标题之前
	            	$(".title p").remove();
	            	$(".btn-next").css({background:"#00b6aa"}).attr({ href: "timeline2.html" }); 
	            }

	        });
	        //手动添加稿件blur
		    $(".add_id input").on("blur",function(){
		    	$(".tips").remove();
		    	var _this = $(this);
		    	doc = null;
		    	if( /^\d{1,9}$/.test(_this.val() ) ){
		    		$.ajax({
			    		type:"get",
			    		url:"../../../xhadmin/content/get.do",
			    		data:{
			    			contentId:_this.val()
			    		},
			    		success:function(data){
			    			var o = data.content;
			    			doc = {
			    				cid:_this.val(),   
								title:o.title,              
								date:o.release_date,         
								url:o.origin_url,         
								titleImg:o.titleImgMiddle
			    			};
			    			canAdd = true;
			    			if (canAdd) {
			    				$(".add_title input").val(doc.title);
			    				$(".add_time input").val(doc.date);
			    			};
			    			
			    		},
			    		error:function(){
			    			$("<a class='tips'>未搜索到稿件</a>").appendTo( $(".add_id") );
			    		}
			    	});
		    	}else{
		    		$("<a class='tips'>稿件不存在</a>").appendTo( $(".add_id") );
		    	}
		    });
	    });

		//下拉列表
	    $("#select1").toSelect({
	        width: 290,
	        colorful: false
	    });

	});

	//搜索时排除重复的列表项后再添加到列表中
	function renderList(list,ifChecked){
		var html="";
		for( var i=0;i<list.length;i++ ){
			//判断如果列表中没有相同的id就添加到列表中
			if( !$('[data-id="'+list[i].cid+'"]','#load_left').length ){
				html += '<li data-titleimg="'+(list[i].titleImg||'')+'" data-id="'+list[i].cid+'" '+(ifChecked?'class="checked addlisbg"':"")+'><a href="javascript:void(0)" data-href="'+list[i].url+'"><span class="time0">'+list[i].date+'</span>'+'<i class="con">'+list[i].title+'</i>'+'<span class="right0"></span><span class="editing"></span></a></li>';
			}
		}
		$("#load_left ul").append( $(html) );      //把搜索内容添加到列表中
	}


	//Ajax函数获取数据显示列表
	function getResultList(){
		var kws = [];
		$("#keyword li").each(function(){
			kws.push($(this).text());
		});
		$.ajax({
			type:"get",
			url:top.xhconfig ? top.xhconfig.newsSearch : "/xhCNS/search.htm?",          //json/list.json
			data: {
				from:$("#start-time").val(),        //开始时间   
				to:$("#end-time").val(),            //结束时间
				selectVal:$("#select1").val(),     	//新闻类型
				keyword: kws.join(",") ,            //关键字
				pageNo:1,
				pageSize:20,
				retype:"json",
				searchType:"union"
			},
			success:function( data ){
				$("#load_left ul li:not('.checked')").remove();   //把列表中没有选中的列表项都删除
				$(".btn-next").css({background:"#00b6aa"}).attr({ href: "timeline2.html" });  
				var list = data.content, nlist = [];  
				if(list.length==0){
					//列表里没有内容显示时提示
					if($("#load_left>ul>li").length!=0){
						;
					}else{
						$(".title").append("<p class='no-result'>没有搜索结果，可更换关键词后重新搜索</p>");
						$(".btn-next").css({background:"#dadada"}).attr({ href: "javascript:void(0)" });
					}
				}else{
					$(".title p").remove();
					for (var i = 0; i < list.length; i++) {
						nlist.push({
							cid:list[i].docId,
							title:list[i].docName,
							date:list[i].releaseDate,
							url:list[i].docUrl,
							titleImg:list[i].titleImgMiddle
						});
					};
					renderList(nlist);
				}
			},
			error:function(){
				jAlert('服务端异常');
			}
		});
	}
	getResultList();


	//点击搜索时 添加关键词
	$("#sou").on('click',function(){
		var v = $("#txts").val();
		if( !v ){	//如果是空数据，直接查询
			getResultList();
			return;
		}
		if( $("#keyword").children().length >= 8){
			alert( "最多输入8组关键词" );
			return;
		}
		if( v.replace(/[^x00-xff]/g,"**").length > 8 ){
			alert( "输入标签内容过长" );
			return;
		}
		if( /^[\.\w\u4e00-\u9fa5]+$/.test(v) ){   //如果输入的内容匹配正则表达式，可以查询
			$("#keyword").append('<li><a href="#"><span></span>'+$("#txts").val()+'</a></li>');
			getResultList();
		}else{
			alert( "请输入字母数字或者中文" );
		}
		$("#txts").trigger("focus").val("");
	});
	

	//搜索时 回车触发click事件
	$("#txts").on("keyup",function(e){
		if( e.keyCode == 13 ){
			$("#sou").trigger("click");
		}
	});


	//点击关键词里的 "减" 时，去除关键字
	$("#keyword").on("click","span",function(){
		$(this).parent().parent("li").remove(); 
		//$("#sou").trigger("click");
	});
	

	//列表中点击是否选中  (事件代理)
	$("#load_left").on("click",".right0",function(){
		var lis=$(this).parent().parent();
		if( lis.hasClass("checked") ){
			lis.removeClass("checked addlisbg");
		}else{
			lis.addClass("checked addlisbg");
		}
	});
	//点击新闻标题时链接相应的iframe页面
	$("#load_left").on("click",".con",function(){
		$("#show-frame").attr({
			src: $(this).parent("a").attr("data-href")
		});
	});


	//点击下一步
	$('#btn-submit').on('click',function(){
		parent.timeLineFN.list = [];
		$("#load_left li.checked").each(function(){
			var _this = $(this);
			parent.timeLineFN.list.push({
				cid:_this.data('id'),  // _this.attr('data-id'),   //选中列表项的id  
				title:_this.find(".con").html(),                  //新闻标题内容
				date:_this.find(".time0").html(),                 //日期
				url:_this.children("a").data('href'),             //Url
				titleImg:_this.data('titleimg')
			});
		});
		parent.timeLineFN.list.sort(function(a,b){                //时间排序
			return a.date > b.date ? 1 : -1;
		});
		//把搜索的关键词添加到数组中【new】
		parent.timeLineFN.keyword = [];
		$("#keyword li").each(function(){
			parent.timeLineFN.keyword.push( $(this).find("a").text() )
		});
		
	});


	//回显选中的列表项
	if( parent.timeLineFN.list.length ){
		renderList( parent.timeLineFN.list, true );
	}

	//（获取）关键词【new】
	function getkeyword(){
		for( var i=0;i<parent.timeLineFN.keyword.length;i++ ){
			$("#keyword").append('<li><a href="#"><span></span>'+parent.timeLineFN.keyword[i]+'</a></li>');
		};
		if(parent.timeLineFN.keyword.length){
	    	$("#sou").trigger("click");
	    };
	}
    getkeyword();

	    
    //获取新闻类型数据
    function getconType(){
    	var optionhtml="";
	    for(var i=0;i<parent.cacheDetail.typeList.length;i++){
	    	var typelist=parent.cacheDetail.typeList[i].name;
	    	optionhtml+='<option value="'+typelist+'">'+typelist+'</option>';
	    }
	    $("#select1").append( $(optionhtml) );
    }
    getconType();
    






});