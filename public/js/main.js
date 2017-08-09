(function(){
	// var
	var $bodyContent;
	var $liUser, $liLogout, $liLogin;

	// var init
	$bodyContent = $('#bodyContent');
	$liUser = $('#liUser');
	$liLogout = $('#liLogout');
	$liLogin = $('#liLogin');

	// functions
	function handleHashChange(){
		switch(window.location.hash){
			case '#notices':
				window.notices.handleHash(injectBodyContent);
				break;
			case '#issues':
				window.issues.handleHash(injectBodyContent);
				break;
			case '#employees':
				window.employees.handleHash(injectBodyContent);
				break;
			case '#login':
				alert('test');
				window.login.handleHash(injectBodyContent);
				break;
			case '#logout':
				window.logout.handleHash();
				break;
			default: 
				break;
		}
	}

	function injectBodyContent(bodyContentHTML, afterInjectionCB){
		$bodyContent.html(bodyContentHTML);
		if(afterInjectionCB && typeof afterInjectionCB === 'function'){
			afterInjectionCB();
		}
	}

	function getInitData(){
		$.ajax({
			url: '/init',
			method: 'GET',
			data: {
			},
			success: getInitDataSH
		})
	}

	function getInitDataSH(data){
		debugger;
		$liUser.addClass('hidden');
		$liLogout.addClass('hidden');
		$liLogin.addClass('hidden');

		if(data.IsAuthenticated){
			$liUser.find('a').html('Hi ' + data.user.UserName);
			$liUser.removeClass('hidden');
			$liLogout.removeClass('hidden');
		} else {
			$liLogin.removeClass('hidden');
		}
	}

	// init
	function init(){
		window.notices.init();
		window.issues.init();
		window.employees.init();
		window.login.init();
		window.logout.init();

		$(window).on('hashchange', handleHashChange);
		handleHashChange();
		getInitData();
	}

 	// init call
	init();
})();