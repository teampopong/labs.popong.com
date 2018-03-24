define([
    'util',
    'models/member',
    'order!lib/underscore-min',
    'order!lib/backbone-min',
    'lib/jquery/jquery.min'
    ], function (Util, MemberModel) {

    var DistrictModel = Backbone.Model.extend({

        id: _.uniqueId('model.district'),

        default: {
            members: [],
            memberModels: []
        },

        defaultData: {
            members: [],
            memberModels: []
        },

        initialize: function () {
            this.set(this.defaultData);
            this.on('change:members', this.initMemberModels, this);

            _.defer(_.bind(this.restore, this));
        },

        initMemberModels: function () {
            var members = this.get('members'),
                memberModels = [];

            _.each(members, function (member, i) {
                memberModels.push(new MemberModel(member));
            });

            this.set('memberModels', memberModels);
        },

        sync: function (method, model, options) {
            try {
                switch (method) {
                case 'create': break; // not implemented
                case 'read':
                    _.defer(_.bind(this.pull, model));
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

        restore: function () {
            var data = JSON.parse(localStorage.getItem(this.id))
                || this.defaultData;
            this.set(data);
        },

        pull: function () {
            var that = this;
            $.getJSON(this.get('dataUrl'), function (data) {
                that.set('members', data);
                that.backup();
            });
        },

        backup: function () {
            localStorage.setItem(
                this.id,
                JSON.stringify(this.toJSON()));
        }
    });

    return DistrictModel;
});
