define([
    'collections/tweet',
    'order!lib/underscore-min',
    'order!lib/backbone-min'
    ], function (TweetCollection) {

    var MemberModel = Backbone.Model.extend({
        initialize: function (options) {
            var twitterId = options.twitterId,
                tweetCollection = new TweetCollection([], {
                    twitterId: twitterId
                });

            this.set('tweetCollection', tweetCollection);
        }
    });

    return MemberModel;
});
