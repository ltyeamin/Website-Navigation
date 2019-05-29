var city;
$(function() {
    //搜索框交互
    var 
        placeholder = window.INPUT_PLACEHOLDER || '请输入要搜索的关键词',
        baiduUrl = 'https://www.baidu.com/s?wd=',
        googleUrl = 'https://www.google.com.hk/search?q=',
        bingUrl = 'https://cn.bing.com/search?q=',
        searchEl = $('#search');

    // 页面加载时，自动加载头条数据
    toutiao_load();

       //获取当前地区，为后续的功能做准备
        $.ajax({
            url: 'http://api.map.baidu.com/location/ip?ak=ia6HfFL660Bvh43exmH9LrI6',
            type: 'POST',
            async: false,
            dataType: 'jsonp',
            success:function(data) {
                city = data.content.address_detail.city;
                if (city != null) {
                    var fullName = pinyin.getFullChars(city.substring(0,city.length-1)).toLocaleLowerCase();
                    //加载天气模块
                       //显示天气
                    let weatherUrl = "<iframe width='450' scrolling='no' height='25' frameborder='0' allowtransparency='true' src='//i.tianqi.com/index.php?c=code&id=1&icon=5&py="+fullName+"&wind=1&num=1&site=12'></iframe>";
                    $("#weather").html(weatherUrl);
                }
            }
        });
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
            title = document.title || '彤哥哥个人网址导航',
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
        delay : 5 , //滚动延迟时间，单位：秒
        hideBottomBar : true    
    });    
    
    //滑动门
     $(".news_titleContain ul li").each(function(i){
        $(this).hover(function(){
            $(this).addClass("cli").siblings().removeClass("cli");
            $(".now:eq("+i+")").show().siblings(".now").hide();
            i++
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

//加载头条推荐
function toutiao_load() {
    $.ajax({
        url : "https://www.toutiao.com/api/pc/feed/?category=__all__",
        type : "GET",
        type:"GET",
        dataType:"jsonp",
        async : true,
        success: function(response){
            //加载头条推荐
            let posts=response.data;
            if (posts != null) {
                let text = "";
                for (let i = 2; i < 8; i++) {
                    post = posts[i];
                    let value = "<tr class='darkbg'><td class='underline' height='28' valign='middle' width='20' align='center'><img src='images/arrow1.png' width='4' height='7'></td><td class='underline' height='28'><span class='bmdt2'><a href='"+
                     "https://www.toutiao.com/a"+ post.item_id +"/' target='_blank'>"+
                    post.title+"</a></span><span class='bmdt3'>"+(typeof(post.chinese_tag)=='string'?post.chinese_tag:'其他')+"</span></td></tr>";
                    text += value;
                }
                $("#news_tbody").html("");
                $("#news_tbody").html(text);

            }

        }
    });
}



//加载最新博文
function blog_news_load() {
    //默认远程服务端允许跨域请求，不需要JSONP请求
    $.ajax({
        async : true,
        url : "http://blog.yeamin.top/content.json",
        type : "GET",
        success: function(response){
            //获取最新的博文数据
            let posts=response.posts;
            if (posts == null) {
                return;
            }
            let text = "";
            for (let i = 0; i < 5; i++) {
                post = posts[i];
                let value = "<tr class='darkbg'><td class='underline' height='28' valign='middle' width='20' align='center'><img src='images/arrow1.png' width='4' height='7'></td><td class='underline' height='28'><span class='bmdt2'><a href='"+
                post.permalink+"' target='_blank' title='11'>"+
                post.title+"</a></span><span class='bmdt3'>"+getUTCDate(post.date)+"</span></td></tr>";
                text += value;
            
            }
            $("#news_tbody").html("");
            $("#news_tbody").html(text);


        }
    });
}

//将数据填到数组里
function randomArr(maxcount){
        var arr = [];
        for(var i=0;i<maxcount;i++){
            arr.push(i)
        }
        return arr;
}
//取出随机数, maxNum为 取出随机数的个数
function randomNumBoth(arr,maxNum){
    var numArr = [];
    //最大的循环次数
    var arrLength = arr.length;
    for(var i = 0;i<arrLength;i++){
        //获取arr的长度
        var Rand = arr.length
        //取出随机数,生成随机数num
        var number = Math.floor(Math.random()*arr.length);
        //往新建的数组里面传入数值
        numArr.push(arr[number]);
        //传入一个删除一个，避免重复
        arr.splice(number,1);
        if(arr.length <= arrLength-maxNum){
            return numArr;
        }
    }
}




//豆瓣api：https://api.douban.com/v2/movie/coming_soon
//豆瓣正在热映api:https://api.douban.com/v2/movie/in_theaters?start=0&count=10
function movie() {

    //采用JSONP跨域请求获取远程数据
    $.ajax({
        url:"https://api.douban.com/v2/movie/in_theaters?start=0&count=20&timestamp="+new Date().getTime(),
        type:"GET",
        dataType:"jsonp",
        async : true,
        success:function(data){
            let moviesList=data.subjects;
            if (moviesList == null) {
                return null;
            }
            let text = "<tr align='center'>";
            var arr = randomArr(moviesList.length-1);
            //取出5个不重复的随机数
            let randonNum = randomNumBoth(arr,5);
            for (let i = 0; i < randonNum.length; i++) {
                film = moviesList[randonNum[i]];
                let value = "<td align='center'><a href='"+film.alt+"' target='_blank'><img  width='95%' height='42%' src='"+film.images.small+"'></a></td>";
                text += value;
            }
            text += "</tr>";
            $("#news_tbody").html("");
            $("#news_tbody").html(text);
          
        }
    });
}

$("#news").mouseover(function (e) {
    blog_news_load();
});

$("#movies").mouseover(function (e) {
    movie();
});


$("#toutiao").mouseover(function (e) {
    toutiao_load();
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





/*
  UTC时间转换为北京时间
*/
function getUTCDate(utc_datetime) {
    if (utc_datetime != null) {
         return utc_datetime.split("T")[0];
    }
    
} 
