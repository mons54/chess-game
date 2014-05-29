(function ($) {

	var config = {
		appId 			: '466889913406471',
		redirectUri 	: 'https://apps.facebook.com/____test/',
		url 		: 'https://www.facebook.com/dialog/oauth?client_id=' + this.appId + '&redirect_uri=' + this.redirectUri,
		uid 		: null,
		name 		: 'User',
		lang		: 'en',
		gender		: 'male',
		moderateur 	: false,
		parrainage	: 0,
		allFriends	: {},
		friends 	: { array: [], object: {} }
	};

	$.extend({
		config: config,
		FB: {
			getLoginStatus: function (res) {
			
				if (res.status !== 'connected') {
					top.location.href = url;
					return;
				}
				
				$.config.uid = res.authResponse.userID;

				FB.api('/me', $.FB.apiMe);
			},
			apiMe: function (res) {
			
				if (!res) {
					return;
				}
				
				$.config.name 	= res.name.substr(0,30);
				$.config.lang 	= res.locale.substr(0,2);
				$.config.gender = res.gender;

				if (lang == 'ar') {
					$('<link rel="stylesheet" href="/css/style-ar.css">').appendTo('head');
				}

				if ($.get_param('app_request_type') == 'user_to_user') {

					var requestIds = $.get_param('request_ids');
						
					if (requestIds) {
						FB.api('/' + requestIds, $.FB.setSponsorship);
					}
				}

				$.config.friends.array.push(uid);

				$(document).ready(function() {
					$.start();
				});

				FB.api('/me/friends?fields=installed,id,name', $.FB.setFriends);
			},
			setSponsorship: function (res) {
				if (!res || !res.from || !res.from.id) {
					return;
				}

				$.config.parrainage = parseInt(res.from.id);
			},
			setFriends: function (res) {

				$.config.allFriends = res.data.sort(compar);
					
				for (var i in res.data) {
					if (res.data[i].installed) {
						friends.array.push(res.data[i].id);
						friends.object[res.data[i].id] = {};
					}	
				}
				
				function compar(a, b) {
					return a.name > b.name ? 1 : -1;
				}
			}
		}
	});

})(jQuery);

window.fbAsyncInit = function() {

	FB.init({
		appId 		: $.config.appId,
		status 		: true,
		cookie		: true,
		xfbml 		: true,
		version 	: 'v2.0'
	});

	FB.getLoginStatus($.FB.getLoginStatus);
};

(function () {
	var e = document.createElement('script'); e.async = true;
	e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
	document.getElementById('fb-root').appendChild(e);
}());