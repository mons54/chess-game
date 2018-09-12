module.exports = function (app, mongoose, fbgraph, crypto) {

    var security_token = '911f3fd471bdb649c9beb94631edf75a';

    var users = mongoose.models.users,
        payments = mongoose.models.payments;

    var items = {}

    for (var item in app.items) {
        
        var data = app.items[item];
        
        items[data.amount] = {
            tokens: data.tokens,
            item: item
        };
    }

    app.all('/payments', function (req, res) {

        var response = 'HTTP/1.0 400 Bad Request';

        console.log(req.query)

        if (!req.query) {
            res.send(response);
            return;
        }

        console.log(req.query['hub.mode'], req.query['hub.verify_token'])

        if (req.query['hub.mode'] == 'subscribe' && req.query['hub.verify_token'] == security_token) {
            response = req.query['hub.challenge'];
            res.send(response);
            return;
        }


        console.log(req.headers['x-hub-signature'], req.body.entry)

        if (!req.headers['x-hub-signature'] || !req.body.entry || !req.body.entry[0] || !req.body.entry[0].id) {
            res.send(response);
            return;
        }

        var paymentId = req.body.entry[0].id;

        var signature = req.headers['x-hub-signature'].substr(5),
            query = JSON.stringify(req.body);

        var hmac = crypto.createHmac('sha1', app.facebook.secret);
        hmac.update(query);
        var calculatedSecret = hmac.digest('hex');

        
        console.log(signature, calculatedSecret)

        if (signature != calculatedSecret) {
            res.send(response);
            return;
        }

        fbgraph.post('/oauth/access_token?client_id=' + app.facebook.appId + '&client_secret=' + app.facebook.secret + '&grant_type=client_credentials', function (err, data) {
                console.log(1)

            if (!data.access_token) {
                res.send(response);
                return;
            }

            fbgraph.get('/' + paymentId + '?access_token=' + data.access_token, function (err, data) {
                console.log(2)

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

                if (!items[amount]) {
                    res.send(response);
                    return;
                }

                payments.find({
                    id: data.id
                }, function (err, _data) {
                console.log(3)

                    if (err) {
                        res.send(response);
                        return;
                    } else if (!_data[0]) {

                        users.find({
                            uid: data.user.id
                        }, function (err, _data) {
                console.log(4)

                            if (err || !_data[0] || !_data[0].tokens) {
                                res.send(response);
                                return;
                            }

                            var token = parseInt(_data[0].tokens) + parseInt(items[amount].tokens);

                            users.update({
                                uid: data.user.id
                            }, {
                                $set: {
                                    tokens: token
                                }
                            }, function (err) {
                console.log(5)

                                if (err) {
                                    res.send(response);
                                    return;
                                }

                                new payments({
                                    id: data.id,
                                    uid: data.user.id,
                                    item: items[amount].item,
                                    type: 'charge',
                                    status: 'completed',
                                    time: Math.round(new Date() / 1000),
                                }).save(function (err) {
                console.log(6)

                                    if (err) {
                                        res.send(response);
                                        return;
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

                            var token = parseInt(_data[0].tokens) - parseInt(items[amount].tokens);

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
                                        return;
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
