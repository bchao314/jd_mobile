/**
 * Created by zc on 2016/9/1.
 */
//框架
;(function (w) {
    var itcast = {
        //子属性法：
        //我们可以定义一个elements属性，来保存获取的元素
        elements: [],
        extend: function (tar, source) {
            //遍历对象
            for (var i in source) {
                tar[i] = source[i];
            }
            return tar;
        },
    }
    w.itcast = w.$$ = itcast;
})(window);


/*封装基础*/
itcast.extend(itcast,{
    //去除左边空格
    ltrim:function(str){
        return str.replace(/(^\s*)/g,'');
    },
    //去除右边空格
    rtrim:function(str){
        return str.replace(/(\s*$)/g,'');
    },
    //去除空格
    trim:function(str){
        return str.replace(/(^\s*)|(\s*$)/g, '');
    },
    //ajax - 前面我们学习的
    myAjax:function(URL,fn){
        var xhr = createXHR();	//返回了一个对象，这个对象IE6兼容。
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4){
                if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304){
                    fn(xhr.responseText);
                }else{
                    alert("错误的文件！");
                }
            }
        };
        xhr.open("get",URL,true);
        xhr.send();

        //闭包形式，因为这个函数只服务于ajax函数，所以放在里面
        function createXHR() {
            //本函数来自于《JavaScript高级程序设计 第3版》第21章
            if (typeof XMLHttpRequest != "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject != "undefined") {
                if (typeof arguments.callee.activeXString != "string") {
                    var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0",
                            "MSXML2.XMLHttp"
                        ],
                        i, len;

                    for (i = 0, len = versions.length; i < len; i++) {
                        try {
                            new ActiveXObject(versions[i]);
                            arguments.callee.activeXString = versions[i];
                            break;
                        } catch (ex) {
                            //skip
                        }
                    }
                }

                return new ActiveXObject(arguments.callee.activeXString);
            } else {
                throw new Error("No XHR object available.");
            }
        }
    },
    //简单的数据绑定formateString
    formateString:function(str, data){
        return str.replace(/@\((\w+)\)/g, function(match, key){
            return typeof data[key] === "undefined" ? '' : data[key]});
    },
    //随机数
    random: function (begin, end) {
        return Math.floor(Math.random() * (end - begin)) + begin;
    },
    //数据类型检测
    isNumber:function (val){
        return typeof val === 'number' && isFinite(val)
    },
    isBoolean:function (val) {
        return typeof val ==="boolean";
    },
    isString:function (val) {
        return typeof val === "string";
    },
    isUndefined:function (val) {
        return typeof val === "undefined";
    },
    isObj:function (str){
        if(str === null || typeof str === 'undefined'){
            return false;
        }
        return typeof str === 'object';
    },
    isNull:function (val){
        return  val === null;
    },
    isArray:function (arr) {
        if(arr === null || typeof arr === 'undefined'){
            return false;
        }
        return arr.constructor === Array;
    }
})

//选择框架
;(function ($$) {

    //私有 只在框架中使用
    //封装重复的代码
    function pushArray(doms, result) {
        for (var j = 0, domlen = doms.length; j < domlen; j++) {
            result.push(doms[j])
        }
    }

    //公有
    //html5实现的选择器
    $$.$all = function (selector, context) {

        context = context || document;
        this.elements = context.querySelectorAll(selector);
        //这里返回this,也就是当前对象，这样就可以访问这个对象的其他属性方法了
        return this;
    }

    //id选择器
    $$.$id = function (id) {
        return document.getElementById(id);
    },

        //tag选择器
        $$.$tag = function (tag, context) {
            if (typeof context == 'string') {
                context = $$.$id(context);
            }

            if (context) {
                return context.getElementsByTagName(tag);
            } else {
                return document.getElementsByTagName(tag);
            }
        },

        //class选择器
        $$.$class = function (className, context) {
            var i = 0, len, dom = [], arr = [];
            //如果传递过来的是字符串 ，则转化成元素对象
            if ($$.isString(context)) {
                context = document.getElementById(context);
            } else {
                context = document;
            }
//        如果兼容getElementsByClassName
            if (context.getElementsByClassName) {
                return context.getElementsByClassName(className);
            } else {
                //如果浏览器不支持
                dom = context.getElementsByTagName('*');

                for (i; len = dom.length, i < len; i++) {
                    if (dom[i].className) {
                        arr.push(dom[i]);
                    }
                }
            }
            return arr;
        },

        //分组选择器
        $$.$group = function (content) {
            var result = [], doms = [];
            var arr = $$.trim(content).split(',');
            //alert(arr.length);
            for (var i = 0, len = arr.length; i < len; i++) {
                var item = $$.trim(arr[i])
                var first = item.charAt(0)
                var index = item.indexOf(first)
                if (first === '.') {
                    doms = $$.$class(item.slice(index + 1))
                    //每次循环将doms保存在reult中
                    //result.push(doms);//错误来源

                    //陷阱1解决 封装重复的代码成函数
                    pushArray(doms, result)

                } else if (first === '#') {
                    doms = [$$.$id(item.slice(index + 1))]//陷阱：之前我们定义的doms是数组，但是$id获取的不是数组，而是单个元素
                    //封装重复的代码成函数
                    pushArray(doms, result)
                } else {
                    doms = $$.$tag(item)
                    pushArray(doms, result)
                }
            }
            return result;


        },

        //层次选择器
        $$.$cengci = function (select) {
            //个个击破法则 -- 寻找击破点
            var sel = $$.trim(select).split(' ');
            var result = [];
            var context = [];
            for (var i = 0, len = sel.length; i < len; i++) {
                result = [];
                var item = $$.trim(sel[i]);
                var first = sel[i].charAt(0)
                var index = item.indexOf(first)
                if (first === '#') {
                    //如果是#，找到该元素，
                    pushArray([$$.$id(item.slice(index + 1))]), result;
                    context = result;
                } else if (first === '.') {
                    //如果是.
                    //如果是.
                    //找到context中所有的class为【s-1】的元素 --context是个集合
                    if (context.length) {
                        for (var j = 0, contextLen = context.length; j < contextLen; j++) {
                            pushArray($$.$class(item.slice(index + 1), context[j]), result);
                        }
                    } else {
                        pushArray($$.$class(item.slice(index + 1)), result);
                    }
                    context = result;
                } else {
                    //如果是标签
                    //遍历父亲，找到父亲中的元素==父亲都存在context中
                    if (context.length) {
                        for (var j = 0, contextLen = context.length; j < contextLen; j++) {
                            pushArray($$.$tag(item, context[j]), result);
                        }
                    } else {
                        pushArray($$.$tag(item), result);
                    }
                    context = result;
                }
            }

            return context;


        },

        //多组+层次
        $$.$select = function (str) {
            var result = [];
            var item = $$.trim(str).split(',');
            for (var i = 0, glen = item.length; i < glen; i++) {
                var select = $$.trim(item[i]);
                var context = [];
                context = $$.$cengci(select);
                pushArray(context, result);

            }
            ;
            return result;
        }
})(itcast);

//事件框架
;(function ($$) {
    $$.on = function (type, fn) {
        //var dom = $$.isString(id)?document.getElementById(id):id;
        var doms = this.elements;
        //如果支持
        //W3C版本 --火狐 谷歌 等大多数浏览器
        //如果你想检测对象是否支持某个属性，方法，可以通过这种方式
        for (var i = 0, len = doms.length; i < len; i++) {
            if (doms[i].addEventListener) {
                doms[i].addEventListener(type, fn, false);
            } else if (doms[i].attachEvent) {
                //如果支持 --IE
                doms[i].attachEvent('on' + type, fn);
            }
        }
        return this;
    }
})(itcast);

//CSS框架
;(function ($$) {
    //样式
    $$.css = function (key, value) {
        var doms = this.elements;
        //如果是数组
        if (doms.length) {
            //先骨架骨架 -- 如果是获取模式 -- 如果是设置模式
            //如果value不为空，则表示设置
            if (value) {
                for (var i = doms.length - 1; i >= 0; i--) {
                    setStyle(doms[i], key, value);
                }
                //            如果value为空，则表示获取
            } else {
                return getStyle(doms[0]);
            }
            //如果不是数组
        } else {
            if (value) {
                setStyle(doms, key, value);
            } else {
                return getStyle(doms);
            }
        }
        function getStyle(dom) {
            if (dom.currentStyle) {
                return dom.currentStyle[key];
            } else {
                return getComputedStyle(dom, null)[key];
            }
        }

        function setStyle(dom, key, value) {
            dom.style[key] = value;
        }

        return this;
    }
    //显示
    $$.show = function () {
//                var doms =  $$.$all(content)
//                var doms = this.elements;
//                for(var i= 0,len=doms.length;i<len;i++){
//                    doms[i].css('display', 'block');
//                }
//                因为css接收的是当前对象，css中会通过this.elements获取元素列表
        this.css('display', 'block')
        return this;
    }
    //隐藏和显示元素
    $$.hide = function () {
//                var doms =  $$.$all(content)
//                var doms = this.elements;
        this.css('display', 'none')
//                for(var i= 0,len=doms.length;i<len;i++){
//                    doms[i].css('display', 'none');
//                }
        return this;
    }

    //元素高度宽度概述
    //计算方式：clientHeight clientWidth innerWidth innerHeight
    //元素的实际高度+border，也不包含滚动条
    $$.Width=function (){
        return this.elements[0].clientWidth
    }
    $$.Height=function (){
        return this.elements[0].clientHeight
    }


    //元素的滚动高度和宽度
    //当元素出现滚动条时候，这里的高度有两种：可视区域的高度 实际高度（可视高度+不可见的高度）
    //计算方式 scrollwidth
    $$.scrollWidth=function (){
        return this.elements[0].scrollWidth
    }
    $$.scrollHeight=function (){
        return this.elements[0].scrollHeight
    }


    //元素滚动的时候 如果出现滚动条 相对于左上角的偏移量
    //计算方式 scrollTop scrollLeft
    $$.scrollTop=function (){
        return this.elements[0].scrollTop
    }
    $$.scrollLeft=function (){
        return this.elements[0].scrollLeft
    }

    //获取屏幕的高度和宽度
    $$.screenHeight=function (){
        return  window.screen.height
    }
    $$.screenWidth=function (){
        return  window.screen.width
    }


    //文档视口的高度和宽度
    $$.wWidth=function (){
        return document.documentElement.clientWidth
    }
    $$.wHeight=function (){
        return document.documentElement.clientHeight
    }
    //文档滚动区域的整体的高和宽
    $$.wScrollHeight=function () {
        return document.body.scrollHeight
    }
    $$.wScrollWidth=function () {
        return document.body.scrollWidth
    }
    //获取滚动条相对于其顶部的偏移
    $$.wScrollTop=function () {
        var scrollTop = window.pageYOffset|| document.documentElement.scrollTop || document.body.scrollTop;
        return scrollTop
    }
    //获取滚动条相对于其左边的偏移
    $$.wScrollLeft=function () {
        var scrollLeft = document.body.scrollLeft || (document.documentElement && document.documentElement.scrollLeft);
        return scrollLeft
    }
})(itcast);

//属性框架
;(function ($$) {
    //私有
    function removeName(dom,name) {
        dom.className = dom.className.replace(name, '');
    }
    function addName(dom,name) {
        dom.className = dom.className + ' ' + name;
    }

    //共有
    //属性操作，获取属性的值，设置属性的值 at tr（'test','target','_blank'）
    $$.attr = function (key, value) {
        //var dom =  $$.$all(content);
        var doms = this.elements
        if (value) {
            for (var i = 0, len = doms.length; i < len; i++) {
                doms[i].setAttribute(key, value);
            }
        } else {
            return doms[0].getAttribute(key);
        }
        return this;
    },
        //动态添加和移除class
        $$.addClass = function (name) {
            var doms = this.elements
            //如果获取的是集合
            for (var i = 0, len = doms.length; i < len; i++) {
                addName(doms[i],name);
            }
            return this;
        },
        $$.removeClass = function (name) {
            var doms = this.elements
            for (var i = 0, len = doms.length; i < len; i++) {
                removeName(doms[i]),name;
            }
            return this;
        }
})(itcast);

//内容框架
;(function ($$) {
    //innerHTML的函数版本
    //innerHTML的函数版本
    $$.html=function ( value){
        //var doms = $$.$all(context);
        //这里，我编程都是针对this。elemennts进行编程
        var doms = this.elements;
        //设置
        if(value){
            for(var i= 0,len= doms.length; i<len; i++){
                doms[i].innerHTML = value;
            }
        }else{
            return doms[0].innerHTML
        }
        return this;
    }
})(itcast);

//动画框架
;(function ($$) {

    /*动画框架*/
    function Animate() {

        //一般再编写框架的时候都会定义一个配置对象保存控制动画的一些值，允许用户自定义
        //我们首先定义好默认值
        this.config={
            interval:16,
            ease:'linear',
        }
        this.timer =0;
        //定义一个index统计每次添加的对象编号 第一个为0
        this.index=-1;
        //动画对象
        //我们定义一个对象来保存运动中我们需要的数据，比如now，pass等
        this._obj={};
        //我们使用数组来保存每个每个物体的运动数据
        this._queen=[]
        //调用初始化函数
        this._init();
    }
    Animate.prototype ={


        /* ------------------------------------------------
         *公共部门
         *放置其他部门都会使用的公共方法属性
         *-------------------------------------------------*/
        eases:{
            //线性匀速
            linear:function (t, b, c, d){
                return (c - b) * (t/ d);
            },
            //弹性运动
            easeOutBounce:function (t, b, c, d) {
                if ((t/=d) < (1/2.75)) {
                    return c*(7.5625*t*t) + b;
                } else if (t < (2/2.75)) {
                    return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
                } else if (t < (2.5/2.75)) {
                    return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
                } else {
                    return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
                }
            },
            //其他
            swing: function (t, b, c, d) {
                return this.easeOutQuad(t, b, c, d);
            },
            easeInQuad: function (t, b, c, d) {
                return c*(t/=d)*t + b;
            },
            easeOutQuad: function (t, b, c, d) {
                return -c *(t/=d)*(t-2) + b;
            },
            easeInOutQuad: function (t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t + b;
                return -c/2 * ((--t)*(t-2) - 1) + b;
            },
            easeInCubic: function (t, b, c, d) {
                return c*(t/=d)*t*t + b;
            },
            easeOutCubic: function (t, b, c, d) {
                return c*((t=t/d-1)*t*t + 1) + b;
            },
            easeInOutCubic: function (t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t*t + b;
                return c/2*((t-=2)*t*t + 2) + b;
            },
            easeInQuart: function (t, b, c, d) {
                return c*(t/=d)*t*t*t + b;
            },
            easeOutQuart: function (t, b, c, d) {
                return -c * ((t=t/d-1)*t*t*t - 1) + b;
            },
            easeInOutQuart: function (t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
                return -c/2 * ((t-=2)*t*t*t - 2) + b;
            },
            easeInQuint: function (t, b, c, d) {
                return c*(t/=d)*t*t*t*t + b;
            },
            easeOutQuint: function (t, b, c, d) {
                return c*((t=t/d-1)*t*t*t*t + 1) + b;
            },
            easeInOutQuint: function (t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
                return c/2*((t-=2)*t*t*t*t + 2) + b;
            },
            easeInSine: function (t, b, c, d) {
                return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
            },
            easeOutSine: function (t, b, c, d) {
                return c * Math.sin(t/d * (Math.PI/2)) + b;
            },
            easeInOutSine: function (t, b, c, d) {
                return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
            },
            easeInExpo: function (t, b, c, d) {
                return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
            },
            easeOutExpo: function (t, b, c, d) {
                return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
            },
            easeInOutExpo: function (t, b, c, d) {
                if (t==0) return b;
                if (t==d) return b+c;
                if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
                return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
            },
            easeInCirc: function (t, b, c, d) {
                return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
            },
            easeOutCirc: function (t, b, c, d) {
                return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
            },
            easeInOutCirc: function (t, b, c, d) {
                if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
                return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
            },
            easeInElastic: function (t, b, c, d) {
                var s=1.70158;var p=0;var a=c;
                if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                if (a < Math.abs(c)) { a=c; var s=p/4; }
                else var s = p/(2*Math.PI) * Math.asin (c/a);
                return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
            },
            easeOutElastic: function (t, b, c, d) {
                var s=1.70158;var p=0;var a=c;
                if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                if (a < Math.abs(c)) { a=c; var s=p/4; }
                else var s = p/(2*Math.PI) * Math.asin (c/a);
                return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
            },
            easeInOutElastic: function (t, b, c, d) {
                var s=1.70158;var p=0;var a=c;
                if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
                if (a < Math.abs(c)) { a=c; var s=p/4; }
                else var s = p/(2*Math.PI) * Math.asin (c/a);
                if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
            },
            easeInBack: function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c*(t/=d)*t*((s+1)*t - s) + b;
            },
            easeOutBack: function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
            },
            easeInOutBack: function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
                return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
            },
            easeInBounce: function (t, b, c, d) {
                return c - this.easeOutBounce (d-t, 0, c, d) + b;
            },
            easeInOutBounce: function (t, b, c, d) {
                if (t < d/2) return this.easeInBounce (t*2, 0, c, d) * .5 + b;
                return this.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
            }
        },
        //获取时间进程
        _getTween:function (now,pass,duration,ease){
            var yongshi = pass -now;
            //复习字面量的两种访问方式
            return this.eases[ease](yongshi,0,1,duration);
        },
        //初始化执行的代码一般放在init里面，一般是构造函数调用
        _init:function(){},

        /*新的技术*/
        getAnimationFrame:function(){
            var lastTime = 0;
            var prefixes = 'webkit moz ms o'.split(' '); //各浏览器前缀

            var requestAnimationFrame = window.requestAnimationFrame;
            var cancelAnimationFrame = window.cancelAnimationFrame;

            var prefix;
            //通过遍历各浏览器前缀，来得到requestAnimationFrame和cancelAnimationFrame在当前浏览器的实现形式
            for( var i = 0; i < prefixes.length; i++ ) {
                if ( requestAnimationFrame && cancelAnimationFrame ) {
                    break;
                }
                prefix = prefixes[i];
                requestAnimationFrame = requestAnimationFrame || window[ prefix + 'RequestAnimationFrame' ];
                cancelAnimationFrame  = cancelAnimationFrame  || window[ prefix + 'CancelAnimationFrame' ] || window[ prefix + 'CancelRequestAnimationFrame' ];
            }

            //如果当前浏览器不支持requestAnimationFrame和cancelAnimationFrame，则会退到setTimeout
            if ( !requestAnimationFrame || !cancelAnimationFrame ) {
                requestAnimationFrame = function( callback, element ) {
                    var currTime = new Date().getTime();
                    //为了使setTimteout的尽可能的接近每秒60帧的效果
                    var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
                    var id = window.setTimeout( function() {
                        callback( currTime + timeToCall );
                    }, timeToCall );
                    lastTime = currTime + timeToCall;
                    return id;
                };

                cancelAnimationFrame = function( id ) {
                    window.clearTimeout( id );
                };
            }

            //得到兼容各浏览器的API
            return {
                requestAnimationFrame : requestAnimationFrame,
                cancelAnimationFrame : cancelAnimationFrame
            }

        },

        /* ------------------------------------------------
         *运行部 老大:run
         *部门职责描述: 根据添加进来的元素属性创建动画,并运行起来
         *-------------------------------------------------*/
        //运行部老大
        _run:function(){
            var that = this;

            //run函数其实就是个循环
            that.timer = setInterval(function(){that._loop();}, that.config.interval);
        },
        //我们新增一个loop以此针对每个物体做运动 --其实就是遍历每个对象，然后依次执行move方法
        _loop:function(){
            for(var i= 0,len=this._queen.length;i<len;i++){
                this._move(this._queen[i])
            }
        },
        //单个物体运动方法
        _move:function (_obj) {
            var pass = +new Date();
            _obj.pass = pass - _obj.now;

            var dom =_obj.dom;
            var styles= _obj.styles;
            var tween = this._getTween(_obj.now,pass,_obj.duration,this.config.ease);
            if(tween>=1) {
                //this.timer.clearInterval();
                //this.timer = 0;
                //_obj.callback()
                tween = 1;
                for(var i= 0,len=styles.length;i<len;i++) {
                    if(styles[i].property=='opacity') {

                        dom.css(styles[i].property, styles[i].start+styles[i].juli*tween);
                    }
                    else {
                        dom.css(styles[i].property, styles[i].start+styles[i].juli*tween+'px');
                    }
                }
            }else {
                for(var i= 0,len=styles.length;i<len;i++) {
                    if(styles[i].property=='opacity') {

                        dom.css(styles[i].property, styles[i].start+styles[i].juli*tween);
                    }
                    else {
                        dom.css(styles[i].property, styles[i].start+styles[i].juli*tween+'px');
                    }
                }
            }
        },
        //动画执行结束后的回调函数
        _callBack:function(){},



        /* ------------------------------------------------
         *添加部  -- add
         *部门职责描述: 添加元素 以及确定我要对哪个属性做动画
         *-------------------------------------------------*/
        //部门老大 - 添加
        addOld:function(id,json,duration,callback) {
            //add方法做两件事情：适配器，运行动画，只要用户调用add方法，整个动画能够运行起来
            //我们先宏观规划add函数的接口 --注释法
            this._apdapter(id,json,duration,callback)
            this._run();
        },
        add:function() {
            try{
                //add方法做两件事情：适配器，运行动画，只要用户调用add方法，整个动画能够运行起来
                //我们先宏观规划add函数的接口 --注释法
                var options = arguments
                var id = options[0]
                var json = options[1]
                var duration = options[2]
                var callback = options[3]

                //添加默认值
                if(!duration) {
                    duration=2000;
                }else {
                    if($$.isString(duration)){
                        switch (duration) {
                            case 'slow' :
                            case '慢' :
                                duration = 8000;
                                break;
                            case 'normal' :
                            case '普通' :
                                duration = 4000;
                                break;
                            case 'fast' :
                            case '快' :
                                duration = 2000;
                                break;
                        }
                    }else{
                    }
                }
                this._apdapter(id,json,duration,callback)
                this._run();
            }catch(e){
                alert('代码出错,系统出错提示：'+'\n'+ e.message+'\n'+ e.name);
            }

        },
        //适配器 --单一职责原则
        //我们继续完善适配器 -- 这样运行部需要的数据基本都保存在_obj中了
        _apdapter:function (id,source,duration,callback){
            var _obj={}
            this.index++;
            _obj.index=this.index;
            /*数据类型判断的重要性*/
            _obj.dom = $$.isString(id)?$$.$id(id):id
            _obj.duration = duration
            _obj.now = +new Date()
            _obj.callback =callback;
            var target=[];
            for(var item in source){
                var json={};
                //元素属性的起始位置 比如目标元素目前left 100px，希望运动到500px，那么100就是起始位置
                json.start = parseFloat(_obj.dom.css(item))
                console.log(json.start)
                json.juli = parseFloat(source[item]) - json.start;
                console.log(json.juli)
                json.property = item
                target.push(json)
            }
            _obj.styles = target;
            this._queen.push(_obj)
        },




        /* ------------------------------------------------
         *公共API -- 学习什么是公共API
         *提供给使用框架的人，使用框架的人一般只需要这样
         *-------------------------------------------------*/
        //开始动画
        begin:function() {},
        //停止动画
        stop:function() {},
        //自定义动画的配置
        setConfig:function(json){
            //如何允许用户控制动画
            var that = this;
            $$.extend(this.config,json)
        },

        /* ------------------------------------------------
         *后勤部
         *部门职责描述: 辅助运行动画  比如清除 比如内存回收
         *-------------------------------------------------*/
        _destroy:function(obj) {
            var that = this;
            //内存优化
            //1 释放队列  -- 数组实现的  -- 就是删除数组
            //哪个物体执行完，我就释放哪个物体所占用的内存
            that._queen.splice(obj.index,1);
            //2 释放对象的属性和方法
            for(var i in obj) {
                delete obj[i];
            }
            //3 释放对象所占用的内存
            obj = null;
        }

    }
    $$.animate =function(json,duration,callback){
        var animate = new Animate()
        animate.add(this,json,duration,callback)
        return this;
    }

})(itcast);



