require.config({
    baseUrl: '../build',
    paths: {
        jquery: '../lib/bower/jquery/jquery',
        'jquery.migrate': '../lib/bower/jquery.migrate/jquery-migrate-1.2.1'
    },
    shim: {
        jquery: {
            exports: 'jquery'
        },
        'jquery.migrate': {
            deps: ['jquery']
        }
    }
});

require(['jquery', 'kLayouter'], function($, layouter) {
    $(window).kLayouter();
});

