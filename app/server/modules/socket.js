

module.exports = function() {
	
	var connections = {
		nb:0
	};
	
	var connecter = {
		nb:0,
		user: {}
	};
	
	var parties_proposition = {
		nb:0,
		parties: {}
	};
	
	var parties = {
		id : 1,
		jeu: []
	};
	
	var messages = {
		id: 0,
		data: {}
	};
	
	var users = mongoose.model('users', global.usersSchema),
		games = mongoose.model('parties', global.partiesSchema),
		badges = mongoose.model('user_badges', global.usersBadgesSchema),
		free_tokens = mongoose.model('free_tokens', global.freeTokenSchema),
		paiements = mongoose.model('paiements', global.paiementsSchema);
	
	var allSockets = global.socket.of('/chess').on('connection', function(socket) {
		
		socket.on('create', function(data) {
			
			if(!data.uid || !data.accessToken) {
				socket.disconnect();
				return;
			}
			
			global.graph.post('/' + data.uid + '?access_token=' + data.accessToken, function (err, res) {
				
				if(err || !res.data) {
					socket.disconnect();
					return;
				}
				
				if (connections[data.uid]) {
					connections[data.uid].disconnect();
					delete connections[data.uid];
					connections.nb--;
				}
				
				socket.uid = data.uid;
				socket.name = data.name;
				connections[data.uid] = socket;
				connections.nb++;
				
				users.count({uid: data.uid}, function (err, nb) {
					
					if (err) {
						return;
					}
					
					if(nb == 0) {
					
						var user = new users({ 
							uid: data.uid,
							points: 1500,
							tokens: 17,
							trophy: 1,
							parrainage: data.parrainage,
						});

						user.save(function (err) {
							
							if (err) {
								return ;
							}
							
							initUser();
						});
					}
					else {
						initUser(data.parrainage);
					}
				});
			});
		});
		
		socket.on('InitUser', function() {
			initUser();
		});
		
		socket.on('AnnulerPartie', function() {
			if(verifUser()) supprimerPartie(socket.uid);
		});
		
		socket.on('CreerPartie', function(data) {
			
			if(verifUser()) {
				
				if(parties_proposition.parties[socket.uid]) {
					delete parties_proposition.parties[socket.uid];
					parties_proposition.nb --;
				}
				
				parties_proposition.parties[socket.uid] = {
					name: socket.name,
					points: socket.points,
					classement: socket.classement,
					color: data.color,
					time: data.time,
					points_min: data.points_min,
					points_max: data.points_max,
				};
				
				parties_proposition.nb ++;
				
				listerParties();
			}
		});
		
		socket.on('Defis', function(data) {
			
			if(verifUser() && connections[data.uid]) {
			
				if(!connections[data.uid].defis) {
					connections[data.uid].defis = {
						nb:0,
						defis: {}
					};
				}
				
				if(!connections[data.uid].defis.defis[socket.uid])
					connections[data.uid].defis.nb ++;
					
				connections[data.uid].defis.defis[socket.uid] = {
					type: 'reponse',
					name:socket.name,
					points:socket.points,
					classement:socket.classement,
					color:data.color,
					time:data.time
				};
				
				if(!socket.defis) {
					socket.defis = {
						nb:0,
						defis: {}
					};
				}
				
				if(!socket.defis.defis[data.uid])
					socket.defis.nb ++;
					
				socket.defis.defis[data.uid] = {
					type: 'demande',
					name:connections[data.uid].name,
					points:connections[data.uid].points,
					classement:connections[data.uid].classement,
					color:data.color,
					time:data.time
				};
				
				connections[data.uid].emit('Defis', connections[data.uid].defis);
				socket.emit('Defis', socket.defis);
			}
		});
		
		socket.on('AnnulerDefi', function(uid) {
			
			if(verifUser() && connections[uid] && connections[uid].defis && connections[uid].defis.defis && connections[uid].defis.defis[socket.uid]) {
				delete connections[uid].defis.defis[socket.uid];
				connections[uid].defis.nb --;
				connections[uid].emit('Defis', connections[uid].defis);
			}
				
			if(socket.defis && socket.defis.defis && socket.defis.defis[uid]) {
				delete socket.defis.defis[uid];
				socket.defis.nb --;
				socket.emit('Defis', socket.defis);
			}
		});
		
		socket.on('NouvellePartie', function(uid) {
			
			if(!socket.jeu && verifUser() && socket.uid != uid) {
			
				if(parties_proposition.parties[uid] && connections[uid] && !connections[uid].jeu) {
					
					var partie = parties_proposition.parties[uid];
					
					demarrerPartie(uid, partie);
				}
				else {
					
					supprimerPartie(uid);
				}
			}
		});
		
		socket.on('NouvellePartieDefi', function(uid) {
			
			if(!socket.jeu && verifUser() && socket.uid != uid) {
				
				if(connections[uid]) {
					
					if(!connections[uid].jeu) {
						
						if(connections[uid].defis && connections[uid].defis.defis && connections[uid].defis.defis[socket.uid]) {
					
							var partie = connections[uid].defis.defis[socket.uid];
							demarrerPartie(uid, partie);
						}
					}
					else {
						annulerAllDefi(connections[uid]);
					}
				}
				else if(socket.defis && socket.defis.defis && socket.defis.defis[uid]) {
					delete socket.defis.defis[uid];
					socket.defis.nb --;
					socket.emit('Defis', socket.defis);
				}
			}
		});
		
		
		socket.on('ChargerPartie', function(data) {
			
			if(verifUser() && parties.jeu[data.id]) {
				
				var uid = 0;
				
				if(parties.jeu[data.id].blanc == socket.uid) {
					uid = parties.jeu[data.id].noir;
				}
				else if(parties.jeu[data.id].noir == socket.uid) {
					uid = parties.jeu[data.id].blanc;
				}
				
				if(uid) {
					
					if(connections[uid]) {
						
						var _data = {
							uid:socket.uid,
							depart: data.depart,
							arriver: data.arriver,
							pion: data.pion,
							mouvement: data.mouvement,
							promotion: data.promotion,
							jeu: { 
								blanc: data.blanc,
								noir: data.noir
							}
						};
							
						connections[uid].emit('ChargerPartie', _data);
					}
				}
			}
		});
		
		socket.on('ProposerNul', function(data) {
			
			if(verifUser() && parties.jeu[data.id]) {
				
				var uid = 0;
						
				if(parties.jeu[data.id].blanc == socket.uid) {
					uid = parties.jeu[data.id].noir;
				}
				else if(parties.jeu[data.id].noir == socket.uid) {
					uid = parties.jeu[data.id].blanc;
				}
				
				if(uid && connections[uid]) {
					connections[uid].emit('ProposerNul', {uid:socket.uid, name:socket.name});
				}
			}
		});
		
		socket.on('JeuTerminer', function(data) {
			
			if(verifUser()) {
				
				var nom = data.nom ? data.nom : "";
				var vainqueur = data.vainqueur ? data.vainqueur : 0;
				
				if(parties.jeu[data.id] && data.blanc > 0 && data.noir > 0) {
					
					var uid = 0;
					
					if(parties.jeu[data.id].blanc == socket.uid) {
						uid = parties.jeu[data.id].noir;
					}
					else if(parties.jeu[data.id].noir == socket.uid) {
						uid = parties.jeu[data.id].blanc;
					}
					
					if(uid) {
				
						delete parties.jeu[data.id];
						socket.jeu = false;
						
						resultatPartie(vainqueur, nom, data.blanc, data.noir);
						
						if(connections[uid]) {
							connections[uid].jeu = false;
							connections[uid].emit('JeuTerminer', { uid:socket.uid, vainqueur: vainqueur, nom: nom });
						}
					}
				}
			}
		});
		
		socket.on('Profil', function(uid, name) {
			
			if(verifUser() && uid > 0) {
			
				var data = {};
				
				games.count({$or : [{blanc:uid}, {noir:uid}]}, function (err, nb) {
					
					if (err) return;
					
					data.games = nb;
					
					games.count({blanc:uid, resultat:1}, function (err, nb) {
						
						if (err) return;
						
						data.win = nb;
						
						games.count({noir:uid, resultat:2}, function (err, nb) {
						
							if (err) return;
							
							data.win += nb;
							
							games.count({blanc:uid, resultat:0}, function (err, nb) {
						
								if (err) return;
							
								data.draw = nb;
							
								games.count({noir:uid, resultat:0}, function (err, nb) {
							
									if (err) return;
								
									data.draw += nb;
									
									users.find({uid:uid}, function (err, _data) {
					
										if (err || !_data[0] || !_data[0].points) return;
										
										var points = _data[0].points;
									
										users.count({actif:1, points:{$gt : points}}, function (err, nb) {
											
											if (err) return;
						
											var classement = nb + 1;
											
											socket.emit('Profil', {data:data, classement:classement, points:points, uid:uid, name:name });
										});
									});
								});
							});
						});
					});
				});
			}
		});
		
		socket.on('EnvoyerMessage', function(message) {
			
			if(autoriseTchat()) {
				
				var message = message.substr(0, 500);
				var time = new Date().getTime();
				
				messages.id++;
				
				messages.data[messages.id] = {
					uid:socket.uid,
					name: socket.name,
					message:message,
					time:time
				};
				
				if(messages.data[messages.id - 50]) {
					delete messages.data[messages.id - 50];
				}
				
				listerMessages();
			}
		});
		
		socket.on('SupprimerMessage', function(id) {
			
			if (!messages.data[id] || !messages.data[id].uid) {
				return;
			}
			
			if((verifUser() && messages.data[id].uid == socket.uid) || socket.moderateur) {
				delete messages.data[id];
			}
		});
		
		socket.on('EnvoyerMessageJeu', function(data) {
			
			if(verifUser() && socket.name && parties.jeu[data.id]) {
				
				var uid = 0;
						
				if(parties.jeu[data.id].blanc == socket.uid) {
					uid = parties.jeu[data.id].noir;
				}
				else if(parties.jeu[data.id].noir == socket.uid) {
					uid = parties.jeu[data.id].blanc;
				}
				
				if(uid && connections[uid]) {
					connections[uid].emit('NouveauMessageJeu', {uid:socket.uid, name:socket.name, message:data.message.substr(0, 500)});
				}
			}
		});
		
		socket.on('Classement', function(data) {
			
			if(verifUser()) {
			
				var uid = socket.uid ? socket.uid : 0;
				var limit = 8;
				var page = parseInt(data.page);
				var friends = data.friends;
				
				users.find({uid:uid}, function(err, data) {
					
					if(err) return;
					
					if(page) {
						
						if(page <= 0)
							page = 1;
							
						_classement(friends, page, limit, false);
					}
					else {
					
						if(friends) {
							users.count({actif:1, uid: { $in: friends }, points: { $gt: data[0].points } }, function (err, nb) {
							
								if (err) return;
								
								nb++;
								
								var page = Math.ceil(nb/limit);
								
								if(page <= 0)
									page = 1;
									
								_classement(friends, page, limit, true);
							});
						}
						else {
							users.count({actif:1, points: { $gt: data[0].points } }, function (err, nb) {
							
								if (err) return;
								
								nb++;
								
								var page = Math.ceil(nb/limit);
								
								if(page <= 0)
									page = 1;
									
								_classement(friends, page, limit, true);
							});
						}
					}
				});
			}
		});
		
		socket.on('share_trophy', function() {
			
			if(verifUser()) {
			
				var uid = socket.uid ? socket.uid : 0;
				
				users.find({uid:uid}, function (err, data) {
					
					if (err || !data[0].tokens) return;
					
					var token = data[0].tokens + 3;
					
					users.update({uid: uid }, { $set: {tokens: token} }, function (err) { });
				});
			}
		});
		
		socket.on('Quit', function() {
			
			if(verifUser()) {
			
				socket.leave('home');
				
				if(connecter.user[socket.uid]) {
					connecter.nb --;
					delete connecter.user[socket.uid];
					connected();
				}
				
				supprimerPartie(socket.uid);
				
				annulerAllDefi(socket);
			}
		});
		
		socket.on('payment', function(data) {
		
			if(!verifUser() || !data || !data.id || !data.token || !data.signed_request)
				return;
			
			var id = data.id,
				_token = data.token,
				request = parse_signed_request(data.signed_request, global.secret);
				
			if(!request)
				return;
				
			users.find({uid:socket.uid}, function (err, data) {

				if (err || !data[0]) return;
				
				var token = parseInt(data[0].tokens) + parseInt(_token);
				
				users.update({uid:socket.uid}, { $set: {tokens: token} }, function (err) { 
				
					if (err) return;
					
					initUser();
					
					new paiements({ 
						id:request.payment_id,
						uid:socket.uid,
						item:id,
						type: 'charge',
						status: 'completed',
						time:request.issued_at,
					}).save();
				});
			});
		});
		
		socket.on('disconnect', function(err) {
			
			if (verifUser()) {
				
				if (err != 'booted' && connections[socket.uid]) {
					delete connections[socket.uid];
					connections.nb--;
				}
				
				if (connecter.user[socket.uid]) {
					connecter.nb--;
					delete connecter.user[socket.uid];
					connected();
				}
			
				if (parties_proposition.parties[socket.uid]) {
					delete parties_proposition.parties[socket.uid];
					parties_proposition.nb--;
					listerParties();
				}
				
				if (socket.jeu && parties.jeu[socket.jeu]) {
					disconnectJeu();
				}
				
				annulerAllDefi(socket);
			}
			
			delete socket;
		});
		
		function disconnectJeu() {
			
			var partie = parties.jeu[socket.jeu];
			var uid = 0;
				
			if(partie.blanc == socket.uid) {
				uid = partie.noir;
				var vainqueur = 2;
			}
			else if(partie.noir == socket.uid) {
				uid = partie.blanc;
				var vainqueur = 1;
			}
			
			if(uid) {
			
				var blanc = partie.blanc;
				var noir = partie.noir;
				var nom = "resign";
		
				delete parties.jeu[socket.jeu];
				resultatPartie(vainqueur, nom, blanc, noir);
				
				if(connections[uid]) {
					connections[uid].jeu = false;
					connections[uid].emit('JeuTerminer', { uid:socket.uid, vainqueur: vainqueur, nom: nom });
				}
			}
		}
		
		function verifUser() {
			
			if(socket.uid > 0) {
				return true;
			}
			
			return false;
		}
		
		function autoriseTchat() {
			
			if(verifUser()) {
			
				switch(socket.uid) {
					case '100004539253808':
					case '100002237255521':
						return false;
				}
				
				return true;
			}
		}
		
		function initUser(parrainage) {
			
			if(verifUser()) {
			
				var uid = socket.uid ? socket.uid : 0;
				
				users.find({uid:uid}, function (err, data) {
					
					if (err || !data[0]) return;
					
					if(data[0].ban) {
						socket.disconnect();
						return;
					}
					
					socket.moderateur = data[0].moderateur ? true : false;
					
					checkTrophy(uid);
					
					if(!data[0].parrainage && parrainage) {
						users.update({uid: uid }, { $set: {parrainage: parrainage} }, function (err) { });
					}
					
					var points = data[0].points;
					socket.points = points;
					
					free_tokens.find({uid:uid}, function (err, _data) {
				
						if (err) return;
						
						var token = 0;
						
						if(!data[0].tokens && data[0].tokens != 0) {
							token += 17;
							users.update({uid: uid }, { $set: {tokens: token} }, function (err) { });
						}
						else {
							token += data[0].tokens;
						}
						
						var time = Math.round(new Date().getTime() / 1000);
					
						if(!_data[0] || !_data[0].time) {
							
							token += 3;
							time_free = time;
							var free_token = new free_tokens({ uid : uid });
							free_token.time = time;
							free_token.save();
							users.update({uid: uid }, { $set: {tokens: token} }, function (err) { });
						}
						else if(_data[0].time < (time - (24*3600))) {
							
							time_free = time;
							token += 3;
							free_tokens.update({uid: uid }, { $set: {time: time} }, function (err) { });
							users.update({uid: uid }, { $set: {tokens: token} }, function (err) { });
						}
						else {
							time_free = _data[0].time;
						}
						
						badges.find({uid:uid}, function (err, data) {
						
							if (err) return;
							
							var trophy = data;
							
							users.count({actif:1, points:{$gt : points}}, function (err, nb) {
								
								if (err) return;
								
								var classement = nb + 1;
								socket.classement = classement;
								socket.join('home');
								
								if(!connecter.user[socket.uid] && !socket.jeu) {
									
									connecter.nb ++;
									connecter.user[socket.uid] = {
										name : socket.name,
										classement : socket.classement,
										points : socket.points
									};
								}
								
								connected();
								
								socket.emit('InfosUser', {
									moderateur: socket.moderateur,
									points: points, 
									classement: classement, 
									tokens: token, 
									free: time_free, 
									trophy: trophy 
								});
								
								socket.emit('ListerParties', parties_proposition);
							});
						});
					});
				});
				
				socket.emit('ListerMessages', messages.data);
			}
		}
		
		function connected() {
		
			sendHome('Connected', connecter);
			allSockets.emit('NbConnected', connections.nb );
		}
		
		function annulerAllDefi (_socket) {
			if(_socket.uid && _socket.defis && _socket.defis.defis) {
				for(var uid in _socket.defis.defis) {
					if(connections[uid] && connections[uid].defis && connections[uid].defis.defis && connections[uid].defis.defis[_socket.uid]) {
						delete connections[uid].defis.defis[_socket.uid];
						connections[uid].defis.nb --;
						connections[uid].emit('Defis', connections[uid].defis);
					}
				}
				delete _socket.defis;
			}
		}
		
		function demarrerPartie(uid, partie) {
		
			var id = parties.id ++;
			
			socket.jeu = id;
			connections[uid].jeu = id;
			
			if(parties_proposition.parties[uid]) {
				delete parties_proposition.parties[uid];
				parties_proposition.nb --;
			}
			
			if(parties_proposition.parties[socket.uid]) {
				delete parties_proposition.parties[socket.uid];
				parties_proposition.nb --;
			}
			
			listerParties();
			
			socket.leave('home');
			if(connecter.user[socket.uid]) {
				connecter.nb --;
				delete connecter.user[socket.uid];
			}
			
			connections[uid].leave('home');
			if(connecter.user[uid]) {
				connecter.nb --;
				delete connecter.user[uid];
			}
			
			connected();
			
			annulerAllDefi(socket);
			annulerAllDefi(connections[uid]);
			
			if(partie.color == 'blanc'){
						
				var blanc = {
					uid: uid,
					name: connections[uid].name
				};
				
				var noir = {
					uid: socket.uid,
					name: connections[socket.uid].name
				};
			}
			else{
				var blanc = {
					uid: socket.uid,
					name: connections[socket.uid].name
				};
				
				var noir = {
					uid: uid,
					name: connections[uid].name
				};
			}
			
			var time = partie.time;
			
			parties.jeu[id] = {
				blanc:blanc.uid,
				noir:noir.uid
			};
			
			var jeu = newJeu(id, blanc, noir, time);
			
			socket.emit('NouvellePartie', jeu);
			connections[uid].emit('NouvellePartie', jeu);
		}
		
		function supprimerPartie(uid) {
		
			if(parties_proposition.parties[uid]) {
				
				delete parties_proposition.parties[uid];
				parties_proposition.nb --;
				listerParties();
			}
		}
		
		function listerParties() {
		
			sendHome('ListerParties', parties_proposition);
		}
		
		function listerMessages() {
		
			sendHome('ListerMessages', messages.data);
		}
		
		function sendHome(name, data) {
			
			allSockets.in('home').emit(name, data);
		}
		
		function resultatPartie(vainqueur, nom, blanc, noir){
		
			users.find({uid:blanc}, function (err, data) {
					
				if (err) return;
					
				var points_blanc = data[0].points;
				var tokens_blanc = data[0].tokens;
				var parrainage_blanc = data[0].parrainage ? data[0].parrainage : false;
				tokens_blanc--;
				
				if(tokens_blanc < 0) tokens_blanc = 0;
				
				var cons_game_blanc = data[0].cons_game ? data[0].cons_game : 0;
			
				users.find({uid:noir}, function (err, data) {
					
					if (err) return;
					
					var points_noir = data[0].points;
					var tokens_noir = data[0].tokens;
					var parrainage_noir = data[0].parrainage ? data[0].parrainage : false;
					tokens_noir--;
					
					if(tokens_noir < 0) tokens_noir = 0;
					
					var cons_game_noir = data[0].cons_game ? data[0].cons_game : 0;
					
					games.count({$or : [{blanc:blanc}, {noir:blanc}]}, function (err, nb) {
					
						if (err) return;
						
						var nb_partie_blanc = nb;
						
						games.count({$or : [{blanc:noir}, {noir:noir}]}, function (err, nb) {
							
							if (err) return;
							
							var nb_partie_noir = nb;
							
							if(vainqueur == 1) {
								var resultat_blanc = 1;
								var resultat_noir = 0;
								
								if(cons_game_blanc < 0)
									cons_game_blanc = 0;
								
								if(cons_game_noir > 0)
									cons_game_noir = 0;
									
								cons_game_blanc++;
								cons_game_noir--;
							}
							else if(vainqueur == 2) {
								var resultat_blanc = 0;
								var resultat_noir = 1;
								
								if(cons_game_noir < 0)
									cons_game_noir = 0;
								
								if(cons_game_blanc > 0)
									cons_game_blanc = 0;
									
								cons_game_noir++;
								cons_game_blanc--;
							}
							else {
								var resultat_blanc = 0.5;
								var resultat_noir = 0.5;
								cons_game_blanc = 0;
								cons_game_noir = 0;
							}
						
							var gain_blanc = gain(points_blanc, points_noir, resultat_blanc, nb_partie_blanc);
							var gain_noir = gain(points_noir, points_blanc, resultat_noir, nb_partie_noir);
							
							var partie = new games({ resultat : vainqueur });
							partie.blanc = blanc;
							partie.noir = noir;
							partie.time = new Date().getTime() / 1000;

							partie.save();
							
							points_blanc += gain_blanc;
							points_noir += gain_noir;
							
							users.update({uid: blanc }, { $set: {points: points_blanc, tokens:tokens_blanc, cons_game: cons_game_blanc, actif:1} }, function (err) { 
							nb_partie_blanc++;
							setBadgesGame(blanc, nb_partie_blanc);
							
								if(resultat_blanc == 1) {
								setBadgesWin(blanc);
								}
								
								setBadgesGameDay(blanc);
								setBadgesConsGame(blanc, cons_game_blanc);
								
							});
							
							users.update({uid: noir }, { $set: {points: points_noir, tokens:tokens_noir, cons_game: cons_game_noir, actif:1} }, function (err) { 
								nb_partie_noir++;
								setBadgesGame(noir, nb_partie_noir);
							
								if(resultat_noir == 1) {
								setBadgesWin(noir);
								}
							
							setBadgesGameDay(noir);
							setBadgesConsGame(noir, cons_game_noir);
							
							});
							
							if(parrainage_blanc) {
								setParrainage(parrainage_blanc);
							}
							
							if(parrainage_noir) {
								setParrainage(parrainage_noir);
							}
							
						});
					});
				});
			});
		}
		
		function setParrainage(uid) {
			
			users.find({uid:uid}, function (err, data) {
					
				if (err || !data[0]) return;
				
				if(!data[0].tokens && data[0].tokens != 0) return;
				
				var token = data[0].tokens + 0.1;
				
				users.update({uid: uid }, { $set: {tokens:token} }, function (err) { });
			});
		}
		
		function checkTrophy(uid) {
			
			games.count({$or : [{blanc:uid}, {noir:uid}]}, function (err, nb) {
				
				if(err || !nb) return;
				
				if(nb >= 1000) {
					
					setTrophy(uid, 4);
					setTrophy(uid, 3);
					setTrophy(uid, 2);
					setTrophy(uid, 1);
					
				}
				else if(nb >= 500) {
					
					setTrophy(uid, 3);
					setTrophy(uid, 2);
					setTrophy(uid, 1);
					
				}
				else if(nb >= 100) {
					
					setTrophy(uid, 2);
					setTrophy(uid, 1);
					
				}
				else if(nb >= 1) {
					
					setTrophy(uid, 1);
					
				}
			});
			
			games.count({ "$or":[{"$and":[{"noir":uid,"resultat":2}]}, {"$and":[{"blanc":uid,"resultat":1}]}] }, function (err, nb) {
				
				if(err || !nb) return;
				
				if(nb >= 500) {
					
					setTrophy(uid, 9);
					setTrophy(uid, 8);
					setTrophy(uid, 7);
					setTrophy(uid, 6);
					
				}
				else if(nb >= 250) {
					
					setTrophy(uid, 8);
					setTrophy(uid, 7);
					setTrophy(uid, 6);
				}
				else if(nb >= 50) {
					
					setTrophy(uid, 7);
					setTrophy(uid, 6);
				}
				else if(nb >= 1) {
					
					setTrophy(uid, 6);
				}
				
			});
		}
		
		function setBadgesGame(uid, parties) {
			
			switch(parties) {
					
				case 1: setTrophy(uid, 1); break;
				case 100: setTrophy(uid, 2); break;
				case 500:  setTrophy(uid, 3); break;
				case 1000: setTrophy(uid, 4); break;
				case 5000: setTrophy(uid, 5); break;
			}	
		}
		
		function setBadgesWin(uid) {
			
			games.count({ "$or":[{"$and":[{"noir":uid,"resultat":2}]}, {"$and":[{"blanc":uid,"resultat":1}]}] }, function (err, nb) {
				
				if(err || !nb) return;
				
				switch(nb) {
					
					case 1: setTrophy(uid, 6); break;
					case 50: setTrophy(uid, 7); break;
					case 250: setTrophy(uid, 8); break;
					case 500: setTrophy(uid, 9); break;
					case 2000: setTrophy(uid, 10); break;
				}	
				
			});
		}
		
		function setBadgesGameDay(uid) {
		
			var time = (new Date().getTime() / 1000) - (3600 * 24);
			
			games.count({ "time": { "$gt": time }, "blanc":uid }, function (err, nb) {
				
				if(err) return;
				
				var parties = nb;
				
				games.count({ "time": { "$gt": time }, "noir":uid }, function (err, nb) {
				
					if(err) return;
					
					parties += nb;
					
					if (parties >= 100) {
						
						setTrophy(uid, 15);
					
					} else if(parties >= 50) {
						
						setTrophy(uid, 14);
					
					} else if(parties >= 25) {
						
						setTrophy(uid, 13);
						
					} else if(parties >= 10) {
						
						setTrophy(uid, 12);
						
					} else if(parties >= 5) {
						
						setTrophy(uid, 11);
						
					}	
				
				});
			});
		}
		
		function setBadgesConsGame(uid, nb) {
		
			switch(nb) {
					
				case 3: setTrophy(uid, 16); break;
				case 5: setTrophy(uid, 17); break;
				case 10: setTrophy(uid, 18); break;
				case 20: setTrophy(uid, 19); break;
				case -3: setTrophy(uid, 20); break;
			}	
		}
		
		function setTrophy(uid, trophy) {
			
			badges.count({ uid:uid, badge:trophy }, function (err, nb) {
								
				if(err) return;
				
				if(nb == 0) {
					
					var badge = new badges({ uid : uid });
					badge.badge = trophy;
					badge.save();
					
					if(connections[uid]) {
						connections[uid].emit('trophy', trophy);
					}
				}
			});
		}
		
		function gain(points_user, points_adversaire, resultat, nb_partie){
		
			var points = points_user-points_adversaire;
			
			if(points > 400)
				points = 400;
			
			else if(points < -400)
				points = -400;
			
			points = points / 400;
			points = Math.pow(10, points);
			points = 1 + points;
			points = 1 / points;
			points = 1 - points;
			
			if(nb_partie <= 30)
				var k = 30; 
				
			else if(points_user < 2400)
				var k = 15;
				
			else
				var k=10;
			
			return Math.round(k * (resultat-points));
		}
		
		function newJeu (id, blanc, noir, time) {
		
			var jeu = {
				id:id,
				blanc: {
					uid: blanc.uid,
					name: blanc.name,
					time: time,
					time_tour: 120,
					roi: {
						position: 'e1',
						deplacement_interdit: ""
					},
					pieces: 16
				},
				noir: {
					uid: noir.uid,
					name: noir.name,
					time: time,
					time_tour: 120,
					roi: {
						position: 'e8',
						deplacement_interdit: ""
					},
					pieces: 16
				},
				time: time,
				time_tour: 120,
				terminer: 0,
				resultat: {
					vainqueur : "",
					nom : ""
				},
				tour: 'blanc',
				position: {
					e1: {
						nom: 'roi',
						couleur: 'blanc',
						deplacement: '',
						capture: '',
						move: 0
					},
					e8: {
						nom: 'roi',
						couleur: 'noir',
						deplacement: '',
						capture: '',
						move: 0
					},
					d1: {
						nom: 'reine',
						couleur: 'blanc',
						deplacement: '',
						capture: '',
						move: 0
					},
					d8: {
						nom: 'reine',
						couleur: 'noir',
						deplacement: '',
						capture: '',
						move: 0
					},
					c1: {
						nom: 'fou',
						couleur: 'blanc',
						deplacement: '',
						capture: '',
						move: 0
					},
					f1: {
						nom: 'fou',
						couleur: 'blanc',
						deplacement: '',
						capture: '',
						move: 0
					},
					c8: {
						nom: 'fou',
						couleur: 'noir',
						deplacement: '',
						capture: '',
						move: 0
					},
					f8: {
						nom: 'fou',
						couleur: 'noir',
						deplacement: '',
						capture: '',
						move: 0
					},
					b1: {
						nom: 'cavalier',
						couleur: 'blanc',
						deplacement: 'a3.c3',
						capture: '',
						move: 0
					},
					g1: {
						nom: 'cavalier',
						couleur: 'blanc',
						deplacement: 'f3.h3',
						capture: '',
						move: 0
					},
					b8: {
						nom: 'cavalier',
						couleur: 'noir',
						deplacement: 'a6.c6',
						capture: '',
						move: 0
					},
					g8: {
						nom: 'cavalier',
						couleur: 'noir',
						deplacement: 'f6.h6',
						capture: '',
						move: 0
					},
					a1: {
						nom: 'tour',
						couleur: 'blanc',
						deplacement: '',
						capture: '',
						move: 0
					},
					h1: {
						nom: 'tour',
						couleur: 'blanc',
						deplacement: '',
						capture: '',
						move: 0
					},
					a8: {
						nom: 'tour',
						couleur: 'noir',
						deplacement: '',
						capture: '',
						move: 0
					},
					h8: {
						nom: 'tour',
						couleur: 'noir',
						deplacement: '',
						capture: '',
						move: 0
					},
					a2: {
						nom: 'pion',
						couleur: 'blanc',
						deplacement: 'a3.a4',
						capture: '',
						move: 0
					},
					b2: {
						nom: 'pion',
						couleur: 'blanc',
						deplacement: 'b3.b4',
						capture: '',
						move: 0
					},
					c2: {
						nom: 'pion',
						couleur: 'blanc',
						deplacement: 'c3.c4',
						capture: '',
						move: 0
					},
					d2: {
						nom: 'pion',
						couleur: 'blanc',
						deplacement: 'd3.d4',
						capture: '',
						move: 0
					},
					e2: {
						nom: 'pion',
						couleur: 'blanc',
						deplacement: 'e3.e4',
						capture: '',
						move: 0
					},
					f2: {
						nom: 'pion',
						couleur: 'blanc',
						deplacement: 'f3.f4',
						capture: '',
						move: 0
					},
					g2: {
						nom: 'pion',
						couleur: 'blanc',
						deplacement: 'g3.g4',
						capture: '',
						move: 0
					},
					h2: {
						nom: 'pion',
						couleur: 'blanc',
						deplacement: 'h3.h4',
						capture: '',
						move: 0
					},
					a7: {
						nom: 'pion',
						couleur: 'noir',
						deplacement: 'a6.a5',
						capture: '',
						move: 0
					},
					b7: {
						nom: 'pion',
						couleur: 'noir',
						deplacement: 'b6.b5',
						capture: '',
						move: 0
					},
					c7: {
						nom: 'pion',
						couleur: 'noir',
						deplacement: 'c6.c5',
						capture: '',
						move: 0
					},
					d7: {
						nom: 'pion',
						couleur: 'noir',
						deplacement: 'd6.d5',
						capture: '',
						move: 0
					},
					e7: {
						nom: 'pion',
						couleur: 'noir',
						deplacement: 'e6.e5',
						capture: '',
						move: 0
					},
					f7: {
						nom: 'pion',
						couleur: 'noir',
						deplacement: 'f6.f5',
						capture: '',
						move: 0
					},
					g7: {
						nom: 'pion',
						couleur: 'noir',
						deplacement: 'g6.g5',
						capture: '',
						move: 0
					},
					h7: {
						nom: 'pion',
						couleur: 'noir',
						deplacement: 'h6.h5',
						capture: '',
						move: 0
					}
				}
			}
			
			return jeu;
		}
		
		function _classement(friends, page, limit, bol) {
			
			var offset=(page*limit)-limit;
			
			if(bol) {
				if(friends) {
					var req = {$and:[{actif:1,  uid: { $in: friends }}, {uid: { $ne: socket.uid }}]};
				}
				else {
					var req = {$and:[{actif:1}, {uid: { $ne: socket.uid }}]};
				}
			}
			else {
				if(friends) {
					var req = {actif:1,  uid: { $in: friends }};
				}
				else {
					var req = {actif:1};
				}
			}
			
			users.count(req, function (err, nb) {
				
				if (err) return;
				
				if(nb == 0) {
					
					var data = [];
					data.push({
						uid:socket.uid,
						points:socket.points,
						position:1
					});
					
					socket.emit('Classement', {classement:data, page:false});
					
					return;
				}
				
				var total = nb;
				
				if(bol) {
					total++;
					newLimit = limit - 1;
				}
				else {
					newLimit = limit;
				}
				
				users.find(req).sort({points:-1}).skip(offset).limit(newLimit).hint({points:1}).exec(function (err, data) {
					
					if (err) return;
					
					if(!data[0] || !data[0].points) return;
					
					var points = (bol && socket.points > data[0].points) ? socket.points : data[0].points;
						
					var _data = {};
					
					if(friends) {
						var req = {actif:1,  uid: { $in: friends }, points:{$gt : points}};
					}
					else {
						var req = {actif:1, points:{$gt : points}};
					}
					
					users.count(req, function (err, nb) {
						
						var pos = nb + 1;
						
						if(friends) {
							var req = {actif:1,  uid: { $in: friends }, points:data[0].points};
						}
						else {
							var req = {actif:1, points:data[0].points};
						}
						
						users.count(req, function (err, nb) {
						
							var egal = nb;
							
							var _i = 0,
								newData = [];
								
							if(bol) {
								
								var saveUser = false;
							
								for(var i in data) {
									if(!saveUser && socket.points >= data[i].points) {
										newData.push({
											uid:socket.uid,
											points:socket.points,
										});
										
										saveUser = true;
									}
									
									newData.push(data[i]);
								}
							
								if(!saveUser) {
									newData.push({
										uid:socket.uid,
										points:socket.points,
									});
								}
							}
							else {
								newData = data;
							}
							
							for(var i in newData) {
								
								if(newData[i].points < newData[_i].points) {
									if(!val) {
										pos += egal;
									}
									else {
										pos += val;
									}
									
									var val = 1;
								}
								else {
									if(val) val++;
								}
									
								_data[i] = {
									uid:newData[i].uid,
									points:newData[i].points,
									position: pos
								};
								
								var _i = i;
							}
							
							_page(_data, total, offset, limit);
						});
					});
				});
				
			});
		}
		
		function _page(data, total, offset, limit) {
			
			var nb = 3,
				nb_page = Math.ceil(total/limit),
				page= Math.ceil(offset/limit) + 1;
			
			if(nb_page <= 1) {
				socket.emit('Classement', {classement:data, page:false});
				return;
			}
			
			var _page = {
				page:page,
				list:{},
				prec:{},
				suiv:{}
			};
			
			for(i=1; i <= nb_page; i++){
				if((i <= nb) || (i > nb_page - nb) || ((i < page + nb) && (i > page-nb))){
					_page.list[i] = {
						num:i,
						nom:i
					};
				}
				else{
					var num = false;
					
					if (i >= nb && i <= page - nb){
						i = page - nb;
						num = Math.ceil((page-(nb-3))/2);
					}
					else if (i >= page + nb && i <= nb_page - nb){
						i = nb_page - nb;
						num = Math.ceil((((nb_page-(nb-2))-page)/2)+page);
					}
					
					if(num) {
						
						_page.list[i] = {
							num:num,
							nom:'...'
						};
					}
				}
			}
			
			if(offset >= limit){
			
				_page.prec = {
					num:page-1,
					nom:'<<'
				};
			}
			
			if(page != nb_page){
			
				_page.suiv = {
					num:page+1,
					nom:'>>'
				};
			}
			
			socket.emit('Classement', {classement:data, page:_page});
		}
		
		function parse_signed_request(signed_request, app_secret) {
		
			signed_request = signed_request.split(".", 2);
			
			var encoded_sig = signed_request[0],
				payload = signed_request[1];
			
			var sig = base64_url_decode(encoded_sig);
			
			var data = JSON.parse(base64_url_decode(payload));
			
			if (strtoupper(data.algorithm) !== 'HMAC-SHA256')
				return;
			
			var hash = CryptoJS.HmacSHA256(payload, app_secret);
			
			var expected_sig = base64_url_decode(hash.toString(CryptoJS.enc.Base64));
			
			if (sig !== expected_sig)
				return;
			
			
			return data;
		}
		
		function base64_url_decode(input) {
			return base64_decode(strtr(input, '-_', '+/'));
		}
		
		function base64_decode(s) {
		
			var e={},i,b=0,c,x,l=0,a,r='',w=String.fromCharCode,L=s.length;
			var A="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
			for(i=0;i<64;i++){e[A.charAt(i)]=i;}
				for(x=0;x<L;x++){
					c=e[s.charAt(x)];b=(b<<6)+c;l+=6;
					while(l>=8){((a=(b>>>(l-=8))&0xff)||(x<(L-2)))&&(r+=w(a));}
				}
			return r;
		}
		
		function strtr (str, from, to) {
			var fr = '',
			i = 0,
			j = 0,
			lenStr = 0,
			lenFrom = 0,
			tmpStrictForIn = false,
			fromTypeStr = '',
			toTypeStr = '',
			istr = '';
			var tmpFrom = [];
			var tmpTo = [];
			var ret = '';
			var match = false;

			if (typeof from === 'object') {
				
				tmpStrictForIn = this.ini_set('phpjs.strictForIn', false);
				from = this.krsort(from);
				this.ini_set('phpjs.strictForIn', tmpStrictForIn);

				for (fr in from) {
					if (from.hasOwnProperty(fr)) {
						tmpFrom.push(fr);
						tmpTo.push(from[fr]);
					}
				}

				from = tmpFrom;
				to = tmpTo;
			}

			lenStr = str.length;
			lenFrom = from.length;
			fromTypeStr = typeof from === 'string';
			toTypeStr = typeof to === 'string';

			for (i = 0; i < lenStr; i++) {
				match = false;
				if (fromTypeStr) {
					istr = str.charAt(i);
					for (j = 0; j < lenFrom; j++) {
						if (istr == from.charAt(j)) {
							match = true;
							break;
						}
					}
				} 
				else {
					for (j = 0; j < lenFrom; j++) {
						if (str.substr(i, from[j].length) == from[j]) {
							match = true;
							i = (i + from[j].length) - 1;
							break;
						}
					}
				}
				if (match) {
					ret += toTypeStr ? to.charAt(j) : to[j];
				} 
				else {
					ret += str.charAt(i);
				}
			}

			return ret;
		}
		
		function strtoupper (str) {
			return (str + '').toUpperCase();
		}
		
		var CryptoJS=CryptoJS||function(h,s){var f={},g=f.lib={},q=function(){},m=g.Base={extend:function(a){q.prototype=this;var c=new q;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
		r=g.WordArray=m.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=s?c:4*a.length},toString:function(a){return(a||k).stringify(this)},concat:function(a){var c=this.words,d=a.words,b=this.sigBytes;a=a.sigBytes;this.clamp();if(b%4)for(var e=0;e<a;e++)c[b+e>>>2]|=(d[e>>>2]>>>24-8*(e%4)&255)<<24-8*((b+e)%4);else if(65535<d.length)for(e=0;e<a;e+=4)c[b+e>>>2]=d[e>>>2];else c.push.apply(c,d);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
		32-8*(c%4);a.length=h.ceil(c/4)},clone:function(){var a=m.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],d=0;d<a;d+=4)c.push(4294967296*h.random()|0);return new r.init(c,a)}}),l=f.enc={},k=l.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var d=[],b=0;b<a;b++){var e=c[b>>>2]>>>24-8*(b%4)&255;d.push((e>>>4).toString(16));d.push((e&15).toString(16))}return d.join("")},parse:function(a){for(var c=a.length,d=[],b=0;b<c;b+=2)d[b>>>3]|=parseInt(a.substr(b,
		2),16)<<24-4*(b%8);return new r.init(d,c/2)}},n=l.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var d=[],b=0;b<a;b++)d.push(String.fromCharCode(c[b>>>2]>>>24-8*(b%4)&255));return d.join("")},parse:function(a){for(var c=a.length,d=[],b=0;b<c;b++)d[b>>>2]|=(a.charCodeAt(b)&255)<<24-8*(b%4);return new r.init(d,c)}},j=l.Utf8={stringify:function(a){try{return decodeURIComponent(escape(n.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return n.parse(unescape(encodeURIComponent(a)))}},
		u=g.BufferedBlockAlgorithm=m.extend({reset:function(){this._data=new r.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=j.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,d=c.words,b=c.sigBytes,e=this.blockSize,f=b/(4*e),f=a?h.ceil(f):h.max((f|0)-this._minBufferSize,0);a=f*e;b=h.min(4*a,b);if(a){for(var g=0;g<a;g+=e)this._doProcessBlock(d,g);g=d.splice(0,a);c.sigBytes-=b}return new r.init(g,b)},clone:function(){var a=m.clone.call(this);
		a._data=this._data.clone();return a},_minBufferSize:0});g.Hasher=u.extend({cfg:m.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){u.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,d){return(new a.init(d)).finalize(c)}},_createHmacHelper:function(a){return function(c,d){return(new t.HMAC.init(a,
		d)).finalize(c)}}});var t=f.algo={};return f}(Math);
		(function(h){for(var s=CryptoJS,f=s.lib,g=f.WordArray,q=f.Hasher,f=s.algo,m=[],r=[],l=function(a){return 4294967296*(a-(a|0))|0},k=2,n=0;64>n;){var j;a:{j=k;for(var u=h.sqrt(j),t=2;t<=u;t++)if(!(j%t)){j=!1;break a}j=!0}j&&(8>n&&(m[n]=l(h.pow(k,0.5))),r[n]=l(h.pow(k,1/3)),n++);k++}var a=[],f=f.SHA256=q.extend({_doReset:function(){this._hash=new g.init(m.slice(0))},_doProcessBlock:function(c,d){for(var b=this._hash.words,e=b[0],f=b[1],g=b[2],j=b[3],h=b[4],m=b[5],n=b[6],q=b[7],p=0;64>p;p++){if(16>p)a[p]=
		c[d+p]|0;else{var k=a[p-15],l=a[p-2];a[p]=((k<<25|k>>>7)^(k<<14|k>>>18)^k>>>3)+a[p-7]+((l<<15|l>>>17)^(l<<13|l>>>19)^l>>>10)+a[p-16]}k=q+((h<<26|h>>>6)^(h<<21|h>>>11)^(h<<7|h>>>25))+(h&m^~h&n)+r[p]+a[p];l=((e<<30|e>>>2)^(e<<19|e>>>13)^(e<<10|e>>>22))+(e&f^e&g^f&g);q=n;n=m;m=h;h=j+k|0;j=g;g=f;f=e;e=k+l|0}b[0]=b[0]+e|0;b[1]=b[1]+f|0;b[2]=b[2]+g|0;b[3]=b[3]+j|0;b[4]=b[4]+h|0;b[5]=b[5]+m|0;b[6]=b[6]+n|0;b[7]=b[7]+q|0},_doFinalize:function(){var a=this._data,d=a.words,b=8*this._nDataBytes,e=8*a.sigBytes;
		d[e>>>5]|=128<<24-e%32;d[(e+64>>>9<<4)+14]=h.floor(b/4294967296);d[(e+64>>>9<<4)+15]=b;a.sigBytes=4*d.length;this._process();return this._hash},clone:function(){var a=q.clone.call(this);a._hash=this._hash.clone();return a}});s.SHA256=q._createHelper(f);s.HmacSHA256=q._createHmacHelper(f)})(Math);
		(function(){var h=CryptoJS,s=h.enc.Utf8;h.algo.HMAC=h.lib.Base.extend({init:function(f,g){f=this._hasher=new f.init;"string"==typeof g&&(g=s.parse(g));var h=f.blockSize,m=4*h;g.sigBytes>m&&(g=f.finalize(g));g.clamp();for(var r=this._oKey=g.clone(),l=this._iKey=g.clone(),k=r.words,n=l.words,j=0;j<h;j++)k[j]^=1549556828,n[j]^=909522486;r.sigBytes=l.sigBytes=m;this.reset()},reset:function(){var f=this._hasher;f.reset();f.update(this._iKey)},update:function(f){this._hasher.update(f);return this},finalize:function(f){var g=
		this._hasher;f=g.finalize(f);g.reset();return g.finalize(this._oKey.clone().concat(f))}})})();
		
		(function(){var h=CryptoJS,j=h.lib.WordArray;h.enc.Base64={stringify:function(b){var e=b.words,f=b.sigBytes,c=this._map;b.clamp();b=[];for(var a=0;a<f;a+=3)for(var d=(e[a>>>2]>>>24-8*(a%4)&255)<<16|(e[a+1>>>2]>>>24-8*((a+1)%4)&255)<<8|e[a+2>>>2]>>>24-8*((a+2)%4)&255,g=0;4>g&&a+0.75*g<f;g++)b.push(c.charAt(d>>>6*(3-g)&63));if(e=c.charAt(64))for(;b.length%4;)b.push(e);return b.join("")},parse:function(b){var e=b.length,f=this._map,c=f.charAt(64);c&&(c=b.indexOf(c),-1!=c&&(e=c));for(var c=[],a=0,d=0;d<e;d++)if(d%4){var g=f.indexOf(b.charAt(d-1))<<2*(d%4),h=f.indexOf(b.charAt(d))>>>6-2*(d%4);c[a>>>2]|=(g|h)<<24-8*(a%4);a++}return j.create(c,a)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
	

	});
}();