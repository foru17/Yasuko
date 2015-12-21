var General = {
    isMobile: false,
    viewWidth: $(window).width(),
    init: function() {
        var doc = win.document;
        var isAndroid = win.navigator.appVersion.match(/android/gi);
        var isIPhone = win.navigator.appVersion.match(/iphone/gi);
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
            ImageSmartLoader.isWebPSupported = true;
            ImageSmartLoader.webPLoader();
            // callback(feature, result);
        };
        img.onerror = function() {
            console.log('不支持Webp');
            ImageSmartLoader.isWebPSupported = false;
            // ImageSmartLoader.imgLoader();
            // callback(feature, false);
        };
        img.src = "data:image/webp;base64," + TestImages['lossy'];
    },
    imgLoader: function() {
        console.log('加载默认图片');
    },
    webPLoader: function() {
        console.log('加载webP');
        if (ImageSmartLoader.isWebPSupported == true) {
            if (General.viewWidth <= 1024) {
                $(".lazy").lazyload({
                    advanced_load: true,
                    data_attribute: 'url',
                    webP_load: true,
                    is_scale: true,
                    scale_width: 750
                });
            }else{
                $(".lazy").lazyload({
                    advanced_load: true,
                    data_attribute: 'url',
                    webP_load: true,
                    is_scale: false
                });
            }

        }

    },

}



$(document).ready(function() {
    ImageSmartLoader.init();
})
