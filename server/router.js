module.exports = function (app) {

    app.all('/', function (req, res) {

        if (req.headers.host != app.host) {
            res.redirect(app.facebook.redirectUri);
            return;
        }

        res.sendfile(app.static + 'index.html');
    });

    app.all('*', function (req, res) {
        res.redirect('/');
    });

};
