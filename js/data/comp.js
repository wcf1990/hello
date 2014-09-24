var xmlreader = require('xmlreader'),
	fs = require('fs');

fs.readFile('world.xml',function(err,data){
	xmlreader.read(data.toString(),function(err,json){
		function children(t){
			return t['continent'] || t['country'] || t['province'] || t['city'] || t['county'] || {}
		}
		var location = {};
		function exec(w){
			var world = [], selector = {}, attr = w.attributes(), c = children(w) ;
			location[attr.code] = ([
				(attr.lon||'').replace(/(\.\d{2})\d+$/,'$1')
				,
				(attr.lat||'').replace(/(\.\d{2})\d+$/,'$1')
			]).join(',');

			world.push( ([attr.code,attr.value,attr.parentCode,attr.firstHead,attr.en]).join(',') );
			if(c.attributes && !c.array){
				c.array = [c];
			}
			if( c.array ){
				world.push( [] );
				c.array.map(function(m,i){
					var result = exec( m ), att = m.attributes(), ch = children(m);
					world[1].push(result.world);

					if(ch.array){
						selector[att.value+'_'+att.code] = result.selector;
					}else{
						selector[att.value] = att.code
					}
						
				});
			}else if(c.attributes){
				var  attt = c.attributes();
				selector[attt.value] = attt.code
			}
			
			return {
				world:world,
				selector:selector
			}
		}

		var m = exec(json.world);
		fs.writeFile( 'world.js', 'World = '+JSON.stringify(m.world) ,function(err){
			console.log( err || 'world.js OK')
		});
		fs.writeFile( 'world-selector.js', 'ContinentArea = '+JSON.stringify(m.selector) + '; Area = (function(a){var m = {};for(var i in a){ if(typeof a[i] === "object"){ (function(s){ for(var t in s){m[t]=s[t]} })(a[i]) } };return m;})(ContinentArea);' ,function(err){
			console.log( err || 'world-selector.js OK')
		});
		fs.writeFile( 'world-location.js', 'World_location = '+JSON.stringify(location) ,function(err){
			console.log( err || 'world-location.js OK')
		});
	})
})