define([
    'lib/jquery/jquery.min',
    'order!lib/underscore-min',
    'order!lib/backbone-min'
    ], function (
    ) {

    var LeftNavView = Backbone.View.extend({

        render: function () {
            var sections = this.options.sections,
                section,
                sectionHtml,
                $section,
                i;

            this.$el.empty();

            for (i = 0; i < sections.length; i++) {
                section = sections[i];
                sectionHtml = section.split('').join('<br>');
                $section = $('<div></div>')
                    .html(sectionHtml)
                    .addClass('menu');

                this.$el.append($section);
            }

            if (this.options.sections.length) {
                this.change(0);
            }
        },

        change: function (index) {
            this.selected().removeClass('selected');
            this.menus().eq(index).addClass('selected');
        },

        menus: function () {
            return this.$el.children('.menu');
        },

        selected: function () {
            return this.menus().filter('.selected');
        }

    });

    return LeftNavView;
});
