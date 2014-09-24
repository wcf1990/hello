/**
 * @author wangcaifeng
 * @date: 2014-8-4
 * @namespace NodeChosse
 * @alone
 * @description dialog节点选择删除
*/

define(function(require, exports, module) {
	var _default = {
		dialogContent:'',
		width:540,
		height:'auto',
		node:'',
		treeContainer:'',
		url:'../html/json/tree.json',
		title:'',
		showIcon:false,
		data:'',
		multi:true,
		open:function(){},
		callback:function(){},
		unification:function(){},
	};

	/**
	 * @alias param options
	 * @param {String} dialogContent 已选节点默认html陈列
	 * @param {Number} width height dialog框宽高
	 * @param {Node}   node dialog框id
	 * @param {Node}   treeContainer tree容器
	 * @param {String} url tree请求地址
	 * @param {String} title dialog标题
	 * @param {Boolean} showIcon 是否默认样式
	 * @param {Object} data 回显数据 example[{name:'name',id:'id'}]
	 * @param {Boolean} multi 是否只能单选
	 * @param {Function} open dialog打开时操作
	 * @param {Function} unification dialog关闭时操作
	 * @param {Function} callback 保存回调
	*/

	var NodeChosse=function(opt){
		var o = $.extend(_default,opt);
		var node=$(o.node);
		node.empty();
		var gotUp={};
		var template=Handlebars.compile(o.dialogContent);
		var multi=o.multi;
		node.append(template(gotUp));

		

		node.dialog({
			appendTo:"body",
			width:o.width,
			height:o.height,
			modal:false,
			showTitle:true,
			title:o.title,
			autoOpen:true,
			open:function(event, ui){
				node.addClass("ztree")
				var setting={
					view: {
						showIcon: o.showIcon
					},
					async: {
						url:o.url,
						enable: true,
						autoParam: ["id"]
					},
					callback: {
						onClick: onClick
					}
				}
				function onClick(event, treeId, treeNode, clickFlag) {
					if(multi){
						var count=0;
						for(i=0; i< logs.find("li").length; i++){
							if(logs.find("li").eq(i).attr("data-id")==treeNode.id){
								count+=1;
							}
						}
						if(count==0){
							var re="<li"+" "+"data-id="+"'"+treeNode.id+"'>"+treeNode.name+"</li>";
							logs.append(re);
						}
					}else {
						if(logs.find("li").length<=1){
							var re="<li"+" "+"data-id="+"'"+treeNode.id+"'>"+treeNode.name+"</li>";
							logs.html("").append(re);
						}
					}

				}
				$.fn.zTree.init($(o.treeContainer), setting);
				o.open();
			},
			close:function(){o.unification();},
			buttons:[
				{
					text:'保存',
					icons:{primary: "ui-submit"},
					className:'button-submit',
					id:'gatherDoc_submit',
					click:function(){
						var ids=[], objs = [];
						$("#logs li").each(function(){
							var id = $(this).attr("data-id"), name = $(this).text();
							ids.push( id );
							objs.push({id:id,name:name});
						})
						o.callback(ids,objs);
						node.dialog("close");
					}
				},
				{
					text:'取消',
					icons:{primary: "ui-cancel"},
					className:'button-cancel',
					id:'gatherDoc_cancel',
					click:function(){node.dialog("close");}
				}
			]
		});
		var logs = $("#logs");
		var redo="<i>—</i>";
		for(var k in o.data){
			if(o.data[k]["id"]){
				var re="<li"+" "+"data-id="+"'"+o.data[k]["id"]+"'>"+o.data[k]["name"]+"</li>";
				logs.append(re);
			}
		}
		logs.on("mouseenter","li",function(){
			if($("this:has(i)").length==0){
				$(this).append(redo);
				$(this).find("i").click(function(){
					$(this).parent().remove();
				})
			}
		})
		logs.on("mouseleave","li",function(){
				$(this).find("i").remove();
		});
	}
	return NodeChosse;

})