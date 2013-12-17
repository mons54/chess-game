

module.exports = function () {
	
	mongoose.collections = {
		users: mongoose.model('users', new mongoose.Schema({
			uid : { type : Number, unique: true },
			points : Number,
			tokens : Number,
			cons_game: Number,
			actif: Number,
			trophy: Number,
			parrainage: Number,
			ban: Boolean,
			moderateur: Boolean
		})),
		games: mongoose.model('parties', new global.mongoose.Schema({
			blanc : Number,
			noir : Number,
			resultat: Number,
			time: Number
		})),
		badges: mongoose.model('user_badges', new mongoose.Schema({
			uid : Number, 
			badge : Number
		})),
		free_tokens: mongoose.model('free_tokens', new mongoose.Schema({
			uid : { type : Number, unique: true },
			time : Number
		})),
		payments: mongoose.model('paiements', new mongoose.Schema({
			id: { type : Number, unique: true },
			uid: Number, 
			item: Number,
			type: String,
			status: String,
			time: Number
		})),
		sponsorpay: mongoose.model('sponsor_pays', new mongoose.Schema({
			id : { type : String, unique: true },
			uid : Number, 
			amount : Number
		})),
		tokenads: mongoose.model('token_ads', new mongoose.Schema({
			id : { type : String, unique: true },
			uid : Number, 
			amount : Number
		})),
	};
	
}();