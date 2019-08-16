window.dialogManager = {
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

		// Create dialog functions
		dialog.show = () => {
			dialog.style.visibility = undefined;
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
				dialog.remove();
			}, 500);
		};

		return dialog;
	},

	createNewLoadingDialog(loadingText) {
		return this.createNewDialog(`<p>${loadingText}</p>`);
	},
};
