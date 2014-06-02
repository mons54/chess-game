var express = require('express'),
    connect = require('connect'),
    mongoose = require('mongoose'),
    fbgraph = require('fbgraph'),
    crypto = require('crypto'),
    app = express(),
    io = require('socket.io').listen(app.listen(process.env.PORT || 3000));

global.dirname = __dirname;

require(dirname + '/server/config')(app, express, connect, mongoose, io);

require(dirname + '/server/modules/mongoose')(mongoose);
require(dirname + '/server/modules/socket')(app, io, mongoose, fbgraph, crypto);

require(dirname + '/server/routes/payment')(app, mongoose, fbgraph, crypto);
require(dirname + '/server/routes/sponsorpay')(app, mongoose, crypto);
require(dirname + '/server/routes/tokenads')(app, mongoose, crypto);

require(dirname + '/server/router')(app);