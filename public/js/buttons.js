$(() => {
	// Setup post buttons
	$('[data-post]').each(() => {
		const $button = $(this);
		const postUrl = $button.attr('data-post');
		// Post and reload on click
		$button.on('click', () => {
			$button.addClass('loading');
			// Create dialog
			const dialogText = $button.attr('data-post-text') || '';
			const dialog = window.dialogManager.createNewLoadingDialog(dialogText);
			dialog.show();

			$.post(postUrl, null, () => {
				$button.removeClass('loading');
				// Reload page, or hide the dialog, depending on button
				if ($button.attr('data-post-reload')) {
					window.location.reload();
				} else {
					dialog.hideAndRemove();
				}
			});
		});
	});
});
