
var path = require('path'),
	express = require('express'),
	app = express(),
	connect = require('connect');

app.root = __dirname;

global.appId = '459780557396952';
global.secret = 'ffba6ba90d75f0e2ffd73d946fd5f1bd';
global.host = 'fb-chess.jit.su';
global.redirectUri = 'https://apps.facebook.com/the-chess-game/';
global.root = path.resolve('/');

global.graph = require('fbgraph');

global.socket = require('socket.io').listen(app.listen(8080));

global.socket.set('log level', 1);
global.socket.set('origins', global.host + ':*');

global.mongoose = require('mongoose');
global.mongoose.connect('mongodb://mons54:jsOL160884@lafleur.mongohq.com:10055/chessGame');

require('./server/modules/mongoose');
require('./server/modules/socket');

require('./config')(app, express, connect);

require('./server/payments')(app);
require('./server/sponsorpay')(app);
require('./server/tokenads')(app);
require('./server/router')(app);


