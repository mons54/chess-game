

module.exports = function() {
	
	global.usersSchema = new global.mongoose.Schema({
		uid : { type : Number, unique: true },
		points : Number,
		tokens : Number,
		cons_game: Number,
		actif: Number,
		trophy: Number,
		parrainage: Number,
		ban: Boolean,
		moderateur: Boolean
	});
	
	global.partiesSchema = new global.mongoose.Schema({
		blanc : Number,
		noir : Number,
		resultat: Number,
		time: Number
	});
	
	global.usersBadgesSchema = new global.mongoose.Schema({
		uid : Number, 
		badge : Number
	});
	
	global.paiementsSchema = new global.mongoose.Schema({
		id: { type : Number, unique: true },
		uid: Number, 
		item: Number,
		type: String,
		status: String,
		time: Number
	});
	
	global.freeTokenSchema = new global.mongoose.Schema({
		uid : { type : Number, unique: true },
		time : Number
	});
	
	global.sponsorPaySchema = new global.mongoose.Schema({
		id : { type : String, unique: true },
		uid : Number, 
		amount : Number
	});
	
	global.tokenAdsSchema = new global.mongoose.Schema({
		id : { type : String, unique: true },
		uid : Number, 
		amount : Number
	});
}();