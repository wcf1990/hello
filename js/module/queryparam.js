;(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    root.QueryParam = factory();
  }

}(this,function(require, exports, module) {
	//缓存的地址栏参数对象
	var queryParam = {};
    /**
     * 通过 传入的key 获取对应的search参数 
    **/
	return function(key){
	    var search = queryParam.search ||  (function(w){
	        var m = {},ar = w.location.search, t;
	        if(ar){
	        	ar.substring(1).replace( /([^&=]+)[=]([^&=]*)[&=\b]?/g,function(macth,k,v){
	        		switch( typeof m[k] ){
	                	case 'string': //如果是重复参数，包装成数组
	                		m[k] = new Array( m[k], decodeURIComponent(v) );
	                		break;
	                	case 'object': //如果已经是数组，push
	                		m[k].push( decodeURIComponent(v) );
	                		break; 
	                	default: 	//第一次需要设置为字符串
	                 		m[k] = decodeURIComponent(v);
	                }
	        	} );
	        }
	        queryParam.search = m;
	        return m;
	    })(window);
	    return key ? search[key] : search;
	}
}));