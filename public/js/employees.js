window.employees = (function(){
	// var
	var parentClosure = {};

	// var init
	
	// functions
	function handleHash(htmlInjector){
		prepareHTML.htmlInjector = htmlInjector;
		$.ajax({
			url: '/employees',
			method: 'GET',
			dataType: 'json',
			data: {
			},
			success: getDataSH,
			error: function(){
				console.log(arguments);
			}
		});

		if(!prepareHTML.templateFunction){
			$.ajax({
				url: '/employees-template',
				method: 'GET',
				dataType: 'text',
				data: {
				},
				success: getTemplateSH,
				error: function(){
					console.log(arguments);
				}
			});
		} 
	}

	function getTemplateSH(templateText){
		prepareHTML.templateFunction = Handlebars.compile(templateText);
		prepareHTML();
	}

	function getDataSH(data){
		if(data.IsAuthenticated === false){
			var html = 'Please <a href="#login">Login</a> to access employees';
			prepareHTML.htmlInjector(html, null);
		} else if(data.IsAuthorised === false){
			var html = 'Please <a href="#logout">Logout</a> and Login with proper role to access employees';
			prepareHTML.htmlInjector(html, pageSetup);
		}
		else {
			prepareHTML.data = data;
			prepareHTML();
		}
	}

	function prepareHTML(){
		if(prepareHTML.data && prepareHTML.templateFunction){
			var html = prepareHTML.templateFunction(prepareHTML.data);
			prepareHTML.htmlInjector(html, pageSetup);
		}
	}

	function pageSetup(){
		// variables init

		// events init

	}

	// init
	function init(){
	}

	// return
	return {
		init: init,
		handleHash: handleHash
	}
})();