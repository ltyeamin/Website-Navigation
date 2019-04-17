$(function() {
    //搜索框交互
    var 
        placeholder = window.INPUT_PLACEHOLDER || '请输入要搜索的关键词',
        baiduUrl = 'https://www.baidu.com/s?wd=',
        googleUrl = 'https://www.google.com.hk/search?q=',
		bingUrl = 'https://cn.bing.com/search?q=',
        searchEl = $('#search');
        
    $('.button', searchEl).on('click', function(e) {
        var keyword = $('.keyword', searchEl).val();
		//url = e.target.name == 'baidu' ? baiduUrl : googleUrl;
		if(e.target.name == 'baidu') {url =baiduUrl;}
		else if(e.target.name == 'google') {url =googleUrl;}
		else {url =bingUrl;}
		
        keyword = keyword == placeholder ? '' : keyword;
        
        window.open(url + encodeURIComponent(keyword));
        e.preventDefault();
    });
    
    $('.keyword', searchEl)
    .val(placeholder)
    .on('focus', function(e) {
        var keyword = $(e.target);
        if(keyword.val() == placeholder) {
            keyword.removeClass('default-word').val('');
        }
    })
    .on('blur', function(e) {
        var keyword = $(e.target);
        if(keyword.val() == '') {
            keyword.addClass('default-word').val(placeholder);
        }
    });
    
    //收藏
    $('#header .icon-favor').on('click', function(e) {
        var 
            title = document.title || '福建工程学院校内网址导航',
            url = window.location.href;
        
        try {
            if(window.sidebar && window.sidebar.addPanel) {
                window.sidebar.addPanel(title, url, '');
            }else if(window.external) {
                window.external.AddFavorite(url, title);
            }else {
                throw 'NOT_SUPPORTED';
            }
        }catch(err) {
            alert('您的浏览器不支持自动收藏，请使用Ctrl+D进行收藏');
        }
    
        e.preventDefault();
    });
    
    //加入首页
    $('#header .icon-homepage').on('click', function(e) {
        try {
            if(window.netscape) {
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                
                Components.classes['@mozilla.org/preferences-service;1']
                .getService(Components. interfaces.nsIPrefBranch)
                .setCharPref('browser.startup.homepage',window.location.href); 
                
                alert('成功设为首页');
                
            }else if(window.external) {
                document.body.style.behavior='url(#default#homepage)';   
                document.body.setHomePage(location.href);
            }else {
                throw 'NOT_SUPPORTED';
            }
        }catch(err) {
            alert('您的浏览器不支持或不允许自动设置首页, 请通过浏览器菜单设置');
        }
    
        e.preventDefault();
    });
    
	//显示时间
	document.getElementById('time').innerHTML=new Date().toLocaleString()+' 星期'+'日一二三四五六'.charAt(new Date().getDay());
	setInterval("document.getElementById('time').innerHTML=new Date().toLocaleString()+' 星期'+'日一二三四五六'.charAt(new Date().getDay());",1000);
	
	//slideBox焦点图
	$('#scollImg').slideBox({		
		delay : 8 , //滚动延迟时间，单位：秒
		hideBottomBar : true	
	});    
	
	//滑动门
	 $(".news_titleContain ul li").each(function(i){
		$(this).hover(function(){
			$(this).addClass("cli").siblings().removeClass("cli");
			$(".now:eq("+i+")").show().siblings(".now").hide();
		})
	 });	 

	 
	 //点击闪动
	 $("#floatNav li a").bind({
		click:function(){	
		shake($($(this).attr("href")),"red",3);
		//return false;
		}
	});
	
});

/*
	点击闪动
 	shake(ele,cls,times)<br>
    ele : jQuery Object [object]  要闪动的元素
    cls : Class Name [string] 闪动的类
    times : Number [Number] 闪动几次
*/
function shake(ele,cls,times){
	var i = 0,t= false ,o =ele.attr("class")+" ",c ="",times=times||2;
	if(t) return;
	t= setInterval(function(){
	i++;
	c = i%2 ? o+cls : o;
	ele.attr("class",c);
	if(i==2*times){
		clearInterval(t);
		ele.removeClass(cls);
	}
	},200);
};
