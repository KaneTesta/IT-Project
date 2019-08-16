const dialogManager = {
    createNewDialog: function (dialogHTML) {
        // Create dialog
        let dialog = document.createElement("div");
        dialog.classList.add("dialog");
        document.body.appendChild(dialog);
        // Create background
        let dialogBackground = document.createElement("div");
        dialogBackground.classList.add("dialog-background");
        dialog.appendChild(dialogBackground);
        // Create content
        let dialogContent = document.createElement("div");
        dialogContent.classList.add("dialog-content");
        dialogContent.innerHTML = dialogHTML;
        dialog.appendChild(dialogContent);

        // Create dialog functions
        dialog.show = function () {
            dialog.style.visibility = undefined;
            setTimeout(function () {
                dialog.classList.add("visible");
            }, 50);
        };

        dialog.hide = function () {
            dialog.classList.remove("visible");
            setTimeout(function () {
                dialog.style.visibility = "hidden";
            }, 500);
        };

        dialog.hideAndRemove = function () {
            dialog.classList.remove("visible");
            setTimeout(function () {
                dialog.remove();
            }, 500);
        };

        return dialog;
    },

    createNewLoadingDialog: function (loadingText) {
        return this.createNewDialog("<p>" + loadingText + "</p>");
    }
};