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

require(['jquery', 'kUI'], function($, ui) {
    $(window).k();
    $(document.body).css('visibility', '');
    var showingLayerIndex = 0;

    $('#layer').click(function () {
        $('#layer').k('hide')
        $('#layer').k('show', showingLayerIndex);
        showingLayerIndex++;

        if (showingLayerIndex >= 3) {
            showingLayerIndex = 0;
        }
    });
});

