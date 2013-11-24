var appId = '459780557396952',
	redirectUri = 'https://apps.facebook.com/the-chess-game/',
	url = 'https://www.facebook.com/dialog/oauth?client_id=' + appId + '&redirect_uri=' + redirectUri,
	uid,
	name,
	lang,
	gender,
	moderateur = false,
	parrainage = 0,
	all_friends = {},
	friends = {
		array:[],
		object: {}
	};

window.fbAsyncInit = function() {

	FB.init({
		appId : appId,
		status: true,
		cookie: true,
		xfbml : true
	});
	
	FB.getLoginStatus(function(response) {
		
		if (response.status !== 'connected') {
			top.location.href = url;
			return;
		}
		
		FB.api('/me', function(response) {
			
			if(!response.id || !response.name) {
				top.location.href=redirectUri;
			}
				
			uid = response.id;
			name = response.name.substr(0,30);
			lang = response.locale ? response.locale.substr(0,2) : 'en';
			gender = response.gender;
			
			if(!$.options.lang[lang]) {
				lang = 'en';
			}
				
			if(lang == 'ar') {
				$('<link rel="stylesheet" href="/css/style-ar.css">').appendTo('head');
			}
				
			var app_request_type = $.get_param('app_request_type');
			
			if(app_request_type == 'user_to_user') {
				
				var request_ids = $.get_param('request_ids');
				
				if(request_ids) {
					FB.api('/' + request_ids, function(response) {
						if(response && response.from && response.from.id) {
							parrainage = parseInt(response.from.id);
						}
					});
				}
			}
			
			friends.array.push(uid);
			
			$(document).ready(function() {
				$.start();
			});
			
			FB.api('/me/friends?fields=installed,id,name', function(response) {
				
				all_friends = response.data.sort(compar);
				
				for (var i in response.data) {
					if (response.data[i].installed) {
						friends.array.push(response.data[i].id);
						friends.object[response.data[i].id] = {};
					}	
				}
				
				function compar(a, b) {
					return a.name > b.name ? 1 : -1;
				}
			});
		});
	});
};

(function() {
	var e = document.createElement('script'); e.async = true;
	e.src = document.location.protocol +
	  '//connect.facebook.net/en_US/all.js';
	document.getElementById('fb-root').appendChild(e);
}());