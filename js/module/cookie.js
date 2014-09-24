;(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    root.Cookie = factory();
  }

}(this,function(require, exports, module) {
	return {
			set:function(c_name,value,expiredays){
				var finalValue = escape(value);
				var exdate = new Date();
				exdate.setDate(exdate.getDate() + (expiredays|| 1) );
				document.cookie=c_name+ "=" +finalValue+((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
			},
			get:function(c_name){
				if (document.cookie.length>0){
					var c_start=document.cookie.indexOf(c_name + "=");
					if (c_start!=-1){ 
						c_start=c_start + c_name.length+1 ;
						c_end=document.cookie.indexOf(";",c_start);
						if (c_end==-1) c_end=document.cookie.length;
							return unescape(document.cookie.substring(c_start,c_end));
			  			} 
					}
				return "";
			}
		};
}));
