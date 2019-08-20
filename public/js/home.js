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
		verticalCentered: true,
		scrollOverflow: true,
		scrollOverflowOptions: {
			click: true,
			submit: true,
		},

		paddingTop: '3rem',
		paddingBottom: '3rem',

		navigation: true,
		menu: '#NavigationSidebar',
		lockAnchors: false,
		anchors,

		scrollingSpeed: 500,
		responsiveWidth: 601,

		onLeave: () => {
			// Remove focus from all navigation
			$('#NavigationSidebar').find('a').blur();
		},
	});
});
