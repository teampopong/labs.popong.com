define([
    'flyjsonp.min'
    ], function () {

    var Const = {
        API_URL: 'https://api.twitter.com/1/statuses/user_timeline.json?',
        DEFAULT_COUNT: 10
    };

    function requestUrl(params) {
        var qstr = [],
            key,
            value;

        for (key in params) {
            value = params[key];
            if (typeof value != 'undefined') {
                qstr.push(key + '=' + value);
            }
        }

        return Const.API_URL + qstr.join('&');
    }

    return {
        getTweetList: function (params, success, error) {
            FlyJSONP.get({
                url: requestUrl(params),
                success: success,
                error: error
            });
        }
    };
});
