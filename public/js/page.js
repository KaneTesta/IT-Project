$(() => {
	// Setup manage page button
	$('#PageButtonManagePage').on('click', (e) => {
		// Show manage page dialog
		const dialogManagePage = document.getElementById('DialogManagePage');
		if (dialogManagePage) {
			dialogManagePage.show();
		}
	});


	// Get distinct tags
	const distincttags = artefact.distinct('tags',function(err, results));
	const taglength = distincttags.length;

	// Setup add artefact button
	$('#PageButtonAddArtefact').on('click', (e) => {
		// Show add artefact dialog
		const dialogAddArtefact = document.getElementById('DialogAddArtefact');
		if (dialogAddArtefact) {
			dialogAddArtefact.show();
		}
	});

	// Setup view artefact buttons
	$('.page-artefact').on('click', (e) => {
		const $button = $(e.target);
		const pageId = $button.attr('data-page-id');
		const artefactId = $button.attr('data-artefact-id');
		// Show view artefact dialog
		const dialogViewArtefact = document.getElementById('DialogViewArtefact');
		if (dialogViewArtefact && pageId && artefactId) {
			$('#ArtefactViewName').html('');
			$('#ArtefactViewDescription').html('');
			$('#ArtefactViewImage').attr('src', '');
			$('#ArtefactViewImage').attr('alt', '');
			// Create loading dialog
			const loadingDialog = window.dialogManager.createNewLoadingDialog('Loading Artefact');
			loadingDialog.show();
			// Get and show artefact data
			$.get(`/page/${pageId}/artefact/${artefactId}`, (data) => {
				loadingDialog.hideAndRemove();
				dialogViewArtefact.show();
				// Set fields
				const artefact = JSON.parse(data);
				$('#ArtefactViewName').html(artefact.name);
				$('#ArtefactViewDescription').html(artefact.description);
				$('#ArtefactViewTags').html(artefact.tags);
				$('#ArtefactViewImage').attr('src', artefact.image);
				$('#ArtefactViewImage').attr('alt', artefact.name);
				// Set edit button action
				$('#ArtefactViewButtonEdit').off('click');
				$('#ArtefactViewButtonEdit').on('click', () => {
					dialogViewArtefact.hide();
					// Show edit artefact dialog
					const dialogEditArtefact = document.getElementById('DialogEditArtefact');
					$('#EditArtefactId').val(artefact._id);
					$('#EditArtefactName').val(artefact.name);
					$('#EditArtefactDescription').val(artefact.description);
					$('#EditArtefactImageName').val(artefact.image);
					$('#EditArtefactDeleteId').val(artefact._id);
					dialogEditArtefact.show();
				});
			}).fail(() => {
				loadingDialog.hideAndRemove();
				const errorDialog = window.dialogManager.createNewErrorDialog('Could not load information for artefact');
				errorDialog.show();
			});
		}
	});

});
