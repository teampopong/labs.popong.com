define([
    'twitter-util',
    'lib/underscore-min',
    'lib/jquery/jquery.min'
    ], function (TwitterUtil) {

    var MiscUtil = {
            getResourceJSON: function (rel, callback) {
                var data_url = $('link[rel="'+rel+'"]').map(function () {
                            return $(this).attr('href');
                        }).get()[0];

                // Reject if data_url does not exists
                if (!data_url) {
                    var defer = $.Deferred();
                    defer.reject();
                    return defer;
                }

                return $.getJSON(data_url, callback);
            },

            nthChild: function nthChild ($elem, n) {
                if (_.isNumber(n) && n > 0) {
                    return nthChild($elem.children(), n-1);
                } else {
                    return $elem;
                }
            }
        };

    return $.extend(MiscUtil, TwitterUtil);

});
