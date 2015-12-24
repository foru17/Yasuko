$.fn.extend({
    isOnScreenVisible: function() {
        if (!$('body').hasClass('post-template')) {
            return false;
        }
        var win = $(window);
        var viewport = {
            top: win.scrollTop(),
            left: win.scrollLeft()
        };
        viewport.right = viewport.left + win.width();
        viewport.bottom = viewport.top + win.height();

        var bounds = this.offset();
        bounds.right = bounds.left + this.outerWidth();
        bounds.bottom = bounds.top + this.outerHeight();

        return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
    },

});

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


var General = {
    isMobile: false,
    isWechat: false,
    viewWidth: $(window).width(),
    init: function() {
        var win = window;
        var doc = win.document;
        var UA = navigator.userAgent.toLowerCase()
        var isAndroid = win.navigator.appVersion.match(/android/gi);
        var isIPhone = win.navigator.appVersion.match(/iphone/gi);
        if ($('body').hasClass('post-template')) {
            General.updateImageWidth();
        }

        General.webFontLoader();
        General.scrollToPos();
        General.arrowEvent();
        General.commentLoader();
    },
    updateImageWidth: function() {
        var $postContent = $(".post-content");
        // $postContent.fitVids();

        function updateImageWidth() {
            var $this = $(this),
                contentWidth = $postContent.outerWidth(), // Width of the content
                imageWidth = this.naturalWidth; // Original image resolution

            if (imageWidth >= contentWidth) {
                $this.addClass('full-img');
            } else {
                $this.removeClass('full-img');
            }
        }

        var $img = $(".single-post-inner img").on('load', updateImageWidth);

        function casperFullImg() {
            $img.each(updateImageWidth);
        }

        casperFullImg();
    },
    webFontLoader: function() {
        console.log('加载字体');
        WebFontConfig = {
            custom: {
                families: ['Exo'],
                urls: ['../css/font.min.css']
            }
        };
        WebFont.load({
            custom: {
                families: ['Exo']
            }
        });

    },
    arrowEvent: function() {
        $('.arrow_down').click(function() {
            $('html,body').animate({
                scrollTop: $(window).height() - 20
            }, 600, function() {
                window.location.hash = '#';
            });
            return false;
        })
    },
    //平滑滚动到顶部
    scrollToPos: function(position) {
        var STR_TO_TOP = '我要飞到最高',
            coverHeight = position || $(window).height(); //获得图片高度
        var button = $('<a href="#" id="to-top" title="' + STR_TO_TOP + '"> <div class="to-top-wrap"></div></a>').appendTo('body');
        $(window).scroll(function() {
            console.log('滚动2');
            if ($(window).scrollTop() > $(window).height()) {
                button.fadeIn(500);
            } else {
                button.fadeOut(500);
            }
        });

        button.click(function(e) {
            e.preventDefault();
            $('html,body').animate({
                scrollTop: 0
            }, 666, function() {
                window.location.hash = '#';
            });
            console.log('我跳');
        })
    },
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
            'dribble': iconFontTag + '-dribble'

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
            //$(this).append(urlIconlize(_selfDomain));
            $(this).prepend('<i class="iconfont ' + General.urlIconlize(_selfDomain) + '"></i>');
            var _selfColor = $(this).find('i').css('color'),
                _originalColor = $(this).css('color');

            /*鼠标悬浮时*/
            $(this).hover(function() {
                $(this).css('color', _selfColor);
                $(this).addClass('animated pulse');
            }, function() {
                $(this).css('color', _originalColor);
                $(this).removeClass('animated pulse');
            });

        });
    },
    commentLoader: function() {
        var dataThreadKey = location.protocol + '//' + location.host + location.pathname;
        $(window).scroll(function() {
            if ($('.comment-area').has('div').length > 0) {
                console.log('已经有了');
                return false
            } else {
                console.log('增加评论');
                if ($('.author-image').isOnScreenVisible() && $('.author-image').hasClass('duoshuo-loaded') ==false) {
                    $('.author-image').addClass('duoshuo-loaded');
                    loadJS('https://static.duoshuo.com/embed.js', function() {
                        var el = document.createElement('div');
                        el.setAttribute('data-thread-key', dataThreadKey);
                        el.setAttribute('data-url', location.href);
                        el.setAttribute('data-title', $('title').html());
                        DUOSHUO.EmbedThread(el);
                        scrollStop = true;
                        console.log('停止标记');
                        setTimeout(function() {
                            $('.comment-area').append(el);
                        }, 250)

                    })
                }
            }

        });
    }
}



var ImageSmartLoader = {
    isWebPSupported: false,
    isImageCompressed: false,
    init: function() {
        ImageSmartLoader.webPCheck();
    },
    isCompressedCheck: function() {

    },
    webPCheck: function(feature, callback) {
        var TestImages = {
            lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
            lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
            alpha: "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
            animation: "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"
        };
        var img = new Image();
        img.onload = function() {
            var result = (img.width > 0) && (img.height > 0);
            console.log('支持Webp');
            // alert('支持')
            ImageSmartLoader.isWebPSupported = true;
            ImageSmartLoader.webPLoader();
            // callback(feature, result);
        };
        img.onerror = function() {
            console.log('不支持Webp');
            // alert('不支持')
            ImageSmartLoader.isWebPSupported = false;
            ImageSmartLoader.webPLoader();
            // callback(feature, false);
        };
        img.src = "data:image/webp;base64," + TestImages['lossy'];
    },
    imgLoader: function() {
        console.log('加载默认图片');
    },
    webPLoader: function() {
        console.log('加载webP');
        // alert(ImageSmartLoader.isWebPSupported);
        if (ImageSmartLoader.isWebPSupported == true) {
            if (General.viewWidth <= 1024) {
                $(".lazy").lazyload({
                    advanced_load: true,
                    data_attribute: 'url',
                    webP_load: true,
                    is_scale: true,
                    scale_width: 750
                });
            } else {
                // alert('普通支持')
                $(".lazy").lazyload({
                    advanced_load: true,
                    data_attribute: 'url',
                    webP_load: true,
                    is_scale: false
                });
            }

        } else {
            // alert('加载普通')
            if (General.viewWidth <= 1024) {
                $(".lazy").lazyload({
                    advanced_load: true,
                    data_attribute: 'url',
                    webP_load: false,
                    is_scale: true,
                    scale_width: 750
                });
            } else {
                // alert('普通支持')
                $(".lazy").lazyload({
                    advanced_load: true,
                    data_attribute: 'url',
                    webP_load: false,
                    is_scale: false
                });
            }
        }

    },

}



$(document).ready(function() {
    General.init();
    ImageSmartLoader.init();
    if ($('body').hasClass('post-template')) {
        General.addIcons();
        General.commentLoader();
    }

})
