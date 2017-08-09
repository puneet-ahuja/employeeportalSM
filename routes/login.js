module.exports = (function(){
	// var
	var sql = require('mssql');
	var path  = require('path');
	var pc = {};

	// initialisation of variables

	// decalre functions
	function handleLoginTemplate(req, res){
		res.sendFile(
			path.join(
				__dirname, 
				'..\\templates', 
				'login.hbs'));
	}


	//function handling post req of login
	function handleLoginPost(req, res){
		var userId = req.body.userId;
		var pwd = req.body.pwd;

		sql.connect(pc.config).then(function() {
		    new sql.Request()
		    .input('UserId', sql.NVarChar(50), userId)
		    .input('Password', sql.NVarChar(50), pwd)
		    .query("SELECT * FROM [User] WHERE LoginId=@UserId AND Password=@Password").then(function(recordsets) {
		        sql.close();
		        if(recordsets.recordset.length === 1){
		        	req.userSession.IsAuthenticated = true;
		        	req.userSession.IsAuthorised = false;
		        	req.userSession.user = recordsets.recordset[0];
		        	
		        	res.send(req.userSession);
		        }
		        else {
					req.userSession.IsAuthenticated = false;
					req.userSession.IsAuthorised = false;
					req.userSession.user = null;

		        	res.send(req.userSession);
		        }
		    }).catch(function(err) {
		    	console.log(err);
		    });
		}).catch(function(err) {
		    console.log(err);
		});
	}

	// declare init
	function init(routeConfig){
		pc.config = routeConfig.dbConfig;
		routeConfig.app.get('/login-template', handleLoginTemplate);
		routeConfig.app.post('/login', handleLoginPost);
	}

	// return
	return {
		init: init
	}
})();