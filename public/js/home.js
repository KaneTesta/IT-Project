$(function () {
    const $main = $("#HomeMain");
    // Get anchors
    let anchors = [];
    $("[data-menuanchor]").each((i, el) => {
        let $menuAnchor = $(el);
        anchors.push($menuAnchor.attr('data-menuanchor'));
    })

    // Configure fullpage.js
    $main.fullpage({
        menu: '#NavigationSidebar',
        anchors: anchors,

        scrollingSpeed: 500,
        responsiveWidth: 600,

        onLeave: () => {
            // Remove focus from all navigation
            $("#NavigationSidebar").find("a").blur();
        }
    });
});