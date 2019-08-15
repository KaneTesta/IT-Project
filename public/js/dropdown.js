$(function () {
    // Setup dropdown buttons
    $("[data-dropdown]").each(function () {
        let $button = $(this);
        // Setup dropdown
        let dropdownId = $button.attr("data-dropdown");
        let $dropdown = $("#" + dropdownId);
        $dropdown.css("visibility", "hidden");
        // Setup on click
        $button.on('click', function () {
            if ($dropdown.hasClass("visible")) {
                $dropdown.removeClass("visible");
                setTimeout(function () {
                    if (!$dropdown.hasClass("visible")) {
                        $dropdown.css("visibility", "hidden");
                    }
                }, 200);
            } else {
                $dropdown.addClass("visible");
                $dropdown.css("visibility", "");
            }
        });
    });

    // Close dropdowns on window click
    window.onclick = function (event) {
        let $target = $(event.target);
        if ($target && !$target.attr("data-dropdown")) {
            $("[data-dropdown]").each(function () {
                let $button = $(this);
                // Find dropdown
                let dropdownId = $button.attr("data-dropdown");
                let $dropdown = $("#" + dropdownId);
                $dropdown.removeClass("visible");
                setTimeout(function () {
                    if (!$dropdown.hasClass("visible")) {
                        $dropdown.css("visibility", "hidden");
                    }
                }, 200);
            });
        }
    }
});