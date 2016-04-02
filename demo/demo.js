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
        if ($('#layer').k('get', 'remove').length > 0) {
            $('#layer').k('remove', 'remove');
        } else {
            $('#layer').k('get').hide();
            $('#layer').k('get', showingLayerIndex).show();
            showingLayerIndex++;

            if (showingLayerIndex >= 3) {
                showingLayerIndex = 0;
            }
        }
    });
});

