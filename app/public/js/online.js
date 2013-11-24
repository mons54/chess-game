

(function ($) {

    $.widget("ui.online", {

        _case: {

        },
        
		options: {
            
			stop: false,
			trophy: {},
			partager: {},
			send_invite: {
				bt:"",
				nb:0,
				data:[]
			},
            blanc: {
				coup: null,
                img: null,
                nom: null,
                decompte: null,
                decompte_tour: null,
                piece_reste: ""
            },
            noir: {
				coup: null,
                img: null,
                nom: null,
                decompte: null,
				decompte_tour: null,
                piece_reste: ""
            },
			sound: true
        },
		
		_create: function () {
			
			var that = this;
			
			that.uid = uid;
			that.name = name;
			that._decompte();
			that._clock();
			that._free();
			
			that.socket = $.socket;
			
			if(!$('#audio #move')[0].play || !$('#audio #time')[0].play) that.options.sound = false;
			
			that.socket.open = false;
			
			that._socket_onmessage();
		},
		
		_init: function () {
			
			var that = this;
			
			$.pub();
			
			$('#header').css('display', 'block');
			$('#footer').css('display', 'block');
			
			that.tokens = { ready:false };
			
			that.trophy = { ready:false };
			
			that.menu = {
				accueil: true,
				jouer:false,
				classement:true
			};
			
			that.menu_game = "parties";
			that.all_defis = {};
			that.nb_defis = 0;
			that.all_connected = {};
			that.type_ranking = "friends";
			
			$(that.element).empty().html();
			
			var left = $('<div id="left"></div>').appendTo(that.element);
			
			var div = $('<div class="infos"></div>').appendTo(left);
			
			that.clock = $('<div class="clock"></div>').appendTo(div);
			
			that.nb_connect = $('<div class="nb-connect"></div>').appendTo(div);
			
			$('<a class="trophy" href="#"></a>').appendTo(left)
			.click(function() {
				
				if(that.trophy && that.trophy.ready)
					that._trophy();
				
				return false;
			});
			
			var _class = "sound";
			
			if(!that.options.sound)
				_class = "no-sound";
			
			that.bt_sound = $('<a id="sound" class="' + _class + '" href="#"></a>').appendTo(left)
			.click(function() {
				
				that._sound();
				
				return false;
			});
			
			var _right = $('<div id="right"></div>').appendTo(that.element);
			
			$('<a href="#" class="dealspot dealspot-' + lang + '"></div>').appendTo(_right)
			.click(function() {
				
				that._sponsorpay();
				
				return false;
			});
			
			var free = $('<div class="free"></div>').appendTo(_right);
			
			var time = $('<div class="time"></div>').appendTo(free);
			
			that.free_h = $('<span class="hours"></span>').appendTo(time);
			$('<span class="sep-1">:</span>').appendTo(time);
			that.free_m = $('<span class="minutes"></span>').appendTo(time);
			$('<span class="sep-2">:</span>').appendTo(time);
			that.free_s = $('<span class="secondes"></span>').appendTo(time);
			
			if(that.options.send_invite.nb < 30) {
			
				that.options.send_invite.bt = $('<a class="invite invite-' + lang + '" href="#"></a>').appendTo(_right)
				.click(function(){
				
					if(all_friends) 
						that._invite_friends();
					
					return false;
				});
			}
			
			that.conteneur = $('<div id="conteneur"></div>').appendTo(that.element);
			
			var menu = $('<div id="menu"></div>').appendTo(that.conteneur);
			
			var right = $('<a class="token" href="#"></a>').appendTo(menu)
			.click(function() {
				that._shop();
				return false;
			});
			
			$('<span class="plus"></span>').appendTo(right);
			$('<span class="ico"></span>').appendTo(right);
			that.options.tokens = $('<span class="text"></span>').appendTo(right);
			
			var ul = $('<ul></ul>').appendTo(menu);
			var li = $('<li></li>').appendTo(ul);
			
			$('<a href="#">' + $.options.lang[lang].home + '</a>').appendTo(li)
			.click(function(){
				
				if(that.menu.accueil) {
					
					that.socket.emit('Quit');
					
					$.start();
					return false;
				}
			});
			
			var li = $('<li></li>').appendTo(ul);
			$('<a href="#">' + $.options.lang[lang].play + '</a>').appendTo(li)
			.click(function(){
				
				if(that.menu.jouer) {
					
					that._init();
					return false;
				}
			});
			
			var li = $('<li></li>').appendTo(ul);
			
			that.ranking = $('<a href="#">' + $.options.lang[lang].ranking + '</a>').appendTo(li)
			.click(function(){
				
				if(that.menu.classement) {
					
					that.socket.emit('Quit');
					
					that._open_classement(0, true);
					return false;
				}
			});
			
			var li = $('<li></li>').appendTo(ul);
			
			$('<a href="#">' + $.options.lang[lang].invite + '</a>').appendTo(li)
			.click(function(){
			
				if(all_friends) 
					that._invite_friends();
				
				return false;
			});
			
			if(lang == 'ru') $('#menu ul li a').css('padding', '0 5px');
			
			that.contenu = $('<div class="contenu"></div>').appendTo(that.conteneur);
			var accueil = $('<div style="padding:0" id="accueil"></div>').appendTo(that.contenu);
			var profil = $('<div class="profil"></div>').appendTo(accueil);
			that.right = $('<div class="right"></div>').appendTo(profil);
			
			$('<button>' + $.options.lang[lang].create_game +'</button>').appendTo(that.right)
			.click(function(){
			
				if(that.tokens && that.tokens.ready) {
					
					if(that.tokens.data >= 1) {
									
						that._creer_partie();
					}
					else {
						
						that._no_tokens();
					}
				}
			});
			
			var menu = $('<ul class="menu_game"></ul>').appendTo(accueil);
			
			that.parties = $('<li></li>').appendTo(menu);
			
			that.defis = $('<li></li>').appendTo(menu);
			
			that.connected = $('<li></li>').appendTo(menu);
			
			that.friends = $('<li></li>').appendTo(menu);
			
			var image = $('<div class="left photo"></div>').appendTo(profil);
			$('<img src="https://graph.facebook.com/' + that.uid + '/picture">').appendTo(image);
			var name = $('<div style="padding-bottom:5px"></div>').appendTo(profil);
			
			$('<a href="#">' + that.name + '</a>').appendTo(name)
			.click(function () {
				
				that._open_profil(that.uid, that.name);
			});
			
			var div = $('<div></div>').appendTo(profil);
			var points = $('<span>' + $.options.lang[lang].points + ': </span>').appendTo(div);
			that.options.points = $('<span></span>').appendTo(div);
			
			var div = $('<div></div>').appendTo(profil);
			var classement = $('<span>' + $.options.lang[lang].ranking + ': </span>').appendTo(div);
			that.options.classement = $('<span></span>').appendTo(div);
			
			$('<div class="clear"></div>').appendTo(profil);
			
			var parties = $('<div id="parties"></div>').appendTo(accueil);
			that.list_parties = $('<table class="parties"></table>').appendTo(parties);
			
			var tchat = $('<div id="tchat"></div>').appendTo(accueil);
			that.tchat = $('<div class="tchat"></div>').appendTo(tchat);
			
			$('<textarea></textarea>').appendTo(tchat)
			.keydown(function(e) {
				if(e.keyCode == 13) {
					if($(this).val() != '') {
						
						that.socket.emit('EnvoyerMessage', $(this).val());
					}
					
					$(this).empty().val('');
					return false;
				}
			});
			
			if(that.socket.open) {
			
				that.socket.emit('InitUser');
			}
			
			if(that.options.trophy) {
				
				for(var i in that.options.trophy) {
					delete that.options.trophy[i];
					that._win_trophy(i);
				}
			}
			
		},
		
		_socket_onmessage: function (data) {
			
			var that = this;
			
			that.socket.on('connect', function () {
				that._connect();
			});
			
			that.socket.on('InfosUser', function (data) {
				that.socket.open = true;
				that._infos_user(data);
			});
			
			that.socket.on('ListerParties', function (data) {
				that._parties(data);
			});
			
			that.socket.on('Defis', function (data) {
				that._defis(data);
			});
			
			that.socket.on('NouvellePartie', function (jeu) {
				that._nouvelle_partie(jeu);
			});
			
			that.socket.on('ChargerPartie', function (data) {
				that._charger_partie(data);
			});
			
			that.socket.on('JeuTerminer', function (data) {
				that._jeu_terminer(data);
			});
			
			that.socket.on('ProposerNul', function (data) {
				that._reponse_nul(data);
			});
			
			that.socket.on('ListerMessages', function (data) {
				that._lister_messages(data);
			});
			
			that.socket.on('NouveauMessageJeu', function (data) {
				that._message_jeu(data);
			});
			
			that.socket.on('Profil', function (data) {
				that._profil(data.data, data.classement, data.points, data.uid, data.name);
			});
			
			that.socket.on('Connected', function (data) {
				that._connected(data);
			});
			
			that.socket.on('NbConnected', function (data) {
				that._nb_connected(data);
			});
			
			that.socket.on('disconnect', function () {
				top.location.href=redirectUri;
			});
			
			that.socket.on('Classement', function (data) {
				that._classement(data);
			});
			
			that.socket.on('trophy', function (data) {
				that.options.trophy[data] = true;
			});
		},
		
		_connect: function () {
			
			var that = this;
			
			FB.getLoginStatus(function(response) {
				
				if(!response.authResponse || !response.authResponse.userID || !response.authResponse.accessToken) {
					top.location.href=redirectUri;
				}
				
				that.socket.emit('create', {
					uid: response.authResponse.userID,
					accessToken: response.authResponse.accessToken,
					name: that.name, 
					parrainage:parrainage
				});
			});
		},
		
		_clock: function () {
			
			var that = this;
			
			if(that.clock) {
			
				var date = new Date();
				
				var hours = $._sprintf(date.getHours());
				
				hours += ':' + $._sprintf(date.getMinutes());
				
				
				$(that.clock).empty().text(hours);
			}
			
			setTimeout(function () { that._clock(); }, 1000);
			
		},
		
		_sound: function () {
			
			var that = this;
			
			if(!$('#audio #move')[0].play || !$('#audio #time')[0].play) return;
			
			if(that.options.sound == true) {
				$(that.bt_sound).removeClass('sound').addClass('no-sound');
				if($('#audio #move')[0]) $('#audio #move')[0].pause();
				if($('#audio #time')[0]) $('#audio #time')[0].pause();
				that.options.sound = false;
			}
			else {
				$(that.bt_sound).removeClass('no-sound').addClass('sound');
				that.options.sound = true;
			}
		},
		
		_invite_friends: function() {
			
			var that = this;
			
			if(that.options.send_invite.nb < 30) {
			
				var fade = $('#fade').css('display', 'block');
				var fenetre = $('<div class="fenetre invite" ></div>').appendTo(that.contenu);
			
				$('<div class="close"></div>').appendTo(fenetre)
				.click(function () {

					$('#fade').css('display', 'none');
					$('.fenetre').remove();

				});
			
				var image = $('<div class="photo"></div>').appendTo(fenetre);
				$('<img src="https://graph.facebook.com/' + that.uid + '/picture">').appendTo(image);
				
				$('<h3>' + $.options.lang[lang].invite_friends.title + '</h3>').appendTo(fenetre);
				
				$('<div class="clear"></div>').appendTo(fenetre);
				
				$('<div class="infos">' + $.options.lang[lang].invite_friends.infos + '</div>').appendTo(fenetre);
				
				
				var menu = $('<ul class="ul-invite"></ul>').appendTo(fenetre);
				
				that.checked = {
					nb:0,
					data:{}
				};
				
				that.invite_all = $('<div class="ct"></div>').appendTo(fenetre);
				that.invite_chess = $('<div class="ct"></div>').css('display', 'none').appendTo(fenetre);
				
				$('<button>' + $.options.lang[lang].invite_friends.send + '</button>').appendTo(fenetre)
				.click(function() {
					
					if(that.checked.data) {
						
						var data = "";
						
						that.options.send_invite.nb += that.checked.nb;
						
						for(var uid in that.checked.data) {
							that.options.send_invite.data.push(uid);
							data += uid + ',';
						}
						
						if(that.options.send_invite.nb >= 30) {
							$(that.options.send_invite.bt).remove();
						}
						
						$.sendInvite(data);
					}
					
					$('#fade').css('display', 'none');
					$('.fenetre').remove();
				});
				
				var div  = $('<div class="nb"></div>').appendTo(fenetre);
				
				that.ct_nb = $('<strong>' +that.options.send_invite.nb + '</strong>').appendTo(div);
				$('<span>/30</span>').appendTo(div);
				
				that._all_friends(false, that.invite_all);
				that._all_friends(true, that.invite_chess);
				
				var li = $('<li></li>').appendTo(menu);
				$('<a class="selected" href="#">' + $.options.lang[lang].invite_friends.all + '</a>').appendTo(li)
				.click(function() {
					$('.ul-invite li a').removeClass('selected').addClass('normal');
					$(this).removeClass('normal').addClass('selected');
					$(that.invite_chess).css('display', 'none');
					$(that.invite_all).css('display', 'block');
					return false;
				});
				
				var li = $('<li></li>').appendTo(menu);
				$('<a class="normal" href="#">' + $.options.lang[lang].title + '</a>').appendTo(li)
				.click(function() {
					$('.ul-invite li a').removeClass('selected').addClass('normal');
					$(this).removeClass('normal').addClass('selected');
					$(that.invite_all).css('display', 'none');
					$(that.invite_chess).css('display', 'block');
					return false;
				});
			}
		},
		
		_all_friends: function(bol, div) {
			
			var that = this;
			
			$(div).empty().html();
					
			that.table = $('<table></table>').appendTo(div);
			
			var _i = 0;
			
			for(var i in all_friends) {
			
				if(!bol && !all_friends[i].installed) {
					that._friend(all_friends[i], _i);
					_i++;
				}
				else if(bol && all_friends[i].installed) {
					that._friend(all_friends[i], _i);
					_i++;
				}
			}
		},
		
		_friend: function(data, i) {
			
			var that = this;
			
			if(i%2 == 0) 
				that.tr = $('<tr></tr>').appendTo(that.table);
			
			var td = $('<td class="check"></td>').appendTo(that.tr);
			
			var _class = "disable",
			checked = "checked",
			disabled = "disabled";
			
			if(!$._in_array(data.id, that.options.send_invite.data)){
				var _class = "checkable",
				checked = "",
				disabled = "";
			}
			
			$('<input type="checkbox" class="' + _class + '" ' + checked + '  ' + disabled + ' />').appendTo(td)
			.click(function() {
				
				var nb = that.options.send_invite.nb + that.checked.nb;
				
				if($(this).is(':checked')) {
					
					if(nb < 30) {
						
						that.checked.nb++;
						that.checked.data[data.id] = {};
						
						nb++;
						
						$(that.ct_nb).empty().text(nb);
					}
				}
				else {
					
					that.checked.nb--;
					delete that.checked.data[data.id];
					
					nb--;
					
					$(that.ct_nb).empty().text(nb);
					
					$('input.checkable:not(:checked)').removeAttr('disabled');
				}
				
				if(nb >= 30) {
					$('input.checkable:not(:checked)').attr("disabled", "disabled");
				}
				else {
					$('input.checkable:not(:checked)').removeAttr('disabled');
				}
			});
			
			var name = $('<td class="name">' + data.name + '</td>').appendTo(that.tr);
		},
		
		_trophy: function() {
			
			var that = this;
			
			var data_trophy = {};
			
			if(that.trophy.data) {
				
				for(var i in that.trophy.data) {
					data_trophy[that.trophy.data[i].badge] = true;
				}
			}
			
			var fade = $('#fade').css('display', 'block');
			var trophy = $('<div id="trophy" ></div>').appendTo(that.contenu);
			
			$('<div class="close"></div>').appendTo(trophy)
			.click(function () {

				$('#fade').css('display', 'none');
				$('#trophy').remove();

			});
			
			$('<h3>' + $.options.lang[lang].trophy.title + '</h3>').appendTo(trophy);
			
			for(var i in $.options.lang[lang].trophy.content) {
				
				if(data_trophy[i]) {
					var _class = $.options.lang[lang].trophy.content[i]._class;
				}
				else {
					var _class= "no-trophy";
				}
				
				$('<div class="trophy _' + i + ' ' + _class +'"></div>').appendTo(trophy);
				var desc = $('<div class="description description_' + i +'"></div>').appendTo(trophy);
				$('<h4>' + $.options.lang[lang].trophy.content[i].title + '</h4>').appendTo(desc);
				$('<p>' + $.options.lang[lang].trophy.content[i].description + '<p>').appendTo(desc);
			}
		},
		
		_win_trophy: function(data) {
			
			var that = this;
			
			var fade = $('#fade').css('display', 'block');
			var trophy = $('<div id="trophy" class="trophy' + data + '"></div>').css('background', 'url(../img/bg-win-trophee.png) no-repeat').appendTo(that.contenu);
			
			$('<div class="close"></div>').appendTo(trophy)
			.click(function () {

				$('#fade').css('display', 'none');
				$('.trophy' + data).remove();

			});
			
			$('<h3>' + $.options.lang[lang].congratulation  + '</h3>').appendTo(trophy);
			
			var div = $('<div class="center"></div>').appendTo(trophy);
			
			var _class = $.options.lang[lang].trophy.content[data]._class;
			
			$('<div class="trophy-win trophy ' + _class +'"></div>').appendTo(div);
			$('<div class="win">' + $.options.lang[lang].trophy.win  + '</div>').appendTo(div);
			$('<h4>' + $.options.lang[lang].trophy.content[data].title + '</h4>').appendTo(div);
			$('<p>' + $.options.lang[lang].trophy.content[data].description + '<p>').appendTo(div);
			
			var partage = $('<a class="partager" href="#">' + $.options.lang[lang].partager + '</a>').appendTo(trophy)
			.click(function() {
				
				$.partager_trophy(data);
				
				that._partager_trophee(data);
				
				return false;
			});
			
		},
		
		_partager_trophee: function(data) {
			
			var that = this;
			
			if(!that.options.partager[data]) {
				
				that.options.partager[data] = true;
				
				var partager = true;
				
				that.socket.emit('share_trophy');
				
				that.tokens.data += 3;
				
				$(that.options.tokens).empty().text(that.tokens.data);
			}
		},
		
		_no_tokens: function() {
			
			var that = this;
			
			var fade = $('#fade').css('display', 'block');
			var fenetre = $('<div class="fenetre" ></div>').appendTo(that.contenu);
			
			$('<div class="close"></div>').appendTo(fenetre)
			.click(function () {

				$('#fade').css('display', 'none');
				$('.fenetre').remove();

			});
			
			$('<h3>' + $.options.lang[lang].no_tokens  + '</h3>').appendTo(fenetre);
			
			var div = $('<div class="center"></div>').appendTo(fenetre);
			
			$('<button class="go-shop">' + $.options.lang[lang].buy_tokens  + '</button>').appendTo(div)
			.click(function() {
				$('#fade').css('display', 'none');
				$('.fenetre').remove();
				that._shop();
			});
			
			$('<button class="go-shop">' + $.options.lang[lang].free_tokens  + '</button>').appendTo(div)
			.click(function() {
				$('#fade').css('display', 'none');
				$('.fenetre').remove();
				that._shop('free');
			});
		},
		
		_shop: function(type) {
			
			var that = this;
			
			var fade = $('#fade').css('display', 'block');
			var shop = $('<div id="shop" ></div>').appendTo(that.contenu);
			
			$('<div class="close"></div>').appendTo(shop)
			.click(function () {

				$('#fade').css('display', 'none');
				$('#shop').remove();

			});
			
			$('<div class="infos"><img src="/img/token.png"/>= 1 ' + $.options.lang[lang].quick_game + '</div>').appendTo(shop);
			
			$('<h3>' + $.options.lang[lang].shop + '</h3>').appendTo(shop);
			
			var menu = $('<ul class="ul-shop"></ul>').appendTo(shop);
			
			that.shop = $('<div></div>').appendTo(shop);
			
			if(type == "free") {
				var buy = "normal",
				free = "selected";
				
				that._free_tokens();
			}
			else {
				var buy = "selected",
				free = "normal";
				
				that._buy_tokens();
			}
			
			var li = $('<li></li>').appendTo(menu);
			$('<a class="' + buy + '" href="#">' + $.options.lang[lang].tokens + '</a>').appendTo(li)
			.click(function() {
				$('.ul-shop li a').removeClass('selected').addClass('normal');
				$(this).removeClass('normal').addClass('selected');
				that._buy_tokens();
				return false;
			});
			
			var li = $('<li></li>').appendTo(menu);
			$('<a class="' + free + '" href="#">' + $.options.lang[lang].free_tokens + '</a>').appendTo(li)
			.click(function() {
				$('.ul-shop li a').removeClass('selected').addClass('normal');
				$(this).removeClass('normal').addClass('selected');
				that._free_tokens();
				return false;
			});
		},
		
		_buy_tokens: function() {
			
			var that = this;
			
			FB.api('/me?fields=currency', function(response) {
				
				if(response.currency) {
				
					$(that.shop).empty().html();
					
					that.table = $('<table class="token"></table>').appendTo(that.shop);
					
					var tokens = {
						1: {
							token:2000,
							base:500,
							price:that._convert_price(response, 10),
						},
						2: {
							token:1000,
							base:300,
							price:that._convert_price(response, 6)
						},
						3: {
							token:500,
							base:200,
							price:that._convert_price(response, 4)
						},
						4: {
							token:200,
							base:100,
							price:that._convert_price(response, 2)
						},
						5: {
							token:75,
							base:50,
							price:that._convert_price(response, 1)
						}				
					};
					
					for(var i in tokens)
						that._tokens(tokens[i], i);
					
					$('table.token tr:last').css('border-bottom', '0px');
				}
			});
		},
		
		_tokens: function(data, id) {
			
			var that = this;
			
			var tr = $('<tr></tr>').appendTo(that.table);
			
			$('<th class="token"></th>').appendTo(tr);
			var td = $('<th class="nb"><span class="total">' + data.token + '</span> ' + $.options.lang[lang].tokens + '<br/><span class="base">' + data.base + ' ' + $.options.lang[lang].tokens + '</span></th>').appendTo(tr);
			
			var td = $('<th class="button"></th>').appendTo(tr);
			$('<button>' + data.price + '</button>').appendTo(td)
			.click(function() {
				that._buy(data, id);
			});
		},
		
		_buy: function(token, id) {
		
			var that = this;
			
			FB.ui({
				method: 'pay',
				action: 'purchaseitem',
				product: 'http://apps.solutionsweb.pro/games/facebook/chess/tokens.php?pack=' + id + '&tokens=' + $.options.lang[lang].tokens + '&desc=' + $.options.lang[lang].buy_tokens,
				quantity: 1
			}, callback);
		
			function callback(data) {
			
				if(data.status == 'completed' && data.signed_request) {
					that.socket.emit('payment', {id:id, token:token.token, signed_request:data.signed_request});
				}
			}
		},
		
		_convert_price: function(data, price) {
			
			var that = this;
			
			var currency = that._currency(data.currency.user_currency),
				rate = data.currency.usd_exchange_inverse;

			var localPrice = Math.round((price * rate)*100)/100,
				localPrice = String(localPrice).split(".");
			
			var minorUnits = localPrice[1] ? localPrice[1].substr(0, 2) : '',
				majorUnits = localPrice[0] || "0",
				separator = (1.1).toLocaleString()[1];

			var displayPrice = currency + ' ' + String(majorUnits) +
				(minorUnits ? separator + minorUnits : '') + ' ' + data.currency.user_currency;
			
			return displayPrice;
		},
		
		_currency: function(currency) {
			
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
		
		_free_tokens: function() {
			
			var that = this;
			
			$(that.shop).empty().html();
			
			var div = $('<div class="center"></div>').appendTo(that.shop);
			
			$('<button class="sponsorpay"></button>').appendTo(div)
			.click(function() {
				that._sponsorpay();
			});
			
			$('<button class="tokenads"></button>').appendTo(div)
			.click(function() {
				that._tokenads();
			});
			
		},
		
		_sponsorpay: function() {
			
			var that = this;
			
			var fade = $('#fade').css('display', 'block');
			var sponsorpay = $('<div id="sponsorpay" ></div>').appendTo(that.contenu);
			
			$('<div class="close"></div>').appendTo(sponsorpay)
			.click(function () {

				$('#fade').css('display', 'none');
				$('#sponsorpay').remove();

			});
			
			$('<iframe src="https://iframe.sponsorpay.com/?appid=11841&uid=' + that.uid + '&currency=' + $.options.lang[lang].tokens + '&lang=' + lang + '&gender=' + (gender ? gender.substr(0, 1) : 'm') + '"></iframe>').appendTo(sponsorpay);
		},
		
		_tokenads: function() {
			
			var that = this;
			
			var fade = $('#fade').css('display', 'block');
			var sponsorpay = $('<div id="sponsorpay" ></div>').appendTo(that.contenu);
			
			$('<div class="close"></div>').appendTo(sponsorpay)
			.click(function () {

				$('#fade').css('display', 'none');
				$('#sponsorpay').remove();

			});
			
			$('<iframe frameborder="0" marginwidth="0" marginheight="0" scrolling="auto" width="600" height="600" src="https://offers.tokenads.com/show?client_id=' + that.uid + '&app_id=4561&dpl=top&width=600&fixed_height=600"></iframe>').appendTo(sponsorpay);
		},
		
		_creer_partie: function(uid) {
			
			var that = this;
			
			var fade = $('#fade').css('display', 'block');
			var fenetre = $('<div class="fenetre" style="height:200px"></div>').appendTo(that.contenu);
			
			$('<div class="close"></div>').appendTo(fenetre)
			.click(function () {

				$('#fade').css('display', 'none');
				$('.fenetre').remove();

			});
			
			var form = $('<div class="form"></div>').appendTo(fenetre);
			$('<label>' + $.options.lang[lang].time + '</label>').appendTo(form);
			var time = $('<select name="time"></select>').appendTo(form);
			var array_time = [300, 600, 1200, 3600, 5400];

			for (var i in array_time) {
				var minute = array_time[i] / 60;
				$('<option value="' + array_time[i] + '">' + minute + ' ' + $.options.lang[lang].minutes + '</option>').appendTo(time);
			}
			
			var form = $('<div style="top:-10px" class="form"></div>').appendTo(fenetre);
			$('<label>' + $.options.lang[lang].color + '</label>').appendTo(form);
			var color = $('<select name="color"></select>').appendTo(form);
			var array_color = ["blanc", "noir"];

			for (var i in array_color) {
				$('<option value="' + array_color[i] + '">' + $.options.lang[lang][array_color[i]] + '</option>').appendTo(color);
			}
			
			if(!uid) {
				
				var array_points_min = [0, 1300, 1400, 1500, 1600, 1700, 1800];
				var array_points_max = [0, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500];
				
				var form = $('<div class="form"></div>').appendTo(fenetre);
				$('<label>' + $.options.lang[lang].points + '</label>').appendTo(form);
				
				var points_min = $('<select name="points_min"></select>').appendTo(form)
				.change(function() {
					$(points_max).empty().html();
					
					$('<option value="0">' + $.options.lang[lang].max + '</option>').appendTo(points_max);
				
					for (var i in array_points_max) {
						if(array_points_max[i] > $(this).val()) $('<option value="' + array_points_max[i] + '">' + array_points_max[i] + '</option>').appendTo(points_max);
					}
				});
				
				$('<option value="0">' + $.options.lang[lang].min + '</option>').appendTo(points_min);
				
				for (var i in array_points_min) {
					if(array_points_min[i] != 0) $('<option value="' + array_points_min[i] + '">' + array_points_min[i] + '</option>').appendTo(points_min);
				}
				
				var points_max = $('<select name="points_max"></select>').appendTo(form);
				
				$('<option value="0">' + $.options.lang[lang].max + '</option>').appendTo(points_max);
				
				for (var i in array_points_max) {
					if(array_points_max[i] != 0) $('<option value="' + array_points_max[i] + '">' + array_points_max[i] + '</option>').appendTo(points_max);
				}
			}
			
			var form = $('<div class="form center"></div>').appendTo(fenetre);
					
			if(uid) {
				$('<button>' + $.options.lang[lang].defier +'</button>').appendTo(form)
				.click(function(){
					
					var _color = $(color).val(),
						_time = $(time).val();
						
					if($._in_array(_time , array_time) && $._in_array(_color , array_color)) {
						
						that.socket.emit('Defis', { uid:uid, color:_color, time:_time });
					
						$('#fade').css('display', 'none');
						$('.fenetre').remove();
					}
				});
			}
			else {
				
				$('<button>' + $.options.lang[lang].create_game +'</button>').appendTo(form)
				.click(function(){
					
					var _color = $(color).val(),
						_time = $(time).val(),
						_points_max = $(points_max).val(),
						_points_min = $(points_min).val();
						
					if($._in_array(_time , array_time) && $._in_array(_color , array_color) && $._in_array(_points_min , array_points_min) && $._in_array(_points_max , array_points_max)) {
						that.socket.emit('CreerPartie', { color:_color, time:_time, points_min:_points_min, points_max:_points_max });
						
						$('#fade').css('display', 'none');
						$('.fenetre').remove();
					}
				});
			}
		},
		
		_change_menu_game: function(menu, menu_game) {
		
			var that = this;
			
			that.menu_game = menu_game;
			$('ul.menu_game li a').removeClass('selected').addClass('normal');
			$(menu).removeClass('normal').addClass('selected');
		},
		
		_parties: function(data) {
			
			var that = this,
				_class="normal",
				nbParties = 0;
			
			if(that.menu_game == "parties") {
				that._lister(data.parties, "parties");
				var _class="selected";
			}
			
			$(that.parties).empty();
			
			for(var uid in data.parties) {
				var partie = data.parties[uid];
				if(that.uid == uid || (partie.points_min <= that.points && (partie.points_max == 0 || partie.points_max >= that.points))) nbParties++;
			}
			
			$('<a class="' + _class + '" href="#"><span>' + nbParties + ' ' + $.options.lang[lang].quick_game + '</span></a>').appendTo(that.parties)
			.click(function() {
				that._change_menu_game(this, "parties");
				that._lister(data.parties, "parties");
				return false;
			});
		},
		
		_defis: function(data) {
			
			var that = this;
			
			var _class="normal";
			
			that.all_defis = data.defis;
			that.nb_defis = data.nb;
			
			if(that.menu_game == "connected")
				that._lister(that.all_connected, "connected");
			
			if(that.menu_game == "defis") {
				that._lister(data.defis, "defis");
				var _class="selected";
			}
			
			$(that.defis).empty();
			$('<a class="'+ _class +'" href="#"><span>' + data.nb + ' ' + $.options.lang[lang].defi + '</span><span class="down"><span class="triangle"></span></span></a>').appendTo(that.defis)
			.click(function() {
				that._change_menu_game(this, "defis");
				that._lister(data.defis, "defis");
				return false;
			});
		},
		
		_nb_connected: function(data) {
			
			var that = this;
			
			$(that.nb_connect).empty().text(data + ' ' + $.options.lang[lang].connected);
			
			if(lang == 'ru') $(that.nb_connect).css('font-size', '0.8em');
		},
		
		_connected: function(data) {
			
			var that = this;
			
			var _class="normal";
			
			that.all_connected = data.user;
			
			var _data = {
				nb:0,
				user: {}
			};
			
			if(that.menu_game == "connected") {
				
				$(that.list_parties).empty().html();
				var _class="selected";
			}
			
			var i = 0;
			
			for(var uid in data.user){
				
				if(that.uid != uid) {
					
					if(that.menu_game == "connected") {
						that._afficher("connected", i, uid, data.user[uid]);
						i++;
					}
					
					if(friends.object[uid]) {
						_data.nb++;
						_data.user[uid] = data.user[uid];
					}
				}
			}
			
			$(that.connected).empty();
			$('<a class="' + _class + ' connected" href="#"><span>' + data.nb + ' ' + $.options.lang[lang].challengers + '</span></a>').appendTo(that.connected)
			.click(function() {
				that._change_menu_game(this, "connected");
				that._lister(data.user, "connected");
				return false;
			});
			
			var _class="normal";
			
			if(that.menu_game == "friends") {
				that._lister(_data.user, "friends");
				var _class="selected";
			}
			
			$(that.friends).empty();
			
			if(_data.nb > 0) {
			
				$('<a class="' + _class + ' connected" href="#"><span>' + _data.nb + ' ' + $.options.lang[lang].friends + '</span></a>').appendTo(that.friends)
				.click(function() {
					that._change_menu_game(this, "friends");
					that._friends(_data);
					return false;
				});
			}
		},
		
		_friends: function(data) {
			
			var that = this;
			
			var _class = "normal";
			
			that.all_friends = data.user;
			
			if(that.menu_game == "friends") {
				that._lister(data.user, "friends");
				var _class="selected";
			}
			
			$(that.friends).empty();
			$('<a class="' + _class + ' connected" href="#"><span>' + data.nb + ' ' + $.options.lang[lang].friends + '</span></a>').appendTo(that.friends)
			.click(function() {
				that._change_menu_game(this, "friends");
				that._lister(data.user, "friends");
				return false;
			});
		},
		
		_lister: function(data, type) {
			
			var that = this;
			
			$(that.list_parties).empty().html();
			
			var i = 0;
			
			for(var uid in data){
				
				if(that.uid != uid || type != "connected") {
					that._afficher(type, i, uid, data[uid]);
					i++;
				}
			}
		},
		
		_afficher: function(type, i, uid, data) {
		
			var that = this;
			
			if(type == "parties" && that.uid != uid) {
					
				if(data.points_min > that.points) return false;
				
				if(data.points_max != 0 && data.points_max < that.points) return false;
			}
			
			if($('.parties tr:last').attr('class') == 'bg-gris') {
				var tr = $('<tr class="bg-brun"></tr>').appendTo(that.list_parties);
			}
			else {
				var tr = $('<tr class="bg-gris"></tr>').appendTo(that.list_parties);
			}
			
			$('<td class="images"><img src="https://graph.facebook.com/' + uid + '/picture"/></td>').appendTo(tr)
			.click(function () {
				that._open_profil(uid, data.name);
			});
			
			var nom = $('<td class="nom"></td>').appendTo(tr);
			
			$('<a href="#">' + data.name + '</a>').appendTo(nom)
			.click(function () {
				that._open_profil(uid, data.name);
			});
			
			$('<div><span style="font-weight:normal">' + $.options.lang[lang].points + ': </span>' + data.points + '</div>').appendTo(nom);
			$('<div><span style="font-weight:normal">' + $.options.lang[lang].ranking + ': </span>' + data.classement + '</div>').appendTo(nom);
			
			switch(type) {
				
				case "parties" :
					
					$('<td class="color">' + $.options.lang[lang][data.color] + '</td>').appendTo(tr);
					
					var minute = data.time / 60;
					$('<td class="time">' + minute + ':00</td>').appendTo(tr);
					var play = $('<td class="play"></td>').appendTo(tr);
					
					if(that.uid != uid){
					
						$('<button>' + $.options.lang[lang].play + '</button>').appendTo(play)
						.click(function(){
							
							if(that.tokens && that.tokens.ready) {
								
								if(that.tokens.data >= 1) {
									that.socket.emit('NouvellePartie', uid);
								}
								else {
										
									that._no_tokens();
								}
							}
						});
					}
					else {
						
						$('<button>' + $.options.lang[lang].cancel + '</button>').appendTo(play)
						.click(function(){
				
							that.socket.emit('AnnulerPartie');
						});
					}
					
				break;
					
				case "defis":
				
					$('<td class="color">' + $.options.lang[lang][data.color] + '</td>').appendTo(tr);
			
					var minute = data.time / 60;
					$('<td class="time">' + minute + ':00</td>').appendTo(tr);
					
					var play = $('<td class="play"></td>').appendTo(tr);
					
					if(data.type == "reponse") {
						$('<button>' + $.options.lang[lang].play + '</button>').appendTo(play)
						.click(function(){
							
							if(that.tokens && that.tokens.ready) {
								
								if(that.tokens.data >= 1) {
									
									that.socket.emit('NouvellePartieDefi', uid);
								}
								else {
										
									that._no_tokens();
								}
							}
						});
					}
					
					var close = $('<td class="close"></td>').appendTo(tr);
					$('<a href="#" class="close"></a>').appendTo(close)
					.click(function(){
						that.socket.emit('AnnulerDefi', uid);
					});	
					
				break;
					
				case "connected":
				case "friends":
				
					$('<td colspan="2"></td>').appendTo(tr);
			
					var play = $('<td style="width:150px" class="play"></td>').appendTo(tr);
					
					if(that.nb_defis < 5) {
						
						if(that.uid != uid && !that.all_defis[uid]){
						
							$('<button>' + $.options.lang[lang].defier + '</button>').appendTo(play)
							.click(function(){
							
								if(that.tokens && that.tokens.ready) {
									
									if(that.tokens.data >= 1) {
								
										that._creer_partie(uid);
									}
									else {
										
										that._no_tokens();
									}
								}
							});
						}
					}
					
				break;
			}
		},
		
		_infos_user: function(data) {
			
			var that = this;
			
			var token = parseInt(data.tokens);
			
			that.moderateur = data.moderateur;
			
			that.tokens = {
				ready:true,
				data:token
			};
			
			that.trophy = {
				ready:true,
				data:data.trophy
			};
			
			that.points = data.points;
			
			$(that.options.points).empty().append('<strong>' + data.points + '</strong>');
			$(that.options.classement).empty().append('<strong>' + data.classement + '</strong>');
			$(that.options.tokens).empty().text(token);
			
			that.free_time = data.free;
		},
		
		_free:function() {
			
			var that = this;
			
			if(that.free_time > 0) {
				
				var time = (3600*24) - (Math.round(new Date().getTime() / 1000) - that.free_time);
				
				if(time > 0) {
					
					var heure = Math.floor(time/3600);
					
					time -= (heure*3600);
					
					var minute = Math.floor(time / 60);
					var seconde = Math.floor(time - (minute * 60));
					
					$(that.free_h).empty().text($._sprintf(heure));
					$(that.free_m).empty().text($._sprintf(minute));
					$(that.free_s).empty().text($._sprintf(seconde));
				}
				else {
					that.socket.emit('InitUser');
				}
			}
			
			setTimeout(function () { that._free(); }, 1000);
		},
		
		_open_profil: function(uid, name) {
			
			var that = this;
			
			if(!that.profil) {
				
				that.profil = true;
				that.socket.emit('Profil', uid, name);
			}
		},
		
		_profil: function(data, classement, points, uid, name) {
			
			var that = this;
			
			$('#fade').css('display', 'block');
			var fenetre = $('<div style="height:180px;width:300px;top:160px;left:80px" class="fenetre"></div>').appendTo('.contenu');
			
			$('<div class="close"></div>').appendTo(fenetre)
			.click(function () {
				that.profil = false;
				$('#fade').css('display', 'none');
				$('.fenetre').remove();
			});
			
			var div = $('<div class="stats_joueur"></div>').appendTo(fenetre);
			$("<div class='left'><img src='https://graph.facebook.com/" + uid + "/picture'></div>").appendTo(div);
			
			var div = $('<div class="ct-stats"></div>').appendTo(div);
			$("<div class='name-stats'><strong> " + name + "</strong></div>").appendTo(div);
			$("<div><label>" + $.options.lang[lang].ranking + "</label> : <strong>" + classement + "</strong></div>").appendTo(div);
			$("<div><label>" + $.options.lang[lang].points + "</label> : <strong>" + points + "</strong></div>").appendTo(div);
			$("<div><label>" + $.options.lang[lang].game + "</label> : <strong>" + data.games + "</strong></div>").appendTo(div);
			$("<div><label>" + $.options.lang[lang].win + "</label> : <strong>" + data.win + "</strong></div>").appendTo(div);
			$("<div><label>" + $.options.lang[lang].draw + "</label> : <strong>" + data.draw + "</strong></div>").appendTo(div);
			$("<div><label>" + $.options.lang[lang].lose + "</label> : <strong>" + (data.games - (parseInt(data.win) + parseInt(data.draw))) + "</strong></div>").appendTo(div);
			
			return false;
		
		},
		
		_lister_messages: function(data) {
		
			var that = this;
			
			$(that.tchat).empty().html();
			for(var id in data){
				that._message(id, data[id]);
			}
		},
		
		_message: function(id, data) {
			
			var that = this;
			
			var date;
			
			if(data.message){
			
				var div = $('<div class="ct"></div>').prependTo(that.tchat);
				
				if(data.uid == that.uid || that.moderateur) {
					
					var button = $('<div class="close uiCloseButton"></div>').appendTo(div).css('display', 'none')
					.click(function() {
						
						$(div).remove();
						
						that.socket.emit('SupprimerMessage', id);
						
						return false;
						
					});
					
					$(div).mouseover(function() {
						$(button).css('display', 'block');
					}).mouseout(function() {
						$(button).css('display', 'none');
					});
				}
				
				var date = new Date(data.time);
				var date = date.toLocaleString();
				var img = $('<div class="image"></div>').appendTo(div);
				$('<img style="width:25px" src="https://graph.facebook.com/' + data.uid + '/picture">').appendTo(img)
				.click(function () {
					that._open_profil(data.uid, data.name);
				});
				
				var mg = $('<div class="mg"></div>').appendTo(div);
				$('<a href="#">' + data.name + '</a> ').appendTo(mg)
				.click(function () {
					that._open_profil(data.uid, data.name);
				});
				
				var message = $('<span></span>').appendTo(mg);
				$(message).empty().text(' ' + data.message);
				
				$('<br/><span class="date">' + date + '</span>').appendTo(mg);
				$('<div class="clear"></div>').appendTo(div);
			}
		},
		
		_nouvelle_partie: function (jeu) {

			var that = this;
			
			that._50_coup = 0;
			
			that.menu = {
				accueil:false,
				joueur:false,
				classement:false
			};
			
			that.profil = false;
			
			$('#fade').css('display', 'none');
			
			$(that.conteneur).css("height", "680px");
			
			$(that.contenu).empty().html();
				
			that.proposer_nul = 0;
			that.jeu = jeu;
			
			if (that.uid == that.jeu.blanc.uid) {

				var couleur1 = 'noir';
				var couleur2 = 'blanc';
			}
			else if(that.uid == that.jeu.noir.uid) {

				var couleur2 = 'noir';
				var couleur1 = 'blanc';
			}
			
			$('#right').empty().html();
			
			var pieces = $('<div class="pieces"></div>').appendTo('#right');
			
			that.options[couleur1].pieces = $('<div class="' + couleur2 + '"></div>').appendTo(pieces);
			
			that.options[couleur2].pieces = $('<div class="' + couleur1 + '"></div>').css('margin-top', '5px').appendTo(pieces);
			
			var div = $('<div class="profil_jeu"></div>').appendTo(that.contenu);

			that.options[couleur1].img = $('<div class="left"></div>').appendTo(div);
			$('<img style="width:50px" src="https://graph.facebook.com/' + that.jeu[couleur1].uid + '/picture" />').appendTo(that.options[couleur1].img);
			
			var profil_1 = {
				uid:that.jeu[couleur1].uid,
				name:that.jeu[couleur1].name
			};
			
			var nom = $('<div class="nom"></div>').appendTo(div);
			that.options[couleur1].nom = $('<a href="#">' + that.jeu[couleur1].name + '</a>').appendTo(nom)
			.click(function () {
				that._open_profil(profil_1.uid, profil_1.name);
			});

			var time = that.jeu[couleur1].time;
			var time = that._time(time);
			that.options[couleur1].decompte = $('<div class="decompte">' + time + '</div>').appendTo(div);
			var time_tour = that.jeu[couleur1].time_tour;

			if(that.jeu.tour == couleur1){
				var time_tour = that._time(time_tour);
			}
			else{
				var time_tour = "";
			}
			
			that.options[couleur1].decompte_tour = $('<div class="decompte_tour">' + time_tour + '</div>').appendTo(div);
			
			var coup = $('<div id="coup"></div>').appendTo(that.contenu);
			that.options[couleur1].coup = $('<div class="coup"></div>').appendTo(coup);
			that.options[couleur2].coup = $('<div class="coup"></div>').appendTo(coup);
			
			var jeu = $('<div id="jeu_' + couleur2 + '"></div>').appendTo(that.contenu);
			var arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

			for (var a in arr) {
				for (var i = 1; i < 9; i++) {

					var pos = arr[a] + i;
					that._case[pos] = $('<div id="' + pos + '" class="case ' + arr[a] + ' _' + i + '"></div>').appendTo(jeu);

					if (that.jeu.position[pos]) {
						that._jeu(pos, that.jeu.position[pos]);
					}
				}
			}

			var div = $('<div class="profil_jeu"></div>').appendTo(that.contenu);
			
			that.options[couleur2].img = $('<div class="left"></div>').appendTo(div);
			$('<img style="width:50px" src="https://graph.facebook.com/' + that.jeu[couleur2].uid + '/picture" />').appendTo(that.options[couleur2].img);
			
			var profil_2 = {
				uid:that.jeu[couleur2].uid,
				name:that.jeu[couleur2].name
			};
			
			var nom = $('<div class="nom"></div>').appendTo(div);
			that.options[couleur2].nom = $('<a href="#">' + that.jeu[couleur2].name + '</a>').appendTo(nom)
			.click(function () {
				that._open_profil(profil_2.uid, profil_2.name);
			});
			
			var bt = $('<div class="bt"></div>').appendTo(div);
			
			var offer_draw = $.options.lang[lang].offer_draw;
			$('<div><input type="button" value="' + offer_draw + '" />').appendTo(bt)
			.click(function () {
				that._proposer_nul();
			});

			var resign = $.options.lang[lang].resign;
			$('<div><input type="button" value="' + resign + '" />').appendTo(bt)
			.click(function () {
				that._abandonner();
			});
			
			var time = that.jeu[couleur2].time;
			var time = that._time(time);
			that.options[couleur2].decompte = $('<div class="decompte">' + time + '</div>').appendTo(div);
			var time_tour = that.jeu[couleur2].time_tour;

			if(that.jeu.tour == couleur2){
				var time_tour = that._time(time_tour);
			}
			else{
				var time_tour = "";
			}
			
			that.options[couleur2].decompte_tour = $('<div class="decompte_tour">' + time_tour + '</div>').appendTo(div);
			
			var tchat = $('<div style="margin-top:10px" id="tchat"></div>').appendTo(div);
			that.tchat_jeu = $('<div class="tchat"></div>').appendTo(tchat);
			
			var _id_jeu = that.jeu.id;
			
			$('<textarea></textarea>').appendTo(tchat)
			.keydown(function(e) {
				if(e.keyCode == 13) {
					if($(this).val() != '') {
						
						that._nouveau_message_jeu(that.name, $(this).val());
						
						that.socket.emit('EnvoyerMessageJeu', { id:_id_jeu, message:$(this).val()});
					}
					
					$(this).empty().val('');
					
					return false;
				}
			});
			
			$(that.options[that.jeu.tour].nom).css('color', '#930');
        },
		
		_message_jeu: function(data) {
				
			var that = this;
			
			if(that.jeu) {
			
				var uid = 0;
				
				if (that.uid == that.jeu.blanc.uid) {
					uid = that.jeu.noir.uid;
				}
				else if(that.uid == that.jeu.noir.uid) {
					uid = that.jeu.blanc.uid;
				}
				
				if(data.uid == uid) {
					that._nouveau_message_jeu(data.name, data.message);
				}
			}
		},
		
		_nouveau_message_jeu: function(name, message) {
			
			var that = this;
			
			var div = $('<div style="line-height:1.8em" class="ct"></div>').prependTo(that.tchat_jeu);
			var mg = $('<div class="mg"><strong>' + name + '</strong>: </div>').appendTo(div);
			var msg = $('<span></span>').appendTo(mg);
			$(msg).empty().text(message);
			$('<div class="clear"></div>').appendTo(div);
		},
		
		_charger_partie: function(data) {
			
			var that = this;
			
			if(that.jeu) {
				
				var uid = 0;
				
				if (that.uid == that.jeu.blanc.uid) {
					uid = that.jeu.noir.uid;
				}
				else if(that.uid == that.jeu.noir.uid) {
					uid = that.jeu.blanc.uid;
				}
				
				if(uid && data.uid == uid) {
				
					that.jeu.blanc.time = data.jeu.blanc;
					that.jeu.noir.time = data.jeu.noir;
					
					that._move(data.pion, data.depart, data.arriver, data.mouvement, data.promotion);
				}
			}
		},
		
		_jeu: function (position, pion) {

            var that = this;

            _pion = $('<div class="piece ' + pion.nom + '_' + pion.couleur + '"></div>');
            $(that._case[position]).empty().append(_pion);


            if (that.jeu[that.jeu.tour].uid == that.uid) {

                if (pion.couleur == that.jeu.tour) {

                    if (pion.deplacement || pion.capture) {
                        _pion.draggable({
                            helper: 'clone',
                            zIndex: '99999',
                            start: function (event, ui) {
                                var deplace = pion.deplacement.split(".");
                                for (var d in deplace) {
                                    var i = deplace[d];
                                    if (i) {
                                       that._deplace(position, i, pion);
									}
                                }

                                var capture = pion.capture.split(".");
                                for (var d in capture) {
                                    var i = capture[d];
                                    if (i) {
                                       that._capture(position, i, pion);
									}
                                }
                            },
                            stop: function (event, ui) {
                                var deplace = pion.deplacement.split(".");
                                for (var d in deplace) {
                                    var i = deplace[d];
                                    if (i) { that._case[i].droppable("destroy"); }
                                }

                                var capture = pion.capture.split(".");
                                for (var d in capture) {
                                    var i = capture[d];
                                    if (i) { that._case[i].droppable("destroy"); }
                                }
                            }
                        });
                    }
                }
            }
        },

        _deplace: function (depart, arriver, pion) {

            var that = this;

            that._case[arriver].droppable({

                drop: function (event, ui) {

                    $('.piece').draggable("disable").removeClass('ui-draggable');

                    $(this).append(ui.draggable);

                    that._move(pion, depart, arriver, 'deplace', false);
                }
            });
        },
		
		_capture: function (depart, arriver, pion) {

            var that = this;

            that._case[arriver].droppable({

                drop: function (event, ui) {
				
					$('.piece').draggable("disable").removeClass('ui-draggable');
					
					$(this).empty().append(ui.draggable);

                    that._move(pion, depart, arriver, 'capture', false);
                }
            });
        },

        _prise_passant: function (arriver) {

            var that = this;
			
			var pion = "";

            lettre = arriver.substr(0, 1);
            chiffre = arriver.substr(-1);

            switch (chiffre) {
                case '3':
                    $(that._case[lettre + '4']).empty().html();
					
					pion = that.jeu.position[lettre + '4'].nom;

                    delete that.jeu.position[lettre + '4'];

                    break;

                case '6':
                    $(that._case[lettre + '5']).empty().html();
					
					pion = that.jeu.position[lettre + '5'].nom;

                    delete that.jeu.position[lettre + '5'];

                    break;

            }
			
			return pion;
        },
		
        _promotion: function (nom, pion, depart, arriver, mouvement) {

            var that = this;

            $('<div class="piece ' + nom + '_' + pion.couleur + '"></div>').appendTo(that.fenetre)
            .click(function () {

                $('#fade').css('display', 'none');
                $('#fenetre_piece').remove();
                $('#' + arriver).empty().append(this);

                that.jeu.position[arriver].nom = nom;

                that._charge(depart, arriver, pion, mouvement, nom);
            });
        },

        _move: function (pion, depart, arriver, mouvement, promotion) {

            var that = this;
			
			if(that.options.sound && $('#audio #move')[0]) $('#audio #move')[0].play();
			
			if(mouvement == "deplace") {
				
				var extension = "";
				var signe = " ";

				if (pion.nom == 'roi' && pion.move == 0) {

					reg = new RegExp('^(c1|g1|c8|g8)$');

					if (reg.test(arriver)) {

						lettre = arriver.substr(0, 1);
						chiffre = arriver.substr(-1);

						switch (lettre) {
							case 'c':

								$(that._case['d' + chiffre]).append($(that._case['a' + chiffre]).children());
								$(that._case['a' + chiffre]).empty().html();

								that.jeu.position['d' + chiffre] = {
									nom: that.jeu.position['a' + chiffre].nom,
									couleur: that.jeu.position['a' + chiffre].couleur,
									deplacement: '',
									capture: '',
									move: 1
								}

								delete that.jeu.position['a' + chiffre];

								extension = ' 0-0-0';

								break;

							case 'g':

								$(that._case['f' + chiffre]).append($(that._case['h' + chiffre]).children());
								$(that._case['h' + chiffre]).empty().html();

								that.jeu.position['f' + chiffre] = {
									nom: that.jeu.position['h' + chiffre].nom,
									couleur: that.jeu.position['h' + chiffre].couleur,
									deplacement: '',
									capture: '',
									move: 1
								}

								delete that.jeu.position['h' + chiffre];

								extension = ' 0-0';

								break;

						}
					}
				}
			}
			else if(mouvement == "capture") {
			
				var extension = "",
				signe = "x",
				piece = "";

				if (!that.jeu.position[arriver]) {

					piece = that._prise_passant(arriver);

					extension = ' e.p.';
					
					var piece_capture = "pion"
				}
				else {
					
					piece = that.jeu.position[arriver].nom;
				}
					

				if (pion.couleur == "blanc") {

					that.jeu.noir.pieces = that.jeu.noir.pieces - 1;
					
					$(that.options.noir.pieces).append('<div class="piece ' + piece + '"></div>');
				}
				else {
					
					that.jeu.blanc.pieces = that.jeu.blanc.pieces - 1;
					
					$(that.options.blanc.pieces).append('<div class="piece ' + piece + '"></div>');
				}
			}

            that.position_en_passant = [];
			
			if (that.jeu.position[depart].nom == 'pion') {

				if (that.jeu.position[depart].move == 0) {

                    if (that.jeu.position[depart].couleur == 'blanc') {

                        var _prise = 3;
                        var _arriver = 4;
                    }
                    else {

                        var _prise = 6;
                        var _arriver = 5;
                    }

                    that.chiffre = arriver.substr(-1);

                    if (that.chiffre == _arriver) {

                        var lettre = arriver.substr(0, 1);

                        that.prise_en_passant = lettre + _prise;

                        var lettre = that._lettre_chiffre(lettre);

                        that.lettre = lettre + 1;

                        if (that._verif_position()) {

                            that.position_en_passant.push(that._position());
                        }

                        that.lettre = lettre - 1;

                        if (that._verif_position()) {

                            that.position_en_passant.push(that._position());
                        }
                    }
                }
            }

            delete that.jeu.position[depart];

            that.jeu.position[arriver] = {
                nom: pion.nom,
                couleur: pion.couleur,
                deplacement: '',
                capture: '',
                move: 1
            }

            if (pion.nom == "roi") {

                that.jeu[pion.couleur].roi.position = arriver;
            }
			
			if(pion.nom == "pion" || mouvement == "capture") {
				that._50_coup = 0;
			}
			else {
				that._50_coup ++;
			}
			
			$('.case').css('background', "");
			
			$(that._case[depart]).css('background', '#930');
			$(that._case[arriver]).css('background', '#930');
			
			$(that.options[that.jeu.tour].coup).prepend('<div>' + depart + signe + arriver + extension + '</div>');

            if (pion.nom == 'pion' && arriver.substr(-1) == 1 || pion.nom == 'pion' && arriver.substr(-1) == 8) {

				if(that.jeu[that.jeu.tour].uid == that.uid) {
					
					$('#fade').css('display', 'block');

					that.fenetre = $('<div id="fenetre_piece"></div>').appendTo('#conteneur');

					var arr = ['reine', 'tour', 'fou', 'cavalier'];

					for (var i in arr) {

						that._promotion(arr[i], pion, depart, arriver, mouvement);
					}
				}
				else {
					
					that.jeu.position[arriver].nom = promotion;
					that._charge(depart, arriver, pion, mouvement, false);
				}
			}
			else {
			
				that._charge(depart, arriver, pion, mouvement, false);
			}
        },
		
		_charge: function (depart, arriver, pion, mouvement, promotion) {

            var that = this;
			
			if(that.jeu[that.jeu.tour].uid == that.uid) {
			
				if(that.jeu.time == 5400) {
					that.jeu[that.jeu.tour].time += 30;
				}
				
				that.socket.emit('ChargerPartie', {
					id:that.jeu.id,
					mouvement: mouvement,
					depart: depart,
					arriver: arriver,
					pion: pion,
					promotion: promotion,
					blanc: that.jeu.blanc.time,
					noir: that.jeu.noir.time
				});
			}
			else {
				$(that._case[depart]).empty().html();
				var _pion = $('<div class="piece ' + pion.nom + '_' + pion.couleur + '"></div>');
				$(that._case[arriver]).empty().append(_pion);
			}
			
			if(that.jeu[that.jeu.tour].time > that.jeu[that.jeu.tour].time_tour) {
				that.jeu[that.jeu.tour].time_tour = that.jeu.time_tour;
			}
			else {
				that.jeu[that.jeu.tour].time_tour = that.jeu[that.jeu.tour].time;
			}

            if (that.jeu.tour == 'blanc') {

                that.jeu.tour = 'noir';
            }
            else {

                that.jeu.tour = 'blanc';
            }

            that.jeu.blanc.roi.deplacement_interdit = [];
            that.jeu.noir.roi.deplacement_interdit = [];

            that.roi_echec = false;
            that.roi_echec_deplacement = false;

            var couleur = ["blanc", "noir"];

            for (var i in couleur) {

                that.pion_position = that.jeu[couleur[i]].roi.position;
                that.pion_couleur = couleur[i];

                var lettre = parseInt(that._lettre_chiffre(that.pion_position.substr(0, 1)));
                var chiffre = parseInt(that.pion_position.substr(-1));

                that.lettre = lettre;
                that.chiffre = chiffre + 1;
                var fonction = that._verif_roi_interdit();

                that.chiffre = chiffre - 1;
                var fonction = that._verif_roi_interdit();

                that.lettre = lettre - 1;
                var fonction = that._verif_roi_interdit();

                that.chiffre = chiffre + 1;
                var fonction = that._verif_roi_interdit();

                that.lettre = lettre + 1;
                var fonction = that._verif_roi_interdit();

                that.chiffre = chiffre - 1;
                var fonction = that._verif_roi_interdit();

                that.chiffre = chiffre;
                var fonction = that._verif_roi_interdit();

                that.lettre = lettre - 1;
                var fonction = that._verif_roi_interdit();

            }

            for (var i in that.jeu.position) {

                var pion = that.jeu.position[i];

                if (that.jeu.tour == pion.couleur && pion.nom != "roi") {

                    if (that.jeu[pion.couleur].pieces < 3) {

                        that.options[pion.couleur].piece_reste = {

                            nom: pion.nom,
                            position: i
                        }
                    }

                    that.pion_position = i;
                    that.pion_nom = pion.nom;
                    that.pion_couleur = pion.couleur;
                    that.pion_deplacement = pion.deplacement;
                    that.pion_move = pion.move;

                    var fonction = that._deplacement();

                    var deplacement = "";
                    var capture = "";

                    if (that.deplacement.length > 0) {

                        deplacement = that.deplacement.join('.');
                    }

                    if (that.capture.length > 0) {

                        capture = that.capture.join('.');
                    }


                    that.jeu.position[i].deplacement = deplacement;
                    that.jeu.position[i].capture = capture;

                }
            }

            for (var i in that.jeu.position) {

                var pion = that.jeu.position[i];

                if (that.jeu.tour != pion.couleur && pion.nom != "roi") {

                    if (that.jeu[pion.couleur].pieces < 3) {

                        that.options[pion.couleur].piece_reste = {

                            nom: pion.nom,
                            position: i
                        }
                    }

                    that.pion_position = i;
                    that.pion_nom = pion.nom;
                    that.pion_couleur = pion.couleur;
                    that.pion_deplacement = pion.deplacement;
                    that.pion_move = pion.move;

                    var fonction = that._deplacement();

                    var deplacement = "";
                    var capture = "";

                    if (that.deplacement.length > 0) {

                        deplacement = that.deplacement.join('.');
                    }

                    if (that.capture.length > 0) {

                        capture = that.capture.join('.');
                    }


                    that.jeu.position[i].deplacement = deplacement;
                    that.jeu.position[i].capture = capture;

                }
            }

            that.nul = false;

            if (that.jeu.blanc.pieces < 3 && that.jeu.noir.pieces < 3) {

                if (that.jeu.blanc.pieces == 1 && that.jeu.noir.pieces == 1) {

                    that.nul = true;
                }
                else if (that.jeu.blanc.pieces == 1) {

                    switch (that.options.noir.piece_reste.nom) {

                        case 'cavalier':
                        case 'fou':

                            that.nul = true;

                            break;
                    }
                }
                else if (that.jeu.noir.pieces == 1) {

                    switch (that.options.blanc.piece_reste.nom) {

                        case 'cavalier':
                        case 'fou':

                            that.nul = true;

                            break;
                    }
                }
                else if (that.options.blanc.piece_reste.nom == 'fou' && that.options.noir.piece_reste.nom == 'fou') {

                    var lettre = that._lettre_chiffre(that.options.blanc.piece_reste.position.substr(0, 1));
                    var chiffre = that.options.blanc.piece_reste.position.substr(-1);

                    var blanc = parseInt(lettre) + parseInt(chiffre);

                    var lettre = that._lettre_chiffre(that.options.noir.piece_reste.position.substr(0, 1));
                    var chiffre = that.options.noir.piece_reste.position.substr(-1);

                    var noir = parseInt(lettre) + parseInt(chiffre);

                    if (blanc % 2 == noir % 2) {
                        that.nul = true;
                    }
                }
            }

            that.pat = true;

            for (var i in that.jeu.position) {

                var pion = that.jeu.position[i];

                if (pion.nom == "roi") {

                    that.pion_position = i;
                    that.pion_nom = pion.nom;
                    that.pion_couleur = pion.couleur;
                    that.pion_deplacement = pion.deplacement;
                    that.pion_move = pion.move;

                    var fonction = that._deplacement();

                    var deplacement = "";
                    var capture = "";

                    if (that.deplacement.length > 0) {

                        deplacement = that.deplacement.join('.');

                        if (that.jeu.tour == that.pion_couleur) {

                            that.pat = false;
                        }
                    }

                    if (that.capture.length > 0) {

                        capture = that.capture.join('.');

                        if (that.jeu.tour == that.pion_couleur) {

                            that.pat = false;
                        }

                    }


                    that.jeu.position[i].deplacement = deplacement;
                    that.jeu.position[i].capture = capture;

                }
                else if (that.pat == true && that.jeu.tour == pion.couleur) {

                    if (pion.deplacement || pion.capture) {

                        that.pat = false;
                    }
                }
            }
			
            that.mat = false;

            if (that.roi_echec) {

                that.mat = true;

                var key = that.jeu[that.jeu.tour].roi.position;
                var pion = that.jeu.position[key];

                if(pion.deplacement || pion.capture){
                    
					that.mat = false;
                }

                for (var i in that.jeu.position) {

                    var pion = that.jeu.position[i];

                    if (that.jeu.tour == pion.couleur && pion.nom != 'roi') {

                        var deplacement = [];
                        var capture = "";
						
						if (that.roi_echec == 1) {

							if (pion.deplacement) {

								if (that.roi_echec_deplacement) {

									for (var a in that.roi_echec_deplacement) {

										var val = that.roi_echec_deplacement[a];

										var _deplacement = pion.deplacement.split('.');

										if ($._in_array(val, _deplacement)) {

											that.mat = false;

											deplacement.push(val);
										}
									}
								}
							}

							if (pion.capture) {

								var _capture = pion.capture.split('.');

								if ($._in_array(that.roi_echec_capture, _capture)) {

									that.mat = false;

									capture = that.roi_echec_capture;
								}
							}
						}

                        if (deplacement.length > 0) {

                            var deplacement = deplacement.join('.');
                        }
                        else {
                            var deplacement = "";
                        }

                        that.jeu.position[i].deplacement = deplacement;
                        that.jeu.position[i].capture = capture;
                    }
                }
            }
			
			if(!that.jeu.sauvegarde)
				that.jeu.sauvegarde = {};
				
			if(!that.jeu.coup)
				that.jeu.coup = 0;
			
			var _position = [];
			
			for(var i in that.jeu.position) {
				_position.push(i);
			}
			
			_position.sort();
			
			var val = "";
			
			for(var i in _position) {
				val += _position[i];
				val += that.jeu.position[_position[i]].nom;
				val += that.jeu.position[_position[i]].couleur;
			} 
			
			var position = 0;
			
			for(var i in that.jeu.sauvegarde) {
				if(val == that.jeu.sauvegarde[i].code) {
					position++;
				}
			}
			
			if((that._50_coup >= 50 || position >= 3) && that.jeu[that.jeu.tour].uid == that.uid) {
				that._possible_nul();
			}
			
			var position = JSON.stringify(that.jeu.position);
			
			that.jeu.coup++;
			
			that.jeu.sauvegarde[that.jeu.coup] = {
				code:val,
				depart:depart,
				arriver:arriver,
				jeu:JSON.parse(position)
			};
			
			if (that.mat == true) {

                that.jeu.terminer = 1;
                that.jeu.resultat.nom = 'mat';

                if (that.jeu.tour == 'noir') {
                    that.jeu.resultat.vainqueur = 1;
                }
                else {
                    that.jeu.resultat.vainqueur = 2;
                }
            }
			else if (that.pat == true || that.nul == true) {
					
				that.jeu.terminer = 1;
                that.jeu.resultat.vainqueur = 0;

                if (that.pat == true) {

                    that.jeu.resultat.nom = 'pat';
                }
                else {

                    that.jeu.resultat.nom = 'nul';
                }
            }
			
			that.jeu.blanc.roi.deplacement_interdit = "";
            that.jeu.noir.roi.deplacement_interdit = "";
			
			$('.nom a').css('color', '#3b5998');

            if (that.jeu.terminer == 0) {

                $(that.options[that.jeu.tour].nom).css('color', '#930');

                for (var i in that.jeu.position) {

                    that._jeu(i, that.jeu.position[i]);
                }
            }
			else if(that.jeu[that.jeu.tour].uid != that.uid) {
						
				that._set_resultat();
				that._resultat();
			}

        },
		
		_deplacement: function () {

            var that = this;

            that.sauvegarde_capture = "";
            that.deplacement_avant_roi = "";
            that.deplacement = [];
            that.capture = [];

            var lettre = parseInt(that._lettre_chiffre(that.pion_position.substr(0, 1)));
            var chiffre = parseInt(that.pion_position.substr(-1));

            switch (that.pion_nom) {

                case 'roi':

                    if (that.roi_echec == false && that.pion_move == 0) {
                        var fonction = that._verif_roque();
                    }

                    that.lettre = lettre;
                    that.chiffre = chiffre + 1;
                    var fonction = that._verif_roi();

                    that.chiffre = chiffre - 1;
                    var fonction = that._verif_roi();

                    that.lettre = lettre - 1;
                    var fonction = that._verif_roi();

                    that.chiffre = chiffre + 1;
                    var fonction = that._verif_roi();

                    that.lettre = lettre + 1;
                    var fonction = that._verif_roi();

                    that.chiffre = chiffre - 1;
                    var fonction = that._verif_roi();

                    that.chiffre = chiffre;
                    var fonction = that._verif_roi();

                    that.lettre = lettre - 1;
                    var fonction = that._verif_roi();

                    break;

                case 'reine':
                case 'tour':

                    that.stop = false;
					that.roi_echec_interdit = false;
                    that._deplacement_avant_roi = [];
                    that._deplacement_echec_roi = [];

                    for (that.i = 1; that.i < 9; that.i++) {

                        that.lettre = lettre;
                        that.chiffre = chiffre + that.i;
                        var fonction = that._verif_reine_tour_fou();
                    }


                    that.stop = false;
					that.roi_echec_interdit = false;
                    that._deplacement_avant_roi = [];
                    that._deplacement_echec_roi = [];

                    for (that.i = 1; that.i < 9; that.i++) {

                        that.lettre = lettre + that.i;
                        that.chiffre = chiffre;
                        var fonction = that._verif_reine_tour_fou();
                    }


					that.stop = false;
					that.roi_echec_interdit = false;
                    that._deplacement_avant_roi = [];
                    that._deplacement_echec_roi = [];

                    for (that.i = 1; that.i < 9; that.i++) {

                        that.lettre = lettre;
                        that.chiffre = chiffre - that.i;
                        var fonction = that._verif_reine_tour_fou();
                    }

                    that.stop = false;
					that.roi_echec_interdit = false;
                    that._deplacement_avant_roi = [];
                    that._deplacement_echec_roi = [];

                    for (that.i = 1; that.i < 9; that.i++) {

                        that.lettre = lettre - that.i;
                        that.chiffre = chiffre;
                        var fonction = that._verif_reine_tour_fou();
                    }


                    if (that.pion_nom == 'tour') {
                        break;
                    }

                case 'reine':
                case 'fou':

                    that.stop = false;
					that.roi_echec_interdit = false;
                    that._deplacement_avant_roi = [];
                    that._deplacement_echec_roi = [];

                    for (that.i = 1; that.i < 9; that.i++) {

                        that.lettre = lettre + that.i;
                        that.chiffre = chiffre + that.i;
                        var fonction = that._verif_reine_tour_fou();

                    }

					that.stop = false;
					that.roi_echec_interdit = false;
                    that._deplacement_avant_roi = [];
                    that._deplacement_echec_roi = [];

                    for (that.i = 1; that.i < 9; that.i++) {

                        that.lettre = lettre - that.i;
                        that.chiffre = chiffre - that.i;
                        var fonction = that._verif_reine_tour_fou();

                    }

                    that.stop = false;
					that.roi_echec_interdit = false;
                    that._deplacement_avant_roi = [];
                    that._deplacement_echec_roi = [];

                    for (that.i = 1; that.i < 9; that.i++) {

                        that.lettre = lettre + that.i;
                        that.chiffre = chiffre - that.i;
                        var fonction = that._verif_reine_tour_fou();

                    }

                    that.stop = false;
					that.roi_echec_interdit = false;
                    that._deplacement_avant_roi = [];
                    that._deplacement_echec_roi = [];

                    for (that.i = 1; that.i < 9; that.i++) {

                        that.lettre = lettre - that.i;
                        that.chiffre = chiffre + that.i;
                        var fonction = that._verif_reine_tour_fou();

                    }

                    break;

                case 'cavalier':

                    that.lettre = lettre - 2;
                    that.chiffre = chiffre - 1;
                    var fonction = that._verif_cavalier();

                    that.chiffre = chiffre + 1;
                    var fonction = that._verif_cavalier();

                    that.lettre = lettre + 2;
                    var fonction = that._verif_cavalier();

                    that.chiffre = chiffre - 1;
                    var fonction = that._verif_cavalier();

                    that.lettre = lettre + 1;
                    that.chiffre = chiffre + 2;
                    var fonction = that._verif_cavalier();

                    that.chiffre = chiffre - 2;
                    var fonction = that._verif_cavalier();

                    that.lettre = lettre - 1;
                    var fonction = that._verif_cavalier();

                    that.chiffre = chiffre + 2;
                    var fonction = that._verif_cavalier();

                    break;

                case 'pion':

                    if (that.prise_en_passant && that.jeu.tour == that.pion_couleur) {

                        if ($._in_array(that.pion_position, that.position_en_passant)) {

                            that.capture.push(that.prise_en_passant);
                        }
                    }

                    if (that.pion_couleur == 'blanc') {

                        that.chiffre = chiffre + 1;
                    }
                    else {

                        that.chiffre = chiffre - 1;
                    }

                    that.lettre = lettre + 1;
                    var fonction = that._verif_capture_pion();

                    that.lettre = lettre - 1;
                    var fonction = that._verif_capture_pion();

                    that.lettre = lettre;
                    var fonction = that._verif_deplacement_pion();

                    if (that.deplacement.length > 0) {

                        if (that.pion_move == 0) {

                            if (that.pion_couleur == 'blanc') {
                                that.chiffre = chiffre + 2;
                            }
                            else {
                                that.chiffre = chiffre - 2;
                            }

                            that.lettre = lettre;
                            var fonction = that._verif_deplacement_pion();
                        }
                    }

                    break;
            }

        },

        _verif_roque: function () {

            var that = this;

            if (that.pion_couleur == 'blanc') {

                var _chiffre = 1;
                var _couleur = 'noir';
            }
            else {

                var _chiffre = 8;
                var _couleur = 'blanc';
            }

            var roi_interdit = that.jeu[_couleur].roi.deplacement_interdit;

            if (that.jeu.position['a' + _chiffre]) {

                var nom = that.jeu.position['a' + _chiffre].nom;
                var couleur = that.jeu.position['a' + _chiffre].couleur;
                var move = that.jeu.position['a' + _chiffre].move;

                if (nom == 'tour' && couleur == that.pion_couleur && move == 0) {

                    var deplacement = that.jeu.position['a' + _chiffre].deplacement;

                    reg = new RegExp('b' + _chiffre + '.c' + _chiffre + '.d' + _chiffre);

                    if (reg.test(deplacement) && !$._in_array('b' + _chiffre, roi_interdit) && !$._in_array('c' + _chiffre, roi_interdit) && !$._in_array('d' + _chiffre, roi_interdit)) {

                        that.deplacement.push('c' + _chiffre);
                    }
                }
            }

            if (that.jeu.position['h' + _chiffre]) {

                var nom = that.jeu.position['h' + _chiffre].nom;
                var couleur = that.jeu.position['h' + _chiffre].couleur;
                var move = that.jeu.position['h' + _chiffre].move;

                if (nom == 'tour' && couleur == that.pion_couleur && move == 0) {

                    var deplacement = that.jeu.position['h' + _chiffre].deplacement;

                    reg = new RegExp('g' + _chiffre + '.f' + _chiffre);

                    if (reg.test(deplacement) && !$._in_array('g' + _chiffre, roi_interdit) && !$._in_array('f' + _chiffre, roi_interdit)) {

                        that.deplacement.push('g' + _chiffre);
                    }
                }
            }
        },

        _verif_roi_interdit: function () {

            var that = this;

            if (that._verif_position()) {

                that.jeu[that.pion_couleur].roi.deplacement_interdit.push(that._position());

            }
        },

        _verif_roi: function () {

            var that = this;

            if (that._verif_position()) {

                that.position = that._position();

                if (that._verif_capture_roi()) {

                    that.capture.push(that.position);

                }
                else if (that._verif_deplacement_roi()) {

                    that.deplacement.push(that.position);

                }
            }
        },

        _verif_capture_roi: function () {

            var that = this;

            if (that._verif_capture()) {

                if (that.pion_couleur == 'blanc') {

                    var couleur = 'noir';
                }
                else {

                    var couleur = 'blanc';
                }

                return !$._in_array(that.position, that.jeu[couleur].roi.deplacement_interdit);
            }
        },

        _verif_deplacement_roi: function () {

            var that = this;

            if (that._verif_deplacement()) {

                if (that.pion_couleur == 'blanc') {

                    var couleur = 'noir';
                }
                else {
                    var couleur = 'blanc';
                }

                return !$._in_array(that.position, that.jeu[couleur].roi.deplacement_interdit);
            }
        },

        _verif_reine_tour_fou: function () {

            var that = this;

            if (that._verif_position()) {

                that.position = that._position();

                if (that.stop == false) {

                    if (that._verif_capture()) {

                        that.capture.push(that.position);

                        that.sauvegarde_capture = that.position;

                        if (that.jeu.tour != that.pion_couleur) {

                            if (that.pion_couleur == 'blanc') {

                                var couleur = 'noir';
                            }
                            else {
                                var couleur = 'blanc';
                            }
                            if (that.jeu[couleur].roi.position == that.position) {

                                that.roi_echec++;

                                that.roi_echec_deplacement = that._deplacement_echec_roi;

                                that.roi_echec_capture = that.pion_position;

                                that.roi_echec_interdit = true;

                            }

                            that.stop = true;

                        }
                        else {

                            that.i = 8;
                        }
                    }
                    else if (that._verif_deplacement()) {

                        that.deplacement.push(that.position);
                        that._deplacement_avant_roi.push(that.position);
                        that._deplacement_echec_roi.push(that.position);

                        that.jeu[that.pion_couleur].roi.deplacement_interdit.push(that.position);

                    }
                    else {

                        that.jeu[that.pion_couleur].roi.deplacement_interdit.push(that.position);

                        that.i = 8;
                    }
                }
                else if (that.jeu.tour != that.pion_couleur) {

                    if (that.pion_couleur == 'blanc') {

                        var couleur = 'noir';
                    }
                    else {

                        var couleur = 'blanc';
                    }

                    if (that._verif_capture()) {

                        if (that.jeu[couleur].roi.position == that.position) {

                            that.capture_avant_roi = that.sauvegarde_capture;

                            that.deplacement_avant_roi = that._deplacement_avant_roi;

                            var fonction = that._piece_avant_roi();
                        }

                        that.i = 8;
                    }
                    else if (that._verif_deplacement()) {

                        if (that.roi_echec_interdit == true) {

                            that.jeu[that.pion_couleur].roi.deplacement_interdit.push(that.position);

                        }

                        that._deplacement_avant_roi.push(that.position);

                    }
                    else {
					
						if (that.roi_echec_interdit == true) {

                            that.jeu[that.pion_couleur].roi.deplacement_interdit.push(that.position);

                        }
						
                        that.i = 8;
                    }
                }
                else {

                    that.i = 8;
                }
            }
        },

        _piece_avant_roi: function () {

            var that = this;

            if (that.pion_nom == 'reine' || that.pion_nom == 'tour' || that.pion_nom == 'fou') {

                var key = that.sauvegarde_capture;

                var pion_nom = that.jeu.position[key].nom;
                var pion_deplacement = that.jeu.position[key].deplacement;
                var pion_capture = that.jeu.position[key].capture;
                var pion_move = that.jeu.position[key].move;

                var deplacement = "";
                var capture = "";

                if (pion_nom == 'reine' || that.pion_nom == pion_nom) {

                    capture = that.pion_position;

                    if (that.deplacement_avant_roi) {

                        deplacement = that.deplacement_avant_roi.join('.');
                    }
                }
                else if (that.pion_nom == 'reine' && pion_nom != 'cavalier' && pion_nom != 'pion') {

                    var _capture = pion_capture.split('.');

                    if ($._in_array(that.pion_position, _capture)) {

                        capture = that.pion_position;

                        if (that.deplacement_avant_roi) {

                            deplacement = that.deplacement_avant_roi.join('.');
                        }
                    }
                }
                else if (pion_nom == 'pion') {

                    var lettre = that._lettre_chiffre(that.pion_position.substr(0, 1));
                    var lettre_pion = that._lettre_chiffre(key.substr(0, 1));

                    var _deplacement = pion_deplacement.split('.');

                    if (lettre == lettre_pion && !$._in_array(that.pion_position, _deplacement)) {

                        deplacement = pion_deplacement;
                    }

                    var _capture = pion_capture.split('.');
				
                    if ($._in_array(that.pion_position, _capture)){
					
                        capture = that.pion_position;
                    }
                }

                that.jeu.position[key].deplacement = deplacement;
                that.jeu.position[key].capture = capture;
            }

        },


        _verif_cavalier: function () {

            var that = this;

            if (that._verif_position()) {

                that.position = that._position();

                if (that._verif_capture()) {

                    that.capture.push(that.position);

                }
                else if (that._verif_deplacement()) {

                    that.deplacement.push(that.position);

                }

                if (that.pion_couleur == 'blanc') {

                    couleur = 'noir';
                }
                else {

                    couleur = 'blanc';
                }

                if (that.jeu.tour != that.pion_couleur) {

                    if (that.jeu[couleur].roi.position == that.position) {

                        that.roi_echec++;

                        that.roi_echec_capture = that.pion_position;

                    }

                }

                that.jeu[that.pion_couleur].roi.deplacement_interdit.push(that.position);

            }

        },

        _verif_capture_pion: function () {

            var that = this;

            if (that._verif_position()) {

                that.position = that._position();

                if (that._verif_capture()) {

                    that.capture.push(that.position);

                }

                if (that.jeu.tour != that.pion_couleur) {

                    if (that.pion_couleur == 'blanc') {

                        var couleur = 'noir';
                    }
                    else {

                        var couleur = 'blanc';
                    }

                    if (that.jeu[couleur].roi.position == that.position) {

                        that.roi_echec++;

                        that.roi_echec_capture = that.pion_position;

                    }

                }

                that.jeu[that.pion_couleur].roi.deplacement_interdit.push(that.position);
            }

        },

        _verif_deplacement_pion: function () {

            var that = this;

            if (that._verif_position()) {

                that.position = that._position();

                if (that._verif_deplacement()) {

                    that.deplacement.push(that.position);

                }
            }
        },

        _verif_capture: function () {

            var that = this;

            if (that._verif_piece()) {

                return that.jeu.position[that.position].couleur != that.pion_couleur;

            }

        },

        _verif_deplacement: function () {

            var that = this;

            return !that.jeu.position[that.position];
        },

        _verif_piece: function () {

            var that = this;

            return that.jeu.position[that.position];

        },

        _verif_position: function () {

            var that = this;

            return that.lettre > 0 && that.lettre < 9 && that.chiffre > 0 && that.chiffre < 9;
        },

        _position: function () {

            var that = this;

            return that._chiffre_lettre(that.lettre) + that.chiffre;
        },
		
		_chiffre_lettre: function (chiffre) {

            switch (chiffre) {

                case 1: return 'a';
                case 2: return 'b';
                case 3: return 'c';
                case 4: return 'd';
                case 5: return 'e';
                case 6: return 'f';
                case 7: return 'g';
                case 8: return 'h';
            }
        },

        _lettre_chiffre: function (lettre) {

            switch (lettre) {

                case 'a': return 1;
                case 'b': return 2;
                case 'c': return 3;
                case 'd': return 4;
                case 'e': return 5;
                case 'f': return 6;
                case 'g': return 7;
                case 'h': return 8;
            }
        },
		
		_possible_nul: function() {
			
			var that = this;
			
			var fenetre = $('<div class="fenetre"></div>').appendTo(that.contenu);

			$('<div class="close"></div>').appendTo(fenetre)
			.click(function () {

				$('.fenetre').remove();
			});

			var draw = $.options.lang[lang].draw;

			$('<div style="font-weight:bold;font-size:20px;margin:0 0 10px 20px">' + draw + ' ?</div>').appendTo(fenetre);

			var div = $('<div class="form"></div>').appendTo(fenetre);

			var ok = $.options.lang[lang].ok;
			var cancel = $.options.lang[lang].cancel;

			$('<button>' + ok + '</button>').appendTo(div).click(function () {

				$('.fenetre').remove();

				that.jeu.terminer = 1;
				that.jeu.resultat.vainqueur = 0;
				that.jeu.resultat.nom = 'nul';

				that._set_resultat();
				that._resultat();

			});

			$('<button>' + cancel + '</button>').appendTo(div)
			.click(function () {

				$('.fenetre').remove();
			});
		},

        _proposer_nul: function () {

            var that = this;

            if(that.proposer_nul < 3 && that.jeu.terminer == 0) {
				
				var fenetre = $('<div class="fenetre"></div>').appendTo(that.contenu);

				$('<div class="close"></div>').appendTo(fenetre)
				.click(function () {

					$('.fenetre').remove();
				});

				var offer_draw = $.options.lang[lang].offer_draw;

				$('<div style="font-weight:bold;font-size:20px;margin:0 0 10px 20px">' + offer_draw + ' ?</div>').appendTo(fenetre);
				var div = $('<div class="form"></div>').appendTo(fenetre);

				var ok = $.options.lang[lang].ok;
				var cancel = $.options.lang[lang].cancel;

				$('<button>' + ok + '</button>').appendTo(div).click(function () {

					$('.fenetre').remove();

					that.socket.emit('ProposerNul', {id:that.jeu.id});
					
					that.proposer_nul++;
				});

				$('<button>' + cancel + '</button>').appendTo(div)
				.click(function () {

					$('.fenetre').remove();
				});
			}
        },

        _reponse_nul: function (data) {

            var that = this;
			
			if(that.jeu) {
			
				var uid = 0;
				
				if (that.uid == that.jeu.blanc.uid) {
					uid = that.jeu.noir.uid;
				}
				else if(that.uid == that.jeu.noir.uid) {
					uid = that.jeu.blanc.uid;
				}
				
				if(that.jeu.terminer == 0 && data.uid == uid) {

					var fenetre = $('<div class="fenetre"></div>').appendTo(that.contenu);

					$('<div class="close"></div>').appendTo(fenetre)
					.click(function () {

						$('.fenetre').remove();
					});

					var offers_a_draw = $.options.lang[lang].offers_a_draw;

					$('<div style="font-weight:bold;font-size:20px;margin:0 0 10px 20px">' + data.name + ' ' + offers_a_draw + '.</div>').appendTo(fenetre);

					var div = $('<div class="form"></div>').appendTo(fenetre);

					var ok = $.options.lang[lang].ok;
					var cancel = $.options.lang[lang].cancel;

					$('<button>' + ok + '</button>').appendTo(div).click(function () {

						$('.fenetre').remove();

						that.jeu.terminer = 1;
						that.jeu.resultat.vainqueur = 0;
						that.jeu.resultat.nom = 'nul';

						that._set_resultat();
						that._resultat();

					});

					$('<button>' + cancel + '</button>').appendTo(div)
					.click(function () {

						$('.fenetre').remove();
					});
				}
			}
        },

        _abandonner: function() {

            var that = this;
			
			if(that.jeu.terminer == 0) {

				var fenetre = $('<div class="fenetre"></div>').appendTo(that.contenu);

				$('<div class="close"></div>').appendTo(fenetre)
				.click(function () {

					$('.fenetre').remove();
				});

				var resign = $.options.lang[lang].resign;

				$('<div style="font-weight:bold;font-size:20px;margin:0 0 10px 20px">' + resign + ' ?</div>').appendTo(fenetre);
				var div = $('<div class="form"></div>').appendTo(fenetre);

				var ok = $.options.lang[lang].ok;
				var cancel = $.options.lang[lang].cancel;

				$('<button>' + ok + '</button>').appendTo(div).click(function () {

					$('.fenetre').remove();
					that.jeu.terminer = 1;

					if (that.jeu.blanc.uid == that.uid) {
						that.jeu.resultat.vainqueur = 2;
					}
					else {
						that.jeu.resultat.vainqueur = 1;
					}

					that.jeu.resultat.nom = 'resign';
					that._set_resultat();
					that._resultat();

				});

				$('<button>' + cancel + '</button>').appendTo(div)
				.click(function () {
					$('.fenetre').remove();

				});
			}
        },
		
		_decompte: function () {

            var that = this;

            if (that.jeu && that.jeu.terminer == 0) {
			
				var time = that.jeu[that.jeu.tour].time;
				var time_tour = that.jeu[that.jeu.tour].time_tour;
				
				if (time >= 0 && time_tour >= 0) {

                    var time_chiffre = that._time(time);
					$(that.options[that.jeu.tour].decompte).empty().append(time_chiffre);
					
					if(that.jeu[that.jeu.tour].time_tour <= that.jeu[that.jeu.tour].time){
						var time_tour1 = that._time(time_tour);
					}
					else{
						var time_tour1 = that._time(time);
					}
					
					$(that.options[that.jeu.tour].decompte_tour).empty().append(time_tour1);
					
					if(that.jeu.tour == "blanc"){
						var couleur = "noir";
					}
					else{
						var couleur = "blanc";
					}
					
					$(that.options[couleur].decompte_tour).empty().append("");
					
					that.jeu[that.jeu.tour].time --;
					that.jeu[that.jeu.tour].time_tour --;
					
					if(that.options.sound && $('#audio #time')[0]) {
						
						$('#audio #time')[0].pause();
						
						if(that.jeu[that.jeu.tour].uid == that.uid && (that.jeu[that.jeu.tour].time < 10 || that.jeu[that.jeu.tour].time_tour < 10))
							$('#audio #time')[0].play();
					}
				}
                else {
				
					if(that.options.sound && $('#audio #time')[0]) $('#audio #time')[0].pause();
					
					$('.piece').draggable("disable").removeClass('ui-draggable');
					
					var color = (that.jeu.tour == 'blanc') ? 'noir' : 'blanc';
					
					that.jeu.terminer = 1;
					that.jeu.resultat.vainqueur = (that._time_inssufisance_materiel(color)) ? 0 : ((color == 'blanc') ? 1 : 2);
					that.jeu.resultat.nom = (that.jeu.resultat.vainqueur == 0) ? 'nul' : 'time';
					
					if(that.jeu[that.jeu.tour].uid != that.uid) {
						that._set_resultat();
						that._resultat();
					}
                }
            }

            setTimeout(function () { that._decompte(); }, 1000);
        },
		
		_time_inssufisance_materiel: function(color) {
		
			var that = this;
			
			if (that.jeu[color].pieces == 1)
				return true;
			
			return false;
		},
		
		_time: function (time) {

            var that = this;
			
			var minute = Math.floor(time / 60);
            var seconde = Math.floor(time - (minute * 60));

            return $._sprintf(minute) + ':' + $._sprintf(seconde);
        },

        _jeu_terminer: function (data) {
			
			var that = this;
			
			var uid = 0;
			
			if (that.uid == that.jeu.blanc.uid) {
				uid = that.jeu.noir.uid;
			}
			else if(that.uid == that.jeu.noir.uid) {
				uid = that.jeu.blanc.uid;
			}
			
			if(uid && data.uid == uid) {
			 
				that.jeu.terminer = 1;
				that.jeu.resultat.vainqueur = data.vainqueur;
				that.jeu.resultat.nom = data.nom;
				that._resultat();
			}
		},
		
		_set_resultat: function () {
			
			var that = this;
			
			that.socket.emit('JeuTerminer', {
				id: that.jeu.id,
				vainqueur: that.jeu.resultat.vainqueur,
				nom: that.jeu.resultat.nom,
				blanc: that.jeu.blanc.uid,
				noir: that.jeu.noir.uid
			});
		},

        _resultat: function () {

            var that = this;
			
			if(that.options.sound && $('#audio #time')[0]) $('#audio #time')[0].pause();
			
			$('.bt').empty().html();
			
			if(that.jeu.coup) {
				
				var div = $('<div style="bottom:130px" class="replay"></div>').appendTo(that.contenu);
				var max = that.jeu.coup;
				
				that.sauvegarde = that.jeu.sauvegarde;
				that.coup = that.jeu.coup;
				
				$('<button> < </button>').appendTo(div)
				.click(function() {
					that.coup = 1;
					that._sauvegarde();
				});
				
				$('<button> << </button>').appendTo(div)
				.click(function() {
					if(that.sauvegarde[that.coup - 1]) {
						that.coup --;
						that._sauvegarde();
					}
				});
				
				that.num_replay = $('<span class="num">' + that.coup + '</span>').appendTo(div);
				
				$('<button> >> </button>').appendTo(div)
				.click(function() {
					if(that.sauvegarde[that.coup + 1]) {
						that.coup ++;
						that._sauvegarde();
					}
				});
				
				$('<button> > </button>').appendTo(div)
				.click(function() {
					that.coup = max;
					that._sauvegarde();
				});
			}
				
			var fenetre = $('<div style="height:140px" class="fenetre"></div>').appendTo(that.contenu);
			
			$('<div class="close"></div>').appendTo(fenetre)
			.click(function () {
				$('#fade').css('display', 'none');
				$('.fenetre').css('display', 'none');
			});

            var game_over = $.options.lang[lang].game_over;
            var resultat = $.options.lang[lang][that.jeu.resultat.nom];

            $('<h2>' + game_over + '</h2>').appendTo(fenetre);
            $('<div class="resultat">' + resultat + '</div>').appendTo(fenetre);

            var winner = $.options.lang[lang].winner;
			
            var win = "";
			
			if (that.jeu.resultat.vainqueur == 1) {
				win = winner + ': ' + that.jeu.blanc.name;
				$('<div class="vainqueur">' + winner + ' : ' + that.jeu.blanc.name + '</div>').appendTo(fenetre);
            }
            else if (that.jeu.resultat.vainqueur == 2) {
				win = winner + ': ' + that.jeu.noir.name;
				$('<div class="vainqueur">' + winner + ' : ' + that.jeu.noir.name + '</div>').appendTo(fenetre);
            }
			
			var blanc = that.jeu.blanc.name;
			var noir = that.jeu.noir.name;
			
			var partage = $('<div class="partager"></div>').appendTo(fenetre);
			$('<button>' + $.options.lang[lang].partager + '</button>').appendTo(partage)
			.click(function() {
				$.partager({blanc:blanc, noir:noir, win:win, result:resultat });
			});
			
			$('.piece').draggable("disable").removeClass('ui-draggable');
			
			delete that.jeu;
			
			that.menu = {
				accueil:true,
				jouer:true,
				classement:true
			};
        },
		
		_sauvegarde: function() {
			
			var that = this;
			
			$(that.num_replay).empty().text(that.coup);
			
			$('.case').css('background', "").empty().html();
			$(that._case[that.sauvegarde[that.coup].depart]).css('background', '#930');
			$(that._case[that.sauvegarde[that.coup].arriver]).css('background', '#930');
			
			for (var i in that.sauvegarde[that.coup].jeu) {

				var position = i;
				var pion = that.sauvegarde[that.coup].jeu[i];
				
				var _pion = $('<div class="piece ' + pion.nom + '_' + pion.couleur + '"></div>');
				$(that._case[position]).empty().append(_pion);
			}
		},
		
		_open_classement: function(page, bool) {
			
			var that = this;
			
			if(bool) {
				
				if(that.type_ranking == "ranking"  && friends.array.length > 0) {
					that.type_ranking = "friends";
				}
				else {
					that.type_ranking = "ranking";
				}
			}
			
			that.menu = {
				accueil:false,
				jouer:false,
				classement:false
			};
			
			if(that.type_ranking == "friends") {
				that.socket.emit('Classement', {page:page, friends:friends.array});
			}
			else {
			
				that.socket.emit('Classement', {page:page, friends:false});
			}
		},
		
		_classement: function (data) {

            var that = this;
			
			that.menu = {
				accueil:true,
				jouer:true,
				classement:true
			};
			
			that.page_open = false;
			
			if(that.type_ranking == "ranking" && friends.array.length > 0) {
				var name = "friends";
			}
			else {
				var name = "ranking";
			}
			
			$(that.ranking).empty().text($.options.lang[lang][name]);
			
			$(that.conteneur).css("height", "580px");

            $(that.contenu).empty().html();
			
			that.table = $('<table class="classement"></table>').appendTo(that.contenu);

			var p = 0;
			
			for (var i in data.classement) {

				that._classement_position(data.classement[i], p);
				p++;
			}

			if (data.page) {

				that.page = data.page.page;

				var page = $('<div id="page"></div>').appendTo(that.contenu);

				if (data.page.prec.num) {

					var div = $('<div class="left"></div>').appendTo(page);

					that._page(data.page.prec, div);
				}

				if (data.page.suiv.num) {

					var div = $('<div class="right"></div>').appendTo(page);

					that._page(data.page.suiv, div);
				}

				var div = $('<div class="_page"></div>').appendTo(page);

				for (var i in data.page.list) {

					that._page(data.page.list[i], div);
				}

			}

        },

        _classement_position: function (user, i) {

            var that = this;

            var uid = user.uid;

            if (that.uid == uid) {

                var tr = $('<tr class="bg-bleu"></tr>').appendTo(that.table);
            }
            else if (i % 2 == 1) {

                var tr = $('<tr class="bg-brun"></tr>').appendTo(that.table);
            }
            else {

                var tr = $('<tr class="bg-gris"></tr>').appendTo(that.table);
            }

            $('<td class="position">' + user.position + '</td>').appendTo(tr);
            var image = $('<td class="images"></td>').appendTo(tr);
            var nom = $('<td class="nom"></td>').appendTo(tr);
            
			$('<td class="scores">' + user.points + '</td>').appendTo(tr);

            $('<img src="https://graph.facebook.com/' + uid + '/picture" />').appendTo(image);
			
			FB.api('/' + uid, function(response) {
				$('<a href="#">' + response.name + '</a>').appendTo(nom)
				.click(function () {
					that._open_profil(uid, response.name);
					return false;
				});
			});

        },

        _page: function (page, div) {

            var that = this;

            if (page.num == that.page) {

                _page = $('<div class="page"><strong>' + page.nom + '</strong></div>').appendTo(div);
            }
            else {

                _page = $('<div class="page">' + page.nom + '</div>').appendTo(div);
            }

            _page.click(function () {
				if(!that.page_open) {
					that.page_open = true;
					that._open_classement(page.num, false);
				}
            });
        }
    });

})(jQuery);