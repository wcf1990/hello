// jQuery Alert Dialogs Plugin
//
// Version 1.0
//
// Cory S.N. LaViska
// A Beautiful Site (http://abeautifulsite.net/)
// 29 December 2008
//
// Visit http://abeautifulsite.net/notebook/87 for more information
//
// Usage:
//		jAlert( message, [title, callback] )
//		jConfirm( message, [title, callback] )
//		jPrompt( message, [value, title, callback] )
// 
// History:
//
//		1.00 - Released (29 December 2008)
//
// License:
// 
//		This plugin is licensed under the GNU General Public License: http://www.gnu.org/licenses/gpl.html
//
(function($) {
	
	$.alerts = {
		
		// These properties can be read/written by accessing $.alerts.propertyName from your scripts at any time
		
		verticalOffset: -75,                // vertical offset of the dialog from center screen, in pixels
		horizontalOffset: 0,                // horizontal offset of the dialog from center screen, in pixels/
		repositionOnResize: true,           // re-centers the dialog on window resize
		overlayOpacity: .01,                // transparency level of overlay
		overlayColor: '#FFF',               // base color of overlay
		draggable: true,                    // make the dialogs draggable (requires UI Draggables plugin)
		okButton: '是',         // text for the OK button
		cancelButton: '否', // text for the Cancel button
		returnButton:'确定',
		dialogClass: null,                  // if specified, this class will be applied to all dialogs
		defaultSpeed:3000,
		// Public methods
		tip:function(message,speed){
			if(speed==null) speed=$.alerts.defaultSpeed;
			$.alerts._show('温馨提示',message,null,'tip',function(){
				setTimeout(function(){
					$.alerts._hide('slow');
				},speed); 
			});
		},
		alert: function(message, title, callback) {
			if( title == null ) title = '温馨提示';
			$.alerts._show(title, message, null, 'alert', function(result) {
				if( callback ) callback(result);
			});
		},
		
		confirm: function(message, title, arg, callback) {
			if( title == null ) title = '温馨提示';
			if( typeof arg === "function" ){
				callback = arg;
				arg = {};
			}
			$.alerts._show(title, message, null, 'confirm', function(result) {
				if( callback ){
					return callback(result);
				}
			}, arg);
		},
			
		prompt: function(message, value, title, callback) {
			if( title == null ) title = '温馨提示';
			$.alerts._show(title, message, value, 'prompt', function(result) {
				if( callback ) callback(result);
			});
		},
		
		// Private methods
		
		_show: function(title, msg, value, type, callback, arg) {
			
			$.alerts._hide();
			type=="tip"?$.alerts._overlay('hide'):$.alerts._overlay('show');
			$("BODY").append(
			  '<div id="popup_container">' +
			    '<h1 id="popup_title"></h1>' +
			    '<div id="popup_content">' +
			      '<div id="popup_message"></div>' +
				'</div>' +
			  '</div>');
			
			if( $.alerts.dialogClass ) $("#popup_container").addClass($.alerts.dialogClass);
			
			$("#popup_container").css({
				position: "fixed",
				_position: "absolute",
				zIndex: 99999,
				padding: 0,
				margin: 0
			});
			
			$("#popup_title").text(title);
			var messageHolder = $("#popup_message").html(msg);
			
			$("#popup_container").css({
				minWidth: $("#popup_container").outerWidth(),
				maxWidth: $("#popup_container").outerWidth(),
				minWidth:'400px',
				maxWidth:'auto'
			});
			
			$.alerts._reposition();
			$.alerts._maintainPosition(true);
			
			switch( type ) {
				case 'tip':
					messageHolder.after('<div id="popup_panel" style="height:15px"></div>');
					$("#popup_content").addClass('right');
					callback(true);
					break;
				case 'alert':
					messageHolder.after('<div id="popup_panel"><a id="popup_ok" class="fm-button">'+ $.alerts.returnButton + '</a></div>');
					title=='错误'?$("#popup_content").addClass('wrong'):$("#popup_content").addClass(type);
					$("#popup_ok").click( function() {
						$.alerts._hide();
						callback(true);
					});
					$(document).one("keydown",function(e) {
						if( e.keyCode == 13 || e.keyCode == 27 )
							 $("#popup_ok").trigger('click');
					});
				break;
				case 'confirm':
					var okButton = arg.okButton || $.alerts.okButton,
						cancelButton = arg.cancelButton || $.alerts.cancelButton;
					messageHolder.after('<div id="popup_panel"><a id="popup_cancel" class="fm-button btn-cancel">'+ cancelButton + '</a><a id="popup_ok" class="fm-button">'+ okButton + '</a></div>');
					title=='错误'?$("#popup_content").addClass('wrong'):$("#popup_content").addClass(type);
					$("#popup_ok").click( function() {
						if( callback && false !== callback.call( messageHolder, true ) ){
							$.alerts._hide();
						}
					});
					$("#popup_cancel").click( function() {
						if( callback && false !== callback.call( messageHolder, false ) ){
							$.alerts._hide();
						}
					});
					$("#popup_ok").focus();
					$(document).one("keydown",function(e) {
						if(e.keyCode == 13 || e.keyCode == 27 ) 
							$("#popup_ok").trigger('click');

					});
				break;
				case 'prompt':
					messageHolder.append('<br /><input type="text" size="30" id="popup_prompt" />').after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" class="fm-button" /> <input type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" class="fm-button btn-cancel" /></div>');
					title=='错误'?$("#popup_content").addClass('wrong'):$("#popup_content").addClass(type);
					$("#popup_prompt").width( $("#popup_message").width() );
					$("#popup_ok").click( function() {
						var val = $("#popup_prompt").val();
						$.alerts._hide();
						if( callback ) callback( val );
					});
					$("#popup_cancel").click( function() {
						$.alerts._hide();
						if( callback ) callback( null );
					});
					$(document).one("keydown",function(e) {
						if(e.keyCode == 13 || e.keyCode == 27 )
							$("#popup_ok").trigger('click');

						
					});
					if( value ) $("#popup_prompt").val(value);
					$("#popup_prompt").focus().select();
				break;
			}
			
			// Make draggable
			if( $.alerts.draggable ) {
				try {
					$("#popup_container").draggable({ handle: $("#popup_title") });
					$("#popup_title").css({ cursor: 'move' });
				} catch(e) { /* requires jQuery UI draggables */ }
			}
		},
		
		_hide: function(speed) {
				if(speed){
					$("#popup_container").hide(speed,function(){
						$("#popup_container").remove();
						$.alerts._overlay('hide');
						$.alerts._maintainPosition(false);
					})
				}else{
						$("#popup_container").remove();
						$.alerts._overlay('hide');
						$.alerts._maintainPosition(false);
				}
				
		},
		_overlay: function(status) {
			switch( status ) {
				case 'show':
					$.alerts._overlay('hide');
					$("BODY").append('<div id="popup_overlay"></div>');
					$("#popup_overlay").css({
						position: 'absolute',
						zIndex: 99998,
						top: '0px',
						left: '0px',
						width: '100%',
						height: $(document).height(),
						background: $.alerts.overlayColor,
						opacity: $.alerts.overlayOpacity
					});
				break;
				case 'hide':
					$("#popup_overlay").remove();
				break;
			}
		},
		
		_reposition: function() {
			var top = (($(window).height() / 2) - ($("#popup_container").outerHeight() / 2)) + $.alerts.verticalOffset;
			var left = (($(window).width() / 2) - ($("#popup_container").outerWidth() / 2)) + $.alerts.horizontalOffset;
			if( top < 0 ) top = 0;
			if( left < 0 ) left = 0;
			
			$("#popup_container").css({
				top: top + 'px',
				left: left + 'px',
				border:'1px solid #c4c4c4'
			});
			$("#popup_overlay").height( $(document).height() );
		},
		
		_maintainPosition: function(status) {
			if( $.alerts.repositionOnResize ) {
				switch(status) {
					case true:
						$(window).bind('resize', function() {
							$.alerts._reposition();
						});
					break;
					case false:
						$(window).unbind('resize');
					break;
				}
			}
		}
		
	}
	
	// Shortuct functions
	jTip = function(message,speed){
		$.alerts.tip(message,speed);
	}
	jAlert = function(message, title, callback) {
		$.alerts.alert(message, title, callback);
	};
	
	jConfirm = function(message, title, btns, callback) {
		$.alerts.confirm(message, title, btns, callback);
	};
		
	jPrompt = function(message, value, title, callback) {
		$.alerts.prompt(message, value, title, callback);
	};
	
})(jQuery);