window.onData = window.parent.onAreaSelecter || function(node,isLeaf){
	if(isLeaf)alert( "选中的ID:" + node.id + (isLeaf?" 是叶子节点":"") );
};
window.onData.ready = window.onData.ready || new Function();
$("#tabs").tabs();

//加工元数据,主要提供按照字母级别分类和根据ID获取带结构的数据
var ll = "abcdefghijklmnopqrstuvwxyz".split("");
var WorldFactory = function(world){
	var kw = {}, wld = [world[0],[]];
	function _exec(w){
		if( !w ) return null;
		var t = w[0].split(",");
		var o = {
			id : t[0],
			name : t[1],
			parent: t[2],
			fullname : (function(name,parent){
				var s = name, t = parent;
				while( t && t.id != -1 && t.id != 0 && t.id != "1560000000" ){
					s = t.name + '-' + s;
					t = kw[ t.parent ];
				}
				return s;
			})(t[1],kw[t[2]]),
			prefix: t[3],
			en: t[4],
			children: (function(cld){
				var t = [];
				for (var i = 0; cld && i < cld.length; i++) {
					t.push( _exec(cld[i]) );
				};
				return t.length ? t : null
			})(w[1]),
			groups: (function(cld){
				var t = [];
				for (var i = 0; cld && i < cld.length; i++) {
					t.push( _exec(cld[i]) );
				};
				if( t.length ){
					var m = _.groupBy(t, "prefix"), r=[]; 	//按照字母分组
					for (var i = 0; i < ll.length; i++) {	//按照字母顺序排列(顺便改大写)
						r.push({			
							prefix: ll[i].toUpperCase(),
							list: m[ll[i]] || []
						});
					};
					return r;
				}else{
					return null;							
				}
			})(w[1])
		};
		kw[o.id] = o;
		if( o.id === "1560000000" ){ o.prefix = "zn", kw["0"] = o;} //中国从世界中剥离, 通过0索引
		return o;	
	}

	var zhou = world[1];
	for (var i = 0; i < zhou.length; i++) {
		wld[1] = wld[1].concat( zhou[i][1] );
	}
	kw.root = _exec(wld);
	this.getArea = function(id){
		return (id+"") ? kw[id] : kw.root;
	}
};
window.World[1].length = 6; //去除6大洲以外的异常数据
var factory = new WorldFactory(window.World);

var china = factory.getArea(0);
var foreign = factory.getArea(-1);

china.groups.splice(0,0,{
	prefix:'热门省份直辖市',
	list:[
		{id:'7',name:'全国性'},
		{id:'1561100000',name:'北京'},
		{id:'1563100000',name:'上海'},
		{id:'1561200000',name:'天津'},
		{id:'1564400000',name:'广东'},
		{id:'1563300000',name:'浙江'},
		{id:'1561300000',name:'河北'},
		{id:'1563200000',name:'江苏'}
	]
});

foreign.groups.splice(0,0,{
	prefix:'热门国家',
	list:[
		{id:'8',name:'海外'},
		{id:'8400000000',name:'美国'},
		{id:'8260000000',name:'英国'},
		{id:'3920000000',name:'日本'},
		{id:'3800000000',name:'意大利'},
		{id:'6430000000',name:'俄罗斯'},
		{id:'2500000000',name:'法国'},
		{id:'2760000000',name:'德国'}
	]
});

var compile = Handlebars.compile( $("#tmp-item-list").html() ), 
	compile2 = Handlebars.compile( $("#tmp-item-list-2").html() ), 
	chinaPannel = $("#china .pannel").html( compile(china) ),
	foreignPannel = $("#foreign .pannel").html( compile(foreign) );


function _attchEvent(Pannel,data){

	// 点击选择地点
	Pannel.on("click","a",function(e){
		var id = $(this).data("id"), detail = factory.getArea(id) || {id:id,name:$(this).html()}, isLeaf = detail && !detail.children;
		if( !isLeaf ){
			Pannel.html( compile2(detail) ).scrollTop(0);
		}
		window.onData( detail, isLeaf );
		Pannel.siblings(".letter-select-2").slideDown(function(){
			$(this).find(".current").trigger("click");
		});
		e.preventDefault();
	});

	// 点击定位字母列表
	Pannel.siblings(".letter-select").on("click","li",function(e){
		var _this = $(this), key = _this.data("c"), keyClz = ".href-"+key;
		_this.addClass("current").siblings().removeClass("current");
		
		//切换第一级别定位需要重新加载数据
		if( $(e.delegateTarget).hasClass("letter-select-1") ){
			Pannel.html( compile(data) ); 
			Pannel.siblings('.letter-select-2').slideUp();
		}
		var t = (  $(keyClz,Pannel).offset().top + Pannel.scrollTop() - 38 );
		Pannel.stop().animate({scrollTop: t });
	});

	Pannel.on("click","h4",function(e){
		var _this = $(this), 
			id = _this.data("id"), 
			isLeaf = !_this.hasClass("has-child"), 
			detail = factory.getArea(id) || {id:id,name:$(this).html()};

		window.onData( detail, isLeaf );
		if(!isLeaf)$(this).toggleClass("expended").next().slideToggle();
	});

};
_attchEvent( chinaPannel,china );
_attchEvent( foreignPannel,foreign );


window.onData.ready(factory);
$("#loading").remove();