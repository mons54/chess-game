module.exports = function (app, mongoose) {

    var crypto = require('crypto');

    var security_token = '911f3fd471bdb649c9beb94631edf75a';

    var users = mongoose.models.users,
        payments = mongoose.models.payments;

    var tokens = {
        20: {
            amount: 2000,
            item: 1
        },
        12: {
            amount: 1000,
            item: 2
        },
        8: {
            amount: 500,
            item: 3
        },
        4: {
            amount: 200,
            item: 4
        },
        2: {
            amount: 75,
            item: 5
        }
    };

    app.all('/payments', function (req, res) {

        var response = 'HTTP/1.0 400 Bad Request';

        if (!req.query) {
            res.send(response);
            return;
        }

        if (req.query['hub.mode'] == 'subscribe' && req.query['hub.verify_token'] == security_token) {
            response = req.query['hub.challenge'];
            res.send(response);
            return;
        }

        if (!req.headers['x-hub-signature'] || !req.body.entry || !req.body.entry[0] || !req.body.entry[0].id) {
            res.send(response);
            return;
        }

        var paymentId = req.body.entry[0].id;

        var signature = req.headers['x-hub-signature'].substr(5),
            query = JSON.stringify(req.body);

        var hmac = crypto.createHmac('sha1', global.secret);
        hmac.update(query);
        var calculatedSecret = hmac.digest(encoding = 'hex');

        if (signature != calculatedSecret) {
            res.send(response);
            return;
        }

        global.fbgraph.post('/oauth/access_token?client_id=' + global.appId + '&client_secret=' + global.secret + '&grant_type=client_credentials', function (err, data) {

            if (!data.access_token) {
                res.send(response);
                return;
            }

            global.fbgraph.get('/' + paymentId + '?access_token=' + data.access_token, function (err, data) {

                if (!data.id || !data.user || !data.actions) {
                    res.send(response);
                    return;
                }

                var type = '',
                    status = '';

                for (var i in data.actions) {
                    type = data.actions[i].type;
                    status = data.actions[i].status;
                }

                if (type == 'charge' && status == 'failed') {
                    res.send('HTTP/1.0 200 OK');
                    return;
                }

                var amount = parseInt(data.actions[0].amount);

                if (!tokens[amount]) {
                    res.send(response);
                    return;
                }

                payments.find({
                    id: data.id
                }, function (err, _data) {

                    if (err) {
                        res.send(response);
                        return;
                    } else if (!_data[0]) {

                        users.find({
                            uid: data.user.id
                        }, function (err, _data) {

                            if (err || !_data[0] || !_data[0].tokens) {
                                res.send(response);
                                return;
                            }

                            var token = parseInt(_data[0].tokens) + parseInt(tokens[amount].amount);

                            users.update({
                                uid: data.user.id
                            }, {
                                $set: {
                                    tokens: token
                                }
                            }, function (err) {

                                if (err) {
                                    res.send(response);
                                    return;
                                }

                                new payments({
                                    id: data.id,
                                    uid: data.user.id,
                                    item: tokens[amount].item,
                                    type: 'charge',
                                    status: 'completed',
                                    time: Math.round(+new Date() / 1000),
                                }).save(function (err) {

                                    if (err) {
                                        res.send(response);
                                    }

                                    res.send('HTTP/1.0 200 OK');
                                });
                            });
                        });
                    } else if (type == 'refund' && type != _data[0].type && status != 'completed' && _data[0].status != status) {

                        users.find({
                            uid: data.user.id
                        }, function (err, _data) {

                            if (err || !_data[0] || !_data[0].tokens) {
                                res.send(response);
                                return;
                            }

                            var token = parseInt(_data[0].tokens) - parseInt(tokens[amount].amount);

                            users.update({
                                uid: data.user.id
                            }, {
                                $set: {
                                    tokens: token
                                }
                            }, function (err) {

                                if (err) {
                                    res.send(response);
                                    return;
                                }

                                payments.update({
                                    id: data.id
                                }, {
                                    $set: {
                                        type: 'refund',
                                        status: 'completed'
                                    }
                                }, function (err) {

                                    if (err) {
                                        res.send(response);
                                    }

                                    res.send('HTTP/1.0 200 OK');

                                });
                            });
                        });
                    } else {
                        res.send('HTTP/1.0 200 OK');
                    }
                });
            });
        });
    });
};
