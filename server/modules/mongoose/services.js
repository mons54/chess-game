module.exports = function (mongoose) {
	return {
		query: function (model, data, params) {
			var req = mongoose.models[model].find(data);
			for (var attr in params) {
				req = req[attr](params[attr]);
			}
			var promise = new mongoose.Promise();
			req.exec(function (err, res) {
				promise.resolve(err, res);
			});
			return promise;
		},
		find: function (model, data) {
			var promise = new mongoose.Promise();
			mongoose.models[model].find(data, function (err, res) {
				promise.resolve(err, res);
			});
			return promise;
		},
		save: function (model, data) {
			var promise = new mongoose.Promise();
			new mongoose.models[model](data).save(function (err, res) {
				promise.resolve(err, res);
			});
			return promise;
		},
		remove: function (model, data) {
			var promise = new mongoose.Promise();
			mongoose.models[model].remove(data, function (err, res) {
				promise.resolve(err, res);
			});
			return promise;
		}
	};
};