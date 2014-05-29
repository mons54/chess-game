module.exports = function (app, express, connect, mongoose, io) {

	app.facebook = {
		appId		: '466889913406471',
		secret		: '61f10f2183f931b1d2db51d3711919b8',
		redirectUri	: 'https://apps.facebook.com/____test/'
	};

	app.use(express.static(dirname + '/public'));
	app.use(require('body-parser')());

	mongoose.connect('mongodb://mons54:gTu59JsUOp975s55sTtPmQze@oceanic.mongohq.com:10096/chess');
	
	io.set('origins', 'jsimonet.ma-luna.net:*');
};