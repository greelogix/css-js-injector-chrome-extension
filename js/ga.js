chrome.storage.sync.get("css_injector", function(data) {
    var l = document.location.href;

    try{

    	function getHostName(url) {
		    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
		    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
		    return match[2];
		    }
		    else {
		        return null;
		    }
		}


    	console.log( ' ------ css injection ------ ')
    	console.log( data);
    	console.log( ' ------ css injection ------ ')

	    var css = document.createElement("style");
	    css.type = "text/css";
	    try{
	    	css.innerHTML = data.css_injector[l].css;	
	    }catch(ex){
	    	console.warn( ex );
	    }	    
	    //getHostName(l)
	    css.innerHTML = data.css_injector[l].css;
	    document.body.appendChild(css);

	    
		var css = document.createElement("style");
		try{
	    	css.innerHTML = data.css_injector[l].css;	
	    }catch(ex){
	    	console.warn( ex );
	    }	    
	    // css.innerHTML = data.css_injector[getHostName(l)].css;
	    css.innerHTML = data.css_injector[l].css;
	    document.body.appendChild(css);

	    try{
	    	if( ! (data.css_injector[l].js == 'undefined'  ||  typeof data.css_injector[l].js == undefined )){
    			var css = document.createElement("script");
			    css.type = "text/javascript";
			    css.innerHTML = data.css_injector[l].js;
			    document.body.appendChild(css);
	    	}
		    
		}catch(ex){
	    	console.err( ex );
	    }	    

    }catch(ex){
    	console.warn(ex)
    }
});