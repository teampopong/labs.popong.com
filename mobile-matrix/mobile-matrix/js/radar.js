define([
    'lib/underscore-min',
    'order!lib/raphael-min',
    'order!lib/raphael-radar'
    ], function () {

    var DEFAULT_OPTIONS = {
            lines: {
                'stroke-width':'2',
                'stroke':'#0070bb',
                'stroke-opacity':0.7,
                'fill':'#b7b2f8',
                'fill-opacity':0.6
            },
            points: {
                'fill':'#5a23f0',
                'stroke-width':'1.5',
                'stroke':'#5a23f0',
                'size':2
            },
            text: {
                'font-size': 14
            }
        },
        vPadding = 30,
        hPadding = 150,
        centerX = function (width) { return parseInt(width/2, 10); },
        centerY = function (height) { return parseInt(height/2, 10); },
        radius = function (width, height) {
            return _.min([width-hPadding, height-vPadding]) / 2;
        };

    return {
        draw: function (id, width, height, data, options) {
            options = _.extend({}, DEFAULT_OPTIONS, options);

            var labels = _.keys(data),
                scores = _.map(labels, function (label) { return data[label]; }),
                radarOption = {
                    scores: scores,
                    draw_options: options
                },
                paper = Raphael(id, width, height);

            return paper.radarchart(
                centerX(width), centerY(height), radius(width, height),
                labels, 10, [radarOption], options
                );
        }
    };
});
