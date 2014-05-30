(function ($) {

    $.widget('ui.twoplayer', {

        _case: {

        },

        options: {

            blanc: {

                coup: null,
                nom: null,
                decompte: null,
                piece_reste: ""
            },
            noir: {

                coup: null,
                nom: null,
                decompte: null,
                piece_reste: ""
            },
			sound:true
        },
		
		_create: function(){
		
			var that = this;
			
			that._decompte();
		},
		
		_sound:function() {
			
			var that = this;
			
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
		
		_init: function() {
			
			var that = this;
			
			var _class = "sound";
			
			if(!that.options.sound)
				_class = "no-sound";
			
			that.bt_sound = $('<a id="sound" class="' + _class + '" href="#"></a>').appendTo('#left')
			.click(function() {
				
				that._sound();
				
				return false;
			});
			
			that.jeu = {
				blanc: {
					name: null,
					time: null,
					roi: {
						position: 'e1',
						deplacement_interdit: ""
					},
					pieces: 16
				},
				noir: {
					name: null,
					time: null,
					roi: {
						position: 'e8',
						deplacement_interdit: ""
					},
					pieces: 16
				},
				terminer: false,
				resultat: {
					vainqueur : false,
					nom : false
				},
				tour: 'blanc',
				time: null,
				coup:0,
				position: {
					e1: {
						nom: 'roi',
						couleur: 'blanc',
						deplacement: '',
						capture: '',
						move: false
					},
					e8: {
						nom: 'roi',
						couleur: 'noir',
						deplacement: '',
						capture: '',
						move: false
					},
					d1: {
						nom: 'reine',
						couleur: 'blanc',
						deplacement: '',
						capture: '',
						move: false
					},
					d8: {
						nom: 'reine',
						couleur: 'noir',
						deplacement: '',
						capture: '',
						move: false
					},
					c1: {
						nom: 'fou',
						couleur: 'blanc',
						deplacement: '',
						capture: '',
						move: false
					},
					f1: {
						nom: 'fou',
						couleur: 'blanc',
						deplacement: '',
						capture: '',
						move: false
					},
					c8: {
						nom: 'fou',
						couleur: 'noir',
						deplacement: '',
						capture: '',
						move: false
					},
					f8: {
						nom: 'fou',
						couleur: 'noir',
						deplacement: '',
						capture: '',
						move: false
					},
					b1: {
						nom: 'cavalier',
						couleur: 'blanc',
						deplacement: 'a3.c3',
						capture: '',
						move: false
					},
					g1: {
						nom: 'cavalier',
						couleur: 'blanc',
						deplacement: 'f3.h3',
						capture: '',
						move: false
					},
					b8: {
						nom: 'cavalier',
						couleur: 'noir',
						deplacement: 'a6.c6',
						capture: '',
						move: false
					},
					g8: {
						nom: 'cavalier',
						couleur: 'noir',
						deplacement: 'f6.h6',
						capture: '',
						move: false
					},
					a1: {
						nom: 'tour',
						couleur: 'blanc',
						deplacement: '',
						capture: '',
						move: false
					},
					h1: {
						nom: 'tour',
						couleur: 'blanc',
						deplacement: '',
						capture: '',
						move: false
					},
					a8: {
						nom: 'tour',
						couleur: 'noir',
						deplacement: '',
						capture: '',
						move: false
					},
					h8: {
						nom: 'tour',
						couleur: 'noir',
						deplacement: '',
						capture: '',
						move: false
					},
					a2: {
						nom: 'pion',
						couleur: 'blanc',
						deplacement: 'a3.a4',
						capture: '',
						move: false
					},
					b2: {
						nom: 'pion',
						couleur: 'blanc',
						deplacement: 'b3.b4',
						capture: '',
						move: false
					},
					c2: {
						nom: 'pion',
						couleur: 'blanc',
						deplacement: 'c3.c4',
						capture: '',
						move: false
					},
					d2: {
						nom: 'pion',
						couleur: 'blanc',
						deplacement: 'd3.d4',
						capture: '',
						move: false
					},
					e2: {
						nom: 'pion',
						couleur: 'blanc',
						deplacement: 'e3.e4',
						capture: '',
						move: false
					},
					f2: {
						nom: 'pion',
						couleur: 'blanc',
						deplacement: 'f3.f4',
						capture: '',
						move: false
					},
					g2: {
						nom: 'pion',
						couleur: 'blanc',
						deplacement: 'g3.g4',
						capture: '',
						move: false
					},
					h2: {
						nom: 'pion',
						couleur: 'blanc',
						deplacement: 'h3.h4',
						capture: '',
						move: false
					},
					a7: {
						nom: 'pion',
						couleur: 'noir',
						deplacement: 'a6.a5',
						capture: '',
						move: false
					},
					b7: {
						nom: 'pion',
						couleur: 'noir',
						deplacement: 'b6.b5',
						capture: '',
						move: false
					},
					c7: {
						nom: 'pion',
						couleur: 'noir',
						deplacement: 'c6.c5',
						capture: '',
						move: false
					},
					d7: {
						nom: 'pion',
						couleur: 'noir',
						deplacement: 'd6.d5',
						capture: '',
						move: false
					},
					e7: {
						nom: 'pion',
						couleur: 'noir',
						deplacement: 'e6.e5',
						capture: '',
						move: false
					},
					f7: {
						nom: 'pion',
						couleur: 'noir',
						deplacement: 'f6.f5',
						capture: '',
						move: false
					},
					g7: {
						nom: 'pion',
						couleur: 'noir',
						deplacement: 'g6.g5',
						capture: '',
						move: false
					},
					h7: {
						nom: 'pion',
						couleur: 'noir',
						deplacement: 'h6.h5',
						capture: '',
						move: false
					}
				},
				sauvegarde: {}

			}
			
			$('#right').empty().html();
			
			var pieces = $('<div class="pieces"></div>').appendTo('#right');
			
			that.options.noir.pieces = $('<div class="blanc"></div>').appendTo(pieces);
			
			that.options.blanc.pieces = $('<div class="noir"></div>').css('margin-top', '5px').appendTo(pieces);
			
			that.jeu.blanc.name = $('input[type=text][name=player1]').val();

			that.jeu.noir.name = $('input[type=text][name=player2]').val();

			that.jeu.time = $('select[name=time]').val();

			$(that.element).css('margin-top', '10px').empty().html();

			if (!that.jeu.blanc.name) {

				that.jeu.blanc.name = $.options.text.player + ' 1';
			}

			if (!that.jeu.noir.name) {

				that.jeu.noir.name = $.options.text.player + ' 2';
			}

			var div = $('<div class="profil_jeu"></div>').appendTo(that.element);

			that.options.noir.nom = $('<div style="margin-left:10px;font-size:20px" class="nom">' + that.jeu.noir.name + '</div>').appendTo(div);

			if (that.jeu.time) {

				that.jeu.noir.time = that.jeu.time;

				var time = that._time(that.jeu.noir.time);

				that.options.noir.decompte = $('<div class="decompte">' + time + '</div>').appendTo(div).css('top', '10px');

			}
			
			var coup = $('<div id="coup"></div>').appendTo(that.element);

			that.options.noir.coup = $('<div class="coup"></div>').appendTo(coup);
			that.options.blanc.coup = $('<div class="coup"></div>').appendTo(coup);

			var jeu = $('<div id="jeu_blanc"></div>').appendTo(that.element);

			var arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

			for (var a in arr) {

				for (i = 1; i < 9; i++) {

					var pos = arr[a] + i;

					that._case[pos] = $('<div id="' + pos + '" class="case ' + arr[a] + ' _' + i + '"></div>').appendTo(jeu);

					if (that.jeu.position[pos]) {
						that._jeu(pos, that.jeu.position[pos]);
					}
				}
			}

			var div = $('<div class="profil_jeu"></div>').appendTo(that.element);
			
			that.options.blanc.nom = $('<div style="margin-left:10px;font-size:20px;color:#930" class="nom">' + that.jeu.blanc.name + '</div>').appendTo(div);
			
			if (that.jeu.time) {

				that.jeu.blanc.time = that.jeu.time;

				var time = that._time(that.jeu.blanc.time);

				that.options.blanc.decompte = $('<div class="decompte">' + time + '</div>').appendTo(div).css('top', '10px');;
			}

		},

        _jeu: function (position, pion) {

            var that = this;

            _pion = $('<div class="piece ' + pion.nom + '_' + pion.couleur + '"></div>');
            $(that._case[position]).empty().append(_pion);

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
        },

        _deplace: function (depart, arriver, pion) {

            var that = this;

            that._case[arriver].droppable({

                drop: function (event, ui) {

                    $('.piece').draggable({ 
                    	disabled: true 
                    }).removeClass('ui-draggable');

                    $(this).append(ui.draggable);

                    var extension = "";

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
                                        move: true
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
                                        move: true
                                    }

                                    delete that.jeu.position['h' + chiffre];

                                    extension = ' 0-0';

                                    break;

                            }
                        }
                    }

                    that._move(pion, depart, arriver, ' ', extension);
                }
            });
        },

        _capture: function (depart, arriver, pion) {

            var that = this;
			
			var piece = "";

            that._case[arriver].droppable({

                drop: function (event, ui) {

                    $('.piece').draggable({ 
                    	disabled: true 
                    }).removeClass('ui-draggable');

                    var extension = "";

                    if (!that.jeu.position[arriver]) {

                        piece = that._prise_passant(arriver);

                        extension = ' e.p.';
                    }
					else {
						
						piece = that.jeu.position[arriver].nom;
					}

                    $(this).empty().append(ui.draggable);

                    if (pion.couleur == "blanc") {

                        that.jeu.noir.pieces = that.jeu.noir.pieces - 1;
						
						$(that.options.noir.pieces).append('<div class="piece ' + piece + '"></div>');
                    }
                    else {

                        that.jeu.blanc.pieces = that.jeu.blanc.pieces - 1;
						
						$(that.options.blanc.pieces).append('<div class="piece ' + piece + '"></div>');
                    }


                    that._move(pion, depart, arriver, 'x', extension);
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

        _promotion: function (nom, couleur, depart, arriver) {

            var that = this;

            $('<div class="piece ' + nom + '_' + couleur + '"></div>').appendTo(that.fenetre)
            .click(function () {

                $('#fade').css('display', 'none');
                $('#fenetre_piece').remove();
                $('#' + arriver).empty().append(this);

                that.jeu.position[arriver].nom = nom;

                that._charge(depart, arriver);
            });
        },

        _move: function (pion, depart, arriver, signe, extension) {

            var that = this;
			
			if(that.options.sound && $('#audio #move')[0]) $('#audio #move')[0].play();

            that.position_en_passant = [];
			
			if (that.jeu.position[depart].nom == 'pion') {

                // Prise en passant (controle)

                if (that.jeu.position[depart].move == false) {

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
                move: true
            }

            if (pion.nom == "roi") {

                that.jeu[pion.couleur].roi.position = arriver;
            }
			
			$('.case').css('background', "");
			
			$(that._case[depart]).css('background', '#930');
			$(that._case[arriver]).css('background', '#930');
			
			that.coup = $(that.options[that.jeu.tour].coup).prepend('<div>' + depart + signe + arriver + extension + '</div>');

            if (pion.nom == 'pion' && arriver.substr(-1) == 1 || pion.nom == 'pion' && arriver.substr(-1) == 8) {

                $('#fade').css('display', 'block');

                that.fenetre = $('<div id="fenetre_piece"></div>').appendTo('#conteneur');

                var arr = ['reine', 'tour', 'fou', 'cavalier'];

                for (var i in arr) {

                    that._promotion(arr[i], pion.couleur, depart, arriver);
                }
            }
            else {

                that._charge(depart, arriver);
			}
        },

        _charge: function (depart, arriver) {

            var that = this;

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
                var fonction =  that._verif_roi_interdit();

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

                        if(that.jeu.tour == that.pion_couleur){

                            that.pat = false;
                        }
                    }

                    if (that.capture.length > 0) {

                        capture = that.capture.join('.');

                        if(that.jeu.tour == that.pion_couleur) {

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
			
			var position = JSON.stringify(that.jeu.position);
			
			that.jeu.coup++;
			
			that.jeu.sauvegarde[that.jeu.coup] = {
				depart:depart,
				arriver:arriver,
				jeu:JSON.parse(position)
			};
			
			if(that.mat == true){
					
                that.jeu.terminer = true;
                that.jeu.resultat.nom = 'mat';
					
                if(that.jeu.tour == 'noir'){
                    that.jeu.resultat.vainqueur = 1;
                }
                else{
                    that.jeu.resultat.vainqueur = 2;
                }

                that._resultat();
            }
			else if(that.pat == true || that.nul == true){
                
                that.jeu.terminer = true;
                that.jeu.resultat.vainqueur = 0;

                if (that.pat == true) {

                    that.jeu.resultat.nom = 'pat';
                }
                else {

                    that.jeu.resultat.nom = 'nul';
                }

                that._resultat();
            }
			
			$('.nom').css('color', '#000');

            if (that.jeu.terminer == false) {

                $(that.options[that.jeu.tour].nom).css('color', '#930');

                for (var i in that.jeu.position) {

                    that._jeu(i, that.jeu.position[i]);
                }
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

                    if (that.roi_echec == false && that.pion_move == false) {
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
                    var fonction =  that._verif_capture_pion();

                    that.lettre = lettre;
                    var fonction = that._verif_deplacement_pion();

                    if (that.deplacement.length > 0) {

                        if (that.pion_move == false) {

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

        _piece_avant_roi: function(){

            var that = this;

            if(that.pion_nom == 'reine' || that.pion_nom == 'tour' || that.pion_nom == 'fou'){
			
                var key = that.sauvegarde_capture;
			
                var pion_nom = that.jeu.position[key].nom;
                var pion_deplacement = that.jeu.position[key].deplacement;
                var pion_capture = that.jeu.position[key].capture;
                var pion_move = that.jeu.position[key].move;
			
                var deplacement="";
                var capture="";
			
                if(pion_nom == 'reine' || that.pion_nom == pion_nom){
                    
                    capture = that.pion_position;
                    
                    if(that.deplacement_avant_roi){
                        
                        deplacement = that.deplacement_avant_roi.join('.');
                    }
                }
                else if (that.pion_nom == 'reine' && pion_nom != 'cavalier' && pion_nom != 'pion'){
				
                    var _capture = pion_capture.split('.');
                    
                    if ($._in_array(that.pion_position, _capture)){
                        
                        capture = that.pion_position;
                        
                        if (that.deplacement_avant_roi){
                            
                            deplacement = that.deplacement_avant_roi.join('.');
                        }
                    }
                }
                else if (pion_nom == 'pion') {
				
                    var lettre = that._lettre_chiffre(that.pion_position.substr(0,1));
                    var lettre_pion = that._lettre_chiffre(key.substr(0,1));
				
                    var _deplacement = pion_deplacement.split('.');

                    if (lettre == lettre_pion && !$._in_array(that.pion_position, _deplacement)){
                        
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

        _decompte: function () {

            var that = this;
			
			if(that.jeu && that.jeu.time && that.jeu.terminer == false){

				var time = that.jeu[that.jeu.tour].time;

				that.jeu[that.jeu.tour].time = that.jeu[that.jeu.tour].time - 1;

				if (time >= 0) {

					var time = that._time(time);

					$(that.options[that.jeu.tour].decompte).empty().append(time);
					
				} else {

					$('.piece').draggable({ 
                    	disabled: true 
                    }).removeClass('ui-draggable');

					that.jeu.terminer = true;

					if (that.jeu.tour == 'blanc') {

						that.jeu.resultat.vainqueur = 2;
					}
					else {

						that.jeu.resultat.vainqueur = 1;
					}

					that.jeu.resultat.nom = 'time';

					that._resultat();
				}
			}
			
			setTimeout(function () { that._decompte() }, 1000);
        },

        _resultat: function () {

            var that = this;
			
			var div = $('<div class="replay"></div>').appendTo(that.element);
			var max = that.jeu.coup;
			
			$('<button> < </button>').appendTo(div)
			.click(function() {
				that.jeu.coup = 1;
				that._sauvegarde();
			});
			
			$('<button> << </button>').appendTo(div)
			.click(function() {
				if(that.jeu.sauvegarde[that.jeu.coup - 1]) {
					that.jeu.coup --;
					that._sauvegarde();
				}
			});
			
			that.num_replay = $('<span class="num">' + that.jeu.coup + '</span>').appendTo(div);
			
			$('<button> >> </button>').appendTo(div)
			.click(function() {
				if(that.jeu.sauvegarde[that.jeu.coup + 1]) {
					that.jeu.coup ++;
					that._sauvegarde();
				}
			});
			
			$('<button> > </button>').appendTo(div)
			.click(function() {
				that.jeu.coup = max;
				that._sauvegarde();
			});

            $('#fade').css('display', 'block');
            var fenetre = $('<div class="fenetre"></div>').appendTo(that.element);

            var close = $('<div class="close"></div>').appendTo(fenetre);

            var game_over = $.options.text.game_over;
            var resultat = $.options.text[that.jeu.resultat.nom];

            $('<h2>' + game_over + '</h2>').appendTo(fenetre);
            $('<div class="resultat">' + resultat + '</div>').appendTo(fenetre);

            var winner = $.options.text.winner;

            if (that.jeu.resultat.vainqueur == 1) {

                $('<div class="vainqueur">' + winner + ' : ' + that.jeu.blanc.name + '</div>').appendTo(fenetre);
            }
            else if (that.jeu.resultat.vainqueur == 2) {

                $('<div class="vainqueur">' + winner + ' : ' + that.jeu.noir.name + '</div>').appendTo(fenetre);
            }

            $(close).click(function () {
                $('#fade').css('display', 'none');
                $('.fenetre').css('display', 'none');
            });
        },
		
		_sauvegarde: function() {
			
			var that = this;
			
			$(that.num_replay).empty().text(that.jeu.coup);
			
			$('.case').css('background', "").empty().html();
			$(that._case[that.jeu.sauvegarde[that.jeu.coup].depart]).css('background', '#930');
			$(that._case[that.jeu.sauvegarde[that.jeu.coup].arriver]).css('background', '#930');
			
			for (var i in that.jeu.sauvegarde[that.jeu.coup].jeu) {

				var position = i;
				var pion = that.jeu.sauvegarde[that.jeu.coup].jeu[i];
				
				var _pion = $('<div class="piece ' + pion.nom + '_' + pion.couleur + '"></div>');
				$(that._case[position]).empty().append(_pion);
			}
		},

        _time: function (time) {

            var that = this;

            var minute = Math.floor(time / 60);
            var seconde = Math.floor(time - (minute * 60));

            return $._sprintf(minute) + ':' + $._sprintf(seconde);
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
        }

    });

})(jQuery);