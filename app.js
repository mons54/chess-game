
var path = require('path'),
	express = require('express'),
	app = express(),
	connect = require('connect');

app.root = __dirname;

global.appId = '466889913406471';
global.secret = '61f10f2183f931b1d2db51d3711919b8';

global.host = 'jsimonet.ma-luna.net';
global.redirectUri = 'https://apps.facebook.com/____test/';
global.root = path.resolve('/');
global.port = process.env.PORT || 3000;

global.io = require('socket.io').listen(app.listen(port));
global.fbgraph = require('fbgraph');
global.mongoose = require('mongoose');

io.set('log level', 1);
io.set('origins', host + ':*');

mongoose.connect('mongodb://mons54:gTu59JsUOp975s55sTtPmQze@oceanic.mongohq.com:10096/chess');

require('./app/server/modules/mongoose');
require('./app/server/modules/socket');

require('./app/config')(app, express, connect);

require('./app/server/payments')(app);
require('./app/server/sponsorpay')(app);
require('./app/server/tokenads')(app);
require('./app/server/router')(app);
