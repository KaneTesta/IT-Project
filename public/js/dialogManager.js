window.dialogManager = {
	/**
	 * Add show(), hide(), and hideAndRemove() functions to a dialog element
	 * @param {HTMLElement} dialog The dialog to add functions to
	 */
	setupDialog(dialog) {
		dialog.setAttribute('role', 'dialog');
		dialog.setAttribute('tabIndex', '-1');
		dialog.style.visibility = 'hidden';
		// Create dialog functions
		dialog.show = () => {
			dialog.style.visibility = '';
			setTimeout(() => {
				dialog.classList.add('visible');
			}, 50);

			// Focus on first input element
			$(dialog).find('input, textarea, .button').eq(0).focus();
		};

		dialog.hideAndRemove = () => {
			dialog.classList.remove('visible');
			setTimeout(() => {
				dialog.style.visibility = 'hidden';
				dialog.remove();
			}, 500);
		};

		dialog.hide = () => {
			if (dialog.getAttribute('data-dialog-destroy-close')) {
				dialog.hideAndRemove();
			} else {
				dialog.classList.remove('visible');
				setTimeout(() => {
					dialog.style.visibility = 'hidden';
				}, 500);
			}
		};

		// Setup dialog cancels
		if (dialog.getAttribute('data-dialog-cancelable')) {
			// Close dialog on background click
			$(dialog).find('.dialog-background').on('click', () => {
				dialog.hide();
			});

			const closeButton = $(
				'<button class="button-icon dialog-button-close">'
				+ '<i class="material-icons-outlined">close</i>'
				+ '</button>',
			);

			$(closeButton).on('click', () => {
				dialog.hide();
			});

			$(dialog).find('.dialog-content').prepend(closeButton);

			// Setup close on escape press
			$(document).keydown((e) => {
				if (e.key === 'Escape') {
					dialog.hide();
				}
			});
		}

		$(document).focusin((e) => {
			if (dialog.classList.contains('visible')) {
				console.log(dialog.contains(e.target));
				if (e && e.target && !dialog.contains(e.target)) {
					e.preventDefault();
					e.stopPropagation();
					dialog.focus();
				}
			}
		});
	},

	/**
	 * Create a dialog from HTML content
	 * @param {String} dialogHTML The HTML to add to the inner dialog content
	 */
	createNewDialog(dialogHTML, destroyOnClose, cancelable) {
		// Create dialog
		const dialog = document.createElement('div');
		dialog.classList.add('dialog');
		if (cancelable) {
			dialog.setAttribute('data-dialog-cancelable', cancelable);
		}

		if (destroyOnClose) {
			dialog.setAttribute('data-dialog-destroy-close', destroyOnClose);
		}

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
		const dialog = this.createNewDialog(`<p class="dialog-body-text">${loadingText}</p>`, true);
		dialog.classList.add('dialog-small');
		return dialog;
	},

	/**
	 * Create a loading dialog with given text
	 * @param {String} errorText The text to display while loading
	 */
	createNewErrorDialog(errorText) {
		const dialog = this.createNewDialog(`
		<h1 class='dialog-heading'>Error</h1>
		<p class="dialog-body-text">${errorText}</p>
		`, true, true);

		return dialog;
	},
};

// Setup existing dialogs
$(() => {
	$('.dialog').each((i, el) => {
		window.dialogManager.setupDialog(el);
	});
});
