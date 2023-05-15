/*

Module is for load javascript file and managerment javaScript module
write by 邬畏畏(David)


*/


window.Module = {
	ingress : function(){}, /*通过require()方法重设*/
	callback : [],
	cache : [], /*cache 只记录加载的js url*/
	memoCache: {},
	template : {},
	headElement : document.getElementsByTagName("head")[0],
	exports: {},
	nameIndex: 0,
	import:function(url,_name){
		/*
		url is 可选项
		*/
		var name;
		if(arguments.length==1)
		{
			name = url;
			return this.exports[name];
		}
		else if(arguments.length==2)
		{
			name = _name;
			return this.LoadOne(url,name);
		}
	},
	/*接口方法*/
	load : function(url,name,callback){
		/*urls is array*/
		var headElement = this.headElement;
		var len , i , js;
		this.url = url;
		this.cache = this.cache || [];
		if(arguments.length == 3 && !!!name)
		{
			name = "module_" + this.nameIndex;
			this.nameIndex++;
		}
		else if(arguments.length==2)
		{
			if(typeof(name) == "function")
			{
				callback = name;
				name = "module_" + this.nameIndex;
				this.nameIndex++;
			}
		}
		this.asyncLoad(this.url,name,callback);
	},
	asyncLoad : function(url,name,callback){
		var i;
		var js;
		var th = this;
		/*
		js = document.createElement("script");
		js.type = "text/javascript";
		js.src = url;
		*/
		this.url = url;

		if(!!!this.memoCache[this.url])
		{
			js = document.createElement("script");
			js.type = "text/javascript";
			js.src = url;
			this.headElement.appendChild(js);
		}

		js.onload = js.onreadystatechange = function() {
			if(window.navigator.userAgent.indexOf("MSIE") > 0)
			{
				if(js.readyState == "loaded" || js.readyState == "complete")
				{
					th.cache.push(th.url);
					th.exports[name];
					th.memoCache[th.url] = true;
					callback&&callback();
				}
			}
			else
			{
				th.cache.push(th.url);
				th.exports[name];
				th.memoCache[th.url] = true;
				callback&&callback();
			}
		}
		//this.headElement.appendChild(js);
	},
	loadPromise : function(url,name,callback){
		var headElement = this.headElement;
		var len , i , js;
		this.url = url;
		this.cache = this.cache || [];
		var i;
		var js;
		var th = this;
		
		if(!!!this.memoCache[url])
		{
			js = document.createElement("script");
			js.type = "text/javascript";
			js.src = url;
			this.headElement.appendChild(js);
		}

		return new Promise(function(resole,reject){
			if(!!th.memoCache[url])
			{
				callback&&callback();
				resole(name);
				return;
			}
			js.onload = js.onreadystatechange = function() {
				if(window.navigator.userAgent.indexOf("MSIE") > 0)
				{
					if(js.readyState == "loaded" || js.readyState == "complete")
					{
						th.memoCache[th.url] = true;
						th.exports[name];
						callback&&callback();
						resole(name);
					}
				}
				else
				{
					th.memoCache[th.url] = true;
					th.exports[name];
					callback&&callback();
					resole(name);
				}
			}
		});		
	},

	/*loadOne is load js fragment*/
	LoadOne : function(url,name){
		var js;
		var th = this;
		var i , cache = this.cache , len = cache.length;
		var jsText = "";

		for(i=0;i<len;i++)
		{
			if(url==cache[i])
			{
				return th.exports[name];
			}
		}
		
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function(){
			jsText += xmlhttp.responseText
		}
		xmlhttp.open("GET",url,false);
		xmlhttp.send(null);
		js = document.createElement("script");
		js.type = "text/javascript";
		js.innerHTML = jsText;
		this.headElement.appendChild(js);
		this.cache.push(url);
		return th.exports[name];
	},

	define : function(f){
		this.callback.push(f);
	},
	require : function(f){
		this.ingress = f;
	},
	loadCss : function(url){
		var link;
		link = document.createElement('link');
		link.href = url;
		link.type = 'text/css';
		link.rel = 'stylesheet';
		if(!!this.memoCache[url])
		{
			return;
		}
		this.memoCache[url] = true;
		this.headElement.appendChild(link);
	},
	loadTemplate : function(url){
		var v, html = '';
		for(v in this.template)
		{
			if(v==url)
			{
				return this.template[v];
			}
		}
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function(){
			html += xmlhttp.responseText;
		}
		xmlhttp.open("GET",url,false);
		xmlhttp.send(null);
		this.template[url] = html;
		return html;
	}
};



