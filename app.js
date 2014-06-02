var express = require('express'),
    connect = require('connect'),
    mongoose = require('mongoose'),
    app = express(),
    io = require('socket.io').listen(app.listen(process.env.PORT || 3000)),
    fbgraph = require('fbgraph');

global.dirname = __dirname;

require(dirname + '/server/config')(app, express, connect, mongoose, io);

require(dirname + '/server/modules/mongoose')(mongoose);
require(dirname + '/server/modules/socket')(io, mongoose, fbgraph);
require(dirname + '/server/modules/payment')(app, mongoose);
require(dirname + '/server/modules/sponsorpay')(app, mongoose);
require(dirname + '/server/modules/tokenads')(app, mongoose);
