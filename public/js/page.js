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
});
