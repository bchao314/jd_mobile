/**
 * Created by zc on 2016/9/3.
 */
window.onload = function () {
    search();
    secondKill();
    //slider()
    mySwiper0()
    mySwiper1()
    mySwiper2()
    mySwiper3()
};

/*头部搜索*/
var search = function () {
    /*搜索框对象*/
    var search = document.getElementsByClassName('jd-header-box')[0];
    /*banner对象*/
    var banner = document.getElementsByClassName('swiper-container')[0];
    /*高度*/
    var height = banner.offsetHeight;

    window.onscroll = function () {
        var top = document.body.scrollTop;
        /*当滚动高度大于banner的高度时候颜色不变*/
        if (top > height) {
            search.style.background = "rgba(201,21,35,0.85)";
        } else {
            var op = top / height * 0.85;
            search.style.background = "rgba(201,21,35," + op + ")";
        }
    };
};
/*秒杀倒计时*/
var secondKill = function () {
    /*复盒子*/
    var parentTime = document.getElementsByClassName('sk-time')[0];
    /*span时间*/
    var timeList = parentTime.getElementsByClassName('num');


    var times = 7 * 60 * 60;
    var timer;
    timer = setInterval(function () {
        times--;

        var h = Math.floor(times / (60 * 60));
        var m = Math.floor(times / 60 % 60);
        var s = times % 60;

        console.log(h + '-' + m + "-" + s);

        timeList[0].innerHTML = h > 10 ? Math.floor(h / 10) : 0;
        timeList[1].innerHTML = h % 10;

        timeList[2].innerHTML = m > 10 ? Math.floor(m / 10) : 0;
        timeList[3].innerHTML = m % 10;

        timeList[4].innerHTML = s > 10 ? Math.floor(s / 10) : 0;
        timeList[5].innerHTML = s % 10;
        if (times <= 0) {
            clearInterval(timer);
        }
    }, 1000);
};

/*mainbanner*/
/*var slider = function () {
 var jdBanner = document.getElementById("jdBanner");
 var sliderPic = document.getElementById("sliderPic");
 var lis = sliderPic.children;
 var liWidth = lis[0].offsetWidth
 var timer = null;
 var key = 1;
 /!*小圆点*!/
 var bannerPos = document.getElementById("bannerPos");
 var liPos = bannerPos.children;

 /!* /!*加过度*!/
 var addTransition = function () {
 sliderPic.style.transition = "all .5s ease 0s";
 sliderPic.style.webkitTransition = "all .5s ease 0s";
 };
 /!*减过度*!/
 var removeTransition = function () {
 sliderPic.style.transition = "none";
 sliderPic.style.webkitTransition = "none";
 };
 /!*转换*!/
 var setTransform = function (t) {
 sliderPic.style.transform = "translateX(" + t + "px)";
 sliderPic.style.webkitTransform = "translateX(" + t + "px)";
 };

 timer = setInterval(function () {
 key++;
 addTransition();
 setTransform(-key * liWidth);

 /!*小圆点滚动*!/
 for (var i = 0; i < liPos.length; i++) {
 liPos[i].className = ""
 }
 liPos[key - 1].className = "current"
 }, 2000)

 sliderPic.addEventListener("transitionend", function () {
 if (key >= 9) {
 key = 1;
 removeTransition()
 setTransform(-key * liWidth)
 }
 },false)*!/

 /!*滚动动画*!/
 timer = setInterval(function () {
 key++;
 if (key >= 9) {
 key = 1;
 sliderPic.style.left = 0;
 sliderPic.style.left = animate(sliderPic, {"left": -key * liWidth});
 }
 sliderPic.style.left = animate(sliderPic, {"left": -key * liWidth});
 /!*跟随小圆点*!/
 for (var i = 0; i < liPos.length; i++) {
 liPos[i].className = ""
 }
 liPos[key - 1].className = "current"
 }, 1000)
 };*/


/*swiper*/
var mySwiper0 = function () {
    new Swiper('.mianBanner .swiper-container', {
        direction: 'horizontal',
        loop: true,
        autoplay: 3000,
        autoplayDisableOnInteraction: false,

        // 如果需要分页器
        pagination: '.mianBanner .swiper-pagination',
    })
};
/*banner1*/
var mySwiper1 = function () {
    new Swiper('.jd-banner1 .swiper-container', {
        direction: 'horizontal',
        loop: true,
        autoplay: 3000,
        autoplayDisableOnInteraction: false,

        // 如果需要分页器
        pagination: '.jd-banner1 .swiper-pagination',
    })
};
/*banner2*/
var mySwiper2 = function () {
    new Swiper('.jd-banner2 .swiper-container', {
        direction: 'horizontal',
        loop: true,
        autoplay: 3000,
        autoplayDisableOnInteraction: false,

        // 如果需要分页器
        pagination: '.jd-banner2 .swiper-pagination',
    })
};
/*banner3*/
var mySwiper3 = function () {
    new Swiper('.jd-banner3 .swiper-container', {
        direction: 'horizontal',
        loop: true,
        autoplay: 3000,
        autoplayDisableOnInteraction: false,

        // 如果需要分页器
        pagination: '.jd-banner3 .swiper-pagination',
    })
};



