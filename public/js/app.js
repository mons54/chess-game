(function ($) {

    $.extend({
        options: {
            appId: '459780557396952',
            redirectUri: 'https://apps.facebook.com/the-chess-game/',
            url: 'https://www.facebook.com/dialog/oauth?client_id=459780557396952&redirect_uri=https://apps.facebook.com/the-chess-game',
            host: 'mons54.parthuisot.fr',
            uid: null,
            name: 'User',
            lang: 'en',
            text: null,
            moderateur: false,
            parrainage: 0,
            allFriends: {},
            friends: {
                array: [],
                object: {}
            }
        },
        FB: {
            login: function () {
                FB.login($.FB.loginStatus, {
                    scope: 'user_friends'
                });
            },
            loginStatus: function (res) {
                if (res.status !== 'connected') {
                    return $.FB.login();
                }

                FB.api('/me/permissions?permission=user_friends', function (res) {
                    if (!res.data || !res.data.length) {
                        return $.FB.login();
                    }
                });

                FB.api('/me?fields=name', $.FB.apiMe);
            },
            apiMe: function (res) {
                if (!res) {
                    return;
                }

                $.options.uid = res.id;
                $.options.name = res.name.substr(0, 30);
                $.options.lang = (navigator.language || navigator.userLanguage).substr(0, 2);

                if ($.options.lang == 'ar') {
                    $('<link rel="stylesheet" href="/css/app-ar.css">').appendTo('head');
                }

                if ($.getParam('app_request_type') == 'user_to_user') {

                    var requestIds = $.getParam('request_ids');

                    if (requestIds) {
                        FB.api('/' + requestIds, $.FB.setSponsorship);
                    }
                }

                $.options.friends.array.push($.options.uid);

                $.translate();

                FB.api('/me/friends?fields=installed,id,name', $.FB.setFriends);
            },
            setSponsorship: function (res) {
                if (!res || !res.from || !res.from.id) {
                    return;
                }

                $.options.parrainage = parseInt(res.from.id);
            },
            setFriends: function (res) {

                $.options.allFriends = res.data.sort(compar);

                for (var i in res.data) {
                    if (res.data[i].installed) {
                        $.options.friends.array.push(res.data[i].id);
                        $.options.friends.object[res.data[i].id] = {};
                    }
                }

                function compar(a, b) {
                    return a.name > b.name ? 1 : -1;
                }
            }
        },
        translate: function () {
            $.getJSON('/translate/' + $.options.lang + '.json', $.start).fail(function() {
                $.options.lang = 'en';
                $.translate();
            });
        },
        start: function (data) {
            $.options.text = data;
            $(document).ready(function () {
                $.init();
                $.ads();
            });
        },
        init: function () {

            $('.fb-like').appendTo('body');

            $('#fanpage').empty().text($.options.text.fanpage);
            $('#terms-service').empty().text($.options.text.terms_service).attr('href', 'http://apps.solutionsweb.pro/jeux/fb-chess/' + $.options.lang);
            $('#privacy-policy').empty().text($.options.text.privacy_policy).attr('href', 'http://apps.solutionsweb.pro/jeux/fb-chess/' + $.options.lang);

            $('#content').empty().html();

            var start = $('<div id="start"></div>').appendTo('#content');

            $('<button class="play online online-' + $.options.lang + '">' + $.options.text.online + '</button>').appendTo(start).click(function () {
                $('#content').online();
                return false;
            });

            $('<button class="play offline offline-' + $.options.lang + '">' + $.options.text.offline + '</button>').appendTo(start).click(function () {
                $('#content').offline();
                return false;
            });
        },
        reloadAds: function () {
            $.ads();
        },
        ads: function () {

            if (typeof (LSM_Slot) === 'undefined') {
                return;
            }

            LSM_Slot({
                adkey: '826',
                ad_size: '728x90',
                slot: 'slot64668',
                _render_div_id: 'header'
            });

            LSM_Slot({
                adkey: '467',
                ad_size: '300x250',
                slot: 'slot61890',
                _render_div_id: 'pub'
            });

        },
        _sort: function (a, b) {

            if (!$.sortOption) {
                return 0;
            }

            if (a[$.sortOption] > b[$.sortOption]) {
                return -1;
            } else if (a[$.sortOption] < b[$.sortOption]) {
                return 1;
            }

            return 0;
        },
        _in_array: function (value, array) {

            for (var i = 0; i < array.length; i++) {
                if (array[i] == value) {
                    return true;
                }
            }

            return false;
        },
        _sprintf: function (valeur) {

            return ((valeur.toString().length == 1) ? '0' : '') + valeur;
        },
        _convert_price: function (data, price) {

            var currency = this._currency(data.currency.user_currency),
                rate = data.currency.usd_exchange_inverse;

            var newPrice = Math.round((price * rate) * 100) / 100,
                localPrice = String(newPrice).split(".");

            var minorUnits = localPrice[1] ? localPrice[1].substr(0, 2) : '',
                majorUnits = localPrice[0] || "0",
                separator = (1.1).toLocaleString()[1];

            var displayPrice = currency + ' ' + String(majorUnits) +
                (minorUnits ? separator + minorUnits : '') + ' ' + data.currency.user_currency;

            return displayPrice;
        },
        _currency: function (currency) {

            switch (currency) {
            case 'BOB':
                return 'Bs';
            case 'BRL':
                return 'R$';
            case 'GBP':
                return '£';
            case 'CAD':
                return 'C$';
            case 'CZK':
                return 'Kc';
            case 'DKK':
                return 'kr';
            case 'EUR':
                return '€';
            case 'GTQ':
                return 'Q';
            case 'HNL':
                return 'L';
            case 'HKD':
                return 'HK$';
            case 'HUF':
                return 'Ft';
            case 'ISK':
                return 'kr';
            case 'INR':
                return 'Rs.';
            case 'IDR':
                return 'Rp';
            case 'ILS':
                return '₪';
            case 'JPY':
                return '¥';
            case 'KRW':
                return 'W';
            case 'MYR':
                return 'RM';
            case 'NIO':
                return 'C$';
            case 'NOK':
                return 'kr';
            case 'PEN':
                return 'S/.';
            case 'PHP':
                return 'P';
            case 'PLN':
                return 'zł';
            case 'QAR':
                return 'ر.ق';
            case 'RON':
                return 'L';
            case 'RUB':
                return 'руб';
            case 'SAR':
                return 'ر.س';
            case 'SGD':
                return 'S$';
            case 'ZAR':
                return 'R';
            case 'SEK':
                return 'kr';
            case 'CHF':
                return 'CHF';
            case 'TWD':
                return 'NT$';
            case 'THB':
                return 'B';
            case 'TRY':
                return 'YTL';
            case 'AED':
                return 'د.إ';
            case 'UYU':
                return 'UYU';
            case 'VEF':
                return 'VEF';
            case 'VND':
                return '₫';
            default:
                return '$';
            }
        },
        sendInvite: function (data) {

            FB.ui({
                method: 'apprequests',
                to: data,
                title: $.options.text.title,
                message: $.options.text.description,

            });
        },
        partager: function (data) {

            FB.ui({
                method: 'feed',
                redirect_uri: $.options.redirectUri,
                link: $.options.redirectUri,
                picture: $.getHost() + '/img/mini-logo.png',
                name: $.options.text.title,
                caption: data.blanc + ' vs ' + data.noir + ' - ' + data.result + ' - ' + data.win,
                description: $.options.text.description
            });
        },
        partager_trophy: function (data) {

            FB.ui({

                method: 'feed',
                redirect_uri: $.options.redirectUri,
                link: $.options.redirectUri,
                picture: $.getHost() + '/img/trophees/' + $.options.text.trophy.content[data]._class + '.png',
                name: $.options.text.title,
                caption: $.options.text.trophy.content[data].title,
                description: $.options.text.trophy.content[data].description

            });
        },
        getParam: function (param) {

            var url = window.location.search.substring(1),
                get = url.split('&'),
                name = null;

            $.each(get, function (key, value) {
                var data = value.split('=');
                if (data[0] == param) {
                    name = data[1];
                }
            });

            return name;
        },
        getHost: function () {
            return 'https://' + $.options.host;
        }
    });

})(jQuery);

window.fbAsyncInit = function() {
    FB.init({
        appId      : $.options.appId,
        cookie     : true,
        xfbml      : true,
        version    : 'v2.8'
    });

    FB.getLoginStatus($.FB.loginStatus);
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
