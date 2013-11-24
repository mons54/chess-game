
module.exports = function(app) {

	app.all('/', function(req, res) {
		
		if (req.headers.host != global.host) {
			res.redirect(global.redirectUri);
			return;
		}
		
		res.render('index', { title: 'Chess Game'});
	});
	
	app.all('*', function(req, res){
		res.redirect('/'); 
	});
	
};