$(() => {
	// Setup delete user button to show confirmation dialog
	$('#DropdownUserButtonDelete').on('click', () => {
		window.dialogManager.createNewConfirmationDialog('Delete User',
			'Are you sure you want to delete this user? This action can\'t be undone.',
			'<a class="button button-error dialog-action" href="/auth/delete/">Delete User</a>').show();
	});
});
