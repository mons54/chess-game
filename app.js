
var path = require('path'),
	express = require('express'),
	app = express(),
	connect = require('connect');

app.root = __dirname;

global.appId = '394212277368771';
global.secret = 'f62525925927e6d80ea814f94acc719e';
global.host = 'guarded-dusk-4860.herokuapp.com';
global.redirectUri = 'https://apps.facebook.com/parrainage-bourso/';
global.root = path.resolve('/');

global.graph = require('fbgraph');

var port = process.env.PORT || 3000;

global.socket = require('socket.io').listen(app.listen(port));

global.socket.set('log level', 1);
global.socket.set('origins', global.host + ':*');

global.mongoose = require('mongoose');
global.mongoose.connect('mongodb://mons54:jsOL160884@lafleur.mongohq.com:10055/chessGame');

require('./app/server/modules/mongoose');
require('./app/server/modules/socket');

require('./app/config')(app, express, connect);

require('./app/server/payments')(app);
require('./app/server/sponsorpay')(app);
require('./app/server/tokenads')(app);
require('./app/server/router')(app);


