require.config({
    baseUrl: '../build',
    paths: {
        jquery: '../lib/bower/jquery/jquery',
    },
    shim: {
        jquery: {
            exports: 'jquery',
        },
    }
});

require(['jquery', 'kLayouter'], function($, layouter) {
});

