$(() => {
	// Setup form submit buttons
	$('form[method="post"]').each((i, el) => {
		const $form = $(el);
		// Post and reload on click
		$form.on('submit', () => {
			const postText = $form.attr('data-post-text');
			if (postText) {
				// Create dialog
				const dialogText = postText;
				const dialog = window.dialogManager.createNewLoadingDialog(dialogText);
				dialog.show();
			}
		});
	});

	// Setup file upload buttons, by looking for elements with a 'data-file-description' attribute
	$('[data-file-description]').each((i, el) => {
		const $fileButton = $(el);
		$fileButton.on('change', (e) => {
			// Get image name
			let imageName = null;
			if (e.target && e.target.files && e.target.files.length > 0) {
				imageName = e.target.files[0].name;
			}

			// Get id of image description input
			const imageDescriptionId = $fileButton.attr('data-file-description');
			// Set image name
			if (imageName && imageDescriptionId) {
				$(`#${imageDescriptionId}`).val(imageName);
			}
		});
	});
});
