(function($){
window.isLocal = !( location.host && /news\.cn|65\.\d+/.test(location.host) );

var conf = 	
{

	'dataSet':{
		URL :(isLocal ? {
			dataSet:"json/dataSet.json",
			dataUp:"json/dataUp.json",
			changePassword:"json/changePassword.json"
		}:{
			dataSet:"/web/current/user.json",
			dataUp:"/web/current/user/update.json",
			changePassword:"/web/current/user/changePassword.json"
		})
	},
	'msg':{
		navLine: '<a href="javascript:void(0);">站内信</a>',
		URL : (isLocal ? {
				groups : "json/groups.json",
				submit_form: "json/createMsg.json",
				send_lists: "json/msgSendList.json",
				receive_lists: "json/msgReceiveList.json",
				recycle_lists: "json/msgRecycleList.json",
				deleteMsg:"json/success.json",
				deleteMsgs:"json/success.json",
				deleteRecycle:"json/success.json",
				deleteRecycles:"json/success.json"
			} : {
				groups : "json/groups.json",
				submit_form: "/web/admin/msg/create.json",
				send_lists: "/web/admin/msg/all/send/list.json?",
				receive_lists: "/web/admin/msg/all/all/list.json?",
				recycle_lists: "/web/admin/msg/user/recycle/list.json?",
				deleteMsg:"/web/admin/msg/{{id}}/recycle.json",
				deleteMsgs:"/web/admin/msg/batch/recycle.json",
				deleteRecycle:"/web/admin/msg/{{id}}/delete.json",
				deleteRecycles:"/web/admin/msg/batch/delete.json"
			})
	},
	"clmConfigur":{
 		URL : (isLocal ? {
 				clmConfigur: "json/list-collocate.json"
	 		}:{
	 			clmConfigur: "json/list-collocate.json"
	 		})
	},
	"siteConfigur":{
 		URL : (isLocal ? {
 				siteConfigur: "json/list-sites.json"
	 		}:{
	 			siteConfigur: "json/list-sites.json"
	 		})
	},
	"branchManage":{
 		URL : (isLocal ? {
 				branchList: "json/list-branches.json",
 				branchTreeData:"../../html/json/treeAll.json"
	 		}:{
	 			branchList: "json/list-branches.json",
	 			branchTreeData:"../../html/json/treeAll.json"
	 		})
	},
	'newsClassify':{        //start
		URL : (isLocal ? {
				newsClassify : "json/site-config.json"
				// newsDelete : "json/site-config.json",
				// newsMoveUp : "json/site-config.json",
				// newsMoveDown : "json/site-config.json",
				// newsTop : "json/site-config.json"
			} : {
				newsClassify : "json/site-config.json"
				// newsDelete : "json/site-config.json",
				// newsMoveUp : "json/site-config.json",
				// newsMoveDown : "json/site-config.json",
				// newsTop : "json/site-config.json"
			})
	},
	'conClassifyConf':{      
		URL : (isLocal ? {
				conClassifyConf : "json/site-config.json"
				// conDelete : "json/site-config.json",
				// conMoveUp : "json/site-config.json",
				// conMoveDown : "json/site-config.json",
				// conTop : "json/site-config.json"
			} : {
				conClassifyConf : "json/site-config.json"
				// conDelete : "json/site-config.json",
				// conMoveUp : "json/site-config.json",
				// conMoveDown : "json/site-config.json",
				// conTop : "json/site-config.json"
			})
	},
	'columnModelConf':{
		URL : (isLocal ? {
				columnModelConf : "json/list-model.json",
				columnDelete : "json/list-model.json",
				columnMoveUp : "json/list-model.json",
				columnMoveDown : "json/list-model.json",
				columnTop : "json/list-model.json"
			} : {
				columnModelConf : "json/list-model.json",
				columnDelete : "json/list-model.json",
				columnMoveUp : "json/list-model.json",
				columnMoveDown : "json/list-model.json",
				columnTop : "json/list-model.json"
			})
	},
	'addColumnModel':{
		URL : (isLocal ? {
				addColumnModel : "json/add-columnModel.json",
			} : {
				addColumnModel : "json/add-columnModel.json",
			})
	},
	'listColumnModel':{
		URL : (isLocal ? {
				listColumnModel : "json/list-columnModel.json",
			} : {
				listColumnModel : "json/list-columnModel.json",
			})
	},
	'listContModel':{
		URL : (isLocal ? {
				listContModel : "json/list-columnModel.json",
			} : {
				listContModel : "json/list-columnModel.json",
			})
	},
	'letterContent':{
		URL:(isLocal?{
			letterContent:"json/letter-cont.json"
		}:{
			letterContent:"/web/admin/msg/{{id}}.json"
		})
	},
	'channelEdit':{
		URL:(isLocal?{
			dataSource:"json/channel.json"
		}:{
			dataSource:"json/channel.json"
		})
	}            //end

};

$('<style id="css-style-switch"></style>').appendTo( $('body') );

$.initFrame = function(key){
	var _this = conf[key];
	if( _this ){
		if( window.top != window ){
			if( _this.navLine ) {
				$(".mainHead",top.document).html( _this.navLine );
			}
		}

		//测试时候使用
		if( true || !window.isLocal ){
			for (var k in _this.URL) {
				_this.URL[k] = _this.URL[k].replace("/web/admin","http://172.18.11.80/web/admin");
				_this.URL[k] = _this.URL[k].replace("/web/current","http://172.18.11.80/web/current");
			};
		}
			
	}
	return _this;
};

window.cssSwitch = function(){
	var cssTxt = $("#css-style-switch",top.document).html();
	if( !!cssTxt ){
		var css = $('<style id="css-style-switch">'+ cssTxt + '</style>');
		$('#css-style-switch').replaceWith(css);
	}
	return !cssTxt;
};

if( window.top != window ){
	require(['requestAFrame'],function(R){
		R.addTimeout('cssSwitch',cssSwitch);
	});
}

})(jQuery);