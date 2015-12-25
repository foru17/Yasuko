/*!
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2015 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.9.7
 *
 */

(function($, window, document, undefined) {
    var $window = $(window);

    $.fn.lazyload = function(options) {
        var elements = this;
        var $container;
        var settings = {
            threshold       : 0,
            failure_limit   : 0,
            event           : "scroll",
            effect          : "show",
            container       : window,
            data_attribute  : "original",
            skip_invisible  : false,
            appear          : null,
            load            : null,
            placeholder     : "data:image/gif;base64,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",
            advanced_load:false,
            webP_load : false,
            is_scale:false,
            scale_width:750
        };

        function update() {
            var counter = 0;

            elements.each(function() {
                var $this = $(this);
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                if ($.abovethetop(this, settings) ||
                    $.leftofbegin(this, settings)) {
                        /* Nothing. */
                } else if (!$.belowthefold(this, settings) &&
                    !$.rightoffold(this, settings)) {
                        $this.trigger("appear");
                        /* if we found an image we'll load, reset the counter */
                        counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });

        }

        if(options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }

            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined ||
                      settings.container === window) ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.bind(settings.event, function() {
                // console.log('滚动了111');
                // console.log('滚动');
                return update();
            });
        }

        this.each(function() {
            var self = this;
            var $self = $(self);

            self.loaded = false;

            /* If no src attribute given use data:uri. */
            if ($self.attr("src") === undefined || $self.attr("src") === false) {
                if ($self.is("img")) {
                    $self.attr("src", settings.placeholder);
                     $self.addClass("loading");
                }
            }

            /* When appear is triggered load original image. */

            $self.one("appear", function() {
                if (!this.loaded) {
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    var updatedUrl = $self.attr("data-" + settings.data_attribute );
                            if(settings.advanced_load == true){
                                updatedUrl +='!';
                            }
                            if(settings.is_scale ==true){
                                updatedUrl += '/fw/' + settings.scale_width;
                            }
                            if(settings.webP_load == true){
                                updatedUrl += '/format/webp';
                            }

                    // console.log(updatedUrl);
                    $("<img />")
                        .bind("load", function() {

                            $self.hide();

                            if ($self.is("img")) {
                                $self.attr("src", updatedUrl);
                            } else {
                                $self.css("background-image", "url('" + updatedUrl + "')");
                            }
                            $self[settings.effect](settings.effect_speed);

                            self.loaded = true;

                            /* Remove image from array so it is not looped next time. */
                            var temp = $.grep(elements, function(element) {
                                return !element.loaded;
                            });
                            elements = $(temp);

                            if (settings.load) {
                                var elements_left = elements.length;
                                settings.load.call(self, elements_left, settings);
                            }
                            $self.removeClass("loading");
                        })
                        .attr("src", updatedUrl);
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.bind(settings.event, function() {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.bind("resize", function() {
            update();
        });

        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
            $window.bind("pageshow", function(event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function() {
                        $(this).trigger("appear");
                    });
                }
            });
        }

        /* Force initial check if images should appear. */
        $(document).ready(function() {
            update();
        });

        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };

    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };

    $.leftofbegin = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function(element, settings) {

         return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
                !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
     };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    $.extend($.expr[":"], {
        "below-the-fold" : function(a) { return $.belowthefold(a, {threshold : 0}); },
        "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-screen": function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-screen" : function(a) { return !$.rightoffold(a, {threshold : 0}); },
        "in-viewport"    : function(a) { return $.inviewport(a, {threshold : 0}); },
        /* Maintain BC for couple of versions. */
        "above-the-fold" : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-fold"  : function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-fold"   : function(a) { return !$.rightoffold(a, {threshold : 0}); }
    });

})(jQuery, window, document);
