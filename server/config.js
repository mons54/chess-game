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
            amount: 19.99
        },
        4: {
            tokens: 1500,
            amount: 9.99
        },
        3: {
            tokens: 500,
            amount: 4.99
        },
        2: {
            tokens: 150,
            amount: 1.99
        },
        1: {
            tokens: 50,
            amount: 0.99
        }
    };

    app.static = dirname + '/public/';

    app.use(express.static(app.static));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.set('views', app.static);
    app.engine('html', require('ejs').renderFile);

    mongoose.connect('mongodb://127.0.0.1:27017/chess_new', { useNewUrlParser: true });

    //mongoose.connect('mongodb://127.0.0.1:27017/chess_new', { useNewUrlParser: true });

    io.set('origins', app.host + ':*');

};
