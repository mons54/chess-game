
(function($){
	
	$.extend({
	
		start: function() {
		
			var that = this;
			
			$.pub();
			
			$('.fb-like').appendTo('body');
			
			$('#fanpage').empty().text($.options.lang[lang].fanpage);
			$('#terms-service').empty().text($.options.lang[lang].terms_service).attr('href', 'http://apps.solutionsweb.pro/jeux/fb-chess/' + lang);
			$('#privacy-policy').empty().text($.options.lang[lang].privacy_policy).attr('href', 'http://apps.solutionsweb.pro/jeux/fb-chess/' + lang);
			
			$('#content').empty().html();
	
			var start = $('<div id="start"></div>').appendTo('#content');
			
			if ($.browser.msie && parseInt($.browser.version) < 9) {
				that.error_browser();
				return;
			}
		
			$('<button class="play online online-' + lang + '">' + that.options.lang[lang].online + '</button>').appendTo(start)
			.click(function(){
				$('#content').online();
				return false;
			});
			
			$('<button class="play offline offline-' + lang + '">' + that.options.lang[lang].offline + '</button>').appendTo(start)
			.click(function(){
				$('#content').offline();
				return false;
			});
		},
		
		error_browser: function() {
			
			var that = this;
			
			var fenetre = $('<div class="fenetre"></div>').css({'width': '100%', 'top': '-35px', 'left': '-15px', 'box-shadow': 'none'}).appendTo('#start');
			
			$('<h2>' + that.options.lang[lang].error_browser + '</h2>').appendTo(fenetre);
		},
		
		_in_array: function (value, _array) {

            var length = _array.length;

            for (var i = 0; i < length; i++)
                if (_array[i] == value) return true;

            return false;
        },
		
		_sprintf: function (valeur) {

            return ((valeur.toString().length == 1) ? '0' : '') + valeur;
        },
		
		sendInvite: function(data) {

			var that = this;
			
			FB.ui({method: 'apprequests',
				to: data,
				title: that.options.lang[lang].title,
				message: that.options.lang[lang].description,

			}, $.fbCallback);
		},
		
		partager: function(data) {

			var that = this;
			
			FB.ui({
			
				method: 'feed',
				redirect_uri: redirectUri,
				link: redirectUri,
				picture: 'https://chess-game.jit.su/img/mini-logo.png',
				name: that.options.lang[lang].title,
				caption: data.blanc + ' vs ' + data.noir + ' - ' + data.result + ' - ' + data.win,
				description: that.options.lang[lang].description

			}, $.fbCallback);
		},
		
		partager_trophy: function(data) {

			var that = this;
			
			FB.ui({
			
				method: 'feed',
				redirect_uri: redirectUri,
				link: redirectUri,
				picture: 'https://chess-game.jit.su/img/trophees/' + that.options.lang[lang].trophy.content[data]._class + '.png',
				name: that.options.lang[lang].title,
				caption: that.options.lang[lang].trophy.content[data].title,
				description: that.options.lang[lang].trophy.content[data].description

			}, $.fbCallback);
		},

		fbCallback: function(response) {

			console.log(response);
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
			
			if(LSM_Slot) {
				
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
		}
	});
})(jQuery);