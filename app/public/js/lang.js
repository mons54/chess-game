(function($){
	
	$.extend({
	
		options: {
			
			lang: {
				
				ar: {
					title: "شطرنج",
					description: "لعبة الملوك والعباقرة . لعب لعبة شطرنج مع اصدقاءك .",
					online: "على الانترنت",
					offline: "حاليا",
					home: "الرئيسية",
					play: "طريقة اللعب",
					ranking: "الترتيب",
					invite: "يدعو",
					points: "النقاط",
					player: "لاعب",
					challengers: "منافسيه",
					all: "جميع",
					time: "مرة",
					minutes: "دقائق",
					color: "اللون",
					blanc: "أبيض",
					noir: "أسود",
					min: "الحد الأدنى",
					max: "أقصى",
					winner: "الفائز",
					game_over: "أكثر من لعبة",
					mat: "أمات الشاه الشطرنج",
					pat: "إحراج الشاه في الشطرنج",
					nul: "تعادل",
					start_game: "بدء اللعبة",
					search_game: "البحث عن لعبة",
					level: "مستوى",
					facile: "سهل",
					normal: "طبيعي",
					difficile: "شاق",
					none: "لا شيء",
					one_player: "لاعب واحد",
					two_player: "لاعبين اثنين",
					error_browser : "متصفحك لا يتوافق مع هذه اللعبة",
					error: "حدث خطأ",
					wait_game: "في انتظار لعبة ...",
					offer_draw: "رسم",
					offers_a_draw: "يقدم بالتعادل",
					resign: "استقال",
					ok: "حسنا",
					cancel: "إلغاء",
					create_game: "خلق لعبة",
					defier: "تحدى",
					new_defi: "التحدي الجديد",
					cancel_partie: "هذه اللعبة لم تعد موجودة",
					win: "كسب",
					lose: "فقد",
					draw: "رسم",
					game: "لعبة",
					connected: "متصل",
					quick_game: "لعبة",
					defi: "تحد",
					partager: "المشاركة",
					friends: "أصدقاء",
					shop: "تسوق",
					tokens: "رقائق",
					free_tokens: "رقائق مجانا",
					no_tokens: "لم يكن لديك ما يكفي من رقائق للعب.",
					buy_tokens: "شراء رقائق",
					congratulation: "تهنئة",
					fanpage: "مروحة الصفحة",
					terms_service: "شروط الخدمة",
					privacy_policy: "سياسة الخصوصية",
					invite_friends: {
						title: "دعوة أصدقائك (30 كحد أقصى)",
						infos: "وكسب 10٪ من رقائق الذي تقوم به دعوة مقبولة",
						send: "إرسال دعوات",
						max_requests: "لقد أرسلت بالفعل 30 دعوات اليوم.",
						all: "جميع الأصدقاء"
					},
					pub: {
						title: "القزم الأصفر",
						text: "بطاقة المباراة عبر الإنترنت. تخليص نفسك من كل ما تبذلونه من بطاقات ويفوز في الرهان."
					},
					trophy: {
						title:"كأس",
						win: "تربح الكأس",
						content: {
							1: {
								_class: "_1_game",
								title: "مبتدئ",
								description:"تلعب لعبة 1"
							},
							2: {
								_class: "_100_game",
								title: "مبتدئ",
								description:"لعب 100 مباراة"
							},
							3: {
								_class:"_500_game",
								title:"​​متوسط",
								description:"لعب 500 مباراة"
							},
							4: {
								_class: "_1000_game",
								title:"متقدم",
								description:"لعب ألعاب 1000"
							},
							5: {	
								_class: "_5000_game",
								title:"خبير",
								description:"لعب ألعاب 5000"
							},
							6: {
								_class: "_1_wins",
								title: "بطل الشوكولاته",
								description: "فوز لعبة 1"
							},
							7: {
								_class: "_50_wins",
								title: "بطل البرونزية",
								description: "فوز 50 مباراة"
							},
							8: {
								_class: "_250_wins",
								title: "بطل الفضة",
								description: "فوز 250 مباراة"
							},
							9: {
								_class: "_500_wins",
								title: "بطل الذهب",
								description: "فوز 500 مباراة"
							},
							10: {
								_class: "_2000_wins",
								title: "بطل البلاتين",
								description: "فوز 2000 ألعاب"
							},
							11: {
								_class: "_5_games_day",
								title: "الهاوي",
								description:"لعب 5 مباريات في يوم واحد"
							},
							12: {
								_class: "_10_games_day",
								title: "متحمس",
								description:"لعب 10 مباراة في يوم واحد"
							},
							13: {
								_class: "_25_games_day",
								title: "مروحة",
								description:"لعب 25 مباراة في يوم واحد"
							},
							14: {
								_class: "_50_games_day",
								title: "سوبر فان",
								description:"لعب 50 مباراة في يوم واحد"
							},
							15: {
								_class: "_100_games_day",
								title: "مدمن",
								description:"لعب 100 مباراة في يوم واحد"
							},
							16: {
								_class: "_3_wins_cons",
								title: "الفائز",
								description:"فوز 3 مباريات متتالية"
							},
							17: {
								_class: "_5_wins_cons",
								title: "فاتح",
								description:"فوز 5 مباريات متتالية"
							},
							18: {
								_class: "_10_wins_cons",
								title: "القاتل",
								description:"فوز 10 مباراة متتالية"
							},
							19: {
								_class: "_20_wins_cons",
								title: "لا يقهر",
								description:"فوز 20 مباراة متتالية"
							},
							20: {
								_class: "_3_loses_cons",
								title: "خاسر",
								description:"تفقد 3 مباريات متتالية"
							}
						}
					}
				},
				de: {
					title: "Schach",
					description: "spielen Partie Schach gegen andere Spieler. Vergleichen Sie Ihre Ergebnisse mit anderen Spielern und erkämpfen Sie sich einen Platz in der Rangliste.",
					online: "Online",
					offline: "Offline",
					home: "Home",
					play: "spielen",
					ranking: "Rangliste",
					invite: "Laden",
					points: "Punkte",
					player: "Spieler",
					challengers: "Herausforderer",
					all: "All",
					time: "Zeit",
					minutes: "Minuten",
					color: "Farbe",
					blanc: "weiß",
					noir: "Schwarz",
					min: "Mini",
					max: "Maxi",
					winner: "Gewinner",
					game_over: "Game Over",
					mat: "Schachmatt",
					pat: "Patt",
					nul: "Remis",
					start_game: "Spiel starten",
					search_game: "Suche nach einem Spiel",
					level: "Ebene",
					facile: "leicht",
					normal: "normal",
					difficile: "schwer",
					none: "Ninguno",
					one_player: "Ein Spieler",
					two_player: "zwei Spieler",
					error_browser : "Ihr Browser ist nicht kompatibel mit diesem Spiel",
					error: "Ein Fehler ist aufgetreten",
					wait_game: "Waiting for a game ...",
					offer_draw: "Remis anbieten",
					offers_a_draw: "anbiete ein Remis",
					resign: "aufgeben",
					ok: "Ok",
					cancel: "Abbrechen",
					create_game: "Erstellen Sie ein Spiel",
					defier: "Herausfordern",
					new_defi: "neue Herausforderung",
					cancel_partie: "Dieses Spiel ist nicht mehr vorhanden",
					win: "gewinnen",
					lose: "verlieren",
					draw: "Remis",
					game: "Spiel",
					connected: "verbunden",
					quick_game: "Spiel",
					defi: "Herausforderung",
					partager: "Teilen",
					friends: "Freunde",
					shop: "Shop",
					tokens: "Chips",
					free_tokens: "Free Chips",
					no_tokens: "Sie haben noch genug Chips, um zu spielen.",
					buy_tokens: "Chips kaufen",
					congratulation: "Glückwunsch",
					fanpage: "Fan Page",
					terms_service: "Nutzungsbedingungen",
					privacy_policy: "Datenschutz",
					invite_friends: {
						title: "Laden Sie Ihre Freunde (30 max)",
						infos: "Und verdienen 10% der Chips auf Einladung spielte akzeptiert",
						send: "Einladungen senden",
						max_requests: "Sie haben bereits 30 Einladungen verschickt heute.",
						all: "Alle Freunde"
					},
					pub: {
						title: "Der Gelbe Zwerg",
						text: "Kartenspiel online. Befreien Sie sich von all Ihre Karten und gewinnt die Wette."
					},
					trophy: {
						title:"Trophäe",
						win: "Sie gewinnen eine Trophäe",
						content: {
							1: {
								_class: "_1_game",
								title: "Neuling",
								description:"Spielen Sie 1 Spiel"
							},
							2: {
								_class: "_100_game",
								title: "Anfänger",
								description:"Spielen Sie 100 Spiele"
							},
							3: {
								_class: "_500_game",
								title:"Zwischen-",
								description:"Spielen Sie 500 Spiele"
							},
							4: {
								_class: "_1000_game",
								title:"fortgeschritten",
								description:"Spielen Sie 1000 Spiele"
							},
							5: {
								_class: "_5000_game",
								title:"Experte",
								description:"Spielen Sie 5000 Spiele"
							},
							6: {
								_class: "_1_wins",
								title: "Meister Schokolade",
								description: "Gewinnen Sie 1 Spiel"
							},
							7: {
								_class: "_50_wins",
								title: "Meister Bronze",
								description: "Gewinnen Sie 50 Spiele"
							},
							8: {
								_class: "_250_wins",
								title: "Meister Bronze",
								description: "Gewinnen Sie 250 Spiele"
							},
							9: {
								_class: "_500_wins",
								title: "Meister Gold",
								description: "Gewinnen Sie 500 Spiele"
							},
							10: {
								_class: "_2000_wins",
								title: "Meister Platin",
								description: "Gewinnen Sie 2000 Spiele"
							},
							11: {
								_class: "_5_games_day",
								title: "Amateur",
								description:"Spielen Sie 5 Spiele an einem Tag"
							},
							12: {
								_class: "_10_games_day",
								title: "Enthusiast",
								description:"Spielen Sie 10 Spiele an einem Tag"
							},
							13: {
								_class: "_25_games_day",
								title: "Fan",
								description:"Spielen Sie 25 Spiele an einem Tag"
							},
							14: {
								_class: "_50_games_day",
								title: "Super Fan",
								description:"Spielen Sie 50 Spiele an einem Tag"
							},
							15: {
								_class: "_100_games_day",
								title: "Süchtige",
								description:"Spielen Sie 100 Spiele an einem Tag"
							},
							16: {
								_class: "_3_wins_cons",
								title: "Gewinner",
								description:"Gewinne 3 Spiele in Folge"
							},
							17: {
								_class: "_5_wins_cons",
								title: "Eroberer",
								description:"Gewinne 5 Spiele in Folge"
							},
							18: {
								_class: "_10_wins_cons",
								title: "Killer",
								description:"Gewinne 10 Spiele in Folge"
							},
							19: {
								_class: "_20_wins_cons",
								title: "unbesiegbar",
								description:"Gewinne 20 Spiele in Folge"
							},
							20: {
								_class: "_3_loses_cons",
								title: "Verlierer",
								description:"Lose 3 Spiele in Folge"
							}
						}
					}
				},
				es: {
					title: "Ajedrez",
					description: "Juega en línea contra otros jugadores. Que seas amateur del juego rapido o seas partidario de las partidas largas, Ajedrez esta hecho a su medida. Su ranking se actualiza despues de cada partida.",
					online: "En línea",
					offline: "Fuera de línea",
					home: "Home",
					play: "Jugar",
					ranking: "Clasificación",
					invite: "Invitar",
					points: "Puntos",
					player: "Jugador",
					challengers: "challengers",
					all: "Todos",
					time: "Tiempo",
					minutes: "minutos",
					color: "Color",
					blanc: "Blanco",
					noir: "Negro",
					min: "Mínimo",
					max: "Máximo",
					winner: "Ganador",
					game_over: "Game Over",
					mat: "Jaque mate",
					pat: "Ahogado",
					nul: "Tablas",
					start_game: "Inicio del juego",
					search_game: "Buscar un juego",
					level: "Nivel",
					facile: "Fácil",
					normal: "Normal",
					difficile: "Duro",
					none: "Nenhum",
					one_player: "Uno jugador",
					two_player: "Dos jugadores",
					error_browser : "Su navegador no es compatible con este juego",
					error: "Se produjo un error",
					wait_game: "Esperando a un juego ...",
					offer_draw: "Ofrecer tablas",
					offers_a_draw: "ofrece tablas",
					resign: "Abandonar",
					ok: "Ok",
					cancel: "Cancelar",
					create_game: "Crear un juego",
					defier: "Desafiar",
					new_defi: "Nuevo desafío",
					cancel_partie: "Este juego ya no existe",
					win: "Ganar",
					lose: "Perder",
					draw: "Tablas",
					game: "Juego",
					connected: "conectado",
					quick_game: "juego",
					defi: "desafío",
					partager: "Compartir",
					friends: "Amigos",
					shop: "Tienda",
					tokens: "Fichas",
					free_tokens: "Fichas gratis",
					no_tokens: "Usted no tiene suficientes fichas para jugar.",
					buy_tokens: "Compra fichas",
					congratulation: "Felicitación",
					fanpage: "Fan Page",
					terms_service: "Condiciones del servicio",
					privacy_policy: "Política de privacidad",
					invite_friends: {
						title: "Invite a sus amigos (30 max)",
						infos: "Y ganar el 10% de las fichas jugadas por invitación aceptada",
						send: "Enviar invitaciones",
						max_requests: "Usted ya ha enviado 30 invitaciones hoy.",
						all: "Todos los amigos"
					},
					pub: {
						title: "Enano Amarillo",
						text: "Juego de cartas en línea. Librarse de todas tus cartas y gana la apuesta."
					},
					trophy: {
						title:"Trofeo",
						win: "Usted gana un trofeo",
						content: {
							1: {
								_class: "_1_game",
								title: "Principiante",
								description:"Juega 1 juego"
							},
							2: {
								_class: "_100_game",
								title: "Novicio",
								description:"Juega 100 juegos"
							},
							3: {
								_class: "_500_game",
								title:"Intermedio",
								description:"Juega 500 juegos"
							},
							4: {
								_class: "_1000_game",
								title:"Avanzado",
								description:"Juega 1000 juegos"
							},
							5: {
								_class: "_5000_game",
								title:"Experto",
								description:"Juega 5000 juegos"
							},
							6: {
								_class: "_1_wins",
								title: "Campeón del chocolate",
								description: "Gana 1 juego"
							},
							7: {
								_class: "_50_wins",
								title: "Campeón de bronce",
								description: "Gana 50 juegos"
							},
							8: {
								_class: "_250_wins",
								title: "Campeón de plata",
								description: "Gana 250 juegos"
							},
							9: {
								_class: "_500_wins",
								title: "Campeón de oro",
								description: "Gana 500 juegos"
							},
							10: {
								_class: "_2000_wins",
								title: "Campeón del platino",
								description: "Gana 2000 juegos"
							},
							11: {
								_class: "_5_games_day",
								title: "Aficionado",
								description:"Juega 5 juegos en un día"
							},
							12: {
								_class: "_10_games_day",
								title: "Entusiasta",
								description:"Juega 10 juegos en un día"
							},
							13: {
								_class: "_25_games_day",
								title: "Fan",
								description:"Juega 25 juegos en un día"
							},
							14: {
								_class: "_50_games_day",
								title: "Super Fan",
								description:"Juega 50 juegos en un día"
							},
							15: {
								_class: "_100_games_day",
								title: "Adicto",
								description:"Juega 100 juegos en un día"
							},
							16: {
								_class: "_3_wins_cons",
								title: "Ganador",
								description:"Gana 3 juegos consecutivos"
							},
							17: {
								_class: "_5_wins_cons",
								title: "Conquistador",
								description:"Gana 5 juegos consecutivos"
							},
							18: {
								_class: "_10_wins_cons",
								title: "Asesino",
								description:"Gana 10 juegos consecutivos"
							},
							19: {
								_class: "_20_wins_cons",
								title: "Invencible",
								description:"Gana 250 juegos consecutivos"
							},
							20: {
								_class: "_3_loses_cons",
								title: "Perdedor",
								description:"Perder 3 juegos consecutivos"
							}
						}
					}
				},
				fr: {
					title: "Échecs",
					description: "Jouez aux échecs contre des joueurs du monde entier. Défiez les meilleurs et faites vous une place dans le classement.",
					online: "En ligne",
					offline: "Hors ligne",
					home: "Accueil",
					play: "Jouer",
					ranking: "Classement",
					invite: "Inviter",
					points: "Points",
					player: "Joueur",
					challengers: "challengers",
					all: "Tous",
					time: "Temps",
					minutes: "minutes",
					color: "Couleur",
					blanc: "Blanc",
					noir: "Noir",
					min: "Minimum",
					max: "Maximum",
					winner: "Gagnant",
					game_over: "Game Over",
					mat: "Échec et mat",
					pat: "Pat",
					nul: "Égalité",
					start_game: "Démarrer la partie",
					search_game: "Rechercher une partie",
					level: "Niveau",
					facile: "Facile",
					normal: "Normal",
					difficile: "Difficile",
					none: "Aucun",
					one_player: "Un joueur",
					two_player: "Deux joueurs",
					error_browser : "Votre navigateur n'est pas compatible avec ce jeu",
					error: "Une erreur est survenue",
					wait_game: "En attente d'une partie ...",
					offer_draw: "Proposer le nul",
					offers_a_draw: "propose le nul",
					resign: "Abandonner",
					ok: "Valider",
					cancel: "Annuler",
					create_game: "Creer une partie",
					defier: "Défier",
					new_defi: "Nouveau défi",
					cancel_partie: "Cette partie n'existe plus",
					win: "Victoire",
					lose: "Défaite",
					draw: "Nul",
					game: "Jeu",
					connected: "connectés",
					quick_game: "partie",
					defi: "défi",
					partager: "Partager",
					friends: "Amis",
					shop: "Boutique",
					tokens: "Jetons",
					free_tokens: "Jetons gratuits",
					no_tokens: "Vous n'avez pas assez de jetons pour jouer.",
					buy_tokens: "Acheter des jetons",
					congratulation: "Félicitation",
					fanpage: "Fan Page",
					terms_service: "Conditions d'utilisation",
					privacy_policy: "Politique de confidentialité",
					invite_friends: {
						title: "Invitez vos amis (30 max)",
						infos: "Et gagnez 10% des jetons joués par invitation acceptée",
						send: "Envoyer les invitations",
						max_requests: "Vous avez déjà envoyé 30 invitations aujourd'hui.",
						all: "Tous les amis"
					},
					pub: {
						title: "Nain Jaune",
						text: "Jeu de cartes en ligne. Débarrasse toi de toutes tes cartes et remporte les mises."
					},
					trophy: {
						title:"Trophées",
						win: "Vous gagnez un trophée.",
						content: {
							1: {
								_class: "_1_game",
								title: "Débutant",
								description:"Jouer 1 partie"
							},
							2: {
								_class: "_100_game",
								title: "Apprenti",
								description:"Jouer 100 parties"
							},
							3: {
								_class: "_500_game",
								title:"Intermédiaire",
								description:"Jouer 500 parties"
							},
							4: {
								_class: "_1000_game",
								title:"Confirmé",
								description:"Jouer 1000 parties"
							},
							5: {
								_class: "_5000_game",
								title:"Expert",
								description:"Jouer 5000 parties"
							},
							6: {
								_class: "_1_wins",
								title: "Champion de Chocolat",
								description: "Gagner 1 partie"
							},
							7: {
								_class: "_50_wins",
								title: "Champion de Bronze",
								description: "Gagner 50 parties"
							},
							8: {
								_class: "_250_wins",
								title: "Champion d'Argent",
								description: "Gagner 250 parties"
							},
							9: {
								_class: "_500_wins",
								title: "Champion d'Or",
								description: "Gagner 500 parties"
							},
							10: {
								_class: "_2000_wins",
								title: "Champion de platine",
								description: "Gagner 2000 parties"
							},
							11: {
								_class: "_5_games_day",
								title: "Amateur",
								description:"Jouer 5 parties en une journée"
							},
							12: {
								_class: "_10_games_day",
								title: "Passionné",
								description:"Jouer 10 parties en une journée"
							},
							13: {
								_class: "_25_games_day",
								title: "Fan",
								description:"Jouer 25 parties en une journée"
							},
							14: {
								_class: "_50_games_day",
								title: "Super Fan",
								description:"Jouer 50 parties en une journée"
							},
							15: {
								_class: "_100_games_day",
								title: "Accro",
								description:"Jouer 100 parties en une journée"
							},
							16: {
								_class: "_3_wins_cons",
								title: "Vainqueur",
								description:"Gagner 3 parties à la suite"
							},
							17: {
								_class: "_5_wins_cons",
								title: "Conquérant",
								description:"Gagner 5 parties à la suite"
							},
							18: {
								_class: "_10_wins_cons",
								title: "Killer",
								description:"Gagner 10 parties à la suite"
							},
							19: {
								_class: "_20_wins_cons",
								title: "Invincible",
								description:"Gagner 20 parties à la suite"
							},
							20: {
								_class: "_3_loses_cons",
								title: "Loser",
								description:"Perdre 3 parties à la suite"
							}
						}
					}
				},
				it: {
					title: "Scacchi",
					description: "Giocare a scacchi in linea contro i giocatori di tutte il mondo.",
					online: "In linea",
					offline: "Non in linea",
					home: "Home",
					play: "Giocare",
					ranking: "Classifica",
					invite: "Invitare",
					points: "Punti",
					player: "Giocatore",
					challengers: "sfidanti",
					all: "Tutti",
					time: "Tempo",
					minutes: "verbale",
					color: "Colore",
					blanc: "Bianco",
					noir: "Nero",
					min: "Minimo",
					max: "Massimo",
					winner: "Vincitore",
					game_over: "Game Over",
					mat: "Scacco Matto",
					pat: "Stallo",
					nul: "Pari",
					start_game: "Inizia la partita",
					search_game: "Cerca un gioco",
					level: "Livello",
					facile: "Facile",
					normal: "Normale",
					difficile: "Duro",
					none: "Nessuno",
					one_player: "Un giocatore",
					two_player: "Due giocatori",
					error_browser : "Il tuo browser non è compatibile con questo gioco",
					error: "C'è stato un errore",
					wait_game: "In attesa di un gioco ...",
					offer_draw: "Offerta pari",
					offers_a_draw: "offre pari",
					resign: "Abbandonare",
					ok: "Ok",
					cancel: "Annullare",
					create_game: "Creare un gioco",
					defier: "Sfidare",
					new_defi: "Nuova sfida",
					cancel_partie: "Questa sessione di gioco non esiste più",
					win: "Vinte",
					lose: "Perse",
					draw: "Pari",
					game: "Gioco",
					connected: "collegato",
					quick_game: "gioco",
					defi: "sfida",
					partager: "Condividi",
					friends: "Amici",
					shop: "Acquista",
					tokens: "Chips",
					free_tokens: "Chips gratuito",
					no_tokens: "Non hai abbastanza chips per giocare.",
					buy_tokens: "Acquista chips",
					congratulation: "Congratulazione",
					fanpage: "Fan Page",
					terms_service: "Termini di servizio",
					privacy_policy: "Informativa sulla privacy",
					invite_friends: {
						title: "Invita i tuoi amici (30 max)",
						infos: "E guadagnare il 10% delle chips giocate su invito accettato",
						send: "Invia inviti",
						max_requests: "Hai già inviato 30 inviti oggi.",
						all: "Tutti gli amici"
					},
					pub: {
						title: "Nano Giallo",
						text: "Gioco di carte online. Sbarazzarsi di tutte le carte e vince la scommessa."
					},
					trophy: {
						title:"Trofeo",
						win: "Si vince un trofeo",
						content: {
							1: {
								_class: "_1_game",
								title: "Principiante",
								description:"Gioca 1 gioco"
							},
							2: {
								_class: "_100_game",
								title: "Novizio",
								description:"Giocare 100 giochi"
							},
							3: {
								_class: "_500_game",
								title:"Intermedio",
								description:"Giocare 500 giochi"
							},
							4: {
								_class: "_1000_game",
								title:"Confermato",
								description:"Giocare 1000 giochi"
							},
							5: {
								_class: "_5000_game",
								title:"Esperto",
								description:"Giocare 5000 giochi"
							},
							6: {
								_class: "_1_wins",
								title: "Campione Cioccolato",
								description: "Vinci 1 gioco"
							},
							7: {
								_class: "_50_wins",
								title: "Campione Bronzo",
								description: "Vinci 50 giochi"
							},
							8: {
								_class: "_250_wins",
								title: "Campione Argento",
								description: "Vinci 250 giochi"
							},
							9: {
								_class: "_500_wins",
								title: "Campione Oro",
								description: "Vinci 500 giochi"
							},
							10: {
								_class: "_2000_wins",
								title: "Campione Platino",
								description: "Vinci 2000 giochi"
							},
							11: {
								_class: "_5_games_day",
								title: "Amatore",
								description:"Gioca 5 giochi in un giorno"
							},
							12: {
								_class: "_10_games_day",
								title: "Appassionato",
								description:"Gioca 10 giochi in un giorno"
							},
							13: {
								_class: "_25_games_day",
								title: "Fan",
								description:"Gioca 25 giochi in un giorno"
							},
							14: {
								_class: "_50_games_day",
								title: "Super Fan",
								description:"Gioca 50 giochi in un giorno"
							},
							15: {
								_class: "_100_games_day",
								title: "Fanatico",
								description:"Gioca 100 giochi in un giorno"
							},
							16: {
								_class: "_3_wins_cons",
								title: "Vincitore",
								description:"Vinci 3 giochi consecutive"
							},
							17: {
								_class: "_5_wins_cons",
								title: "Conquistatore",
								description:"Vinci 5 giochi consecutive"
							},
							18: {
								_class: "_10_wins_cons",
								title: "Killer",
								description:"Vinci 10 giochi consecutive"
							},
							19: {
								_class: "_20_wins_cons",
								title: "Invincible",
								description:"Vinci 20 giochi consecutive"
							},
							20: {
								_class: "_3_loses_cons",
								title: "Perdente",
								description:"Perdere 3 giochi consecutive"
							}
						}
					}
				},
				ja: {
					title: "チェス",
					description: "世界中から選手に対してチェスをする。ベストに挑戦し、あなたのランキングで場所を確認します。",
					online: "オンライン",
					offline: "オフラインで",
					home: "歓迎",
					play: "遊ぶ",
					ranking: "ランキング",
					invite: "招待",
					points: "点数",
					player: "プレーヤー",
					challengers: "の挑戦",
					all: "すべて",
					time: "時間",
					minutes: "分",
					color: "色",
					blanc: "白",
					noir: "ブラック",
					min: "最小",
					max: "最大",
					winner: "勝者",
					game_over: "ゲームオーバー",
					mat: "チェックメイト",
					pat: "平等",
					nul: "平等",
					start_game: "ゲームをスタート",
					search_game: "パーツを検索",
					level: "レベル",
					facile: "簡単に",
					normal: "ノーマル",
					difficile: "難しい",
					none: "ノー",
					one_player: "プレーヤー",
					two_player: "二人のプレイヤー",
					error_browser : "あなたのブラウザは、このゲームとの互換性はありません",
					error: "エラーが発生しました",
					wait_game: "一部を待っています...",
					offer_draw: "描画を提供",
					offers_a_draw: "提供されなく",
					resign: "放棄する",
					ok: "有効にする",
					cancel: "キャンセル",
					create_game: "ゲームを作る",
					defier: "挑戦",
					new_defi: "新たな挑戦",
					cancel_partie: "この部分は、もはや存在しない",
					win: "勝利",
					lose: "敗北",
					draw: "平等",
					game: "ゲーム",
					connected: "オンライン",
					quick_game: "ゲーム",
					defi: "挑戦",
					partager: "シェア",
					friends: "フレンズ",
					shop: "ショップ",
					tokens: "チップ",
					free_tokens: "フリーチップ",
					no_tokens: "あなたが再生するのに十分なチップを持っていない",
					buy_tokens: "チップを購入",
					congratulation: "祝賀",
					fanpage: "ファンページ",
					terms_service: "利用規約",
					privacy_policy: "個人情報保護方針",
					invite_friends: {
						title: "あなたの友人（最大30）を招待",
						infos: "と受け入れ招待によって演じチップの10％を獲得",
						send: "招待状を送る",
						max_requests: "あなたは既に今日30招待状を送信しました。",
						all: "すべての友達"
					},
					pub: {
						title: "黄萎病",
						text: "カードゲームは、オンライン。全てのカードから自分自身を取り除くと賭けに勝つ。"
					},
					trophy: {
						title:"トロフィー",
						win: "あなたは、トロフィーを獲得",
						content: {
							1: {
								_class: "_1_game",
								title: "初心者",
								description:"1ゲームをプレイ"
							},
							2: {
								_class: "_100_game",
								title: "新米",
								description:"100ゲームをプレイ"
							},
							3: {
								_class: "_500_game",
								title:"中間の",
								description:"500ゲームをプレイ"
							},
							4: {
								_class: "_1000_game",
								title:"高度な",
								description:"1000ゲームをプレイ"
							},
							5: {
								_class: "_5000_game",
								title:"専門家",
								description:"5000ゲームをプレイ"
							},
							6: {
								_class: "_1_wins",
								title: "チャンピオンチョコレート",
								description: "1試合に勝つ"
							},
							7: {
								_class: "_50_wins",
								title: "チャンピオン青銅",
								description: "50ゲームに勝つ"
							},
							8: {
								_class: "_250_wins",
								title: "チャンピオン銀",
								description: "250ゲームに勝つ"
							},
							9: {
								_class: "_500_wins",
								title: "チャンピオンゴールド",
								description: "500ゲームに勝つ"
							},
							10: {
								_class: "_2000_wins",
								title: "チャンピオンプラチナ",
								description: "2000試合に勝つ"
							},
							11: {
								_class: "_5_games_day",
								title: "アマチュア",
								description:"1日に5ゲームをプレイ"
							},
							12: {
								_class: "_10_games_day",
								title: "愛好者",
								description:"1日に10ゲームをプレイ"
							},
							13: {
								_class: "_25_games_day",
								title: "ファン",
								description:"1日に25ゲームをプレイ"
							},
							14: {
								_class: "_50_games_day",
								title: "スーパーファン",
								description:"1日に50ゲームをプレイ"
							},
							15: {
								_class: "_100_games_day",
								title: "常習者",
								description:"1日に100ゲームをプレイ"
							},
							16: {
								_class: "_3_wins_cons",
								title: "勝者",
								description:"3試合連続で勝利する"
							},
							17: {
								_class: "_5_wins_cons",
								title: "征服王",
								description:"5試合連続で勝利する"
							},
							18: {
								_class: "_10_wins_cons",
								title: "キラー",
								description:"10試合連続で勝利する"
							},
							19: {
								_class: "_20_wins_cons",
								title: "無敵",
								description:"20試合連続で勝利する"
							},
							20: {
								_class: "_3_loses_cons",
								title: "敗者",
								description:"3試合連続を失う"
							}
						}
					}
				},
				nl: {
					title: "schaak",
					description: "Schaak tegen spelers over de hele wereld. Verbeter uw schaken en je ranking.",
					online: "online",
					offline: "offline",
					home: "Home",
					play: "spelen",
					ranking: "Ranking",
					invite: "nodigen",
					points: "punten",
					player: "speler",
					challengers: "uitdagers",
					all: "alle",
					time: "tijd",
					minutes: "notulen",
					color: "kleur",
					blanc: "wit",
					noir: "zwart",
					min: "minimum",
					max: "maximaal",
					winner: "winnaar",
					game_over: "Game Over",
					mat: "schaakmat",
					pat: "gelijkheid",
					nul: "gelijkheid",
					start_game: "Start spel",
					search_game: "Zoek een spel",
					level: "niveau",
					facile: "gemakkelijk",
					normal: "normaal",
					difficile: "hard",
					none: "geen",
					one_player: "een speler",
					two_player: "twee spelers",
					error_browser : "Uw browser is niet compatibel met dit spel",
					error: "Er is een fout opgetreden",
					wait_game: "Wachten op een spel ...",
					offer_draw: "bieden te trekken",
					offers_a_draw: "biedt een gelijkspel",
					resign: "aftreden",
					ok: "Ok",
					cancel: "annuleren",
					create_game: "Maak een spel",
					defier: "uitdagen",
					new_defi: "nieuwe uitdaging",
					cancel_partie: "Dit spel sessie bestaat niet meer",
					win: "winnen",
					lose: "verliezen",
					draw: "trekken",
					game: "spel",
					connected: "verbonden",
					quick_game: "spel",
					defi: "uitdaging",
					partager: "delen",
					friends: "vrienden",
					shop: "Winkel",
					tokens: "Chips",
					free_tokens: "Gratis Chips",
					no_tokens: "Je hoeft niet genoeg chips om mee te spelen.",
					buy_tokens: "Koop Chips",
					congratulation: "Felicitatie",
					fanpage: "Fan Page",
					terms_service: "Gebruiksvoorwaarden",
					privacy_policy: "Privacy Policy",
					invite_friends: {
						title: "Nodig je vrienden uit (30 max)",
						infos: "En verdien 10% van de chips gespeeld op uitnodiging geaccepteerd",
						send: "Stuur uitnodigingen",
						max_requests: "Je hebt al verzonden 30 uitnodigingen vandaag.",
						all: "Alle vrienden"
					},
					pub: {
						title: "Gele Dwerg",
						text: "Kaartspel online. Bevrijd jezelf van al uw kaarten en wint de weddenschap."
					},
					trophy: {
						title:"Trofee",
						win: "Je wint een trofee",
						content: {
							1: {
								_class: "_1_game",
								title: "Beginner",
								description:"Speel 1 spel"
							},
							2: {
								_class: "_100_game",
								title: "Novice",
								description:"Speel 100 spellen"
							},
							3: {
								_class: "_500_game",
								title:"Tussen-",
								description:"Speel 500 spellen"
							},
							4: {
								_class: "_1000_game",
								title:"Gevorderd",
								description:"Speel 1000 spellen"
							},
							5: {
								_class: "_5000_game",
								title:"Expert",
								description:"Speel 5000 spellen"
							},
							6: {
								_class: "_1_wins",
								title: "Champion chocolate",
								description: "Win 1 spel"
							},
							7: {
								_class: "_50_wins",
								title: "Champion bronzen",
								description: "Win 50 spellen"
							},
							8: {
								_class: "_250_wins",
								title: "Champion zilver",
								description: "Win 250 spellen"
							},
							9: {
								_class: "_500_wins",
								title: "Champion goud",
								description: "Win 500 spellen"
							},
							10: {
								_class: "_2000_wins",
								title: "Champion platina",
								description: "Win 2000 spellen"
							},
							11: {
								_class: "_5_games_day",
								title: "Amateur",
								description:"Speel 5 spellen in een dag"
							},
							12: {
								_class: "_10_games_day",
								title: "Enthousiast",
								description:"Speel 10 spellen in een dag"
							},
							13: {
								_class: "_25_games_day",
								title: "Fan",
								description:"Speel 25 spellen in een dag"
							},
							14: {
								_class: "_50_games_day",
								title: "Super fan",
								description:"Speel 50 spellen in een dag"
							},
							15: {
								_class: "_100_games_day",
								title: "Addict",
								description:"Speel 100 spellen in een dag"
							},
							16: {
								_class: "_3_wins_cons",
								title: "Winnaar",
								description:"Win 3 opeenvolgende spellen"
							},
							17: {
								_class: "_5_wins_cons",
								title: "Veroveraar",
								description:"Win 5 opeenvolgende spellen"
							},
							18: {
								_class: "_10_wins_cons",
								title: "Moordenaar",
								description:"Win 10 opeenvolgende spellen"
							},
							19: {
								_class: "_20_wins_cons",
								title: "Onoverwinnelijk",
								description:"Win 20 opeenvolgende spellen"
							},
							20: {
								_class: "_3_loses_cons",
								title: "Verliezer",
								description:"Lose 3 opeenvolgende spellen"
							}
						}
					}
				},
				pt: {
					title: "Xadrez",
					description: "Jogue online com outros fãns de xadrez.",
					online: "Online",
					offline: "Offline",
					home: "Home",
					play: "Jogar",
					ranking: "Classificação",
					invite: "Convidar",
					points: "Pontos",
					player: "Jogador",
					challengers: "challengers",
					all: "Todos",
					time: "Tempo",
					minutes: "atas",
					color: "Cor",
					blanc: "Branco",
					noir: "Pretro",
					min: "Mínimo",
					max: "Máximo",
					winner: "Vencedor",
					game_over: "Game Over",
					mat: "Xeque-mate",
					pat: "Afogamento",
					nul: "Empatado",
					start_game: "Comece o jogo",
					search_game: "Procurar um jogo",
					level: "Nível",
					facile: "Fácil",
					normal: "Normal",
					difficile: "Difícil",
					none: "Nenhum",
					one_player: "Um jogador",
					two_player: "Dois jogadores",
					error_browser : "Seu navegador não é compatível com este jogo",
					error: "Ocorreu um erro",
					wait_game: "À espera de um jogo ...",
					offer_draw: "Fornecer empatado",
					offers_a_draw: "fornecer empatado",
					resign: "Resignar",
					ok: "Ok",
					cancel: "Cancelar",
					create_game: "Criar um jogo",
					defier: "Desafiar",
					new_defi: "Novo desafio",
					cancel_partie:"Este jogo não existe mais",
					win: "Ganhar",
					lose: "Perder",
					draw: "Empatado",
					game: "Jogo",
					connected: "conectado",
					quick_game: "jogo",
					defi: "desafio",
					partager: "Compartilhar",
					friends: "Amigos",
					shop: "Loja",
					tokens: "Fichas",
					free_tokens: "Fichas Grátis",
					no_tokens: "Você não tem fichas suficientes para jogar.",
					buy_tokens: "Comprar Fichas",
					congratulation: "Parabéns",
					fanpage: "Fan Page",
					terms_service: "Termos de Serviço",
					privacy_policy: "Política de Privacidade",
					invite_friends: {
						title: "Convide seus amigos (30 max)",
						infos: "E ganhe 10% das fichas jogadas por convite aceito",
						send: "Enviar convites",
						max_requests: "Você já enviou 30 convites hoje.",
						all: "Todos os amigos"
					},
					pub: {
						title: "Anão amarelo",
						text: "Jogo de cartas online. Livre-se de todas as suas cartas e ganha a aposta."
					},
					trophy: {
						title:"Troféu",
						win: "Você ganha um troféu",
						content: {
							1: {
								_class: "_1_game",
								title: "Novato",
								description:"Jogar 1 jogo"
							},
							2: {
								_class: "_100_game",
								title: "Aprendiz",
								description:"Jogar 100 jogos"
							},
							3: {
								_class: "_500_game",
								title:"Intermediário",
								description:"Jogar 500 jogos"
							},
							4: {
								_class: "_1000_game",
								title:"Confirmado",
								description:"Jogar 1000 jogos"
							},
							5: {
								_class: "_5000_game",
								title:"Especialista",
								description:"Jogar 5000 jogos"
							},
							6: {
								_class: "_1_wins",
								title: "Campeão Chocolate",
								description: "Ganhe 1 jogo"
							},
							7: {
								_class: "_50_wins",
								title: "Campeão Bronze",
								description: "Ganhe 50 jogos"
							},
							8: {
								_class: "_250_wins",
								title: "Campeão Prata",
								description: "Ganhe 250 jogos"
							},
							9: {
								_class: "_500_wins",
								title: "Campeão Ouro",
								description: "Ganhe 500 jogos"
							},
							10: {
								_class: "_2000_wins",
								title: "Campeão Platina",
								description: "Ganhe 2000 jogos"
							},
							11: {
								_class: "_5_games_day",
								title: "Amador",
								description:"Jogue 5 jogos em um dia"
							},
							12: {
								_class: "_10_games_day",
								title: "Entusiasta",
								description:"Jogue 10 jogos em um dia"
							},
							13: {
								_class: "_25_games_day",
								title: "Aficionado",
								description:"Jogue 25 jogos em um dia"
							},
							14: {
								_class: "_50_games_day",
								title: "Fanático",
								description:"Jogue 50 jogos em um dia"
							},
							15: {
								_class: "_100_games_day",
								title: "Viciado",
								description:"Jogue 100 jogos em um dia"
							},
							16: {
								_class: "_3_wins_cons",
								title: "Vencedor",
								description:"Ganhar 3 jogos consecutivos"
							},
							17: {
								_class: "_5_wins_cons",
								title: "Conquistador",
								description:"Ganhar 5 jogos consecutivos"
							},
							18: {
								_class: "_10_wins_cons",
								title: "Assassino",
								description:"Ganhar 10 jogos consecutivos"
							},
							19: {
								_class: "_20_wins_cons",
								title: "Invencível",
								description:"Ganhar 20 jogos consecutivos"
							},
							20: {
								_class: "_3_loses_cons",
								title: "Perdedor",
								description:"Perder 3 jogos consecutivos"
							}
						}
					}
				},
				tr: {
					title: "Satranç",
					description: "Dünyanın her yerinden insanlarla satranç oyna.",
					online: "Çevrimiçi",
					offline: "Çevrimdışı",
					home: "Anasayfa",
					play: "Oynamak",
					ranking: "Sıralaması",
					invite: "Davet",
					points: "Puan",
					player: "Oyuncu",
					challengers: "meydan",
					all: "Tüm",
					time: "Zaman",
					minutes: "Dakika",
					color: "Renk",
					blanc: "Beyaz",
					noir: "Siyah",
					min: "en az",
					max: "Maksimum",
					winner: "Kazanan",
					game_over: "Game Over",
					mat: "Şah mat",
					pat: "Çıkmazı",
					nul: "Berabere",
					start_game: "Oyunu başlat",
					search_game: "Bir oyun için ara",
					level: "Seviye",
					facile: "Kolay",
					normal: "Normal",
					difficile: "Sert",
					none: "Hiçbiri",
					one_player: "Bir oyuncu",
					two_player: "İki oyuncu",
					error_browser : "Tarayıcınız bu oyun ile uyumlu değildir",
					error: "Bir hata oluştu",
					wait_game: "Bir oyun bekliyorum ...",
					offer_draw: "Beraberlik Gönder",
					offers_a_draw: "bir beraberlik sunuyor",
					resign: "Istifa etmek",
					ok: "Tamam",
					cancel: "Iptal",
					create_game: "Bir oyun oluşturma",
					defier: "Meydan okumak",
					new_defi: "Yeni meydan",
					cancel_partie: "Bu oyun oturumu artık yok",
					win: "Galibiyet",
					lose: "Mağlubiyet ",
					draw: "Berabere",
					game: "Oyun",
					connected: "bağlı",
					quick_game: "oyun",
					defi: "meydan okumak",
					partager: "Paylaş",
					friends: "Arkadaşlar",
					shop: "Dükkan",
					tokens: "Tokens",
					free_tokens: "Ücretsiz Tokens",
					no_tokens: "Sen oynamak için yeterli tokens yok.",
					buy_tokens: "Tokens al",
					congratulation: "Kutlama",
					fanpage: "Fan Page",
					terms_service: "Hizmet Şartları",
					privacy_policy: "Gizlilik Politikası",
					invite_friends: {
						title: "Arkadaşlarınızı davet edin (30 max)",
						infos: "Ve davetiye ile Tokens fiş% 10 kazanın kabul",
						send: "istek gönder",
						max_requests: "Zaten bugün 30 davetiye gönderdik.",
						all: "Tüm arkadaşlar"
					},
					pub: {
						title: "Sarı Cüce",
						text: "Kart oyunu online. Tüm kartları kurtulun ve bahis kazanır."
					},
					trophy: {
						title:"Ganimet",
						win: "Bir kupa kazanmak",
						content: {
							1: {
								_class: "_1_game",
								title: "Acemi",
								description:"1 oyunu oyna"
							},
							2: {
								_class: "_100_game",
								title: "Yeni",
								description:"100 oyna"
							},
							3: {
								_class: "_500_game",
								title:"Ara",
								description:"500 oyna"
							},
							4: {
								_class: "_1000_game",
								title:"Gelişmiş",
								description:"1000 oyna"
							},
							5: {
								_class: "_5000_game",
								title:"Uzman",
								description:"5000 oyna"
							},
							6: {
								_class: "_1_wins",
								title: "Şampiyon Çikolata",
								description: "1 oyunu kazanın"
							},
							7: {
								_class: "_50_wins",
								title: "Şampiyon bronz",
								description: "50 oyun kazan"
							},
							8: {
								_class: "_250_wins",
								title: "Şampiyon gümüş",
								description: "250 oyun kazan"
							},
							9: {
								_class: "_500_wins",
								title: "Şampiyon altın",
								description: "500 oyun kazan"
							},
							10: {
								_class: "_2000_wins",
								title: "Şampiyon platin",
								description: "2000 oyun kazan"
							},
							11: {
								_class: "_5_games_day",
								title: "Amatör",
								description:"Bir günde 5 oyna"
							},
							12: {
								_class: "_10_games_day",
								title: "Tutkunları",
								description:"Bir günde 10 oyna"
							},
							13: {
								_class: "_25_games_day",
								title: "Fan",
								description:"Bir günde 25 oyna"
							},
							14: {
								_class: "_50_games_day",
								title: "Hayran",
								description:"Bir günde 50 oyna"
							},
							15: {
								_class: "_100_games_day",
								title: "Bağımlı",
								description:"Bir günde 100 oyna"
							},
							16: {
								_class: "_3_wins_cons",
								title: "Kazanan",
								description:"3 ardışık oyunlar Win"
							},
							17: {
								_class: "_5_wins_cons",
								title: "Fatih",
								description:"5 ardışık oyunlar Win"
							},
							18: {
								_class: "_10_wins_cons",
								title: "Katil",
								description:"10 ardışık oyunlar Win"
							},
							19: {
								_class: "_20_wins_cons",
								title: "Yenilmez",
								description:"20 ardışık oyunlar Win"
							},
							20: {
								_class: "_3_loses_cons",
								title: "Mağlup",
								description:"3 ardışık oyunlar Lose"
							}
						}
					}
					
				},
				ru: {
					title: "Шахматы",
					description: "Играть в шахматы против игроков со всего мира.",
					online: "Онлайн",
					offline: "Оффлайне",
					home: "Главную",
					play: "Играть",
					ranking: "ранжирование",
					invite: "Пригласить",
					points: "Очки",
					player: "Игрок",
					challengers: "претендентов",
					all: "все",
					time: "время",
					minutes: "протокол",
					color: "Цвет",
					blanc: "белый",
					noir: "Черный",
					min: "мини",
					max: "макси",
					winner: "Победитель",
					game_over: "Игра окончена",
					mat: "Шах и мат",
					pat: "Пат",
					nul: "Ничьи",
					start_game: "Начало игры",
					search_game: "Поиск игры",
					level: "Уровень",
					facile: "Легко",
					normal: "Нормальный",
					difficile: "Жесткий",
					none: "Никто",
					one_player: "Один игрок",
					two_player: "Два игрока",
					error_browser : "Ваш браузер не совместим с данной игрой",
					error: "Произошла ошибка",
					wait_game: "В ожидании игры ...",
					offer_draw: "Предложение ничьи",
					offers_a_draw: "предлагает ничьи",
					resign: "Сдаваться",
					ok: "Хорошо",
					cancel: "Отменить",
					create_game: "Создайте игру",
					defier: "бросать вызов",
					new_defi: "Новый вызов",
					cancel_partie: "Эта игра сессии больше не существует",
					win: "Выигрыши",
					lose: "Поражения",
					draw: "Ничьи",
					game: "Игра",
					connected: "подключенный",
					quick_game: "игра",
					defi: "вызов",
					partager: "Поделиться",
					friends: "Друзья",
					shop: "магазин",
					tokens: "фишки",
					free_tokens: "фишки бесплатно",
					no_tokens: "Вам не хватает фишек на игру",
					buy_tokens: "Покупать фишки",
					congratulation: "поздравление",
					fanpage: "Fan Page",
					terms_service: "Условия предоставления услуг",
					privacy_policy: "Политика конфиденциальности",
					invite_friends: {
						title: "Пригласите своих друзей (30 макс)",
						infos: "И заработать 10% фишек играл по приглашению принято",
						send: "Отправить запросами",
						max_requests: "Вы уже отправили 30 пригласительных сегодня.",
						all: "Все друзья"
					},
					pub: {
						title: "Желтый карлик",
						text: "Карточная игра онлайн. Избавьте себя от всех своих карт и выигрывает ставку."
					},
					trophy: {
						title:"Трофей",
						win: "Вы выиграли трофей",
						content: {
							1: {
								_class: "_1_game",
								title: "начинающий",
								description:"Играть 1 игра"
							},
							2: {
								_class: "_100_game",
								title: "новичок",
								description:"Играть 100 игр"
							},
							3: {
								_class: "_500_game",
								title:"промежуточный",
								description:"Играть 500 игр"
							},
							4: {
								_class: "_1000_game",
								title:"передовой",
								description:"Играть 1000 игр"
							},
							5: {
								_class: "_5000_game",
								title:"эксперт",
								description:"Играть 5000 игр"
							},
							6: {
								_class: "_1_wins",
								title: "Чемпион шоколад",
								description: "Выиграй 1 игра"
							},
							7: {
								_class: "_50_wins",
								title: "Чемпион бронза",
								description: "Выиграйте 50 игр"
							},
							8: {
								_class: "_250_wins",
								title: "Чемпион серебра",
								description: "Выиграйте 250 игр"
							},
							9: {
								_class: "_500_wins",
								title: "Чемпион золото",
								description: "Выиграйте 500 игр"
							},
							10: {
								_class: "_2000_wins",
								title: "Чемпион платины",
								description: "Выиграйте 2000 игр"
							},
							11: {
								_class: "_5_games_day",
								title: "любительский",
								description:"Играть 5 игр в один день"
							},
							12: {
								_class: "_10_games_day",
								title: "энтузиаст",
								description:"Играть 10 игр в один день"
							},
							13: {
								_class: "_25_games_day",
								title: "вентилятор",
								description:"Играть 25 игр в один день"
							},
							14: {
								_class: "_50_games_day",
								title: "фанатик",
								description:"Играть 50 игр в один день"
							},
							15: {
								_class: "_100_games_day",
								title: "наркоман",
								description:"Играть 100 игр в один день"
							},
							16: {
								_class: "_3_wins_cons",
								title: "победитель",
								description:"Выиграйте 3 матчей подряд"
							},
							17: {
								_class: "_5_wins_cons",
								title: "завоеватель",
								description:"Выиграйте 5 матчей подряд"
							},
							18: {
								_class: "_10_wins_cons",
								title: "убийца",
								description:"Выиграйте 10 матчей подряд"
							},
							19: {
								_class: "_20_wins_cons",
								title: "непобедимый",
								description:"Выиграйте 20 матчей подряд"
							},
							20: {
								_class: "_3_loses_cons",
								title: "неудачник",
								description:"Потерять 3 последовательных игр"
							}
						}
					}
				},
				zh: {
					title: "国际象棋",
					description: "玩國際象棋世界各地的玩家。",
					online: "在線",
					offline: "當前離線",
					home: "首页",
					play: "玩",
					ranking: "排行",
					invite: "邀請",
					points: "積分",
					player: "播放機",
					challengers: "挑戰者",
					all: "所有",
					time: "時間",
					minutes: "分鐘",
					color: "顏色",
					blanc: "白",
					noir: "黑色",
					min: "最低限度",
					max: "最大",
					winner: "勝利者",
					game_over: "遊戲結束",
					mat: "將死",
					pat: "畫",
					nul: "畫",
					start_game: "開始遊戲",
					search_game: "搜索遊戲",
					level: "水平",
					facile: "容易",
					normal: "正常",
					difficile: "硬",
					none: "無",
					one_player: "一個球員",
					two_player: "兩名球員",
					error_browser : "您的瀏覽器不兼容這個遊戲",
					error: "發生了一個錯誤",
					wait_game: "等待的遊戲...",
					offer_draw: "提供畫",
					offers_a_draw: "提供畫",
					resign: "放棄",
					ok: "行",
					cancel: "取消",
					create_game: "創建一個遊戲",
					defier: "挑戰",
					new_defi: "面臨的新挑戰",
					cancel_partie: "遊戲中的會話不再存在",
					win: "贏",
					lose: "失去",
					draw: "畫",
					game: "遊戲",
					connected: "連接的",
					quick_game: "遊戲",
					defi: "挑戰",
					partager: "分享",
					friends: "朋友",
					shop: "鋪",
					tokens: "芯片",
					free_tokens: "免費籌碼",
					no_tokens: "您沒有足夠的籌碼玩。",
					buy_tokens: "购买芯片",
					congratulation: "祝賀",
					fanpage: "粉絲專頁",
					terms_service: "服務條款",
					privacy_policy: "隱私權政策",
					invite_friends: {
						title: "邀請您的朋友（30最高）",
						infos: "賺取10％的芯片扮演的邀請接受",
						send: "發送請求",
						max_requests: "您今天已經派出30名邀請。",
						all: "所有的朋友"
					},
					pub: {
						title: "黃矮病",
						text: "卡在線遊戲。擺脫所有的卡和贏得的賭注。"
					},
					trophy: {
						title:"杯",
						win: "你贏得獎杯",
						content: {
							1: {
								_class: "_1_game",
								title: "初學者",
								description:"播放1個遊戲"
							},
							2: {
								_class: "_100_game",
								title: "初學者",
								description:"播放100個遊戲"
							},
							3: {
								_class: "_500_game",
								title:"中間",
								description:"播放500個遊戲"
							},
							4: {
								_class: "_1000_game",
								title:"先進",
								description:"播放1000個遊戲"
							},
							5: {
								_class: "_5000_game",
								title:"專家",
								description:"播放5000個遊戲"
							},
							6: {
								_class: "_1_wins",
								title: "冠軍巧克力",
								description: "獨贏1場比賽"
							},
							7: {
								_class: "_50_wins",
								title: "冠軍青銅",
								description: "獨贏50場比賽"
							},
							8: {
								_class: "_250_wins",
								title: "冠軍銀",
								description: "獨贏250場比賽"
							},
							9: {
								_class: "_500_wins",
								title: "冠軍金",
								description: "獨贏500場比賽"
							},
							10: {
								_class: "_2000_wins",
								title: "冠軍鉑",
								description: "獨贏2000場比賽"
							},
							11: {
								_class: "_5_games_day",
								title: "業餘",
								description:"在一天之內打5場比賽"
							},
							12: {
								_class: "_10_games_day",
								title: "愛好者",
								description:"在一天之內打10場比賽"
							},
							13: {
								_class: "_25_games_day",
								title: "風扇",
								description:"在一天之內打25場比賽"
							},
							14: {
								_class: "_50_games_day",
								title: "超級球迷，",
								description:"在一天之內打50場比賽"
							},
							15: {
								_class: "_100_games_day",
								title: "有藥癮者",
								description:"在一天之內打100場比賽"
							},
							16: {
								_class: "_3_wins_cons",
								title: "勝利者",
								description:"連續贏3場比賽"
							},
							17: {
								_class: "_5_wins_cons",
								title: "征服者",
								description:"連續贏5場比賽"
							},
							18: {
								_class: "_10_wins_cons",
								title: "兇手",
								description:"連續贏10場比賽"
							},
							19: {
								_class: "_20_wins_cons",
								title: "不可戰勝的",
								description:"連續贏20場比賽"
							},
							20: {
								_class: "_3_loses_cons",
								title: "失敗者",
								description:"失去連續3場比賽"
							}
						}
					}
				},
				en: {
					title: "Chess",
					description: "Play Chess against players all over the world. Improve your chess and your ranking.",
					online: "Online",
					offline: "Offline",
					home: "Home",
					play: "Play",
					ranking: "Ranking",
					invite: "Invite",
					points: "Points",
					player: "Player",
					challengers: "challengers",
					all: "All",
					time: "Time",
					minutes: "minutes",
					color: "Color",
					blanc: "White",
					noir: "Black",
					min: "Minimum",
					max: "Maximum",
					winner: "Winner",
					game_over: "Game Over",
					mat: "Checkmate",
					pat: "Stalemate",
					nul: "Draw",
					start_game: "Start game",
					search_game: "Search for a game",
					level: "Level",
					facile: "Easy",
					normal: "Normal",
					difficile: "Hard",
					none: "None",
					one_player: "One player",
					two_player: "Two players",
					error_browser : "Your browser is not compatible with this game",
					error: "An error has occurred",
					wait_game: "Waiting for a game ...",
					offer_draw: "Offer draw",
					offers_a_draw: "offers a draw",
					resign: "Resign",
					ok: "Ok",
					cancel: "Cancel",
					create_game: "Create a game",
					defier: "Challenge",
					new_defi: "New challenge",
					cancel_partie: "This game session no longer exists",
					win: "Win",
					lose: "Lose",
					draw: "Draw",
					game: "Game",
					connected: "connected",
					quick_game: "game",
					defi: "challenge",
					partager: "Share",
					friends: "Friends",
					shop: "Shop",
					tokens: "Chips",
					free_tokens: "Free Chips",
					no_tokens: "You do not have enough chips to play.",
					buy_tokens: "Buy chips",
					congratulation: "Congratulation",
					fanpage: "Fan Page",
					terms_service: "Terms of Service",
					privacy_policy: "Privacy Policy",
					invite_friends: {
						title: "Invite your friends (30 max)",
						infos: "And earn 10% of the chips played by invitation accepted",
						send: "Send requests",
						max_requests: "You have already sent 30 invitations today.",
						all: "All friends"
					},
					pub: {
						title: "Pope Joan",
						text: "Card game online. Rid yourself of all your cards and wins the bet."
					},
					trophy: {
						title:"Trophy",
						win: "You win a trophy",
						content: {
							1: {
								_class: "_1_game",
								title: "Beginner",
								description:"Play 1 game"
							},
							2: {
								_class: "_100_game",
								title: "Novice",
								description:"Play 100 games"
							},
							3: {
								_class: "_500_game",
								title:"Intermediate",
								description:"Play 500 games"
							},
							4: {
								_class: "_1000_game",
								title:"Advanced",
								description:"Play 1000 games"
							},
							5: {
								_class: "_5000_game",
								title:"Expert",
								description:"Play 5000 games"
							},
							6: {
								_class: "_1_wins",
								title: "Champion Chocolate",
								description: "Win 1 game"
							},
							7: {
								_class: "_50_wins",
								title: "Champion bronze",
								description: "Win 50 games"
							},
							8: {
								_class: "_250_wins",
								title: "Champion silver",
								description: "Win 250 games"
							},
							9: {
								_class: "_500_wins",
								title: "Champion gold",
								description: "Win 500 games"
							},
							10: {
								_class: "_2000_wins",
								title: "Champion platinum",
								description: "Win 2000 games"
							},
							11: {
								_class: "_5_games_day",
								title: "Amateur",
								description:"Play 5 games in one day"
							},
							12: {
								_class: "_10_games_day",
								title: "Enthusiast",
								description:"Play 10 games in one day"
							},
							13: {
								_class: "_25_games_day",
								title: "Fan",
								description:"Play 25 games in one day"
							},
							14: {
								_class: "_50_games_day",
								title: "Super Fan",
								description:"Play 50 games in one day"
							},
							15: {
								_class: "_100_games_day",
								title: "Addict",
								description:"Play 100 games in one day"
							},
							16: {
								_class: "_3_wins_cons",
								title: "Winner",
								description:"Win 3 consecutive games"
							},
							17: {
								_class: "_5_wins_cons",
								title: "Conqueror",
								description:"Win 5 consecutive games"
							},
							18: {
								_class: "_10_wins_cons",
								title: "Killer",
								description:"Win 10 consecutive games"
							},
							19: {
								_class: "_20_wins_cons",
								title: "Invincible",
								description:"Win 20 consecutive games"
							},
							20: {
								_class: "_3_loses_cons",
								title: "Loser",
								description:"Lose 3 consecutive games"
							}
						}
					}
				}
			}
		}
	});
})(jQuery);