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

		// Setup dialog cancels
		if (dialog.getAttribute('data-dialog-cancelable')) {
			// Close dialog on background click
			$(dialog).find('.dialog-background').on('click', () => {
				dialog.hide();
			});

			const closeButton = $(
				'<button class="button-icon dialog-button-close">'
				+ '<i class="material-icons">close</i>'
				+ '</button>',
			);

			$(closeButton).on('click', () => {
				dialog.hide();
			});

			$(dialog).find('.dialog-content').prepend(closeButton);
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
		const dialog = this.createNewDialog(`<p class="dialog-body-text">${loadingText}</p>`);
		dialog.classList.add('dialog-small');
		return dialog;
	},
};

// Setup existing dialogs
$(() => {
	$('.dialog').each((i, el) => {
		window.dialogManager.setupDialog(el);
	});
});
