//2.设置时间轴页面
  require(['time-line','timeline','underscore','alerts'],function(Timeline){
    
    var list = [], timel;
    //复制 & 修改属性名
    _.each(parent.timeLineFN.list,function(item){
      list.push({
        cid: item.cid,
        title: item.title,
        date: item.date,
        url : item.url,
        titleImg : item.titleImg
      });
    }); 

    function renderTimeline(){
      var dd = $('#timel_rank').children('.cur').data('value') | 0, d = 10;    //时间刻度
      var rank = $('#timer_rank').children('.cur').data('value');              //时间轴样式
      var trank = $('#trank_rank').children('.cur').data('value'),             //默认时间位置
          newest = (trank == 'newest');      //(trank == 'newest')返回的是TRUE/FALSE，即newest是TRUE/FALSE

      switch(dd){
        case 0: d = 4; break;
        case 1: d = 7; break;
        case 3: d = 13; break;
        case 4: d = 16; break;
      }
      var data = {
        timelineContent:[]
      }; 
      //分组
      var _list = _.groupBy(list,function(item){
        return item.date.substring(0,d);
      });   
      for(var k in _list){
        data.timelineContent.push({
          time:k,
          data:_list[k]
        });
      }     
      //生成时间轴 (标题横轴式/图文横轴式可切换)
      $('#my-timeline').html("");
      if( rank == "title" ){ 
        //判断如果是《定位到最新》把分过组的数组顺序翻转 注:("标题横轴式"的默认时间位置选择)
        if( newest ){
          data.timelineContent.reverse();
        }

        timel = Timeline({
          embed : '#my-timeline',
          onDel : function(){
            var listIds = this.getAllIds(),  //.join(','),   //删除之后的数组id（取得仅仅是id）（加join()的话就成字符串了）
                oldList = parent.timeLineFN.list,            //列表中选中部分
                newList = [],                                //放入删除之后的id列表
                newList2 = [];                               //放入删除之后的id列表（对应list列表，相当于复制newList）
            for (var i = 0; i < oldList.length; i++) {
              if( _.indexOf(listIds,oldList[i].docId) !== -1 ){
                newList.push(oldList[i]);
                newList2.push(list[i]);
                ids.push(list[i])
              }
            };

            list = newList2; 
            parent.timeLineFN.list = newList;
          }
        },data);
      }else{
        createStoryJS({
            type:       'timeline',
            width:      '100%',
            height:     '720',
            start_at_slide: 0,
            start_zoom_adjust:  8,
            lang:"zh-cn",
            source:     null,
            embed_id:   'my-timeline',
            start_at_end: newest        //"图文横轴式"的默认时间位置选择
        },data);
      }
    }
    
    $(".select-all ul li").click(function(){      
      if( $(this).hasClass('cur') ){
        return false;
      }
      $(this).addClass("cur").siblings("li").removeClass("cur");      //加减背景色样式
      window.allIds = timel.getAllIds();
      renderTimeline();
    });

    renderTimeline();


    $("#time_name input").val( parent.timeLineFN.name );
    $('#timel_rank li[data-value="'+(parent.timeLineFN.density||2)+'"]').trigger('click');
    
    //点击“完成”按钮
    $("#complete").on('click',function(){
      var ids = timel.getAllIds();
      var data = {
            name : $("#time_name input").val(),                       //时间轴名称
            grank_rank: $('#grank_rank li.cur').data("value"),        //稿件排序方式
            trank_rank: $('#trank_rank li.cur').data("value"),        //默认时间位置
            density: $('#timel_rank li.cur').data("value"),           //时间刻度
            timer_rank: $('#timer_rank li.cur').data("value"),        //时间轴样式
            refcids : ids.length ? ids : window.allIds
        };
        //时间轴名称为空提示
        if(!data.name){
          jAlert("时间轴名称必须填写", "温馨提示", function() {
            $(window).scrollTop(0);
            $("#time_name input").focus();
          });
        }else{
          parent.timeLineFN.complete(data);
        }

    });

    $('#cancel').on('click',function(){
        parent.timeLineFN.close();
    });

  });




