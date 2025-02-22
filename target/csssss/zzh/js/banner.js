/*用于轮播图文件夹*/
(function () {
    var banner=document.getElementById("banner"),bannerInner=utils.firstChild(banner),
        bannerTip=utils.children(banner,"ul")[0];
    var imgList=bannerInner.getElementsByTagName("img"),oLis=bannerTip.getElementsByTagName("li");
    var bannerLeft=utils.children(banner,"a")[0];
    var bannerRight=utils.children(banner,"a")[1];
    //1、实现数据绑定:Ajax请求数据
    var jsonData = null,count=null;//count存储当前页面中有几张图片
    ~function () {
        var xhr = new XMLHttpRequest;
        xhr.open("get", "../json/banner.txt?_="+Math.random(), false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
                jsonData = utils.formatJSON(xhr.responseText);
            }
        };
        xhr.send(null);
    }();
    //2、按照字符串拼接的方式绑定数据
    ~ function () {
        /*(1)绑定的是轮播图区域的数据*/
        var str = '';
        if (jsonData) {
            for (var i = 0, len = jsonData.length; i < len; i++) {
                var curData = jsonData[i];
                str += '<div><img src="" trueImg="' + curData["img"] + '"/></div>';
            }
            //为了实现无缝滚动，我们需要把第一张图片克隆一份一模一样的放在末尾
            str += '<div><img src="" trueImg="' + jsonData[0]["img"] + '"/></div>';
        }
        bannerInner.innerHTML=str;
        count=jsonData.length+1;
        utils.css(bannerInner,"width",count*800);
        /*（2）绑定的是焦点区域的数据*/
        str='';
        if (jsonData) {
            for (i = 0, len = jsonData.length; i < len; i++) {
                i===0?str+='<li class="bg"></li>':str+='<li></li>';
            }
        }
        bannerTip.innerHTML=str;
    } ();
    //3、实现图片的延迟加载
    function lazyImg() {
        for (var i = 0,len=imgList.length; i < len; i++) {
            //放在闭包里，因为加载是异步编程，每回不执行，知道循环到最后一个元素才执行，此时只有最后一个元素加载出来了，所以放在闭包里保护起来
            ~function (i) {
                var curImg=imgList[i];
                var oImg=new Image;
                oImg.src=curImg.getAttribute("trueImg");
                oImg.onload=function () {
                    curImg.src=this.src;
                    curImg.style.display="block";
                    oImg=null;
                    zzhAnimate(curImg,{opacity:1},300);
                }
            } (i);
        }
    }
    window.setTimeout(lazyImg,500);
    //4、实现自动轮播
    var step=0; //记录的是步长，当前是哪一张图片，当前是零
    var interval=1000;
    var autoTimer=window.setInterval(autoMove,interval);
    function autoMove() {
        //第一次：-520 第二次：-1040 第三次：-1560 第四次：0
        if (step>=count-1) {
            step=0;
            /*bannerInner.style.left=0;*/
            utils.css(bannerInner,"left",0);
            /*return;*/
        }
        step++;
        zzhAnimate(bannerInner,{left:-step*800},500);
        changeTip();
    }
    //5、实现焦点对齐
    function changeTip() {
        var tempStep=step>=oLis.length?0:step;
        for (var i = 0,len=oLis.length;i < len; i++) {
            var curLi=oLis[i];
            i===tempStep?utils.addClass(curLi,"bg"):utils.removeClass(curLi,"bg");
        }
    }
    //6、停止和开启自动轮播
    banner.onmouseover=function () {
        window.clearInterval(autoTimer);
        bannerLeft.style.display=bannerRight.style.display="block";
    };
    banner.onmouseout=function () {
        autoTimer=window.setInterval(autoMove,interval);
        bannerLeft.style.display=bannerRight.style.display="none";
    };
    //7、点击焦点实现轮播图的切换
    ~function () {
        for (var i = 0,len=oLis.length;i<len; i++) {
            var curLi=oLis[i];
            curLi.index=i;
            curLi.onclick=function () {
                step=this.index;
                changeTip();
                zzhAnimate(bannerInner,{left:-step*800},500);
            };
        }
    } ();
    //8、实现左右切换
    bannerRight.onclick=autoMove;
    bannerLeft.onclick=function () {
        if (step<=0) {
            step=count-1;
            utils.css(bannerInner,"left",-step*800);
        }
        step--;
        zzhAnimate(bannerInner,{left:-step*800},500);
        changeTip();
    }

})();