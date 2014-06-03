module.exports = function (app, express, connect, mongoose, io) {

	app.host = 'mons54.parthuisot.fr';

    app.facebook = {
        appId: '466889913406471',
        secret: '61f10f2183f931b1d2db51d3711919b8',
        redirectUri: 'https://apps.facebook.com/____test/'
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
    app.use(require('body-parser')());
    app.set('views', app.static);
    app.engine('html', require('ejs').renderFile);

    mongoose.connect('mongodb://127.0.0.1:27017/chess_new');

    io.set('origins', app.host + ':*');

};
