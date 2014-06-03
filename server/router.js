module.exports = function (app) {

    app.all('/', function (req, res) {

        if (req.headers.host != app.host) {
            res.redirect(app.facebook.redirectUri);
            return;
        }

        res.render('index.html');
    });

    app.get('/item/:item/:token/:desc', function (req, res) {
        if (!app.items[req.params.item]) {
            res.status(404).send('Page not found!');
            return;
        }
        
        res.render('views/item.html', { 
            item: app.items[req.params.item],
            token: req.params.token,
            desc: req.params.desc,
            host: app.host,
            path: '/item/' + req.params.item + '/' + req.params.token + '/' + req.params.desc
        });
    });

    app.all('*', function (req, res) {
        res.redirect('/');
    });

};
