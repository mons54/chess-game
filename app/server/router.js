
module.exports = function(app) {

	app.all('/', function(req, res) {
		res.render('index', { title: 'Chess Game'});
	});
	
	app.all('*', function(req, res){
		res.redirect('/'); 
	});
	
};