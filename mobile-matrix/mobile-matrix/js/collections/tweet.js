define([
    'util',
    'models/tweet',
    'order!lib/underscore-min',
    'order!lib/backbone-min'
    ], function (Util, TweetModel) {

    var DEFAULT_NUM_TWEETS = 3,
        MIN_REQUEST_INTERVAL = 10 * 60 * 1000; // 10 min per user

    var TweetCollection = Backbone.Collection.extend({

        model: TweetModel,

        getUid: function () {
            return 'collection.tweet.tweet.' + this.options.twitterId;
        },

        getLastRequestedId: function () {
            return 'collection.tweet.lastRequested.' + this.options.twitterId;
        },

        comparator: function (tweetModel) {
            return -tweetModel.get('id');
        },

        initialize: function (models, options) {
            this.options = _.extend(this.options || {}, options);

            _.defer(_.bind(this.restore, this));
        },

        sync: function (method, collection, options) {
            try {
                switch (method) {
                case 'create': break; // not implemented
                case 'read':
                    _.defer(_.bind(this.pull, collection));
                    break;

                case 'update': break; // not implemented
                case 'delete': break; // not implemented
                }

            // on failure
            } catch (e) {
                console.error(e);
                options.error(e);
            } 

            // on success
            options.success();
        },

        pull: function () {
            if (this.exceedRequestRate()) return;

            var that = this;

            Util.getTweetList({
                screen_name: this.options.twitterId,
                count: this.options.numTweets || DEFAULT_NUM_TWEETS,
                since_id: this.length && this.first().id || undefined

            // on success
            }, function (tweetList) {
                that.add(tweetList);
                that.backup();

                localStorage.setItem(that.getLastRequestedId(),
                        (new Date).getTime());
            });
        },

        restore: function () {
            var id = this.getUid(),
                json = localStorage.getItem(id),
                data = JSON.parse(json) || [];

            this.add(data);
        },

        backup: function () {
            localStorage.setItem(
                this.getUid(),
                JSON.stringify(this.toJSON()));
        },

        exceedRequestRate: function () {
            var lastRequested = localStorage.getItem(this.getLastRequestedId()),
                now = (new Date).getTime();

            return (now - lastRequested < MIN_REQUEST_INTERVAL);
        }
    });

    return TweetCollection;
});
