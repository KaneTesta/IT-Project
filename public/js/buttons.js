$(function () {
    // Setup post buttons
    $("[data-post]").each(function () {
        let $button = $(this);
        let postUrl = $button.attr("data-post");
        // Post and reload on click
        $button.on('click', function () {
            $button.addClass("loading");
            $.post(postUrl, null, function (data) {
                window.location.reload();
                $button.removeClass("loading");
            });
        });
    });
});