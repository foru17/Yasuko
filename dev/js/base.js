    $.fn.arctic_scroll = function(options) {

        var defaults = {
                elem: $(this),
                speed: 500
            },

            allOptions = $.extend(defaults, options);

        allOptions.elem.click(function(event) {
            event.preventDefault();
            var $this = $(this),
                $htmlBody = $('html, body'),
                offset = ($this.attr('data-offset')) ? $this.attr('data-offset') : false,
                position = ($this.attr('data-position')) ? $this.attr('data-position') : false,
                toMove;

            if (offset) {
                toMove = parseInt(offset);
                $htmlBody.stop(true, false).animate({
                    scrollTop: ($(this.hash).offset().top + toMove)
                }, allOptions.speed);
            } else if (position) {
                toMove = parseInt(position);
                $htmlBody.stop(true, false).animate({
                    scrollTop: toMove
                }, allOptions.speed);
            } else {
                $htmlBody.stop(true, false).animate({
                    scrollTop: ($(this.hash).offset().top)
                }, allOptions.speed);
            }
        });

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
        $(".arrow_down").arctic_scroll();
    })
