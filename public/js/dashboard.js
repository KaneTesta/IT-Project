$(() => {
	// Setup add page button
	$('#DashboardButtonAddPage').on('click', (e) => {
		// Show add page dialog
		const dialogAddPage = document.getElementById('DialogAddPage');
		if (dialogAddPage) {
			dialogAddPage.show();
		}
	});
});
