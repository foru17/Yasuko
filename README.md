# Yasuko

![](https://luoleiorg.b0.upaiyun.com/blog/2015/12/yasuko2.jpg)

为了国内备案，博客停止解析将近半个月，今天[罗磊的独立博客](https://luolei.org)重新上线，迁移到国内阿里云，进行了不少重构和优化，现在进入博客，速度体验上应该可以有一个飞跃性的提升。

新的博客主题名叫「Yasuko 康子]，依旧开源在[Github/Yasuko](https://github.com/foru17/Yasuko)上，只需稍作配置，就能用到你自己的[Ghost](http://ghost.org/)博客上。

##首先讲一个故事

这篇博文开头，我先不讲Ghost这个主题有什么新功能，我要讲一个叫[难波康子（Namba Yasuko)](https://ja.wikipedia.org/wiki/%E9%9B%A3%E6%B3%A2%E5%BA%B7%E5%AD%90)的日本女人的故事。

1949年，战后三年，难波康子出生在日本东京大田区，1967年，十八岁的难波康子高中毕业，进入早稻田大学，并且加入了学校的登山俱乐部，随后开始了自己的登山生涯。毕业之后，难波康子进入了物流巨鳄UPS，收入颇丰，但是她坚持登山的爱好并且持续付诸行动。

1982年，她攀登上了非洲最高峰乞力马扎罗，两年之后，成功登顶南美最高峰阿空加瓜山，1985年六月，登顶北美最高峰麦金利峰，七年之后92年八月登顶欧洲最高峰厄尔布鲁士峰，接下来的93和94两年，先后登顶南极洲最高峰文森山和大洋洲最高峰查亚峰。也是在登山俱乐部，结实了自己的爱人健一难波。

难波康子先后攀登上上世界七大洲的六座顶峰。1996年，两只商业登山队向珠峰发起冲刺，难波康子也在其中，5月10日冲顶，由于种种因缘，商业行为在高原缺氧地带的不理性选择，多个队伍同时登顶导致的登山通道拥挤，两队的大部分队员不幸遭遇暴风雪，被困在距离4号营地300多米的南坳，下午六点钟暴风雪最大的时候，难波康子氧气耗尽，经过最后的挣扎，依旧不幸遇难，在四号营地外，失温而亡。

难波康子是第二位登上世界七大高峰的日本女性，出身名门，企业高层，算得上是日本男权社会中的一个标杆性人物，她的死，在日本社会造成了很大的影响。

![](https://luoleiorg.b0.upaiyun.com/blog/2015/12/everest96.jpg)

今年上映的电影[《绝命海拔》](http://movie.douban.com/subject/22265299/)之中，讲述的就是96年这次珠峰事故的故事，推荐大家有机会可以去看看。上图的前排右一就是难波康子。

##关于为什么要叫这个名字

其实我并没有看过《绝命海拔》这部电影，之所以取这个名字，就跟我的上一个Ghost主题[Nevecoo](https://luolei.org/theme-nevecoo/)一样，取名的时候并没有想什么特殊的含义，就是随意而为。
在谷歌中随意输入几个字符，点击搜索，就这么看到了Yasuko的故事。

看着她的照片，看着照片中的雪山，想起自己几年之前一直想去登山的梦想，那就叫Yasuko这个名字吧，缅怀先烈之余，也算是勿忘初心。

##Theme Yasuko

回到这次的改版，说先说一下这次改版的几个变化，对于其中涉及的几个技术和优化点，也稍作说明。

####1.备案&&迁移到国内阿里云

过去我的博客一直托管在[Linode](https://www.linode.com/?r=bc281a496205a4bb946c7e7d0a9a44116bebdf32)的日本东京机房，本来速度和稳定性都不错，Ping值好的时候可以到50-70ms，可是随着这两年某W的升级和国际线路的日益糟糕，大陆到日本的国际线路稳定性越来越不可靠，时常会遇到DNS无法解析，SSH无法连接的情况，虽说我的大部分静态资源都是托管在国内CDN，可是主站速度尤其是初次访问速度还是无法保证。

这次依旧是通过阿里云的备案流程，增加了一个备案主体，将luolei.org这个域名在国内备案，12月10日阿里云提交备案申请，28日批准备案，流程还是比较顺利的，详细的过程可以看下图。

![](https://luoleiorg.b0.upaiyun.com/blog/2015/12/aliyun2.jpg)

####1.1 海外访客进行反向代理加速

由于无法保证阿里云在海外的访问速度，我让DNSpod对大陆用户和海外用户分别解析到阿里云和美国DO的机房IP，利用美国DigitalOcean旧金山机房的服务器进行了一次反向代理。

由于我的博客进行了https加密，反向代理同样需要`ssl`证书。

```language-nginx
#https相关配置
server {
        listen       443;
        server_name  luolei.org;
        ssl                  on;
        ssl_certificate      /somepath/ssl/ssl.crt;
        ssl_certificate_key  /somepath/ssl/server.key;
        proxy_pass http://115.28.56.68:xxxx;  #这里是关键，需要填写国内的IP地址
        proxy_set_header        Host            $host;
        proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header        X-Forwarded-Proto $scheme;
        proxy_redirect     off;
    }
```

![](https://luoleiorg.b0.upaiyun.com/blog/2015/12/ping.png)

测速下，国内外的延迟优化还是很明显的，当然，实际上到网站还需要加上DO机房到阿里云的延迟，只需要两个机房的线路能保持稳定，也是可以接受的。

####2.图片全面优化

我的大部分图片都是放在又拍云的CDN上，又拍云已经赞助我的博客几年了，在这里再说一下感谢。图片向来是网络请求的大头，这一次，在图片加载上面做了几个处理。

A.主要图片均lazyload:g

延迟加载，只有滑动到可视区域才加载，Ghost改动Markdown渲染引擎不够方便，但是编辑的时候可以直接写html，需要直接把的代码写在编辑器里。

```language-html
<!-- 通过设置alt值为cover或者full-img来控制文章起始缩略图和是否撑满屏幕 -->
<img data-url="https://luoleiorg.b0.upaiyun.com/blog/2015/12/book.jpg" class="lazy cover" alt="cover">
```

B.WebP图片和分辨率适配

根据设备浏览器是否支持WebP，是否是手机，利用又拍云的图形处理接口，分别加载不同格式，不同分辨率的图片，大大优化了图片的大小。

``` language-javascript
/*通过js判断浏览器是否支持webP格式的图片*/
webPCheck: function(feature, callback) {
        var TestImages = {
            demo: "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAsAAAABBxAREYiI/gcAAABWUDggGAAAADABAJ0BKgEAAQABABwlpAADcAD+/gbQAA=="
        };
        var img = new Image();
        img.onload = function() {
            var result = (img.width > 0) && (img.height > 0);
            console.log('支持Webp');
            ImageSmartLoader.isWebPSupported = true;
            ImageSmartLoader.webPLoader();
        };
        img.onerror = function() {
            ImageSmartLoader.isWebPSupported = false;
            ImageSmartLoader.webPLoader();
        };
        img.src = "data:image/webp;base64," + TestImages['demo'];
},


/*通过传参调用不同的lazyload*/
$(".lazy").lazyload({
    advanced_load: true,
    data_attribute: 'url',
    webP_load: true,
    is_scale: true,
    scale_width: 750
});

/*重新拼装lazyload的url，配合又拍云接口调用不同图片*/
if (settings.advanced_load == true) {
    updatedUrl += '!';
}
if (settings.is_scale == true) {
    updatedUrl += '/fw/' + settings.scale_width;
}
if (settings.webP_load == true) {
    updatedUrl += '/format/webp';
}

```

C.进一步优化Iconfont

![](https://luoleiorg.b0.upaiyun.com/blog/2015/12/iconfont.png)

这一次重新用[Sketch](https://www.sketchapp.com)整理了常见的社交网站icon，加入了国内常见的V2EX、知乎、简书等网站的icon，调用起来更加方便。通过阿里云[iconfont.cn](http://iconfont.cn)生成，字体font部署在阿里云CDN上。文章中也依旧增加了自动给引用的URL标识logo的功能。

![](https://luoleiorg.b0.upaiyun.com/blog/2015/12/icon1.jpg)

豆瓣，维基百科在iPhone上的显示效果，十分清晰。

![](https://luoleiorg.b0.upaiyun.com/blog/2015/12/icon2.jpg)

Github、知乎在iPhone上的效果。

``` language-javascript
    /*给文章中的url添加iconfont方便识别*/
    urlIconlize: function(url) {
        var domain,
            _output;
        var iconFontTag = 'iconfont';
        var iconMap = { /*索引 可在这里添加匹配规则*/
            'twitter': iconFontTag + '-twitter',
            'qzone': iconFontTag + '-qzone',
            'weibo': iconFontTag + '-weibo',
            'facebook': iconFontTag + '-facebook',
            'github': iconFontTag + '-github',
            'douban': iconFontTag + '-douban',
            'google': iconFontTag + '-google',
            'luolei': iconFontTag + '-luolei',
            'dribble': iconFontTag + '-dribble',
            'v2ex': iconFontTag + '-v2ex',
            'zhihu': iconFontTag + '-zhihu',
            'wikipedia': iconFontTag + '-wikipedia',
            'jianshu': iconFontTag + '-jianshu',
            'youku': iconFontTag + '-youku',
            'youtube': iconFontTag + '-youtube'

        }

        for (var name in iconMap) {
            if (typeof iconMap[name] !== 'function') {
                var MapKey = name;
                if (url.indexOf(MapKey) >= 0) {
                    domain = MapKey;
                    _output = iconMap[MapKey];
                }
            }
        }

        return _output;
    },
    addIcons: function() {
        /*给博客文章地址url添加ico识别*/
        $('.single-post-inner  a:not(:has(img))').each(function(i) {
            var _src = $(this).attr('href');
            var tmp = document.createElement('a');
            tmp.href = _src;
            _selfDomain = tmp.hostname;
            General.urlIconlize(_selfDomain);
            console.log(_selfDomain);
            $(this).prepend('<i class="iconfont ' + General.urlIconlize(_selfDomain) + '"></i>');
        });
    },
```
考虑元旦的时候把这个功能抽出来做一个组件，方便任意网站调用。需要维护对应的域名表。


D.多说评论、webfont懒加载

``` language-javascript
/*异步加载js*/
function loadJS(url, callback, el) {
    var isIE = !!window.ActiveXObject,
        isIE6 = isIE && !window.XMLHttpRequest,
        script = document.createElement("script"),
        head = isIE6 ? document.documentElement : document.getElementsByTagName("head")[0];
    script.type = "text/javascript";
    script.async = true;
    if (script.readyState) {
        script.onreadystatechange = function() {
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                if (callback) {
                    callback();
                }
            }
        }
    } else {
        script.onload = function() {
            if (callback) {
                callback();
            }
        }
    }
    script.src = url;
    if (el) {
        document.getElementById(el).appendChild(script);
    } else {
        head.insertBefore(script, head.firstChild);
    }
};
```

过去webfont、多说等`.js`和`.css`资源都是页面加载的时候就直接加载，占用了一定的带宽和连接，考虑到实际情况，对于评论的`.js`均采用异步加载的方式，webfont加载使用的是[webfontloader](https://github.com/typekit/webfontloader)的异步方案，一定程度下优化。

E.其他优化

除了性能上的优化，这次[Yasuko](https://github.com/foru17/Yasuko)主题在UI、体验上均做了较大的改善，着重优化了移动端上的阅读体验和细节，围绕内容而设计。

![](https://luoleiorg.b0.upaiyun.com/blog/2015/12/show1.jpg)

首页和文章列表页面更加紧凑，关键字和入口更加清晰，采取镜像显示模式，显示缩略图和文章摘要。

![](https://luoleiorg.b0.upaiyun.com/blog/2015/12/show2.jpg)

文章页增强阅读体验，对于字体、行高、间距等均做过调试，让不同系统、不同分辨率和不同浏览器下均能获得良好的感受。

通过Ghost自己的接口，增加前后文导航。另外自己写了一个QR二维码的接口，自动生成当前文章的二维码，方便读者能够快速扫码在手机上打开。

当然，最重要的是，增加了「打赏」功能。

点击打赏按钮，会自动弹出支付宝打赏或者微信打赏（需要自定义图片）。

> 在这里我也想做一个实验，如果你觉得我过去的文章和作品对你有一定帮助，就随意打赏我点钱，也让我看看我的这篇文章都在什么时候被大家看到，几毛几块都可以。

点下面的「赏」，根据自己的情况扫描二维码，支付宝或者微信打赏均可。

后续[Yasuko](https://github.com/foru17/yasuko)主题会持续更新和优化，也欢迎各位的Star。


## Copyright & License

Copyright (c) 2013-2015 Ghost Foundation - Released under the MIT License.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
