require([
    'models/district',
    'views/district',
    'order!lib/jquery/jquery.min',
    'order!lib/jquery/jquery.mobile.min'
    ], function (DistrictModel, DistrictView) {

    $(function () {
        var districtModel = new DistrictModel({
                dataUrl: 'data/district.sample.json'
            });

        window.App = new DistrictView({
            el: $('#carousel-page'),
            model: districtModel,
            carouselId: 'carousel-page'
        });
    });
}
);
