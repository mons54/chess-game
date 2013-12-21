
(function($){
	
	$.extend({
	
		start: function() {
		
			this.pub();
			
			$('.fb-like').appendTo('body');
			
			$('#fanpage').empty().text(this.options.lang[lang].fanpage);
			$('#terms-service').empty().text(this.options.lang[lang].terms_service).attr('href', 'http://apps.solutionsweb.pro/jeux/fb-chess/' + lang);
			$('#privacy-policy').empty().text(this.options.lang[lang].privacy_policy).attr('href', 'http://apps.solutionsweb.pro/jeux/fb-chess/' + lang);
			
			$('#content').empty().html();
	
			var start = $('<div id="start"></div>').appendTo('#content');
			
			if ($.browser.msie && parseInt($.browser.version) < 9) {
				this.error_browser();
				return;
			}
		
			$('<button class="play online online-' + lang + '">' + this.options.lang[lang].online + '</button>').appendTo(start)
			.click(function(){
				$('#content').online();
				return false;
			});
			
			$('<button class="play offline offline-' + lang + '">' + this.options.lang[lang].offline + '</button>').appendTo(start)
			.click(function(){
				$('#content').offline();
				return false;
			});
		},
		
		error_browser: function() {
			
			var fenetre = $('<div class="fenetre"></div>').css({'width': '100%', 'top': '-35px', 'left': '-15px', 'box-shadow': 'none'}).appendTo('#start');
			
			$('<h2>' + this.options.lang[lang].error_browser + '</h2>').appendTo(fenetre);
		},
		
		_sort: function (a, b) {
			
			if (!this.sortOption) {
				return 0;
			}
			
			if (a[this.sortOption] > b[this.sortOption]) {
				return -1;
			}
			else if (a[this.sortOption] < b[this.sortOption]) {
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

			var newPrice = Math.round((price * rate)*100)/100,
				localPrice = String(newPrice).split(".");
			
			var minorUnits = localPrice[1] ? localPrice[1].substr(0, 2) : '',
				majorUnits = localPrice[0] || "0",
				separator = (1.1).toLocaleString()[1];

			var displayPrice = currency + ' ' + String(majorUnits) +
				(minorUnits ? separator + minorUnits : '') + ' ' + data.currency.user_currency;
			
			return displayPrice;
		},
        
        _currency: function (currency) {
			
			switch(currency){
				case 'BOB': return 'Bs';
				case 'BRL': return 'R$';
				case 'GBP': return '£';
				case 'CAD': return 'C$';
				case 'CZK': return 'Kc';
				case 'DKK': return 'kr';
				case 'EUR': return '€';
				case 'GTQ': return 'Q';
				case 'HNL': return 'L';
				case 'HKD': return 'HK$';
				case 'HUF': return 'Ft';
				case 'ISK': return 'kr';
				case 'INR': return 'Rs.';
				case 'IDR': return 'Rp';
				case 'ILS': return '₪';
				case 'JPY': return '¥';
				case 'KRW': return 'W';
				case 'MYR': return 'RM';
				case 'NIO': return 'C$';
				case 'NOK': return 'kr';
				case 'PEN': return 'S/.';
				case 'PHP': return 'P';
				case 'PLN': return 'zł';
				case 'QAR': return 'ر.ق';
				case 'RON': return 'L';
				case 'RUB': return 'руб';
				case 'SAR': return 'ر.س';
				case 'SGD': return 'S$';
				case 'ZAR': return 'R';
				case 'SEK': return 'kr';
				case 'CHF': return 'CHF';
				case 'TWD': return 'NT$';
				case 'THB': return 'B';
				case 'TRY': return 'YTL';
				case 'AED': return 'د.إ';
				case 'UYU': return 'UYU';
				case 'VEF': return 'VEF';
				case 'VND': return '₫';
				default:return '$';
			}
		},
		
		sendInvite: function(data) {

			FB.ui({method: 'apprequests',
				to: data,
				title: this.options.lang[lang].title,
				message: this.options.lang[lang].description,

			}, $.fbCallback);
		},
		
		partager: function(data) {

			FB.ui({
			
				method: 'feed',
				redirect_uri: redirectUri,
				link: redirectUri,
				picture: 'https://chess-game.jit.su/img/mini-logo.png',
				name: this.options.lang[lang].title,
				caption: data.blanc + ' vs ' + data.noir + ' - ' + data.result + ' - ' + data.win,
				description: this.options.lang[lang].description

			}, $.fbCallback);
		},
		
		partager_trophy: function(data) {

			FB.ui({
			
				method: 'feed',
				redirect_uri: redirectUri,
				link: redirectUri,
				picture: 'https://chess-game.jit.su/img/trophees/' + this.options.lang[lang].trophy.content[data]._class + '.png',
				name: this.options.lang[lang].title,
				caption: this.options.lang[lang].trophy.content[data].title,
				description: this.options.lang[lang].trophy.content[data].description

			});
		},

		get_param: function(param) {

			var url = window.location.search.substring(1);
			var variables = url.split('&');

			for (var i = 0; i < variables.length; i++) {
				var name = variables[i].split('=');

				if (name[0] == param) {
					return name[1];
				}
			}
		},
		
		pub: function () {
			
			if (typeof(LSM_Slot) === 'undefined') {
				return;
			}
				
			if(gender == 'female') {
				LSM_Slot({
					adkey: '571',
					ad_size: '300x250',
					slot: 'slot68172',
					_render_div_id: "pub"
				});
			}
			else {
				LSM_Slot({
					adkey: 'd87',
					ad_size: '300x250',
					slot: 'slot60359',
					_render_div_id: "pub"
				});
			}
			
			if(gender == 'female') {
				 LSM_Slot({
					adkey: '87b',
					ad_size: '728x90',
					slot: 'slot68173',
					_render_div_id: "pub-footer"
				});
			}
			else {
				LSM_Slot({
					adkey: '826',
					ad_size: '728x90',
					slot: 'slot64668',
					_render_div_id: "pub-footer"
				});
			}
		}
	});
})(jQuery);