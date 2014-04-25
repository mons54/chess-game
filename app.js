
var path = require('path'),
	express = require('express'),
	app = express(),
	connect = require('connect');

app.root = __dirname;

global.appId = '459780557396952';
global.secret = 'ffba6ba90d75f0e2ffd73d946fd5f1bd';

global.host = 'chess-game.herokuapp.com';
global.redirectUri = 'https://apps.facebook.com/the-chess-game/';
global.root = path.resolve('/');
global.port = process.env.PORT || 3000;

global.io = require('socket.io').listen(app.listen(port));
global.fbgraph = require('fbgraph');
global.mongoose = require('mongoose');

io.set('log level', 1);
io.set('origins', host + ':*');

mongoose.connect('mongodb://mons54:swOLjsfb162028@candidate.14.mongolayer.com:10036/chess_new');

require('./app/server/modules/mongoose');
require('./app/server/modules/socket');

require('./app/config')(app, express, connect);

require('./app/server/payments')(app);
require('./app/server/sponsorpay')(app);
require('./app/server/tokenads')(app);
require('./app/server/router')(app);
