module.exports = (function(){
	// var
	var sql = require('mssql');
	var path  = require('path');
	var pc = {};

	// initialisation of variables

	// decalre functions
	function handleNoticeTemplate(req, res){
		res.sendFile(
			path.join(
				__dirname, 
				'..\\templates', 
				'notices.hbs'));
	}

	function handleNoticeGet(req, res){
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

	function handleNoticeDelete(req, res){
		var noticeId = parseInt(req.body.id, 10);

		fs.readFile('data/notices.json', function (err,data) {
			var notices = JSON.parse(data);

			var idx = -1, i = 0;
			for(i = 0; i < notices.length; i++){
				if(notices[i].id === noticeId){
					idx = i;
					break;
				}
			}

			var notice = notices.splice(idx, 1);
			fs.writeFile('data/notices.json', 
				JSON.stringify(notices), function(err){
				res.send(notice);
			})
		});
	};

	function handleNoticePut(req, res){
		var noticeId = parseInt(req.body.id, 10);

		fs.readFile('data/notices.json', function (err,data) {
			var notices = JSON.parse(data);

			var idx = -1, i = 0;
			for(i = 0; i < notices.length; i++){
				if(notices[i].id === noticeId){
					idx = i;
					break;
				}
			}

			var notice = notices.splice(idx, 1, req.body);
			fs.writeFile('data/notices.json', 
				JSON.stringify(notices), function(err){
				res.send(req.body);
			})
		});
	};

	function handleNoticePost(req, res){
		fs.readFile('data/notices.json', function (err,data) {
			var notices = JSON.parse(data);

			var notice = {
				title : req.body.title,
				desc: req.body.desc
			};

			if(notices.length > 0){
				notice.id= parseInt(notices[notices.length - 1].id, 10) + 1;
			} else {
				notice.id= 1;
			}

			notices.push(notice);
			fs.writeFile('data/notices.json', 
				JSON.stringify(notices), function(err){
				res.send(notice);
			})
		});
	};	

	// declare init
	function init(routeConfig){
		pc.config = routeConfig.dbConfig;
		routeConfig.app.get('/notices-template', handleNoticeTemplate);
		routeConfig.app.get('/notices-sql', handleNoticeGet);
		routeConfig.app.delete('/notices-sql', handleNoticeDelete);
		routeConfig.app.put('/notices-sql', handleNoticePut);
		routeConfig.app.post('/notices-sql', handleNoticePost);
	}

	// return
	return {
		init: init
	}
})();