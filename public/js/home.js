$(() => {
	const $main = $('#HomeMain');
	// Get anchors
	const anchors = [];
	$('[data-menuanchor]').each((i, el) => {
		const $menuAnchor = $(el);
		anchors.push($menuAnchor.attr('data-menuanchor'));
	});

	// Configure fullpage.js
	$main.fullpage({
		menu: '#NavigationSidebar',
		anchors,

		scrollingSpeed: 500,
		responsiveWidth: 600,

		onLeave: () => {
			// Remove focus from all navigation
			$('#NavigationSidebar').find('a').blur();
		},
	});
});
