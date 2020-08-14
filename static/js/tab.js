! function($) {
    "use strict";
    $(function() {
        $.support.transition = function() {
            var transitionEnd = function() {
                var name, el = document.createElement("bootstrap"),
                    transEndEventNames = {
                        WebkitTransition: "webkitTransitionEnd",
                        MozTransition: "transitionend",
                        OTransition: "oTransitionEnd otransitionend",
                        transition: "transitionend"
                    };
                for (name in transEndEventNames)
                    if (void 0 !== el.style[name]) return transEndEventNames[name]
            }();
            return transitionEnd && {
                end: transitionEnd
            }
        }()
    })
}(window.jQuery), ! function($) {
    "use strict";
    var Tab = function(element) {
        this.element = $(element)
    };
    Tab.prototype = {
        constructor: Tab,
        show: function() {
            var previous, $target, e, $this = this.element,
                $ul = $this.closest("ul:not(.dropdown-menu)"),
                selector = $this.attr("data-target");
            selector || (selector = $this.attr("href"), selector = selector && selector.replace(/.*(?=#[^\s]*$)/, "")), $this.parent("li").hasClass("active") || (previous = $ul.find(".active:last a")[0], e = $.Event("show", {
                relatedTarget: previous
            }), $this.trigger(e), e.isDefaultPrevented() || ($target = $(selector), this.activate($this.parent("li"), $ul), this.activate($target, $target.parent(), function() {
                $this.trigger({
                    type: "shown",
                    relatedTarget: previous
                })
            })))
        },
        activate: function(element, container, callback) {
            function next() {
                $active.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"), element.addClass("active"), transition ? (element[0].offsetWidth, element.addClass("in")) : element.removeClass("fade"), element.parent(".dropdown-menu") && element.closest("li.dropdown").addClass("active"), callback && callback()
            }
            var $active = container.find("> .active"),
                transition = callback && $.support.transition && $active.hasClass("fade");
            transition ? $active.one($.support.transition.end, next) : next(), $active.removeClass("in")
        }
    };
    var old = $.fn.tab;
    $.fn.tab = function(option) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data("tab");
            data || $this.data("tab", data = new Tab(this)), "string" == typeof option && data[option]()
        })
    }, $.fn.tab.Constructor = Tab, $.fn.tab.noConflict = function() {
        return $.fn.tab = old, this
    }, $(document).on("click.tab.data-api", '[data-toggle="tab"], [data-toggle="pill"]', function(e) {
        e.preventDefault(), $(this).tab("show")
    })
}(window.jQuery);