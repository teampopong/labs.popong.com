define([
    'util',
    'lib/jquery/jquery.min',
    'lib/underscore-min',
    'lib/iscroll'
    ], function (Util) {

    var ISCROLL_OPTION = {
        snap: true,
        snapThreshold: 50,
        momentum: false,
        hScrollbar: false,
        vScrollbar: false,
        zoom: true
    };

    function setViewportSize(page_id) {
        /* Some orientation changes leave the scroll position at something
         * that isn't 0,0. This is annoying for user experience. */
        scroll(0, 0);

        /* Calculate the geometry that our content area should take */
        var $page = $('#'+page_id),
            header = $page.children(":jqmData(role=header)"),
            footer = $page.children(":jqmData(role=footer)"),
            content = $page.children(":jqmData(role=content)"),
            leftNav = $page.children("#left-nav-wrapper"),
            // jQuery 1.7.1 has a bug on $(window).height() for iPhone
            viewport_height = window.innerHeight,
            content_height = viewport_height - header.outerHeight() - footer.outerHeight(),
            // FIXME: 스크롤바 생기지 않도록 여유를 줬음.
            content_width = $(window).width() - leftNav.width();

        /* Trim margin/border/padding height */
        content_height -= (content.outerHeight() - content.height());
        leftNav.height(content_height);
        content.height(content_height);
        content.width(content_width);
    }


    function setCarouselSize(viewport_id, numRow, numCol) {
        var $viewport = $('#'+viewport_id),
            wWidth = $viewport.width(),
            wHeight = $viewport.height();

        $viewport
            .add(Util.nthChild($viewport, 3))
            .width(wWidth)
            .height(wHeight);

        Util.nthChild($viewport, 2)
            .width(wWidth)
            .height(wHeight * numRow);

        Util.nthChild($viewport, 1)
            .width(wWidth * numCol)
            .height(wHeight * numRow);
    }

    return {
        destroy: function (carousel) {
            $(window).unbind('resize', carousel.onResize);
            carousel.destroy();
        },

        init: function (page_id, initOptions) {
            var options = _.extend({}, ISCROLL_OPTION, initOptions);
            var viewport_id = _.uniqueId('viewport'),
                $viewport = $('#'+page_id+' :jqmData(role=content)').attr('id', viewport_id),
                carousel = new iScroll(viewport_id, options);

            // Initialize location indicator
            options.onScrollEnd.call(carousel);

            function onResize() {
                // setup viewport size
                setViewportSize(page_id);

                // apply styling class to the page
                $('#'+page_id).addClass('carousel2d');

                // setup carousel size
                setCarouselSize(viewport_id, initOptions.numRow, initOptions.numCol);

                carousel.refresh();
            }
            onResize();

            var lazyOnResize = _.debounce(onResize, 100);
            $(window).resize(lazyOnResize);
            carousel.onResize = lazyOnResize;

            return carousel;
        }
    };
});
