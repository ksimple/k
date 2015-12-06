export function attach(element) {
    element = $(element);
    var items;

    if (element[0] == window) {
        items = $(document.body).find('.kl-item');
    } else {
        items = element.find('.kl-item');
    }

    for (var i = 0; i < items.length; i++) {
        var item = items.eq(i);

        if (item.data('kl-item')) {
            continue;
        }

        switch (item.attr('data-kl-type')) {
            case 'vertical':
                item.data('kl-item', new Vertical(item));
                break;
        }
    }
}

