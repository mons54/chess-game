

(function ($) {

    $.widget('ui.online', {

        _case: {},
        
        options: {
            
			stop: false,
			trophy: {},
			partager: {},
			send_invite: {
				bt: '',
				nb: 0,
				data: []
			},
            blanc: {
				coup: null,
                img: null,
                nom: null,
                decompte: null,
                decompte_tour: null,
                piece_reste: ''
            },
            noir: {
				coup: null,
                img: null,
                nom: null,
                decompte: null,
				decompte_tour: null,
                piece_reste: ''
            },
			sound: true
        },
		
		_create: function () {
			
			this.uid = uid;
			this.name = name;
			this._decompte();
			
			setInterval(function() {
				this._clock();
				this._free();
			}.bind(this), 1000);
			
			if(navigator.userAgent.indexOf('Safari') > 1 && navigator.userAgent.indexOf('Chrome') == -1) {
				this.socket = io.connect('wss://' + host + '/');
			}
			else {
				this.socket = io.connect('/');
			}
			
			if(!$('#audio #move')[0].play || !$('#audio #time')[0].play) {
				this.options.sound = false;
			}
			
			this.socket.open = false;
			
			this._socket_on();
		},
		
		_socket_on: function () {
			
			this.socket.on('connect', function () {
				
				this._connect();
			
			}.bind(this));
			
			this.socket.on('InfosUser', function (data) {
				
				this.socket.open = true;
				
				this._infos_user(data);
				
			}.bind(this));
			
			this.socket.on('ListGames', function (data) {
				
				this._games(data);
			
			}.bind(this));
			
			this.socket.on('Defis', function (data) {
				
				this._defis(data);
			
			}.bind(this));
			
			this.socket.on('NewGame', function (jeu) {
				
				this._new_game(jeu);
			
			}.bind(this));
			
			this.socket.on('loadGame', function (data) {
				
				this._load_game(data);
			
			}.bind(this));
			
			this.socket.on('JeuTerminer', function (data) {
				
				this._jeu_terminer(data);
			
			}.bind(this));
			
			this.socket.on('ProposerNul', function (data) {
				
				this._reponse_nul(data);
			
			}.bind(this));
			
			this.socket.on('ListerMessages', function (data) {
				
				this._lister_messages(data);
			
			}.bind(this));
			
			this.socket.on('NouveauMessageJeu', function (data) {
				
				this._message_jeu(data);
			
			}.bind(this));
			
			this.socket.on('Profil', function (data) {
				
				this._profil(data.data, data.classement, data.points, data.uid, data.name);
			
			}.bind(this));
			
			this.socket.on('Challengers', function (data) {
				
				this._challengers(data);
			
			}.bind(this));
			
			this.socket.on('Connected', function (data) {
				
				this._connected(data);
			
			}.bind(this));
			
			this.socket.on('disconnect', function () {
				
				top.location.href=host;
			
			}.bind(this));
			
			this.socket.on('Classement', function (data) {
				
				this._classement(data);
			
			}.bind(this));
			
			this.socket.on('trophy', function (data) {
				
				this.options.trophy[data] = true;
			
			}.bind(this));
		},
		
		_connect: function () {
			
			FB.getLoginStatus(function (response) {
				
				if (!response.authResponse || !response.authResponse.userID || !response.authResponse.accessToken) {
					top.location.href=redirectUri;
				}
				
				this.socket.emit('create', {
					uid: response.authResponse.userID,
					accessToken: response.authResponse.accessToken,
					name: this.name, 
					parrainage:parrainage
				});
				
			}.bind(this));
		},
		
		_init: function () {
			
			$.pub();
			
			this.tokens = { 
				ready: false 
			};
			
			this.trophy = { 
				ready: false 
			};
			
			this.menu = {
				accueil: true,
				jouer: false,
				classement: true
			};
			
			this.menu_game = 'games';
			this.all_defis = {};
			this.nb_defis = 0;
			this.all_connected = {};
			this.type_ranking = 'friends';
			
			$(this.element).empty().html();
			
			this._create_column_left();
			this._create_column_right();
			this._create_menu();
			
			this.contenu = $('<div class="contenu"></div>').appendTo(this.conteneur);
			this.home = $('<div style="padding:0" id="accueil"></div>').appendTo(this.contenu);
			
			this._create_profil();
			this._create_menu_game();
			this._create_tchat();
		},
		
		_create_column_left: function () {
			
			var left = $('<div id="left"></div>').appendTo(this.element);
			
			var div = $('<div class="infos"></div>').appendTo(left);
			
			this.clock = $('<div class="clock"></div>').appendTo(div);
			
			this.connected = $('<div class="connected"></div>').appendTo(div);
			
			$('<a class="trophy" href="#"></a>').appendTo(left).click(function () {
				
				if (this.trophy && this.trophy.ready) {
					this._trophy();
				}
				
				return false;
				
			}.bind(this));
			
			var classes = (this.options.sound) ? 'sound' : 'no-sound';
			
			this.bt_sound = $('<a id="sound" class="' + classes + '" href="#"></a>').appendTo(left).click(function () {
				
				this._sound();
				
				return false;
				
			}.bind(this));
		},
		
		_create_column_right: function () {
			
			var right = $('<div id="right"></div>').appendTo(this.element);
			
			$('<a href="#" class="dealspot dealspot-' + lang + '"></div>').appendTo(right).click(function () {
				
				this._sponsorpay();
				
				return false;
				
			}.bind(this));
			
			var free = $('<div class="free"></div>').appendTo(right),
				time = $('<div class="time"></div>').appendTo(free);
			
			this.free_h = $('<span class="hours"></span>').appendTo(time);
			$('<span class="sep-1">:</span>').appendTo(time);
			this.free_m = $('<span class="minutes"></span>').appendTo(time);
			$('<span class="sep-2">:</span>').appendTo(time);
			this.free_s = $('<span class="secondes"></span>').appendTo(time);
			
			if (this.options.send_invite.nb < 30) {
			
				this.options.send_invite.bt = $('<a class="invite invite-' + lang + '" href="#"></a>').appendTo(right).click(function () {
				
					if (all_friends) {
						this._invite_friends();
					}
					
					return false;
					
				}.bind(this));
			}
			
			this.conteneur = $('<div id="conteneur"></div>').appendTo(this.element);
		},
		
		_create_menu: function () {
			
			var menu = $('<div id="menu"></div>').appendTo(this.conteneur);
			
			var token = $('<a class="token" href="#"></a>').appendTo(menu).click(function () {
				
				this._shop();
				
				return false;
				
			}.bind(this));
			
			$('<span class="plus"></span>').appendTo(token);
			$('<span class="ico"></span>').appendTo(token);
			
			this.options.tokens = $('<span class="text"></span>').appendTo(token);
			
			var ul = $('<ul></ul>').appendTo(menu);
			var li = $('<li></li>').appendTo(ul);
			
			$('<a href="#">' + $.options.lang[lang].home + '</a>').appendTo(li).click(function () {
				
				if (this.menu.accueil) {
					
					this.socket.emit('Quit');
					
					$.start();
				}
				
				return false;
				
			}.bind(this));
			
			var li = $('<li></li>').appendTo(ul);
			
			$('<a href="#">' + $.options.lang[lang].play + '</a>').appendTo(li).click(function () {
				
				if (this.menu.jouer) {
					
					this._init();
				}
				
				return false;
				
			}.bind(this));
			
			var li = $('<li></li>').appendTo(ul);
			
			this.ranking = $('<a href="#">' + $.options.lang[lang].ranking + '</a>').appendTo(li).click(function () {
				
				if (this.menu.classement) {
					
					this.socket.emit('Quit');
					
					this._open_classement(0, true);
				}
				
				return false;
				
			}.bind(this));
			
			var li = $('<li></li>').appendTo(ul);
			
			$('<a href="#">' + $.options.lang[lang].invite + '</a>').appendTo(li).click(function () {
			
				if (all_friends) {
					
					this._invite_friends();
				}
				
				return false;
				
			}.bind(this));
			
			if (lang == 'ru') {
				
				$('#menu ul li a').css('padding', '0 5px');
			}
		},
		
		_create_profil: function () {
			
			var profil = $('<div class="profil"></div>').appendTo(this.home);
			var right = $('<div class="right"></div>').appendTo(profil);
			
			var image = $('<div class="left photo"></div>').appendTo(profil);
			$('<img src="https://graph.facebook.com/' + this.uid + '/picture">').appendTo(image);
			var name = $('<div style="padding-bottom:5px"></div>').appendTo(profil);
			
			$('<a href="#">' + this.name + '</a>').appendTo(name).click(function () {
				
				this._open_profil(this.uid, this.name);
				
			}.bind(this));
			
			var div = $('<div></div>').appendTo(profil);
			var points = $('<span>' + $.options.lang[lang].points + ': </span>').appendTo(div);
			this.options.points = $('<span></span>').appendTo(div);
			
			var div = $('<div></div>').appendTo(profil);
			var classement = $('<span>' + $.options.lang[lang].ranking + ': </span>').appendTo(div);
			this.options.classement = $('<span></span>').appendTo(div);
			
			$('<button>' + $.options.lang[lang].create_game +'</button>').appendTo(right).click(function () {
				
				if (this.tokens && this.tokens.ready) {
					
					if (this.tokens.data >= 1) {
									
						this._create_game();
					}
					else {
						
						this._no_tokens();
					}
				}
				
			}.bind(this));
			
			$('<div class="clear"></div>').appendTo(profil);
		},
		
		_create_menu_game: function () {
			
			var menu = $('<ul class="menu_game"></ul>').appendTo(this.home);
			
			this.games = $('<li></li>').appendTo(menu);
			
			this.defis = $('<li></li>').appendTo(menu);
			
			this.challengers = $('<li></li>').appendTo(menu);
			
			this.friends = $('<li></li>').appendTo(menu);
			
			var games = $('<div id="games"></div>').appendTo(this.home);
			this.list_games = $('<table class="games"></table>').appendTo(games);
		},
		
		_create_tchat: function () {
			
			var tchat = $('<div id="tchat"></div>').appendTo(this.home);
			
			this.tchat = $('<div class="tchat"></div>').appendTo(tchat);
			
			$('<textarea></textarea>').appendTo(tchat).keydown(function(e) {
				
				if (e.which != 13 || !e.target.value) {
					return;
				}
				
				if (e.target.oldValue && e.target.oldValue == e.target.value) {
					return false;
				}
						
				this.socket.emit('EnvoyerMessage', e.target.value);
				
				e.target.oldValue = e.target.value;
				e.target.value = null;
					
				return false;
				
			}.bind(this));
			
			if (this.socket.open) {
			
				this.socket.emit('InitUser');
			}
			
			if (this.options.trophy) {
				
				for (var i in this.options.trophy) {
					
					delete this.options.trophy[i];
					
					this._win_trophy(i);
				}
			}
		},
		
		_clock: function () {
			
			if (!this.clock) {
				return;
			}
			
			var date = new Date(),
				hours = $._sprintf(date.getHours()) + ':' + $._sprintf(date.getMinutes());
			
			$(this.clock).empty().text(hours);
			
		},
		
		_sound: function () {
			
			if (!$('#audio #move')[0].play || !$('#audio #time')[0].play) {
				return;
			}
			
			if (this.options.sound == true) {
				
				$(this.bt_sound).removeClass('sound').addClass('no-sound');
				
				if ($('#audio #move')[0]) {
					
					$('#audio #move')[0].pause();
				}
				
				if ($('#audio #time')[0]) {
					
					$('#audio #time')[0].pause();
				}
				
				this.options.sound = false;
			}
			else {
				
				$(this.bt_sound).removeClass('no-sound').addClass('sound');
				
				this.options.sound = true;
			}
		},
		
		_invite_friends: function () {
			
			if (this.options.send_invite.nb < 30) {
			
				var fade = $('#fade').css('display', 'block');
				var fenetre = $('<div class="fenetre invite" ></div>').appendTo(this.contenu);
			
				$('<div class="close"></div>').appendTo(fenetre).click(function () {

					$('#fade').css('display', 'none');
					$('.fenetre').remove();

				});
			
				var image = $('<div class="photo"></div>').appendTo(fenetre);
				$('<img src="https://graph.facebook.com/' + this.uid + '/picture">').appendTo(image);
				
				$('<h3>' + $.options.lang[lang].invite_friends.title + '</h3>').appendTo(fenetre);
				
				$('<div class="clear"></div>').appendTo(fenetre);
				
				$('<div class="infos">' + $.options.lang[lang].invite_friends.infos + '</div>').appendTo(fenetre);
				
				var menu = $('<ul class="ul-invite"></ul>').appendTo(fenetre);
				
				this.checked = {
					nb:0,
					data:{}
				};
				
				this.invite_all = $('<div class="ct"></div>').appendTo(fenetre);
				this.invite_chess = $('<div class="ct"></div>').css('display', 'none').appendTo(fenetre);
				
				$('<button>' + $.options.lang[lang].invite_friends.send + '</button>').appendTo(fenetre).click(function() {
					
					if (this.checked.data) {
						
						var data = '';
						
						this.options.send_invite.nb += this.checked.nb;
						
						for (var uid in this.checked.data) {
							this.options.send_invite.data.push(uid);
							data += uid + ',';
						}
						
						if (this.options.send_invite.nb >= 30) {
							$(this.options.send_invite.bt).remove();
						}
						
						$.sendInvite(data);
					}
					
					$('#fade').css('display', 'none');
					$('.fenetre').remove();
					
				}.bind(this));
				
				var div  = $('<div class="nb"></div>').appendTo(fenetre);
				
				this.ct_nb = $('<strong>' + this.options.send_invite.nb + '</strong>').appendTo(div);
				$('<span>/30</span>').appendTo(div);
				
				this._all_friends(false, this.invite_all);
				this._all_friends(true, this.invite_chess);
				
				var li = $('<li></li>').appendTo(menu);
				
				$('<a class="selected" href="#">' + $.options.lang[lang].invite_friends.all + '</a>').appendTo(li).click(function (e) {
					$('.ul-invite li a').removeClass('selected').addClass('normal');
					$(e.target).removeClass('normal').addClass('selected');
					$(this.invite_chess).css('display', 'none');
					$(this.invite_all).css('display', 'block');
					return false;
				}.bind(this));
				
				var li = $('<li></li>').appendTo(menu);
				
				$('<a class="normal" href="#">' + $.options.lang[lang].title + '</a>').appendTo(li).click(function (e) {
					$('.ul-invite li a').removeClass('selected').addClass('normal');
					$(e.target).removeClass('normal').addClass('selected');
					$(this.invite_all).css('display', 'none');
					$(this.invite_chess).css('display', 'block');
					return false;
				}.bind(this));
			}
		},
		
		_all_friends: function (bol, div) {
			
			$(div).empty().html();
					
			this.table = $('<table></table>').appendTo(div);
			
			var _i = 0;
			
			for (var i in all_friends) {
			
				if (!bol && !all_friends[i].installed) {
					this._friend(all_friends[i], _i);
					_i++;
				}
				else if (bol && all_friends[i].installed) {
					this._friend(all_friends[i], _i);
					_i++;
				}
			}
		},
		
		_friend: function (data, i) {
			
			if (i%2 == 0) {
				this.tr = $('<tr></tr>').appendTo(this.table);
			}
			
			var td = $('<td class="check"></td>').appendTo(this.tr);
			
			var classes = 'disable',
				checked = 'checked',
				disabled = 'disabled';
			
			if (!$._in_array(data.id, this.options.send_invite.data)) {
				classes = 'checkable';
				checked = '';
				disabled = '';
			}
			
			$('<input type="checkbox" class="' + classes + '" ' + checked + '  ' + disabled + ' />').appendTo(td).click(function () {
				
				var nb = this.options.send_invite.nb + this.checked.nb;
				
				if ($(this).is(':checked')) {
					
					if(nb < 30) {
						
						this.checked.nb++;
						this.checked.data[data.id] = {};
						
						nb++;
						
						$(this.ct_nb).empty().text(nb);
					}
				}
				else {
					
					this.checked.nb--;
					delete this.checked.data[data.id];
					
					nb--;
					
					$(this.ct_nb).empty().text(nb);
					
					$('input.checkable:not(:checked)').removeAttr('disabled');
				}
				
				if (nb >= 30) {
					
					$('input.checkable:not(:checked)').attr("disabled", "disabled");
				}
				else {
					
					$('input.checkable:not(:checked)').removeAttr('disabled');
				}
				
			}.bind(this));
			
			var name = $('<td class="name">' + data.name + '</td>').appendTo(this.tr);
		},
		
		_trophy: function () {
			
			var data_trophy = {};
			
			if (this.trophy.data) {
				
				for (var i in this.trophy.data) {
					data_trophy[this.trophy.data[i].badge] = true;
				}
			}
			
			var fade = $('#fade').css('display', 'block');
			var trophy = $('<div id="trophy" ></div>').appendTo(this.contenu);
			
			$('<div class="close"></div>').appendTo(trophy).click(function () {

				$('#fade').css('display', 'none');
				$('#trophy').remove();

			});
			
			$('<h3>' + $.options.lang[lang].trophy.title + '</h3>').appendTo(trophy);
			
			for (var i in $.options.lang[lang].trophy.content) {
				var classes = (data_trophy[i]) ? $.options.lang[lang].trophy.content[i]._class : 'no-trophy';
				var contentTrophy = $('<div class="trophy _' + i + ' ' + classes +'"></div>').appendTo(trophy);
				var desc = $('<div class="description description_' + i +'"></div>').appendTo(contentTrophy);
				$('<h4>' + $.options.lang[lang].trophy.content[i].title + '</h4>').appendTo(desc);
				$('<p>' + $.options.lang[lang].trophy.content[i].description + '<p>').appendTo(desc);
			}
		},
		
		_win_trophy: function (data) {
			
			var fade = $('#fade').css('display', 'block');
			var trophy = $('<div id="trophy" class="trophy' + data + '"></div>').css('background', 'url(../img/bg-win-trophee.png) no-repeat').appendTo(this.contenu);
			
			$('<div class="close"></div>').appendTo(trophy).click(function () {
				$('#fade').css('display', 'none');
				$('.trophy' + data).remove();
			});
			
			$('<h3>' + $.options.lang[lang].congratulation  + '</h3>').appendTo(trophy);
			
			var div = $('<div class="center"></div>').appendTo(trophy);
			
			$('<div class="trophy-win trophy ' + $.options.lang[lang].trophy.content[data]._class +'"></div>').appendTo(div);
			$('<div class="win">' + $.options.lang[lang].trophy.win  + '</div>').appendTo(div);
			$('<h4>' + $.options.lang[lang].trophy.content[data].title + '</h4>').appendTo(div);
			$('<p>' + $.options.lang[lang].trophy.content[data].description + '<p>').appendTo(div);
			
			var partage = $('<a class="partager" href="#">' + $.options.lang[lang].partager + '</a>').appendTo(trophy).click(function() {
				
				$.partager_trophy(data);
				
				this._partager_trophee(data);
				
				return false;
				
			}.bind(this));
			
		},
		
		_partager_trophee: function (data) {
			
			if (!this.options.partager[data]) {
				
				this.options.partager[data] = true;
				
				var partager = true;
				
				this.socket.emit('share_trophy');
				
				this.tokens.data += 3;
				
				$(this.options.tokens).empty().text(this.tokens.data);
			}
		},
		
		_no_tokens: function() {
			
			var fade = $('#fade').css('display', 'block');
			var fenetre = $('<div class="fenetre" ></div>').appendTo(this.contenu);
			
			$('<div class="close"></div>').appendTo(fenetre).click(function () {
				$('#fade').css('display', 'none');
				$('.fenetre').remove();
			});
			
			$('<h3>' + $.options.lang[lang].no_tokens  + '</h3>').appendTo(fenetre);
			
			var div = $('<div class="center"></div>').appendTo(fenetre);
			
			$('<button class="go-shop">' + $.options.lang[lang].buy_tokens  + '</button>').appendTo(div).click(function() {
				$('#fade').css('display', 'none');
				$('.fenetre').remove();
				this._shop();
			});
			
			$('<button class="go-shop">' + $.options.lang[lang].free_tokens  + '</button>').appendTo(div).click(function() {
				$('#fade').css('display', 'none');
				$('.fenetre').remove();
				this._shop('free');
			});
		},
		
		_shop: function (type) {
			
			var fade = $('#fade').css('display', 'block');
			var shop = $('<div id="shop" ></div>').appendTo(this.contenu);
			
			$('<div class="close"></div>').appendTo(shop).click(function () {
				$('#fade').css('display', 'none');
				$('#shop').remove();
			});
			
			$('<div class="infos"><img src="/img/token.png"/>= 1 ' + $.options.lang[lang].quick_game + '</div>').appendTo(shop);
			
			$('<h3>' + $.options.lang[lang].shop + '</h3>').appendTo(shop);
			
			var menu = $('<ul class="ul-shop"></ul>').appendTo(shop);
			
			this.shop = $('<div></div>').appendTo(shop);
			
			if(type == 'free') {
				
				var buy = 'normal',
					free = 'selected';
				
				this._free_tokens();
			}
			else {
				
				var buy = 'selected',
					free = 'normal';
				
				this._buy_tokens();
			}
			
			var li = $('<li></li>').appendTo(menu);
			$('<a class="' + buy + '" href="#">' + $.options.lang[lang].tokens + '</a>').appendTo(li).click(function (e) {
				$('.ul-shop li a').removeClass('selected').addClass('normal');
				$(e.target).removeClass('normal').addClass('selected');
				this._buy_tokens();
				return false;
			}.bind(this));
			
			var li = $('<li></li>').appendTo(menu);
			$('<a class="' + free + '" href="#">' + $.options.lang[lang].free_tokens + '</a>').appendTo(li).click(function (e) {
				$('.ul-shop li a').removeClass('selected').addClass('normal');
				$(e.target).removeClass('normal').addClass('selected');
				this._free_tokens();
				return false;
			}.bind(this));
		},
		
		_buy_tokens: function () {
			
			FB.api('/me?fields=currency', function (response) {
				
				if (!response.currency) {
					return;
				}
				
				$(this.shop).empty().html();
					
				this.table = $('<table class="token"></table>').appendTo(this.shop);
				
				var tokens = {
					1: {
						token:2000,
						base:500,
						price: $._convert_price(response, 10),
					},
					2: {
						token:1000,
						base:300,
						price: $._convert_price(response, 6)
					},
					3: {
						token:500,
						base:200,
						price: $._convert_price(response, 4)
					},
					4: {
						token:200,
						base:100,
						price: $._convert_price(response, 2)
					},
					5: {
						token:75,
						base:50,
						price: $._convert_price(response, 1)
					}				
				};
				
				for (var i in tokens) {
					this._tokens(tokens[i], i);
				}
				
				$('table.token tr:last').css('border-bottom', '0px');
				
			}.bind(this));
		},
		
		_tokens: function (data, id) {
			
			var tr = $('<tr></tr>').appendTo(this.table);
			
			$('<th class="token"></th>').appendTo(tr);
			
			var td = $('<th class="nb"><span class="total">' + data.token + '</span> ' + $.options.lang[lang].tokens + '<br/><span class="base">' + data.base + ' ' + $.options.lang[lang].tokens + '</span></th>').appendTo(tr);
			var td = $('<th class="button"></th>').appendTo(tr);
			
			$('<button>' + data.price + '</button>').appendTo(td).click(function () {
				this._buy(data, id);
			}.bind(this));
		},
		
		_buy: function (token, id) {
		
			FB.ui({
				method: 'pay',
				action: 'purchaseitem',
				product: 'http://apps.solutionsweb.pro/games/facebook/chess/tokens.php?pack=' + id + '&tokens=' + $.options.lang[lang].tokens + '&desc=' + $.options.lang[lang].buy_tokens,
				quantity: 1
			}, callback);
		
			function callback (data) {
				
				if (data.status != 'completed' || !data.signed_request) {
					return;
				}
				
				this.socket.emit('payment', {
					id: id, 
					token: token.token, 
					signed_request:data.signed_request
				});
			}
		},
		
		_free_tokens: function () {
			
			$(this.shop).empty().html();
			
			var div = $('<div class="center"></div>').appendTo(this.shop);
			
			$('<button class="sponsorpay"></button>').appendTo(div).click(function() {
				this._sponsorpay();
			}.bind(this));
			
			$('<button class="tokenads"></button>').appendTo(div).click(function() {
				this._tokenads();
			}.bind(this));
			
		},
		
		_sponsorpay: function () {
			
			var fade = $('#fade').css('display', 'block');
			var sponsorpay = $('<div id="sponsorpay" ></div>').appendTo(this.contenu);
			
			$('<div class="close"></div>').appendTo(sponsorpay)
			.click(function () {

				$('#fade').css('display', 'none');
				$('#sponsorpay').remove();

			});
			
			$('<iframe src="https://iframe.sponsorpay.com/?appid=11841&uid=' + this.uid + '&currency=' + $.options.lang[lang].tokens + '&lang=' + lang + '&gender=' + (gender ? gender.substr(0, 1) : 'm') + '"></iframe>').appendTo(sponsorpay);
		},
		
		_tokenads: function () {
			
			var fade = $('#fade').css('display', 'block');
			var sponsorpay = $('<div id="sponsorpay" ></div>').appendTo(this.contenu);
			
			$('<div class="close"></div>').appendTo(sponsorpay).click(function () {

				$('#fade').css('display', 'none');
				$('#sponsorpay').remove();

			});
			
			$('<iframe frameborder="0" marginwidth="0" marginheight="0" scrolling="auto" width="600" height="600" src="https://offers.tokenads.com/show?client_id=' + this.uid + '&app_id=4561&dpl=top&width=600&fixed_height=600"></iframe>').appendTo(sponsorpay);
		},
		
		_create_game: function (uid) {
			
			var fade = $('#fade').css('display', 'block');
			var fenetre = $('<div class="fenetre" style="height:200px"></div>').appendTo(this.contenu);
			
			$('<div class="close"></div>').appendTo(fenetre).click(function () {

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
			
			if (!uid) {
				
				var array_points_min = [0, 1300, 1400, 1500, 1600, 1700, 1800];
				var array_points_max = [0, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500];
				
				var form = $('<div class="form"></div>').appendTo(fenetre);
				$('<label>' + $.options.lang[lang].points + '</label>').appendTo(form);
				
				var points_min = $('<select name="points_min"></select>').appendTo(form).change(function() {
					
					$(points_max).empty().html();
					
					$('<option value="0">' + $.options.lang[lang].max + '</option>').appendTo(points_max);
				
					for (var i in array_points_max) {
						if(array_points_max[i] > $(this).val()) $('<option value="' + array_points_max[i] + '">' + array_points_max[i] + '</option>').appendTo(points_max);
					}
				});
				
				$('<option value="0">' + $.options.lang[lang].min + '</option>').appendTo(points_min);
				
				for (var i in array_points_min) {
					if (array_points_min[i] != 0) {
						$('<option value="' + array_points_min[i] + '">' + array_points_min[i] + '</option>').appendTo(points_min);
					}
				}
				
				var points_max = $('<select name="points_max"></select>').appendTo(form);
				
				$('<option value="0">' + $.options.lang[lang].max + '</option>').appendTo(points_max);
				
				for (var i in array_points_max) {
					if (array_points_max[i] != 0) {
						$('<option value="' + array_points_max[i] + '">' + array_points_max[i] + '</option>').appendTo(points_max);
					}
				}
			}
			
			var form = $('<div class="form center"></div>').appendTo(fenetre);
					
			if (uid) {
				
				$('<button>' + $.options.lang[lang].defier +'</button>').appendTo(form).click(function (){
					
					var _color = $(color).val(),
						_time = $(time).val();
						
					if ($._in_array(_time , array_time) && $._in_array(_color , array_color)) {
						
						this.socket.emit('Defis', { 
							uid: uid, 
							color: _color, 
							time: _time 
						});
					}
					
					$('#fade').css('display', 'none');
					$('.fenetre').remove();
					
				}.bind(this));
			}
			else {
				
				$('<button>' + $.options.lang[lang].create_game +'</button>').appendTo(form).click(function (){
					
					var _color = $(color).val(),
						_time = $(time).val(),
						_points_max = $(points_max).val(),
						_points_min = $(points_min).val();
						
					if ($._in_array(_time , array_time) && $._in_array(_color , array_color) && $._in_array(_points_min , array_points_min) && $._in_array(_points_max , array_points_max)) {
						
						this.socket.emit('CreateGame', { 
							color: _color, 
							time: _time, 
							points_min: _points_min, 
							points_max: _points_max 
						});
					}
					
					$('#fade').css('display', 'none');
					$('.fenetre').remove();
					
				}.bind(this));
			}
		},
		
		_change_menu_game: function (menu, menu_game) {
			
			this.socket.emit('updateRoom', menu_game);
			this.menu_game = menu_game;
			$('ul.menu_game li a').removeClass('selected').addClass('normal');
			$(menu).removeClass('normal').addClass('selected');
		},
		
		_games: function (data) {
			
			var classes = 'normal',
				nbGames = 0;
			
			if (this.menu_game == 'games') {
				this._lister(data.games, 'games');
				classes = 'selected';
			}
			
			$(this.games).empty();
			
			for (var uid in data.games) {
				
				var game = data.games[uid];
				
				if (this.uid == uid || (game.points_min <= this.points && (game.points_max == 0 || game.points_max >= this.points))) {
					
					nbGames++;
				}
			}
			
			$('<a class="' + classes + '" href="#">' + nbGames + ' ' + $.options.lang[lang].quick_game + '</a>').appendTo(this.games).click(function (e) {
				this._change_menu_game(e.target, 'games');
				this._lister(data.games, 'games');
				return false;
			}.bind(this));
		},
		
		_defis: function (data) {
			
			var classes = 'normal';
			
			this.all_defis = data.defis;
			this.nb_defis = data.nb;
			
			if (this.menu_game == 'challengers') {
				this._lister(this.all_connected, 'challengers');
			}
			
			if (this.menu_game == 'defis') {
				this._lister(data.defis, 'defis');
				classes = 'selected';
			}
			
			$(this.defis).empty();
			$('<a class="'+ classes +'" href="#">' + data.nb + ' ' + $.options.lang[lang].defi + '</a>').appendTo(this.defis).click(function (e) {
				this._change_menu_game(e.target, 'defis');
				this._lister(data.defis, 'defis');
				return false;
			}.bind(this));
		},
		
		_connected: function (data) {
			
			$(this.connected).empty().text(data + ' ' + $.options.lang[lang].connected);
			
			if (lang == 'ru') {
				$(this.connected).css('font-size', '0.8em');
			}
		},
		
		_challengers: function(data) {
			
			var classes = 'normal';
			
			this.all_connected = data.user;
			
			var _data = {
				nb:0,
				user: {}
			};
			
			if (this.menu_game == 'challengers') {
				
				$(this.list_games).empty().html();
				classes = 'selected';
			}
			
			var i = 0;
			
			for (var uid in data.user) {
				
				if (uid > 0 && this.uid != uid) {
					
					if (this.menu_game == 'challengers') {
						this._afficher('challengers', i, uid, data.user[uid]);
						i++;
					}
					
					if (friends.object[uid]) {
						_data.nb++;
						_data.user[uid] = data.user[uid];
					}
				}
			}
			
			$(this.challengers).empty();
			$('<a class="' + classes + ' connected" href="#">' + $.options.lang[lang].challengers + '</a>').appendTo(this.challengers).click(function (e) {
				this._change_menu_game(e.target, 'challengers');
				this._lister(data.user, 'challengers');
				return false;
			}.bind(this));
			
			var classes = 'normal';
			
			if (this.menu_game == 'friends') {
				this._lister(_data.user, 'friends');
				classes = 'selected';
			}
			
			$(this.friends).empty();
			
			if (_data.nb > 0) {
			
				$('<a class="' + classes + ' connected" href="#">' + _data.nb + ' ' + $.options.lang[lang].friends + '</a>').appendTo(this.friends).click(function (e) {
					this._change_menu_game(e.target, 'friends');
					this._friends(_data);
					return false;
				}.bind(this));
			}
		},
		
		_friends: function(data) {
			
			var classes = 'normal';
			
			this.all_friends = data.user;
			
			if (this.menu_game == 'friends') {
				this._lister(data.user, 'friends');
				classes = 'selected';
			}
			
			$(this.friends).empty();
			$('<a class="' + classes + ' connected" href="#">' + data.nb + ' ' + $.options.lang[lang].friends + '</a>').appendTo(this.friends).click(function (e) {
				this._change_menu_game(e.target, 'friends');
				this._lister(data.user, 'friends');
				return false;
			}.bind(this));
		},
		
		_lister: function (data, type) {
			
			$(this.list_games).empty().html();
			
			var i = 0;
			
			for (var uid in data){
				
				if(this.uid != uid || type != 'challengers') {
					this._afficher(type, i, uid, data[uid]);
					i++;
				}
			}
		},
		
		_afficher: function (type, i, uid, data) {
		
			if (!data.name || !data.points || !data.classement) {
				return;
			}
			
			if (type == 'games' && this.uid != uid) {
					
				if (data.points_min > this.points) {
					return;
				}
				
				if (data.points_max != 0 && data.points_max < this.points) {
					return;
				}
			}
			
			if ($('.games tr:last').attr('class') == 'bg-gris') {
				var tr = $('<tr class="bg-brun"></tr>').appendTo(this.list_games);
			}
			else {
				var tr = $('<tr class="bg-gris"></tr>').appendTo(this.list_games);
			}
			
			$('<td class="images"><img src="https://graph.facebook.com/' + uid + '/picture"/></td>').appendTo(tr).click(function () {
				this._open_profil(uid, data.name);
			}.bind(this));
			
			var nom = $('<td class="nom"></td>').appendTo(tr);
			
			$('<a href="#">' + data.name + '</a>').appendTo(nom).click(function () {
				this._open_profil(uid, data.name);
			}.bind(this));
			
			$('<div><span style="font-weight:normal">' + $.options.lang[lang].points + ': </span>' + data.points + '</div>').appendTo(nom);
			$('<div><span style="font-weight:normal">' + $.options.lang[lang].ranking + ': </span>' + data.classement + '</div>').appendTo(nom);
			
			switch (type) {
				
				case 'games' :
					
					$('<td class="color">' + $.options.lang[lang][data.color] + '</td>').appendTo(tr);
					
					var minute = data.time / 60;
					$('<td class="time">' + minute + ':00</td>').appendTo(tr);
					var play = $('<td class="play"></td>').appendTo(tr);
					
					if (this.uid != uid) {
					
						$('<button>' + $.options.lang[lang].play + '</button>').appendTo(play).click(function() {
							
							if (this.tokens && this.tokens.ready) {
								
								if (this.tokens.data >= 1) {
									this.socket.emit('NewGame', uid);
								}
								else {
									this._no_tokens();
								}
							}
						}.bind(this));
					}
					else {
						
						$('<button>' + $.options.lang[lang].cancel + '</button>').appendTo(play).click(function () {
							this.socket.emit('CancelGame');
						}.bind(this));
					}
					
					break;
					
				case 'defis':
				
					$('<td class="color">' + $.options.lang[lang][data.color] + '</td>').appendTo(tr);
			
					var minute = data.time / 60;
					$('<td class="time">' + minute + ':00</td>').appendTo(tr);
					
					var play = $('<td class="play"></td>').appendTo(tr);
					
					if(data.type == 'reponse') {
						
						$('<button>' + $.options.lang[lang].play + '</button>').appendTo(play).click(function () {
							
							if(this.tokens && this.tokens.ready) {
								
								if(this.tokens.data >= 1) {
									
									this.socket.emit('NewGameDefi', uid);
								}
								else {
										
									this._no_tokens();
								}
							}
							
						}.bind(this));
					}
					
					var close = $('<td class="close"></td>').appendTo(tr);
					
					$('<a href="#" class="close"></a>').appendTo(close).click(function () {
						this.socket.emit('AnnulerDefi', uid);
					}.bind(this));	
					
					break;
					
				case 'challengers':
				case 'friends':
				
					$('<td colspan="2"></td>').appendTo(tr);
			
					var play = $('<td style="width:150px" class="play"></td>').appendTo(tr);
					
					if (this.nb_defis < 5) {
						
						if (this.uid != uid && !this.all_defis[uid]) {
						
							$('<button>' + $.options.lang[lang].defier + '</button>').appendTo(play).click(function(){
							
								if(this.tokens && this.tokens.ready) {
									
									if(this.tokens.data >= 1) {
										this._create_game(uid);
									}
									else {
										this._no_tokens();
									}
								}
							}.bind(this));
						}
					}
					
					break;
			}
		},
		
		_infos_user: function (data) {
			
			var token = parseInt(data.tokens);
			
			this.moderateur = data.moderateur;
			
			this.tokens = {
				ready:true,
				data:token
			};
			
			this.trophy = {
				ready:true,
				data:data.trophy
			};
			
			this.points = data.points;
			
			$(this.options.points).empty().append('<strong>' + data.points + '</strong>');
			$(this.options.classement).empty().append('<strong>' + data.classement + '</strong>');
			$(this.options.tokens).empty().text(token);
			
			this.free_time = data.free;
		},
		
		_free: function () {
			
			if (this.free_time > 0) {
				
				var time = (3600*24) - (Math.round(new Date().getTime() / 1000) - this.free_time);
				
				if (time > 0) {
					
					var heure = Math.floor(time/3600);
					
					time -= (heure*3600);
					
					var minute = Math.floor(time / 60);
					var seconde = Math.floor(time - (minute * 60));
					
					$(this.free_h).empty().text($._sprintf(heure));
					$(this.free_m).empty().text($._sprintf(minute));
					$(this.free_s).empty().text($._sprintf(seconde));
				}
				else {
					this.socket.emit('InitUser');
				}
			}
		},
		
		_open_profil: function (uid, name) {
			
			if (!this.profil) {
				
				this.profil = true;
				this.socket.emit('Profil', uid, name);
			}
		},
		
		_profil: function (data, classement, points, uid, name) {
			
			$('#fade').css('display', 'block');
			var fenetre = $('<div style="height:180px;width:300px;top:160px;left:80px" class="fenetre"></div>').appendTo('.contenu');
			
			$('<div class="close"></div>').appendTo(fenetre).click(function () {
				this.profil = false;
				$('#fade').css('display', 'none');
				$('.fenetre').remove();
			}.bind(this));
			
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
		
			$(this.tchat).empty().html();
			
			for (var id in data){
				this._message(id, data[id]);
			}
		},
		
		_message: function(id, data) {
			
			var date;
			
			if (data.message) {
			
				var div = $('<div class="ct"></div>').prependTo(this.tchat);
				
				if (data.uid == this.uid || this.moderateur) {
					
					var button = $('<div class="close uiCloseButton"></div>').appendTo(div).css('display', 'none').click(function() {
						
						$(div).remove();
						
						this.socket.emit('SupprimerMessage', id);
						
						return false;
						
					}.bind(this));
					
					$(div).mouseover(function() {
						$(button).css('display', 'block');
					}).mouseout(function() {
						$(button).css('display', 'none');
					});
				}
				
				var date = new Date(data.time);
				var date = date.toLocaleString();
				var img = $('<div class="image"></div>').appendTo(div);
				
				$('<img style="width:25px" src="https://graph.facebook.com/' + data.uid + '/picture">').appendTo(img).click(function () {
					this._open_profil(data.uid, data.name);
				}.bind(this));
				
				var mg = $('<div class="mg"></div>').appendTo(div);
				$('<a href="#">' + data.name + '</a> ').appendTo(mg).click(function () {
					this._open_profil(data.uid, data.name);
				}.bind(this));
				
				var message = $('<span></span>').appendTo(mg);
				$(message).empty().text(' ' + data.message);
				
				$('<br/><span class="date">' + date + '</span>').appendTo(mg);
				$('<div class="clear"></div>').appendTo(div);
			}
		},
		
		_new_game: function (jeu) {

			this._50_coup = 0;
			
			this.menu = {
				accueil:false,
				joueur:false,
				classement:false
			};
			
			this.profil = false;
			
			$('#fade').css('display', 'none');
			
			$(this.conteneur).css("height", "680px");
			
			$(this.contenu).empty().html();
				
			this.proposer_nul = 0;
			this.jeu = jeu;
			
			if (this.uid == this.jeu.blanc.uid) {

				var couleur1 = 'noir';
				var couleur2 = 'blanc';
			}
			else if (this.uid == this.jeu.noir.uid) {

				var couleur2 = 'noir';
				var couleur1 = 'blanc';
			}
			
			$('#right').empty().html();
			
			var pieces = $('<div class="pieces"></div>').appendTo('#right');
			
			this.options[couleur1].pieces = $('<div class="' + couleur2 + '"></div>').appendTo(pieces);
			
			this.options[couleur2].pieces = $('<div class="' + couleur1 + '"></div>').css('margin-top', '5px').appendTo(pieces);
			
			var div = $('<div class="profil_jeu"></div>').appendTo(this.contenu);

			this.options[couleur1].img = $('<div class="left"></div>').appendTo(div);
			$('<img style="width:50px" src="https://graph.facebook.com/' + this.jeu[couleur1].uid + '/picture" />').appendTo(this.options[couleur1].img);
			
			var profil_1 = {
				uid: this.jeu[couleur1].uid,
				name: this.jeu[couleur1].name
			};
			
			var nom = $('<div class="nom"></div>').appendTo(div);
			this.options[couleur1].nom = $('<a href="#">' + this.jeu[couleur1].name + '</a>').appendTo(nom).click(function () {
				this._open_profil(profil_1.uid, profil_1.name);
			}.bind(this));

			var time = this.jeu[couleur1].time;
			var time = this._time(time);
			this.options[couleur1].decompte = $('<div class="decompte">' + time + '</div>').appendTo(div);
			var time_tour = this.jeu[couleur1].time_tour;

			if(this.jeu.tour == couleur1){
				var time_tour = this._time(time_tour);
			}
			else{
				var time_tour = '';
			}
			
			this.options[couleur1].decompte_tour = $('<div class="decompte_tour">' + time_tour + '</div>').appendTo(div);
			
			var coup = $('<div id="coup"></div>').appendTo(this.contenu);
			this.options[couleur1].coup = $('<div class="coup"></div>').appendTo(coup);
			this.options[couleur2].coup = $('<div class="coup"></div>').appendTo(coup);
			
			var jeu = $('<div id="jeu_' + couleur2 + '"></div>').appendTo(this.contenu);
			var arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

			for (var a in arr) {
				for (var i = 1; i < 9; i++) {

					var pos = arr[a] + i;
					this._case[pos] = $('<div id="' + pos + '" class="case ' + arr[a] + ' _' + i + '"></div>').appendTo(jeu);

					if (this.jeu.position[pos]) {
						this._jeu(pos, this.jeu.position[pos]);
					}
				}
			}

			var div = $('<div class="profil_jeu"></div>').appendTo(this.contenu);
			
			this.options[couleur2].img = $('<div class="left"></div>').appendTo(div);
			$('<img style="width:50px" src="https://graph.facebook.com/' + this.jeu[couleur2].uid + '/picture" />').appendTo(this.options[couleur2].img);
			
			var profil_2 = {
				uid: this.jeu[couleur2].uid,
				name: this.jeu[couleur2].name
			};
			
			var nom = $('<div class="nom"></div>').appendTo(div);
			this.options[couleur2].nom = $('<a href="#">' + this.jeu[couleur2].name + '</a>').appendTo(nom).click(function () {
				this._open_profil(profil_2.uid, profil_2.name);
			}.bind(this));
			
			var bt = $('<div class="bt"></div>').appendTo(div);
			
			var offer_draw = $.options.lang[lang].offer_draw;
			$('<div><input type="button" value="' + offer_draw + '" />').appendTo(bt).click(function () {
				this._proposer_nul();
			}.bind(this));

			var resign = $.options.lang[lang].resign;
			$('<div><input type="button" value="' + resign + '" />').appendTo(bt).click(function () {
				this._abandonner();
			}.bind(this));
			
			var time = this.jeu[couleur2].time;
			var time = this._time(time);
			this.options[couleur2].decompte = $('<div class="decompte">' + time + '</div>').appendTo(div);
			var time_tour = this.jeu[couleur2].time_tour;

			if (this.jeu.tour == couleur2) {
				var time_tour = this._time(time_tour);
			}
			else {
				var time_tour = '';
			}
			
			this.options[couleur2].decompte_tour = $('<div class="decompte_tour">' + time_tour + '</div>').appendTo(div);
			
			var tchat = $('<div style="margin-top:10px" id="tchat"></div>').appendTo(div);
			this.tchat_jeu = $('<div class="tchat"></div>').appendTo(tchat);
			
			var _id_jeu = this.jeu.id;
			
			$('<textarea></textarea>').appendTo(tchat).keydown(function(e) {
				
				if (e.which != 13 || !e.target.value) {
					return;
				}
				
				if (e.target.oldValue && e.target.oldValue == e.target.value) {
					return false;
				}
				
				this._nouveau_message_jeu(this.name, e.target.value);
						
				this.socket.emit('EnvoyerMessageJeu', { 
					id: _id_jeu, 
					message: e.target.value
				});
				
				e.target.oldValue = e.target.value;
				e.target.value = null;
					
				return false;
				
			}.bind(this));
			
			$(this.options[this.jeu.tour].nom).css('color', '#930');
        },
		
		_message_jeu: function (data) {
			
			if (!this.jeu) {
				return;
			}
				
			var uid = 0;
				
			if (this.uid == this.jeu.blanc.uid) {
				uid = this.jeu.noir.uid;
			}
			else if (this.uid == this.jeu.noir.uid) {
				uid = this.jeu.blanc.uid;
			}
			
			if (data.uid == uid) {
				this._nouveau_message_jeu(data.name, data.message);
			}
		},
		
		_nouveau_message_jeu: function(name, message) {
			
			var div = $('<div style="line-height:1.8em" class="ct"></div>').prependTo(this.tchat_jeu);
			var mg = $('<div class="mg"><strong>' + name + '</strong>: </div>').appendTo(div);
			var msg = $('<span></span>').appendTo(mg);
			$(msg).empty().text(message);
			$('<div class="clear"></div>').appendTo(div);
		},
		
		_load_game: function(data) {
			
			if (!this.jeu) {
				return;
			}
			
			var uid = 0;
			
			if (this.uid == this.jeu.blanc.uid) {
				uid = this.jeu.noir.uid;
			}
			else if (this.uid == this.jeu.noir.uid) {
				uid = this.jeu.blanc.uid;
			}
			
			if(uid && data.uid == uid) {
			
				this.jeu.blanc.time = data.jeu.blanc;
				this.jeu.noir.time = data.jeu.noir;
				
				this._move(data.pion, data.depart, data.arriver, data.mouvement, data.promotion);
			}
		},
		
		_jeu: function (position, pion) {

            var _pion = $('<div class="piece ' + pion.nom + '_' + pion.couleur + '"></div>');
            
            $(this._case[position]).empty().append(_pion);


            if (this.jeu[this.jeu.tour].uid == this.uid) {

                if (pion.couleur == this.jeu.tour) {

                    if (pion.deplacement || pion.capture) {
                        
                    	_pion.draggable({
                            helper: 'clone',
                            zIndex: '99999',
                            start: function (event, ui) {
                                var deplace = pion.deplacement.split('.');
                                for (var d in deplace) {
                                    var i = deplace[d];
                                    if (i) {
                                       this._deplace(position, i, pion);
									}
                                }

                                var capture = pion.capture.split('.');
                                for (var d in capture) {
                                    var i = capture[d];
                                    if (i) {
                                       this._capture(position, i, pion);
									}
                                }
                            }.bind(this),
                            stop: function (event, ui) {
                                var deplace = pion.deplacement.split('.');
                                for (var d in deplace) {
                                    var i = deplace[d];
                                    if (i) { 
                                    	this._case[i].droppable('destroy'); 
                                    }
                                }

                                var capture = pion.capture.split('.');
                                for (var d in capture) {
                                    var i = capture[d];
                                    if (i) { 
                                    	this._case[i].droppable('destroy'); 
                                    }
                                }
                            }.bind(this)
                        });
                    }
                }
            }
        },

        _deplace: function (depart, arriver, pion) {

            this._case[arriver].droppable({

                drop: function (event, ui) {

                    $('.piece').draggable("disable").removeClass('ui-draggable');

                    $(event.target).append(ui.draggable);

                    this._move(pion, depart, arriver, 'deplace', false);
                    
                }.bind(this)
            });
        },
		
		_capture: function (depart, arriver, pion) {

            this._case[arriver].droppable({

                drop: function (event, ui) {
				
					$('.piece').draggable("disable").removeClass('ui-draggable');
					
					$(event.target).empty().append(ui.draggable);

                    this._move(pion, depart, arriver, 'capture', false);
                    
                }.bind(this)
            });
        },

        _prise_passant: function (arriver) {

            var pion = '',
            	lettre = arriver.substr(0, 1),
            	chiffre = arriver.substr(-1);

            switch (chiffre) {
            
                case '3':
                    $(this._case[lettre + '4']).empty().html();
					
					pion = this.jeu.position[lettre + '4'].nom;

                    delete this.jeu.position[lettre + '4'];

                    break;

                case '6':
                    $(this._case[lettre + '5']).empty().html();
					
					pion = this.jeu.position[lettre + '5'].nom;

                    delete this.jeu.position[lettre + '5'];

                    break;

            }
			
			return pion;
        },
		
        _promotion: function (nom, pion, depart, arriver, mouvement) {

            $('<div class="piece ' + nom + '_' + pion.couleur + '"></div>').appendTo(this.fenetre).click(function () {

                $('#fade').css('display', 'none');
                $('#fenetre_piece').remove();
                $('#' + arriver).empty().append(this);

                this.jeu.position[arriver].nom = nom;

                this._charge(depart, arriver, pion, mouvement, nom);
            }.bind(this));
        },

        _move: function (pion, depart, arriver, mouvement, promotion) {

            if(this.options.sound && $('#audio #move')[0]) {
            	$('#audio #move')[0].play();
            }
			
			if (mouvement == 'deplace') {
				
				var extension = '',
					signe = ' ';

				if (pion.nom == 'roi' && pion.move == 0) {

					reg = new RegExp('^(c1|g1|c8|g8)$');

					if (reg.test(arriver)) {

						var lettre = arriver.substr(0, 1),
							chiffre = arriver.substr(-1);

						switch (lettre) {
							
							case 'c':

								$(this._case['d' + chiffre]).append($(this._case['a' + chiffre]).children());
								$(this._case['a' + chiffre]).empty().html();

								this.jeu.position['d' + chiffre] = {
									nom: this.jeu.position['a' + chiffre].nom,
									couleur: this.jeu.position['a' + chiffre].couleur,
									deplacement: '',
									capture: '',
									move: 1
								};

								delete this.jeu.position['a' + chiffre];

								extension = ' 0-0-0';

								break;

							case 'g':

								$(this._case['f' + chiffre]).append($(this._case['h' + chiffre]).children());
								$(this._case['h' + chiffre]).empty().html();

								this.jeu.position['f' + chiffre] = {
									nom: this.jeu.position['h' + chiffre].nom,
									couleur: this.jeu.position['h' + chiffre].couleur,
									deplacement: '',
									capture: '',
									move: 1
								};

								delete this.jeu.position['h' + chiffre];

								extension = ' 0-0';

								break;

						}
					}
				}
			}
			else if(mouvement == 'capture') {
			
				var extension = '',
					signe = 'x',
					piece = '';

				if (!this.jeu.position[arriver]) {

					piece = this._prise_passant(arriver);

					extension = ' e.p.';
				}
				else {
					
					piece = this.jeu.position[arriver].nom;
				}
					

				if (pion.couleur == 'blanc') {

					this.jeu.noir.pieces = this.jeu.noir.pieces - 1;
					
					$(this.options.noir.pieces).append('<div class="piece ' + piece + '"></div>');
				}
				else {
					
					this.jeu.blanc.pieces = this.jeu.blanc.pieces - 1;
					
					$(this.options.blanc.pieces).append('<div class="piece ' + piece + '"></div>');
				}
			}

            this.position_en_passant = [];
			
			if (this.jeu.position[depart].nom == 'pion') {

				if (this.jeu.position[depart].move == 0) {

                    if (this.jeu.position[depart].couleur == 'blanc') {

                        var _prise = 3,
                        	_arriver = 4;
                    }
                    else {

                        var _prise = 6,
                        	_arriver = 5;
                    }

                    this.chiffre = arriver.substr(-1);

                    if (this.chiffre == _arriver) {

                        var lettre = arriver.substr(0, 1);

                        this.prise_en_passant = lettre + _prise;

                        var lettre = this._lettre_chiffre(lettre);

                        this.lettre = lettre + 1;

                        if (this._verif_position()) {

                            this.position_en_passant.push(this._position());
                        }

                        this.lettre = lettre - 1;

                        if (this._verif_position()) {

                            this.position_en_passant.push(this._position());
                        }
                    }
                }
            }

            delete this.jeu.position[depart];

            this.jeu.position[arriver] = {
                nom: pion.nom,
                couleur: pion.couleur,
                deplacement: '',
                capture: '',
                move: 1
            };

            if (pion.nom == 'roi') {
            	this.jeu[pion.couleur].roi.position = arriver;
            }
			
			if(pion.nom == 'pion' || mouvement == 'capture') {
				this._50_coup = 0;
			}
			else {
				this._50_coup ++;
			}
			
			$('.case').css('background', "");
			
			$(this._case[depart]).css('background', '#930');
			$(this._case[arriver]).css('background', '#930');
			
			$(this.options[this.jeu.tour].coup).prepend('<div>' + depart + signe + arriver + extension + '</div>');

            if (pion.nom == 'pion' && arriver.substr(-1) == 1 || pion.nom == 'pion' && arriver.substr(-1) == 8) {

				if(this.jeu[this.jeu.tour].uid == this.uid) {
					
					$('#fade').css('display', 'block');

					this.fenetre = $('<div id="fenetre_piece"></div>').appendTo('#conteneur');

					var arr = ['reine', 'tour', 'fou', 'cavalier'];

					for (var i in arr) {

						this._promotion(arr[i], pion, depart, arriver, mouvement);
					}
				}
				else {
					
					this.jeu.position[arriver].nom = promotion;
					this._charge(depart, arriver, pion, mouvement, false);
				}
			}
			else {
			
				this._charge(depart, arriver, pion, mouvement, false);
			}
        },
		
		_charge: function (depart, arriver, pion, mouvement, promotion) {

            if (this.jeu[this.jeu.tour].uid == this.uid) {
			
				if (this.jeu.time == 5400) {
					this.jeu[this.jeu.tour].time += 30;
				}
				
				this.socket.emit('loadGame', {
					id: this.jeu.id,
					mouvement: mouvement,
					depart: depart,
					arriver: arriver,
					pion: pion,
					promotion: promotion,
					blanc: this.jeu.blanc.time,
					noir: this.jeu.noir.time
				});
			}
			else {
				$(this._case[depart]).empty().html();
				var _pion = $('<div class="piece ' + pion.nom + '_' + pion.couleur + '"></div>');
				$(this._case[arriver]).empty().append(_pion);
			}
			
			if (this.jeu[this.jeu.tour].time > this.jeu[this.jeu.tour].time_tour) {
				this.jeu[this.jeu.tour].time_tour = this.jeu.time_tour;
			}
			else {
				this.jeu[this.jeu.tour].time_tour = this.jeu[this.jeu.tour].time;
			}

            if (this.jeu.tour == 'blanc') {
            	this.jeu.tour = 'noir';
            }
            else {
            	this.jeu.tour = 'blanc';
            }

            this.jeu.blanc.roi.deplacement_interdit = [];
            this.jeu.noir.roi.deplacement_interdit = [];

            this.roi_echec = false;
            this.roi_echec_deplacement = false;

            var couleur = ["blanc", "noir"];

            for (var i in couleur) {

                this.pion_position = this.jeu[couleur[i]].roi.position;
                this.pion_couleur = couleur[i];

                var lettre = parseInt(this._lettre_chiffre(this.pion_position.substr(0, 1))),
                	chiffre = parseInt(this.pion_position.substr(-1));

                this.lettre = lettre;
                this.chiffre = chiffre + 1;
                this._verif_roi_interdit();

                this.chiffre = chiffre - 1;
                this._verif_roi_interdit();

                this.lettre = lettre - 1;
                this._verif_roi_interdit();

                this.chiffre = chiffre + 1;
                this._verif_roi_interdit();

                this.lettre = lettre + 1;
                this._verif_roi_interdit();

                this.chiffre = chiffre - 1;
                this._verif_roi_interdit();

                this.chiffre = chiffre;
                this._verif_roi_interdit();

                this.lettre = lettre - 1;
                this._verif_roi_interdit();

            }

            for (var i in this.jeu.position) {

                var pion = this.jeu.position[i];

                if (this.jeu.tour == pion.couleur && pion.nom != 'roi') {

                    if (this.jeu[pion.couleur].pieces < 3) {

                        this.options[pion.couleur].piece_reste = {
                        	nom: pion.nom,
                            position: i
                        };
                    }

                    this.pion_position = i;
                    this.pion_nom = pion.nom;
                    this.pion_couleur = pion.couleur;
                    this.pion_deplacement = pion.deplacement;
                    this.pion_move = pion.move;

                    this._deplacement();

                    var deplacement = '',
                    	capture = '';

                    if (this.deplacement.length > 0) {
                    	deplacement = this.deplacement.join('.');
                    }

                    if (this.capture.length > 0) {
                    	capture = this.capture.join('.');
                    }


                    this.jeu.position[i].deplacement = deplacement;
                    this.jeu.position[i].capture = capture;
                }
            }

            for (var i in this.jeu.position) {

                var pion = this.jeu.position[i];

                if (this.jeu.tour != pion.couleur && pion.nom != 'roi') {

                    if (this.jeu[pion.couleur].pieces < 3) {

                        this.options[pion.couleur].piece_reste = {
                        	nom: pion.nom,
                            position: i
                        };
                    }

                    this.pion_position = i;
                    this.pion_nom = pion.nom;
                    this.pion_couleur = pion.couleur;
                    this.pion_deplacement = pion.deplacement;
                    this.pion_move = pion.move;

                    this._deplacement();

                    var deplacement = "";
                    var capture = "";

                    if (this.deplacement.length > 0) {
                    	deplacement = this.deplacement.join('.');
                    }

                    if (this.capture.length > 0) {
                    	capture = this.capture.join('.');
                    }


                    this.jeu.position[i].deplacement = deplacement;
                    this.jeu.position[i].capture = capture;

                }
            }

            this.nul = false;

            if (this.jeu.blanc.pieces < 3 && this.jeu.noir.pieces < 3) {

                if (this.jeu.blanc.pieces == 1 && this.jeu.noir.pieces == 1) {
                	this.nul = true;
                }
                else if (this.jeu.blanc.pieces == 1) {

                    switch (this.options.noir.piece_reste.nom) {

                        case 'cavalier':
                        case 'fou':

                            this.nul = true;

                            break;
                    }
                }
                else if (this.jeu.noir.pieces == 1) {

                    switch (this.options.blanc.piece_reste.nom) {

                        case 'cavalier':
                        case 'fou':

                            this.nul = true;

                            break;
                    }
                }
                else if (this.options.blanc.piece_reste.nom == 'fou' && this.options.noir.piece_reste.nom == 'fou') {

                    var lettre = this._lettre_chiffre(this.options.blanc.piece_reste.position.substr(0, 1)),
                    	chiffre = this.options.blanc.piece_reste.position.substr(-1);

                    var blanc = parseInt(lettre) + parseInt(chiffre);

                    var lettre = this._lettre_chiffre(this.options.noir.piece_reste.position.substr(0, 1)),
                    	chiffre = this.options.noir.piece_reste.position.substr(-1);

                    var noir = parseInt(lettre) + parseInt(chiffre);

                    if (blanc % 2 == noir % 2) {
                        this.nul = true;
                    }
                }
            }

            this.pat = true;

            for (var i in this.jeu.position) {

                var pion = this.jeu.position[i];

                if (pion.nom == 'roi') {

                    this.pion_position = i;
                    this.pion_nom = pion.nom;
                    this.pion_couleur = pion.couleur;
                    this.pion_deplacement = pion.deplacement;
                    this.pion_move = pion.move;

                    this._deplacement();

                    var deplacement = '',
                    	capture = '';

                    if (this.deplacement.length > 0) {

                        deplacement = this.deplacement.join('.');

                        if (this.jeu.tour == this.pion_couleur) {
                        	this.pat = false;
                        }
                    }

                    if (this.capture.length > 0) {

                        capture = this.capture.join('.');

                        if (this.jeu.tour == this.pion_couleur) {
                        	this.pat = false;
                        }
                    }

                    this.jeu.position[i].deplacement = deplacement;
                    this.jeu.position[i].capture = capture;

                }
                else if (this.pat == true && this.jeu.tour == pion.couleur) {

                    if (pion.deplacement || pion.capture) {
                    	this.pat = false;
                    }
                }
            }
			
            this.mat = false;

            if (this.roi_echec) {

                this.mat = true;

                var key = this.jeu[this.jeu.tour].roi.position,
                	pion = this.jeu.position[key];

                if(pion.deplacement || pion.capture){
                    this.mat = false;
                }

                for (var i in this.jeu.position) {

                    var pion = this.jeu.position[i];

                    if (this.jeu.tour == pion.couleur && pion.nom != 'roi') {

                        var deplacement = [],
                        	capture = '';
						
						if (this.roi_echec == 1) {

							if (pion.deplacement) {

								if (this.roi_echec_deplacement) {

									for (var a in this.roi_echec_deplacement) {

										var val = this.roi_echec_deplacement[a];

										var _deplacement = pion.deplacement.split('.');

										if ($._in_array(val, _deplacement)) {

											this.mat = false;

											deplacement.push(val);
										}
									}
								}
							}

							if (pion.capture) {

								var _capture = pion.capture.split('.');

								if ($._in_array(this.roi_echec_capture, _capture)) {

									this.mat = false;

									capture = this.roi_echec_capture;
								}
							}
						}

                        var deplacement = (deplacement.length > 0) ? deplacement.join('.') : '';

                        this.jeu.position[i].deplacement = deplacement;
                        this.jeu.position[i].capture = capture;
                    }
                }
            }
			
			if (!this.jeu.sauvegarde) {
				this.jeu.sauvegarde = {};
			}
				
			if (!this.jeu.coup) {
				this.jeu.coup = 0;
			}
			
			var _position = [];
			
			for (var i in this.jeu.position) {
				_position.push(i);
			}
			
			_position.sort();
			
			var val = '';
			
			for (var i in _position) {
				val += _position[i] + this.jeu.position[_position[i]].nom + this.jeu.position[_position[i]].couleur;
			} 
			
			var position = 0;
			
			for (var i in this.jeu.sauvegarde) {
				if (val == this.jeu.sauvegarde[i].code) {
					position++;
				}
			}
			
			if ((this._50_coup >= 50 || position >= 3) && this.jeu[this.jeu.tour].uid == this.uid) {
				this._possible_nul();
			}
			
			var position = JSON.stringify(this.jeu.position);
			
			this.jeu.coup++;
			
			this.jeu.sauvegarde[this.jeu.coup] = {
				code: val,
				depart: depart,
				arriver: arriver,
				jeu: JSON.parse(position)
			};
			
			if (this.mat == true) {

                this.jeu.terminer = 1;
                this.jeu.resultat.nom = 'mat';

                if (this.jeu.tour == 'noir') {
                    this.jeu.resultat.vainqueur = 1;
                }
                else {
                    this.jeu.resultat.vainqueur = 2;
                }
            }
			else if (this.pat == true || this.nul == true) {
					
				this.jeu.terminer = 1;
                this.jeu.resultat.vainqueur = 0;

                if (this.pat == true) {
                	this.jeu.resultat.nom = 'pat';
                }
                else {
                	this.jeu.resultat.nom = 'nul';
                }
            }
			
			this.jeu.blanc.roi.deplacement_interdit = '';
            this.jeu.noir.roi.deplacement_interdit = '';
			
			$('.nom a').css('color', '#3b5998');

            if (this.jeu.terminer == 0) {

                $(this.options[this.jeu.tour].nom).css('color', '#930');

                for (var i in this.jeu.position) {
                	this._jeu(i, this.jeu.position[i]);
                }
            }
			else if (this.jeu[this.jeu.tour].uid != this.uid) {
				this._set_resultat();
				this._resultat();
			}
		},
		
		_deplacement: function () {

            this.sauvegarde_capture = '';
            this.deplacement_avant_roi = '';
            this.deplacement = [];
            this.capture = [];

            var lettre = parseInt(this._lettre_chiffre(this.pion_position.substr(0, 1))),
            	chiffre = parseInt(this.pion_position.substr(-1));

            switch (this.pion_nom) {

                case 'roi':

                    if (this.roi_echec == false && this.pion_move == 0) {
                        this._verif_roque();
                    }

                    this.lettre = lettre;
                    this.chiffre = chiffre + 1;
                    this._verif_roi();

                    this.chiffre = chiffre - 1;
                    this._verif_roi();

                    this.lettre = lettre - 1;
                    this._verif_roi();

                    this.chiffre = chiffre + 1;
                    this._verif_roi();

                    this.lettre = lettre + 1;
                    this._verif_roi();

                    this.chiffre = chiffre - 1;
                    this._verif_roi();

                    this.chiffre = chiffre;
                    this._verif_roi();

                    this.lettre = lettre - 1;
                    this._verif_roi();

                    break;

                case 'reine':
                case 'tour':

                    this.stop = false;
					this.roi_echec_interdit = false;
                    this._deplacement_avant_roi = [];
                    this._deplacement_echec_roi = [];

                    for (this.i = 1; this.i < 9; this.i++) {

                        this.lettre = lettre;
                        this.chiffre = chiffre + this.i;
                        this._verif_reine_tour_fou();
                    }


                    this.stop = false;
					this.roi_echec_interdit = false;
                    this._deplacement_avant_roi = [];
                    this._deplacement_echec_roi = [];

                    for (this.i = 1; this.i < 9; this.i++) {

                        this.lettre = lettre + this.i;
                        this.chiffre = chiffre;
                        this._verif_reine_tour_fou();
                    }


					this.stop = false;
					this.roi_echec_interdit = false;
                    this._deplacement_avant_roi = [];
                    this._deplacement_echec_roi = [];

                    for (this.i = 1; this.i < 9; this.i++) {

                        this.lettre = lettre;
                        this.chiffre = chiffre - this.i;
                        this._verif_reine_tour_fou();
                    }

                    this.stop = false;
					this.roi_echec_interdit = false;
                    this._deplacement_avant_roi = [];
                    this._deplacement_echec_roi = [];

                    for (this.i = 1; this.i < 9; this.i++) {

                        this.lettre = lettre - this.i;
                        this.chiffre = chiffre;
                        this._verif_reine_tour_fou();
                    }


                    if (this.pion_nom == 'tour') {
                        break;
                    }

                case 'reine':
                case 'fou':

                    this.stop = false;
					this.roi_echec_interdit = false;
                    this._deplacement_avant_roi = [];
                    this._deplacement_echec_roi = [];

                    for (this.i = 1; this.i < 9; this.i++) {

                        this.lettre = lettre + this.i;
                        this.chiffre = chiffre + this.i;
                        this._verif_reine_tour_fou();

                    }

					this.stop = false;
					this.roi_echec_interdit = false;
                    this._deplacement_avant_roi = [];
                    this._deplacement_echec_roi = [];

                    for (this.i = 1; this.i < 9; this.i++) {

                        this.lettre = lettre - this.i;
                        this.chiffre = chiffre - this.i;
                        this._verif_reine_tour_fou();

                    }

                    this.stop = false;
					this.roi_echec_interdit = false;
                    this._deplacement_avant_roi = [];
                    this._deplacement_echec_roi = [];

                    for (this.i = 1; this.i < 9; this.i++) {

                        this.lettre = lettre + this.i;
                        this.chiffre = chiffre - this.i;
                        this._verif_reine_tour_fou();

                    }

                    this.stop = false;
					this.roi_echec_interdit = false;
                    this._deplacement_avant_roi = [];
                    this._deplacement_echec_roi = [];

                    for (this.i = 1; this.i < 9; this.i++) {

                        this.lettre = lettre - this.i;
                        this.chiffre = chiffre + this.i;
                        this._verif_reine_tour_fou();

                    }

                    break;

                case 'cavalier':

                    this.lettre = lettre - 2;
                    this.chiffre = chiffre - 1;
                    this._verif_cavalier();

                    this.chiffre = chiffre + 1;
                    this._verif_cavalier();

                    this.lettre = lettre + 2;
                    this._verif_cavalier();

                    this.chiffre = chiffre - 1;
                    this._verif_cavalier();

                    this.lettre = lettre + 1;
                    this.chiffre = chiffre + 2;
                    this._verif_cavalier();

                    this.chiffre = chiffre - 2;
                    this._verif_cavalier();

                    this.lettre = lettre - 1;
                    this._verif_cavalier();

                    this.chiffre = chiffre + 2;
                    this._verif_cavalier();

                    break;

                case 'pion':

                    if (this.prise_en_passant && this.jeu.tour == this.pion_couleur) {

                        if ($._in_array(this.pion_position, this.position_en_passant)) {

                            this.capture.push(this.prise_en_passant);
                        }
                    }

                    if (this.pion_couleur == 'blanc') {
                    	this.chiffre = chiffre + 1;
                    }
                    else {
                    	this.chiffre = chiffre - 1;
                    }

                    this.lettre = lettre + 1;
                    this._verif_capture_pion();

                    this.lettre = lettre - 1;
                    this._verif_capture_pion();

                    this.lettre = lettre;
                    this._verif_deplacement_pion();

                    if (this.deplacement.length > 0) {

                        if (this.pion_move == 0) {

                            if (this.pion_couleur == 'blanc') {
                                this.chiffre = chiffre + 2;
                            }
                            else {
                                this.chiffre = chiffre - 2;
                            }

                            this.lettre = lettre;
                            this._verif_deplacement_pion();
                        }
                    }

                    break;
            }

        },

        _verif_roque: function () {

        	if (this.pion_couleur == 'blanc') {
        		var _chiffre = 1,
        			_couleur = 'noir';
            }
            else {
            	var _chiffre = 8,
                	_couleur = 'blanc';
            }

            var roi_interdit = this.jeu[_couleur].roi.deplacement_interdit;

            if (this.jeu.position['a' + _chiffre]) {

                var nom = this.jeu.position['a' + _chiffre].nom,
                	couleur = this.jeu.position['a' + _chiffre].couleur,
                	move = this.jeu.position['a' + _chiffre].move;

                if (nom == 'tour' && couleur == this.pion_couleur && move == 0) {

                    var deplacement = this.jeu.position['a' + _chiffre].deplacement;

                    reg = new RegExp('b' + _chiffre + '.c' + _chiffre + '.d' + _chiffre);

                    if (reg.test(deplacement) && !$._in_array('b' + _chiffre, roi_interdit) && !$._in_array('c' + _chiffre, roi_interdit) && !$._in_array('d' + _chiffre, roi_interdit)) {

                        this.deplacement.push('c' + _chiffre);
                    }
                }
            }

            if (this.jeu.position['h' + _chiffre]) {

                var nom = this.jeu.position['h' + _chiffre].nom,
                	couleur = this.jeu.position['h' + _chiffre].couleur,
                	move = this.jeu.position['h' + _chiffre].move;

                if (nom == 'tour' && couleur == this.pion_couleur && move == 0) {

                    var deplacement = this.jeu.position['h' + _chiffre].deplacement;

                    reg = new RegExp('g' + _chiffre + '.f' + _chiffre);

                    if (reg.test(deplacement) && !$._in_array('g' + _chiffre, roi_interdit) && !$._in_array('f' + _chiffre, roi_interdit)) {

                        this.deplacement.push('g' + _chiffre);
                    }
                }
            }
        },

        _verif_roi_interdit: function () {

            if (this._verif_position()) {
            	this.jeu[this.pion_couleur].roi.deplacement_interdit.push(this._position());
            }
        },

        _verif_roi: function () {

            if (this._verif_position()) {

                this.position = this._position();

                if (this._verif_capture_roi()) {
                	this.capture.push(this.position);
                }
                else if (this._verif_deplacement_roi()) {
                	this.deplacement.push(this.position);
                }
            }
        },

        _verif_capture_roi: function () {

            if (this._verif_capture()) {

                var couleur = (this.pion_couleur == 'blanc') ? 'noir' : 'blanc';

                return !$._in_array(this.position, this.jeu[couleur].roi.deplacement_interdit);
            }
        },

        _verif_deplacement_roi: function () {

            if (this._verif_deplacement()) {

            	 var couleur = (this.pion_couleur == 'blanc') ? 'noir' : 'blanc';

                return !$._in_array(this.position, this.jeu[couleur].roi.deplacement_interdit);
            }
        },

        _verif_reine_tour_fou: function () {

            if (this._verif_position()) {

                this.position = this._position();

                if (this.stop == false) {

                    if (this._verif_capture()) {

                        this.capture.push(this.position);

                        this.sauvegarde_capture = this.position;

                        if (this.jeu.tour != this.pion_couleur) {
                        	
                        	var couleur = (this.pion_couleur == 'blanc') ? 'noir' : 'blanc';
                        	
                            if (this.jeu[couleur].roi.position == this.position) {

                                this.roi_echec++;
                                this.roi_echec_deplacement = this._deplacement_echec_roi;
                                this.roi_echec_capture = this.pion_position;
                                this.roi_echec_interdit = true;
                            }

                            this.stop = true;

                        }
                        else {
                        	this.i = 8;
                        }
                    }
                    else if (this._verif_deplacement()) {

                        this.deplacement.push(this.position);
                        this._deplacement_avant_roi.push(this.position);
                        this._deplacement_echec_roi.push(this.position);

                        this.jeu[this.pion_couleur].roi.deplacement_interdit.push(this.position);

                    }
                    else {

                        this.jeu[this.pion_couleur].roi.deplacement_interdit.push(this.position);

                        this.i = 8;
                    }
                }
                else if (this.jeu.tour != this.pion_couleur) {

                	var couleur = (this.pion_couleur == 'blanc') ? 'noir' : 'blanc';

                    if (this._verif_capture()) {

                        if (this.jeu[couleur].roi.position == this.position) {

                            this.capture_avant_roi = this.sauvegarde_capture;

                            this.deplacement_avant_roi = this._deplacement_avant_roi;

                            this._piece_avant_roi();
                        }

                        this.i = 8;
                    }
                    else if (this._verif_deplacement()) {

                        if (this.roi_echec_interdit == true) {
                        	
                        	this.jeu[this.pion_couleur].roi.deplacement_interdit.push(this.position);
                        }

                        this._deplacement_avant_roi.push(this.position);

                    }
                    else {
					
						if (this.roi_echec_interdit == true) {
							
							this.jeu[this.pion_couleur].roi.deplacement_interdit.push(this.position);
						}
						
                        this.i = 8;
                    }
                }
                else {

                    this.i = 8;
                }
            }
        },

        _piece_avant_roi: function () {

            if (this.pion_nom == 'reine' || this.pion_nom == 'tour' || this.pion_nom == 'fou') {

                var key = this.sauvegarde_capture;

                var pion_nom = this.jeu.position[key].nom,
                	pion_deplacement = this.jeu.position[key].deplacement,
                	pion_capture = this.jeu.position[key].capture,
                	pion_move = this.jeu.position[key].move;

                var deplacement = '',
                	capture = '';

                if (pion_nom == 'reine' || this.pion_nom == pion_nom) {

                    capture = this.pion_position;

                    if (this.deplacement_avant_roi) {
                    	
                    	deplacement = this.deplacement_avant_roi.join('.');
                    }
                }
                else if (this.pion_nom == 'reine' && pion_nom != 'cavalier' && pion_nom != 'pion') {

                    var _capture = pion_capture.split('.');

                    if ($._in_array(this.pion_position, _capture)) {

                        capture = this.pion_position;

                        if (this.deplacement_avant_roi) {

                            deplacement = this.deplacement_avant_roi.join('.');
                        }
                    }
                }
                else if (pion_nom == 'pion') {

                    var lettre = this._lettre_chiffre(this.pion_position.substr(0, 1)),
                    	lettre_pion = this._lettre_chiffre(key.substr(0, 1));

                    var _deplacement = pion_deplacement.split('.');

                    if (lettre == lettre_pion && !$._in_array(this.pion_position, _deplacement)) {

                        deplacement = pion_deplacement;
                    }

                    var _capture = pion_capture.split('.');
				
                    if ($._in_array(this.pion_position, _capture)){
					
                        capture = this.pion_position;
                    }
                }

                this.jeu.position[key].deplacement = deplacement;
                this.jeu.position[key].capture = capture;
            }

        },


        _verif_cavalier: function () {

            if (this._verif_position()) {

                this.position = this._position();

                if (this._verif_capture()) {

                    this.capture.push(this.position);

                }
                else if (this._verif_deplacement()) {

                    this.deplacement.push(this.position);

                }

                var couleur = (this.pion_couleur == 'blanc') ? 'noir' : 'blanc';

                if (this.jeu.tour != this.pion_couleur) {

                    if (this.jeu[couleur].roi.position == this.position) {

                        this.roi_echec++;

                        this.roi_echec_capture = this.pion_position;
                    }
                }

                this.jeu[this.pion_couleur].roi.deplacement_interdit.push(this.position);

            }

        },

        _verif_capture_pion: function () {

            if (this._verif_position()) {

                this.position = this._position();

                if (this._verif_capture()) {

                    this.capture.push(this.position);
                }

                if (this.jeu.tour != this.pion_couleur) {

                    var couleur = (this.pion_couleur == 'blanc') ? 'noir' : 'blanc';

                    if (this.jeu[couleur].roi.position == this.position) {

                        this.roi_echec++;

                        this.roi_echec_capture = this.pion_position;

                    }

                }

                this.jeu[this.pion_couleur].roi.deplacement_interdit.push(this.position);
            }

        },

        _verif_deplacement_pion: function () {

            if (this._verif_position()) {

                this.position = this._position();

                if (this._verif_deplacement()) {

                    this.deplacement.push(this.position);

                }
            }
        },

        _verif_capture: function () {

            if (this._verif_piece()) {

                return this.jeu.position[this.position].couleur != this.pion_couleur;

            }

        },

        _verif_deplacement: function () {

            return !this.jeu.position[this.position];
        },

        _verif_piece: function () {

            return this.jeu.position[this.position];

        },

        _verif_position: function () {

            return this.lettre > 0 && this.lettre < 9 && this.chiffre > 0 && this.chiffre < 9;
        },

        _position: function () {

            return this._chiffre_lettre(this.lettre) + this.chiffre;
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
			
			var fenetre = $('<div class="fenetre"></div>').appendTo(this.contenu);

			$('<div class="close"></div>').appendTo(fenetre).click(function () {

				$('.fenetre').remove();
			});

			var draw = $.options.lang[lang].draw;

			$('<div style="font-weight:bold;font-size:20px;margin:0 0 10px 20px">' + draw + ' ?</div>').appendTo(fenetre);

			var div = $('<div class="form"></div>').appendTo(fenetre);

			var ok = $.options.lang[lang].ok;
			var cancel = $.options.lang[lang].cancel;

			$('<button>' + ok + '</button>').appendTo(div).click(function () {

				$('.fenetre').remove();

				this.jeu.terminer = 1;
				this.jeu.resultat.vainqueur = 0;
				this.jeu.resultat.nom = 'nul';

				this._set_resultat();
				this._resultat();

			}.bind(this));

			$('<button>' + cancel + '</button>').appendTo(div).click(function () {

				$('.fenetre').remove();
			});
		},

        _proposer_nul: function () {

            if (this.proposer_nul < 3 && this.jeu.terminer == 0) {
				
				var fenetre = $('<div class="fenetre"></div>').appendTo(this.contenu);

				$('<div class="close"></div>').appendTo(fenetre).click(function () {

					$('.fenetre').remove();
				});

				var offer_draw = $.options.lang[lang].offer_draw;

				$('<div style="font-weight:bold;font-size:20px;margin:0 0 10px 20px">' + offer_draw + ' ?</div>').appendTo(fenetre);
				var div = $('<div class="form"></div>').appendTo(fenetre);

				var ok = $.options.lang[lang].ok;
				var cancel = $.options.lang[lang].cancel;

				$('<button>' + ok + '</button>').appendTo(div).click(function () {

					$('.fenetre').remove();

					this.socket.emit('ProposerNul', {
						id: this.jeu.id
					});
					
					this.proposer_nul++;
					
				}.bind(this));

				$('<button>' + cancel + '</button>').appendTo(div).click(function () {

					$('.fenetre').remove();
				});
			}
        },

        _reponse_nul: function (data) {

            if (this.jeu) {
			
				var uid = 0;
				
				if (this.uid == this.jeu.blanc.uid) {
					uid = this.jeu.noir.uid;
				}
				else if(this.uid == this.jeu.noir.uid) {
					uid = this.jeu.blanc.uid;
				}
				
				if(this.jeu.terminer == 0 && data.uid == uid) {

					var fenetre = $('<div class="fenetre"></div>').appendTo(this.contenu);

					$('<div class="close"></div>').appendTo(fenetre).click(function () {

						$('.fenetre').remove();
					});

					var offers_a_draw = $.options.lang[lang].offers_a_draw;

					$('<div style="font-weight:bold;font-size:20px;margin:0 0 10px 20px">' + data.name + ' ' + offers_a_draw + '.</div>').appendTo(fenetre);

					var div = $('<div class="form"></div>').appendTo(fenetre);

					var ok = $.options.lang[lang].ok;
					var cancel = $.options.lang[lang].cancel;

					$('<button>' + ok + '</button>').appendTo(div).click(function () {

						$('.fenetre').remove();

						this.jeu.terminer = 1;
						this.jeu.resultat.vainqueur = 0;
						this.jeu.resultat.nom = 'nul';

						this._set_resultat();
						this._resultat();

					}.bind(this));

					$('<button>' + cancel + '</button>').appendTo(div).click(function () {

						$('.fenetre').remove();
					});
				}
			}
        },

        _abandonner: function() {

            if(this.jeu.terminer == 0) {

				var fenetre = $('<div class="fenetre"></div>').appendTo(this.contenu);

				$('<div class="close"></div>').appendTo(fenetre).click(function () {

					$('.fenetre').remove();
				});

				var resign = $.options.lang[lang].resign;

				$('<div style="font-weight:bold;font-size:20px;margin:0 0 10px 20px">' + resign + ' ?</div>').appendTo(fenetre);
				var div = $('<div class="form"></div>').appendTo(fenetre);

				var ok = $.options.lang[lang].ok;
				var cancel = $.options.lang[lang].cancel;

				$('<button>' + ok + '</button>').appendTo(div).click(function () {

					$('.fenetre').remove();
					this.jeu.terminer = 1;

					if (this.jeu.blanc.uid == this.uid) {
						this.jeu.resultat.vainqueur = 2;
					}
					else {
						this.jeu.resultat.vainqueur = 1;
					}

					this.jeu.resultat.nom = 'resign';
					this._set_resultat();
					this._resultat();

				}.bind(this));

				$('<button>' + cancel + '</button>').appendTo(div).click(function () {
					$('.fenetre').remove();

				});
			}
        },
		
		_decompte: function () {

            if (this.jeu && this.jeu.terminer == 0) {
			
				var time = this.jeu[this.jeu.tour].time;
				var time_tour = this.jeu[this.jeu.tour].time_tour;
				
				if (time >= 0 && time_tour >= 0) {

                    var time_chiffre = this._time(time);
					$(this.options[this.jeu.tour].decompte).empty().append(time_chiffre);
					
					if(this.jeu[this.jeu.tour].time_tour <= this.jeu[this.jeu.tour].time){
						var time_tour1 = this._time(time_tour);
					}
					else{
						var time_tour1 = this._time(time);
					}
					
					$(this.options[this.jeu.tour].decompte_tour).empty().append(time_tour1);
					
					if (this.jeu.tour == "blanc"){
						var couleur = "noir";
					}
					else{
						var couleur = "blanc";
					}
					
					$(this.options[couleur].decompte_tour).empty().append("");
					
					this.jeu[this.jeu.tour].time --;
					this.jeu[this.jeu.tour].time_tour --;
					
					if (this.options.sound && $('#audio #time')[0]) {
						
						$('#audio #time')[0].pause();
						
						if (this.jeu[this.jeu.tour].uid == this.uid && (this.jeu[this.jeu.tour].time < 10 || this.jeu[this.jeu.tour].time_tour < 10)) {
							$('#audio #time')[0].play();
						}
					}
				}
                else {
				
					if(this.options.sound && $('#audio #time')[0]) $('#audio #time')[0].pause();
					
					$('.piece').draggable("disable").removeClass('ui-draggable');
					
					var color = (this.jeu.tour == 'blanc') ? 'noir' : 'blanc';
					
					this.jeu.terminer = 1;
					this.jeu.resultat.vainqueur = (this._time_inssufisance_materiel(color)) ? 0 : ((color == 'blanc') ? 1 : 2);
					this.jeu.resultat.nom = (this.jeu.resultat.vainqueur == 0) ? 'nul' : 'time';
					
					if (this.jeu[this.jeu.tour].uid != this.uid) {
						this._set_resultat();
						this._resultat();
					}
                }
            }

            setTimeout(function () { this._decompte(); }.bind(this), 1000);
        },
		
		_time_inssufisance_materiel: function(color) {
		
			if (this.jeu[color].pieces == 1) {
				return true;
			}
			
			return false;
		},
		
		_time: function (time) {

            var minute = Math.floor(time / 60);
            var seconde = Math.floor(time - (minute * 60));

            return $._sprintf(minute) + ':' + $._sprintf(seconde);
        },

        _jeu_terminer: function (data) {
			
			var uid = 0;
			
			if (this.uid == this.jeu.blanc.uid) {
				uid = this.jeu.noir.uid;
			}
			else if(this.uid == this.jeu.noir.uid) {
				uid = this.jeu.blanc.uid;
			}
			
			if(uid && data.uid == uid) {
			 
				this.jeu.terminer = 1;
				this.jeu.resultat.vainqueur = data.vainqueur;
				this.jeu.resultat.nom = data.nom;
				this._resultat();
			}
		},
		
		_set_resultat: function () {
			
			this.socket.emit('JeuTerminer', {
				id: this.jeu.id,
				vainqueur: this.jeu.resultat.vainqueur,
				nom: this.jeu.resultat.nom,
				blanc: this.jeu.blanc.uid,
				noir: this.jeu.noir.uid
			});
		},

        _resultat: function () {

            if(this.options.sound && $('#audio #time')[0]) {
            	$('#audio #time')[0].pause();
            }
			
			$('.bt').empty().html();
			
			if(this.jeu.coup) {
				
				var div = $('<div style="bottom:130px" class="replay"></div>').appendTo(this.contenu);
				var max = this.jeu.coup;
				
				this.sauvegarde = this.jeu.sauvegarde;
				this.coup = this.jeu.coup;
				
				$('<button> < </button>').appendTo(div).click(function() {
					this.coup = 1;
					this._sauvegarde();
				}.bind(this));
				
				$('<button> << </button>').appendTo(div).click(function() {
					if(this.sauvegarde[this.coup - 1]) {
						this.coup --;
						this._sauvegarde();
					}
				}.bind(this));
				
				this.num_replay = $('<span class="num">' + this.coup + '</span>').appendTo(div);
				
				$('<button> >> </button>').appendTo(div).click(function() {
					if(this.sauvegarde[this.coup + 1]) {
						this.coup ++;
						this._sauvegarde();
					}
				}.bind(this));
				
				$('<button> > </button>').appendTo(div).click(function() {
					this.coup = max;
					this._sauvegarde();
				}.bind(this));
			}
				
			var fenetre = $('<div style="height:140px" class="fenetre"></div>').appendTo(this.contenu);
			
			$('<div class="close"></div>').appendTo(fenetre).click(function () {
				$('#fade').css('display', 'none');
				$('.fenetre').css('display', 'none');
			});

            var game_over = $.options.lang[lang].game_over;
            var resultat = $.options.lang[lang][this.jeu.resultat.nom];

            $('<h2>' + game_over + '</h2>').appendTo(fenetre);
            $('<div class="resultat">' + resultat + '</div>').appendTo(fenetre);

            var winner = $.options.lang[lang].winner;
			
            var win = '';
			
			if (this.jeu.resultat.vainqueur == 1) {
				win = winner + ': ' + this.jeu.blanc.name;
				$('<div class="vainqueur">' + winner + ' : ' + this.jeu.blanc.name + '</div>').appendTo(fenetre);
            }
            else if (this.jeu.resultat.vainqueur == 2) {
				win = winner + ': ' + this.jeu.noir.name;
				$('<div class="vainqueur">' + winner + ' : ' + this.jeu.noir.name + '</div>').appendTo(fenetre);
            }
			
			var blanc = this.jeu.blanc.name;
			var noir = this.jeu.noir.name;
			
			var partage = $('<div class="partager"></div>').appendTo(fenetre);
			$('<button>' + $.options.lang[lang].partager + '</button>').appendTo(partage)
			.click(function() {
				$.partager({blanc:blanc, noir:noir, win:win, result:resultat });
			});
			
			$('.piece').draggable("disable").removeClass('ui-draggable');
			
			delete this.jeu;
			
			this.menu = {
				accueil:true,
				jouer:true,
				classement:true
			};
        },
		
		_sauvegarde: function() {
			
			$(this.num_replay).empty().text(this.coup);
			
			$('.case').css('background', '').empty().html();
			$(this._case[this.sauvegarde[this.coup].depart]).css('background', '#930');
			$(this._case[this.sauvegarde[this.coup].arriver]).css('background', '#930');
			
			for (var i in this.sauvegarde[this.coup].jeu) {

				var position = i;
				var pion = this.sauvegarde[this.coup].jeu[i];
				
				var _pion = $('<div class="piece ' + pion.nom + '_' + pion.couleur + '"></div>');
				$(this._case[position]).empty().append(_pion);
			}
		},
		
		_open_classement: function(page, bool) {
			
			if (bool) {
				
				if (this.type_ranking == "ranking"  && friends.array.length > 0) {
					this.type_ranking = "friends";
				}
				else {
					this.type_ranking = "ranking";
				}
			}
			
			this.menu = {
				accueil:false,
				jouer:false,
				classement:false
			};
			
			if (this.type_ranking == "friends") {
				this.socket.emit('Classement', {page:page, friends:friends.array});
			}
			else {
			
				this.socket.emit('Classement', {page:page, friends:false});
			}
		},
		
		_classement: function (data) {

            this.menu = {
				accueil:true,
				jouer:true,
				classement:true
			};
			
			this.page_open = false;
			
			if (this.type_ranking == "ranking" && friends.array.length > 0) {
				var name = "friends";
			}
			else {
				var name = "ranking";
			}
			
			$(this.ranking).empty().text($.options.lang[lang][name]);
			
			$(this.conteneur).css("height", "580px");

            $(this.contenu).empty().html();
			
			this.table = $('<table class="classement"></table>').appendTo(this.contenu);

			var p = 0;
			
			for (var i in data.classement) {

				this._classement_position(data.classement[i], p);
				p++;
			}

			if (data.page) {

				this.page = data.page.page;

				var page = $('<div id="page"></div>').appendTo(this.contenu);

				if (data.page.prec.num) {

					var div = $('<div class="left"></div>').appendTo(page);

					this._page(data.page.prec, div);
				}

				if (data.page.suiv.num) {

					var div = $('<div class="right"></div>').appendTo(page);

					this._page(data.page.suiv, div);
				}

				var div = $('<div class="_page"></div>').appendTo(page);

				for (var i in data.page.list) {

					this._page(data.page.list[i], div);
				}

			}

        },

        _classement_position: function (user, i) {

            var uid = user.uid;

            if (this.uid == uid) {

                var tr = $('<tr class="bg-bleu"></tr>').appendTo(this.table);
            }
            else if (i % 2 == 1) {

                var tr = $('<tr class="bg-brun"></tr>').appendTo(this.table);
            }
            else {

                var tr = $('<tr class="bg-gris"></tr>').appendTo(this.table);
            }

            $('<td class="position">' + user.position + '</td>').appendTo(tr);
            var image = $('<td class="images"></td>').appendTo(tr);
            var nom = $('<td class="nom"></td>').appendTo(tr);
            
			$('<td class="scores">' + user.points + '</td>').appendTo(tr);

            $('<img src="https://graph.facebook.com/' + uid + '/picture" />').appendTo(image);
			
			FB.api('/' + uid, function(response) {
				$('<a href="#">' + response.name + '</a>').appendTo(nom).click(function () {
					this._open_profil(uid, response.name);
					return false;
				}.bind(this));
			});

        },

        _page: function (page, div) {

        	if (page.num == this.page) {

                _page = $('<div class="page"><strong>' + page.nom + '</strong></div>').appendTo(div);
            }
            else {

                _page = $('<div class="page">' + page.nom + '</div>').appendTo(div);
            }

            _page.click(function () {
				if (!this.page_open) {
					this.page_open = true;
					this._open_classement(page.num, false);
				}
            }.bind(this));
        }
    });

})(jQuery);