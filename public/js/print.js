$(() => {
	// Setup add artefact button
	$('#PageButtonAddArtefact').on('click', (e) => {
		// Show add artefact dialog
		const dialogAddArtefact = document.getElementById('DialogAddArtefact');
		if (dialogAddArtefact) {
			dialogAddArtefact.show();
		}
	});

	/**
	 * Create a jQuery DOM element for a chip, based on an image url and text
	 * @param {*} image The url for the image of the chip
	 * @param {*} text The text to show in the chip
	 */
	function createChip(image, text) {
		return $(`
			<div class="chip">
				<img class="chip-image"
					src='${image}'
					alt='${text}' />
				<span class="chip-text">
					${text}
				</span>
			</div>
		`);
	}

	// Setup view artefact buttons
	$('.dashboard-artefact').on('click', (e) => {
		const $button = $(e.target);
		const artefactId = $button.attr('data-artefact-id');
		// Show view artefact dialog
		const dialogViewArtefact = document.getElementById('DialogViewArtefact');
		if (dialogViewArtefact && artefactId) {
			// Reset all view artefact dialog properties
			$('#ArtefactViewName').html('');
			$('#ArtefactViewDescription').html('');
			$('#ArtefactViewImage').attr('src', '');
			$('#ArtefactViewImage').attr('alt', '');
			$('#ArtefactViewOwnerImage').attr('src', '');
			$('#ArtefactViewOwnerImage').attr('alt', '');
			$('#ArtefactViewOwnerText').html('');
			$('#ArtefactViewViewersContainer').css('display', 'none');
			$('#ArtefactViewViewers').html('');
			$('#ArtefactViewEditPanel').css('display', 'none');
			// Create loading dialog
			const loadingDialog = window.dialogManager.createNewLoadingDialog('Loading Artefact');
			loadingDialog.show();
			// Get and show artefact data
			$.get(`/artefact/${artefactId}`, (artefact) => {
				loadingDialog.hideAndRemove();
				dialogViewArtefact.show();
				// Get image url and filename
				let imageUrl = '';
				let imageFilename = '';
				if (artefact.images && artefact.images.item) {
					imageUrl = artefact.images.item.url;
					imageFilename = artefact.images.item.filename;
				}

				// Set fields to match artefact properties
				$('#ArtefactViewName').html(artefact.name);
				$('#ArtefactViewDescription').html(artefact.description);
				$('#ArtefactViewImage').attr('src', imageUrl);
				$('#ArtefactViewImage').attr('alt', imageFilename);
				$('#ArtefactViewOwnerImage').attr('src', artefact.owner.display_picture);
				$('#ArtefactViewOwnerImage').attr('alt', artefact.owner.display_name);
				$('#ArtefactViewOwnerText').html(artefact.owner.display_name);
				$('#ArtefactViewEditPanel').css('display', artefact.isOwner ? '' : 'none');
				// Add viewer chips
				$('#AddViewersShareId').val(artefact._id);
				$('#AddViewersShareName').html(artefact.name);
				if (artefact.viewers && artefact.viewers.length > 0) {
					$('#ArtefactViewViewersContainer').css('display', '');
					artefact.viewers.forEach((viewer) => {
						// Create and add a viewer chip to the dialog
						const chipImage = viewer.display_picture;
						const chipName = viewer.display_name;
						$('#ArtefactViewViewers').append(createChip(chipImage, chipName));
					});
				}


			}).fail((jqXHR, err, data) => {
				loadingDialog.hideAndRemove();
				// Show error dialog
				const errorDialog = window.dialogManager.createNewErrorDialog(`
					Could not load information for artefact.
				`);

				errorDialog.show();
			});
		}
	});
});
