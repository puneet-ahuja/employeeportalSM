window.notices = (function(){
	// var
	var parentClosure = {};

	// var init
	
	// functions
	function handleHash(htmlInjector){
		prepareHTML.htmlInjector = htmlInjector;
		$.ajax({
			url: '/notices-sql',
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
				url: '/notices-template',
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
		prepareHTML.data = data;
		prepareHTML();
	}

	function prepareHTML(){
		if(prepareHTML.data && prepareHTML.templateFunction){
			var html = prepareHTML.templateFunction(prepareHTML.data);
			prepareHTML.htmlInjector(html, pageSetup);
		}
	}

	function deleteNotice(){
		var noticeId = $(this).closest('[notice-id]').attr('notice-id');
		$.ajax({
			url: '/notices-sql',
			method: 'DELETE',
			data: {
				id: noticeId
			},
			success: deleteNoticeSH
		})
	}

	function deleteNoticeSH(data){
		parentClosure.divNotices.find('div[notice-id=' + data.id + ']').remove();
	}

	function editNotice(){
		var noticeTitle, noticeDesc;

		clearModal();

		noticeTitle = $(this).closest('div[notice-id]').find('[info=title]').html();
		noticeDesc = $(this).closest('div[notice-id]').find('[info=desc]').html();

		parentClosure.txtNoticeTitle.val(noticeTitle);
		parentClosure.txtDescription.val(noticeDesc);
		parentClosure.noticeModal.attr('notice-id', $(this).closest('div[notice-id]').attr('notice-id'));

		parentClosure.noticeModal.modal('show');
	}

	function createNotice(){
		clearModal();
		parentClosure.noticeModal.attr('notice-id', '-1');
		parentClosure.noticeModal.modal('show');
	}

	function clearModal(){
		parentClosure.txtNoticeTitle.val('');
		parentClosure.txtDescription.val('');
	}

	function saveNotice(){
		var notice = {}, method = 'POST';

		notice.id = parseInt(parentClosure.noticeModal.attr('notice-id'), 10);
		notice.title = parentClosure.txtNoticeTitle.val();
		notice.desc = parentClosure.txtDescription.val();

		if(notice.id != -1){
			method = 'PUT';
		}

		$.ajax({
			url: '/notices-sql',
			method: method,
			data: notice,
			success: saveNoticeSH
		});

		parentClosure.noticeModal.modal('hide');
	}

	function saveNoticeSH(){
		handleHash();
	}

	function pageSetup(){
		// variables init
		parentClosure.divNotices = $('#divNoticesTemplate #divNotices');
		parentClosure.noticeModal = $('#divNoticesTemplate #noticeModal');
		parentClosure.modalTitle = $('#divNoticesTemplate #modalTitle');
		parentClosure.btnSave = $('#divNoticesTemplate #btnSave');
		parentClosure.btnCreate = $('#divNoticesTemplate #btnCreate');
		parentClosure.txtNoticeTitle = $('#divNoticesTemplate #txtNoticeTitle');
		parentClosure.txtDescription = $('#divNoticesTemplate #txtDescription');

		// events init
		parentClosure.divNotices.on('click', 
			'a[action=delete]', deleteNotice);
		parentClosure.divNotices.on('click', 
			'a[action=edit]', editNotice);
		parentClosure.btnSave.bind('click', saveNotice);
		parentClosure.btnCreate.bind('click', createNotice);
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