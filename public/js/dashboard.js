$(() => {
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
		const artefactId = $button.attr('data-artefact-id');
		// Show view artefact dialog
		const dialogViewArtefact = document.getElementById('DialogViewArtefact');
		if (dialogViewArtefact && artefactId) {
			$('#ArtefactViewName').html('');
			$('#ArtefactViewDescription').html('');
			$('#ArtefactViewImage').attr('src', '');
			// Create loading dialog
			const loadingDialog = window.dialogManager.createNewLoadingDialog('Loading Artefact');
			loadingDialog.show();
			// Get and show artefact data
			$.get(`/artefact/${artefactId}`, (artefact) => {
				loadingDialog.hideAndRemove();
				dialogViewArtefact.show();
				// Get image url
				let imageUrl = '';
				let imageFilename = '';
				if (artefact.images.item) {
					imageUrl = artefact.images.item.url;
					imageFilename = artefact.images.item.filename;
				}

				// Set fields
				$('#ArtefactViewName').html(artefact.name);
				$('#ArtefactViewDescription').html(artefact.description);
				$('#ArtefactViewImage').attr('src', imageUrl);
				// Set edit button action
				$('#ArtefactViewButtonEdit').off('click');
				$('#ArtefactViewButtonEdit').on('click', () => {
					dialogViewArtefact.hide();
					// Show edit artefact dialog
					const dialogEditArtefact = document.getElementById('DialogEditArtefact');
					$('#EditArtefactId').val(artefact._id);
					$('#EditArtefactName').val(artefact.name);
					$('#EditArtefactDescription').val(artefact.description);
					$('#EditArtefactImageName').val(imageFilename);
					$('#EditArtefactDeleteId').val(artefact._id);
					dialogEditArtefact.show();
				});
			}).fail((err) => {
				loadingDialog.hideAndRemove();
				const errorDialog = window.dialogManager.createNewErrorDialog(`
					Could not load information for artefact.
				`);

				errorDialog.show();
			});
		}
	});
});
