module.exports = (function(){
	// var
	var sql = require('mssql');
	var path  = require('path');
	var pc = {};

	// initialisation of variables

	// decalre functions
	function handleIssueTemplate(req, res){
		console.log('3');
		res.sendFile(
			path.join(
				__dirname, 
				'..\\templates', 
				'issues.hbs'));
	}

	function handleIssueGet(req, res){
		sql.connect(pc.config).then(function(){
			var sqlReqst = new sql.Request();
		    
		    sqlReqst.query('SELECT * FROM [Notice];').then(function(recordsets) {
		        var notices = recordsets.recordset;
		        var toSendNotices = notices.map(function(notice, idx){
		        	return {
		        		id: notice.NoticeId,
		        		title: notice.NoticeTitle,
		        		desc: notice.NoticeDesc
		        	};
		        });

		        sql.close();
		        res.send(toSendNotices);
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
		routeConfig.app.get('/issues-template', handleIssueTemplate);
		routeConfig.app.get('/issues', handleIssueGet);
	}

	// return
	return {
		init: init
	}
})();