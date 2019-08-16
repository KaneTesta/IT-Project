$(function () {
    // Setup post buttons
    $("[data-post]").each(function () {
        let $button = $(this);
        let postUrl = $button.attr("data-post");
        // Post and reload on click
        $button.on('click', function () {
            $button.addClass("loading");
            // Create dialog
            let dialogText = $button.attr("data-post-text") || "";
            let dialog = dialogManager.createNewLoadingDialog(dialogText);
            dialog.show();

            $.post(postUrl, null, function (data) {
                $button.removeClass("loading");
                // Reload page, or hide the dialog, depending on button
                if ($button.attr("data-post-reload")) {
                    window.location.reload();
                } else {
                    dialog.hideAndRemove();
                }
            });
        });
    });
});