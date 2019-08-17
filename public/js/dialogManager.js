window.dialogManager = {
	/**
	 * Add show(), hide(), and hideAndRemove() functions to a dialog element
	 * @param {HTMLElement} dialog The dialog to add functions to
	 */
	setupDialog(dialog) {
		dialog.style.visibility = 'hidden';
		// Create dialog functions
		dialog.show = () => {
			dialog.style.visibility = '';
			setTimeout(() => {
				dialog.classList.add('visible');
			}, 50);
		};

		dialog.hide = () => {
			dialog.classList.remove('visible');
			setTimeout(() => {
				dialog.style.visibility = 'hidden';
			}, 500);
		};

		dialog.hideAndRemove = () => {
			dialog.classList.remove('visible');
			setTimeout(() => {
				dialog.style.visibility = 'hidden';
				dialog.remove();
			}, 500);
		};

		// Close dialog on background click
		if (dialog.getAttribute('data-dialog-cancelable')) {
			$(dialog).find('.dialog-background').on('click', () => {
				dialog.hide();
			});
		}
	},

	/**
	 * Create a dialog from HTML content
	 * @param {String} dialogHTML The HTML to add to the inner dialog content
	 */
	createNewDialog(dialogHTML) {
		// Create dialog
		const dialog = document.createElement('div');
		dialog.classList.add('dialog');
		document.body.appendChild(dialog);
		// Create background
		const dialogBackground = document.createElement('div');
		dialogBackground.classList.add('dialog-background');
		dialog.appendChild(dialogBackground);
		// Create content
		const dialogContent = document.createElement('div');
		dialogContent.classList.add('dialog-content');
		dialogContent.innerHTML = dialogHTML;
		dialog.appendChild(dialogContent);

		// Setup dialog functions
		this.setupDialog(dialog);
		return dialog;
	},

	/**
	 * Create a loading dialog with given text
	 * @param {String} loadingText The text to display while loading
	 */
	createNewLoadingDialog(loadingText) {
		return this.createNewDialog(`<p>${loadingText}</p>`);
	},
};

// Setup existing dialogs
$(() => {
	$('.dialog').each((i, el) => {
		window.dialogManager.setupDialog(el);
	});
});
