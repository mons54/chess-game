module.exports = function (app, io, mongoose, fbgraph, crypto) {

    var connections = {},
        created_game = {
            nb: 0,
            games: {}
        },
        started_games = {
            id: 1,
            games: []
        },
        messages = {
            id: 0,
            data: {}
        };

    var users = mongoose.models.users,
        games = mongoose.models.games,
        badges = mongoose.models.badges,
        free_tokens = mongoose.models.freeTokens,
        payments = mongoose.models.payments;

    io.sockets.on('connection', function (socket) {

        socket.on('create', function (data) {

            if (!data.uid || !data.accessToken) {
                socket.disconnect();
                return;
            }

            fbgraph.post('/' + data.uid + '?access_token=' + data.accessToken, function (err, res) {

                if (err || !res.success) {
                    socket.disconnect();
                    return;
                }

                var socketConnected = getSocket(connections[data.uid]);

                if (socketConnected) {
                    socketConnected.disconnect();
                }

                socket.uid = data.uid;
                socket.name = data.name;
                connections[data.uid] = socket.id;

                users.count({
                    uid: data.uid
                }, function (err, nb) {

                    if (err) {
                        return;
                    }

                    if (nb == 0) {

                        var user = new users({
                            uid: data.uid,
                            points: 1500,
                            tokens: 25,
                            trophy: 1,
                            parrainage: data.parrainage,
                        });

                        user.save(function (err) {

                            if (err) {
                                return;
                            }

                            initUser();
                        });
                    } else {
                        initUser(data.parrainage);
                    }
                });
            });
        });

        socket.on('InitUser', function () {
            initUser();
        });

        socket.on('CancelGame', function () {
            if (checkSocketUid()) {
                deleteGame(socket.uid);
            }
        });

        socket.on('CreateGame', function (data) {

            if (checkSocketUid()) {

                if (created_game.games[socket.uid]) {
                    delete created_game.games[socket.uid];
                    created_game.nb--;
                }

                created_game.games[socket.uid] = {
                    name: socket.name,
                    points: socket.points,
                    classement: socket.classement,
                    color: data.color,
                    time: data.time,
                    points_min: data.points_min,
                    points_max: data.points_max,
                };

                created_game.nb++;

                listGames();
            }
        });

        socket.on('Defis', function (data) {

            var socketOpponent = getSocket(connections[data.uid]);

            if (checkSocketUid() && socketOpponent) {

                if (!socketOpponent.defis) {
                    socketOpponent.defis = {
                        nb: 0,
                        defis: {}
                    };
                }

                if (!socketOpponent.defis.defis[socket.uid]) {
                    socketOpponent.defis.nb++;
                }

                socketOpponent.defis.defis[socket.uid] = {
                    type: 'reponse',
                    name: socket.name,
                    points: socket.points,
                    classement: socket.classement,
                    color: data.color,
                    time: data.time
                };

                if (!socket.defis) {
                    socket.defis = {
                        nb: 0,
                        defis: {}
                    };
                }

                if (!socket.defis.defis[data.uid]) {
                    socket.defis.nb++;
                }

                socket.defis.defis[data.uid] = {
                    type: 'demande',
                    name: socketOpponent.name,
                    points: socketOpponent.points,
                    classement: socketOpponent.classement,
                    color: data.color,
                    time: data.time
                };

                socketOpponent.emit('Defis', socketOpponent.defis);
                socket.emit('Defis', socket.defis);
            }
        });

        socket.on('AnnulerDefi', function (uid) {

            var socketOpponent = getSocket(connections[uid]);

            if (checkSocketUid() && socketOpponent && socketOpponent.defis && socketOpponent.defis.defis && socketOpponent.defis.defis[socket.uid]) {
                delete socketOpponent.defis.defis[socket.uid];
                socketOpponent.defis.nb--;
                socketOpponent.emit('Defis', socketOpponent.defis);
            }

            if (socket.defis && socket.defis.defis && socket.defis.defis[uid]) {
                delete socket.defis.defis[uid];
                socket.defis.nb--;
                socket.emit('Defis', socket.defis);
            }
        });

        socket.on('NewGame', function (uid) {

            if (!socket.jeu && checkSocketUid() && socket.uid != uid) {

                var socketOpponent = getSocket(connections[uid]);
                if (created_game.games[uid] && socketOpponent && !socketOpponent.jeu) {
                    startGame(uid, created_game.games[uid]);
                } else {
                    deleteGame(uid);
                }
            }
        });

        socket.on('NewGameDefi', function (uid) {

            if (!socket.jeu && checkSocketUid() && socket.uid != uid) {

                var socketOpponent = getSocket(connections[uid]);

                if (socketOpponent) {

                    if (!socketOpponent.jeu) {

                        if (socketOpponent.defis && socketOpponent.defis.defis && socketOpponent.defis.defis[socket.uid]) {

                            startGame(uid, socketOpponent.defis.defis[socket.uid]);
                        }

                    } else {
                        annulerAllDefi(connections[uid]);
                    }

                } else if (socket.defis && socket.defis.defis && socket.defis.defis[uid]) {
                    delete socket.defis.defis[uid];
                    socket.defis.nb--;
                    socket.emit('Defis', socket.defis);
                }
            }
        });


        socket.on('loadGame', function (data) {

            if (!checkSocketUid() || !started_games.games[data.id]) {
                return;
            }

            var uid = false;

            if (started_games.games[data.id].blanc == socket.uid) {
                uid = started_games.games[data.id].noir;
            } else if (started_games.games[data.id].noir == socket.uid) {
                uid = started_games.games[data.id].blanc;
            }

            if (!uid || !getSocket(connections[uid])) {
                return;
            }

            data.uid = socket.uid;

            data.jeu = {
                blanc: data.blanc,
                noir: data.noir
            };

            getSocket(connections[uid]).emit('loadGame', data);
        });

        socket.on('ProposerNul', function (data) {

            if (checkSocketUid() && started_games.games[data.id]) {

                var uid = 0;

                if (started_games.games[data.id].blanc == socket.uid) {
                    uid = started_games.games[data.id].noir;
                } else if (started_games.games[data.id].noir == socket.uid) {
                    uid = started_games.games[data.id].blanc;
                }

                var socketOpponent = getSocket(connections[uid]);
                if (uid && socketOpponent) {
                    socketOpponent.emit('ProposerNul', {
                        uid: socket.uid,
                        name: socket.name
                    });
                }
            }
        });

        socket.on('JeuTerminer', function (data) {

            if (checkSocketUid()) {

                var nom = data.nom ? data.nom : "";
                var vainqueur = data.vainqueur ? data.vainqueur : 0;

                if (started_games.games[data.id] && data.blanc > 0 && data.noir > 0) {

                    var uid = 0;

                    if (started_games.games[data.id].blanc == socket.uid) {
                        uid = started_games.games[data.id].noir;
                    } else if (started_games.games[data.id].noir == socket.uid) {
                        uid = started_games.games[data.id].blanc;
                    }

                    if (uid) {

                        delete started_games.games[data.id];
                        socket.jeu = false;

                        resultGame(vainqueur, nom, data.blanc, data.noir);

                        var socketOpponent = getSocket(connections[uid]);
                        if (socketOpponent) {
                            socketOpponent.jeu = false;
                            socketOpponent.emit('JeuTerminer', {
                                uid: socket.uid,
                                vainqueur: vainqueur,
                                nom: nom
                            });
                        }
                    }
                }
            }
        });

        socket.on('Profil', function (uid, name) {

            if (checkSocketUid() && uid > 0) {

                users.findOne({
                    uid: uid
                }, 'points', function (err, data) {

                    if (err || !data || !data.points) {
                        return;
                    }

                    var points = data.points,
                        data = {};

                    users.count({
                        actif: 1,
                        points: {
                            $gt: points
                        }
                    }, function (err, nb) {

                        if (err) {
                            return;
                        }

                        var classement = nb + 1;

                        games.count({
                            $or: [{
                                blanc: uid
                            }, {
                                noir: uid
                            }]
                        }, function (err, nb) {

                            if (err) {
                                return;
                            }

                            data.games = nb;

                            games.count({
                                $or: [{
                                    blanc: uid,
                                    resultat: 1
                                }, {
                                    noir: uid,
                                    resultat: 2
                                }]
                            }, function (err, nb) {

                                if (err) {
                                    return;
                                }

                                data.win = nb;

                                games.count({
                                    $or: [{
                                        blanc: uid,
                                        resultat: 0
                                    }, {
                                        noir: uid,
                                        resultat: 0
                                    }]
                                }, function (err, nb) {

                                    if (err) {
                                        return;
                                    }

                                    data.draw = nb;
                                    socket.emit('Profil', {
                                        data: data,
                                        classement: classement,
                                        points: points,
                                        uid: uid,
                                        name: name
                                    });
                                });
                            });
                        });
                    });
                });
            }
        });

        socket.on('EnvoyerMessage', function (message) {

            if (autoriseTchat()) {

                var message = message.substr(0, 500);
                var time = new Date().getTime();

                messages.id++;

                messages.data[messages.id] = {
                    uid: socket.uid,
                    name: socket.name,
                    message: message,
                    time: time
                };

                if (messages.data[messages.id - 50]) {
                    delete messages.data[messages.id - 50];
                }

                listerMessages();
            }
        });

        socket.on('SupprimerMessage', function (id) {

            if (!messages.data[id] || !messages.data[id].uid) {
                return;
            }

            if ((checkSocketUid() && messages.data[id].uid == socket.uid) || socket.moderateur) {
                delete messages.data[id];
            }
        });

        socket.on('EnvoyerMessageJeu', function (data) {

            if (checkSocketUid() && socket.name && started_games.games[data.id]) {

                var uid = 0;

                if (started_games.games[data.id].blanc == socket.uid) {
                    uid = started_games.games[data.id].noir;
                } else if (started_games.games[data.id].noir == socket.uid) {
                    uid = started_games.games[data.id].blanc;
                }

                var socketOpponent = getSocket(connections[uid]);

                if (uid && socketOpponent) {
                    socketOpponent.emit('NouveauMessageJeu', {
                        uid: socket.uid,
                        name: socket.name,
                        message: data.message.substr(0, 500)
                    });
                }
            }
        });

        socket.on('Classement', function (data) {

            if (checkSocketUid()) {

                var uid = socket.uid ? socket.uid : 0,
                    limit = 8,
                    page = parseInt(data.page),
                    friends = data.friends;

                if (page) {

                    if (page <= 0) {
                        page = 1;
                    }

                    _classement(friends, page, limit, false);
                } else {

                    var points = socket.points,
                        req = friends ? {
                            actif: 1,
                            uid: {
                                $in: friends
                            },
                            points: {
                                $gt: points
                            }
                        } : {
                            actif: 1,
                            points: {
                                $gt: points
                            }
                        };

                    users.count(req, function (err, nb) {

                        if (err) {
                            return;
                        }

                        nb++;

                        var page = Math.ceil(nb / limit);

                        if (page <= 0) {
                            page = 1;
                        }

                        _classement(friends, page, limit, true);
                    });
                }
            }
        });

        socket.on('share_trophy', function () {

            if (checkSocketUid()) {

                var uid = socket.uid ? socket.uid : 0;

                users.findOne({
                    uid: uid
                }, 'tokens', function (err, data) {

                    if (err || !data || !data.tokens) {
                        return;
                    }

                    var token = data.tokens + 5;

                    users.update({
                        uid: uid
                    }, {
                        $set: {
                            tokens: token
                        }
                    }, fn);
                });
            }
        });

        socket.on('Quit', function () {

            if (checkSocketUid()) {

                socket.leave('home');
                listChallengers();

                deleteGame(socket.uid);

                annulerAllDefi(socket);
            }
        });

        socket.on('payment', function (data) {

            if (!checkSocketUid() || !data || !data.id || !data.token || !data.signed_request) {
                return;
            }

            var id = data.id,
                token = data.token,
                request = parseSignedRequest(data.signed_request, app.facebook.secret);

            if (!request) {
                return;
            }

            users.findOne({
                uid: socket.uid
            }, 'tokens', function (err, data) {

                if (err || !data) {
                    return;
                }

                token = parseInt(data.tokens) + parseInt(token);

                users.update({
                    uid: socket.uid
                }, {
                    $set: {
                        tokens: token
                    }
                }, function (err) {

                    if (err) {
                        return;
                    }

                    initUser();

                    new payments({
                        id: request.payment_id,
                        uid: socket.uid,
                        item: id,
                        type: 'charge',
                        status: 'completed',
                        time: request.issued_at,
                    }).save();
                });
            });
        });

        socket.on('adVideoCompleted', function () {

            if (!checkSocketUid()) {
                return;
            }

            users.findOne({
                uid: socket.uid
            }, 'tokens', function (err, data) {

                if (err || !data) {
                    return;
                }

                users.update({
                    uid: socket.uid
                }, {
                    $set: {
                        tokens: parseInt(data.tokens) + 2
                    }
                }, function (err) {

                    if (err) {
                        return;
                    }

                    initUser();
                });
            });
        });

        socket.on('banUser', function (data) {
            if (!data.uid || !socket.moderateur) {
                return;
            }

            users.update({
                uid: data.uid
            }, {
                $set: {
                    ban: data.ban ? true : false
                }
            }, fn);
        });

        socket.on('disconnect', function () {

            if (socket.uid && connections[socket.uid]) {
                delete connections[socket.uid];
            }

            if (socket.uid && created_game.games[socket.uid]) {
                delete created_game.games[socket.uid];
                created_game.nb--;
                listGames();
            }

            if (socket.jeu && started_games.games[socket.jeu]) {
                disconnectJeu();
            }

            annulerAllDefi(socket);
        });

        function disconnectJeu() {

            var game = started_games.games[socket.jeu],
                uid = 0;

            if (game.blanc == socket.uid) {
                uid = game.noir;
                var vainqueur = 2;
            } else if (game.noir == socket.uid) {
                uid = game.blanc;
                var vainqueur = 1;
            }

            if (uid) {

                var blanc = game.blanc;
                var noir = game.noir;
                var nom = 'resign';

                delete started_games.games[socket.jeu];
                resultGame(vainqueur, nom, blanc, noir);

                var socketOpponent = getSocket(connections[uid]);

                if (socketOpponent) {
                    socketOpponent.jeu = false;
                    socketOpponent.emit('JeuTerminer', {
                        uid: socket.uid,
                        vainqueur: vainqueur,
                        nom: nom
                    });
                }
            }
        }

        function getSocket(id) {
            var socket = null;
            io.sockets.sockets.forEach(function (value) {
                if (id == value.id) {
                    socket = value;
                }
            });
            return socket;
        }

        function checkSocketUid() {

            if (!socket.uid) {
                socket.disconnect();
                return false;
            }

            return true;
        }

        function autoriseTchat() {

            if (checkSocketUid()) {

                switch (socket.uid) {
                case '100004539253808':
                case '100002237255521':
                    return false;
                }

                return true;
            }
        }

        function initUser(parrainage) {

            if (checkSocketUid()) {

                var uid = socket.uid ? socket.uid : 0;

                users.findOne({
                    uid: uid
                }, function (err, data) {

                    if (err || !data) {
                        return;
                    }

                    if (data.ban) {
                        socket.disconnect();
                        return;
                    }

                    socket.moderateur = data.moderateur ? true : false;

                    if (!data.parrainage && parrainage) {
                        users.update({
                            uid: uid
                        }, {
                            $set: {
                                parrainage: parrainage
                            }
                        }, fn);
                    }

                    var points = data.points;
                    socket.points = points;

                    free_tokens.findOne({
                        uid: uid
                    }, 'time', function (err, _data) {

                        if (err) {
                            return;
                        }

                        var token = 0;

                        if (!data.tokens && data.tokens != 0) {
                            token += 25;
                            users.update({
                                uid: uid
                            }, {
                                $set: {
                                    tokens: token
                                }
                            }, fn);
                        } else {
                            token += data.tokens;
                        }

                        var time = Math.round(new Date().getTime() / 1000);

                        if (!_data || !_data.time) {

                            token += 5;
                            time_free = time;
                            var free_token = new free_tokens({
                                uid: uid
                            });
                            free_token.time = time;
                            free_token.save();
                            users.update({
                                uid: uid
                            }, {
                                $set: {
                                    tokens: token
                                }
                            }, fn);
                        } else if (_data.time < (time - (24 * 3600))) {

                            time_free = time;
                            token += 5;
                            free_tokens.update({
                                uid: uid
                            }, {
                                $set: {
                                    time: time
                                }
                            }, fn);
                            users.update({
                                uid: uid
                            }, {
                                $set: {
                                    tokens: token
                                }
                            }, fn);
                        } else {
                            time_free = _data.time;
                        }

                        badges.find({
                            uid: uid
                        }, function (err, data) {

                            if (err) {
                                return;
                            }

                            var trophy = data;

                            users.count({
                                actif: 1,
                                points: {
                                    $gt: points
                                }
                            }, function (err, nb) {

                                if (err) {
                                    return;
                                }

                                var classement = nb + 1;

                                socket.classement = classement;
                                socket.join('home');

                                connected();

                                socket.emit('InfosUser', {
                                    moderateur: socket.moderateur,
                                    points: points,
                                    classement: classement,
                                    tokens: token,
                                    free: getFreeTime(time_free),
                                    trophy: trophy
                                });

                                socket.emit('ListGames', created_game);
                            });
                        });
                    });
                });

                socket.emit('ListerMessages', messages.data);
            }
        }

        function getFreeTime (time) {
            return (3600 * 24) - (Math.round(new Date().getTime() / 1000) - time);
        }

        function connected() {

            io.sockets.emit('Connected', io.sockets.sockets.length);
            listChallengers();
        }

        function listChallengers() {

            var challengers = {
                user: {},
                nb: 0,
            };

            io.sockets.sockets.forEach(function (socket) {
                if (!socket.rooms || socket.rooms.indexOf('home') === -1 || !socket.uid || challengers.user[socket.uid]) {
                    return;
                }
                challengers.user[socket.uid] = {
                    name: socket.name,
                    classement: socket.classement,
                    points: socket.points
                };
                challengers.nb++;
            });

            io.sockets.to('home').emit('Challengers', challengers);
        }

        function annulerAllDefi(socket) {

            if (socket.uid && socket.defis && socket.defis.defis) {

                for (var uid in socket.defis.defis) {

                    removeDefi(getSocket(connections[uid]), socket.uid);
                }

                delete socket.defis;
            }
        }

        function removeDefi(socket, uid) {

            if (!socket || !socket.defis || !socket.defis.defis || !socket.defis.defis[uid]) {
                return;
            }

            delete socket.defis.defis[uid];
            socket.defis.nb--;
            socket.emit('Defis', socket.defis);
        }

        function startGame(uid, game) {

            var id = started_games.id++;

            socket.jeu = id;

            socketOpponent = getSocket(connections[uid]);
            socketOpponent.jeu = id;

            if (created_game.games[uid]) {
                delete created_game.games[uid];
                created_game.nb--;
            }

            if (created_game.games[socket.uid]) {
                delete created_game.games[socket.uid];
                created_game.nb--;
            }

            listGames();

            socket.leave('home');
            socketOpponent.leave('home');

            listChallengers();

            annulerAllDefi(socket);
            annulerAllDefi(socketOpponent);

            if (game.color == 'blanc') {

                var blanc = {
                    uid: uid,
                    name: socketOpponent.name
                };

                var noir = {
                    uid: socket.uid,
                    name: socket.name
                };
            } else {
                var blanc = {
                    uid: socket.uid,
                    name: socket.name
                };

                var noir = {
                    uid: uid,
                    name: socketOpponent.name
                };
            }

            var time = game.time;

            started_games.games[id] = {
                blanc: blanc.uid,
                noir: noir.uid
            };

            var jeu = newJeu(id, blanc, noir, time);

            socket.emit('NewGame', jeu);
            socketOpponent.emit('NewGame', jeu);
        }

        function deleteGame(uid) {

            if (created_game.games[uid]) {
                delete created_game.games[uid];
                created_game.nb--;
                listGames();
            }
        }

        function listGames() {

            sendHome('ListGames', created_game);
        }

        function listerMessages() {

            sendHome('ListerMessages', messages.data);
        }

        function resultGame(vainqueur, nom, blanc, noir) {

            users.findOne({
                uid: blanc
            }, function (err, data) {

                if (err) {
                    return;
                }

                var points_blanc = data.points,
                    tokens_blanc = data.tokens,
                    parrainage_blanc = data.parrainage ? data.parrainage : false,
                    cons_game_blanc = data.cons_game ? data.cons_game : 0;

                tokens_blanc--;

                if (tokens_blanc < 0) {
                    tokens_blanc = 0;
                }

                users.findOne({
                    uid: noir
                }, function (err, data) {

                    if (err) {
                        return;
                    }

                    var points_noir = data.points,
                        tokens_noir = data.tokens,
                        parrainage_noir = data.parrainage ? data.parrainage : false,
                        cons_game_noir = data.cons_game ? data.cons_game : 0;

                    tokens_noir--;

                    if (tokens_noir < 0) {
                        tokens_noir = 0;
                    }

                    games.count({
                        $or: [{
                            blanc: blanc
                        }, {
                            noir: blanc
                        }]
                    }, function (err, nb) {

                        if (err) {
                            return;
                        }

                        var nb_game_white = nb;

                        games.count({
                            $or: [{
                                blanc: noir
                            }, {
                                noir: noir
                            }]
                        }, function (err, nb) {

                            if (err) {
                                return;
                            }

                            var nb_game_black = nb;

                            if (vainqueur == 1) {

                                var resultat_blanc = 1,
                                    resultat_noir = 0;

                                if (cons_game_blanc < 0) {
                                    cons_game_blanc = 0;
                                }

                                if (cons_game_noir > 0) {
                                    cons_game_noir = 0;
                                }

                                cons_game_blanc++;
                                cons_game_noir--;
                            } else if (vainqueur == 2) {

                                var resultat_blanc = 0,
                                    resultat_noir = 1;

                                if (cons_game_noir < 0) {
                                    cons_game_noir = 0;
                                }

                                if (cons_game_blanc > 0) {
                                    cons_game_blanc = 0;
                                }

                                cons_game_noir++;
                                cons_game_blanc--;
                            } else {

                                var resultat_blanc = 0.5,
                                    resultat_noir = 0.5;

                                cons_game_blanc = 0;
                                cons_game_noir = 0;
                            }

                            var gain_blanc = gain(points_blanc, points_noir, resultat_blanc, nb_game_white),
                                gain_noir = gain(points_noir, points_blanc, resultat_noir, nb_game_black);

                            var game = new games({
                                resultat: vainqueur
                            });
                            game.blanc = blanc;
                            game.noir = noir;
                            game.time = new Date().getTime() / 1000;

                            game.save();

                            points_blanc += gain_blanc;
                            points_noir += gain_noir;

                            users.update({
                                uid: blanc
                            }, {
                                $set: {
                                    points: points_blanc,
                                    tokens: tokens_blanc,
                                    cons_game: cons_game_blanc,
                                    actif: 1
                                }
                            }, function (err) {

                                nb_game_white++;

                                setBadgesGame(blanc, nb_game_white);

                                if (resultat_blanc == 1) {
                                    setBadgesWin(blanc);
                                }

                                setBadgesGameDay(blanc);
                                setBadgesConsGame(blanc, cons_game_blanc);

                            });

                            users.update({
                                uid: noir
                            }, {
                                $set: {
                                    points: points_noir,
                                    tokens: tokens_noir,
                                    cons_game: cons_game_noir,
                                    actif: 1
                                }
                            }, function (err) {

                                nb_game_black++;
                                setBadgesGame(noir, nb_game_black);

                                if (resultat_noir == 1) {
                                    setBadgesWin(noir);
                                }

                                setBadgesGameDay(noir);
                                setBadgesConsGame(noir, cons_game_noir);

                            });

                            if (parrainage_blanc) {
                                setParrainage(parrainage_blanc);
                            }

                            if (parrainage_noir) {
                                setParrainage(parrainage_noir);
                            }

                        });
                    });
                });
            });
        }

        function setParrainage(uid) {

            users.findOne({
                uid: uid
            }, 'tokens', function (err, data) {

                if (err || !data) {
                    return;
                }

                if (!data.tokens && data.tokens != 0) return;

                var token = data.tokens + 0.1;

                users.update({
                    uid: uid
                }, {
                    $set: {
                        tokens: token
                    }
                }, fn);
            });
        }

        function setBadgesGame(uid, games) {

            switch (games) {

            case 1:
                setTrophy(uid, 1);
                break;
            case 100:
                setTrophy(uid, 2);
                break;
            case 500:
                setTrophy(uid, 3);
                break;
            case 1000:
                setTrophy(uid, 4);
                break;
            case 5000:
                setTrophy(uid, 5);
                break;
            }
        }

        function setBadgesWin(uid) {

            games.count({
                "$or": [{
                    "$and": [{
                        "noir": uid,
                        "resultat": 2
                    }]
                }, {
                    "$and": [{
                        "blanc": uid,
                        "resultat": 1
                    }]
                }]
            }, function (err, nb) {

                if (err || !nb) return;

                switch (nb) {

                case 1:
                    setTrophy(uid, 6);
                    break;
                case 50:
                    setTrophy(uid, 7);
                    break;
                case 250:
                    setTrophy(uid, 8);
                    break;
                case 500:
                    setTrophy(uid, 9);
                    break;
                case 2000:
                    setTrophy(uid, 10);
                    break;
                }

            });
        }

        function setBadgesGameDay(uid) {

            var time = (new Date().getTime() / 1000) - (3600 * 24);

            games.count({
                "time": {
                    "$gt": time
                },
                "blanc": uid
            }, function (err, nb) {

                if (err) return;

                var game = nb;

                games.count({
                    "time": {
                        "$gt": time
                    },
                    "noir": uid
                }, function (err, nb) {

                    if (err) return;

                    game += nb;

                    if (game >= 100) {

                        setTrophy(uid, 15);
                    } else if (game >= 50) {

                        setTrophy(uid, 14);
                    } else if (game >= 25) {

                        setTrophy(uid, 13);
                    } else if (game >= 10) {

                        setTrophy(uid, 12);
                    } else if (game >= 5) {

                        setTrophy(uid, 11);
                    }
                });
            });
        }

        function setBadgesConsGame(uid, nb) {

            switch (nb) {

            case 3:
                setTrophy(uid, 16);
                break;
            case 5:
                setTrophy(uid, 17);
                break;
            case 10:
                setTrophy(uid, 18);
                break;
            case 20:
                setTrophy(uid, 19);
                break;
            case -3:
                setTrophy(uid, 20);
                break;
            }
        }

        function setTrophy(uid, trophy) {

            badges.count({
                uid: uid,
                badge: trophy
            }, function (err, nb) {

                if (err) return;

                if (nb == 0) {

                    var badge = new badges({
                        uid: uid
                    });
                    badge.badge = trophy;
                    badge.save();

                    var socketOpponent = getSocket(connections[uid]);

                    if (socketOpponent) {
                        socketOpponent.emit('trophy', trophy);
                    }
                }
            });
        }

        function gain(points_user, points_adversaire, resultat, nbGame) {

            var points = points_user - points_adversaire;

            if (points > 400) {
                points = 400;
            } else if (points < -400) {
                points = -400;
            }

            points = points / 400;
            points = Math.pow(10, points);
            points = 1 + points;
            points = 1 / points;
            points = 1 - points;

            var k = 20;

            if (points_user > 2400) {
                k = 10;
            } else if (nbGame <= 30) {
                k = 40;
            }

            return Math.round(k * (resultat - points));
        }

        function newJeu(id, blanc, noir, time) {

            var jeu = {
                id: id,
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
                    vainqueur: "",
                    nom: ""
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

            var offset = (page * limit) - limit;

            if (bol) {
                if (friends) {
                    var req = {
                        $and: [{
                            actif: 1,
                            uid: {
                                $in: friends
                            }
                        }, {
                            uid: {
                                $ne: socket.uid
                            }
                        }]
                    };
                } else {
                    var req = {
                        $and: [{
                            actif: 1
                        }, {
                            uid: {
                                $ne: socket.uid
                            }
                        }]
                    };
                }
            } else {
                if (friends) {
                    var req = {
                        actif: 1,
                        uid: {
                            $in: friends
                        }
                    };
                } else {
                    var req = {
                        actif: 1
                    };
                }
            }

            users.count(req, function (err, nb) {

                if (err) {
                    return;
                }

                if (nb == 0) {

                    var data = [];
                    data.push({
                        uid: socket.uid,
                        points: socket.points,
                        position: 1
                    });

                    socket.emit('Classement', {
                        classement: data,
                        page: false
                    });

                    return;
                }

                var total = nb;

                if (bol) {
                    total++;
                    newLimit = limit - 1;
                } else {
                    newLimit = limit;
                }

                users.find(req).sort({
                    points: -1
                }).skip(offset).limit(newLimit).hint({
                    points: 1
                }).exec(function (err, data) {

                    if (err) {
                        return;
                    }

                    if (!data[0] || !data[0].points) {
                        return;
                    }

                    var points = (bol && socket.points > data[0].points) ? socket.points : data[0].points;

                    var _data = {};

                    if (friends) {
                        var req = {
                            actif: 1,
                            uid: {
                                $in: friends
                            },
                            points: {
                                $gt: points
                            }
                        };
                    } else {
                        var req = {
                            actif: 1,
                            points: {
                                $gt: points
                            }
                        };
                    }

                    users.count(req, function (err, nb) {

                        var pos = nb + 1;

                        if (friends) {
                            var req = {
                                actif: 1,
                                uid: {
                                    $in: friends
                                },
                                points: data[0].points
                            };
                        } else {
                            var req = {
                                actif: 1,
                                points: data[0].points
                            };
                        }

                        users.count(req, function (err, nb) {

                            var egal = nb;

                            var _i = 0,
                                newData = [];

                            if (bol) {

                                var saveUser = false;

                                for (var i in data) {

                                    if (!saveUser && socket.points >= data[i].points) {
                                        newData.push({
                                            uid: socket.uid,
                                            points: socket.points,
                                        });

                                        saveUser = true;
                                    }

                                    newData.push(data[i]);
                                }

                                if (!saveUser) {
                                    newData.push({
                                        uid: socket.uid,
                                        points: socket.points,
                                    });
                                }
                            } else {
                                newData = data;
                            }

                            for (var i in newData) {

                                if (newData[i].points < newData[_i].points) {
                                    if (!val) {
                                        pos += egal;
                                    } else {
                                        pos += val;
                                    }

                                    var val = 1;
                                } else {
                                    if (val) val++;
                                }

                                _data[i] = {
                                    uid: newData[i].uid,
                                    points: newData[i].points,
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
                nb_page = Math.ceil(total / limit),
                page = Math.ceil(offset / limit) + 1;

            if (nb_page <= 1) {
                socket.emit('Classement', {
                    classement: data,
                    page: false
                });
                return;
            }

            var _page = {
                page: page,
                list: {},
                prec: {},
                suiv: {}
            };

            for (i = 1; i <= nb_page; i++) {

                if ((i <= nb) || (i > nb_page - nb) || ((i < page + nb) && (i > page - nb))) {
                    _page.list[i] = {
                        num: i,
                        nom: i
                    };
                } else {
                    var num = false;

                    if (i >= nb && i <= page - nb) {
                        i = page - nb;
                        num = Math.ceil((page - (nb - 3)) / 2);
                    } else if (i >= page + nb && i <= nb_page - nb) {
                        i = nb_page - nb;
                        num = Math.ceil((((nb_page - (nb - 2)) - page) / 2) + page);
                    }

                    if (num) {

                        _page.list[i] = {
                            num: num,
                            nom: '...'
                        };
                    }
                }
            }

            if (offset >= limit) {

                _page.prec = {
                    num: page - 1,
                    nom: '<<'
                };
            }

            if (page != nb_page) {

                _page.suiv = {
                    num: page + 1,
                    nom: '>>'
                };
            }

            socket.emit('Classement', {
                classement: data,
                page: _page
            });
        }

        function sendHome(name, data) {

            io.sockets.to('home').emit(name, data);
        }

        function parseSignedRequest(signedRequest, secret) {

            signedRequest = signedRequest.split('.', 2);

            var encodedSig = signedRequest[0],
                payload = signedRequest[1],
                sig = base64Decode(encodedSig),
                data = JSON.parse(base64Decode(payload));

            if (data.algorithm && data.algorithm.toUpperCase() !== 'HMAC-SHA256') {
                return;
            }

            var hmac = crypto.createHmac('sha256', secret);
            hmac.update(payload);
            var expectedSig = base64Decode(hmac.digest('base64'));

            if (sig !== expectedSig) {
                return;
            }

            return data;
        }

        function base64Decode(data) {
            return new Buffer(data, 'base64').toString('ascii');
        }

        function fn(err) {
            return;
        }
    });
};
