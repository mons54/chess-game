module.exports = function (app, express, connect, mongoose, io) {

    var bodyParser = require('body-parser');

	app.host = 'mons54.parthuisot.fr';

    app.facebook = {
        appId: '459780557396952',
        secret: 'ffba6ba90d75f0e2ffd73d946fd5f1bd',
        redirectUri: 'https://apps.facebook.com/the-chess-game/'
    };

    app.items = {
        5: {
            tokens: 5000,
            amount: 20
        },
        4: {
            tokens: 1500,
            amount: 10
        },
        3: {
            tokens: 500,
            amount: 5
        },
        2: {
            tokens: 150,
            amount: 2
        },
        1: {
            tokens: 50,
            amount: 1
        }
    };

    app.static = dirname + '/public/';

    app.use(express.static(app.static));
    app.use(bodyParser.urlencoded());
    app.use(bodyParser.json());
    app.set('views', app.static);
    app.engine('html', require('ejs').renderFile);

    mongoose.connect('mongodb://127.0.0.1:27017/chess_new');

    io.set('origins', app.host + ':*');

};
