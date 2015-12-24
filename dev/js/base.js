

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
    })
