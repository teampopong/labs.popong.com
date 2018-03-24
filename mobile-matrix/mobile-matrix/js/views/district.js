define([
    'carousel2d',
    'radar',
    'views/left-nav',
    'text!templates/member.profile.html',
    'text!templates/member.tweet.html',
    'text!templates/member.tweet.tweet.html',
    'lib/jquery/jquery.min',
    'order!lib/underscore-min',
    'order!lib/underscore.string.min',
    'order!lib/backbone-min'
    ], function (
        Carousel2d,
        Radar,
        LeftNavView,
        profilePageTemplate,
        tweetPageTemplate,
        tweetTemplate
    ) {

    var Const = {
        SECTION_NAMES: [
            '프로필',
            '트위터'
        ]
    };

    var MemberProfileView = Backbone.View.extend({

        tagName: 'li',

        template: _.template(profilePageTemplate),

        render: function () {
            this.$el.html(this.template(_.extend({
                col: this.options.col,
                row: 0
            }, this.model.toJSON())));
            this.renderStats();
            return this;
        },

        renderStats: function () {
            var statsId = _.uniqueId('member.profile.stats'),
                $stats = $('.member_stats_chart', this.el)
                    .attr('id', statsId),
                statsWidth = $stats.width(),
                statsHeight = $stats.height();

            Radar.draw(statsId, statsWidth, statsHeight, this.model.get('stats'));
        }
    });

    var MemberTwitterView = Backbone.View.extend({

        tagName: 'li',

        template: _.template(tweetPageTemplate),
        tweetTemplate: _.template(tweetTemplate),

        initialize: function () {
            this.render();

            this.collection.on('add', this.render, this);
            // TODO: 업데이트 max-rate 지정
            this.collection.fetch();
        },

        render: function () {
            this.$el.html(this.template({
                col: this.options.col,
                row: 1, // FIXME
                tweetCollection: this.collection,
                tweetTemplate: this.tweetTemplate
            }));
        }
    });

    var MemberView = Backbone.View.extend({

        tagName: 'ul',

        initialize: function () {
            this.profileView = new MemberProfileView({
                col: this.options.col,
                model: this.model
            });
            this.twitterView = new MemberTwitterView({
                col: this.options.col,
                collection: this.model.get('tweetCollection')
            });

            this.$el.append(this.profileView.el);
            this.$el.append(this.twitterView.el);
        },

        render: function () {
            this.profileView.render();
        }
    });

    var DistrictView = Backbone.View.extend({

        initialize: function () {
            this.$board = this.$el.find('#panel-board');

            this.initLeftNav();
            this.render();

            this.model.on('change', this.render, this);
            this.model.fetch();
        },

        initLeftNav: function () {
            this.leftNavView = new LeftNavView({
                el: this.$el.find('#left-nav').get(),
                sections: Const.SECTION_NAMES
            });
        },

        render: function () {
            this.clear();

            var memberModels = this.model.get('memberModels');
            if (!memberModels.length) return;

            this.leftNavView.render();
            this.renderCells(memberModels);
            this.renderCarousel(memberModels);
        },

        clear: function () {
            if (this.carousel) Carousel2d.destroy(this.carousel);
            this.$board.empty();
        },

        renderCells: function (memberModels) {
            var that = this;

            _.each(memberModels, function (memberModel, i) {
                var memberView = new MemberView({
                        col: i,
                        model: memberModel
                    }),
                    memberViewElem = memberView.el;

                that.$board.append(memberViewElem);

                // Raphael을 사용하기 위해 그려질 차트의 엘리먼트가
                // DOM Tree에 속할 필요가 있음
                // 때문에 append 다음에 render
                memberView.render();
            });
        },

        renderCarousel: function (memberModels) {
            var numRow = Const.SECTION_NAMES.length,
                numCol = memberModels.length,
                $overlay = $('#panel-board-overlay'),
                isZoomedOut = false,
                lastScale,
                scrollerScale,
                that = this;

            this.carousel = Carousel2d.init(this.options.carouselId, {
                numRow: numRow,
                numCol: numCol,
                onScrollEnd: function() {
                    var xIndex = Math.round(Math.abs(this.x)/$('.ui-content').width()),
                        yIndex = Math.round(Math.abs(this.y)/$('.ui-content').height()),
                        memberText = $('.member_name:eq('+xIndex+')').html();

                    $('#cur-member-name').text(memberText);
                    that.leftNavView.change(yIndex);
                },

                onZoom: function () { // trick to store which pinch event occured
                    lastScale = this.lastScale;
                },

                onZoomEnd: function () {
                    // Zoom out
                    if (lastScale < 1) {
                        scrollerScale = this.scale = 1 / Math.max(numRow, numCol);
                        that.$board
                            .css('-webkit-transition', 'all .3s ease-out')
                            .css('-webkit-transform', 'scale('+this.scale+')');
                        $overlay
                            .css('top', $(':jqmData(role=content)').offset().top)
                            .css('left', $(':jqmData(role=content)').offset().left)
                            .css('width', that.$board.width())
                            .css('height', that.$board.height())
                            .show();
                        _.delay(function () {
                            isZoomedOut = true;
                        }, 300);
                    }
                }

            });

            var touches;

            $overlay.bind({
                touchstart: function (e) {
                    touches = e.originalEvent.touches;
                    e.preventDefault(); return false;
                },
                touchmove: function (e) {
                    touches = [];
                    e.preventDefault(); return false;
                },
                touchend: function (e) {
                    if (!isZoomedOut) return;

                    if (touches.length !== 1) return; // one-point touch only

                    var touch = touches[0],
                        mx = touch.clientX - that.$board.offset().left,
                        my = touch.clientY - that.$board.offset().top,
                        $panel = $('.panel').filter(function (i) {
                            var $this = $(this),
                                position = $(this).position(),
                                leftX = position.left,
                                rightX = leftX + ($this.width() * scrollerScale),
                                topY = position.top,
                                bottomY = topY + ($this.height() * scrollerScale);

                            return (leftX <= mx && mx <= rightX
                                    && topY <= my && my <= bottomY);
                        });

                    if (!$panel.size()) return;

                    $overlay.hide();
                    that.$board
                        .css('-webkit-transition', 'all .3s ease-out')
                        .css('-webkit-transform', 'scale(1)');
                    that.carousel.scale = 1;

                    _.delay(function () {
                        var px = $panel.attr('col'),
                            py = $panel.attr('row');
                        that.carousel.scrollToPage(px, py, 300);
                        isZoomedOut = false;
                    }, 350);
                }
            });
        }
    });

    return DistrictView;
});
