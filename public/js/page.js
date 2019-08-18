$(() => {
	// Setup manage page button
	$('#PageButtonManagePage').on('click', (e) => {
		// Show manage page dialog
		const dialogManagePage = document.getElementById('DialogManagePage');
		if (dialogManagePage) {
			dialogManagePage.show();
		}
	});

	// Setup add item button
	$('#PageButtonAddItem').on('click', (e) => {
		// Show add item dialog
		const dialogAddItem = document.getElementById('DialogAddItem');
		if (dialogAddItem) {
			dialogAddItem.show();
		}
	});

	// Setup view item buttons
	$('.page-item').on('click', (e) => {
		const $button = $(e.target);
		const pageId = $button.attr('data-page-id');
		const itemId = $button.attr('data-item-id');
		// Show view item dialog
		const dialogViewItem = document.getElementById('DialogViewItem');
		if (dialogViewItem && pageId && itemId) {
			$('#ItemViewName').html('');
			$('#ItemViewDescription').html('');
			// Create loading dialog
			const loadingDialog = window.dialogManager.createNewLoadingDialog('Loading Item');
			loadingDialog.show();
			// Get and show item data
			$.get(`/page/${pageId}/item/${itemId}`, (data) => {
				loadingDialog.hideAndRemove();
				dialogViewItem.show();
				// Set fields
				const item = JSON.parse(data);
				$('#ItemViewName').html(item.name);
				$('#ItemViewDescription').html(item.description);
				// Set edit button action
				$('#ItemViewButtonEdit').off('click');
				$('#ItemViewButtonEdit').on('click', () => {
					dialogViewItem.hide();
					// Show edit item dialog
					const dialogEditItem = document.getElementById('DialogEditItem');
					$("#EditItemId").val(item._id);
					$("#EditItemName").val(item.name);
					$("#EditItemDescription").val(item.description);
					dialogEditItem.show();
				});
			}).fail(() => {
				loadingDialog.hideAndRemove();
				const errorDialog = window.dialogManager.createNewErrorDialog('Could not load information for item');
				errorDialog.show();
			});
		}
	});
});
