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
});
